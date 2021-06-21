/*
 * @Date: 2021-01-20 10:25:41
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-17 10:10:14
 * @Description: 购买定投
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Keyboard} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../../components/TabBar.js';
import {Colors, Font, Style} from '../../common/commonStyle.js';
import {px, isIphoneX, onlyNumber, deviceWidth} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {BankCardModal, Modal, BottomModal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Mask from '../../components/Mask';
import http from '../../services';
import Picker from 'react-native-picker';
import HTML from '../../components/RenderHtml';
import Toast from '../../components/Toast/Toast.js';
import {useFocusEffect} from '@react-navigation/native';
import BottomDesc from '../../components/BottomDesc';
import Ratio from '../../components/Radio';
import FastImage from 'react-native-fast-image';
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
            amount: props.route?.params?.amount || '', //${props.route?.params?.amount}
            password: '',
            configExpand: false, //买入明细是否展开
            showMask: false,
            bankSelect: '', //选中的银行卡
            bankSelectIndex: 0,
            poid: this.props.route?.params?.poid || 1,
            currentDate: '', //定投日期
            nextday: '',
            buyBtnCanClick: false,
            fee_text: '',
            errTip: '', //错误提示
            mfbTip: false,
            isLargeAmount: false,
            largeAmount: '',
            fixTip: '',
            largeAmountAB: false,
        };
    }
    getTab = () => {
        const {poid} = this.state;
        http.get('/trade/set_tabs/20210101', {poid}).then((data) => {
            this.setState({
                type: data.result.active,
                has_tab: data.result.has_tab,
            });
            if (data.result.active == 1 && data.result.has_tab) {
                this.init(data.result.active);
            }
        });
    };
    componentDidMount() {
        this.getTab();
    }
    init = (_type) => {
        this.setState({bankSelectIndex: 0});
        const {type, poid} = this.state;
        http.get('/trade/buy/info/20210101', {
            type: _type || type,
            poid,
        }).then((res) => {
            if (res.code === '000000') {
                this.setState(
                    {
                        data: res.result,
                        bankSelect: res.result?.pay_methods[0],
                        currentDate: res.result?.period_info?.current_date,
                        nextday: res.result?.period_info?.nextday,
                    },
                    () => {
                        let amount = this.state.amount;
                        if (this.state.type == 0) {
                            this.plan(amount);
                        }
                        if (amount) {
                            this.onInput(amount, 'init');
                        }
                    }
                );
            }
        });
    };

    /**
     * @description: 购买提交
     * @param {*}
     * @return {*}
     */
    submit = (password) => {
        global.LogTool('tpwd');
        const {poid, bankSelect, type, currentDate, isLargeAmount, largeAmount} = this.state;
        let toast = Toast.showLoading();
        let bank = isLargeAmount ? largeAmount : bankSelect || '';
        if (type == 0) {
            this.plan(this.state.amount).then((buy_id) => {
                http.post('/trade/buy/do/20210101', {
                    poid,
                    buy_id: buy_id || this.state.planData.buy_id,
                    amount: this.state.amount,
                    password,
                    trade_method: bank?.pay_type,
                    pay_method: bank.pay_method || '',
                }).then((res) => {
                    Toast.hide(toast);
                    if (res.code === '000000') {
                        this.props.navigation.navigate('TradeProcessing', res.result);
                    } else {
                        Toast.show(res.message, {
                            onHidden: () => {
                                if (res.code === 'TA2803') {
                                    this.passwordModal.show();
                                }
                            },
                        });
                    }
                });
            });
        } else {
            http.post('/trade/fix_invest/do/20210101', {
                poid,
                amount: this.state.amount,
                password,
                trade_method: bankSelect?.pay_type,
                pay_method: bankSelect?.pay_method || '',
                cycle: currentDate[0],
                timing: currentDate[1],
                need_buy: this.need_buy,
            }).then((res) => {
                Toast.hide(toast);
                if (res.code === '000000') {
                    this.props.navigation.replace('TradeFixedConfirm', res.result);
                } else {
                    Toast.show(res.message);
                }
            });
        }
    };
    /**
     * @description:购买计划 生产buyid
     * @param {*} plan
     * @return {*}
     */
    plan = (amount) => {
        return new Promise((resove, reject) => {
            const params = {
                amount: amount || this.state.data.buy_info.initial_amount,
                pay_method: this.state.bankSelect?.pay_method,
                poid: this.state.poid,
                init: amount ? 0 : 1,
            };
            http.get('/trade/buy/plan/20210101', params).then((data) => {
                if (data.code === '000000') {
                    this.setState({planData: data.result, fee_text: data.result.fee_text});
                    resove(data.result.buy_id);
                } else {
                    this.setState({
                        buyBtnCanClick: false,
                        errTip: data.message,
                    });
                    reject();
                }
            });
        });
    };

    /**
     * @description: 金额输入
     * @param {*} onInput
     * @return {*}
     */
    timer = null;
    onInput = async (_amount, init) => {
        let selectCard = this.state.isLargeAmount ? this.state.largeAmount : this.state.bankSelect;

        if (!_amount && this.state.type == 0) {
            await this.plan('');
        }
        this.setState({errTip: '', fixTip: '', largeAmountAB: false}, async () => {
            if (this.state.type == 0) {
                if (_amount > selectCard.left_amount && selectCard.pay_method !== 'wallet') {
                    // 您当日剩余可用额度为
                    this.setState({
                        buyBtnCanClick: false,
                        errTip: `您当日剩余可用额度为${selectCard.left_amount}元，推荐使用大额极速购`,
                        largeAmountAB: this.state.data.large_pay_abtest ? true : false,
                        mfbTip: false,
                    });
                } else if (_amount > selectCard.single_amount) {
                    if (selectCard.pay_method == 'wallet') {
                        this.setState({
                            buyBtnCanClick: false,
                            errTip: '魔方宝余额不足,建议',
                            mfbTip: true,
                        });
                    } else {
                        this.setState({
                            buyBtnCanClick: false,
                            errTip: `最大单笔购买金额为${selectCard.single_amount}元`,
                            mfbTip: false,
                        });
                    }
                } else if (_amount >= this.state.data.buy_info.initial_amount) {
                    clearTimeout(this.timer);
                    this.setState({
                        buyBtnCanClick: this.state.errTip == '' ? true : false,
                        mfbTip: false,
                    });
                    this.timer = setTimeout(() => {
                        this.plan(_amount);
                    }, 500);
                } else {
                    this.setState({buyBtnCanClick: false, mfbTip: false});
                    if (_amount) {
                        this.setState({errTip: `起购金额${this.state.data.buy_info.initial_amount}`});
                    } else {
                        this.setState({errTip: ''});
                    }
                }
            } else {
                //定投
                if (_amount > this.state.bankSelect.day_limit && this.state.bankSelect.pay_method !== 'wallet') {
                    this.setState({
                        buyBtnCanClick: false,
                        errTip: `最大单日购买金额为${this.state.bankSelect.day_limit}元`,
                        mfbTip: false,
                    });
                } else if (_amount < this.state.data.buy_info.initial_amount) {
                    this.setState({buyBtnCanClick: false, mfbTip: false});
                    if (_amount) {
                        this.setState({errTip: `起购金额${this.state.data.buy_info.initial_amount}`});
                    } else {
                        this.setState({errTip: ''});
                    }
                } else {
                    this.setState({
                        buyBtnCanClick: true,
                        errTip: '',
                        fixTip: this.state.data?.actual_amount
                            ? `${_amount * this.state.data?.actual_amount.min}元~${
                                  _amount * this.state.data?.actual_amount.max
                              }元`
                            : '',
                        mfbTip: false,
                    });
                }
            }
        });
    };
    showFixModal = () => {
        this.bottomModal.show();
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
        this.onInput('');
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
        Keyboard.dismiss();
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
            pickerTextEllipsisLen: 100,
            wheelFlex: [1, 1],
            selectedValue: [this.state.currentDate[0], this.state.currentDate[1]],
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
    ratioChange = (checked, index) => {
        this.setState(
            {
                isLargeAmount: index == 1 ? true : false,
                largeAmount: index == 1 ? this.state.data?.large_pay_method : '',
            },
            async () => {
                // await this.plan(this.state.amount);
                this.onInput(this.state.amount);
            }
        );
    };
    changeBuyStatus = (obj) => {
        if (obj.from == 0 && obj.i == 0) {
            return;
        }
        this.setState({type: obj.i, errTip: ''}, () => {
            this.init(null, 'cacheBank');
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
                                    title: '购买明细',
                                    content:
                                        '根据您输入的购买金额不同，系统会实时计算匹配最优的基金配置方案，金额的变动可能会导致配置的基金和比例跟随变动。',
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
                                            <View style={[Style.flexRow, {marginBottom: px(14)}]}>
                                                <View style={[Style.flexRow, {width: px(200)}]}>
                                                    <View style={[styles.circle, {backgroundColor: item.color}]} />
                                                    <Text style={styles.config_title}>{item.title}</Text>
                                                </View>
                                                {index == 0 && (
                                                    <>
                                                        <Text
                                                            style={[
                                                                styles.config_title,
                                                                {
                                                                    width: px(60),
                                                                    textAlign: 'center',
                                                                },
                                                            ]}>
                                                            {header.percent}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.config_title,
                                                                {flex: 1, textAlign: 'right'},
                                                            ]}>
                                                            {header.amount}
                                                        </Text>
                                                    </>
                                                )}
                                            </View>
                                            {item.funds &&
                                                item.funds.map((fund, _index) => {
                                                    return (
                                                        <View
                                                            key={fund.name}
                                                            style={[Style.flexRow, {marginBottom: px(14)}]}>
                                                            <View style={[{width: px(200)}]}>
                                                                <Text
                                                                    style={[
                                                                        styles.config_title_desc,
                                                                        {fontSize: px(12)},
                                                                    ]}>
                                                                    {fund.name}
                                                                </Text>
                                                            </View>

                                                            <Text
                                                                style={[
                                                                    styles.config_title_desc,
                                                                    {
                                                                        width: px(60),
                                                                        fontFamily: Font.numMedium,
                                                                        textAlign: 'center',
                                                                    },
                                                                ]}>
                                                                {Number(fund.percent * 100).toFixed(2)}%
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    styles.config_title_desc,
                                                                    {
                                                                        fontFamily: Font.numMedium,
                                                                        flex: 1,
                                                                        textAlign: 'right',
                                                                    },
                                                                ]}>
                                                                {fund.amount == '--'
                                                                    ? '--'
                                                                    : Number(fund.amount).toFixed(2)}
                                                            </Text>
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
                <View style={[Style.flexRow, styles.bankCard]}>
                    {large_pay_method ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                this.ratioChange(null, 0);
                            }}
                            style={Style.flexRow}>
                            <Ratio
                                style={{marginRight: px(10)}}
                                click={true}
                                checked={!this.state.isLargeAmount}
                                index={0}
                            />
                            <Image
                                style={styles.bank_icon}
                                source={{
                                    uri: bankSelect?.bank_icon,
                                }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Image
                            style={styles.bank_icon}
                            source={{
                                uri: bankSelect?.bank_icon,
                            }}
                        />
                    )}
                    <View style={[Style.flexBetween, {flex: 1}]}>
                        {pay_methods?.length > 0 ? (
                            <>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={this.changeBankCard}
                                    style={[{flex: 1}, Style.flexRow]}>
                                    <View>
                                        <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                                            {bankSelect?.bank_name}
                                            {bankSelect?.bank_no ? <Text>({bankSelect?.bank_no})</Text> : null}
                                        </Text>
                                        <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                            {bankSelect?.limit_desc}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {bankSelect.pay_method == 'wallet' ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            this.jumpPage('MfbIn', {fr: 'trade_buy'});
                                        }}>
                                        <Text style={{color: Colors.btnColor}}>
                                            充值
                                            <Icon name={'right'} size={px(12)} />
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity activeOpacity={0.8} onPress={this.changeBankCard}>
                                        <Text style={{color: Colors.lightGrayColor}}>
                                            切换
                                            <Icon name={'right'} size={px(12)} />
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : null}
                    </View>
                </View>
                {large_pay_method ? (
                    <View
                        style={[
                            styles.bankCard,
                            Style.flexBetween,
                            {borderTopColor: Colors.borderColor, borderTopWidth: 0.5},
                        ]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                this.ratioChange(null, 1);
                            }}
                            style={Style.flexRow}>
                            <Ratio
                                style={{marginRight: px(10)}}
                                index={1}
                                click={true}
                                checked={this.state.isLargeAmount}
                            />
                            <Image
                                style={styles.bank_icon}
                                source={{
                                    uri: large_pay_method.bank_icon,
                                }}
                            />
                        </TouchableOpacity>
                        {pay_methods ? (
                            <>
                                <View style={{flex: 1}}>
                                    <Text style={{color: '#101A30', fontSize: px(14), marginBottom: 8}}>
                                        {large_pay_method.bank_name}
                                    </Text>
                                    {this.state.data.large_pay_abtest ? (
                                        <View
                                            style={[
                                                Style.flexRow,
                                                {flex: 1, marginRight: px(12), marginBottom: px(4)},
                                            ]}>
                                            <FastImage
                                                source={require('../../assets/img/trade/fire.png')}
                                                style={[styles.large_icon, {alignSelf: 'flex-start'}]}
                                            />
                                            <Text style={styles.large_text}>限时免申购手续费</Text>
                                        </View>
                                    ) : null}
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
                                        去使用
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
        const {data, type, planData, errTip, amount, mfbTip} = this.state;
        const {buy_info, sub_title, pay_methods} = data;
        return (
            <ScrollView style={{color: Colors.bgColor}} keyboardShouldPersistTaps="handled">
                <PasswordModal
                    ref={(ref) => {
                        this.passwordModal = ref;
                    }}
                    onDone={this.submit}
                />
                <Text style={styles.title}>{sub_title}</Text>
                {buy_info ? (
                    <View style={styles.buyCon}>
                        <Text style={{fontSize: px(16), marginVertical: px(4)}}>
                            {buy_info.title}{' '}
                            {buy_info?.sub_title ? (
                                <Text style={{fontSize: px(14), color: Colors.darkGrayColor}}>
                                    {buy_info.sub_title}
                                </Text>
                            ) : null}
                        </Text>
                        <View style={styles.buyInput}>
                            <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                            <TextInput
                                keyboardType="numeric"
                                style={[
                                    styles.inputStyle,
                                    {fontFamily: `${amount}`.length > 0 ? Font.numMedium : null},
                                ]}
                                onBlur={() => {
                                    global.LogTool('buy_input');
                                }}
                                placeholder={buy_info.hidden_text}
                                placeholderTextColor={Colors.placeholderColor}
                                onChangeText={(_amount) => {
                                    if (_amount >= 100000000) {
                                        Toast.show('金额需小于1亿');
                                    }
                                    this.setState({amount: onlyNumber(_amount >= 100000000 ? '99999999.99' : _amount)});
                                    this.onInput(onlyNumber(_amount));
                                }}
                                value={`${amount}`}
                            />
                            {`${amount}`.length > 0 && (
                                <TouchableOpacity onPress={this.clearInput}>
                                    <Icon name="closecircle" color="#CDCDCD" size={px(16)} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {planData.fee_text && errTip == '' && this.state.type == 0 ? (
                            <>
                                <View style={styles.tip}>
                                    <HTML
                                        style={{fontSize: px(12), color: Colors.lightGrayColor}}
                                        html={planData?.fee_text}
                                    />
                                </View>
                                {planData?.score_text ? (
                                    <View style={styles.tip}>
                                        <HTML
                                            style={{fontSize: px(12), color: Colors.lightGrayColor}}
                                            html={planData?.score_text}
                                        />
                                    </View>
                                ) : null}
                            </>
                        ) : errTip ? (
                            <>
                                <View style={styles.tip}>
                                    <Text style={{color: Colors.red}}>
                                        {errTip}
                                        {mfbTip ? (
                                            <Text
                                                style={{color: Colors.btnColor}}
                                                onPress={() => {
                                                    this.jumpPage('MfbIn', {fr: 'trade_buy'});
                                                }}>
                                                立即充值
                                            </Text>
                                        ) : null}
                                    </Text>
                                </View>
                                {this.state.largeAmountAB ? (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={[styles.large_tip, Style.flexBetween]}
                                        onPress={() => {
                                            this.jumpPage('LargeAmount');
                                        }}>
                                        <View style={[Style.flexRow, {flex: 1, marginRight: px(12)}]}>
                                            <FastImage
                                                source={require('../../assets/img/trade/fire.png')}
                                                style={[styles.large_icon, {alignSelf: 'flex-start'}]}
                                            />
                                            <Text style={styles.large_text}>
                                                使用大额极速购，限时免申购手续费（先购后返）
                                            </Text>
                                        </View>
                                        <Text style={{color: Colors.yellow}}>
                                            <Icon name={'right'} color size={px(12)} />
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </>
                        ) : null}
                        {errTip == '' && this.state.fixTip ? (
                            <View
                                style={[
                                    styles.tip,
                                    Style.flexBetween,
                                    {borderTopWidth: 0, height: px(24), marginTop: px(-4), paddingLeft: px(3)},
                                ]}>
                                <Text style={{fontSize: px(12)}}>
                                    实际定投金额:<Text style={{color: Colors.yellow}}>{this.state.fixTip}</Text>
                                </Text>
                                <Text style={{color: Colors.btnColor}} onPress={this.showFixModal}>
                                    计算方式
                                </Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}
                {/* 银行卡 */}
                {this.render_bank()}
                {/* 买入明细 */}
                {type == 0 && this.render_config()}
                {/* 定投周期 */}
                {type == 1 && this.render_autoTime()}

                <Text style={[styles.aggrement, {paddingHorizontal: px(16), marginBottom: px(20)}]}>
                    购买即代表您已知悉该基金组合的
                    <Text
                        onPress={() => {
                            this.jumpPage('TradeAgreements', {poid: this.state.poid, type: this.state.type});
                        }}
                        style={{color: Colors.btnColor}}>
                        基金组合协议
                    </Text>
                    和
                    <Text
                        style={{color: Colors.btnColor}}
                        onPress={() => {
                            this.jumpPage('TradeAgreements', {fund_codes: planData?.codes, type: this.state.type});
                        }}>
                        产品概要
                    </Text>
                    等内容
                </Text>

                <BottomDesc />
                <BottomModal ref={(ref) => (this.bottomModal = ref)} title="低估值定投计算方式">
                    <FastImage
                        source={require('../../assets/img/common/fixIcon.png')}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{width: px(322), height: px(251), marginLeft: (deviceWidth - px(322)) / 2}}
                    />
                </BottomModal>
                <BankCardModal
                    data={pay_methods || []}
                    select={this.state.bankSelectIndex}
                    ref={(ref) => {
                        this.bankCard = ref;
                    }}
                    onDone={(select, index) => {
                        this.setState({bankSelect: select, bankSelectIndex: index}, async () => {
                            if (!this.state.isLargeAmount) {
                                this.onInput(this.state.amount);
                            }
                        });
                    }}
                />
            </ScrollView>
        );
    }

    render() {
        const {showMask, data, type, buyBtnCanClick} = this.state;
        const {button} = data;
        return (
            <>
                <Focus init={this.init} />
                {data ? (
                    <View
                        style={{
                            flex: 1,
                            paddingBottom: isIphoneX() ? px(85) : px(51),
                            backgroundColor: Colors.bgColor,
                            paddingTop: 1,
                        }}>
                        {this.state.has_tab ? (
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
                        {showMask && (
                            <Mask
                                onClick={() => {
                                    this.setState({showMask: false});
                                    Picker.hide();
                                }}
                            />
                        )}
                    </View>
                ) : null}
            </>
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
        paddingBottom: px(10),
        color: Colors.lightBlackColor,
        paddingLeft: px(16),
    },
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
        paddingVertical: px(12),
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
        textAlign: 'center',
    },
    config_title_desc: {
        fontSize: px(13),
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
        borderRadius: px(4),
        textAlign: 'center',
    },
    aggrement: {
        color: Colors.darkGrayColor,
        fontSize: px(12),
        lineHeight: px(17),
    },
    large_tip: {
        backgroundColor: '#FFF5E5',
        padding: px(6),
        marginBottom: px(12),
        borderRadius: px(4),
    },
    large_icon: {
        width: px(15),
        height: px(15),
        marginRight: px(2),
    },
    large_text: {
        fontSize: px(12),
        lineHeight: px(17),
        flex: 1,
        color: Colors.orange,
    },
});

export default TradeBuy;
