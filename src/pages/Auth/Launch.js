/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-06-29 15:50:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-12 11:42:40
 * @Description:
 */
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import {deviceWidth, deviceHeight, px, isIphoneX} from '../../utils/appUtil';
import Storage from '../../utils/storage';
import http from '../../services';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useJump} from '../../components/hooks';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
import Toast from '../../components/Toast';
import SplashScreen from 'react-native-splash-screen';
import _ from 'lodash';
import {env} from '../../services/config';
import FastImage from 'react-native-fast-image';

export default function Launch({navigation}) {
    const dispatch = useDispatch();
    const envList = ['online1', 'online2'];
    const timer = useRef();
    const jump = useJump();
    const inset = useSafeAreaInsets();
    const [adMes, setAdMes] = useState({});
    const [time, setTime] = useState(3);
    const clock = useRef(0);
    let isNavigating = false; //是否正在跳转
    global.getUserInfo = () => {
        dispatch(getUserInfo());
    };
    // 获取开机广告数据
    const fetchImg = () => {
        http.get('/mapi/app/splash/20210628').then((data) => {
            // 缓存广告内容
            Storage.save('AD', data.result);
            if (data?.result?.img) {
                Image.prefetch(data?.result?.img).then((res) => {
                    console.log(res, '缓存成功');
                });
            }
        });
    };
    const authLoading = (callback) => {
        Storage.get('AppGuide').then((res) => {
            http.get('/health/check', {env})
                .then((result) => {
                    console.log(result.result);
                    if (!__DEV__) {
                        if (result.result?.env) {
                            global.env = result.result.env;
                        } else {
                            global.env = 'online';
                        }
                    } else {
                        global.env = env;
                    }
                    dispatch(getUserInfo());
                    if (callback) {
                        callback();
                    } else {
                        if (res) {
                            navigation.replace('Tab');
                            setTimeout(() => {
                                SplashScreen.hide();
                            }, 8);
                        } else {
                            navigation.replace('AppGuide');
                        }
                    }
                })
                .catch(() => {
                    const getHealthEnv = (i, length) => {
                        global.LogTool('Host', envList[i]);
                        global.env = envList[i];
                        http.get('/health/check')
                            .then((result) => {
                                console.log(result.result);
                                dispatch(getUserInfo());
                                if (callback) {
                                    callback();
                                } else {
                                    if (res) {
                                        navigation.replace('Tab');
                                        setTimeout(() => {
                                            SplashScreen.hide();
                                        }, 8);
                                    } else {
                                        navigation.replace('AppGuide');
                                    }
                                }
                            })
                            .catch(() => {
                                if (++i < length) {
                                    getHealthEnv(i, length);
                                } else {
                                    global.LogTool('Host', 'failed');
                                    Toast.show('网络异常，请稍后再试~');
                                }
                            });
                    };
                    getHealthEnv(0, 2);
                });
        });
    };
    useEffect(() => {
        global.env = env;
        //显示引导页的时候不展示广告
        Storage.get('AppGuide').then((AppGuide) => {
            if (AppGuide) {
                Storage.get('AD').then((AD) => {
                    if (AD && AD.img && new Date().getTime() < AD.expired_at * 1000) {
                        setAdMes(AD);
                        setTime(AD.skip_time || 3);
                    } else {
                        authLoading();
                    }
                });
            } else {
                authLoading();
            }
        });
        fetchImg();
    }, []);
    const imageLoadEnd = () => {
        SplashScreen.hide();
        timer.current = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer.current);
                    authLoading();
                    return 1;
                } else {
                    return --prev;
                }
            });
        }, 1000);
    };
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                if (isNavigating) {
                    return;
                }
                isNavigating = true;
                global.LogTool('splashClickStart', adMes.id);
                timer.current && clearInterval(timer.current);
                authLoading(() => {
                    navigation.replace('Tab');
                    setTimeout(() => {
                        jump(adMes.jump);
                    }, 0);
                });
            }}
            style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
            {adMes.img ? (
                <>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={_.debounce(() => {
                            if (isNavigating) {
                                return;
                            }
                            isNavigating = true;
                            global.LogTool('splashSkipStart');
                            timer.current && clearInterval(timer.current);
                            authLoading();
                        }, 300)}
                        style={[styles.timer, {top: inset.top + px(20)}]}>
                        <Text style={styles.text}>跳过{time}s</Text>
                    </TouchableOpacity>
                    <Image
                        source={{uri: adMes.img}}
                        style={styles.imgage}
                        onLoadStart={() => {
                            clock.current = new Date().getTime();
                        }}
                        onLoadEnd={imageLoadEnd}
                        onProgress={() => {
                            //如果图片加载时间超过2s
                            if (new Date().getTime() - clock.current > 2000) {
                                authLoading();
                            }
                        }}
                        onLoadError={() => {
                            timer.current && clearInterval(timer.current);
                            authLoading();
                        }}
                    />
                    <View style={[styles.footer]}>
                        <FastImage
                            source={require('../../assets/img/appGuide/adverseFooter.png')}
                            style={[styles.footer_img]}
                        />
                    </View>
                </>
            ) : null}
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    imgage: {
        width: deviceWidth,
        height: deviceHeight,
    },
    text: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
        textAlign: 'center',
    },
    timer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'absolute',
        right: px(16),
        zIndex: 10,
        width: px(70),
        paddingVertical: px(3),
        borderRadius: px(16),
    },
    footer_img: {
        height: px(65),
        width: px(185),
        marginTop: px(26),
        marginBottom: isIphoneX() ? px(26) + 34 : px(26),
        marginLeft: px(-10),
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: deviceWidth,
        zIndex: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
});
