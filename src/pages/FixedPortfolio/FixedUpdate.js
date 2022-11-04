/*
 * @Date: 2021-02-19 17:34:35
 * @Description:修改定投
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, ScrollView, Switch} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, px, formaNum, onlyNumber} from '../../utils/appUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-picker';
import Http from '../../services';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks/';
import {PasswordModal} from '../../components/Password';
import Mask from '../../components/Mask';
import {BankCardModal, InputModal} from '../../components/Modal';
import BottomDesc from '../../components/BottomDesc';
import {Modal} from '../../components/Modal';
import {useSelector} from 'react-redux';
import Html from '../../components/RenderHtml';
import {Button} from '~/components/Button';

export default function FixedUpdate({navigation, route}) {
    const [data, setData] = useState({});
    const [num, setNum] = useState();
    const [cycle, setCycle] = useState('');
    const [autoChargeStatus, updateAutoChargeStatus] = useState(false);
    const passwordModal = useRef(null);
    const [type, setType] = useState();
    const jump = useJump();
    const intervalRef = useRef('');
    const cycleRef = useRef('');
    const timingRef = useRef('');
    const [showMask, setShowMask] = useState(false);
    const [modalProps, setModalProps] = useState({});
    const [iptVal, setIptVal] = useState('');
    const inputModal = useRef(null);
    const inputRef = useRef(null);
    const iptValRef = useRef('');
    const [payMethod, setPayMethod] = useState({});
    const bankCardModal = useRef(null);
    const initAmount = useRef('');
    const [loading, setLoading] = useState(true);
    const userInfo = useSelector((state) => state.userInfo);
    const isFocused = useIsFocused();
    const show_risk_disclosure = useRef(true);
    const riskDisclosureModalRef = useRef(null);

    const addNum = () => {
        setNum((prev) => {
            if (prev + intervalRef.current > payMethod.day_limit) {
                Toast.show(`${cycleRef.current}投入金额最大为${formaNum(payMethod.day_limit, 'nozero')}`);
            }
            return prev + intervalRef.current > payMethod.day_limit ? payMethod.day_limit : prev + intervalRef.current;
        });
    };
    const subtractNum = () => {
        setNum((prev) => {
            if (prev - intervalRef.current < initAmount.current) {
                Toast.show(`${cycleRef.current}投入金额最小为${formaNum(initAmount.current, 'nozero')}`);
            }
            return prev - intervalRef.current < initAmount.current ? initAmount.current : prev - intervalRef.current;
        });
    };
    /**
     * @description 展示风险揭示书
     * @param {any} risk_disclosure 风险揭示书内容
     * @returns void
     */
    const showRiskDisclosure = (risk_disclosure) => {
        show_risk_disclosure.current = false;
        Modal.show({
            children: () => {
                return (
                    <View>
                        <Text
                            style={{
                                marginTop: text(2),
                                fontSize: Font.textH2,
                                lineHeight: text(20),
                                color: Colors.red,
                                textAlign: 'center',
                            }}>
                            {risk_disclosure.sub_title}
                        </Text>
                        <ScrollView
                            bounces={false}
                            style={{
                                marginVertical: Space.marginVertical,
                                paddingHorizontal: text(20),
                                maxHeight: text(352),
                            }}
                            ref={(e) => (riskDisclosureModalRef.current = e)}>
                            <Html
                                style={{fontSize: text(13), lineHeight: text(22), color: Colors.descColor}}
                                html={risk_disclosure.content}
                            />
                        </ScrollView>
                    </View>
                );
            },
            confirmText: '关闭',
            countdown: risk_disclosure.countdown,
            isTouchMaskToClose: false,
            onCloseCallBack: () => navigation.goBack(),
            onCountdownChange: (val) => {
                if (+val == 1) {
                    riskDisclosureModalRef.current.scrollToEnd({animated: true});
                }
            },
            title: risk_disclosure.title,
        });
    };
    useFocusEffect(
        useCallback(() => {
            const {anti_pop} = userInfo.toJS();
            if (anti_pop) {
                Modal.show({
                    title: anti_pop.title,
                    content: anti_pop.content,
                    confirm: true,
                    isTouchMaskToClose: false,
                    cancelCallBack: () => navigation.goBack(),
                    confirmCallBack: () => jump(anti_pop.confirm_action?.url),
                    cancelText: anti_pop.cancel_action?.text,
                    confirmText: anti_pop.confirm_action?.text,
                });
            }
        }, [userInfo])
    );
    useFocusEffect(
        useCallback(() => {
            Http.get('/trade/update/invest_plan/info/20210101', {
                invest_id: route.params.invest_id,
            })
                .then((res) => {
                    if (res.code === '000000') {
                        navigation.setOptions({title: res.result.title || '修改计划'});
                        if (isFocused && res.result.risk_disclosure && show_risk_disclosure.current) {
                            if (res.result?.pay_methods[0]?.pop_risk_disclosure) {
                                showRiskDisclosure(res.result.risk_disclosure);
                            }
                        }
                        intervalRef.current = res.result.target_info.invest.incr;
                        initAmount.current = res.result.target_info.invest.init_amount;
                        setData(res.result);
                        setPayMethod(res.result.pay_methods[0] || {});
                        setNum(parseFloat(res.result.target_info.invest.amount));
                        updateAutoChargeStatus(res.result?.auto_charge?.is_open);
                        const _date = res.result.target_info.fix_period.current_date;
                        setCycle(_date);
                        cycleRef.current = _date.split(' ')[0];
                        timingRef.current = _date.split(' ')[1];
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        }, [])
    );
    const selectTime = () => {
        Picker.init({
            pickerTitleColor: [31, 36, 50, 1],
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerFontColor: [33, 33, 33, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 81, 204, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            pickerTitleText: '时间选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [cycleRef.current, timingRef.current],
            pickerTextEllipsisLen: 100,
            pickerData: _createDateData(),
            onPickerConfirm: (pickedValue, pickedIndex) => {
                cycleRef.current = pickedValue[0];
                timingRef.current = pickedValue[1];
                const _str = cycleRef.current + ' ' + timingRef.current;
                setCycle(_str);
                setShowMask(false);
            },
            onPickerCancel: () => setShowMask(false),
        });
        setShowMask(true);
        Picker.show();
    };
    const _createDateData = () => {
        const _data = data?.target_info?.fix_period?.date_items;
        var list = [];
        for (var i in _data) {
            var obj = {};
            var second = [];
            for (var j in _data[i].val) {
                second.push(_data[i].val[j]);
            }
            obj[_data[i].key] = second;
            list.push(obj);
        }
        return list;
    };
    const submit = (password, btn) => {
        if (type == 'redeem') {
            Http.get('/trade/stop/invest_plan/20210101', {
                invest_id: data.invest_id,
                password,
            }).then((res) => {
                Toast.show(res.message);
                if (res.code == '000000') {
                    setTimeout(() => {
                        jump(btn?.url);
                    }, 1000);
                }
            });
        } else {
            Http.get('/trade/update/invest_plan/20210101', {
                invest_id: data?.invest_id,
                amount: num,
                cycle: cycleRef.current,
                wallet_auto_charge: +autoChargeStatus,
                timing: timingRef.current,
                password,
                pay_method: payMethod.pay_method,
            }).then((res) => {
                Toast.show(res.message);
                if (data.auto_charge?.is_open !== autoChargeStatus) {
                    global.LogTool('FixedPlanAssets_Planrecord_BabyRecharge_Condition', +autoChargeStatus);
                }
                if (res.code == '000000') {
                    setTimeout(() => {
                        jump(btn?.url);
                    }, 1000);
                }
            });
        }
    };
    const handleClick = (t, btn) => {
        setType(t);
        passwordModal?.current?.show(btn);
    };
    const showInputModal = () => {
        setIptVal(`${num}`);
        setModalProps({
            confirmClick,
            placeholder: `请输入${cycleRef.current}投入金额`,
            title: `${cycleRef.current}投入金额`,
        });
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 200);
    };
    const confirmClick = () => {
        if (iptValRef.current < initAmount.current) {
            inputModal.current.hide();
            setNum(initAmount.current);
            Toast.show(`${cycleRef.current}投入金额最小为${formaNum(initAmount.current, 'nozero')}`);
        } else if (iptValRef.current > payMethod.day_limit) {
            inputModal.current.hide();
            setNum(payMethod.day_limit);
            Toast.show(`${cycleRef.current}投入金额最大为${formaNum(payMethod.day_limit, 'nozero')}`);
        } else {
            inputModal.current.hide();
            setNum(parseFloat(iptValRef.current));
        }
    };
    // 自动充值
    const render_autoRecharge = () => {
        let auto_charge = data.auto_charge;
        if (!auto_charge) return null;
        return (
            <View style={styles.autoRechargeContent}>
                <View style={styles.autoRechargePanel}>
                    <View>
                        <Text style={styles.autoRechargePanelText}>{auto_charge?.title}</Text>
                        <View style={styles.autoRechargePanelRecommendWrapper}>
                            <Text style={styles.autoRechargePanelRecommend}>{auto_charge?.label}</Text>
                        </View>
                    </View>
                    <Switch
                        ios_backgroundColor={'#CCD0DB'}
                        onValueChange={(val) => {
                            updateAutoChargeStatus(val);
                        }}
                        thumbColor={'#fff'}
                        trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                        value={autoChargeStatus}
                    />
                </View>
                <View style={styles.autoRechargeDesc}>
                    <Html style={styles.autoRechargeText} html={auto_charge?.desc} />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.autoRechargeDetail}
                        onPress={() => {
                            jump({
                                path: auto_charge?.button?.url?.path,
                                params: {
                                    title: auto_charge?.button?.url?.params.title,
                                    poid: auto_charge?.button?.url?.params?.poid,
                                    img: auto_charge?.detail_img,
                                },
                            });
                        }}>
                        <Text style={{fontSize: px(12), fontWeight: '400', color: '#0051cc', lineHeight: px(17)}}>
                            {auto_charge?.button?.text}
                        </Text>
                    </TouchableOpacity>
                </View>
                {autoChargeStatus && (
                    <View style={styles.autoChargeHintOnOpen}>
                        <Html html={auto_charge?.close_tip} style={styles.autoChargeHintText} />
                    </View>
                )}
            </View>
        );
    };
    const render_deductionHint = () => {
        return <Text style={styles.render_deductionHintText}>{data?.auto_charge?.deduction_tip}</Text>;
    };
    useEffect(() => {
        if (Object.keys(modalProps).length > 0) {
            inputModal.current.show();
        }
    }, [modalProps]);
    useEffect(() => {
        if (num > payMethod.day_limit) {
            setNum(payMethod.day_limit);
            Toast.show(`${cycleRef.current}投入金额最大为${formaNum(payMethod.day_limit, 'nozero')}`);
        }
    }, [num, payMethod]);
    useEffect(() => {
        iptValRef.current = iptVal;
    }, [iptVal]);
    return loading ? (
        <View style={[Style.flexCenter, {flex: 1}]}>
            <ActivityIndicator color={Colors.brandColor} />
        </View>
    ) : (
        <>
            {Object.keys(data).length > 0 && (
                <ScrollView keyboardShouldPersistTaps="handled" style={{flex: 1, backgroundColor: Colors.bgColor}}>
                    {showMask && (
                        <Mask
                            onClick={() => {
                                setShowMask(false);
                                Picker.hide();
                            }}
                        />
                    )}
                    <PasswordModal ref={passwordModal} onDone={submit} />
                    <InputModal {...modalProps} ref={inputModal}>
                        <View style={[Style.flexRow, styles.inputContainer]}>
                            <Text style={styles.unit}>¥</Text>
                            {`${iptVal}`.length === 0 && (
                                <Text style={styles.placeholder}>{modalProps?.placeholder}</Text>
                            )}
                            <TextInput
                                clearButtonMode={'never'}
                                keyboardType={'decimal-pad'}
                                onChangeText={(value) => setIptVal(onlyNumber(value))}
                                ref={inputRef}
                                style={[styles.inputStyle]}
                                value={iptVal}
                            />
                            {`${iptVal}`.length > 0 && (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => setIptVal('')}>
                                    <AntDesign name={'closecircle'} color={'#CDCDCD'} size={text(16)} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </InputModal>
                    <BankCardModal
                        data={data?.pay_methods || []}
                        onDone={(value) => {
                            setPayMethod(value);
                            if (value?.pop_risk_disclosure) {
                                setTimeout(() => {
                                    showRiskDisclosure(data.risk_disclosure);
                                }, 300);
                            }
                        }}
                        select={data?.pay_methods?.findIndex((item) => item.bank_name === payMethod.bank_name)}
                        ref={bankCardModal}
                        title={'请选择支付银行卡'}
                    />
                    <View style={styles.wrap_sty}>
                        {data?.target_info?.target_amount?.text && (
                            <Text style={{color: '#9AA1B2', marginTop: Space.marginVertical}}>
                                {data?.target_info?.target_amount?.text}{' '}
                            </Text>
                        )}
                        {data?.target_info?.target_amount?.value && (
                            <Text style={styles.input_sty}> {formaNum(data?.target_info?.target_amount?.value)}</Text>
                        )}
                        {data?.target_info?.first_invest?.value ? (
                            <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                <Text style={{color: '#545968', flex: 1}}>
                                    {formaNum(data?.target_info?.first_invest?.text)}
                                </Text>
                                <Text style={[styles.count_num_sty, {textAlign: 'right'}]}>
                                    {data?.target_info?.first_invest?.value}
                                </Text>
                            </View>
                        ) : null}
                        <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                            <Text style={{color: '#545968', flex: 1}}>
                                {cycle.split(' ')[0]}
                                {data?.target_info?.invest?.text}
                            </Text>
                            <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                <TouchableOpacity activeOpacity={0.8} onPress={subtractNum}>
                                    <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={showInputModal}>
                                    <Text style={styles.count_num_sty}>{formaNum(num)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={addNum}>
                                    <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={selectTime}
                            style={[Style.flexBetween, styles.count_wrap_sty]}>
                            <Text style={{color: '#545968'}}>{data?.target_info?.fix_period?.text}</Text>
                            <View style={Style.flexRow}>
                                <Text style={{color: Colors.defaultFontColor}}>{cycle}</Text>
                                <AntDesign
                                    name={showMask ? 'up' : 'down'}
                                    color={Colors.descColor}
                                    size={12}
                                    style={{marginLeft: text(4)}}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {render_autoRecharge()}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => bankCardModal.current.show()}
                        style={[Style.flexBetween, styles.bankCard]}>
                        <View style={Style.flexRow}>
                            <Image source={{uri: payMethod.bank_icon}} style={styles.bankIcon} />
                            <View>
                                <Text style={styles.bankName}>
                                    {payMethod.bank_name}
                                    {payMethod.bank_no}
                                </Text>
                                <Text style={styles.limitDesc}>{payMethod.limit_desc}</Text>
                            </View>
                        </View>
                        <View style={Style.flexRow}>
                            <Text style={[styles.limitDesc, {lineHeight: text(17)}]}>切换</Text>
                            <AntDesign
                                name={'right'}
                                color={Colors.lightGrayColor}
                                size={12}
                                style={{marginLeft: text(2)}}
                            />
                        </View>
                    </TouchableOpacity>
                    {payMethod.pay_method == 'wallet' && autoChargeStatus && (
                        <View style={{backgroundColor: '#fff', paddingHorizontal: text(16), paddingBottom: text(12)}}>
                            <Html style={styles.autoChargeHintText} html={data.auto_charge?.conflict_tip} />
                        </View>
                    )}
                    {render_deductionHint()}
                    {data?.button?.length > 0 ? (
                        <View
                            style={[
                                Style.flexRow,
                                {marginHorizontal: Space.marginAlign, marginTop: Space.marginVertical},
                            ]}>
                            {data.button.map?.((btn, i, arr) => {
                                const {avail, text: btnText} = btn;
                                return (
                                    <Button
                                        disabled={
                                            (i === arr.length - 1 &&
                                                payMethod.pay_method === 'wallet' &&
                                                autoChargeStatus) ||
                                            avail === 0
                                        }
                                        key={btnText + i}
                                        onPress={() =>
                                            handleClick(i === 0 && arr.length > 1 ? 'redeem' : 'update', btn)
                                        }
                                        style={{flex: 1, marginLeft: i > 0 ? text(12) : 0}}
                                        textStyle={{fontSize: Font.textH2}}
                                        title={btnText}
                                        type={i === 0 && arr.length > 1 ? 'minor' : 'primary'}
                                    />
                                );
                            })}
                        </View>
                    ) : null}
                    <BottomDesc />
                </ScrollView>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    wrap_sty: {
        marginTop: text(12),
        backgroundColor: '#fff',
        paddingHorizontal: Space.padding,
    },
    input_sty: {
        color: Colors.defaultColor,
        fontSize: text(34),
        fontFamily: Font.numFontFamily,
        marginTop: text(8),
        marginBottom: text(12),
    },
    count_wrap_sty: {
        paddingVertical: text(19),
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    count_num_sty: {
        color: Colors.defaultFontColor,
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
        minWidth: text(130),
        textAlign: 'center',
    },
    btn_sty: {
        paddingVertical: text(14),
        textAlign: 'center',
    },
    inputContainer: {
        marginVertical: text(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        position: 'relative',
    },
    unit: {
        fontSize: text(26),
        fontFamily: Font.numFontFamily,
    },
    inputStyle: {
        flex: 1,
        fontSize: text(35),
        lineHeight: text(42),
        height: text(42),
        marginLeft: text(14),
        padding: 0,
        fontFamily: Font.numMedium,
    },
    placeholder: {
        position: 'absolute',
        left: text(30),
        top: text(3.5),
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.placeholderColor,
    },
    bankCard: {
        marginTop: text(12),
        paddingVertical: text(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    bankIcon: {
        width: text(28),
        height: text(28),
        marginRight: text(8),
    },
    bankName: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        marginBottom: text(1),
    },
    limitDesc: {
        fontSize: Font.textH3,
        lineHeight: text(20),
        color: Colors.lightGrayColor,
    },
    autoChargeHintText: {
        fontSize: px(13),
        fontWeight: '400',
        color: Colors.red,
        lineHeight: px(20),
    },
    autoRechargeContent: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        marginTop: px(12),
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
        marginTop: px(12),
        paddingHorizontal: px(16),
    },
    autoChargeHintOnOpen: {
        paddingVertical: px(7),
        borderTopColor: '#E9EAEF',
        borderTopWidth: 1,
    },
});
