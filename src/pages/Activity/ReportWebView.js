/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-09 16:51:48
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
    const [title, setTitle] = useState('');
    const [token, setToken] = useState('');
    const [data, setData] = useState();
    const [backButtonEnabled, setBackButtonEnabled] = useState(false);
    const timeStamp = useRef(Date.now());
    const [startReprot, setStartReport] = useState(false);
    const shareModal = useRef(null);
    const RNWebViewRef = useRef(null);
    const [check, setCheck] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const image =
        'https://lcmf.oss-cn-hangzhou.aliyuncs.com/invite/share/20220106/bg/jianchi.jpg?x-oss-process=image%2Fauto-orient%2C1%2Fformat%2Cjpg%2Fwatermark%2Cg_se%2Cimage_aW52aXRlL3NoYXJlLzIwMjIwMTA2L3FyY29kZS90ZXN0LzEwMTAwMDY0MjUuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTM1LGhfMTM1%2Cx_108%2Cy_120&OSSAccessKeyId=LTAI51SSQWDG4LDz&Expires=1956823847&Signature=h9SHdxNK7aE3%2F1vZ7iwtb2py0s8%3D';
    const getToken = () => {
        Storage.get('loginStatus').then((result) => {
            setToken(result?.access_token ? result?.access_token : 'null');
        });
    };
    useEffect(() => {
        http.get('http://kapiweb.mayue.mofanglicai.com.cn:10080/report/annual/entrance/20220109').then((res) => {
            setData(res.result);
            // shareModal?.current?.show();
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
    // webview加载进度
    const onLoadProgress = (e) => {
        RNWebViewRef?.current?.setNativeProps({opacity: 0});
        setLoadProgress(Math.round(e.nativeEvent.progress * 100));
        if (Math.round(e.nativeEvent.progress * 100) == 100) {
            // setTimeout(() => {
            // }, 500);
            RNWebViewRef?.current?.fadeIn();
        }
    };
    return data ? (
        <View style={{flex: 1}}>
            <ShareModal
                ctrl={route.params?.link}
                ref={shareModal}
                shareContent={{
                    type: 'image',
                    image: decodeURI(image),
                }}
                more={false}
                title={data?.title}
            />
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
                            source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/01/reportCover.jpg'}}
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
                                            同意理财魔方查询并统计我的理财数据，查看
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
                                    <Text style={styles.lightText}>数据统计日期截止至2021年12月31日</Text>
                                </Animatable.View>
                            )}
                        </ImageBackground>
                        {/* 封面加载进度 */}
                        {startReprot && loadProgress < 100 && (
                            <View style={{position: 'absolute', zIndex: 200, alignItems: 'center'}}>
                                <Text style={styles.startingText}>正在进入您的理财报告</Text>
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
                                                                `您的设备不支持该功能，请手动拨打 ${
                                                                    data.split('phone=')[1]
                                                                }`
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
                                        uri: `http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080/PersonalAnnualReport?timeStamp=${timeStamp.current}`,
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
