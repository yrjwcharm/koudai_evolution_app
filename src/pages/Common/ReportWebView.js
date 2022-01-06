/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-06 18:12:31
 * @Description:webview
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Platform, BackHandler, Linking, ActivityIndicator} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {WebView as RNWebView} from 'react-native-webview';
import {useFocusEffect} from '@react-navigation/native';
import Storage from '../../utils/storage';
import NavBar from '../../components/NavBar';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
import {Style} from '../../common/commonStyle';
import {deviceHeight} from '../../utils/appUtil';
import Loading from '../Portfolio/components/PageLoading';
import {ShareModal} from '../../components/Modal';
import http from '../../services';

export default function WebView({route, navigation}) {
    const jump = useJump();
    const webview = useRef(null);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [data, setData] = useState();
    const [backButtonEnabled, setBackButtonEnabled] = useState(false);
    const timeStamp = useRef(Date.now());
    const shareModal = useRef(null);
    const image =
        'https://lcmf.oss-cn-hangzhou.aliyuncs.com/invite/share/20220106/bg/jianchi.jpg?x-oss-process=image%2Fauto-orient%2C1%2Fformat%2Cjpg%2Fwatermark%2Cg_se%2Cimage_aW52aXRlL3NoYXJlLzIwMjIwMTA2L3FyY29kZS90ZXN0LzEwMTAwMDY0MjUuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTM1LGhfMTM1%2Cx_108%2Cy_120&OSSAccessKeyId=LTAI51SSQWDG4LDz&Expires=1956823847&Signature=h9SHdxNK7aE3%2F1vZ7iwtb2py0s8%3D';
    useEffect(() => {
        http.get(
            'http://kmapi.huangjianquan.mofanglicai.com.cn:10080/common/webview/info/20220101?scene=annual_report'
        ).then((res) => {
            setData(res.result);
            shareModal?.current?.show();
        });

        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setToken(result?.access_token ? result?.access_token : 'null');
            });
        };
        getToken();
    }, []);
    useEffect(() => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', onBackAndroid);
        }
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackAndroid);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backButtonEnabled]);
    const onNavigationStateChange = (navState) => {
        if (route?.params?.title) {
            setTitle(route?.params?.title);
        } else if (navState.title) {
            setTitle(navState.title);
        }
        setBackButtonEnabled(navState.canGoBack);
    };

    useFocusEffect(
        useCallback(() => {
            // webview.current && webview.current.reload();
            webview.current && webview.current.postMessage(JSON.stringify({action: 'reload'}));
        }, [])
    );

    const onBackAndroid = (e) => {
        if (backButtonEnabled) {
            webview.current.goBack();
            return true;
        } else if (e) {
            navigation.goBack();
        } else {
            return false;
        }
    };
    return (
        <View style={{flex: 1}}>
            <ShareModal
                ctrl={route.params?.link}
                ref={shareModal}
                shareContent={{
                    type: 'image',
                    image: image,
                }}
                more={false}
                title={data?.title}
            />
            <NavBar
                leftIcon="chevron-left"
                title={data?.title_info?.title}
                leftPress={onBackAndroid}
                style={
                    data?.title_info?.title_style == 1 ? {backgroundColor: 'transparent', position: 'absolute'} : null
                }
                titleStyle={data?.title_info?.title_style == 1 ? {color: '#000'} : null}
            />
            {token && route?.params?.link ? (
                <RNWebView
                    bounces={false}
                    ref={webview}
                    onMessage={(event) => {
                        const data = event.nativeEvent.data;
                        console.log('RN端接收到消息，消息内容=' + event.nativeEvent.data);
                        if (data?.indexOf('logParams=') > -1) {
                            //打点
                            const logParams = JSON.parse(data?.split('logParams=')[1] || []);
                            global.LogTool(...logParams);
                        } else if (data && data.indexOf('url=') > -1) {
                            //跳转
                            const url = JSON.parse(data.split('url=')[1]);
                            jump(url);
                        } else if (data && data.indexOf('https') <= -1) {
                            const url = data.split('phone=')[1] ? `tel:${data.split('phone=')[1]}` : '';
                            if (url) {
                                global.LogTool('call');
                                Linking.canOpenURL(url)
                                    .then((supported) => {
                                        if (!supported) {
                                            return Toast.show(
                                                `您的设备不支持该功能，请手动拨打 ${data.split('phone=')[1]}`
                                            );
                                        }
                                        return Linking.openURL(url);
                                    })
                                    .catch((err) => Toast.show(err));
                            }
                        } else if (data && data.indexOf('https') > -1) {
                            //跳转外链
                            jump({type: 2, path: data});
                        }
                    }}
                    originWhitelist={['*']}
                    onHttpError={(syntheticEvent) => {
                        const {nativeEvent} = syntheticEvent;
                        console.warn('WebView received error status code: ', nativeEvent.statusCode);
                    }}
                    onError={(syntheticEvent) => {
                        const {nativeEvent} = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                    }}
                    onShouldStartLoadWithRequest={({url}) => {
                        const isAlipay = url && url.startsWith('alipay'); // 支付宝支付链接为 alipay:// 或 alipays:// 开头
                        const isWxPay = url && url.startsWith('weixin'); // 微信支付链接为 weixin:// 开头
                        const isPay = isAlipay || isWxPay;
                        if (isPay) {
                            // 检测客户端是否有安装支付宝或微信 App
                            Linking.canOpenURL(url).then((supported) => {
                                if (supported) {
                                    Linking.openURL(url); // 使用此方式即可拉起相应的支付 App
                                } else {
                                    Toast.show(`请先安装${isAlipay ? '支付宝' : '微信'}客户端`);
                                }
                            });
                            return false; // 这一步很重要
                        } else {
                            return true;
                        }
                    }}
                    javaScriptEnabled={true}
                    injectedJavaScript={`window.sessionStorage.setItem('token','${token}');`}
                    onLoadEnd={async () => {
                        const loginStatus = await Storage.get('loginStatus');
                        webview.current.postMessage(
                            JSON.stringify({
                                ...loginStatus,
                                did: DeviceInfo.getUniqueId(),
                                timeStamp: timeStamp.current + '',
                                ver: global.ver,
                            })
                        );
                    }}
                    onNavigationStateChange={onNavigationStateChange}
                    renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                    startInLoadingState={true}
                    style={{flex: 1}}
                    source={{
                        // uri: route?.params?.timestamp
                        //     ? `${route.params.link}?timeStamp=${timeStamp.current}`
                        //     : route?.params?.link,
                        uri: 'http://192.168.88.133:3000/PersonalAnnualReport',
                    }}
                    textZoom={100}
                />
            ) : (
                <View style={[Style.flexCenter, {height: deviceHeight}]}>
                    <ActivityIndicator color="#999999" />
                </View>
            )}
        </View>
    );
}
