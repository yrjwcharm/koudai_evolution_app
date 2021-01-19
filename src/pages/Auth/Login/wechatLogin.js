/*
 * @Date: 2021-01-15 10:40:35
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 15:24:56
 * @Description:微信登录
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputView from '../input';
import {px as text} from '../../../utils/appUtil';
import {Style} from '../../../common/commonStyle';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Agreements from '../../../components/Agreements';
import {Button} from '../../../components/Button';
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
        this.props.navigation.navigate('SetLoginPassword');
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
                            uri:
                                'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epvw9iaibhbB1S0PqAWtjn02Phnoia3neR3JpXuaRC2P2jdllSP7PeYdgR41LSu0xicqu2UM4pKEQcIaQ/132',
                        }}
                    />
                    <Text style={styles.welcome_title}>闫洪昌，您好</Text>
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
    },
    welcome_title: {
        fontSize: text(22),
        fontWeight: '500',
        marginLeft: text(11),
    },
});
