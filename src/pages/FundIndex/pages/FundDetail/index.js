/*
 * @Date: 2022-06-28 13:48:18
 * @Description: 基金详情
 */
import React, {useCallback, useRef, useState} from 'react';
import {Linking, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import Image from 'react-native-fast-image';
import {WebView} from 'react-native-webview';
import Feather from 'react-native-vector-icons/Feather';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {useJump} from '~/components/hooks';
import {BottomModal, Modal, ShareModal} from '~/components/Modal';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import {addProduct} from '~/redux/actions/pk/pkProducts';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceHeight, isIphoneX, px} from '~/utils/appUtil';
import Storage from '~/utils/storage';
import {getPageData} from './services';
import {SERVER_URL} from '~/services/config';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import URI from 'urijs';
import {useFocusEffect} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';

const Index = ({navigation, route}) => {
    const dispatch = useDispatch();
    const jump = useJump();
    const headerHeight = useHeaderHeight();
    const {code} = route.params;
    const bottomModal = useRef();
    const shareModal = useRef();
    const webview = useRef();
    const clickRef = useRef(true);
    const timeStamp = useRef(Date.now());
    const playTime = useRef();
    const [data, setData] = useState({});
    const {bottom_btns: {icon_btns = [], simple_btns = []} = {}, share_button: {share_info} = {}} = data;
    const [webviewHeight, setHeight] = useState(deviceHeight - headerHeight);

    const init = () => {
        getPageData({code})
            .then((res) => {
                if (res.code === '000000') {
                    const {title} = res.result;
                    navigation.setOptions({
                        headerBackImage: () => {
                            return (
                                <Feather
                                    name="chevron-left"
                                    size={px(26)}
                                    color="#fff"
                                    style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                                />
                            );
                        },
                        headerStyle: {
                            backgroundColor: '#1E5AE7',
                            shadowOpacity: 0,
                            shadowOffset: {
                                height: 0,
                            },
                            elevation: 0,
                        },
                        headerTitleStyle: {
                            color: '#fff',
                            fontSize: px(18),
                        },
                        title: title || '基金详情',
                    });
                    setData(res.result);
                }
            })
            .finally(() => {
                StatusBar.setBarStyle('light-content');
            });
    };

    const onMessage = (event) => {
        const _data = event.nativeEvent.data;
        // console.log('RN端接收到消息，消息内容=' + event.nativeEvent.data);
        if (_data?.indexOf('height=') > -1) {
            const height = JSON.parse(_data?.split('height=')[1]);
            height && setHeight(height);
        } else if (_data?.indexOf('logParams=') > -1) {
            const logParams = JSON.parse(_data?.split('logParams=')[1] || []);
            global.LogTool(...logParams);
        } else if (_data?.indexOf('url=') > -1) {
            const url = JSON.parse(_data.split('url=')[1]);
            jump(url);
        } else if (_data?.indexOf('playTime=') > -1) {
            playTime.current = parseInt(_data.split('playTime=')[1], 10);
        } else if (_data?.indexOf('modalContent=') > -1) {
            const modalContent = JSON.parse(_data.split('modalContent=')[1]);
            showTips(modalContent);
        } else if (_data?.indexOf('phone=') > -1) {
            const url = _data.split('phone=')[1] ? `tel:${_data.split('phone=')[1]}` : '';
            if (url) {
                global.LogTool('call');
                Linking.canOpenURL(url)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show(`您的设备不支持该功能，请手动拨打 ${_data.split('phone=')[1]}`);
                        }
                        return Linking.openURL(url);
                    })
                    .catch((err) => Toast.show(err));
            }
        }
    };

    /** @name 弹窗展示提示 */
    const showTips = (tips) => {
        const {content, img, title} = tips;
        Modal.show(
            {
                children: (
                    <View style={{padding: Space.padding}}>
                        {img ? <Image source={{uri: img}} style={{width: '100%', height: px(140)}} /> : null}
                        {content?.map((item, index) => {
                            const {key: _key, val} = item;
                            return (
                                <View key={val + index} style={{marginTop: index === 0 ? 0 : Space.marginVertical}}>
                                    {_key ? <HTML html={`${_key}:`} style={styles.title} /> : null}
                                    {val ? (
                                        <View style={{marginTop: px(4)}}>
                                            <HTML html={val} style={styles.tipsVal} />
                                        </View>
                                    ) : null}
                                </View>
                            );
                        })}
                    </View>
                ),
                title,
            },
            'slide'
        );
    };

    // 咨询弹窗内容渲染
    const renderContactContent = (subs = []) => {
        const onPress = (item) => {
            if (item.type === 'im') {
                global.LogTool('im');
                bottomModal.current.hide();
                navigation.navigate('IM');
            } else if (item.type === 'tel') {
                bottomModal.current.hide();
                const url = `tel:${item.sno}`;
                global.LogTool('call');
                Linking.canOpenURL(url)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show(`您的设备不支持该功能，请手动拨打 ${item.sno}`);
                        }
                        return Linking.openURL(url);
                    })
                    .catch((err) => Toast.show(`${err}`));
            }
        };
        return (
            <View style={styles.contactContainer}>
                {subs.map((sub, index) => {
                    return (
                        <View
                            key={index}
                            style={[
                                styles.methodItem,
                                Style.flexRow,
                                index === subs.length - 1 ? {marginBottom: 0} : {},
                            ]}>
                            <View style={[Style.flexRow]}>
                                <View style={[Style.flexCenter, styles.iconBox]}>
                                    <Image source={{uri: sub?.icon}} style={[styles.icon]} />
                                </View>
                                <View>
                                    <Text style={[styles.methodTitle]}>{sub?.title}</Text>
                                    <Text style={[styles.methodDesc]}>{sub?.desc}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[Style.flexCenter, styles.methodBtn]}
                                activeOpacity={0.8}
                                onPress={() => onPress(sub)}>
                                {sub?.btn?.title && <Text style={styles.methodBtnText}>{sub?.btn?.title}</Text>}
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
    };

    const onPressLeftBtns = (btn) => {
        if (!clickRef.current) {
            return false;
        }
        const {event_id, is_follow, url} = btn;
        const logParams = {event: event_id, oid: code};
        event_id === 'optional' && (logParams.ctrl = is_follow ? 'cancel' : 'add');
        global.LogTool(logParams);
        if (event_id === 'consult_click') {
            bottomModal.current.show();
        } else if (event_id === 'optional') {
            clickRef.current = false;
            (is_follow ? followCancel : followAdd)({item_id: code, item_type: 1}).then((res) => {
                if (res.code === '000000') {
                    res.message && Toast.show(res.message);
                    setTimeout(() => {
                        clickRef.current = true;
                    }, 100);
                    init();
                }
            });
        } else if (event_id === 'pk_click') {
            dispatch(addProduct(code));
            jump(url);
        } else {
            jump(url);
        }
    };

    useFocusEffect(
        useCallback(() => {
            init();
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return (
        <View style={styles.container}>
            <ShareModal ref={shareModal} title={share_info?.title} shareContent={share_info || {}} />
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <View style={{height: webviewHeight}}>
                    <WebView
                        allowsFullscreenVideo
                        bounces={false}
                        javaScriptEnabled
                        onError={(syntheticEvent) => {
                            const {nativeEvent} = syntheticEvent;
                            console.warn('WebView error: ', nativeEvent);
                        }}
                        onHttpError={(syntheticEvent) => {
                            const {nativeEvent} = syntheticEvent;
                            console.warn('WebView received error status code: ', nativeEvent.statusCode);
                        }}
                        onLoadEnd={async () => {
                            const loginStatus = await Storage.get('loginStatus');
                            // console.log(loginStatus);
                            webview.current.postMessage(
                                JSON.stringify({
                                    ...loginStatus,
                                    did: global.did,
                                    timeStamp: timeStamp.current + '',
                                    ver: global.ver,
                                })
                            );
                        }}
                        onMessage={onMessage}
                        originWhitelist={['*']}
                        ref={webview}
                        renderLoading={Platform.select({android: () => <Loading />, ios: undefined})}
                        source={{
                            uri: URI(`${SERVER_URL[global.env].H5}/fundDetail/${code}`)
                                .addQuery({timeStamp: timeStamp.current})
                                .valueOf(),
                        }}
                        startInLoadingState
                        style={{flex: 1, opacity: 0.9999}}
                        textZoom={100}
                    />
                </View>
                <BottomDesc />
            </ScrollView>
            <View style={[Style.flexRow, styles.bottomBtns]}>
                {icon_btns?.map((btn, i) => {
                    const {icon, subs, title} = btn;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={title + i}
                            onPress={() => onPressLeftBtns(btn)}
                            style={[Style.flexCenter, styles.leftBtns]}>
                            <Image source={{uri: icon}} style={styles.leftBtnIcon} />
                            <Text style={styles.leftBtnText}>{title}</Text>
                            {subs?.length > 0 && (
                                <BottomModal
                                    title={'选择咨询方式'}
                                    ref={bottomModal}
                                    children={renderContactContent(subs)}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
                <View style={[Style.flexRow, styles.rightBtns]}>
                    {simple_btns?.map((btn, i, arr) => {
                        const {avail, event_id, text, url} = btn;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={avail === 0}
                                key={text + i}
                                onPress={() => {
                                    global.LogTool({event: event_id, oid: code});
                                    jump(url);
                                }}
                                style={[
                                    Style.flexCenter,
                                    styles.rightBtn,
                                    i === 0 ? {backgroundColor: avail === 0 ? '#ddd' : '#E6F0FF'} : {},
                                    i === arr.length - 1
                                        ? {backgroundColor: avail === 0 ? '#ddd' : Colors.brandColor}
                                        : {},
                                ]}>
                                <Text
                                    style={[
                                        styles.rightBtnText,
                                        i === 0 ? {color: avail === 0 ? '#fff' : Colors.brandColor} : {},
                                        i === arr.length - 1 ? {color: '#fff'} : {},
                                    ]}>
                                    {text}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    shareFund: {
        width: px(24),
        height: px(24),
    },
    bottomBtns: {
        paddingTop: Space.padding,
        paddingHorizontal: px(12),
        paddingBottom: isIphoneX() ? 34 : Space.padding,
        backgroundColor: '#fff',
    },
    leftBtns: {
        paddingHorizontal: px(12),
    },
    leftBtnIcon: {
        width: px(20),
        height: px(20),
    },
    leftBtnText: {
        marginTop: px(4),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    rightBtns: {
        marginLeft: px(12),
        borderRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
        overflow: 'hidden',
    },
    rightBtn: {
        flex: 1,
        height: '100%',
    },
    rightBtnText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        fontWeight: Font.weightMedium,
    },
    contactContainer: {
        paddingTop: px(28),
        paddingHorizontal: px(20),
    },
    methodItem: {
        marginBottom: px(34),
        justifyContent: 'space-between',
    },
    iconBox: {
        marginRight: px(12),
    },
    icon: {
        width: px(40),
        height: px(40),
    },
    methodTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: '600',
        marginBottom: px(6),
    },
    methodDesc: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightGrayColor,
    },
    methodBtn: {
        borderRadius: px(6),
        borderWidth: Space.borderWidth,
        borderColor: Colors.descColor,
        borderStyle: 'solid',
        paddingVertical: px(8),
        paddingHorizontal: px(12),
    },
    methodBtnText: {
        fontSize: Font.textH3,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    tipsVal: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
});

export default Index;
