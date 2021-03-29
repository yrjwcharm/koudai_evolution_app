/*
 * @Author: xjh
 * @Date: 2021-01-26 11:04:08
 * @Description:魔方宝充值
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-29 18:12:57
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle.js';
import {px, isIphoneX} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {BankCardModal, Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import http from '../../services';
import BottomDesc from '../../components/BottomDesc';
import {useFocusEffect} from '@react-navigation/native';
import Agreements from '../../components/Agreements';
import Toast from '../../components/Toast';
class MfbIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            amount: '',
            password: '',
            bankSelect: '',
            tips: '',
            enable: false,
            checked: true,
            code: props?.route?.params?.code || '',
        };
    }
    init = () => {
        http.get('/wallet/recharge/info/20210101', {code: this.state.code}).then((data) => {
            this.setState({
                data: data.result,
                bankSelect: data.result?.pay_methods[0],
            });
        });
    };

    onInput = (amount) => {
        const {data, bankSelect} = this.state;
        // const pay_methods = data.pay_methods[bankSelect];

        if (amount) {
            if (amount < data.recharge_info.start_amount) {
                const tips = '最低转入金额' + data.recharge_info.start_amount + '元';
                this.setState({
                    tips,
                    enable: false,
                    amount,
                });
            } else if (amount > bankSelect.single_amount) {
                const tips = '最大单笔转入金额为' + bankSelect.single_amount + '元';
                this.setState({
                    tips,
                    enable: false,
                    amount,
                });
            } else if (amount > Number(bankSelect.left_amount)) {
                const tips = '由于银行卡单日限额，今日最多可转入金额为' + bankSelect.left_amount + '元';
                this.setState({
                    tips,
                    enable: false,
                    amount,
                });
            } else {
                this.setState({
                    tips: '',
                    enable: true,
                    amount,
                });
            }
        } else {
            const tips = '请输入转入金额';
            this.setState({
                tips,
                enable: false,
                amount: '',
            });
        }
    };
    submit = () => {
        if (!this.state.checked) {
            Toast.show('请勾选协议！');
        } else {
            this.passwordModal.show();
        }
    };
    //清空输入框
    clearInput = () => {
        this.setState({amount: ''});
    };
    //切换银行卡
    changeBankCard = () => {
        this.bankCard.show();
    };
    submitData = (password) => {
        const {bankSelect, data, code} = this.state;
        this.setState(
            {
                password: this.state.password,
            },
            () => {
                http.post('/wallet/recharge/do/20210101', {
                    code: code,
                    amount: this.state.amount,
                    password: password,
                    pay_method: bankSelect.pay_method,
                }).then((res) => {
                    if (res.code === '000000') {
                        this.props.navigation.navigate('TradeProcessing', {
                            txn_id: res.result.txn_id,
                            fr: this.props.route?.params?.fr,
                        });
                    } else {
                        Modal.show({
                            confirm: false,
                            content: res.message,
                        });
                    }
                });
            }
        );
    };
    render_bank() {
        const {data, bankSelect} = this.state;
        const {pay_methods, large_pay_method} = data;
        return (
            <View style={{marginBottom: px(12)}}>
                <View style={[styles.bankCard, Style.flexBetween]}>
                    {pay_methods.length > 0 ? (
                        <TouchableOpacity onPress={this.changeBankCard} style={Style.flexRow} activeOpacity={1}>
                            <Image
                                style={styles.bank_icon}
                                source={{
                                    uri: bankSelect.bank_icon,
                                }}
                            />
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        color: '#101A30',
                                        fontSize: px(14),
                                        marginBottom: px(4),
                                        fontWeight: 'bold',
                                    }}>
                                    {bankSelect?.bank_name}
                                </Text>
                                <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                    {bankSelect?.limit_desc}
                                </Text>
                            </View>
                            <View>
                                <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                    切换
                                    <Icon name={'right'} size={px(12)} />
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                </View>
                {large_pay_method ? (
                    <View
                        style={[
                            styles.bankCard,
                            Style.flexBetween,
                            {borderTopColor: Colors.borderColor, borderTopWidth: 0.5},
                        ]}>
                        {pay_methods ? (
                            <>
                                <Image
                                    style={styles.bank_icon}
                                    source={{
                                        uri: large_pay_method?.bank_icon,
                                    }}
                                />
                                <View style={{flex: 1}}>
                                    <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                                        {large_pay_method?.bank_name}
                                    </Text>
                                    <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                        {large_pay_method?.limit_desc}
                                    </Text>
                                </View>
                                <TouchableOpacity style={[styles.yel_btn]} activeOpacity={1}>
                                    <Text style={{color: Colors.yellow}}>
                                        去汇款
                                        <Icon name={'right'} size={px(12)} />
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : null}
                    </View>
                ) : null}
            </View>
        );
    }
    //购买
    render_buy() {
        const {amount, data, tips} = this.state;
        const {recharge_info, pay_methods} = data;
        return (
            <ScrollView style={{color: Colors.bgColor}}>
                <PasswordModal
                    ref={(ref) => {
                        this.passwordModal = ref;
                    }}
                    onDone={(password) => this.submitData(password)}
                />
                <Text style={styles.title}>魔方宝</Text>
                <View style={styles.buyCon}>
                    <Text style={{fontSize: px(16), marginVertical: px(4)}}>{recharge_info?.text}</Text>
                    <View style={styles.buyInput}>
                        <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={[
                                styles.inputStyle,
                                {
                                    fontFamily: Font.numFontFamily,
                                    fontSize: amount.toString().length > 0 ? px(35) : px(26),
                                },
                            ]}
                            placeholder={recharge_info.placeholder}
                            placeholderTextColor={Colors.placeholderColor}
                            onChangeText={(value) => {
                                this.onInput(value);
                            }}
                            value={amount.toString()}
                        />
                        {amount.length > 0 && (
                            <TouchableOpacity onPress={this.clearInput} activeOpacity={1}>
                                <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                            </TouchableOpacity>
                        )}
                    </View>
                    {tips ? <Text style={styles.tips_sty}>{tips}</Text> : null}
                </View>
                {/* 银行卡 */}
                {this.render_bank()}

                <Agreements
                    onChange={(checked) => {
                        this.setState({checked});
                    }}
                    title="我已阅读并同意"
                    style={{marginHorizontal: px(16)}}
                    data={[
                        {
                            title: '《基金组合协议》',
                            id: 18,
                        },
                        {
                            title: '《魔方宝服务协议》',
                            id: 21,
                        },
                    ]}
                />

                <BottomDesc />
                <BankCardModal
                    data={pay_methods || []}
                    ref={(ref) => {
                        this.bankCard = ref;
                    }}
                    onDone={(select) => {
                        this.setState({bankSelect: select});
                    }}
                />
            </ScrollView>
        );
    }

    render() {
        const {data, enable} = this.state;
        const {button, recharge_info} = data;
        return (
            <View style={{flex: 1, paddingBottom: isIphoneX() ? px(85) : px(51)}}>
                <Focus init={this.init} />
                {recharge_info && this.render_buy()}
                {button && (
                    <FixedButton title={button?.text} disabled={button?.avail == 0 || !enable} onPress={this.submit} />
                )}
            </View>
        );
    }
}
function Focus({init}) {
    useFocusEffect(
        React.useCallback(() => {
            init();
        }, [init])
    );
    return null;
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
        paddingBottom: px(10),
    },
    buyInput: {
        // borderBottomWidth: 0.5,
        // borderColor: Colors.borderColor,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(20),
    },
    inputStyle: {
        flex: 1,
        fontSize: px(35),
        marginLeft: px(14),
        // letterSpacing: 2,
    },
    bankCard: {
        backgroundColor: '#fff',
        height: px(68),
        paddingHorizontal: px(14),
    },
    bank_icon: {
        width: px(28),
        height: px(28),
        marginRight: px(9),
        resizeMode: 'contain',
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
    auto_time: {
        padding: px(15),
        backgroundColor: '#fff',
        height: px(70),
        marginBottom: px(12),
    },
    yel_btn: {
        paddingVertical: px(5),
        paddingHorizontal: px(8),
        borderColor: Colors.yellow,
        borderWidth: 0.5,
        borderRadius: 8,
        textAlign: 'center',
    },
    tips_sty: {
        fontSize: px(12),
        color: '#DC4949',
        marginLeft: px(14),
        paddingTop: px(5),
    },
});

export default MfbIn;
