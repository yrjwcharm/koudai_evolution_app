/*
 * @Date: 2021-01-14 17:10:08
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 19:23:50
 * @Description: 微信登录
 */
import React from 'react';
import {Style, Colors} from '../../common/commonStyle';
import {px as text, px} from '../../utils/appUtil';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import * as WeChat from 'react-native-wechat-lib';
import Toast from '../../components/Toast';
import Storage from '../../utils/storage';
import {useDispatch, useSelector} from 'react-redux';
import {getUserInfo, updateVerifyGesture} from '../../redux/actions/userInfo';
import http from '../../services';
import FastImage from 'react-native-fast-image';
function Wechat(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const weChatLogin = () => {
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                let scope = 'snsapi_userinfo';
                let state = '_' + +new Date();
                try {
                    WeChat.sendAuthRequest(scope, state).then((response) => {
                        if (response.code) {
                            http.post('/auth/user/login_wx/20210101', {
                                code: response.code,
                                callback_jump: JSON.stringify(route?.params?.callback_jump),
                            }).then((res) => {
                                if (res.code == '000000') {
                                    if (res.result.bind_mobile) {
                                        dispatch(getUserInfo());
                                        dispatch(updateVerifyGesture(true));
                                        Storage.save('loginStatus', res.result);
                                        Toast.show('登录成功', {
                                            onHidden: () => {
                                                if (route.params?.go == 'forgotGesPwd') {
                                                    Storage.get('openGesturePwd').then((result) => {
                                                        if (res) {
                                                            res[`${userInfo.uid}`] = false;
                                                            Storage.save('openGesturePwd', res);
                                                        } else {
                                                            Storage.save('openGesturePwd', {
                                                                [`${userInfo.uid}`]: false,
                                                            });
                                                        }
                                                    });
                                                    Storage.get('gesturePwd').then((result) => {
                                                        if (result) {
                                                            result[`${userInfo.uid}`] = '';
                                                            Storage.save('gesturePwd', result);
                                                        } else {
                                                            Storage.save('gesturePwd', {[`${userInfo.uid}`]: ''});
                                                        }
                                                    });
                                                    navigation.replace('GesturePassword', {
                                                        option: 'firstSet',
                                                        pass: true,
                                                        fr: route.params?.fr || '',
                                                        callback_jump: route?.params?.callback_jump,
                                                    });
                                                } else if (res.result.app_tag_url) {
                                                    navigation.dispatch((state) => {
                                                        const routes = [
                                                            state.routes[0],
                                                            state.routes[state.routes.length - 1],
                                                        ];
                                                        return CommonActions.reset({
                                                            ...state,
                                                            routes,
                                                            index: 1,
                                                        });
                                                    });
                                                    const {path, params} = res.result.app_tag_url;
                                                    navigation.replace(path, params);
                                                } else if (
                                                    route.params?.fr == 'register' ||
                                                    route.params?.fr == 'login'
                                                ) {
                                                    navigation.pop(2);
                                                } else {
                                                    navigation.goBack();
                                                }
                                            },
                                        });
                                    } else {
                                        navigation.navigate('WechatLogin', {
                                            union_id: res.result.union_id,
                                            avatar: res.result.avatar,
                                            nickname: res.result.nickname,
                                            muid: res.result.muid,
                                            fr: route.params?.fr || '',
                                            callback_jump: route?.params?.callback_jump,
                                        });
                                    }
                                }
                            });
                        }
                    });
                } catch (e) {
                    if (e instanceof WeChat.WechatError) {
                        console.error(e.stack);
                    } else {
                        throw e;
                    }
                }
            } else {
                Toast.show('请安装微信');
            }
        });
    };
    return (
        <View style={[styles.Login, Style.flexCenter, props.style]}>
            <View style={styles.LoginWrap}>
                <View style={styles.LoginLine} />
                <Text style={[styles.text, {marginBottom: 12}]}>其他登录方式</Text>
                <View style={styles.LoginLine} />
            </View>
            <TouchableOpacity onPress={weChatLogin}>
                <FastImage source={require('../../assets/img/login/wechat_icon.png')} style={styles.LoginIcon} />
                <Text style={styles.LoginDesc}>微信登录</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Wechat;
const styles = StyleSheet.create({
    Login: {
        justifyContent: 'center',
        marginTop: text(30),
    },
    LoginWrap: {
        flexDirection: 'row',
    },
    text: {
        color: Colors.darkGrayColor,
        fontSize: px(12),
    },
    LoginLine: {
        borderColor: Colors.borderColor,
        borderTopWidth: 0.5,
        borderStyle: 'solid',
        width: 100,
        position: 'relative',
        top: text(5),
        marginHorizontal: px(10),
    },
    LoginDesc: {
        color: Colors.lightBlackColor,
        fontSize: px(13),
        marginTop: 10,
    },
    LoginIcon: {
        width: text(45),
        height: text(45),
        marginTop: px(10),
    },
});
