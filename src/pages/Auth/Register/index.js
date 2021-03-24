/*
 * @Date: 2021-01-13 16:52:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-24 21:20:19
 * @Description: 注册
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {px as text, inputInt} from '../../../utils/appUtil';
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
            check: false,
            btnClick: true,
        };
    }
    register = () => {
        global.LogTool('Register');
        const {mobile, check} = this.state;
        if (!check) {
            Toast.show('请勾选并同意理财魔方相关协议');
            return;
        }
        http.post('/auth/user/mobile_available/20210101', {mobile}).then((res) => {
            if (res.code === '000000') {
                this.props.navigation.navigate('SetLoginPassword', {mobile});
            } else {
                Toast.show(res.message);
            }
        });
    };

    onChangeMobile = (mobile) => {
        let value = inputInt(mobile);
        this.setState({mobile: value, btnClick: !(value.length >= 11)});
    };
    jumpPage = (nav, params) => {
        this.props.navigation.navigate(nav, params);
    };
    render() {
        const {btnClick, mobile} = this.state;
        return (
            <ScrollView style={styles.login_content} keyboardShouldPersistTaps="handled">
                <View style={[Style.flexRow, {marginBottom: text(36), marginTop: text(20)}]}>
                    <FastImage
                        style={{width: text(42), height: text(42), marginRight: text(8)}}
                        source={require('../../../assets/img/login/registerLogo.png')}
                    />
                    <Text style={styles.title}>欢迎注册理财魔方</Text>
                </View>
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
                <Agreements
                    onChange={(check) => {
                        this.setState({check});
                    }}
                    check={false}
                    data={[
                        {
                            title: '《用户协议》',
                            id: 0,
                        },

                        {
                            title: '《隐私权政策》',
                            id: 32,
                        },
                    ]}
                />
                <Button
                    title="立即注册"
                    disabled={btnClick}
                    onPress={this.register}
                    style={{marginVertical: text(26)}}
                />
                <View style={Style.flexRowCenter}>
                    <Text style={styles.text}>已有账号</Text>
                    <Text
                        onPress={() => {
                            this.jumpPage('Login', {fr: 'register'});
                        }}
                        style={[styles.text, {color: Colors.btnColor, marginLeft: 2}]}>
                        去登录
                    </Text>
                </View>
                <WechatView fr="register" />
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
