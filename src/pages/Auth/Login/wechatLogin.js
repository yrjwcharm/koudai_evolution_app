/*
 * @Date: 2021-01-15 10:40:35
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 11:01:52
 * @Description:微信登录
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputView from '../input';
import {px as text} from '../../../utils/appUtil';
import {Style} from '../../../common/commonStyle';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
export default class WechatLogin extends Component {
    static propTypes = {
        prop: PropTypes,
    };
    state = {
        mobile: '',
    };

    render() {
        const {mobile} = this.state;
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
        marginBottom: text(32),
        marginTop: text(20),
    },
    avatar: {
        width: text(40),
        height: text(40),
    },
    welcome_title: {
        fontSize: text(22),
        fontWeight: '500',
    },
});
