/*
 * @Date: 2021-01-13 16:52:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 10:49:26
 * @Description: 注册
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {px as text} from '../../../utils/appUtil';
import CheckBox from '../../../components/CheckBox';
import {Button} from '../../../components/Button';
import {Style, Colors} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
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
    weChatLogin = () => {};
    render() {
        return (
            <View style={styles.login_content}>
                <Text style={styles.title}>欢迎注册理财魔方</Text>
                <InputView
                    title="手机号"
                    onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                    value={this.state.phoneNumber}
                    placeholder="请输入您的手机号"
                    maxLength={11}
                    autoFocus={true}
                    keyboardType={'number-pad'}
                />
                <View style={{marginTop: text(20), flexDirection: 'row'}}>
                    <CheckBox
                        checked={this.state.check}
                        onChange={(check) => {
                            this.setState({
                                check,
                            });
                        }}
                    />
                    <Text style={styles.aggrement_text}>
                        <Text style={styles.text}>我已阅读并同意</Text>
                        {/* {agreements.map((item, index) => {
                        return (
                            <Text
                                onPress={() => {
                                    this.props.navigation.navigate('Article', {title: item.title, type: item.id});
                                }}
                                style={{fontSize: text(12), color: commonStyle.themeColor}}
                                key={index}>
                                {item.title}
                            </Text>
                        );
                    })} */}
                    </Text>
                </View>
                <Button title="立即注册" onPress={this.register} style={{marginVertical: text(20)}} />
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
