/*
 * @Author: xjh
 * @Date: 2021-01-26 11:04:08
 * @Description:魔方宝提现
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-14 16:39:57
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Keyboard} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle.js';
import {px, isIphoneX, onlyNumber} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {BankCardModal, Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Radio from '../../components/Radio';
import http from '../../services';
import Toast from '../../components/Toast';
import {useFocusEffect} from '@react-navigation/native';
import BottomDesc from '../../components/BottomDesc.js';
function Focus({init}) {
    useFocusEffect(
        React.useCallback(() => {
            init();
        }, [init])
    );
    return null;
}
class MfbOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            amount: '',
            password: '',
            bankSelect: 0,
            check: [],
            selectData: {},
            optionChoose: 1,
            tips: '',
            enable: false,
            code: props.route.code,
        };
    }
    init = () => {
        const {selectData, code} = this.state;
        http.get('/wallet/withdraw/info/20210101', {code: code}).then((data) => {
            selectData.comAmount = data.result.pay_methods[0].common_withdraw_amount;
            selectData.comText = data.result.pay_methods[0].common_withdraw_subtext;
            selectData.quickAmount = data.result.pay_methods[0].quick_withdraw_amount;
            selectData.quickText = data.result.pay_methods[0].quick_withdraw_subtext;
            const withdraw_options = data.result.withdraw_options;
            this.state.check.push(withdraw_options[0].default);
            if (withdraw_options.length > 1) {
                this.state.check.push(withdraw_options[1].default);
            }
            this.setState({
                data: data.result,
                selectData: selectData,
                check: this.state.check,
                optionChoose: withdraw_options[0]?.type,
            });
        });
    };
    onInput = (amount) => {
        this.setState({amount: onlyNumber(amount)});
        const {data, bankSelect} = this.state;
        const pay_methods = data.pay_methods[bankSelect];
        if (amount > 0) {
            //optionChoose==1快速提现
            if (this.state.optionChoose === 1) {
                if (amount > pay_methods.quick_withdraw_amount || amount > pay_methods?.left_amount) {
                    const tips = '转出金额大于可转出金额';
                    return this.setState({
                        tips,
                        enable: false,
                    });
                } else {
                    return this.setState({
                        tips: '',
                        enable: true,
                    });
                }
            } else if (this.state.optionChoose === 0) {
                if (amount > pay_methods.common_withdraw_amount || amount > pay_methods?.left_amount) {
                    const tips = '转出金额大于可转出金额';
                    return this.setState({
                        tips,
                        enable: false,
                    });
                } else {
                    return this.setState({
                        tips: '',
                        enable: true,
                    });
                }
            }
        } else if (amount == 0) {
            const tips = '转出金额不能为0';
            this.setState({
                tips,
                enable: false,
            });
        } else {
            const tips = '请输入转出金额';
            this.setState({
                tips,
                enable: false,
            });
        }
    };

    submit = () => {
        this.passwordModal.show();
    };
    allAmount = () => {
        //optionChoose==1快速提现
        if (this.state.optionChoose === 1) {
            this.setState(
                {
                    amount: this.state.selectData.quickAmount.toString(),
                },
                () => {
                    this.isEnAble();
                }
            );
        } else {
            this.setState(
                {
                    amount: this.state.selectData.comAmount.toString(),
                },
                () => {
                    this.isEnAble();
                }
            );
        }
    };
    isEnAble = () => {
        if (!Number(this.state.amount)) {
            this.setState({
                enable: false,
            });
        } else {
            this.setState({
                enable: true,
            });
        }
        this.onInput(this.state.amount);
    };
    //切换银行卡
    changeBankCard = () => {
        this.bankCard.show();
    };
    radioChange(index, type) {
        let check = this.state.check;
        check = check.map((item) => false);
        check[index] = true;
        this.setState(
            {
                check,
                optionChoose: type,
            },
            () => {
                this.onInput(this.state.amount);
            }
        );
    }
    getBankInfo(index, comAmount, comText, quickAmount, quickText) {
        const selectData = this.state.selectData;
        selectData.comAmount = comAmount;
        selectData.comText = comText;
        selectData.quickAmount = quickAmount;
        selectData.quickText = quickText;
        this.setState({
            selectData: selectData,
            bankSelect: index,
        });
    }
    // 提交数据
    submitData = (password) => {
        const {code, amount, data, bankSelect, optionChoose} = this.state;
        this.setState({password: this.state.password}, () => {
            http.post('/wallet/withdraw/do/20210101', {
                code: code,
                amount: amount,
                password: password,
                pay_method: data.pay_methods[bankSelect].pay_method,
                type: optionChoose,
            }).then((res) => {
                if (res.code === '000000') {
                    this.props.navigation.navigate('TradeProcessing', {txn_id: res.result.txn_id});
                } else {
                    Toast.show(res.message);
                }
            });
        });
    };
    render_bank() {
        const {data, bankSelect} = this.state;
        const {pay_methods} = data;
        return (
            <>
                <View style={[styles.bankCard, Style.flexBetween]}>
                    {pay_methods ? (
                        <TouchableOpacity style={Style.flexRow} onPress={() => this.changeBankCard()} activeOpacity={1}>
                            <Image
                                style={styles.bank_icon}
                                source={{
                                    uri: pay_methods[bankSelect]?.bank_icon,
                                }}
                            />
                            <View style={{flex: 1}}>
                                <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                                    {pay_methods[bankSelect]?.bank_name}
                                </Text>
                                <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                    {pay_methods[bankSelect]?.limit_desc}
                                </Text>
                            </View>
                            <View>
                                <Text style={{color: Colors.lightGrayColor}}>
                                    切换
                                    <Icon name={'right'} size={px(12)} />
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </>
        );
    }
    render_buy() {
        const {amount, data, bankSelect, tips} = this.state;
        const {withdraw_info, title, pay_methods} = data;
        return (
            <ScrollView style={{color: Colors.bgColor}} keyboardShouldPersistTaps="handled">
                <PasswordModal
                    ref={(ref) => {
                        this.passwordModal = ref;
                    }}
                    onDone={(password) => this.submitData(password)}
                />
                {this.render_bank()}
                <View style={styles.buyCon}>
                    <Text style={{fontSize: px(16), marginVertical: px(4)}}>{withdraw_info.text}</Text>
                    <View style={styles.buyInput}>
                        <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                keyboardType="numeric"
                                style={[
                                    styles.inputStyle,
                                    {
                                        fontFamily: amount.length > 0 ? Font.numFontFamily : null,
                                        fontSize: amount.toString().length > 0 ? px(35) : px(26),
                                    },
                                ]}
                                placeholder={withdraw_info?.placeholder}
                                placeholderTextColor={'#CCD0DB'}
                                onChangeText={(value) => {
                                    this.onInput(value);
                                }}
                                onEndEditing={() => {
                                    if (amount) {
                                        this.setState({amount: Number(this.state.amount).toFixed(2)});
                                    }
                                }}
                                value={amount}
                                autoFocus={true}
                            />
                        </View>
                        <TouchableOpacity onPress={this.allAmount}>
                            <Text style={{color: '#0051CC'}}>{withdraw_info?.button.text}</Text>
                        </TouchableOpacity>
                    </View>
                    {tips ? <Text style={styles.tips_sty}>{tips}</Text> : null}
                </View>

                {this.render_Radio()}
                <BottomDesc />
                <BankCardModal
                    data={pay_methods || []}
                    ref={(ref) => {
                        this.bankCard = ref;
                    }}
                    onDone={(item, index) => {
                        this.getBankInfo(
                            index,
                            pay_methods[index]?.common_withdraw_amount,
                            pay_methods[index]?.common_withdraw_subtext,
                            pay_methods[index]?.quick_withdraw_amount,
                            pay_methods[index]?.quick_withdraw_subtext
                        );
                        this.setState({
                            bankSelect: index,
                        });
                        this.onInput(amount);
                    }}
                />
            </ScrollView>
        );
    }
    render_Radio() {
        const {withdraw_options} = this.state.data;
        const {selectData} = this.state;
        return (
            <View style={{marginBottom: px(20)}}>
                {withdraw_options &&
                    !!withdraw_options.length > 0 &&
                    withdraw_options.map((_item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.radioChange(index, _item.type)}
                                key={index}
                                style={[
                                    Style.flexRow,
                                    styles.card_item,
                                    styles.card_select,
                                    {
                                        borderBottomWidth: index < withdraw_options.length - 1 ? 0.5 : 0,
                                        borderColor: Colors.borderColor,
                                    },
                                ]}>
                                <Radio
                                    checked={this.state.check[index]}
                                    index={index}
                                    onChange={() => this.radioChange(index, _item.type)}
                                />
                                <View style={{flex: 1, paddingLeft: px(10)}}>
                                    <Text style={{color: Colors.descColor, fontWeight: 'bold'}}>{_item.text}</Text>
                                    <Text style={styles.desc_sty}>
                                        {index == 0 ? selectData?.quickText : selectData?.comText}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
            </View>
        );
    }
    render() {
        const {data, enable} = this.state;
        const {button, withdraw_info} = data;
        return (
            <View style={{flex: 1, paddingBottom: isIphoneX() ? px(85) : px(51)}}>
                <Focus init={this.init} />
                {withdraw_info && this.render_buy()}
                {button && (
                    <FixedButton title={button?.text} disabled={button?.avail == 0 || !enable} onPress={this.submit} />
                )}
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
        fontSize: px(26),
        marginLeft: px(14),
        // letterSpacing: 2,
    },
    bankCard: {
        backgroundColor: '#fff',
        height: px(68),
        paddingHorizontal: px(14),
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
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
    card_select: {
        backgroundColor: '#fff',
        paddingLeft: px(15),
        paddingRight: px(10),
    },
    card_item: {
        // flex: 1,
        paddingVertical: px(16),
    },
    card_wrap: {
        padding: px(15),
        backgroundColor: '#fff',
        marginTop: px(12),
    },
    desc_sty: {
        color: '#9095A5',
        fontSize: px(12),
        marginTop: px(4),
    },
    tips_sty: {
        fontSize: px(12),
        color: '#DC4949',
        marginLeft: px(27),
        paddingTop: px(5),
    },
});

export default MfbOut;
