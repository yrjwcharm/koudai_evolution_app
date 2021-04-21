/*
 * @Author: xjh
 * @Date: 2021-01-26 11:04:08
 * @Description:魔方宝充值
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-21 14:20:45
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, BackHandler} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle.js';
import {px, isIphoneX, onlyNumber} from '../../utils/appUtil.js';
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
        const _amount = onlyNumber(amount);
        if (amount > 0) {
            if (amount > Number(bankSelect.left_amount)) {
                const tips = '由于银行卡单日限额，今日最多可转入金额为' + bankSelect.left_amount + '元';
                this.setState({
                    tips,
                    enable: false,
                    amount: _amount,
                });
            } else if (amount > bankSelect.single_amount) {
                const tips = '最大单笔转入金额为' + bankSelect.single_amount + '元';
                this.setState({
                    tips,
                    enable: false,
                    amount: _amount,
                });
            } else if (amount < data.recharge_info.start_amount) {
                const tips = '最低转入金额' + data.recharge_info.start_amount + '元';
                this.setState({
                    tips,
                    enable: false,
                    amount: _amount,
                });
            } else {
                this.setState({
                    tips: '',
                    enable: true,
                    amount: _amount,
                });
            }
        } else {
            const tips = '请输入转入金额';
            this.setState({
                tips,
                enable: false,
                amount: '',
            });
            return false;
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
        this.setState({amount: '', enable: false});
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
                        Toast.show(res.message);
                    }
                });
            }
        );
    };
    render_bank() {
        const {data, bankSelect} = this.state;
        const {pay_methods} = data;
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
                                    {bankSelect?.bank_name} ({bankSelect?.bank_no})
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
            </View>
        );
    }
    //购买
    render_buy() {
        const {amount, data, tips, bankSelect} = this.state;
        const {recharge_info, pay_methods, remit_pay} = data;
        return (
            <ScrollView style={{color: Colors.bgColor}} keyboardShouldPersistTaps="handled">
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
                            ref={(ref) => {
                                this.textInput = ref;
                            }}
                            keyboardType="numeric"
                            style={[styles.inputStyle]}
                            placeholder={recharge_info.placeholder}
                            placeholderTextColor={Colors.placeholderColor}
                            onChangeText={(value) => {
                                this.onInput(value);
                            }}
                            onEndEditing={() => {
                                if (this.state.amount) {
                                    this.setState({amount: Number(this.state.amount).toFixed(2)});
                                }
                            }}
                            autoFocus={true}
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
                {remit_pay ? (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.notice_sty, Style.flexRow]}
                        onPress={() => {
                            this.props.navigation.navigate(remit_pay?.button?.url.path);
                        }}>
                        <Text style={{color: '#fff', flex: 1}}>{remit_pay?.tip}</Text>
                        <View style={{backgroundColor: '#fff', borderRadius: px(3)}}>
                            <Text style={styles.notice_btn_sty}>{remit_pay?.button?.text}</Text>
                        </View>
                    </TouchableOpacity>
                ) : null}
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
                    select={pay_methods?.findIndex((item) => item.pay_method === bankSelect?.pay_method)}
                    onDone={(select) => {
                        this.setState({bankSelect: select});
                        this.onInput(amount);
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
        fontSize: px(30),
        marginLeft: px(14),
        fontFamily: Font.numMedium,
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
        marginLeft: px(27),
        paddingTop: px(5),
    },
    notice_sty: {
        backgroundColor: '#e7965b',
        paddingVertical: px(10),
        marginHorizontal: px(10),
        paddingHorizontal: px(16),
        borderRadius: px(6),
        marginBottom: px(16),
    },
    notice_btn_sty: {
        color: '#e7965b',
        paddingHorizontal: px(10),
        paddingVertical: px(4),
        borderRadius: px(3),
    },
});

export default MfbIn;
