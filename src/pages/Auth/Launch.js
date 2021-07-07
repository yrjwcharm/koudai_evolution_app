/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-06-29 15:50:29
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-07-07 10:45:38
 * @Description:
 */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import {deviceWidth, deviceHeight, px} from '../../utils/appUtil';
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
export default function Launch({navigation}) {
    const dispatch = useDispatch();
    const envList = ['online1', 'online2'];
    const timer = useRef();
    const jump = useJump();
    const inset = useSafeAreaInsets();
    const [adMes, setAdMes] = useState({});
    const [time, setTime] = useState(3);
    global.getUserInfo = () => {
        dispatch(getUserInfo());
    };
    // 获取开机广告数据
    const fetchImg = () => {
        http.get('/mapi/app/splash/20210628').then((data) => {
            // 缓存广告内容
            Storage.save('AD', data.result);
            if (data?.result?.img) {
                Image.prefetch(data?.result?.img);
            }
        });
    };
    const authLoading = () => {
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
                    if (res) {
                        navigation.replace('Tab');
                        SplashScreen.hide();
                    } else {
                        navigation.replace('AppGuide');
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
                                if (res) {
                                    navigation.replace('Tab');
                                    SplashScreen.hide();
                                } else {
                                    navigation.replace('AppGuide');
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
        Storage.get('AD').then((AD) => {
            if (AD && AD.img && new Date().getTime() < AD.expired_at * 1000) {
                setTime(AD.skip_time || 3);
                setAdMes(AD);
                SplashScreen.hide();
                timer.current = setInterval(() => {
                    setTime((prev) => {
                        if (prev <= 0) {
                            clearInterval(timer.current);
                            authLoading();
                            return 0;
                        } else {
                            return --prev;
                        }
                    });
                }, 1000);
            } else {
                authLoading();
            }
        });
        fetchImg();
    }, []);
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                global.LogTool('splashClickStart');
                timer.current && clearInterval(timer.current);
                dispatch(getUserInfo());
                navigation.replace('Tab');
                setTimeout(() => {
                    jump(adMes.jump);
                }, 0);
            }}
            style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={_.debounce(() => {
                    global.LogTool('splashSkipStart');
                    timer.current && clearInterval(timer.current);
                    authLoading();
                }, 300)}
                style={[styles.timer, {top: inset.top + px(20)}]}>
                <Text style={styles.text}>跳过{time}s</Text>
            </TouchableOpacity>
            <Image source={{uri: adMes.img}} style={styles.imgage} />
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
});
