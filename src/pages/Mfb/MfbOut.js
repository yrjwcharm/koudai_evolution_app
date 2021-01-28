/*
 * @Author: xjh
 * @Date: 2021-01-26 11:04:08
 * @Description:魔方宝提现
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-26 13:59:13
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
class MfbOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            planData: '',
            type: 0,
            amount: '',
            password: '',
            showMask: false,
            bankSelect: 0,
            check: [true, false],
            selectData: [
                {
                    desc: '2小时内到账，单日限额2万元，今日可提现',
                    title: '快速提现(无当日收益)',
                },
                {
                    title: '普通提现',
                    desc: '2小时内到账，单日限额2万元，今日可提现',
                },
            ],
        };
    }
    init() {
        const {type} = this.state;
        http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/doc/trade/buy/info/20210101', {type}).then(
            (data) => {
                this.setState({
                    data: data.result,
                    initialPage: data.result.tabs.type,
                    type: data.result.tabs.type,
                    has_tab: data.result.tabs.has_tab,
                });
            }
        );
        http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/doc/trade/buy/plan/20210101').then((data) => {
            this.setState({planData: data.result});
        });
    }
    UNSAFE_componentWillMount() {
        this.init();
    }
    onInput = (amount) => {
        this.setState({amount});
    };
    submit = () => {
        this.passwordModal.show();
        this.setState({showMask: true});
    };
    allAmount = () => {};
    //切换银行卡
    changeBankCard = () => {
        this.bankCard.show();
        this.setState({showMask: true});
    };
    radioChange(index) {
        let check = this.state.check;
        check = check.map((item) => false);
        check[index] = true;
        this.setState({
            check,
        });
    }

    render_bank() {
        const {data, bankSelect} = this.state;
        const {pay_methods} = data;
        return (
            <>
                <View style={[styles.bankCard, Style.flexBetween]}>
                    {pay_methods ? (
                        <>
                            <Image
                                style={styles.bank_icon}
                                source={{
                                    uri: pay_methods[bankSelect].bank_icon,
                                }}
                            />
                            <View style={{flex: 1}}>
                                <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                                    {pay_methods[bankSelect].bank_name}
                                </Text>
                                <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                    {pay_methods[bankSelect].limit_desc}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.changeBankCard}>
                                <Text style={{color: Colors.lightGrayColor}}>
                                    切换
                                    <Icon name={'right'} size={px(12)} />
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : null}
                </View>
            </>
        );
    }
    render_buy() {
        const {amount, data} = this.state;
        const {buy_info, title, pay_methods} = data;
        return (
            <ScrollView style={{color: Colors.bgColor}}>
                <PasswordModal
                    ref={(ref) => {
                        this.passwordModal = ref;
                    }}
                    onDone={(password) => {
                        this.setState({password});
                    }}
                    onClose={() => {
                        this.setState({showMask: false});
                    }}
                />
                {this.render_bank()}
                {buy_info ? (
                    <View style={styles.buyCon}>
                        <Text style={{fontSize: px(16), marginVertical: px(4)}}>{buy_info.title}</Text>
                        <View style={styles.buyInput}>
                            <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={[styles.inputStyle, {fontFamily: amount.length > 0 ? Font.numFontFamily : null}]}
                                placeholder={'请输入提现金额'}
                                placeholderTextColor={'#CCD0DB'}
                                onChangeText={(value) => {
                                    this.onInput(value);
                                }}
                                value={amount}
                            />

                            <TouchableOpacity onPress={this.allAmount}>
                                <Text style={{color: '#0051CC'}}>全部</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
                {this.render_Radio()}
                <BankCardModal
                    data={pay_methods || []}
                    onClose={() => {
                        this.setState({showMask: false});
                    }}
                    ref={(ref) => {
                        this.bankCard = ref;
                    }}
                    onDone={(index) => {
                        this.setState({bankSelect: index});
                    }}
                />
            </ScrollView>
        );
    }
    render_Radio() {
        const selectData = this.state.selectData;
        return (
            <>
                {!!selectData.length > 0 &&
                    selectData.map((_item, index) => {
                        return (
                            <View
                                key={index}
                                style={[
                                    Style.flexRow,
                                    styles.card_item,
                                    styles.card_select,
                                    {
                                        borderBottomWidth: index < selectData.length - 1 ? 0.5 : 0,
                                        borderColor: Colors.borderColor,
                                    },
                                ]}>
                                <Radio
                                    checked={this.state.check[index]}
                                    index={index}
                                    onChange={() => this.radioChange(index)}
                                />
                                <View style={{flex: 1, paddingLeft: px(10)}}>
                                    <Text style={{color: Colors.descColor, fontWeight: 'bold'}}>{_item.title}</Text>
                                    <Text style={styles.desc_sty}>{_item.desc}</Text>
                                </View>
                            </View>
                        );
                    })}
            </>
        );
    }
    render() {
        const {showMask, data} = this.state;
        const {button} = data;
        return (
            <View style={{flex: 1, paddingBottom: isIphoneX() ? px(85) : px(51)}}>
                {this.render_buy()}

                {button && <FixedButton title={button.title} disabled={button.available == 0} onPress={this.submit} />}
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
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(20),
        paddingBottom: px(13),
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
});

export default MfbOut;
