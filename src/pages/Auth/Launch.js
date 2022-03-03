/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-06-29 15:50:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-03 18:55:40
 * @Description:
 */
import React, {useState, useRef, useCallback} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Platform,
    BackHandler,
    ScrollView,
    NativeModules,
} from 'react-native';
import {deviceWidth, deviceHeight, px, isIphoneX} from '../../utils/appUtil';
import Storage from '../../utils/storage';
import http from '../../services';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useJump} from '../../components/hooks';
import {useDispatch} from 'react-redux';
import {getUserInfo, updateUserInfo} from '../../redux/actions/userInfo';
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
    const showPrivacyPop = () => {
        Modal.show({
            confirm: true,
            backButtonClose: false,
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
                                        navigation.navigate('WebView', {
                                            link: `${baseURL.H5}/privacy`,
                                            title: '理财魔方隐私权协议',
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
                                1.消息通知权限：向您及时推送交易、阅读推荐等消息，方便您更及时了解您的理财相关数据。
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
            cancelText: '拒绝',
        });
    };
    const initJpush = () => {
        JPush.init();
        //连接状态
        JPush.addConnectEventListener((result) => {
            console.log('connectListener:' + JSON.stringify(result));
        });
        JPush.setBadge({badge: 0, appbadge: '123'});
        JPush.getRegistrationID((result) => {
            console.log('registerID:' + JSON.stringify(result));
        });
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
        // //本地通知回调
        // JPush.addLocalNotificationListener((result) => {
        //     console.log('localNotificationListener:' + JSON.stringify(result));
        // });
        // //自定义消息回调
        // JPush.addCustomMessagegListener((result) => {
        //     console.log('customMessageListener:' + JSON.stringify(result));
        // });
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
                        postHeartData(result.registerID, data);
                        global.channel = data;
                    })
                    .catch(() => {
                        global.channel = '';
                        postHeartData(result.registerID, 'android');
                        console.log('获取渠道失败');
                    });
            } else {
                global.channel = 'ios';
                postHeartData(result.registerID, 'ios');
            }
        });
    }, []);
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
    const init = () => {
        Platform.OS == 'ios' ? getIdfa() : getOaid();
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
