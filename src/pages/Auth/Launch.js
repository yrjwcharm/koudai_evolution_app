/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-06-29 15:50:29
 * @Description:
 */
import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, Platform, ScrollView, NativeModules} from 'react-native';
import {deviceWidth, deviceHeight, px, isIphoneX} from '../../utils/appUtil';
import Storage from '../../utils/storage';
import http from '../../services';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useJump} from '../../components/hooks';
import {useDispatch} from 'react-redux';
import {getAppConfig, getUserInfo, updateUserInfo} from '../../redux/actions/userInfo';
import Toast from '../../components/Toast';
import SplashScreen from 'react-native-splash-screen';
import _ from 'lodash';
import {env, baseURL} from '../../services/config';
import FastImage from 'react-native-fast-image';
import {Modal} from '../../components/Modal';
import RNExitApp from 'react-native-exit-app';
import {Colors} from '../../common/commonStyle';
import {useFocusEffect} from '@react-navigation/native';
import JPush from 'jpush-react-native';
import {getAppMetaData} from 'react-native-get-channel';
import * as WeChat from 'react-native-wechat-lib';
import {updateVision} from '../../redux/actions/visionData';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {debounce} from 'lodash';
import RenderHtml from '../../components/RenderHtml';
const {PTRIDFA, OAIDModule} = NativeModules;
export default function Launch({navigation}) {
    const dispatch = useDispatch();
    const envList = ['online', 'online1', 'online2'];
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
    // updatePriData更新后的隐私
    const showPrivacyPop = (updatePriData) => {
        Modal.show({
            confirm: true,
            backButtonClose: false,
            isTouchMaskToClose: false,
            cancelCallBack: () => {
                RNExitApp.exitApp();
            },
            confirmCallBack: () => {
                init();
                Storage.save('privacy', 'privacy');
                //上报隐私同意点击
                setTimeout(() => {
                    http.post('/mapi/app/privacy/report/20220916', {
                        is_first: updatePriData ? 0 : 1,
                    });
                }, 1000);
            },
            children: () => {
                return (
                    <View style={{height: px(300)}}>
                        <ScrollView style={{paddingHorizontal: px(20), marginVertical: px(20)}}>
                            {updatePriData?.content ? (
                                <RenderHtml
                                    html={updatePriData?.content}
                                    style={{fontSize: px(12), lineHeight: px(18), textAlign: 'justify'}}
                                />
                            ) : (
                                <>
                                    <Text style={{fontSize: px(12), lineHeight: px(18), textAlign: 'justify'}}>
                                        欢迎使用理财魔方！理财魔方深知隐私及个人信息对您的重要性，因此我们非常重视保护您的隐私和个人信息安全。您在使用我们提供的产品/服务时，我们需要收集、使用您的个人信息。
                                    </Text>
                                    <Text />
                                    <Text style={{fontSize: px(12), lineHeight: px(18), textAlign: 'justify'}}>
                                        在您使用理财魔方App前，请您务必仔细阅读、充分理解
                                        <Text
                                            style={{color: Colors.btnColor}}
                                            onPress={() => {
                                                navigation.navigate('WebView', {
                                                    link: `${baseURL.H5}/privacy`,
                                                    title: '  ',
                                                });
                                                Modal.close();
                                            }}>
                                            《理财魔方隐私权政策》
                                        </Text>
                                        中的相关条款。《理财魔方隐私权政策》清晰列示了我们如何收集、使用、对外提供、存储、保护您的个人信息。您还可以通过阅读具体条款，了解如何实现您的个人信息权利。
                                    </Text>
                                    <Text />
                                    <Text style={{fontSize: px(12), lineHeight: px(18), textAlign: 'justify'}}>
                                        如果您已经阅读、理解、认可上述政策，请点击“同意”按钮；若您拒绝，则无法使用我们提供的任何产品/服务。
                                    </Text>
                                </>
                            )}
                        </ScrollView>
                    </View>
                );
            },
            title: updatePriData?.title || '理财魔方隐私声明',
            confirmText: '同意',
            cancelText: '拒绝',
        });
    };
    const getSystemMes = async () => {
        global.did = await DeviceInfo.syncUniqueId();
        global.ver = DeviceInfo.getVersion();
        global.deviceId = DeviceInfo.getDeviceId();
        global.brandName = DeviceInfo.getBrand();
        global.systemVersion = DeviceInfo.getSystemVersion();
        global.getDeviceName = await DeviceInfo.getDeviceName();
    };
    const initJpush = () => {
        JPush.init();
        //连接状态
        JPush.addConnectEventListener((result) => {
            console.log('connectListener:' + JSON.stringify(result));
        });
        JPush.setBadge({badge: 0, appbadge: '123'});
        //通知回调
        JPush.addNotificationListener((result) => {
            if (JSON.stringify(result.extras.route) && result.notificationEventType == 'notificationOpened') {
                global.LogTool('pushNStart', result.extras.route);
                if (result.extras.route?.indexOf('CreateAccount') > -1) {
                    //push开户打点
                    global.LogTool('PushOpenAccountRecall');
                }
                if (result.extras.route?.indexOf('Evalution') > -1) {
                    global.LogTool('PushOpenEnvolutionRecall');
                }
                dispatch(updateUserInfo({pushRoute: result.extras.route}));
            }
        });
    };
    const postHeartData = (registerID, channel) => {
        http.post('/common/device/heart_beat/20210101', {
            channel: channel,
            jpush_rid: registerID,
            platform: Platform.OS,
        }).then((res) => {
            if (res.code == '000000') {
                dispatch(
                    updateVision({
                        visionUpdate: global.currentRoutePageId?.indexOf('Vision') > -1 ? '' : res.result.vision_update,
                        visionTabUpdate: res.result.vision_update,
                        album_update: res.result.album_update,
                    })
                );
            }
        });
    };
    // heartbeat
    const heartBeat = React.useCallback(() => {
        JPush.getRegistrationID((result) => {
            if (Platform.OS == 'android') {
                getAppMetaData('UMENG_CHANNEL')
                    .then((data) => {
                        if (!global.channel) {
                            global.channel = data;
                        }
                        postHeartData(result.registerID, global.channel);
                    })
                    .catch(() => {
                        if (!global.channel) {
                            global.channel = '';
                        }
                        postHeartData(result.registerID, 'android');
                        console.log('获取渠道失败');
                    });
            } else {
                if (!global.channel) {
                    global.channel = 'ios';
                }
                postHeartData(result.registerID, global.channel);
            }
        });
    }, []);
    useFocusEffect(
        useCallback(() => {
            global.env = env;
            Storage.get('privacy').then(async (res) => {
                if (res) {
                    if (!(Platform.OS == 'android' && __DEV__)) {
                        global.did = await DeviceInfo.syncUniqueId();
                    }
                    http.get('/mapi/app/privacy/info/20220916')
                        .then((pra) => {
                            if (pra?.result?.show_privacy == 1) {
                                SplashScreen.hide();
                                showPrivacyPop(pra?.result?.privacy_pop);
                            } else {
                                init();
                            }
                        })
                        .catch(() => {
                            init();
                        });
                } else {
                    SplashScreen.hide();
                    showPrivacyPop();
                }
            });
        }, [])
    );
    // 获取ios idfa
    const getIdfa = async () => {
        let idfa = await PTRIDFA.getIDFA();
        global.idfa = idfa || '';
    };
    // 获取安卓 oaid
    const getOaid = () => {
        OAIDModule.getOaid((oaid) => {
            global.oaid = oaid || '';
        });
    };
    // 获取ios 归因数据
    const getAdData = async () => {
        let data = await PTRIDFA.getAdData();
        //14.3 以下 {{}} 14.3以上的是{}
        if (data && Object.values(data) && Object.values(data)[0] && typeof Object.values(data)[0] == 'object') {
            data = Object.values(data)[0];
        }
        http.post('mapi/upload/apple_ad/20220530', data);
    };
    const init = async () => {
        await getSystemMes();
        Platform.OS == 'ios' ? getIdfa() : getOaid();
        Platform.OS == 'ios' && getAdData();
        heartBeat();
        setInterval(() => {
            heartBeat();
        }, 60000);
        initJpush();
        WeChat.registerApp('wx38a79825fa0884f4', 'https://msite.licaimofang.com/lcmf/');
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
        NetInfo.addEventListener(
            debounce((state) => {
                if (!state.isConnected) {
                    Toast.show('网络已断开,请检查您的网络');
                } else {
                    dispatch(getUserInfo());
                    dispatch(getAppConfig());
                }
            }, 500)
        );
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
    //跳转
    const appJump = (res) => {
        timer.current && clearInterval(timer.current);
        if (res) {
            navigation.replace('Tab');
            SplashScreen.hide();
        } else {
            navigation.replace('AppGuide');
        }
    };
    //域名切换
    const authLoading = (callback) => {
        Storage.get('AppGuide').then((res) => {
            http.get('/health/check', {env})
                .then((result) => {
                    if (result.code != '000000') {
                        throw new Error();
                    }
                    if (result.result?.chn) {
                        global.channel = result.result?.chn;
                    }
                    if (!__DEV__) {
                        if (result.result?.env) {
                            global.env = result.result.env;
                        } else {
                            global.env = 'onlinessl';
                        }
                    } else {
                        global.env = env;
                    }
                    dispatch(getUserInfo());
                    dispatch(getAppConfig());
                    if (callback) {
                        callback();
                    } else {
                        appJump(res);
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
                                dispatch(getAppConfig());
                                if (callback) {
                                    callback();
                                } else {
                                    appJump(res);
                                }
                            })
                            .catch(() => {
                                if (++i < length) {
                                    getHealthEnv(i, length);
                                } else {
                                    global.LogTool('Host', 'failed');
                                    Toast.show('网络异常，请稍后再试~');
                                    appJump(res);
                                }
                            });
                    };
                    getHealthEnv(0, 3);
                });
        });
    };
    const imageLoadEnd = () => {
        timer.current && clearInterval(timer.current);
        global.LogTool('guide_show', '开屏大图', adMes.id);
        SplashScreen.hide();
        timer.current = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    timer.current && clearInterval(timer.current);
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
                global.LogTool('guide_show_click', '开屏', adMes.id);
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
                            global.LogTool('guide_show_skip', '开屏', adMes.id);
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
                        onLoad={imageLoadEnd} //加载成功
                        onProgress={() => {
                            //如果图片加载时间超过2s
                            if (new Date().getTime() - clock.current > 2000) {
                                timer.current && clearInterval(timer.current);
                                authLoading();
                            }
                        }}
                        onError={() => {
                            //加载失败
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
