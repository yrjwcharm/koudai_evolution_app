/*
 * @Date: 2021-01-15 10:40:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 10:49:44
 * @Description:设置登录密码
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputView from '../input';
import {px as text} from '../../../utils/appUtil';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
export default class WechatLogin extends Component {
    static propTypes = {
        prop: PropTypes,
    };

    render() {
        return (
            <View style={styles.login_content}>
                <Text style={styles.title}>欢迎注册理财魔方</Text>
                {/* <InputView
                    title="手机号"
                    onChangeText={this.onChangeMobile}
                    value={mobile}
                    placeholder="请输入您的手机号"
                    maxLength={11}
                    textContentType="telephoneNumber"
                    keyboardType={'number-pad'}
                    autoFocus={true}
                    clearButtonMode="while-editing"
                /> */}
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
        marginBottom: text(48),
        marginTop: text(20),
    },
});
