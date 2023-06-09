/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-21 21:09:27
 * @Description:webview
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Platform, BackHandler, Linking, ActivityIndicator} from 'react-native';
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
import URI from 'urijs';

export default function WebView({route, navigation}) {
    const jump = useJump();
    const webview = useRef(null);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const shareLinkModal = useRef(null);
    const [shareData, setShareData] = useState();
    const [backButtonEnabled, setBackButtonEnabled] = useState(false);
    const timeStamp = useRef(Date.now());
    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setToken(result?.access_token ? result?.access_token : 'null');
                // webview.current &&
                //     webview.current.injectedJavaScript(
                //         `window.sessionStorage.setItem('token','${result.access_token}');`
                //     );
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
        // console.log(navState.url);
        if (navState.url.indexOf('/myInsurance') > -1) {
            setTitle('我的保险');
        } else if (navState.url.indexOf('/expertOpinion') > -1) {
            setTitle('家庭保险方案建议');
        } else if (navState.url.indexOf('/introduceDetail') > -1) {
            setTitle('保险详情');
        } else if (navState.url.indexOf('/insuranceAssist') > -1) {
            setTitle('协助投保');
        } else if (navState.url.indexOf('/insuranceProgress') > -1) {
            setTitle('保险进度');
        } else if (navState.url.indexOf('/complaintFeedback') > -1) {
            setTitle('投诉反馈');
        } else if (navState.url.indexOf('/recommendations') > -1) {
            setTitle('专家意见书');
        } else {
            if (route?.params?.title) {
                setTitle(route?.params?.title);
            } else if (route.params.hideTitle) {
                setTitle('');
            } else if (navState.title) {
                setTitle(navState.title);
            }
        }
        setBackButtonEnabled(navState.canGoBack && navState.url.indexOf('/insuranceProgress') <= -1);
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
            <NavBar
                leftIcon="chevron-left"
                title={title}
                leftPress={onBackAndroid}
                {...(route.params.navProps || {})}
            />
            <ShareModal ref={shareLinkModal} title={'分享理财魔方'} shareContent={shareData || {}} />
            {token && route?.params?.link ? (
                <RNWebView
                    bounces={false}
                    ref={webview}
                    onMessage={(event) => {
                        const data = event.nativeEvent.data;
                        console.log('RN端接收到消息，消息内容=' + event.nativeEvent.data);
                        if (data?.indexOf('shareLink=') > -1) {
                            setShareData(JSON.parse(data.split('shareLink=')[1]));
                            shareLinkModal?.current?.show();
                        } else if (data?.indexOf('logParams=') > -1) {
                            const logParams = JSON.parse(data?.split('logParams=')[1] || []);
                            global.LogTool(...logParams);
                        } else if (data && data.indexOf('url=') > -1) {
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
                    injectedJavaScript={`window.sessionStorage.setItem('token','${token}');`}
                    onLoadEnd={async (e) => {
                        // console.log(e.nativeEvent.title);
                        if (route.params.title) {
                            setTitle(route.params.title);
                        } else if (route.params.hideTitle) {
                            setTitle('');
                        } else if (e.nativeEvent.title) {
                            setTitle(e.nativeEvent.title);
                        }
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
                    onNavigationStateChange={onNavigationStateChange}
                    renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                    // showsVerticalScrollIndicator={false}
                    startInLoadingState={true}
                    style={{flex: 1}}
                    source={{
                        uri: URI(route.params.link).addQuery({timeStamp: timeStamp.current}).valueOf(),
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
