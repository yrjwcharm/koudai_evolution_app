/*
 * @Date: 2021-01-13 16:52:27
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-03 14:36:56
 * @Description: 登录
 */
import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {px as text, px} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Style, Colors} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
import http from '../../../services/';
import Storage from '../../../utils/storage';
import Toast from '../../../components/Toast';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            check: true,
            btnClick: true,
        };
    }
    login = () => {
        const {mobile, password} = this.state;
        http.post('/auth/user/login/20210101', {mobile, password}).then((res) => {
            if (res.code === '000000') {
                Toast.show('登录成功', {
                    onHidden: () => {
                        this.props.navigation.goBack();
                    },
                });
                Storage.save('loginStatus', res.result);
            } else {
                Toast.show(res.message);
            }
        });
    };
    jumpPage = (nav) => {
        this.props.navigation.navigate(nav);
    };
    onChangeMobile = (mobile) => {
        const {password} = this.state;
        this.setState({mobile, btnClick: !(mobile.length >= 11 && password.length >= 6)});
    };
    onChangePassword = (password) => {
        const {mobile} = this.state;
        this.setState({password, btnClick: !(mobile.length >= 11 && password.length >= 6)});
    };
    weChatLogin = () => {};
    render() {
        const {mobile, password, btnClick} = this.state;
        return (
            <ScrollView scrollEnabled={false} style={styles.login_content}>
                <Text style={styles.title}>手机号登录</Text>

                <InputView
                    title="手机号"
                    onChangeText={this.onChangeMobile}
                    value={mobile}
                    placeholder="请输入您的手机号"
                    maxLength={11}
                    textContentType="telephoneNumber"
                    keyboardType={'number-pad'}
                    autoFocus={true}
                    clearButtonMode="while-editing"
                />
                <InputView
                    title="登录密码"
                    onChangeText={this.onChangePassword}
                    value={password}
                    maxLength={20}
                    placeholder="请输入您的登录密码"
                    textContentType="password"
                    secureTextEntry={true}
                    clearButtonMode="while-editing"
                    keyboardType={'ascii-capable'}
                />
                <Text
                    onPress={() => {
                        this.jumpPage('CreateAccount');
                    }}
                    style={[styles.text, {color: Colors.btnColor, height: text(30), alignSelf: 'flex-end'}]}>
                    忘记密码
                </Text>
                <Button
                    title="登录"
                    disabled={btnClick}
                    onPress={this.login}
                    style={{marginBottom: text(20), marginTop: px(10)}}
                />

                <Text
                    onPress={() => {
                        this.props.navigation.replace('Register');
                    }}
                    style={[styles.text, {color: Colors.btnColor, alignSelf: 'center', height: px(30)}]}>
                    立即注册
                </Text>

                <WechatView weChatLogin={this.weChatLogin} style={{marginTop: px(16)}} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    login_content: {
        padding: text(23),
        flex: 1,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: text(22),
        fontWeight: '500',
        marginBottom: text(48),
        marginTop: text(20),
    },
    text: {
        color: '#666666',
        fontSize: 12,
    },
    aggrement_text: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
        flexWrap: 'wrap',
        fontSize: text(12),
        lineHeight: text(18),
    },
});
