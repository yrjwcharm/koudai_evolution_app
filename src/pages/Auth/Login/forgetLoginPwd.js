/*
 * @Date: 2021-03-09 16:20:24
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-20 21:14:37
 * @Description:找回登录密码
 */
/*
 * @Date: 2021-01-13 16:52:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-06 16:28:23
 * @Description: 注册
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {px as text} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Style, Colors} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
import Agreements from '../../../components/Agreements';
import http from '../../../services/';
import Toast from '../../../components/Toast';
import FastImage from 'react-native-fast-image';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            check: true,
            btnClick: true,
        };
    }
    register = () => {
        global.LogTool('Register');
        const {mobile} = this.state;
        http.get('passport/mobile/register_check/20210101', {mobile}).then((res) => {
            if (res.code === '000000') {
                this.props.navigation.navigate('SetLoginPassword', {mobile, fr: 'forget'});
            } else {
                Toast.show(res.message);
            }
        });
    };
    onChangeMobile = (mobile) => {
        this.setState({mobile, btnClick: !(mobile.length >= 11)});
    };
    jumpPage = (nav) => {
        global.LogTool();
        this.props.navigation.replace(nav);
    };
    render() {
        const {btnClick, mobile} = this.state;
        return (
            <ScrollView style={styles.login_content} keyboardShouldPersistTaps="handled">
                <View style={{marginBottom: text(30), marginTop: text(20)}}>
                    <Text style={styles.title}>找回登录密码</Text>
                </View>
                <Text style={{color: '#666666', marginBottom: 16}}>请输入注册手机号以接收验证码</Text>
                <InputView
                    title="手机号"
                    onChangeText={this.onChangeMobile}
                    value={mobile}
                    placeholder="请输入您的手机号"
                    maxLength={11}
                    autoFocus={true}
                    clearButtonMode="while-editing"
                    keyboardType={'number-pad'}
                />

                <Button title="下一步" disabled={btnClick} onPress={this.register} style={{marginVertical: text(26)}} />
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
    },
    text: {
        color: '#666666',
        fontSize: text(12),
    },
});
