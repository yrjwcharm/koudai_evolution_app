/*
 * @Date: 2021-01-20 10:25:41
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-17 17:26:43
 * @Description: 购买定投
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Keyboard} from 'react-native';
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
import Picker from 'react-native-picker';
import HTML from '../../components/RenderHtml';
import Toast from '../../components/Toast/Toast.js';
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
            bankSelect: '', //选中的银行卡
            poid: this.props.route?.params?.poid || 1,
            currentDate: '', //定投日期
            nextday: '',
            buyBtnCanClick: false,
        };
    }
    componentDidMount() {
        this.getTab();
    }
    getTab = () => {
        const {poid} = this.state;
        http.get('/trade/set_tabs/20210101', {poid}).then((data) => {
            this.setState({
                type: data.result.active,
                has_tab: data.result.has_tab,
            });
            this.init(data.result.active);
        });
    };
    init = (_type) => {
        const {type, poid} = this.state;
        http.get('/trade/buy/info/20210101', {
            type: _type || type,
            poid,
        }).then((res) => {
            if (res.code === '000000') {
                this.setState({
                    data: res.result,
                    bankSelect: res.result?.pay_methods[0],
                    currentDate: res.result?.period_info?.current_date,
                    nextday: res.result?.period_info?.nextday,
                });
                this.plan(res.result.buy_info.initial_amount);
            }
        });
    };
    /**
     * @description: 购买提交
     * @param {*}
     * @return {*}
     */
    submit = (password) => {
        const {poid, planData, amount, bankSelect, type, currentDate} = this.state;
        const {buy_id} = planData;
        let toast = Toast.showLoading();

        type == 0
            ? http
                  .post('/trade/buy/do/20210101', {
                      poid,
                      buy_id,
                      amount,
                      password,
                      trade_method: bankSelect?.pay_type,
                      pay_method: bankSelect?.pay_method || '',
                  })
                  .then((res) => {
                      Toast.hide(toast);
                      if (res.code === '000000') {
                          this.props.navigation.navigate('TradeProcessing', res.result);
                      } else {
                          Toast.show(res.message);
                      }
                  })
            : http
                  .post('/trade/fix_invest/do/20210101', {
                      poid,
                      amount,
                      password,
                      trade_method: bankSelect?.pay_type,
                      pay_method: bankSelect?.pay_method || '',
                      cycle: currentDate[0],
                      timing: currentDate[1],
                      need_buy: this.need_buy,
                  })
                  .then((res) => {
                      Toast.hide(toast);
                      if (res.code === '000000') {
                          this.props.navigation.navigate('TradeFixedConfirm', res.result);
                      } else {
                          Toast.show(res.message);
                      }
                  });
    };
    /**
     * @description:购买计划 生产buyid
     * @param {*} plan
     * @return {*}
     */
    plan = (amount) => {
        const params = {
            amount,
            pay_method: this.state.bankSelect?.pay_method,
            poid: this.state.poid,
        };
        http.get('/trade/buy/plan/20210101', params).then((data) => {
            this.setState({planData: data.result});
        });
    };

    /**
     * @description: 金额输入
     * @param {*} onInput
     * @return {*}
     */
    onInput = (amount) => {
        this.setState({amount});
        if (amount > this.state.data.buy_info.initial_amount) {
            this.setState({buyBtnCanClick: true});
            this.plan(amount);
        } else {
            this.setState({buyBtnCanClick: false});
        }
    };
    /**
     * @description: 购买按钮
     * @param {*} buyClick
     * @return {*}
     */
    buyClick = () => {
        const {type, data} = this.state;
        global.LogTool('buy');
        Keyboard.dismiss();
        if (type == 1 && data.fix_info.first_order) {
            Modal.show({
                title: data.fix_modal.title,
                confirm: true,
                content: data.fix_modal.content,
                confirmText: data.fix_modal.confirm_text,
                cancelText: data.fix_modal.cancel_text,
                confirmCallBack: () => {
                    this.passwordModal.show();

                    this.need_buy = true;
                },
                cancelCallBack: () => {
                    this.passwordModal.show();

                    this.need_buy = false;
                },
            });
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
    //跳转
    jumpPage = (nav, param) => {
        this.props.navigation.navigate(nav, param);
    };
    //处理日期数据
    _createDateData() {
        const {date_items} = this.state.data.period_info;
        var data = [];
        for (var i in date_items) {
            var obj = {};
            var second = [];
            for (var j in date_items[i].val) {
                second.push(date_items[i].val[j]);
            }
            obj[date_items[i].key] = second;
            data.push(obj);
        }
        return data;
    }
    // 打开日期选择 视图
    _showDatePicker() {
        this.setState({showMask: true});
        Picker.init({
            pickerTitleText: '定投周期',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerData: this._createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            wheelFlex: [1, 1],
            onPickerConfirm: (pickedValue) => {
                this.setState({showMask: false, currentDate: pickedValue});
                http.get('/trade/fix_invest/next_day/20210101', {
                    cycle: pickedValue[0],
                    timing: pickedValue[1],
                }).then((res) => {
                    this.setState({nextday: res.result.nextday});
                });
            },
            onPickerCancel: () => {
                this.setState({showMask: false});
            },
        });
        Picker.show();
    }
    changeBuyStatus = (obj) => {
        this.setState({type: obj.i}, () => {
            this.init();
        });
        // this.setState({type: obj.i}, () => {
        //     this.init();
        // });
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
                                        <View key={index}>
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
                                                            key={fund.name}
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
                                    uri: bankSelect?.bank_icon,
                                }}
                            />
                            <View style={{flex: 1}}>
                                <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                                    {bankSelect?.bank_name}
                                </Text>
                                <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                    {bankSelect?.limit_desc}
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
                                <TouchableOpacity
                                    style={[styles.yel_btn]}
                                    onPress={() => {
                                        this.jumpPage('LargeAmount');
                                    }}>
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
        const {nextday} = this.state;
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
                <Text style={{color: Colors.darkGrayColor, fontSize: px(12), lineHeight: px(17)}}>{nextday}</Text>
            </TouchableOpacity>
        );
    }
    //购买
    render_buy() {
        const {amount, data, type, planData} = this.state;
        const {buy_info, title, pay_methods} = data;
        return (
            <ScrollView style={{color: Colors.bgColor}}>
                <PasswordModal
                    ref={(ref) => {
                        this.passwordModal = ref;
                    }}
                    onDone={this.submit}
                />
                <Text style={styles.title}>{title}</Text>
                {buy_info ? (
                    <View style={styles.buyCon}>
                        <Text style={{fontSize: px(16), marginVertical: px(4)}}>{buy_info.title}</Text>
                        <View style={styles.buyInput}>
                            <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={[styles.inputStyle, {fontFamily: amount.length > 0 ? Font.numMedium : null}]}
                                placeholder={buy_info.hidden_text}
                                placeholderTextColor={Colors.lightGrayColor}
                                onChangeText={this.onInput}
                                value={amount}
                            />
                            {amount.length > 0 && (
                                <TouchableOpacity onPress={this.clearInput}>
                                    <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.tip}>
                            {planData.fee_text ? (
                                <HTML
                                    style={{fontSize: px(12), color: Colors.lightGrayColor}}
                                    html={planData?.fee_text}
                                />
                            ) : null}
                        </View>
                    </View>
                ) : null}
                {/* 银行卡 */}
                {this.render_bank()}
                {/* 买入明细 */}
                {type == 0 && this.render_config()}
                {/* 定投周期 */}
                {type == 1 && this.render_autoTime()}
                {type == 0 && (
                    <Text style={[styles.aggrement, {paddingHorizontal: px(16), marginBottom: px(20)}]}>
                        点击确认购买即代表您已知悉该基金组合的
                        <Text
                            onPress={() => {
                                this.jumpPage('TradeAgreements', {poid: this.state.poid});
                            }}
                            style={{color: Colors.btnColor}}>
                            基金组合协议
                        </Text>
                        和
                        <Text
                            style={{color: Colors.btnColor}}
                            onPress={() => {
                                this.jumpPage('TradeAgreements', {fund_codes: planData?.codes});
                            }}>
                            产品概要
                        </Text>
                        等相关内容
                    </Text>
                )}
                <BankCardModal
                    data={pay_methods || []}
                    select={0}
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
        const {showMask, data, type, has_tab, buyBtnCanClick} = this.state;
        const {button} = data;
        return (
            <View style={{flex: 1, paddingBottom: isIphoneX() ? px(85) : px(51)}}>
                {has_tab ? (
                    <ScrollableTabView
                        onChangeTab={this.changeBuyStatus}
                        initialPage={type}
                        renderTabBar={() => <TabBar />}>
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
                {button && (
                    <FixedButton
                        title={button.text}
                        disabled={button.avail == 0 || !buyBtnCanClick}
                        onPress={this.buyClick}
                    />
                )}
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
        padding: 0,
    },
    tip: {
        height: px(33),
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
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
        // resizeMode: 'contain',
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
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
        height: px(70),
        marginBottom: px(12),
        justifyContent: 'center',
    },
    yel_btn: {
        paddingVertical: px(5),
        paddingHorizontal: px(8),
        borderColor: Colors.yellow,
        borderWidth: 0.5,
        borderRadius: 8,
        textAlign: 'center',
    },
    aggrement: {
        color: Colors.darkGrayColor,
        fontSize: px(12),
        lineHeight: px(17),
    },
});

export default TradeBuy;
