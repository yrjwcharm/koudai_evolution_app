/*
 * @Date: 2021-01-15 10:40:35
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-18 20:43:25
 * @Description:微信登录
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputView from '../input';
import {px as text, handlePhone} from '../../../utils/appUtil';
import {Style} from '../../../common/commonStyle';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Agreements from '../../../components/Agreements';
import {Button} from '../../../components/Button';
import http from '../../../services';
import Toast from '../../../components/Toast';
export default class WechatLogin extends Component {
    // static propTypes = {
    //     prop: PropTypes,
    // };
    state = {
        mobile: '',
        check: true,
        btnClick: true,
    };
    /**获取短信验证码 */
    getCode = () => {
        http.post('/auth/user/mobile_can_bind/20210101', {
            mobile: this.state.mobile,
            muid: this.props.route?.params.muid,
        }).then((res) => {
            if (res.code == '000000' && res.result.status >= 1) {
                this.props.navigation.navigate('SetLoginPassword', {
                    mobile: this.state.mobile,
                    union_id: this.props.route?.params?.union_id,
                });
            } else {
                Toast.show(res.message);
            }
        });
    };
    onChangeMobile = (mobile) => {
        this.setState({mobile, btnClick: !(mobile.length >= 11)});
    };

    render() {
        const {mobile, btnClick} = this.state;
        return (
            <View style={styles.login_content}>
                <View style={Style.flexRow}>
                    <Image
                        style={styles.avatar}
                        source={{
                            uri: this.props.route?.params.avatar,
                        }}
                    />
                    {this.props.route?.params.nickname ? (
                        <Text style={styles.welcome_title}>{this.props.route?.params.nickname}，您好</Text>
                    ) : null}
                </View>
                <Text style={styles.title}>请绑定您的手机号</Text>
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
                <Agreements
                    onChange={(check) => {
                        this.setState({check});
                    }}
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
                <Button
                    title="获取短信验证码"
                    disabled={btnClick}
                    onPress={this.getCode}
                    style={{marginTop: text(38)}}
                />
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
    title: {
        fontSize: text(18),
        fontWeight: '500',
        marginVertical: text(31),
    },
    avatar: {
        width: text(40),
        height: text(40),
        borderRadius: 8,
    },
    welcome_title: {
        fontSize: text(22),
        fontWeight: '500',
        marginLeft: text(11),
    },
});
