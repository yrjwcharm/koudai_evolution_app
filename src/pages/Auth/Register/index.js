/*
 * @Date: 2021-01-13 16:52:39
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-16 13:16:06
 * @Description: 注册
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, DeviceEventEmitter} from 'react-native';
import {px as text, px, inputInt} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import {Style, Colors} from '../../../common/commonStyle';
import WechatView from '../wechatView';
import InputView from '../input';
import Agreements from '../../../components/Agreements';
import http from '../../../services/';
import Toast from '../../../components/Toast';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {HeaderHeightContext} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Modal} from '~/components/Modal';
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            check: false,
            btnClick: true,
        };
        this.agreementCheckModalState = false;
        this.agreementsRef = React.createRef();
    }
    componentDidMount() {
        this.focusLister = this.props.navigation.addListener('focus', () => {
            if (this.agreementCheckModalState) this.autoCheck();
        });
        this.loginModalClickLister = DeviceEventEmitter.addListener('registerModalClick', () => {
            Modal.close();
            this.agreementCheckModalState = true;
        });
    }
    componentWillUnmount() {
        this.focusLister();
        this.loginModalClickLister.remove();
    }
    autoCheck = () => {
        Modal.show({
            title: '服务协议及隐私协议',
            content: `为了更好的保障您的合法权益，请您阅读并同意<alink url=${JSON.stringify({
                path: 'Agreement',
                params: {id: 0},
                $event: 'registerModalClick',
            })}>《用户协议》</alink>和<alink url=${JSON.stringify({
                path: 'Agreement',
                params: {id: 32},
            })}>《隐私协议》</alink>`,
            $event: 'registerModalClick',
            confirm: true,
            onCloseCallBack: () => {
                this.agreementCheckModalState = false;
            },
            confirmCallBack: () => {
                this.agreementCheckModalState = false;
                this.agreementsRef.current.toggle();
                setTimeout(() => {
                    this.register();
                }, 0);
            },
        });
    };
    register = () => {
        const {mobile, check} = this.state;
        if (!check) {
            this.autoCheck();
            return;
        }
        global.LogTool('Register');
        http.post('/auth/user/mobile_available/20210101', {mobile}).then((res) => {
            if (res.code === '000000') {
                this.props.navigation.navigate('SetLoginPassword', {
                    mobile,
                    redirect: this.props.route?.params?.redirect,
                    fr: this.props.route?.params?.fr || '',
                });
            } else {
                Toast.show(res.message, {
                    onHidden: () => {
                        if (res.code === '10001') {
                            if (this.props.route?.params?.fr) {
                                this.jumpPage('Login', {mobile});
                            } else {
                                this.jumpPage('Login', {fr: 'register', mobile});
                            }
                        }
                    },
                });
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
            <View
                style={[
                    styles.register_content,
                    {
                        height: Dimensions.get('window').height - this.props.headerHeight + StatusBar.currentHeight,
                        paddingBottom: px(28) + this.props.insets.bottom,
                    },
                ]}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex: 1}}>
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
                        ref={this.agreementsRef}
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
                                title: '《隐私协议》',
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
                                if (this.props.route?.params?.fr) {
                                    this.jumpPage('Login');
                                } else {
                                    this.jumpPage('Login', {fr: 'register'});
                                }
                            }}
                            style={[styles.text, {color: Colors.btnColor, marginLeft: 2}]}>
                            去登录
                        </Text>
                    </View>
                    {this.props.userInfo.show_wx_login_btn ? (
                        <WechatView fr={this.props.route?.params?.fr || ''} style={[styles.wechatLoginPosition]} />
                    ) : null}
                </ScrollView>
            </View>
        );
    }
}
const IndexConsumer = (props) => {
    const insets = useSafeAreaInsets();
    return (
        <HeaderHeightContext.Consumer>
            {(headerHeight) => <Index {...props} headerHeight={headerHeight} insets={insets} />}
        </HeaderHeightContext.Consumer>
    );
};
const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo?.toJS(),
    };
};
export default connect(mapStateToProps, null)(IndexConsumer);
const styles = StyleSheet.create({
    register_content: {
        backgroundColor: '#fff',
        padding: text(23),
    },
    title: {
        fontSize: text(22),
        fontWeight: 'bold',
        color: Colors.defaultColor,
    },
    text: {
        color: Colors.lightBlackColor,
        fontSize: text(12),
    },
    wechatLoginPosition: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: px(0),
    },
});
