import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity, TextInput, DeviceEventEmitter} from 'react-native';
import Image from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {compareVersion, isIphoneX, px} from '~/utils/appUtil';
import {WebView as RNWebView} from 'react-native-webview';
import Storage from '~/utils/storage';
import http from '~/services';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '~/components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import URI from 'urijs';
import {Colors, Space, Style} from '~/common/commonStyle';
import FastImage from 'react-native-fast-image';
import {Modal, PageModal} from '~/components/Modal';
import {Button} from '~/components/Button';
import Toast from '~/components/Toast';
import {followAdd, followCancel} from '../Attention/Index/service';
import {publishNewComment} from '../Common/CommentList/services';
import {constants} from '~/components/Modal/util';
import QuestionModal from './QuestionModal';
import IdentifyToTrade from '~/components/IdentifyToTrade';

const SpecialDetail = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState();
    const [token, setToken] = useState('');
    const [content, setContent] = useState('');
    const [scrolling, setScrolling] = useState(false);
    const [webviewLoadEnd, setWebviewLoadEnd] = useState();
    const [floatZIndex, setFloatZIndex] = useState(-1);

    const webview = useRef(null);
    const webview2 = useRef(null);
    const questionModalRef = useRef(null);
    const timeStamp = useRef(Date.now());
    const inputModal = useRef();
    const inputRef = useRef();
    const navBarRef = useRef();
    const clickRef = useRef(true);
    const identifyParams = useRef();
    const prevScrolling = useRef();
    const proTabIndex = useRef(-1);
    const identifyToTrade = useRef();

    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setToken(result?.access_token ? result?.access_token : 'null');
            });
        };
        getToken();
    }, []);

    const init = () => {
        http.get('/products/subject/detail_btn/20220901', route?.params?.params).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    const handlerIconBtnClick = (item) => {
        global.LogTool({event: item.event_id});
        switch (item.event_id) {
            case 'optional':
                if (!clickRef.current) return;
                clickRef.current = false;
                (item?.is_follow ? followCancel : followAdd)({item_id: item.subject_id, item_type: 6}).then((res) => {
                    if (res.code === '000000') {
                        res.message && Toast.show(res.message);
                        setTimeout(() => {
                            clickRef.current = true;
                        }, 100);
                        init();
                    }
                });
                break;
            case 'share':
                DeviceEventEmitter.emit('globalShareShow');
                break;
            default:
                item?.url && jump(item?.url);
        }
    };

    //发布评论
    const publish = () => {
        publishNewComment({
            ...data?.comment_params,
            content,
        }).then((res) => {
            if (res.code === '000000') {
                inputModal.current?.cancel();
                setContent('');
                if (res.result.message) {
                    Modal.show({
                        title: '提示',
                        content: res.result.message,
                    });
                } else {
                    webview.current && webview.current.postMessage(JSON.stringify({action: 'reload'}));
                }
            } else {
                Toast.show(res.message);
            }
        });
    };

    const writeComment = () => {
        if (!data?.commentable) return;
        inputModal.current?.show();
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 100);
    };

    const handleTestSure = () => {
        webview.current?.postMessage(JSON.stringify({action: 'reload'}));
        questionModalRef.current?.hide();
    };
    const handleTestClose = (back) => {
        if (back) {
            navigation.goBack();
        }
        questionModalRef.current?.hide();
    };

    const handlerIdentifyStart = useCallback(async () => {
        let injectJavaScript = `document.getElementById('tab-products').click();`;
        // 同步webview1的tab选中
        if (proTabIndex.current > -1) {
            injectJavaScript += `document.getElementById('prdTabs').children[${proTabIndex.current}].click();`;
        }
        // 滚动到顶部，并且滚动时禁止点击
        webview2.current.injectJavaScript(injectJavaScript);

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                setFloatZIndex(2);
                prevScrolling.current = scrolling;
                setScrolling(true);
            }, 430);
        });
    }, [scrolling]);

    const timer = useRef();

    const handlerIdentify = useCallback(async (done) => {
        // 通知h5发送params
        webview2.current.postMessage(JSON.stringify({action: 'getIdentifyParams'}));
        // 等待接受params
        let _identifyParams = await new Promise((resolve) => {
            timer.current = setInterval(() => {
                if (identifyParams.current) {
                    clearInterval(timer.current);
                    resolve(identifyParams.current);
                }
            }, 200);
        });
        // 获得跳转url
        http.get('products/subject/ocr_btn/20220901', _identifyParams)
            .then((res) => {
                // 故意延时1s
                setTimeout(() => {
                    done();
                    setFloatZIndex(-1);
                    setScrolling(prevScrolling.current);
                    if (res.code === '000000') {
                        jump(res.result.buy_url);
                    } else {
                        Toast.show('识别失败');
                    }
                }, 1000);
            })
            .catch((_) => {
                setFloatZIndex(-1);
                setScrolling(prevScrolling.current);
            });
    }, []);

    const genWebView = (androidHardwareAccelerationDisabled) => {
        return token ? (
            <RNWebView
                bounces={false}
                ref={androidHardwareAccelerationDisabled ? webview2 : webview}
                androidHardwareAccelerationDisabled={androidHardwareAccelerationDisabled}
                onMessage={(event) => {
                    const _data = event.nativeEvent.data;
                    if (_data?.indexOf('url=') > -1) {
                        const url = JSON.parse(_data.split('url=')[1]);
                        jump(url);
                    } else if (_data?.indexOf('scrolling=') > -1) {
                        const _scrolling = JSON.parse(_data.split('scrolling=')[1]);
                        setScrolling(Number(_scrolling) === 1);
                    } else if (_data?.indexOf('logParams=') > -1) {
                        const logParams = JSON.parse(_data?.split('logParams=')[1] || []);
                        global.LogTool(logParams);
                    } else if (_data?.indexOf('writeComment=') > -1) {
                        writeComment();
                    } else if (_data?.indexOf('showTest=') > -1) {
                        const config = JSON.parse(_data?.split('showTest=')[1] || []);
                        console.log('config:', config);
                        questionModalRef.current?.show(config);
                    } else if (_data?.indexOf('loadEnd') > -1) {
                        // h5加载完毕
                        setWebviewLoadEnd(true);
                    } else if (_data?.indexOf('identifyParams=') > -1) {
                        identifyParams.current = JSON.parse(_data?.split('identifyParams=')[1] || []);
                    } else if (_data?.indexOf('proTabIndex=') > -1) {
                        proTabIndex.current = JSON.parse(_data?.split('proTabIndex=')[1] || []);
                    }
                }}
                originWhitelist={['*']}
                onHttpError={(syntheticEvent) => {
                    const {nativeEvent} = syntheticEvent;
                    console.warn('WebView received error status code: ', nativeEvent.statusCode);
                }}
                javaScriptEnabled={true}
                injectedJavaScript={`window.sessionStorage.setItem('token','${token}');`}
                // injectedJavaScriptBeforeContentLoaded={`window.sessionStorage.setItem('token','${token}');`}
                onLoadEnd={async () => {
                    const loginStatus = await Storage.get('loginStatus');
                    // console.log('loginStatus:', loginStatus);
                    const loginStatusStr = JSON.stringify({
                        ...loginStatus,
                        did: global.did,
                        timeStamp: timeStamp.current + '',
                        ver: global.ver,
                        navBarHeight: navBarRef.current.navBarHeight,
                    });
                    webview.current?.injectJavaScript(`localStorage.setItem('loginStatus','${loginStatusStr}')`);
                    webview2.current?.injectJavaScript(`localStorage.setItem('loginStatus','${loginStatusStr}')`);
                    console.log(
                        JSON.stringify({
                            ...loginStatus,
                            did: global.did,
                            timeStamp: timeStamp.current + '',
                            ver: global.ver,
                        })
                    );
                    webview.current.postMessage(
                        JSON.stringify({
                            ...loginStatus,
                            did: global.did,
                            timeStamp: timeStamp.current + '',
                            ver: global.ver,
                            navBarHeight: navBarRef.current.navBarHeight,
                        })
                    );
                    webview2.current.postMessage(
                        JSON.stringify({
                            ...loginStatus,
                            did: global.did,
                            timeStamp: timeStamp.current + '',
                            ver: global.ver,
                            navBarHeight: navBarRef.current.navBarHeight,
                        })
                    );
                }}
                renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                startInLoadingState={true}
                style={{opacity: compareVersion(global.systemVersion, '12') >= 0 ? 0.99 : 0.9999, flex: 1}}
                source={{
                    uri: URI(route.params.link)
                        .addQuery({
                            timeStamp: timeStamp.current,
                            ...route.params.params,
                        })
                        .valueOf(),
                }}
                textZoom={100}
            />
        ) : null;
    };

    useEffect(() => {
        return () => timer.current && clearInterval(timer.current);
    }, []);

    return (
        <View style={styles.container}>
            <NavBar
                ref={navBarRef}
                renderLeft={
                    <Text
                        style={{
                            fontSize: px(18),
                            lineHeight: px(22),
                            marginLeft: px(13),
                            color: scrolling ? '#121D3A' : '#fff',
                        }}>
                        {data?.title}
                    </Text>
                }
                renderRight={
                    <View
                        style={[
                            styles.rightIconWrap,
                            {
                                backgroundColor: scrolling ? '#fff' : 'rgba(0,0,0,0.2)',
                                borderColor: scrolling ? '#E9EAEF' : 'rgba(255,255,255,0.4)',
                            },
                        ]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                DeviceEventEmitter.emit('globalShareShow');
                            }}
                            style={styles.rightIconItemWrap}>
                            <FastImage
                                style={styles.rightIcon}
                                source={{
                                    uri:
                                        'https://static.licaimofang.com/wp-content/uploads/2022/09/more-' +
                                        (scrolling ? 'black' : 'white') +
                                        '.png',
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                navigation.goBack();
                            }}
                            style={[
                                styles.rightIconItemWrap,
                                {
                                    borderLeftWidth: 0.5,
                                    borderLeftColor: scrolling ? '#E9EAEF' : 'rgba(255,255,255,0.5)',
                                },
                            ]}>
                            <FastImage
                                style={styles.rightIcon}
                                source={{
                                    uri:
                                        'https://static.licaimofang.com/wp-content/uploads/2022/10/close-' +
                                        (scrolling ? 'black' : 'white') +
                                        '.png',
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                }
                style={{
                    backgroundColor: scrolling ? '#fff' : 'transparent',
                    position: 'absolute',
                    zIndex: 9,
                }}
            />
            {genWebView()}
            {data?.show_ocr_btn ? (
                <View
                    style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: floatZIndex}}>
                    {genWebView(true)}
                </View>
            ) : null}

            {data ? (
                <View style={[styles.footer, Style.flexRow, {opacity: floatZIndex < 0 ? 1 : 0}]}>
                    {data?.show_comment_placeholder ? (
                        <TouchableOpacity style={styles.footer_content} activeOpacity={0.9} onPress={writeComment}>
                            <Text style={{fontSize: px(12), color: '#9AA0B1'}}>{data.comment_placeholder}</Text>
                        </TouchableOpacity>
                    ) : null}
                    <View
                        style={[
                            {
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            },
                        ]}>
                        {data?.icon_btns?.map?.((item, idx) => (
                            <TouchableOpacity
                                style={[{alignItems: 'center'}, {flex: 1}]}
                                activeOpacity={0.8}
                                key={idx}
                                onPress={() => handlerIconBtnClick(item)}>
                                <FastImage source={{uri: item.icon}} style={styles.actionIcon} />
                                <Text style={styles.actionText}>{item.text}</Text>
                            </TouchableOpacity>
                        ))}
                        {!data?.float_ocr_btn && data?.ocr_btn && data?.show_ocr_btn ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={data?.ocr_btn?.avail === 0}
                                onPress={() => identifyToTrade.current?.handler?.()}
                                style={[
                                    Style.flexCenter,
                                    styles.ocrBtn,
                                    {backgroundColor: data?.ocr_btn?.avail === 0 ? '#CEDDF5' : Colors.brandColor},
                                ]}>
                                <Image source={{uri: data?.ocr_btn?.icon}} style={styles.ocrIcon} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            ) : null}
            <PageModal
                ref={inputModal}
                style={{height: px(360)}}
                backButtonClose={true}
                header={
                    <View style={styles.header}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.title}>写评论</Text>
                        </View>
                        <TouchableOpacity style={styles.close} onPress={inputModal.current?.cancel}>
                            <FastImage
                                style={{width: px(24), height: px(24)}}
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/comment-close.png',
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                }>
                <TextInput
                    ref={inputRef}
                    value={content}
                    multiline={true}
                    style={styles.input}
                    onChangeText={(value) => {
                        setContent(value);
                    }}
                    maxLength={500}
                    textAlignVertical="top"
                    placeholder="我来聊两句..."
                />
                <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                    <View style={Style.flexRow}>
                        <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                            {content.length}/{500}
                        </Text>
                        <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={publish} />
                    </View>
                </View>
            </PageModal>

            <QuestionModal onSure={handleTestSure} onClose={handleTestClose} ref={questionModalRef} />

            {data?.show_ocr_btn && webviewLoadEnd ? (
                <IdentifyToTrade
                    onStart={handlerIdentifyStart}
                    onIdentify={handlerIdentify}
                    onError={() => {
                        setFloatZIndex(-1);
                        setScrolling(prevScrolling.current);
                    }}
                    _ref={identifyToTrade}
                    showFloatIcon={data?.float_ocr_btn}
                    style={{bottom: px(109)}}
                />
            ) : null}
        </View>
    );
};

export default SpecialDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: px(16),
        borderColor: '#DDDDDD',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        paddingTop: px(8),
        paddingBottom: isIphoneX() ? 35 : px(15),
    },
    footer_content: {
        height: px(36),
        backgroundColor: '#F3F5F8',
        borderRadius: px(322),
        width: px(240),
        paddingLeft: px(16),
        justifyContent: 'center',
        marginRight: px(3),
    },
    actionIcon: {
        width: px(20),
        height: px(20),
    },
    actionText: {
        marginTop: px(4),
        fontSize: px(11),
        lineHeight: px(15),
        color: '#3d3d3d',
        textAlign: 'center',
    },
    ocrBtn: {
        marginLeft: px(10),
        borderRadius: Space.borderRadius,
        width: px(190),
        height: px(40),
    },
    ocrIcon: {
        width: px(174),
        height: px(20),
    },
    button: {
        marginLeft: px(7),
        borderRadius: px(18),
        width: px(80),
        height: px(36),
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS === 'ios' ? px(10) : px(16),
        height: px(215),
        fontSize: px(14),
        lineHeight: px(20),
    },
    rightIconWrap: {
        borderRadius: px(19),
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        width: px(90),
        paddingVertical: px(5),
    },
    rightIconItemWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    rightIcon: {
        width: px(20),
        height: px(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
        paddingHorizontal: 20,
    },
    close: {
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirm: {
        position: 'absolute',
        right: 20,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: px(16),
        color: '#333333',
        fontWeight: '700',
    },
});
