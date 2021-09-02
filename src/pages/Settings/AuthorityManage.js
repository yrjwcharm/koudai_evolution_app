/*
 * @Date: 2021-09-02 14:18:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-02 17:32:20
 * @Description:权限管理
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import {px as text, isIphoneX, px, requestAuth} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {
    openSettings,
    checkMultiple,
    checkNotifications,
    requestNotifications,
    PERMISSIONS,
} from 'react-native-permissions';
const AuthorityManage = () => {
    const [notifications, setNotifications] = useState(false);
    const [camera, setCamera] = useState(false);
    const [read, setRead] = useState(false);
    useEffect(() => {
        if (Platform.OS == 'ios') {
            checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then((statuses) => {
                setCamera(statuses[PERMISSIONS.IOS.CAMERA] == 'granted');
                setRead(statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'granted');
                console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
            });
        } else {
            checkMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).then((statuses) => {
                setCamera(statuses[PERMISSIONS.ANDROID.CAMERA] == 'granted');
                setRead(statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] == 'granted');
                console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
            });
        }
        //筒子
        checkNotifications().then(({status, settings}) => {
            // …
            setNotifications(status == 'granted');
            console.log('notification', status);
        });
    }, []);
    const handelRequest = (index, status) => {
        if (index == 1) {
            requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if (status == 'granted') {
                    setNotifications(true);
                } else {
                    console.log('需要跳转设置');
                }
            });
        } else {
            if (index == 2) {
                if (Platform.OS == 'android') {
                    requestAuth(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, this.openPicker, this.blockCal);
                } else {
                    requestAuth(
                        PERMISSIONS.IOS.PHOTO_LIBRARY,
                        (res) => {
                            setRead(true);
                        },
                        () => {
                            console.log('需要跳转设置');
                        }
                    );
                }
            } else {
                if (Platform.OS == 'android') {
                    requestAuth(PERMISSIONS.ANDROID.CAMERA, this.openPicker, this.blockCal);
                } else {
                    requestAuth(
                        PERMISSIONS.IOS.CAMERA,
                        (res) => {
                            setCamera(true);
                        },
                        () => {
                            console.log('需要跳转设置');
                        }
                    );
                }
            }
        }
    };
    console.log(notifications);
    return (
        <View style={styles.con}>
            <TouchableOpacity activeOpacity={0.8} style={[styles.partBox, Style.flexBetween, {height: text(56)}]}>
                <Text style={[styles.title, {color: Colors.defaultColor}]}>开启消息通知</Text>
                <TouchableOpacity
                    style={Style.flexRow}
                    onPress={() => {
                        handelRequest(1, notifications);
                    }}>
                    <Text style={[styles.title, {color: Colors.lightGrayColor}]}>
                        {notifications ? '已开启' : '去设置'}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.text}>方便及时获取跳槽潇洒大陆拉大</Text>
            <TouchableOpacity activeOpacity={0.8} style={[styles.partBox, Style.flexBetween, {height: text(56)}]}>
                <Text style={[styles.title, {color: Colors.defaultColor}]}>允许访问相册</Text>
                <TouchableOpacity
                    style={Style.flexRow}
                    onPress={() => {
                        handelRequest(2, read);
                    }}>
                    <Text style={[styles.title, {color: Colors.lightGrayColor}]}> {read ? '已开启' : '去设置'}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.text}>方便及时获取跳槽潇洒大陆拉大</Text>
            <TouchableOpacity activeOpacity={0.8} style={[styles.partBox, Style.flexBetween, {height: text(56)}]}>
                <Text style={[styles.title, {color: Colors.defaultColor}]}>允许访问摄像头</Text>
                <TouchableOpacity
                    style={Style.flexRow}
                    onPress={() => {
                        handelRequest(3, camera);
                    }}>
                    <Text style={[styles.title, {color: Colors.lightGrayColor}]}> {camera ? '已开启' : '去设置'}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.text}>方便及时获取跳槽潇洒大陆拉大</Text>
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
