import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity, TextInput, DeviceEventEmitter} from 'react-native';
import NavBar from '~/components/NavBar';
import {isIphoneX, px} from '~/utils/appUtil';
import {WebView as RNWebView} from 'react-native-webview';
import Storage from '~/utils/storage';
import http from '~/services';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '~/components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import URI from 'urijs';
import {Style} from '~/common/commonStyle';
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

    const webview = useRef(null);
    const questionModalRef = useRef(null);
    const timeStamp = useRef(Date.now());
    const inputModal = useRef();
    const inputRef = useRef();
    const navBarRef = useRef();
    const clickRef = useRef(true);
    const identifyParams = useRef();

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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (res.code == '000000') {
                inputModal.current.cancel();
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
        inputModal.current.show();
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
        // 滚动到顶部，并且滚动时禁止点击
        webview.current.injectJavaScript(
            `document.getElementsByClassName('AppRouter')[0].children[0].style.pointerEvents = 'none';document.getElementById('tab-products').click();`
        );
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                webview.current.injectJavaScript(
                    `document.getElementsByClassName('AppRouter')[0].children[0].style.pointerEvents = 'auto'`
                );
            }, 500);
        });
    }, []);

    const timer = useRef();

    const handlerIdentify = useCallback(async (done) => {
        // 通知h5发送params
        webview.current.postMessage(JSON.stringify({action: 'getIdentifyParams'}));
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
        http.get('products/subject/ocr_btn/20220901', _identifyParams).then((res) => {
            done();
            if (res.code === '000000') {
                jump(res.result.buy_url);
            } else {
                Toast.show('识别失败');
            }
        });
    }, []);

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

            {token ? (
                <RNWebView
                    bounces={false}
                    ref={webview}
                    onMessage={(event) => {
                        const data = event.nativeEvent.data;
                        if (data?.indexOf('url=') > -1) {
                            const url = JSON.parse(data.split('url=')[1]);
                            jump(url);
                        } else if (data?.indexOf('scrolling=') > -1) {
                            const _scrolling = JSON.parse(data.split('scrolling=')[1]);
                            setScrolling(_scrolling == 1);
                        } else if (data?.indexOf('logParams=') > -1) {
                            const logParams = JSON.parse(data?.split('logParams=')[1] || []);
                            global.LogTool(logParams);
                        } else if (data?.indexOf('writeComment=') > -1) {
                            writeComment();
                        } else if (data?.indexOf('showTest=') > -1) {
                            const config = JSON.parse(data?.split('showTest=')[1] || []);
                            console.log('config:', config);
                            questionModalRef.current?.show(config);
                        } else if (data?.indexOf('loadEnd') > -1) {
                            // h5加载完毕
                            setWebviewLoadEnd(true);
                        } else if (data?.indexOf('identifyParams=') > -1) {
                            const _identifyParams = JSON.parse(data?.split('identifyParams=')[1] || []);
                            identifyParams.current = _identifyParams;
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
                    onLoadEnd={async (e) => {
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
                    }}
                    renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                    startInLoadingState={true}
                    style={{opacity: 0.9999, flex: 1}}
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
            ) : null}

            {data ? (
                <View style={[styles.footer, Style.flexRow]}>
                    <TouchableOpacity style={styles.footer_content} activeOpacity={0.9} onPress={writeComment}>
                        <Text style={{fontSize: px(12), color: '#9AA0B1'}}>{data?.comment_placeholder}</Text>
                    </TouchableOpacity>
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
                                style={[{alignItems: 'center'}, idx === 0 ? {flex: 1} : {width: px(25)}]}
                                activeOpacity={0.8}
                                key={idx}
                                onPress={() => handlerIconBtnClick(item)}>
                                <FastImage
                                    source={{uri: item.icon}}
                                    style={[styles.actionIcon, {width: px(20), height: px(20), marginBottom: px(4)}]}
                                />
                                <Text
                                    style={{
                                        fontSize: px(11),
                                        lineHeight: px(15),
                                        color: '#3d3d3d',
                                        textAlign: 'center',
                                    }}>
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
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
        width: px(255),
        paddingLeft: px(16),
        justifyContent: 'center',
    },
    button: {
        marginLeft: px(7),
        borderRadius: px(18),
        width: px(80),
        height: px(36),
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
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
