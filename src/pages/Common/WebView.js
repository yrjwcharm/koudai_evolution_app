/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-27 17:12:06
 * @Description:webview
 */
import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, BackHandler, Linking, ActivityIndicator} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import Storage from '../../utils/storage';
import NavBar from '../../components/NavBar';
import Toast from '../../components/Toast';
export default function WebView({route, navigation}) {
    const webview = useRef(null);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [backButtonEnabled, setBackButtonEnabled] = useState(false);
    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                // window.ReactNativeWebView.postMessage('${result.access_token}')
                setToken(result?.access_token ? result?.access_token : 'null');
                // webview.current.injectJavaScript(`window.sessionStorage.setItem('token','${result.access_token}');`);
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
                        if (data) {
                            const url = data.split('phone=')[1] ? `tel:${data.split('phone=')[1]}` : '';
                            if (url) {
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
                    javaScriptEnabled={true}
                    injectedJavaScriptBeforeContentLoaded={`window.sessionStorage.setItem('token','${token}');`}
                    onNavigationStateChange={onNavigationStateChange}
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
