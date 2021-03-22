/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-22 18:41:10
 * @Description:webview
 */
import React, {useEffect, useRef, useState} from 'react';
import {View, Platform, BackHandler} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import Storage from '../../utils/storage';
import NavBar from '../../components/NavBar';
export default function WebView({route, navigation}) {
    const webview = useRef(null);
    const [backButtonEnabled, setBackButtonEnabled] = useState(false);
    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setTimeout(() => {
                    // window.ReactNativeWebView.postMessage('${result.access_token}')
                    webview.current.injectJavaScript(
                        `window.sessionStorage.setItem('token','${result.access_token}');`
                    );
                }, 100);
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
        setBackButtonEnabled(navState.canGoBack);
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
            <NavBar leftIcon="chevron-left" leftPress={onBackAndroid} />
            <RNWebView
                ref={webview}
                onMessage={(event) => {
                    alert('RN端接收到消息，消息内容=' + event.nativeEvent.data);
                }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                onNavigationStateChange={onNavigationStateChange}
                startInLoadingState={true}
                style={{flex: 1}}
                source={{
                    uri: route?.params?.link,
                    // headers: {'Cache-Control': 'no-cache'},
                }}
            />
        </View>
    );
}
