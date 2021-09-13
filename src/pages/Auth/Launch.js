/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-06-29 15:50:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-13 11:43:27
 * @Description:
 */
import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, Platform, BackHandler, ScrollView} from 'react-native';
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
import {Modal} from '../../components/Modal';
import RNExitApp from 'react-native-exit-app';
import {Colors} from '../../common/commonStyle';
import {useFocusEffect} from '@react-navigation/native';
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
    const showPrivacyPop = () => {
        Modal.show({
            confirm: true,
            isTouchMaskToClose: false,
            cancelCallBack: () => {
                if (Platform.OS == 'android') {
                    BackHandler.exitApp(); //退出整个应用
                } else {
                    RNExitApp.exitApp();
                }
            },
            confirmCallBack: () => {
                init();
                Storage.save('privacy', 'privacy');
            },
            children: () => {
                return (
                    <View style={{height: px(300)}}>
                        <ScrollView style={{paddingHorizontal: px(20), marginVertical: px(20)}}>
                            <Text style={{fontSize: px(12), lineHeight: px(18)}}>
                                欢迎使用理财魔方！为给您提供优质的服务、控制业务风险、保障信息和资金安全，本应用使用过程中，需要联网，需要在必要范围内收集、使用或共享您的个人信息。我们提供理财、保险、支付等服务。请您在使用前仔细阅读
                                <Text
                                    style={{color: Colors.btnColor}}
                                    onPress={() => {
                                        jump({
                                            path: 'LcmfPolicy',
                                        });
                                        Modal.close();
                                    }}>
                                    《隐私政策》
                                </Text>
                                条款，同意后开始接受我们的服务。
                            </Text>
                            <Text />
                            <Text style={{fontSize: px(12), lineHeight: px(18)}}>
                                本应用使用期间，我们需要申请获取您的系统权限，我们将在首次调用时逐项询问您是否允许使用该权限。您可以在我们询问时开启相关权限，也可以在设备系统“设置”里管理相关权限：
                            </Text>
                            <Text style={{fontSize: px(12), lineHeight: px(18)}}>
                                1.消息通知权限：向您及时推送交易、调仓、阅读推荐等消息，方便您更及时了解您的理财相关数据。
                            </Text>
                            <Text style={{fontSize: px(12), lineHeight: px(18)}}>
                                2.读取电话状态权限：正常识别您的本机识别码，以便完成安全风控、进行统计和服务推送。
                            </Text>
                            <Text style={{fontSize: px(12), lineHeight: px(18)}}>
                                3.读写外部存储权限：向您提供头像设置、客服、评论或分享、图像识别、下载打开文件时，您可以通过开启存储权限使用或保存图片、视频或文件。
                            </Text>
                        </ScrollView>
                    </View>
                );
            },
            title: '隐私保护说明',
            confirmText: '同意',
            cancelText: '不同意',
        });
    };
    useFocusEffect(
        useCallback(() => {
            global.env = env;
            Storage.get('privacy').then((res) => {
                if (res) {
                    init();
                } else {
                    SplashScreen.hide();
                    showPrivacyPop();
                }
            });
        }, [])
    );
    const init = () => {
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
                    if (result.code != '000000') {
                        throw new Error();
                    }
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
                                if (result.code != '000000') {
                                    throw new Error();
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
                                if (++i < length) {
                                    getHealthEnv(i, length);
                                } else {
                                    global.LogTool('Host', 'failed');
                                    Toast.show('网络异常，请稍后再试~');
                                    if (res) {
                                        navigation.replace('Tab');
                                        setTimeout(() => {
                                            SplashScreen.hide();
                                        }, 8);
                                    } else {
                                        navigation.replace('AppGuide');
                                    }
                                }
                            });
                    };
                    getHealthEnv(0, 2);
                });
        });
    };
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
                if (isNavigating || !adMes?.img) {
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
