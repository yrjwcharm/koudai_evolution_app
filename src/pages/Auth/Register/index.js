/*
 * @Date: 2021-01-13 16:52:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-23 19:04:56
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
        http.post('http://kapi-web.ll.mofanglicai.com.cn:10080/auth/user/mobile_available/20210101', {mobile}).then(
            (res) => {
                if (res.code === '000000') {
                    this.props.navigation.navigate('SetLoginPassword', {mobile});
                } else {
                    Toast.show(res.message);
                }
            }
        );
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
            <ScrollView style={styles.login_content}>
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
                />
                <Button
                    title="立即注册"
                    disabled={btnClick}
                    onPress={this.register}
                    style={{marginVertical: text(26)}}
                />
                <View style={Style.flexRowCenter}>
                    <Text style={styles.text}>已有账号</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.jumpPage('Login');
                        }}
                        style={styles.toLogin}>
                        <Text style={[styles.text, {color: Colors.btnColor}]}>去登录</Text>
                    </TouchableOpacity>
                </View>
                <WechatView />
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
    toLogin: {
        marginLeft: 2,
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
