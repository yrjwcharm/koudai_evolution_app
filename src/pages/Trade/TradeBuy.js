/*
 * @Date: 2021-01-20 10:25:41
 * @Description: 购买定投
 */
import React, {Component, useState} from 'react';
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Keyboard,
    Switch,
    Platform,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '~/components/TabBar.js';
import {Colors, Font, Space, Style} from '~/common/commonStyle.js';
import {px, isIphoneX, onlyNumber, deviceWidth} from '~/utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '~/components/Button';
import {BankCardModal, Modal, BottomModal} from '~/components/Modal';
import {PasswordModal} from '~/components/Password';
import Mask from '~/components/Mask';
import http from '~/services';
import Picker from 'react-native-picker';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast/Toast.js';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import BottomDesc from '~/components/BottomDesc';
import Ratio from '~/components/Radio';
import FastImage from 'react-native-fast-image';
import {useJump} from '~/components/hooks';
import {useSelector} from 'react-redux';
import Html from '~/components/RenderHtml';
import memoize from 'memoize-one';
import {Questionnaire} from './FundTradeBuy';
import {getBuyQuestionnaire} from './FundTradeBuy/services';
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
            configExpand: true, //买入明细是否展开
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
            isLargeAmount: !!this.props.route?.params?.isLargeAmount,
            largeAmount: '',
            fixTip: '',
            largeTip: '',
            deltaHeight: 0,
            autoChargeStatus: false,
            is_continue_buy: false,
        };
        this.plan_id = this.props.route?.params?.plan_id || '';
        this.show_risk_disclosure = true;
        this._tabType = null;
        this.log_id;
    }
    getTab = async () => {
        const {poid} = this.state;
        http.post('/advisor/action/report/20220422', {
            action: 'select',
            poids: [poid],
        });
        let data = await http.get('/trade/set_tabs/20210101', {
            page_type: this.props.route.params.page_type || '',
            poid,
        });
        const active = data.result.has_tab && this._tabType !== null ? this._tabType : data.result.active;
        this.setState(
            {
                type: active,
                has_tab: data.result.has_tab,
            },
            () => {
                this.init(active);
                if (this.tabView) {
                    this.tabView.goToPage(active);
                }
            }
        );
    };
    init_timer = null;
    init = (_type) => {
        // console.log(this.props);
        this.setState({bankSelectIndex: 0});
        const {type, poid} = this.state;
        if (this.init_timer) clearTimeout(this.init_timer);
        this.init_timer = setTimeout(() => {
            http.get('/trade/buy/info/20210101', {
                type: _type || type,
                poid,
                amount: this.state.amount,
                page_type: this.props.route.params.page_type || '',
            }).then((res) => {
                if (res.code === '000000') {
                    this.props.navigation.setOptions({title: res.result.title || '买入'});
                    this.log_id = res.result?.log_id;
                    global.LogTool('effect_jump', '', this.log_id);
                    // this.props.modalRef 该弹窗之前存在弹窗，则该弹窗不弹出
                    if (
                        this.props.isFocused &&
                        res.result?.risk_disclosure &&
                        res.result?.pop_risk_disclosure &&
                        this.show_risk_disclosure &&
                        !this.props.modalRef
                    ) {
                        this.showRiskDisclosure(res.result);
                    } else if (this.props.isFocused && res.result?.risk_pop && !this.props.modalRef) {
                        this.showRishPop(res.result);
                    }
                    this.setState(
                        {
                            data: res.result,
                            bankSelect: res.result?.pay_methods[0],
                            largeAmount: this.state.isLargeAmount ? res.result.large_pay_method : '',
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
        }, 300);
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!!nextProps.route?.params.isLargeAmount !== !!this.state.isLargeAmount && !this.state.isLargeAmount) {
            this.ratioChange(null, 1);
        }
    }
    /**
     * @description 展示风险揭示书
     * @param {any} data 风险揭示书内容
     * @returns void
     */
    showRiskDisclosure = (data) => {
        if (!data.risk_disclosure) return false;
        this.show_risk_disclosure = false;
        Modal.show({
            children: () => {
                return (
                    <View>
                        <Text
                            style={{
                                marginTop: px(2),
                                fontSize: Font.textH2,
                                lineHeight: px(20),
                                color: Colors.red,
                                textAlign: 'center',
                            }}>
                            {data.risk_disclosure.sub_title}
                        </Text>
                        <ScrollView
                            bounces={false}
                            style={{
                                marginVertical: Space.marginVertical,
                                paddingHorizontal: px(20),
                                maxHeight: px(352),
                            }}
                            ref={(e) => (this.riskDisclosureModalRef = e)}>
                            <Html
                                style={{fontSize: px(13), lineHeight: px(22), color: Colors.descColor}}
                                html={data.risk_disclosure.content}
                            />
                        </ScrollView>
                    </View>
                );
            },
            confirmCallBack: () => {
                // if (this.props.isFocused && data.risk_pop) {
                //     this.showRishPop(data);
                // }
                http.post('/advisor/action/report/20220422', {
                    action: 'read',
                    poids: [this.state.poid],
                });
            },
            confirmText: '关闭',
            countdown: data.risk_disclosure.countdown,
            isTouchMaskToClose: false,
            onCloseCallBack: () => this.props.navigation.goBack(),
            onCountdownChange: (val) => {
                if (+val == 1) {
                    this.riskDisclosureModalRef.scrollToEnd({animated: true});
                }
            },
            title: data.risk_disclosure.title,
        });
    };

    /**
     * @description 展示风险弹窗
     * @param {any} data 风险弹窗内容
     * @returns void
     */
    showRishPop = (data) => {
        global.LogTool('RiskWindow_Show', '', this.log_id);
        if (!data.risk_pop) return false;
        Modal.show({
            cancelCallBack: () => {
                global.LogTool('RiskWarningWindows_No');
                if (data.risk_pop.cancel?.act == 'back') {
                    this.props.navigation.goBack();
                } else if (data.risk_pop.cancel?.act == 'jump') {
                    this.props.jump(data.risk_pop.cancel?.url);
                }
            },
            cancelText: data.risk_pop.cancel.text,
            confirm: true,
            confirmCallBack: () => {
                global.LogTool('RiskWarningWindows_Yes');
                this.setState({is_continue_buy: true});
                if (data.risk_pop.confirm?.act == 'back') {
                    this.props.navigation.goBack();
                } else if (data.risk_pop.confirm?.act == 'jump') {
                    this.props.jump(data.risk_pop.confirm?.url);
                } else if (data.risk_pop.confirm?.act == 'pop_risk_disclosure') {
                    this.showRiskDisclosure(data);
                }
            },
            confirmText: data.risk_pop.confirm.text,
            content: data.risk_pop.content,
            isTouchMaskToClose: false,
            title: data.risk_pop.title,
        });
    };

    /**
     * @description: 购买提交
     * @param {*}
     * @return {*}
     */
    submit = async (password) => {
        global.LogTool('tpwd');
        const {poid, bankSelect, type, currentDate, isLargeAmount, largeAmount} = this.state;

        const res = await getBuyQuestionnaire({fr: 'compliance', poid, password});
        const flag = await new Promise((resolve) => {
            const {code, result: {list, summary_id} = {}} = res || {};
            if (code === '000000') {
                if (summary_id) {
                    Modal.show(
                        {
                            backButtonClose: false,
                            children: (
                                <Questionnaire
                                    callback={(action) => {
                                        Modal.close();
                                        if (action === 'close') {
                                            resolve(false);
                                        } else {
                                            resolve(true);
                                        }
                                    }}
                                    data={list}
                                    summary_id={summary_id}
                                />
                            ),
                            header: <View />,
                            isTouchMaskToClose: false,
                            style: {
                                minHeight: 0,
                            },
                        },
                        'slide'
                    );
                } else {
                    resolve(true);
                }
            } else {
                Toast.show(res.message);
                resolve(false);
            }
        });
        if (!flag) {
            // this.props.navigation.goBack();
            return;
        }

        let toast = Toast.showLoading();
        let bank = isLargeAmount ? largeAmount : bankSelect || '';
        if (type == 0) {
            this.plan(this.state.amount)
                .then((buy_id) => {
                    http.post('/trade/buy/do/20210101', {
                        poid,
                        buy_id: buy_id || this.state.planData.buy_id || '',
                        amount: this.state.amount,
                        password,
                        trade_method: bank?.pay_type,
                        pay_method: bank.pay_method || '',
                        page_type: this.props.route.params.page_type || '',
                        is_continue_buy: this.state.is_continue_buy,
                        append: this.props.route?.params?.append || '',
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
                })
                .catch((err) => {
                    Toast.hide(toast);
                    Toast.show(err);
                });
        } else {
            http.post('/trade/fix_invest/do/20210101', {
                poid,
                amount: this.state.amount,
                password,
                wallet_auto_charge: +this.state.autoChargeStatus,
                trade_method: bankSelect?.pay_type,
                pay_method: bankSelect?.pay_method || '',
                cycle: currentDate[0],
                timing: currentDate[1],
                need_buy: this.need_buy,
                append: this.props.route?.params?.append || '',
            }).then((res) => {
                Toast.hide(toast);
                global.LogTool('DetailFixed_TradeBuy_BabyRecharge_Condition', +this.state.autoChargeStatus);
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
        const {isLargeAmount, largeAmount, bankSelect} = this.state;
        return new Promise((resove, reject) => {
            let bank = isLargeAmount ? largeAmount : bankSelect || '';
            const params = {
                amount: amount || this.state.data.buy_info.initial_amount,
                pay_method: bank.pay_method,
                poid: this.state.poid,
                init: amount ? 0 : 1,
                plan_id: this.plan_id,
                page_type: this.props.route.params.page_type || '',
                append: this.props.route?.params?.append || '',
            };
            http.get('/trade/buy/plan/20210101', params).then((data) => {
                if (data.code === '000000') {
                    this.setState({planData: data.result, fee_text: data.result.fee_text});
                    resove(data.result.buy_id);
                } else {
                    this.setState({
                        // buyBtnCanClick: false,
                        errTip: data.message,
                    });
                    reject(data.message);
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
    onInput = (_amount, init) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
            this.plan_id = '';
            let selectCard = this.state.isLargeAmount ? this.state.largeAmount : this.state.bankSelect;
            if (!_amount && this.state.type == 0) {
                await this.plan('');
            }
            this.setState({errTip: '', fixTip: '', largeTip: ''}, async () => {
                if (this.state.type == 0) {
                    if (_amount > selectCard.left_amount && selectCard.pay_method !== 'wallet') {
                        // 您当日剩余可用额度为
                        this.setState({
                            buyBtnCanClick: false,
                            // po_ver为0代表盈米
                            errTip: `您当日剩余可用额度为${selectCard.left_amount}元${
                                this.props.po_ver == 0 ? '' : ' ，推荐使用大额极速购'
                            }`,
                            mfbTip: false,
                        });
                    } else if (_amount > selectCard.single_amount) {
                        if (selectCard.pay_method == 'wallet') {
                            this.setState({
                                buyBtnCanClick: false,
                                errTip: '魔方宝余额不足,建议',
                                mfbTip: true,
                                largeTip:
                                    this.state.planData.left_discount_count > 0
                                        ? `您尚有${this.state.planData.left_discount_count}次大额极速购优惠，去汇款激活使用`
                                        : '',
                            });
                        } else {
                            this.setState({
                                buyBtnCanClick: false,
                                errTip: `最大单笔购买金额为${selectCard.single_amount}元`,
                                mfbTip: false,
                            });
                        }
                    } else if (_amount >= this.state.data.buy_info.initial_amount) {
                        this.setState({
                            buyBtnCanClick: this.state.errTip == '' ? true : false,
                            mfbTip: false,
                        });

                        this.plan(_amount);
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
        }, 300);
    };
    showFixModal = () => {
        this.bottomModal.show();
    };
    /**
     * @description: 购买按钮
     * @param {*} buyClick
     * @return {*}
     */
    buyClick = async () => {
        const {type, data, poid} = this.state;
        global.LogTool({
            event: 'buy',
            plate_id: this.state.isLargeAmount ? 'B' : 'A',
            ctrl: this.state.amount,
            oid: this.log_id,
        });
        http.post('/advisor/action/report/20220422', {action: 'confirm', poids: [poid]});
        Keyboard.dismiss();

        if (data?.buy_do_pop) {
            Modal.show({
                title: data?.buy_do_pop?.title,
                confirm: true,
                cancelCallBack: () => {
                    if (data?.buy_do_pop?.cancel?.act == 'back') {
                        this.props.navigation.goBack();
                    } else if (data?.buy_do_pop?.cancel?.act == 'jump') {
                        this.props.jump(data?.buy_do_pop?.cancel?.url);
                    }
                },
                content: data?.buy_do_pop?.content,
                confirmText: data?.buy_do_pop?.confirm?.text,
                cancelText: data?.buy_do_pop?.cancel?.text,
                confirmCallBack: () => {
                    if (data?.buy_do_pop?.confirm?.url) {
                        this.props.jump(data?.buy_do_pop?.confirm?.url);
                    } else if (type == 1 && data?.fix_info?.first_order) {
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
                },
            });
        } else if (type == 1 && data?.fix_info?.first_order) {
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
        this.setState({amount: '', buyBtnCanClick: false});
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
        if ((obj.from == 0 && obj.i == 0) || (obj.from == 1 && obj.i == 1)) {
            return;
        }
        global.LogTool(obj.i === 0 ? 'purchase' : 'Fixedinvestment');
        this._tabType = obj.i;
        this.setState({type: obj.i, errTip: ''}, () => {
            this.init(null, 'cacheBank');
        });
    };
    //买入明细
    render_config() {
        const {planData, configExpand, data} = this.state;
        const {header, body} = planData;
        const {
            buy_info: {buy_text, tips},
        } = data;
        return (
            header && (
                <View style={{marginBottom: px(12)}}>
                    <TouchableOpacity
                        style={styles.config}
                        activeOpacity={0.9}
                        onPress={() => {
                            this.setState({configExpand: !configExpand});
                        }}>
                        <View style={Style.flexRowCenter}>
                            <Text style={{color: Colors.darkGrayColor, marginRight: px(10), fontSize: px(14)}}>
                                {buy_text || '买入明细'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Modal.show({
                                        title: buy_text || '买入明细',
                                        content:
                                            tips ||
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
                                                                {header.title1}
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    styles.config_title,
                                                                    {flex: 1, textAlign: 'right'},
                                                                ]}>
                                                                {header.title2}
                                                            </Text>
                                                        </>
                                                    )}
                                                </View>
                                                {item.funds &&
                                                    item.funds.map((fund, _index) => {
                                                        const _color1 =
                                                            fund.compare1 == 'gt'
                                                                ? Colors.red
                                                                : fund.compare1 == 'lt'
                                                                ? Colors.green
                                                                : Colors.descColor;
                                                        const _color2 =
                                                            fund.compare2 == 'gt'
                                                                ? Colors.red
                                                                : fund.compare2 == 'lt'
                                                                ? Colors.green
                                                                : Colors.descColor;
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

                                                                <View style={[Style.flexCenter, {width: px(60)}]}>
                                                                    <HTML
                                                                        html={`${fund.field1}`}
                                                                        style={{
                                                                            ...styles.config_title_desc,
                                                                            fontFamily: Font.numMedium,
                                                                        }}
                                                                    />
                                                                    {fund.compare1 !== 'et' && (
                                                                        <Icon
                                                                            name={
                                                                                fund.compare1 == 'gt'
                                                                                    ? 'arrowup'
                                                                                    : 'arrowdown'
                                                                            }
                                                                            color={_color1}
                                                                        />
                                                                    )}
                                                                </View>
                                                                <View
                                                                    style={[
                                                                        Style.flexRow,
                                                                        {flex: 1, justifyContent: 'flex-end'},
                                                                    ]}>
                                                                    <HTML
                                                                        html={`${fund.field2}`}
                                                                        style={{
                                                                            ...styles.config_title_desc,
                                                                            fontFamily: Font.numMedium,
                                                                        }}
                                                                    />
                                                                    {fund.compare2 !== 'et' && (
                                                                        <Icon
                                                                            name={
                                                                                fund.compare2 == 'gt'
                                                                                    ? 'arrowup'
                                                                                    : 'arrowdown'
                                                                            }
                                                                            color={_color2}
                                                                        />
                                                                    )}
                                                                </View>
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
            )
        );
    }
    render_bank() {
        const {data, bankSelect, type, autoChargeStatus} = this.state;
        const {pay_methods, large_pay_method, large_pay_show_type} = data;
        return (
            <View style={{marginBottom: px(12)}}>
                {/* {data?.adviser_fee ? (
                    <View style={{paddingHorizontal: Space.padding, paddingBottom: px(12)}}>
                        <HTML
                            html={data?.adviser_fee}
                            style={{fontSize: Font.textH3, lineHeight: px(17), color: Colors.lightGrayColor}}
                        />
                    </View>
                ) : null} */}
                <View style={[Style.flexRow, styles.bankCard]}>
                    {large_pay_method && large_pay_show_type == 2 ? (
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
                                    onPress={() => {
                                        global.LogTool({event: 'BankCard'});
                                        this.changeBankCard();
                                    }}
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
                                {bankSelect.pay_method == 'wallet' && large_pay_show_type == 2 ? (
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
                {type === 1 && autoChargeStatus && bankSelect.pay_method == 'wallet' && (
                    <View style={{backgroundColor: '#fff', paddingHorizontal: px(16), paddingBottom: px(12)}}>
                        <Html style={styles.autoChargeHintText} html={data.auto_charge?.conflict_tip} />
                    </View>
                )}
                {/* large_pay_show_type  1为显示在内层列表 2为显示在外层 */}
                {large_pay_show_type == 2 && large_pay_method ? (
                    <View
                        style={[
                            styles.bankCard,
                            Style.flexBetween,
                            {borderTopColor: Colors.borderColor, borderTopWidth: 0.5},
                        ]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                global.LogTool('speedbuy');
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

                                    <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>
                                        {large_pay_method.limit_desc}
                                    </Text>
                                </View>
                                {large_pay_method?.button ? (
                                    <TouchableOpacity
                                        style={[styles.yel_btn]}
                                        onPress={() => {
                                            global.LogTool('usebutton');
                                            const url = large_pay_method?.button.url;
                                            this.jumpPage(url.path, url.params);
                                        }}>
                                        <Text style={{color: Colors.yellow}}>
                                            {large_pay_method?.button.text}
                                            <Icon name={'right'} size={px(12)} />
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </>
                        ) : null}
                    </View>
                ) : null}
                {this.state.data.large_pay_tip && large_pay_show_type == 2 ? (
                    <View style={{backgroundColor: '#fff', paddingBottom: px(19)}}>
                        <View style={styles.large_tip}>
                            <Text style={styles.large_text}>
                                <FastImage
                                    source={require('../../assets/img/trade/fire.png')}
                                    style={styles.large_icon}
                                />
                                {this.state.data.large_pay_tip}
                            </Text>
                        </View>
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
                <Html style={{color: Colors.darkGrayColor, fontSize: px(12), lineHeight: px(17)}} html={nextday} />
            </TouchableOpacity>
        );
    }
    // 自动充值
    render_autoRecharge() {
        const {autoChargeStatus, data} = this.state;
        return data.auto_charge ? (
            <View style={styles.autoRechargeContent}>
                <View style={styles.autoRechargePanel}>
                    <View>
                        <Text style={styles.autoRechargePanelText}>{data?.auto_charge?.title}</Text>
                        <View style={styles.autoRechargePanelRecommendWrapper}>
                            <Text style={styles.autoRechargePanelRecommend}>{data?.auto_charge?.label}</Text>
                        </View>
                    </View>
                    <Switch
                        ios_backgroundColor={'#CCD0DB'}
                        onValueChange={(val) => {
                            this.setState({
                                autoChargeStatus: val,
                            });
                        }}
                        thumbColor={'#fff'}
                        trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                        value={autoChargeStatus}
                    />
                </View>
                <View style={styles.autoRechargeDesc}>
                    <Html style={styles.autoRechargeText} html={data?.auto_charge?.desc} />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.autoRechargeDetail}
                        onPress={() => {
                            this.jumpPage(data?.auto_charge?.button?.url?.path, {
                                title: data?.auto_charge?.button?.url?.params.title,
                                img: data?.auto_charge?.detail_img,
                                poid: data?.auto_charge?.button?.url?.params?.poid,
                            });
                        }}>
                        <Text style={{fontSize: px(12), fontWeight: '400', color: '#0051cc', lineHeight: px(17)}}>
                            {data?.auto_charge?.button?.text}
                        </Text>
                    </TouchableOpacity>
                </View>
                {autoChargeStatus && (
                    <View style={styles.autoChargeHintOnOpen}>
                        <Html html={data?.auto_charge?.close_tip} style={styles.autoChargeHintText} />
                    </View>
                )}
            </View>
        ) : null;
    }
    render_deductionHint() {
        return <Text style={styles.render_deductionHintText}>{this.state.data?.auto_charge?.deduction_tip}</Text>;
    }
    //购买
    render_buy() {
        const {data, type, planData, errTip, amount, mfbTip} = this.state;
        const {buy_info, sub_title, pay_methods, large_pay_method, large_pay_show_type} = data;
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
                                    global.LogTool({event: 'EnterAmount', oid: amount});
                                }}
                                placeholder={buy_info.hidden_text}
                                placeholderTextColor={Colors.placeholderColor}
                                onChangeText={(_amount) => {
                                    if (_amount >= 100000000) {
                                        Toast.show('金额需小于1亿');
                                    }
                                    this.setState({
                                        amount: onlyNumber(_amount >= 100000000 ? '99999999.99' : _amount),
                                        buyBtnCanClick: false,
                                    });
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
                        {amount ? (
                            <>
                                {planData.fee_text && errTip == '' && this.state.type == 0 ? (
                                    <>
                                        {planData?.large_pay_fee_info?.status == 2 ? null : (
                                            <View style={styles.tip}>
                                                <HTML
                                                    style={{fontSize: px(12), color: Colors.lightGrayColor}}
                                                    html={planData?.fee_text}
                                                />
                                            </View>
                                        )}
                                        {planData?.large_pay_fee_info?.text ? (
                                            <View style={[styles.tip, Style.flexRow, {justifyContent: 'flex-start'}]}>
                                                <HTML
                                                    style={{fontSize: px(12), color: Colors.lightGrayColor}}
                                                    html={planData?.large_pay_fee_info?.text}
                                                />
                                                <View style={styles.red_tag}>
                                                    <Text style={{color: '#fff', fontSize: px(11)}}>
                                                        {planData?.large_pay_fee_info?.status == 1 ? '推荐' : '优惠'}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : null}
                                        {planData?.score_text ? (
                                            <View style={styles.tip}>
                                                <HTML
                                                    style={{fontSize: px(12), color: Colors.lightGrayColor}}
                                                    html={planData?.score_text}
                                                />
                                            </View>
                                        ) : null}
                                        {data?.adviser_fee ? (
                                            <View style={styles.tip}>
                                                <HTML
                                                    style={{fontSize: px(12), color: Colors.lightGrayColor}}
                                                    html={data.adviser_fee}
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
                                        {this.state.largeTip ? (
                                            <View style={[styles.tip, Style.flexRow, {justifyContent: 'flex-start'}]}>
                                                <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>
                                                    {this.state.largeTip}
                                                </Text>
                                                <View style={styles.red_tag}>
                                                    <Text style={{color: '#fff', fontSize: px(11)}}>推荐</Text>
                                                </View>
                                            </View>
                                        ) : null}
                                    </>
                                ) : null}
                                {errTip == '' && this.state.fixTip ? (
                                    <View
                                        style={[
                                            styles.tip,
                                            Style.flexBetween,
                                            {borderTopWidth: 0, height: px(32), marginTop: px(-4), paddingLeft: px(3)},
                                        ]}>
                                        <Text style={{fontSize: px(12), flexShrink: 1}} numberOfLines={1}>
                                            实际定投金额:<Text style={{color: Colors.yellow}}>{this.state.fixTip}</Text>
                                        </Text>
                                        <Text style={{color: Colors.btnColor}} onPress={this.showFixModal}>
                                            计算方式
                                        </Text>
                                    </View>
                                ) : null}
                            </>
                        ) : null}
                        {errTip === '' && data.buy_info?.tip ? (
                            <View style={styles.tip}>
                                <HTML
                                    html={data.buy_info?.tip}
                                    style={{
                                        fontSize: Font.textH3,
                                        lineHeight: px(17),
                                        color: Colors.lightGrayColor,
                                    }}
                                />
                            </View>
                        ) : null}
                    </View>
                ) : null}
                {/* 定投周期 */}
                {type == 1 && this.render_autoTime()}
                {/* 魔方宝自动充值 */}
                {type == 1 && this.render_autoRecharge()}
                {/* 银行卡 */}
                {this.render_bank()}
                {/* 魔方宝自动充值 */}
                {type == 1 && this.render_deductionHint()}
                {/* 买入明细 */}
                {type == 0 && this.render_config()}

                {data.tips ? (
                    <View style={{padding: Space.padding, paddingTop: px(6)}}>
                        {data.tips.map?.((item, index) => {
                            return (
                                <View key={item + index}>
                                    <Text style={styles.agreement}>{item}</Text>
                                </View>
                            );
                        })}
                    </View>
                ) : null}

                <BottomDesc />
                {/* 博时提示 */}
                {data?.footer?.text ? (
                    <View style={{marginBottom: px(20), paddingHorizontal: px(16)}}>
                        <Text style={{fontSize: px(11), lineHeight: px(17), color: Colors.lightGrayColor}}>
                            {data?.footer?.text}
                        </Text>
                    </View>
                ) : null}
                <BottomModal ref={(ref) => (this.bottomModal = ref)} title="低估值定投计算方式">
                    <FastImage
                        source={require('../../assets/img/common/fixIcon.png')}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{width: px(322), height: px(251), marginLeft: (deviceWidth - px(322)) / 2}}
                    />
                </BottomModal>
                <BankCardModal
                    data={[...pay_methods, large_pay_show_type == 1 && large_pay_method] || []}
                    type={data.add_payment_disable ? 'hidden' : ''}
                    select={this.state.bankSelectIndex}
                    ref={(ref) => {
                        this.bankCard = ref;
                    }}
                    onDone={(select, index) => {
                        this.setState(
                            (prev) => {
                                if (prev.bankSelect?.pay_method !== select?.pay_method) {
                                    if (select?.pop_risk_disclosure) {
                                        setTimeout(() => {
                                            this.showRiskDisclosure(prev.data);
                                        }, 300);
                                    }
                                }
                                return {bankSelect: select, bankSelectIndex: index};
                            },
                            () => {
                                if (!this.state.isLargeAmount) {
                                    this.onInput(this.state.amount);
                                }
                            }
                        );
                    }}
                />
            </ScrollView>
        );
    }
    disableOfwalletErrorOverBtn = memoize((type, autoChargeStatus, pay_method) => {
        return !!(type === 1 && autoChargeStatus && pay_method == 'wallet');
    });
    componentDidUpdate() {
        Platform.OS === 'android' && this.tabView?.goToPage(this.state.type);
    }

    render() {
        const {showMask, data, type, buyBtnCanClick, deltaHeight, autoChargeStatus, bankSelect} = this.state;
        const {button} = data;
        return (
            <>
                <Focus init={this.getTab} />
                {data ? (
                    <View
                        style={{
                            flex: 1,
                            paddingBottom: (isIphoneX() ? px(85) : px(51)) + deltaHeight,
                            backgroundColor: Colors.bgColor,
                            paddingTop: 1,
                        }}>
                        {this.state.has_tab ? (
                            <ScrollableTabView
                                onChangeTab={this.changeBuyStatus}
                                initialPage={type}
                                ref={(tabView) => (this.tabView = tabView)}
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
                                agreement={data?.agreement_bottom ? data?.agreement_bottom : undefined}
                                otherAgreement={data?.agreement}
                                otherParam={{fund_codes: this.state.planData?.codes, type: this.state.type}}
                                title={button.text}
                                disabled={
                                    button.avail == 0 ||
                                    !buyBtnCanClick ||
                                    this.disableOfwalletErrorOverBtn(type, autoChargeStatus, bankSelect?.pay_method)
                                }
                                onPress={this.buyClick}
                                heightChange={(height) => this.setState({deltaHeight: height})}
                                suffix={data?.agreement_bottom?.agree_text}
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
                ) : (
                    <View style={[Style.flexCenter, styles.loading]}>
                        <ActivityIndicator color={Colors.lightGrayColor} />
                    </View>
                )}
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
function WithHooks(props) {
    const jump = useJump();
    const userInfo = useSelector((state) => state.userInfo);
    const isFocused = useIsFocused();
    const [modal, setModal] = useState('');
    useFocusEffect(
        React.useCallback(() => {
            const {anti_pop} = userInfo.toJS();
            setModal('');
            if (anti_pop) {
                const _modal = Modal.show({
                    title: anti_pop.title,
                    content: anti_pop.content,
                    confirm: true,
                    isTouchMaskToClose: false,
                    cancelCallBack: () => {
                        setModal('');
                        props.navigation.goBack();
                    },
                    confirmCallBack: () => {
                        setModal('');
                        if (anti_pop.confirm_action?.url) {
                            if (!anti_pop.confirm_action.url.params) {
                                anti_pop.confirm_action.url.params = {};
                            }
                            anti_pop.confirm_action.url.params.append = props.route?.params?.append || '';
                        }
                        jump(anti_pop.confirm_action?.url);
                    },
                    cancelText: anti_pop.cancel_action?.text,
                    confirmText: anti_pop.confirm_action?.text,
                });
                setModal(_modal);
            }
        }, [userInfo])
    );
    return <TradeBuy {...props} isFocused={isFocused} po_ver={userInfo.toJS()?.po_ver} jump={jump} modalRef={modal} />;
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
        // height: px(33),
        paddingVertical: px(8),
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
        color: Colors.descColor,
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
        paddingVertical: px(12),
        backgroundColor: '#fff',
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
    agreement: {
        color: Colors.darkGrayColor,
        fontSize: px(12),
        lineHeight: px(17),
    },
    large_tip: {
        backgroundColor: '#FFF5E5',
        padding: px(6),
        borderRadius: px(4),
        marginHorizontal: px(16),
    },
    large_icon: {
        width: px(14),
        height: px(14),
        marginRight: px(3),
    },
    large_text: {
        fontSize: px(12),
        lineHeight: px(18),
        color: Colors.orange,
    },
    red_tag: {
        backgroundColor: Colors.red,
        borderRadius: px(10),
        borderBottomLeftRadius: 0,
        paddingHorizontal: px(5),
        paddingVertical: px(2),
        marginLeft: px(4),
    },
    loading: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: Colors.bgColor,
        zIndex: 99,
    },
    autoRechargeContent: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        marginBottom: px(12),
    },
    autoRechargePanel: {
        paddingVertical: px(14),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
    },
    autoRechargePanelText: {
        fontSize: px(16),
        fontWeight: '400',
        color: '#1F2432',
        lineHeight: px(22),
    },
    autoRechargePanelRecommendWrapper: {
        backgroundColor: Colors.red,
        borderRadius: px(9),
        borderBottomLeftRadius: px(1),
        paddingHorizontal: px(6),
        paddingVertical: px(1),
        position: 'absolute',
        right: -px(35),
        top: -5,
    },
    autoRechargePanelRecommend: {
        fontSize: px(11),
        fontWeight: '500',
        lineHeight: px(16),
        color: '#fff',
    },
    autoRechargeDesc: {
        paddingTop: px(11),
        paddingBottom: px(16),
    },
    autoRechargeText: {
        fontSize: px(13),
        fontWeight: '400',
        color: Colors.lightBlackColor,
        lineHeight: px(20),
    },
    autoRechargeDetail: {
        position: 'absolute',
        right: 0,
        bottom: px(16),
    },
    render_deductionHintText: {
        fontSize: px(12),
        fontWeight: '400',
        color: '#9095A5',
        lineHeight: px(17),
        marginBottom: px(12),
        paddingHorizontal: px(16),
    },
    autoChargeHintOnOpen: {
        paddingVertical: px(7),
        borderTopColor: '#E9EAEF',
        borderTopWidth: 1,
    },
    autoChargeHintText: {
        fontSize: px(13),
        fontWeight: '400',
        color: Colors.red,
        lineHeight: px(20),
    },
});

export default WithHooks;
