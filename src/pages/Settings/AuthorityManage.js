/*
 * @Date: 2021-09-02 14:18:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-16 14:45:07
 * @Description:权限管理
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform, AppState} from 'react-native';
import {px as text, px, requestAuth} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {
    openSettings,
    checkMultiple,
    checkNotifications,
    requestNotifications,
    PERMISSIONS,
} from 'react-native-permissions';
import {baseURL} from '../../services/config';
const AuthorityManage = ({navigation}) => {
    const [notifications, setNotifications] = useState(false);
    const [camera, setCamera] = useState(false);
    const [read, setRead] = useState(false);
    const [update, setUpdate] = useState(false);
    useEffect(() => {
        if (Platform.OS == 'ios') {
            checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then((statuses) => {
                setCamera(statuses[PERMISSIONS.IOS.CAMERA] == 'granted');
                setRead(statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'granted');
            });
        } else {
            checkMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).then((statuses) => {
                setCamera(statuses[PERMISSIONS.ANDROID.CAMERA] == 'granted');
                setRead(statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] == 'granted');
            });
        }
        //筒子
        checkNotifications().then(({status, settings}) => {
            // …
            setNotifications(status == 'granted');
        });
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, [update]);
    const _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            setUpdate((pre) => {
                return !pre;
            });
        }
    };
    const handelRequest = (index, _status) => {
        if (_status) {
            openSettings().catch(() => console.warn('cannot open settings'));
            return;
        }
        if (index == 1) {
            requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if (status == 'granted') {
                    setNotifications(true);
                } else {
                    AppState.addEventListener('change', _handleAppStateChange);
                    openSettings().catch(() => console.warn('cannot open settings'));
                }
            });
        } else {
            if (index == 2) {
                if (Platform.OS == 'android') {
                    requestAuth(
                        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                        () => {
                            setRead(true);
                        },
                        () => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }
                    );
                } else {
                    requestAuth(
                        PERMISSIONS.IOS.PHOTO_LIBRARY,
                        () => {
                            setRead(true);
                        },
                        () => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }
                    );
                }
            } else {
                if (Platform.OS == 'android') {
                    requestAuth(
                        PERMISSIONS.ANDROID.CAMERA,
                        () => {
                            setCamera(true);
                        },
                        () => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }
                    );
                } else {
                    requestAuth(
                        PERMISSIONS.IOS.CAMERA,
                        () => {
                            setCamera(true);
                        },
                        () => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }
                    );
                }
            }
        }
    };
    return (
        <View style={styles.con}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.partBox, Style.flexBetween]}
                onPress={() => {
                    handelRequest(1, notifications);
                }}>
                <Text style={[styles.title, {color: Colors.defaultColor}]}>开启消息通知</Text>
                <View style={Style.flexRow}>
                    <Text
                        style={[styles.title, {color: notifications ? Colors.lightGrayColor : Colors.lightBlackColor}]}>
                        {notifications ? '已开启' : '去设置'}
                    </Text>
                    <Icon name={'angle-right'} size={20} style={{marginLeft: px(10)}} color={Colors.lightGrayColor} />
                </View>
            </TouchableOpacity>
            <Text style={styles.text}>方便您能及时获得调仓、加仓和其他的信息</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.partBox, Style.flexBetween]}
                onPress={() => {
                    handelRequest(2, read);
                }}>
                <Text style={[styles.title, {color: Colors.defaultColor}]}>允许访问相册</Text>
                <View style={Style.flexRow}>
                    <Text style={[styles.title, {color: read ? Colors.lightGrayColor : Colors.lightBlackColor}]}>
                        {read ? '已开启' : '去设置'}
                    </Text>
                    <Icon name={'angle-right'} size={20} style={{marginLeft: px(10)}} color={Colors.lightGrayColor} />
                </View>
            </TouchableOpacity>
            <Text style={styles.text}>
                方便您上传图片或者视频。关于
                <Text
                    style={{color: Colors.btnColor}}
                    onPress={() => {
                        navigation.navigate('WebView', {
                            link: `${baseURL.H5}/privacy#album`,
                            title: '理财魔方隐私权协议',
                        });
                    }}>
                    《相册信息》
                </Text>
            </Text>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.partBox, Style.flexBetween]}
                onPress={() => {
                    handelRequest(3, camera);
                }}>
                <Text style={[styles.title, {color: Colors.defaultColor}]}>允许访问摄像头</Text>
                <View style={Style.flexRow}>
                    <Text style={[styles.title, {color: camera ? Colors.lightGrayColor : Colors.lightBlackColor}]}>
                        {camera ? '已开启' : '去设置'}
                    </Text>
                    <Icon name={'angle-right'} size={20} style={{marginLeft: px(10)}} color={Colors.lightGrayColor} />
                </View>
            </TouchableOpacity>
            <Text
                style={styles.text}
                onPress={() => {
                    navigation.navigate('WebView', {
                        link: `${baseURL.H5}/privacy#camera`,
                        title: '理财魔方隐私权协议',
                    });
                }}>
                方便您使用拍摄、刷脸等服务。关于<Text style={{color: Colors.btnColor}}>《访问摄像头》</Text>
            </Text>
        </View>
    );
};

export default AuthorityManage;

const styles = StyleSheet.create({
    con: {flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16)},
    partBox: {
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: text(56),
    },
    text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginVertical: px(12),
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
});
