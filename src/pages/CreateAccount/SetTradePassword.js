/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-15 11:12:20
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-18 10:25:22
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, TextInput} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Space, Style, Colors, Font} from '../../common/commonStyle';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Toast from '../../components/Toast';
import FastImage from 'react-native-fast-image';
export default class SetTradePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            pwdFisrt: '',
            pwdMsg: '设置6位数字交易密码',
        };
    }
    handelReset = () => {
        this.setState({
            pwdFisrt: '',
            pwdMsg: '设置6位数字交易密码',
            password: '',
        });
    };
    onTouchInput() {
        const isFocused = this.textInput.isFocused();
        if (!isFocused) {
            this.textInput.focus();
        }
    }
    render_box() {
        let passarr = new Array(6);
        let box = [];
        Array.from(passarr).map((item, index) =>
            box.push(
                <TouchableOpacity
                    key={index}
                    activeOpacity={1}
                    onPress={() => {
                        this.onTouchInput();
                    }}
                    style={styles.box}>
                    {this.state.password[index] ? <View style={styles.circle} /> : <Text />}
                </TouchableOpacity>,
            ),
        );
        return <View style={styles.box_con}>{box}</View>;
    }
    onInput(text) {
        var reg = /^[0-9]*$/;
        this.setState(
            {
                password: text,
            },
            () => {
                if (this.state.password.length == 6) {
                    if (!reg.test(this.state.password)) {
                        Toast.show('交易密码只能为6位数字');
                    } else {
                        if (this.state.pwdFisrt !== '') {
                            if (this.state.pwdFisrt == this.state.password) {
                                // http.post('/common/passport/xy_account/set_trade_password/20200808', { password: this.state.password, poid: this.state.poid, fr: this.state.fr }).then((data) => {
                                //   if (data.code === '000000') {
                                //     Toast.showInfo(data.message)
                                //     this.timerOut = setTimeout(() => {
                                //       this.props.getUserInfo()
                                //       this.props.navigation.replace(data.result.jump_name, { title: this.props.navigation.state.params.title, ...data.result.params })
                                //     }, 1000)
                                //   } else {
                                //     Toast.showWarn(data.message)
                                //   }
                                // })
                            } else {
                                Toast.show('两次设置的交易密码不一致');
                                this.handelReset();
                            }
                        } else {
                            this.setState({
                                pwdMsg: '请再次设置您的6位数字交易密码',
                                pwdFisrt: this.state.password,
                                password: '',
                            });
                        }
                    }
                }
            },
        );
    }
    render() {
        const {pwdMsg, password} = this.state;
        return (
            <View style={Style.containerPadding}>
                <FastImage
                    style={styles.pwd_img}
                    source={{
                        uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/account.png',
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.card}>
                    <View style={[Style.flexRow, styles.card_head]}>
                        <EvilIcons name="lock" size={25} />
                        <Text style={styles.title}>{pwdMsg}</Text>
                    </View>
                    <View style={{marginTop: text(25)}}>
                        {this.render_box()}
                        <TextInput
                            ref={(ref) => {
                                this.textInput = ref;
                            }}
                            underlineColorAndroid="transparent"
                            caretHidden
                            keyboardType="numeric"
                            style={styles.input}
                            autoFocus={true}
                            maxLength={6}
                            value={password}
                            onChangeText={(text) => {
                                this.onInput(text);
                            }}
                        />
                        <Text
                            onPress={this.handelReset}
                            style={{
                                fontSize: text(12),
                                textAlign: 'center',
                                color: '#0051CC',
                            }}>
                            重新设置密码
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    pwd_img: {
        width: '100%',
        height: text(55),
    },
    card: {
        backgroundColor: '#fff',
        paddingVertical: text(16),
        borderRadius: text(8),
        marginBottom: text(10),
        marginTop: text(24),
        padding: Space.padding,
    },
    card_head: {
        borderColor: '#DDDDDD',
        borderBottomWidth: 0.5,
        paddingBottom: text(15),
        alignItems: 'flex-end',
    },
    title: {
        color: Colors.defaultColor,
        fontSize: Font.textH2,
    },
    box: {
        backgroundColor: '#F0F0F0',
        width: text(35),
        height: text(46),
        marginLeft: text(10),
        borderRadius: text(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    box_con: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginVertical: text(10),
        marginLeft: -10,
    },
    circle: {
        width: text(14),
        height: text(14),
        borderRadius: text(7),
        backgroundColor: '#000',
    },
    input: {
        // width: text(300),
        opacity: 0,
        height: text(20),
    },
});
