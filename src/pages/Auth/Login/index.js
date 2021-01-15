/*
 * @Date: 2021-01-13 16:52:27
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 10:48:32
 * @Description: 登录
 */
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {px as text} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Style, Colors} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
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
    register = () => {};
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
            <View style={styles.login_content}>
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
                    placeholder="请输入您的登录密码"
                    textContentType="password"
                    clearButtonMode="while-editing"
                    keyboardType={'ascii-capable'}
                />
                <TouchableOpacity onPress={this.jumpPage} style={styles.forget_password}>
                    <Text style={[styles.text, {color: Colors.btnColor}]}>忘记密码</Text>
                </TouchableOpacity>
                <Button title="登录" disabled={btnClick} onPress={this.register} style={{marginVertical: text(20)}} />
                <View style={Style.flexRowCenter}>
                    <TouchableOpacity
                        onPress={() => {
                            this.jumpPage('Register');
                        }}
                        style={styles.toLogin}>
                        <Text style={[styles.text, {color: Colors.btnColor}]}>立即注册</Text>
                    </TouchableOpacity>
                </View>
                <WechatView weChatLogin={this.weChatLogin} />
            </View>
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
