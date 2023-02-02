/*
 * @Date: 2021-01-15 10:40:08
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-02 16:00:31
 * @Description:设置登录密码
 */
import React, {Component} from 'react';
import InputView from '../input';
import {px as text, handlePhone, inputInt} from '../../../utils/appUtil';
import {View, Text, TouchableHighlight, StyleSheet, ScrollView} from 'react-native';
import {Colors} from '../../../common/commonStyle';
import {Button} from '../../../components/Button';
import {Style, Font} from '../../../common/commonStyle';
import http from '../../../services/';
import Toast from '../../../components/Toast';
import Storage from '../../../utils/storage';
import {connect} from 'react-redux';
import {getUserInfo, getVerifyGesture, getAppConfig} from '../../../redux/actions/userInfo';
import _ from 'lodash';
import {CommonActions} from '@react-navigation/native';
import base64 from '../../../utils/base64';
class SetLoginPassword extends Component {
    state = {
        code: '',
        password: '',
        re_password: '',
        btnClick: true,
        verifyText: '获取验证码',
        second: 60,
        code_btn_click: true,
    };
    fr = this.props.route?.params?.fr;
    union_id = this.props.route?.params?.union_id;
    nickname = this.props.route?.params?.nickname;
    avatar = this.props.route?.params?.avatar;
    componentDidMount() {
        this.sendCode();
    }
    register = () => {
        const {code, password, re_password} = this.state;
        if (this.fr == 'forget') {
            const reg = /(?!\d+$)(?![a-zA-Z]+$)(?![!"#$%&'()*+,-./:;<=>?@[\\]\^_`{\|}~]+$).{8,20}/;
            if (password.length < 8 || password.length > 20) {
                Toast.show('密码必须8-20位');
                return false;
            } else if (!reg.test(password)) {
                Toast.show('密码必须包含数字、英文和符号至少两项');
                return false;
            }
            const leftChar = password
                .replace(/\d/g, '')
                .replace(/[a-zA-Z]/g, '')
                .replace(/[_!"#$%&'()*+,-./:;<=>?@[\]^`{|}~\\]/g, '');
            if (leftChar) {
                Toast.show('密码含有无效字符');
                return false;
            }
        }
        //找回登录密码
        if (this.fr == 'forget') {
            if (password != re_password) {
                Toast.show('输入的新密码不一致');
                return;
            }
            let toast = Toast.showLoading('正在修改...');
            http.post('passport/find_login_password/20210101', {
                mobile: this.props.route?.params?.mobile,
                verify_code: code,
                password,
            }).then((res) => {
                Toast.hide(toast);
                if (res.code === '000000') {
                    Toast.show('登录密码修改成功');
                    this.props.navigation.pop(2);
                } else {
                    Toast.show(res.message);
                }
            });
        } else if (this.union_id) {
            // 绑定手机号
            let toast = Toast.showLoading('正在绑定手机号...');
            http.post('/auth/bind_mobile/20210101', {
                mobile: this.props.route?.params?.mobile,
                verify_code: code,
                password,
                union_id: this.union_id,
                avatar: this.avatar,
                nickname: this.nickname,
            }).then((res) => {
                Toast.hide(toast);
                if (res.code === '000000') {
                    Toast.show('绑定成功');
                    this.props.getUserInfo();
                    this.props.getAppConfig();
                    this.props.getVerifyGesture(true);
                    if (this.props.route?.params?.callback_jump) {
                        let {path, params} = this.props.route?.params?.callback_jump;
                        this.props.navigation.dispatch((state) => {
                            const routes = [state.routes[0], state.routes[state.routes.length - 1]];
                            return CommonActions.reset({
                                ...state,
                                routes,
                                index: 1,
                            });
                        });
                        this.props.navigation.replace(path, params);
                    } else if (this.props.route?.params?.fr) {
                        this.props.navigation.pop(4);
                    } else {
                        this.props.navigation.pop(3);
                    }
                    Storage.save('loginStatus', res.result.login_result);
                } else {
                    Toast.show(res.message);
                }
            });
        } else {
            // 设置登录密码
            let toast = Toast.showLoading('正在注册...');
            http.post('/auth/user/register/20210101', {
                mobile: this.props.route?.params?.mobile,
                verify_code: code,
                callback_jump: JSON.stringify(this.props.route?.params.callback_jump),
            }).then((res) => {
                Toast.hide(toast);
                if (res.code === '000000') {
                    Toast.show('注册成功');
                    this.props.getUserInfo();
                    this.props.getAppConfig();
                    this.props.getVerifyGesture(true);
                    if (res.result.url) {
                        const {path, params = {}} = res.result.url;
                        params.popNum = this.props.route.params?.fr ? 3 : 2;
                        this.props.navigation.replace(path, params);
                    } else if (this.props.route?.params.callback_jump) {
                        let {path, params} = this.props.route?.params?.callback_jump;
                        this.props.navigation.dispatch((state) => {
                            const routes = [state.routes[0], state.routes[state.routes.length - 1]];
                            return CommonActions.reset({
                                ...state,
                                routes,
                                index: 1,
                            });
                        });
                        this.props.navigation.replace(path, params);
                    } else if (this.props.route?.params?.redirect) {
                        this.props.navigation.dispatch((state) => {
                            // Remove the home route from the stack
                            const routes = state.routes.filter((r) => {
                                return r.name !== 'Register';
                            });
                            return CommonActions.reset({
                                ...state,
                                routes,
                                index: routes.length - 1,
                            });
                        });
                        this.props.navigation.replace(
                            this.props.route?.params?.redirect.path,
                            this.props.route?.params?.redirect.params
                        );
                    } else if (this.props.route?.params?.fr) {
                        this.props.navigation.pop(3);
                    } else {
                        this.props.navigation.pop(2);
                    }
                    Storage.save('loginStatus', res.result.login_result);
                } else {
                    Toast.show(res.message);
                }
            });
        }
    };
    sendCode = () => {
        const {code_btn_click} = this.state;
        if (code_btn_click) {
            http.post('/passport/send_verify_code/20210101', {
                mobile: this.props.route?.params?.mobile,
                operation: this.fr == 'forget' ? 'password_reset' : this.union_id ? 'bind_mobile' : 'passport_create',
            }).then((res) => {
                if (res.code == '000000') {
                    Toast.show('验证码发送成功');
                    this.setState({code_btn_click: false});
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
        const {password, re_password} = this.state;
        let _code = inputInt(code);
        if (this.fr == 'forget') {
            this.setState({
                code: _code,
                btnClick: !(_code.length >= 6 && password.length >= 8 && re_password.length == password.length),
            });
        } else {
            this.setState({
                code: _code,
                btnClick: !(_code.length >= 6),
            });
        }
    };
    onChangePassword = (password) => {
        const {code, re_password} = this.state;
        if (this.fr == 'forget') {
            this.setState({
                password: password,
                btnClick: !(code.length >= 6 && password.length >= 8 && re_password.length >= 8),
            });
        } else {
        }
    };
    onChangeRePassword = (re_password) => {
        const {code, password} = this.state;
        this.setState({
            re_password,
            btnClick: !(code.length >= 6 && password.length >= 8 && re_password.length == password.length),
        });
    };
    render() {
        const {code, password, btnClick, verifyText, code_btn_click, re_password} = this.state;
        return (
            <ScrollView style={styles.login_content} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>请输入短信验证码</Text>
                <Text style={styles.title_desc}>验证码已发送至{handlePhone(this.props.route?.params?.mobile)}</Text>
                <View style={[Style.flexRowCenter, styles.code_view]}>
                    <InputView
                        title="验证码"
                        onChangeText={this.onChangeCode}
                        value={code}
                        placeholder="请输入验证码"
                        maxLength={6}
                        keyboardType={'number-pad'}
                        autoFocus={true}
                        clearButtonMode="while-editing"
                        style={styles.code_input}
                    />

                    <TouchableHighlight
                        underlayColor="#f4ae86"
                        style={[styles.verify_button, Style.flexCenter, !code_btn_click && styles.disabled]}
                        onPress={_.debounce(this.sendCode, 500)}>
                        <Text style={{color: '#fff', fontSize: text(12)}}>{verifyText}</Text>
                    </TouchableHighlight>
                </View>

                {this.fr == 'forget' ? (
                    <InputView
                        title={'新密码'}
                        onChangeText={this.onChangePassword}
                        value={password}
                        placeholder="8-20位数字、英文或符号"
                        maxLength={20}
                        secureTextEntry={true}
                        keyboardType={'ascii-capable'}
                        clearButtonMode="while-editing"
                    />
                ) : null}
                {this.fr == 'forget' ? (
                    <InputView
                        title="确认密码"
                        onChangeText={this.onChangeRePassword}
                        value={re_password}
                        placeholder="请输入相同的新密码"
                        maxLength={20}
                        secureTextEntry={true}
                        keyboardType={'ascii-capable'}
                        clearButtonMode="while-editing"
                    />
                ) : null}
                <Button
                    title={this.fr == 'forget' ? '确定' : this.union_id ? '完成绑定' : '完成注册'}
                    disabled={btnClick}
                    onPress={this.register}
                    style={{marginVertical: text(20)}}
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    getUserInfo,
    getVerifyGesture,
    getAppConfig,
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
        fontWeight: 'bold',
        marginBottom: text(11),
        color: Colors.defaultColor,
        marginTop: text(20),
    },
    title_desc: {
        color: Colors.lightBlackColor,
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
        paddingRight: 0,
    },
    disabled: {
        opacity: 0.6,
    },
});
