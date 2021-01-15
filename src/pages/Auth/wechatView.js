/*
 * @Date: 2021-01-14 17:10:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 10:52:26
 * @Description:
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Style, Colors} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// export default class Wechat extends Component {
//     static propTypes = {
//         weChatLogin: Function,
//     };
//     static defaultProps = {
//         weChatLogin: () => {},
//     };
//     render() {
//         return (
//             <View style={[styles.Login, Style.flexCenter]}>
//                 <View style={styles.LoginWrap}>
//                     <View style={styles.LoginLine} />
//                     <Text style={[styles.text, {marginBottom: 12}]}>其他登录方式</Text>
//                     <View style={styles.LoginLine} />
//                 </View>
//                 <TouchableOpacity onPress={this.props.weChatLogin}>
//                     <Image source={require('../../assets/img/login/wechat_icon.png')} style={styles.LoginIcon} />
//                 </TouchableOpacity>
//                 <Text style={styles.LoginDesc}>微信登录</Text>
//             </View>
//         );
//     }
// }

function Wechat(props) {
    const navigation = useNavigation();
    const weChatLogin = () => {
        navigation.navigate('WechatLogin');
    };
    return (
        <View style={[styles.Login, Style.flexCenter]}>
            <View style={styles.LoginWrap}>
                <View style={styles.LoginLine} />
                <Text style={[styles.text, {marginBottom: 12}]}>其他登录方式</Text>
                <View style={styles.LoginLine} />
            </View>
            <TouchableOpacity onPress={weChatLogin}>
                <Image source={require('../../assets/img/login/wechat_icon.png')} style={styles.LoginIcon} />
                <Text style={styles.LoginDesc}>微信登录</Text>
            </TouchableOpacity>
        </View>
    );
}
// Wechat.propTypes = {
//     weChatLogin: PropTypes.func,
// };

export default Wechat;
const styles = StyleSheet.create({
    Login: {
        justifyContent: 'center',
        marginTop: text(30),
    },
    LoginWrap: {
        flexDirection: 'row',
    },
    text: {
        color: '#666666',
        fontSize: 12,
    },
    LoginLine: {
        borderColor: '#BBBBBB',
        borderTopWidth: 0.5,
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
    LoginIcon: {
        width: text(45),
        height: text(45),
    },
});
