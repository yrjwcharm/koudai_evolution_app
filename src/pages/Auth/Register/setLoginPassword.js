/*
 * @Date: 2021-01-15 10:40:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 15:05:28
 * @Description:设置登录密码
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputView from '../input';
import {px as text} from '../../../utils/appUtil';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../../common/commonStyle';
import {Button} from '../../../components/Button';
// import {Colors} from '../../../common/commonStyle';
export default class WechatLogin extends Component {
    static propTypes = {
        prop: PropTypes,
    };
    state = {
        code: '',
        password: '',
        btnClick: true,
    };
    onChangeCode = (code) => {
        const {password} = this.state;
        this.setState({code, btnClick: !(code.length >= 6 && password.length >= 6)});
    };
    onChangePassword = (password) => {
        const {code} = this.state;
        this.setState({password, btnClick: !(code.length >= 6 && password.length >= 6)});
    };
    render() {
        const {code, password, btnClick} = this.state;
        return (
            <View style={styles.login_content}>
                <Text style={styles.title}>欢迎注册理财魔方</Text>
                <Text style={styles.title_desc}>验证码已发送至138****8888</Text>

                <InputView
                    title="验证码"
                    onChangeText={this.onChangeCode}
                    value={code}
                    placeholder="请输入验证码"
                    maxLength={6}
                    keyboardType={'number-pad'}
                    autoFocus={true}
                    clearButtonMode="while-editing"
                />
                <InputView
                    title="登录密码"
                    onChangeText={this.onChangePassword}
                    value={password}
                    placeholder="6-20位 数字或字母组合"
                    maxLength={20}
                    secureTextEntry={true}
                    keyboardType={'ascii-capable'}
                    clearButtonMode="while-editing"
                />
                <Button
                    title="立即注册"
                    disabled={btnClick}
                    onPress={this.register}
                    style={{marginVertical: text(26)}}
                />
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
    title: {
        fontSize: text(22),
        fontWeight: '500',
        marginBottom: text(11),
        marginTop: text(20),
    },
    title_desc: {
        color: Colors.darkGrayColor,
        fontSize: text(14),
        marginBottom: text(24),
    },
});
