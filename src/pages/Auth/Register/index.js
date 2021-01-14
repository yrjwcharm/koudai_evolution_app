/*
 * @Date: 2021-01-13 16:52:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 15:50:57
 * @Description: 注册
 */
import React, {Component} from 'react';
import {Image, View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {px as text} from '../../../utils/appUtil';
import CheckBox from '../../../components/CheckBox';
import {Button} from '../../../components/Button';
import {Style, Colors} from '../../../common/commonStyle';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            check: true,
        };
    }
    register = () => {};
    jumpPage = () => {
        this.props.navigation.navigate('Login');
    };
    render() {
        return (
            <View style={styles.LoginContent}>
                <View style={styles.LoginInputTel}>
                    {/* <Image source={require('../../assets/login/phone.png')} style={styles.LoginPhoneIcon} /> */}
                    <TextInput
                        onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                        value={this.state.text}
                        placeholder="请输入您的手机号"
                        placeholderTextColor="#BBBBBB"
                        style={styles.input}
                        maxLength={11}
                        keyboardType={'number-pad'}
                    />
                </View>

                <View style={{marginTop: text(20), flexDirection: 'row'}}>
                    <CheckBox
                        checked={this.state.check}
                        onChange={(check) => {
                            this.setState({
                                check: !check,
                            });
                        }}
                    />
                    <Text style={styles.aggrement_text}>
                        <Text style={{fontSize: text(12)}}>我已阅读并同意</Text>
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
                    <Text>已有账号</Text>
                    <TouchableOpacity onPress={this.jumpPage} style={styles.toLogin}>
                        <Text style={{color: Colors.btnColor}}>去登录</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    LoginContent: {
        padding: text(23),
        flex: 1,
        backgroundColor: '#fff',
    },
    toLogin: {
        marginLeft: 2,
    },

    LoginInputTel: {
        height: text(50),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: text(14),
    },
    input: {
        letterSpacing: 1,
        color: '#000',
        fontSize: text(16),
        flex: 1,
    },
    LoginBtn: {
        backgroundColor: '#0052CD',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginTop: 20,
        borderRadius: 10,
    },
    LoginBtnText: {
        color: '#fff',
    },
    LoginIcon: {
        width: text(45),
        height: text(45),
    },
    Login: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginTop: text(120),
    },
    LoginWrap: {
        flexDirection: 'row',
        // alignItems: 'center'
    },
    LoginTitle: {
        color: '#666666',
        fontSize: 12,
        marginBottom: 15,
    },
    LoginLine: {
        borderColor: '#BBBBBB',
        borderTopWidth: text(0.5),
        borderStyle: 'solid',
        width: 100,
        position: 'relative',
        top: text(5),
        marginHorizontal: 10,
    },
    LoginDesc: {
        color: '#333',
        fontSize: 13,
        marginTop: 10,
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
