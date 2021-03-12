/*
 * @Date: 2021-01-15 10:40:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-11 14:27:22
 * @Description:设置登录密码
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputView from '../input';
import {px as text, handlePhone} from '../../../utils/appUtil';
import {View, Text, TouchableHighlight, StyleSheet, ScrollView} from 'react-native';
import {Colors} from '../../../common/commonStyle';
import {Button} from '../../../components/Button';
import {Style, Font} from '../../../common/commonStyle';
import http from '../../../services/';
import Toast from '../../../components/Toast';
import Storage from '../../../utils/storage';
import {connect} from 'react-redux';
import {getUserInfo} from '../../../redux/actions/userInfo';
class SetLoginPassword extends Component {
    static propTypes = {
        prop: PropTypes,
    };
    state = {
        code: '',
        password: '',
        btnClick: true,
        verifyText: '重新发送验证码',
        second: 60,
        code_btn_click: true,
    };
    componentDidMount() {
        Storage.delete('loginStatus');
        this.sendCode();
    }
    register = () => {
        const {code, password} = this.state;
        let toast = Toast.showLoading('正在注册...');
        http.post('/auth/user/register/20210101', {
            mobile: this.props.route?.params?.mobile,
            verify_code: code,
            password,
        }).then((res) => {
            Toast.hide(toast);
            if (res.code === '000000') {
                Toast.show('注册成功');
                http.post('/auth/user/login/20210101', {
                    mobile: this.props.route?.params?.mobile,
                    password,
                }).then((data) => {
                    this.props.navigation.goBack(2);
                    Storage.save('loginStatus', data.result);
                });
            } else {
                Toast.show(res.message);
            }
        });
    };
    sendCode = () => {
        const {code_btn_click} = this.state;
        if (code_btn_click) {
            http.post('/passport/send_verify_code/20210101', {
                mobile: this.props.route?.params?.mobile,
                operation: 'passport_create',
            }).then((res) => {
                if (res.code == '000000') {
                    Toast.show('验证码发送成功');
                    this.timer();
                } else {
                    Toast.show(res.message);
                }
            });
        }
    };
    time = null;
    //倒计时函数
    timer = () => {
        let {second} = this.state;
        this.setState({
            verifyText: second + '秒重发',
        });
        this.time = setTimeout(() => {
            this.setState({
                second: --second,
                verifyText: second + '秒重发',
                code_btn_click: false,
            });
            if (second <= 0) {
                clearInterval(this.time);
                this.setState({
                    second: 60,
                    verifyText: '重新发送验证码',
                    code_btn_click: true,
                });
            } else {
                this.timer();
            }
        }, 1000);
    };
    componentWillUnmount() {
        this.time && clearInterval(this.time);
    }
    onChangeCode = (code) => {
        const {password} = this.state;
        this.setState({code, btnClick: !(code.length >= 6 && password.length >= 6)});
    };
    onChangePassword = (password) => {
        const {code} = this.state;
        this.setState({password, btnClick: !(code.length >= 6 && password.length >= 6)});
    };
    render() {
        const {code, password, btnClick, verifyText, code_btn_click} = this.state;
        console.log(code_btn_click);
        return (
            <ScrollView style={styles.login_content}>
                <Text style={styles.title}>请输入短信验证码</Text>
                <Text style={styles.title_desc}>验证码已发送至{handlePhone(this.props.route?.params?.mobile)}</Text>
                <View style={[Style.flexRowCenter, styles.code_view]}>
                    <InputView
                        title="验证码"
                        onChangeText={this.onChangeCode}
                        value={code}
                        placeholder="验证码"
                        maxLength={6}
                        keyboardType={'number-pad'}
                        autoFocus={true}
                        clearButtonMode="while-editing"
                        style={styles.code_input}
                    />

                    <TouchableHighlight
                        underlayColor="#f4ae86"
                        style={[styles.verify_button, Style.flexCenter, !code_btn_click && styles.disabled]}
                        onPress={this.sendCode}>
                        <Text style={{color: '#fff', fontSize: text(12)}}>{verifyText}</Text>
                    </TouchableHighlight>
                </View>

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
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    getUserInfo,
};
export default connect(mapStateToProps, mapDispatchToProps)(SetLoginPassword);
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
    verify_button: {
        backgroundColor: '#EF8743',
        fontSize: Font.textH3,
        height: text(50),
        borderTopRightRadius: text(6),
        borderBottomRightRadius: text(6),
        width: text(100),
    },
    code_view: {
        marginBottom: text(12),
    },
    code_input: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0,
        flex: 1,
    },
    disabled: {
        opacity: 0.6,
    },
});
