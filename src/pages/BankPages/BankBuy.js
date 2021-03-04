/*
 * @Author: xjh
 * @Date: 2021-01-29 18:57:52
 * @Description:银行购买
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-29 19:48:51
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle.js';
import {px, isIphoneX} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {BankCardModal, Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Radio from '../../components/Radio';
import Mask from '../../components/Mask';
import http from '../../services';
import Toast from '../../components/Toast';
class BankRedeem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            amount: '',
            password: '',
            showMask: false,
            tips: '',
            enable: false,
        };
    }

    UNSAFE_componentWillMount() {
        http.get('/wallet/withdraw/info/20210101').then((data) => {
            this.setState({
                data: data.result,
            });
        });
    }
    onInput = (amount) => {
        this.setState({amount});
    };
    submit = () => {
        this.passwordModal.show();
        this.setState({showMask: true});
    };
    //清空输入框
    clearInput = () => {
        this.setState({amount: ''});
    };
    // 提交数据
    submitData() {
        this.setState({password: this.state.password}, () => {
            http.post('/wallet/withdraw/do/20210101', {
                code: '',
                amount: this.state.amount,
                password: this.state.password,
            }).then((res) => {
                props.navigation.navigate('asset');
            });
        });
    }

    render_buy() {
        const {amount, data, tips} = this.state;
        const {withdraw_info} = data;
        return (
            <ScrollView style={{color: Colors.bgColor}}>
                <PasswordModal
                    ref={(ref) => {
                        this.passwordModal = ref;
                    }}
                    onDone={(password) => this.submitData(password)}
                    onClose={() => {
                        this.setState({showMask: false});
                    }}
                />
                <Text style={[Style.descSty, {marginTop: px(12), paddingHorizontal: px(16)}]}>平安银行 | 现金宝</Text>
                <View style={styles.buyCon}>
                    <Text style={{fontSize: px(16), marginVertical: px(4)}}>{withdraw_info.text}</Text>
                    <View style={styles.buyInput}>
                        <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                keyboardType="numeric"
                                style={[styles.inputStyle, {fontFamily: amount.length > 0 ? Font.numFontFamily : null}]}
                                placeholder={withdraw_info?.placeholder}
                                placeholderTextColor={'#CCD0DB'}
                                onChangeText={(value) => {
                                    this.onInput(value);
                                }}
                                value={amount}
                            />
                            <Text style={styles.tips_sty}>{tips}</Text>
                        </View>
                        {amount.length > 0 && (
                            <TouchableOpacity onPress={this.clearInput}>
                                <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={[{backgroundColor: '#fff', padding: px(16)}, Style.flexRow]}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/icon_qthtz@2x.png'}}
                        style={{width: 40, height: 40}}
                    />
                    <View style={{flex: 1, marginLeft: px(10)}}>
                        <View
                            style={[
                                Style.flexBetween,
                                {
                                    flex: 1,
                                    borderBottomWidth: 0.5,
                                    borderColor: Colors.borderColor,
                                    paddingBottom: px(10),
                                },
                            ]}>
                            <View>
                                <Text style={{paddingBottom: px(6), color: '#333'}}>电子账户(8313)单笔无上限</Text>
                                <Text style={Style.descSty}>单比无上限</Text>
                            </View>
                            <View style={{borderRadius: 5, borderColor: '#0052CD', borderWidth: 0.5}}>
                                <Text style={styles.top_up_sty}>去充值</Text>
                            </View>
                        </View>
                        <Text style={{paddingTop: px(12), fontSize: px(14), color: '#333'}}>当前余额</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

    render() {
        const {showMask, data, enable} = this.state;
        const {button, withdraw_info} = data;
        return (
            <View style={{flex: 1, paddingBottom: isIphoneX() ? px(85) : px(51)}}>
                {withdraw_info && this.render_buy()}
                {button && (
                    <FixedButton title={button?.text} disabled={button?.avail == 0 || !enable} onPress={this.submit} />
                )}
                {showMask && <Mask />}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    title: {
        fontSize: px(13),
        paddingVertical: px(12),
        paddingLeft: px(16),
        color: '#4E556C',
    },
    buyCon: {
        backgroundColor: '#fff',
        marginBottom: px(12),
        paddingTop: px(15),
        paddingHorizontal: px(15),
        marginTop: px(12),
    },
    buyInput: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: px(20),
        paddingBottom: px(13),
    },
    inputStyle: {
        flex: 1,
        fontSize: px(26),
        marginLeft: px(14),
        // letterSpacing: 2,
    },

    line: {
        height: 0.5,
        marginHorizontal: px(15),
        backgroundColor: Colors.lineColor,
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        marginRight: px(6),
    },
    tips_sty: {
        fontSize: px(12),
        color: '#DC4949',
        // paddingVertical: px(8),
        marginLeft: px(14),
    },
    amount_wrap: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: px(16),
    },
    top_up_sty: {
        color: '#0052CD',

        paddingHorizontal: px(10),
        paddingVertical: px(5),
    },
});

export default BankRedeem;
