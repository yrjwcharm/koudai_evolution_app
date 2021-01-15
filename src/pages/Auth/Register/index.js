/*
 * @Date: 2021-01-13 16:52:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 12:07:52
 * @Description: 注册
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {px as text} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Style, Colors} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
import Agreements from '../../../components/Agreements';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            check: true,
        };
    }
    register = () => {};
    jumpPage = (nav) => {
        this.props.navigation.navigate(nav);
    };
    render() {
        return (
            <View style={styles.login_content}>
                <Text style={styles.title}>请输入短信验证码</Text>
                <InputView
                    title="手机号"
                    onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                    value={this.state.phoneNumber}
                    placeholder="请输入您的手机号"
                    maxLength={11}
                    autoFocus={true}
                    keyboardType={'number-pad'}
                />
                <Agreements
                    onChange={(check) => {
                        this.setState({check});
                    }}
                />
                <Button title="立即注册" onPress={this.register} style={{marginVertical: text(26)}} />
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
        fontSize: text(12),
    },
});
