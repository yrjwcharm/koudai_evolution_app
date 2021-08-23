/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-23 16:19:39
 * @Description:webview
 */
import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, BackHandler, Linking, ActivityIndicator} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import Storage from '../../utils/storage';
import NavBar from '../../components/NavBar';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
export default function WebView({route, navigation}) {
    const jump = useJump();
    const webview = useRef(null);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [backButtonEnabled, setBackButtonEnabled] = useState(false);
    useEffect(() => {
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
        console.log(navState.url);
        if (navState.url.indexOf('/myInsurance') > -1) {
            setTitle('我的保险');
        } else if (navState.url.indexOf('/expertOpinion') > -1) {
            setTitle('家庭保险方案建议');
        } else if (navState.url.indexOf('/introduceDetail') > -1) {
            setTitle('保险详情');
        } else {
            setTitle(route?.params?.title);
        }
        setBackButtonEnabled(navState.canGoBack && navState.url.indexOf('/insuranceProgress') <= -1);
    };

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
            <NavBar leftIcon="chevron-left" title={title} leftPress={onBackAndroid} />
            {token && route?.params?.link ? (
                <RNWebView
                    ref={webview}
                    onMessage={(event) => {
                        const data = event.nativeEvent.data;
                        console.log('RN端接收到消息，消息内容=' + event.nativeEvent.data);
                        if (data && data.indexOf('https') <= -1) {
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
                            //保险保单跳转外链
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
                    injectedJavaScriptBeforeContentLoaded={`window.sessionStorage.setItem('token','${token}');`}
                    onNavigationStateChange={onNavigationStateChange}
                    // showsVerticalScrollIndicator={false}
                    startInLoadingState={true}
                    style={{flex: 1}}
                    source={{
                        uri: route?.params?.link,
                    }}
                />
            ) : (
                <ActivityIndicator color="#999999" />
            )}
        </View>
    );
}
