/*
 * @Date: 2021-01-13 16:52:27
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-09 16:44:29
 * @Description: 登录
 */
import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Dimensions, StatusBar} from 'react-native';
import {px as text, px, inputInt} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Colors, Font, Style} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
import http from '../../../services/';
import Storage from '../../../utils/storage';
import Toast from '../../../components/Toast';
import {connect} from 'react-redux';
import _ from 'lodash';
import {getUserInfo, getVerifyGesture, getAppConfig} from '../../../redux/actions/userInfo';
import {Modal} from '../../../components/Modal';
import base64 from '../../../utils/base64';
import Agreements from '../../../components/Agreements';
import memoize from 'memoize-one';
import {HeaderHeightContext} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1, //登录方式
            mobile: this.props.route?.params?.mobile,
            password: '',
            check: true,
            agreeState: false,
            verifyText: '获取验证码',
            code: '',
            code_btn_click: true,
            second: 60,
        };
    }

    login = () => {
        const {mobile, password, type, code} = this.state;
        const userInfo = this.props.userInfo?.toJS();
        let toast = Toast.showLoading('正在登录...');
        const url = ['/auth/user/login/20210101', '/auth/user/login_captcha/20220412'][type - 1];
        // 入参
        const params = {mobile};
        switch (type) {
            case 1:
                params.password = base64.encode(password);
                break;
            case 2:
                params.verify_code = code;
                break;
        }
        http.post(url, params).then(async (res) => {
            Toast.hide(toast);
            if (res.code === '000000') {
                if (res.result?.pop) {
                    Modal.show({
                        content: res?.result?.pop?.content,
                        title: res?.result?.pop?.title,
                        confirm: true,
                        confirmText: '忘记密码',
                        cancelText: '验证码登录',
                        confirmCallBack: () => {
                            this.jumpPage('ForgetLoginPwd');
                        },
                        backCloseCallbackExecute: false,
                        cancelCallBack: () => {
                            this.props.navigation.navigate('VerifyLogin', {
                                fr: this.props.route?.params?.fr,
                                mobile: mobile,
                            });
                        },
                    });
                    return;
                }
                this.props.getUserInfo();
                this.props.getAppConfig();
                this.props.getVerifyGesture(true);
                await Storage.save('loginStatus', res.result);
                Toast.show('登录成功', {
                    onHidden: async () => {
                        if (this.props.route.params?.go == 'forgotGesPwd') {
                            let result = await Storage.get('openGesturePwd');
                            if (result) {
                                result[`${userInfo.uid}`] = false;
                                await Storage.save('openGesturePwd', result);
                            } else {
                                await Storage.save('openGesturePwd', {[`${userInfo.uid}`]: false});
                            }
                            result = await Storage.get('gesturePwd');
                            if (result) {
                                result[`${userInfo.uid}`] = '';
                                await Storage.save('gesturePwd', result);
                            } else {
                                await Storage.save('gesturePwd', {[`${userInfo.uid}`]: ''});
                            }
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
            } else {
                Toast.show(res.message);
            }
        });
    };
    jumpPage = (nav) => {
        this.props.navigation.navigate(nav);
    };
    onChangeMobile = (mobile) => {
        const {password, code, type, agreeState} = this.state;
        let _mobile = inputInt(mobile);
        this.setState({
            mobile: _mobile,
            btnClick:
                !(_mobile?.length >= 11 && [[password, code][type - 1]]?.length >= 6) || [false, !agreeState][type - 1],
        });
    };
    onChangeCode = (code) => {
        const {mobile, type, agreeState} = this.state;
        let _code = inputInt(code);
        this.setState({
            code: _code,
            btnClick: !(_code.length >= 6 && mobile?.length >= 11) || [false, !agreeState][type - 1],
        });
    };
    onChangePassword = (password) => {
        const {mobile} = this.state;
        this.setState({
            password,
            btnClick: !(mobile?.length >= 11 && password?.length >= 6),
        });
    };
    handlerBtnDisable = memoize((type, mobile, password, code, agreeState) => {
        switch (type) {
            case 1:
                return !(mobile?.length >= 11 && password?.length >= 6);
            case 2:
                return !(code?.length >= 6 && mobile?.length >= 11 && agreeState);
        }
    });
    weChatLogin = () => {};
    sendCode = () => {
        const {code_btn_click, mobile} = this.state;
        if (!(mobile?.length === 11)) return Toast.show('请正确输入您的手机号');
        if (code_btn_click) {
            http.post('/passport/send_verify_code/20210101', {
                mobile,
                operation: 'passport_login',
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
    render() {
        const {mobile, password, type, code, agreeState, code_btn_click, verifyText} = this.state;
        return (
            <View
                style={[
                    styles.login_content,
                    {
                        height: Dimensions.get('window').height - this.props.headerHeight + StatusBar.currentHeight,
                        paddingBottom: px(28) + this.props.insets.bottom,
                    },
                ]}>
                <ScrollView
                    contentContainerStyle={{flex: 1}}
                    scrollEnabled={false}
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
                    {
                        [
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
                            />,
                            <View style={[Style.flexRowCenter, styles.code_view]}>
                                <InputView
                                    title="验证码"
                                    onChangeText={this.onChangeCode}
                                    value={code}
                                    placeholder="请输入验证码"
                                    maxLength={6}
                                    keyboardType={'number-pad'}
                                    clearButtonMode="while-editing"
                                    style={styles.code_input}
                                />

                                <TouchableHighlight
                                    underlayColor="#f4ae86"
                                    style={[styles.verify_button, Style.flexCenter, !code_btn_click && styles.disabled]}
                                    onPress={_.debounce(this.sendCode, 500)}>
                                    <Text style={{color: '#fff', fontSize: text(12)}}>{verifyText}</Text>
                                </TouchableHighlight>
                            </View>,
                        ][type - 1]
                    }
                    <View style={Style.flexBetween}>
                        <Text
                            onPress={() => {
                                global.LogTool(['Code_Login', 'Password_Login'][type - 1]);
                                this.setState((val) => {
                                    return {type: val.type === 1 ? 2 : 1, password: '', code: ''};
                                });
                            }}
                            style={[styles.text, {color: Colors.btnColor, height: text(30)}]}>
                            {['使用验证码登录', '使用密码登录'][type - 1]}
                        </Text>
                        <Text
                            onPress={() => {
                                const path = ['ForgetLoginPwd', 'VerifyCodeQA'][type - 1];
                                this.jumpPage(path);
                            }}
                            style={[styles.text, {color: Colors.btnColor, height: text(30)}]}>
                            {['忘记密码', '没收到验证码?'][type - 1]}
                        </Text>
                    </View>
                    {type === 2 && (
                        <Agreements
                            style={{marginTop: px(8)}}
                            onChange={(agreeState) => {
                                this.setState({agreeState});
                            }}
                            check={false}
                            suffix="，未注册手机号将自动完成注册"
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
                    )}
                    <Button
                        title="登录"
                        disabled={this.handlerBtnDisable(type, mobile, password, code, agreeState)}
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
                    {this.props.userInfo.toJS().show_wx_login_btn ? (
                        <WechatView
                            weChatLogin={this.weChatLogin}
                            fr={this.props.route?.params?.fr || ''}
                            style={[styles.wechatLoginPosition]}
                        />
                    ) : null}
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = (state) => state;

const mapDispatchToProps = {
    getUserInfo,
    getVerifyGesture,
    getAppConfig,
};
const LoginConsumer = (props) => {
    const insets = useSafeAreaInsets();
    return (
        <HeaderHeightContext.Consumer>
            {(headerHeight) => (
                /* render something */
                <Login {...props} headerHeight={headerHeight} insets={insets} />
            )}
        </HeaderHeightContext.Consumer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginConsumer);
const styles = StyleSheet.create({
    login_content: {
        backgroundColor: '#fff',
        paddingTop: px(23),
        paddingHorizontal: text(23),
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
        fontSize: px(12),
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
    wechatLoginPosition: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: px(0),
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
