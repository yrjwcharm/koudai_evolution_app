/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-09-14 17:21:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-16 18:48:48
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform, ScrollView, Text, Linking} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import Feather from 'react-native-vector-icons/Feather';
import {WebView as RNWebView} from 'react-native-webview';
import Loading from '../../Portfolio/components/PageLoading';
import {deviceHeight, isIphoneX, px} from '~/utils/appUtil';
import Storage from '~/utils/storage';
import Html from '~/components/RenderHtml';
import {BottomModal} from '~/components/Modal';
import {useFocusEffect} from '@react-navigation/native';
import http from '~/services';
import URI from 'urijs';
import BottomDesc from '~/components/BottomDesc';
import {Colors, Space, Style} from '~/common/commonStyle';
import Toast from '~/components/Toast';

const PortFolioDetail = ({navigation, route}) => {
    const jump = useJump();
    const [token, setToken] = useState('');
    const [data, setData] = useState({});
    const [tip, setTip] = useState({});
    const {bottom_btns: {icon_btns = [], simple_btns = []} = {}} = data;
    const [webviewHeight, setHeight] = useState(deviceHeight - 97);

    const webview = useRef(null);
    const bottomModal = useRef();
    const bottomModal2 = useRef();
    const timeStamp = useRef(Date.now());

    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setToken(result?.access_token ? result?.access_token : 'null');
            });
        };
        getToken();
        navigation.setOptions({
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
            headerBackImage: () => {
                return (
                    <Feather
                        name="chevron-left"
                        color={'#fff'}
                        size={px(26)}
                        style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                    />
                );
            },
        });
    }, []);

    const init = () => {
        http.get('/portfolio/buttons/20220914', route?.params?.params).then((res) => {
            if (res.code === '000000') {
                const {title} = res.result;
                navigation.setOptions({
                    title: title || '组合详情',
                });
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
                                    <FastImage source={{uri: sub?.icon}} style={[styles.icon]} />
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

    return (
        <View style={styles.container}>
            <ScrollView
                style={{flex: 1}}
                showsHorizontalScrollIndicator={false}
                scrollIndicatorInsets={{right: 1}}
                scrollEventThrottle={16}
                bounces={false}>
                {token ? (
                    <RNWebView
                        bounces={false}
                        ref={webview}
                        onMessage={(event) => {
                            const data = event.nativeEvent.data;
                            if (data?.indexOf('url=') > -1) {
                                const url = JSON.parse(data.split('url=')[1]);
                                jump(url);
                            } else if (data?.indexOf('tip=') > -1) {
                                const _tip = JSON.parse(data.split('tip=')[1]);
                                setTip(_tip);
                                bottomModal2.current.show();
                            }
                            if (data * 1) {
                                setHeight((prev) => (data * 1 < deviceHeight / 2 ? prev : data * 1));
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
                            // console.log(loginStatus);
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
                                })
                            );
                        }}
                        renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                        startInLoadingState={true}
                        style={{height: webviewHeight, opacity: 0.99}}
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
                <BottomDesc />
            </ScrollView>
            <View style={[Style.flexRow, styles.bottomBtns]}>
                {icon_btns?.map((btn, i) => {
                    const {icon, subs, title} = btn;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={title + i}
                            onPress={() => {}}
                            style={[styles.leftBtn]}>
                            <FastImage source={{uri: icon}} style={styles.leftBtnIcon} />
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
                        const {avail, title, url} = btn;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={avail === 0}
                                key={title + i}
                                onPress={() => {
                                    jump(url);
                                }}
                                style={[
                                    Style.flexCenter,
                                    styles.rightBtn,
                                    {backgroundColor: avail === 0 ? '#ddd' : Colors.brandColor},
                                ]}>
                                <Text style={[styles.rightBtnText]}>{title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            <BottomModal ref={bottomModal2} title={tip?.title}>
                <View style={[{padding: px(16)}]}>
                    {tip?.content?.map?.((item, index) => {
                        return (
                            <View key={item + index} style={{marginTop: index === 0 ? 0 : px(16)}}>
                                {item.key ? <Text style={styles.tipTitle}>{item.key}:</Text> : null}
                                <Html style={{lineHeight: px(18), fontSize: px(13)}} html={item.val} />
                            </View>
                        );
                    })}
                </View>
            </BottomModal>
        </View>
    );
};

export default PortFolioDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    shareFund: {
        width: px(24),
        height: px(24),
    },
    leftBtnIcon: {
        width: px(20),
        height: px(20),
    },
    bottomBtns: {
        paddingTop: Space.padding,
        paddingHorizontal: px(16),
        paddingBottom: isIphoneX() ? 34 : Space.padding,
        backgroundColor: '#fff',
    },
    leftBtn: {
        justifyContent: 'center',
        marginRight: px(24),
    },
    leftBtnText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#3D3D3D',
        marginTop: px(4),
        textAlign: 'center',
    },
    rightBtns: {
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
        fontSize: px(16),
        lineHeight: px(22),
        color: '#fff',
    },
    tipTitle: {
        fontWeight: 'bold',
        lineHeight: px(20),
        fontSize: px(14),
        marginBottom: px(4),
    },
});
