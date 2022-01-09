/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-09 18:45:46
 * @Description:年报
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Platform, BackHandler, Linking, ActivityIndicator, Text, ImageBackground, StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {WebView as RNWebView} from 'react-native-webview';
import {useFocusEffect} from '@react-navigation/native';
import Storage from '../../utils/storage';
import NavBar from '../../components/NavBar';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
import {Colors, Style} from '../../common/commonStyle';
import {deviceHeight, deviceWidth, px} from '../../utils/appUtil';
import {ShareModal} from '../../components/Modal';
import http from '../../services';
import * as Animatable from 'react-native-animatable';
import {Button} from '../../components/Button';
import * as Progress from 'react-native-progress';
import {isIPhoneX} from '../../components/IM/app/chat/utils';
import CheckBox from '../../components/CheckBox';
export default function WebView({route, navigation}) {
    const jump = useJump();
    const webview = useRef(null);
    const [token, setToken] = useState('');
    const [data, setData] = useState();
    const [shareData, setShareData] = useState();
    const [backButtonEnabled, setBackButtonEnabled] = useState(false);
    const timeStamp = useRef(Date.now());
    const [startReprot, setStartReport] = useState(false);
    const shareImageModal = useRef(null);
    const shareLinkModal = useRef(null);
    const RNWebViewRef = useRef(null);
    const [check, setCheck] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const getToken = () => {
        Storage.get('loginStatus').then((result) => {
            setToken(result?.access_token ? result?.access_token : 'null');
        });
    };
    useEffect(() => {
        http.get('http://kapiweb.mayue.mofanglicai.com.cn:10080/report/annual/entrance/20220109').then((res) => {
            setData(res.result);
            setCheck(res.result?.check_box?.checked);
        });
        http.get('http://kapiweb.mayue.mofanglicai.com.cn:10080/report/annual/share/20220109').then((res) => {
            setShareData(res.result);
        });

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
    // webview加载进度
    const onLoadProgress = (e) => {
        RNWebViewRef?.current?.setNativeProps({opacity: 0});
        setLoadProgress(Math.round(e.nativeEvent.progress * 100));
        if (Math.round(e.nativeEvent.progress * 100) == 100) {
            setTimeout(() => {
                RNWebViewRef?.current?.fadeInUp();
            }, 500);
        }
    };
    //收到h5的信息
    const onMessage = (event) => {
        const data = event.nativeEvent.data;
        console.log('RN端接收到消息，消息内容=' + event.nativeEvent.data);
        // 分享图片
        if (data?.indexOf('shareImg') > -1) {
            shareImageModal?.current?.show();
        } else if (data?.indexOf('shareApp') > -1) {
            shareLinkModal?.current?.show();
        } else if (data?.indexOf('jump=') > -1) {
            //跳转
            const url = JSON.parse(data.split('jump=')[1]);
            jump(url);
        }
    };
    return data ? (
        <View style={{flex: 1}}>
            <ShareModal
                ref={shareImageModal}
                shareContent={{
                    type: 'image',
                    image: shareData?.share_img_info?.share_pic,
                }}
                title={shareData?.share_img_info?.title}
            />
            <ShareModal ref={shareLinkModal} title={'分享理财魔方'} shareContent={shareData?.share_link_info || {}} />
            <NavBar
                leftIcon="chevron-left"
                title={data?.title}
                leftPress={onBackAndroid}
                style={
                    data?.title_style == 1 ? {backgroundColor: 'transparent', position: 'absolute', zIndex: 20} : null
                }
            />
            {token ? (
                <>
                    {/* 年报开启页 */}
                    <Animatable.View animation="fadeIn" style={styles.con}>
                        {/* 封面 */}
                        <ImageBackground
                            source={{uri: data?.background}}
                            style={[styles.coverCon, {opacity: startReprot ? 0.2 : 1}]}>
                            {!startReprot && (
                                <Animatable.View
                                    animation="fadeInUp"
                                    style={{
                                        position: 'absolute',
                                        alignItems: 'center',
                                        bottom: isIPhoneX() ? px(53) + 34 : px(53),
                                    }}>
                                    <View style={[Style.flexRow, {marginBottom: px(13)}]}>
                                        <CheckBox
                                            checked={check}
                                            control={true}
                                            onChange={(value) => setCheck(value)}
                                        />
                                        <Text style={[styles.lightText, {marginLeft: px(6)}]}>
                                            {data?.check_box?.content}
                                        </Text>
                                    </View>
                                    <Button
                                        color={'#EB7121'}
                                        style={styles.button}
                                        title="立即开启"
                                        disabled={!check}
                                        disabledColor={'#f5b889'}
                                        onPress={() => {
                                            setStartReport(true);
                                        }}
                                    />
                                    <Text style={styles.lightText}>{data?.tips}</Text>
                                </Animatable.View>
                            )}
                        </ImageBackground>
                        {/* 封面加载进度 */}
                        {startReprot && loadProgress <= 100 && (
                            <View style={{position: 'absolute', zIndex: 200, alignItems: 'center'}}>
                                <Text style={styles.startingText}>{data?.loading_content}</Text>
                                <Progress.Bar
                                    progress={loadProgress / 100}
                                    color={'#EB7121'}
                                    height={px(12)}
                                    width={px(173)}
                                    borderRadius={px(7.5)}
                                />
                                <Text style={styles.loadProgress}>{loadProgress}%</Text>
                            </View>
                        )}
                    </Animatable.View>
                    {/* 年报 */}
                    {startReprot && (
                        <>
                            <Animatable.View ref={RNWebViewRef} style={{flex: 1}}>
                                <RNWebView
                                    bounces={false}
                                    ref={webview}
                                    onMessage={onMessage}
                                    originWhitelist={['*']}
                                    onHttpError={(syntheticEvent) => {
                                        const {nativeEvent} = syntheticEvent;
                                        console.warn('WebView received error status code: ', nativeEvent.statusCode);
                                    }}
                                    onLoadProgress={onLoadProgress}
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
                                    style={{flex: 1}}
                                    source={{
                                        // uri: route?.params?.timestamp
                                        //     ? `${route.params.link}?timeStamp=${timeStamp.current}`
                                        //     : route?.params?.link,
                                        uri: `http://192.168.88.101:3000/PersonalAnnualReport?timeStamp=${timeStamp.current}`,
                                        // uri: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080/article/901',
                                    }}
                                    textZoom={100}
                                />
                            </Animatable.View>
                        </>
                    )}
                </>
            ) : (
                <View style={[Style.flexCenter, {height: deviceHeight}]}>
                    <ActivityIndicator color="#999999" />
                </View>
            )}
        </View>
    ) : (
        <View style={[Style.flexCenter, {height: deviceHeight}]}>
            <ActivityIndicator color="#999999" />
        </View>
    );
}
const styles = StyleSheet.create({
    con: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverCon: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startingText: {
        fontSize: px(16),
        lineHeight: px(22),
        marginBottom: px(16),
        fontWeight: '700',
    },
    loadProgress: {
        fontSize: px(18),
        lineHeight: px(25),
        marginTop: px(16),
        fontWeight: '700',
    },
    lightText: {
        fontSize: px(11),
        lineHeight: px(16),
        color: Colors.lightBlackColor,
    },
    button: {
        backgroundColor: '#EB7121',
        borderRadius: px(30),
        width: px(230),
        marginBottom: px(13),
    },
});
