/*
 * @Date: 2021-01-13 16:52:27
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-22 18:52:46
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
        http.post('http://kapi-web.ll.mofanglicai.com.cn:10080/auth/user/login/20210101', {mobile, password}).then(
            (res) => {
                Storage.save('loginStatus', res.result);
                // this.props.navigation.goBack();
            }
        );
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
                <TouchableOpacity
                    onPress={() => {
                        this.jumpPage('CreateAccount');
                    }}
                    style={styles.forget_password}>
                    <Text style={[styles.text, {color: Colors.btnColor, height: text(30)}]}>忘记密码</Text>
                </TouchableOpacity>
                <Button
                    title="登录"
                    disabled={btnClick}
                    onPress={this.login}
                    style={{marginBottom: text(26), marginTop: px(10)}}
                />
                <View style={Style.flexRowCenter}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.replace('Register');
                        }}
                        style={styles.toLogin}>
                        <Text style={[styles.text, {color: Colors.btnColor}]}>立即注册</Text>
                    </TouchableOpacity>
                </View>
                <WechatView weChatLogin={this.weChatLogin} />
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
    forget_password: {
        alignItems: 'flex-end',
    },
    toLogin: {
        marginLeft: 2,
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
