/*
 * @Date: 2021-01-14 17:10:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 16:17:54
 * @Description: 微信登录
 */
import React from 'react';
import {Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as WeChat from 'react-native-wechat-lib';
import Toast from '../../components/Toast';


function Wechat(props) {
    const navigation = useNavigation();
    const weChatLogin = () => {
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                let scope = 'snsapi_userinfo';
                let state = '_' + +new Date();
                Wechat.sendAuthRequest(scope, state).then((response) => {
                    console.log(response);
                });
                try {
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
        navigation.navigate('WechatLogin');
    };
    return (
        <View style={[styles.Login, Style.flexCenter]}>
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
        fontSize: 12,
    },
    LoginLine: {
        borderColor: '#BBBBBB',
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
    },
});
