/*
 * @Date: 2021-10-20 14:16:19
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-10-25 18:59:19
 * @Description: 验证码登陆
 */
/*
 * @Date: 2021-01-13 16:52:27
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-16 15:56:22
 * @Description: 登录
 */
import React, {Component} from 'react';
import {Text, ScrollView, StyleSheet, View, TouchableHighlight} from 'react-native';
import {px as text, px, inputInt} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Colors, Font} from '../../../common/commonStyle';
import InputView from '../input';
import http from '../../../services/';
import Storage from '../../../utils/storage';
import Toast from '../../../components/Toast';
import {connect} from 'react-redux';
import {Style} from '../../../common/commonStyle';
import {getUserInfo, getVerifyGesture} from '../../../redux/actions/userInfo';
import _ from 'lodash';
import {CommonActions} from '@react-navigation/native';
class VerifyLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: this.props.route?.params?.mobile,
            btnClick: true,
            code_btn_click: true,
            code: '',
            verifyText: '重新发送验证码',
            second: 60,
        };
    }
    login = () => {
        const {mobile, code} = this.state;
        const userInfo = this.props.userInfo?.toJS();
        let toast = Toast.showLoading('正在登录...');
        http.post('/auth/user/login_by_verify_code/20210101', {mobile, verify_code: code}).then(async (res) => {
            Toast.hide(toast);
            if (res.code === '000000') {
                this.props.getUserInfo();
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
                            this.props.navigation.dispatch((state) => {
                                // Remove the home route from the stack
                                const routes = state.routes.filter((r) => {
                                    return r.name !== 'Login';
                                });
                                return CommonActions.reset({
                                    ...state,
                                    routes,
                                    index: routes.length - 1,
                                });
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
                            this.props.navigation.pop(3);
                        } else {
                            this.props.navigation.pop(2);
                        }
                    },
                });
            } else {
                Toast.show(res.message);
            }
        });
    };
    componentDidMount() {
        this.sendCode();
    }
    sendCode = () => {
        const {code_btn_click, mobile} = this.state;
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
    jumpPage = (nav) => {
        this.props.navigation.navigate(nav);
    };
    onChangeCode = (code) => {
        const {mobile} = this.state;
        this.setState({code, btnClick: !(mobile?.length >= 11 && code?.length >= 6)});
    };
    weChatLogin = () => {};
    render() {
        const {mobile, code, btnClick, verifyText, code_btn_click} = this.state;
        return (
            <ScrollView
                scrollEnabled={false}
                style={styles.login_content}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>验证码登录</Text>

                <InputView
                    title="手机号"
                    value={mobile}
                    placeholder="请输入您的手机号"
                    maxLength={11}
                    editable={false}
                    textContentType="telephoneNumber"
                    keyboardType={'number-pad'}
                    clearButtonMode="while-editing"
                />
                <View style={[Style.flexRowCenter, styles.code_view]}>
                    <InputView
                        title="验证码"
                        onChangeText={this.onChangeCode}
                        value={code}
                        placeholder="请输入验证码"
                        maxLength={6}
                        autoFocus={true}
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
                </View>
                <Button
                    title="登录"
                    disabled={btnClick}
                    onPress={this.login}
                    style={{marginBottom: text(20), marginTop: px(10)}}
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
export default connect(mapStateToProps, mapDispatchToProps)(VerifyLogin);
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
