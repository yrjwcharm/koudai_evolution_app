/*
 * @Date: 2021-01-13 16:52:27
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-04-21 16:43:18
 * @Description: 登录
 */
import React, {Component} from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import {px as text, px, inputInt} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Colors} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
import http from '../../../services/';
import Storage from '../../../utils/storage';
import Toast from '../../../components/Toast';
import {connect} from 'react-redux';
import {getUserInfo, getVerifyGesture} from '../../../redux/actions/userInfo';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: this.props.route?.params?.mobile,
            password: '',
            check: true,
            btnClick: true,
        };
    }
    login = () => {
        const {mobile, password} = this.state;
        const userInfo = this.props.userInfo?.toJS();
        let toast = Toast.showLoading('正在登录...');
        http.post('/auth/user/login/20210101', {mobile, password}).then((res) => {
            Toast.hide(toast);
            if (res.code === '000000') {
                this.props.getUserInfo();
                this.props.getVerifyGesture(true);
                Toast.show('登录成功', {
                    onHidden: () => {
                        if (this.props.route.params?.go == 'forgotGesPwd') {
                            Storage.get('openGesturePwd').then((result) => {
                                if (res) {
                                    res[`${userInfo.uid}`] = false;
                                    Storage.save('openGesturePwd', res);
                                } else {
                                    Storage.save('openGesturePwd', {[`${userInfo.uid}`]: false});
                                }
                            });
                            Storage.get('gesturePwd').then((result) => {
                                if (result) {
                                    result[`${userInfo.uid}`] = '';
                                    Storage.save('gesturePwd', result);
                                } else {
                                    Storage.save('gesturePwd', {[`${userInfo.uid}`]: ''});
                                }
                            });
                            this.props.navigation.replace('GesturePassword', {
                                option: 'firstSet',
                                pass: true,
                                fr: this.props.route.params?.fr || '',
                            });
                        } else if (
                            this.props.route?.params?.fr == 'register' ||
                            this.props.route?.params?.fr == 'login'
                        ) {
                            this.props.navigation.pop(2);
                        } else {
                            this.props.navigation.goBack();
                        }
                    },
                });
                Storage.save('loginStatus', res.result);
            } else {
                Toast.show(res.message);
            }
        });
    };
    jumpPage = (nav) => {
        this.props.navigation.navigate(nav);
    };
    onChangeMobile = (mobile) => {
        const {password} = this.state;
        let _mobile = inputInt(mobile);
        this.setState({mobile: _mobile, btnClick: !(_mobile.length >= 11 && password.length >= 6)});
    };
    onChangePassword = (password) => {
        const {mobile} = this.state;
        this.setState({password, btnClick: !(mobile.length >= 11 && password.length >= 6)});
    };
    weChatLogin = () => {};
    render() {
        const {mobile, password, btnClick} = this.state;
        return (
            <ScrollView
                scrollEnabled={false}
                style={styles.login_content}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>手机号登录</Text>

                <InputView
                    title="手机号"
                    onChangeText={this.onChangeMobile}
                    value={mobile}
                    placeholder="请输入您的手机号"
                    maxLength={11}
                    textContentType="telephoneNumber"
                    keyboardType={'number-pad'}
                    autoFocus={true}
                    clearButtonMode="while-editing"
                />
                <InputView
                    title="登录密码"
                    onChangeText={this.onChangePassword}
                    value={password}
                    maxLength={20}
                    placeholder="请输入您的登录密码"
                    textContentType="password"
                    secureTextEntry={true}
                    clearButtonMode="while-editing"
                    keyboardType={'ascii-capable'}
                />
                <Text
                    onPress={() => {
                        this.jumpPage('ForgetLoginPwd');
                    }}
                    style={[styles.text, {color: Colors.btnColor, height: text(30), alignSelf: 'flex-end'}]}>
                    忘记密码
                </Text>
                <Button
                    title="登录"
                    disabled={btnClick}
                    onPress={this.login}
                    style={{marginBottom: text(20), marginTop: px(10)}}
                />

                <Text
                    onPress={() => {
                        if (this.props.route?.params?.fr) {
                            this.props.navigation.navigate('Register', {go: this.props.route.params?.go || ''});
                        } else {
                            this.props.navigation.navigate('Register', {
                                fr: 'login',
                                go: this.props.route.params?.go || '',
                            });
                        }
                    }}
                    style={[styles.text, {color: Colors.btnColor, alignSelf: 'center', height: px(30)}]}>
                    立即注册
                </Text>

                <WechatView
                    weChatLogin={this.weChatLogin}
                    fr={this.props.route?.params?.fr || ''}
                    style={{marginTop: px(16)}}
                />
            </ScrollView>
        );
    }
}
const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    getUserInfo,
    getVerifyGesture,
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
const styles = StyleSheet.create({
    login_content: {
        padding: text(23),
        flex: 1,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: text(22),
        fontWeight: 'bold',
        marginBottom: text(48),
        color: Colors.defaultColor,
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
