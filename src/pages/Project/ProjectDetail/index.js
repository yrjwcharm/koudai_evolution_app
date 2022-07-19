/*
 * @Date: 2022-07-16 13:05:43
 * @Description: 计划详情页
 */
import React, {useCallback, useRef, useState} from 'react';
import {Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {WebView} from 'react-native-webview';
import shareFund from '~/assets/img/icon/shareFund.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {BottomModal, ShareModal} from '~/components/Modal';
import Toast from '~/components/Toast';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import Storage from '~/utils/storage';
import {getPageData} from './services';
import {SERVER_URL} from '~/services/config';
import URI from 'urijs';
import {useFocusEffect} from '@react-navigation/native';

export default ({navigation, route}) => {
    const jump = useJump();
    const {project_id = 1} = route.params;
    const bottomModal = useRef();
    const shareModal = useRef();
    const webview = useRef();
    const clickRef = useRef(true);
    const timeStamp = useRef(Date.now());
    const playTime = useRef();
    const [data, setData] = useState({});
    const {bottom_btns: {icon_btns = [], simple_btns = []} = {}, share_button: {share_info} = {}} = data;

    const init = () => {
        getPageData({project_id}).then((res) => {
            if (res.code === '000000') {
                const {share_button, title} = res.result;
                navigation.setOptions({
                    headerRight: () =>
                        share_button.show ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    global.LogTool({ctrl: project_id, event: 'share_click'});
                                    shareModal.current?.show();
                                }}
                                style={{marginRight: px(12)}}>
                                <Image source={shareFund} style={styles.shareFund} />
                            </TouchableOpacity>
                        ) : null,
                    title: title || '计划详情',
                });
                setData(res.result);
            }
        });
    };

    const onMessage = (event) => {
        const _data = event.nativeEvent.data;
        console.log('RN端接收到消息，消息内容=' + event.nativeEvent.data);
        if (_data?.indexOf('logParams=') > -1) {
            const logParams = JSON.parse(_data?.split('logParams=')[1] || []);
            global.LogTool(...logParams);
        } else if (_data && _data.indexOf('url=') > -1) {
            const url = JSON.parse(_data.split('url=')[1]);
            jump(url);
        } else if (_data?.indexOf('playTime=')) {
            playTime.current = parseInt(_data.split('playTime=')[1], 10);
        } else if (_data && _data.indexOf('https') <= -1) {
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
        const {event_id, url} = btn;
        const logParams = {ctrl: project_id, event: event_id};
        global.LogTool(logParams);
        if (event_id === 'consult_click') {
            bottomModal.current.show();
        } else if (event_id === 'intro_click') {
            jump(url);
        }
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return (
        <View style={styles.container}>
            <ShareModal ref={shareModal} title={share_info?.title} shareContent={share_info || {}} />
            <WebView
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
                    uri: URI(`${SERVER_URL[global.env].H5}/projectDetail/${project_id}`)
                        .addQuery({timeStamp: timeStamp.current})
                        .valueOf(),
                }}
                startInLoadingState
                style={{flex: 1, opacity: 0.9999}}
                textZoom={100}
            />
            {data.bottom_btns ? (
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
                                        global.LogTool({ctrl: project_id, event: event_id});
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
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    bottomBtns: {
        paddingTop: px(12),
        paddingHorizontal: px(12),
        paddingBottom: isIphoneX() ? 34 : px(12),
        backgroundColor: '#fff',
    },
    leftBtns: {
        paddingHorizontal: px(12),
    },
    leftBtnIcon: {
        width: px(28),
        height: px(28),
    },
    leftBtnText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    rightBtns: {
        marginLeft: px(4),
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
});
