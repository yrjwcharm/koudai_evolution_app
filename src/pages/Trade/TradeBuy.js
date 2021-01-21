/*
 * @Date: 2021-01-20 10:25:41
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-21 17:17:10
 * @Description: 购买定投
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../../components/TabBar.js';
import {Colors, Font, Style} from '../../common/commonStyle.js';
import {px, isIphoneX} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {BankCardModal, Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Mask from '../../components/Mask';
import http from '../../services';
class TradeBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            planData: '',
            /**
             * 0 购买 1 定投
             */
            type: 0,
            // 是否存在tab
            has_tab: true,
            //默认tab
            initialPage: 0,
            amount: '',
            password: '',
            configExpand: false, //买入明细是否展开
            showMask: false,
            bankSelect: 0,
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
    //清空输入框
    clearInput = () => {
        this.setState({amount: ''});
    };
    //切换银行卡
    changeBankCard = () => {
        this.bankCard.show();
        this.setState({showMask: true});
    };

    changeBuyStatus = (obj) => {
        // Picker.hide()
        this.setState({type: obj.i}, () => {
            this.init();
        });
    };
    //买入明细
    render_config() {
        const {planData, configExpand} = this.state;
        const {header, body} = planData;
        return (
            <View style={{marginBottom: px(12)}}>
                <TouchableOpacity
                    style={styles.config}
                    activeOpacity={0.9}
                    onPress={() => {
                        this.setState({configExpand: !configExpand});
                    }}>
                    <View style={Style.flexRowCenter}>
                        <Text style={{color: Colors.darkGrayColor, marginRight: px(10), fontSize: px(14)}}>
                            买入明细
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Modal.show({
                                    content: '111',
                                });
                            }}>
                            <Icon name={'questioncircleo'} size={px(16)} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                    </View>
                    {configExpand ? (
                        <Icon name={'up'} size={px(14)} color={Colors.lightGrayColor} />
                    ) : (
                        <Icon name={'down'} size={px(14)} color={Colors.lightGrayColor} />
                    )}
                </TouchableOpacity>
                {configExpand && (
                    <>
                        <View style={styles.line} />
                        <View style={styles.config_desc}>
                            {body &&
                                body.map((item, index) => {
                                    return (
                                        <View key={item.color}>
                                            <View style={[Style.flexBetween, {marginBottom: px(14)}]}>
                                                <View style={[Style.flexRow, {width: px(162)}]}>
                                                    <View style={[styles.circle, {backgroundColor: item.color}]} />
                                                    <Text style={styles.config_title}>{item.title}</Text>
                                                </View>
                                                {index == 0 && (
                                                    <>
                                                        <Text style={[styles.config_title, {width: px(60)}]}>
                                                            {header.percent}
                                                        </Text>
                                                        <Text style={styles.config_title}>{header.amount}</Text>
                                                    </>
                                                )}
                                            </View>
                                            {item.funds &&
                                                item.funds.map((fund, _index) => {
                                                    return (
                                                        <View
                                                            key={_index}
                                                            style={[Style.flexBetween, {marginBottom: px(14)}]}>
                                                            <Text style={[styles.config_title_desc, {width: px(162)}]}>
                                                                {fund.name}
                                                            </Text>
                                                            <Text style={[styles.config_title_desc, {width: px(60)}]}>
                                                                {fund.percent * 100}%
                                                            </Text>
                                                            <Text style={styles.config_title_desc}>{fund.amount}</Text>
                                                        </View>
                                                    );
                                                })}
                                        </View>
                                    );
                                })}
                        </View>
                    </>
                )}
            </View>
        );
    }
    render_bank() {
        const {data, bankSelect} = this.state;
        const {pay_methods, large_pay_method} = data;
        return (
            <View style={{marginBottom: px(12)}}>
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
                                        uri: large_pay_method.bank_icon,
                                    }}
                                />
                                <View style={{flex: 1}}>
                                    <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                                        {large_pay_method.bank_name}
                                    </Text>
                                    <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                        {large_pay_method.limit_desc}
                                    </Text>
                                </View>
                                <TouchableOpacity style={[styles.yel_btn]} onPress={this.changeBankCard}>
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
    //定投周期
    render_autoTime() {
        return (
            <TouchableOpacity style={styles.auto_time} onPress={() => this._showDatePicker()} activeOpacity={1}>
                <View style={[Style.flexBetween, {marginBottom: px(8)}]}>
                    <Text style={{fontSize: px(16)}}>定投周期</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: px(16), marginRight: 5}}>
                            {this.state.currentDate && this.state.currentDate.join(' ')}
                        </Text>
                        <Icon name={'right'} size={px(12)} color={Colors.lightGrayColor} />
                    </View>
                </View>
                <Text style={{color: Colors.darkGrayColor, fontSize: px(12)}}>
                    下次扣款时间：2020-03-04 遇非交易日顺延
                </Text>
            </TouchableOpacity>
        );
    }
    //购买
    render_buy() {
        const {amount, data, type} = this.state;
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
                <Text style={styles.title}>{title}</Text>
                {buy_info ? (
                    <View style={styles.buyCon}>
                        <Text style={{fontSize: px(16), marginVertical: px(4)}}>{buy_info.title}</Text>
                        <View style={styles.buyInput}>
                            <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={[styles.inputStyle, {fontFamily: amount.length > 0 ? Font.numFontFamily : null}]}
                                placeholder={buy_info.hidden_text}
                                placeholderTextColor={Colors.lightGrayColor}
                                onChangeText={(value) => {
                                    this.onInput(value);
                                }}
                                value={amount}
                            />
                            {amount.length > 0 && (
                                <TouchableOpacity onPress={this.clearInput}>
                                    <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text>1111</Text>
                        {/* {
           planData.fee_text && <View style={styles.ratio}>
             <View style={[styles.circle, { backgroundColor: tip ? '#EA514E' : "#80899B" }]} />
             {tip && tip !== '' ? <Text style={styles.error_tip}>{tip}</Text> : <HTML html={planData.fee_text} />}
           </View>
         } */}
                    </View>
                ) : null}
                {/* 银行卡 */}
                {this.render_bank()}
                {/* 买入明细 */}
                {type == 0 && this.render_config()}
                {/* 定投周期 */}
                {type == 1 && this.render_autoTime()}
                <Text style={{color: Colors.darkGrayColor}}>点击确认购买即代表您已知悉该基金组合的</Text>
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

    render() {
        const {showMask, data, initialPage, has_tab} = this.state;
        const {button} = data;
        return (
            <View style={{flex: 1, paddingBottom: isIphoneX() ? px(85) : px(51)}}>
                {has_tab ? (
                    <ScrollableTabView
                        onChangeTab={this.changeBuyStatus}
                        renderTabBar={() => <TabBar />}
                        initialPage={initialPage}>
                        <View tabLabel="购买" style={{flex: 1}}>
                            {this.render_buy()}
                        </View>
                        <View tabLabel="定投" style={{flex: 1}}>
                            {this.render_buy()}
                        </View>
                    </ScrollableTabView>
                ) : (
                    this.render_buy()
                )}

                {button && <FixedButton title={button.title} disabled={button.available == 0} onPress={this.submit} />}
                {showMask && <Mask />}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    title: {fontSize: px(13), paddingVertical: px(12), paddingLeft: px(16)},
    buyCon: {
        backgroundColor: '#fff',
        marginBottom: px(12),
        paddingTop: px(15),
        paddingHorizontal: px(15),
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
        fontSize: px(35),
        marginLeft: px(14),
        letterSpacing: 2,
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
    config: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: px(15),
        height: px(56),
        backgroundColor: '#fff',
    },
    config_desc: {
        padding: px(15),
        paddingBottom: px(0),
        backgroundColor: '#fff',
    },
    config_title: {
        fontSize: px(12),
        color: Colors.darkGrayColor,
    },
    config_title_desc: {
        fontSize: px(12),
        color: '#4E556C',
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
});

export default TradeBuy;
