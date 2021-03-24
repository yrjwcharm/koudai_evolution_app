/*
 * @Date: 2021-01-14 17:10:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-24 21:21:06
 * @Description: 微信登录
 */
import React from 'react';
import {Style, Colors} from '../../common/commonStyle';
import {px as text, px} from '../../utils/appUtil';
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as WeChat from 'react-native-wechat-lib';
import Toast from '../../components/Toast';
import Storage from '../../utils/storage';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
import http from '../../services';
function Wechat(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const weChatLogin = () => {
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                let scope = 'snsapi_userinfo';
                let state = '_' + +new Date();
                try {
                    WeChat.sendAuthRequest(scope, state).then((response) => {
                        if (response.code) {
                            http.post('/auth/user/login_wx/20210101', {code: response.code}).then((res) => {
                                if (res.code == '000000') {
                                    if (res.result.bind_mobile) {
                                        dispatch(getUserInfo());
                                        Storage.save('loginStatus', res.result);
                                        Toast.show('登录成功', {
                                            onHidden: () => {
                                                navigation.goBack();
                                            },
                                        });
                                    } else {
                                        navigation.navigate('WechatLogin', {
                                            union_id: res.result.union_id,
                                            avatar: res.result.avatar,
                                            nickname: res.result.nickname,
                                            muid: res.result.muid,
                                            fr: props.fr,
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
                <Image source={require('../../assets/img/login/wechat_icon.png')} style={styles.LoginIcon} />
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
        color: '#666666',
        fontSize: px(12),
    },
    LoginLine: {
        borderColor: Colors.lineColor,
        borderTopWidth: 0.5,
        borderStyle: 'solid',
        width: 100,
        position: 'relative',
        top: text(5),
        marginHorizontal: 10,
    },
    LoginDesc: {
        color: '#333',
        fontSize: 13,
        marginTop: 10,
    },
    LoginIcon: {
        width: text(45),
        height: text(45),
        marginTop: px(10),
    },
});
