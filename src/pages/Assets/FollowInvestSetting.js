/*
 * @Date: 2021-11-26 10:59:14
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-12-02 21:23:08
 * @Description: 跟投设置
 */
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {BankCardModal, Modal, InputModal} from '../../components/Modal';
import Loading from '../Portfolio/components/PageLoading';
import {formaNum, onlyNumber, px} from '../../utils/appUtil';
import http from '../../services';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
import {useSelector} from 'react-redux';
import Html from '../../components/RenderHtml';

const FollowInvestSetting = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [open, setOpen] = useState(true);
    const [amount, setAmount] = useState('');
    const [errMainMes, setErrMainMes] = useState('');
    const [errBottomMes, setErrBottomMes] = useState('');
    const [inputVal, setInputVal] = useState('');
    const [autoChargeStatus, setAutoChargeStatus] = useState(false);
    const inputModal = useRef();
    const inputRef = useRef();
    const [selectedBank, setSelectedBank] = useState({});
    const bankModal = useRef();

    const selectConflict = useMemo(() => selectedBank.pay_method === 'wallet' && autoChargeStatus, [
        autoChargeStatus,
        selectedBank.pay_method,
    ]);

    useFocusEffect(
        useCallback(() => {
            http.get('/signal/follow_invest/setting/info/20220214', {
                poid: route.params?.poid,
                scene: route.params?.scene || route.params?.fr,
            }).then((res) => {
                if (res.code === '000000') {
                    setOpen(res.result.status);
                    setAutoChargeStatus(res.result.auto_charge_status);
                    setAmount(res.result?.amount);
                    setSelectedBank(res.result.pay_methods[0]);
                    setData(res.result);
                    // 初始的默认金额---使用后端返回的默认银行卡的单日限额 和 默认金额 中的最小值
                    let defaultAmount = res.result?.amount;
                    if (res.result.pay_methods[0].pay_method !== 'wallet') {
                        // 魔方宝不参入判断
                        defaultAmount = Math.min(res.result?.amount, res.result.pay_methods[0].day_limit);
                    }
                    // 用此处理主界面错误提示和下弹框提示
                    changeInput(defaultAmount, res.result.pay_methods[0], setErrMainMes);
                    navigation.setOptions({title: res.result.title || '跟投设置'});
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [navigation, route.params])
    );

    const onToggle = () => {
        setOpen((prev) => !prev);
    };
    const confirmClick = () => {
        if (!errBottomMes) {
            inputModal.current.hide();
            let val = inputVal ? parseFloat(inputVal) : '';
            changeInput(val, null, setErrMainMes);
            setAmount(val);
        }
    };
    const changeBankCard = (select) => {
        setSelectedBank(select);
        changeInput(amount, select, setErrMainMes);
    };
    /**
     * @description: 金额输入
     * @param {*}
     * @return {*}
     */
    const changeInput = (value, _bank, setErr) => {
        // 格式化
        value = value ? value + '' : '';
        let bank = _bank || selectedBank;
        // 可以清空金额
        if (value === '') {
            setErr('');
        } else if (value < data.min_amount) {
            setErr(`最小起购金额${formaNum(data.min_amount, 'int')}元`);
        } else if (bank.pay_method !== 'wallet' && value > bank.day_limit) {
            setErr(`最大单日购买金额为${formaNum(bank.day_limit, 'int')}元`);
        } else if (value > data.max_amount) {
            setErr(`最大购买金额${formaNum(data.max_amount, 'int')}元`);
        } else {
            setErr('');
        }
        // 不一样则设置
        value !== inputVal && setInputVal(onlyNumber(value));
    };
    const onSave = () => {
        http.post('/signal/follow_invest/setting/modify/20220214', {
            amount,
            pay_method: selectedBank.pay_method,
            poid: route.params?.poid,
            status: open ? 1 : 0,
            auto_charge_status: +autoChargeStatus,
            scene: route.params?.scene || route.params?.fr,
        }).then((res) => {
            if (res.code === '000000') {
                Toast.show('保存成功');
                setTimeout(() => {
                    if (res.result.url) {
                        jump(res.result.url, route.params?.ref === 'TopInvestors' ? 'replace' : 'navigate');
                    } else {
                        navigation.goBack();
                    }
                }, 2000);
            } else {
                Toast.show(res.message);
            }
        });
    };

    return (
        <>
            {Object.keys(data || {}).length > 0 ? (
                <ScrollView bounces={false} style={styles.container}>
                    <View style={styles.topPart}>
                        <View style={[Style.flexBetween, {paddingVertical: px(18)}]}>
                            <Text style={styles.label}>{'自动跟投'}</Text>
                            <Switch
                                ios_backgroundColor={'#CCD0DB'}
                                onValueChange={onToggle}
                                thumbColor={'#fff'}
                                trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                value={open}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                inputModal.current?.show?.();
                                changeInput(amount, null, setErrBottomMes);
                                // changeInput(`${amount}`);
                                // setTimeout(() => {
                                //     inputRef.current?.focus?.();
                                // }, 200);
                            }}
                            style={[Style.flexBetween, styles.inputBox]}>
                            <Text style={styles.label}>{'跟投金额(元)'}</Text>
                            <Text style={styles.amount}>{amount}</Text>
                        </TouchableOpacity>
                        {errMainMes ? <Text style={{color: Colors.red, top: px(-12)}}>{errMainMes}</Text> : null}
                    </View>
                    <View style={{paddingHorizontal: Space.padding}}>
                        <Text style={styles.desc}>{data.desc}</Text>
                        <Text style={[styles.desc, {marginTop: px(4)}]}>{data.tip}</Text>
                    </View>
                    <View style={styles.autoChargeWrapper}>
                        <View style={[Style.flexBetween]}>
                            <Text style={{fontSize: px(14), color: '#4e556c', lineHeight: px(20)}}>魔方宝自动充值</Text>
                            <Switch
                                ios_backgroundColor={'#CCD0DB'}
                                onValueChange={(val) => {
                                    setAutoChargeStatus(val);
                                }}
                                thumbColor={'#fff'}
                                trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                                value={autoChargeStatus}
                            />
                        </View>
                        <View style={styles.autoChargeTip}>
                            <Html
                                style={{fontSize: px(12), lineHeight: px(17), color: '#545968'}}
                                html={data.auto_charge_tip}
                            />
                        </View>
                    </View>
                    <View style={styles.bankChangeWrapper}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => bankModal.current?.show()}
                            style={[Style.flexBetween, styles.bankChange]}>
                            <View style={Style.flexRow}>
                                <Image source={{uri: selectedBank.bank_icon}} style={styles.bankIcon} />
                                <View>
                                    <Text
                                        style={[
                                            styles.label,
                                            {
                                                color: Colors.defaultColor,
                                                fontWeight: Platform.select({android: '700', ios: '500'}),
                                            },
                                        ]}>
                                        {selectedBank.bank_name}
                                        {selectedBank.bank_no ? <Text>({selectedBank.bank_no})</Text> : null}
                                    </Text>
                                    <Text style={styles.limitDesc}>{selectedBank.limit_desc}</Text>
                                </View>
                            </View>
                            <View style={Style.flexRow}>
                                <Text style={[styles.limitDesc, {lineHeight: px(17)}]}>切换</Text>
                                <AntDesign color={Colors.lightGrayColor} name={'right'} size={px(12)} />
                            </View>
                        </TouchableOpacity>
                        {selectConflict && (
                            <View style={styles.changeTip}>
                                <Text style={styles.changeTipText}>为开启魔方宝自动充值功能，请切换扣款银行卡</Text>
                            </View>
                        )}
                    </View>
                    {data.pay_method_tip && <Text style={styles.payMethodTip}>{data.pay_method_tip}</Text>}
                    <Button
                        onPress={onSave}
                        style={{marginTop: px(40), marginHorizontal: Space.marginAlign}}
                        disabled={!!errMainMes || !amount || selectConflict}
                        title={'保存'}
                    />
                </ScrollView>
            ) : (
                <Loading />
            )}
            <InputModal confirmClick={confirmClick} ref={inputModal} title={'请输入跟投金额'}>
                <View style={[Style.flexRow, styles.inputContainer]}>
                    <Text style={styles.unit}>¥</Text>
                    <TextInput
                        autoFocus
                        ref={inputRef}
                        clearButtonMode={'never'}
                        keyboardType="numeric"
                        onChangeText={(val) => changeInput(val, null, setErrBottomMes)}
                        style={styles.inputStyle}
                        value={inputVal}
                    />
                    {inputVal.length === 0 && <Text style={styles.placeholder}>{'请输入跟投金额(元)'}</Text>}
                    {inputVal.length > 0 && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setInputVal('');
                                setErrBottomMes('');
                            }}>
                            <AntDesign name={'closecircle'} color={'#CDCDCD'} size={px(16)} />
                        </TouchableOpacity>
                    )}
                </View>
                {errBottomMes ? (
                    <Text style={{color: Colors.red, top: px(-16), left: px(16)}}>{errBottomMes}</Text>
                ) : null}
            </InputModal>
            <BankCardModal
                data={data.pay_methods || []}
                onDone={changeBankCard}
                ref={bankModal}
                select={data?.pay_methods?.findIndex?.((item) => item.pay_method === selectedBank.pay_method) || 0}
            />
        </>
    );
};

function WithHooks(props) {
    const jump = useJump();
    const userInfo = useSelector((state) => state.userInfo);
    useFocusEffect(
        React.useCallback(() => {
            const {anti_pop} = userInfo.toJS();
            if (anti_pop) {
                Modal.show({
                    title: anti_pop.title,
                    content: anti_pop.content,
                    confirm: true,
                    isTouchMaskToClose: false,
                    cancelCallBack: () => {
                        props.navigation.goBack();
                    },
                    confirmCallBack: () => {
                        jump(anti_pop.confirm_action?.url);
                    },
                    cancelText: anti_pop.cancel_action?.text,
                    confirmText: anti_pop.confirm_action?.text,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userInfo])
    );
    return <FollowInvestSetting {...props} />;
}

export default WithHooks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        marginVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    inputBox: {
        paddingVertical: px(18),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    label: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    amount: {
        fontSize: Font.textH1,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    inputContainer: {
        marginVertical: px(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: px(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        position: 'relative',
    },
    unit: {
        fontSize: px(26),
        fontFamily: Font.numFontFamily,
    },
    inputStyle: {
        flex: 1,
        fontSize: px(35),
        lineHeight: px(42),
        height: px(42),
        marginLeft: px(14),
        padding: 0,
        fontFamily: Font.numMedium,
    },
    placeholder: {
        position: 'absolute',
        left: px(28),
        top: px(3.5),
        fontSize: px(26),
        lineHeight: px(37),
        color: Colors.placeholderColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(21),
        color: Colors.lightGrayColor,
    },
    autoChargeWrapper: {
        paddingHorizontal: px(16),
        paddingVertical: px(18),
        backgroundColor: '#fff',
        marginTop: px(20),
    },
    bankChangeWrapper: {
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
        marginTop: px(12),
    },
    autoChargeTip: {
        marginTop: px(15),
        padding: px(12),
        backgroundColor: '#F5F6F8',
        borderRadius: px(4),
    },
    changeTip: {
        paddingVertical: px(7),
        borderTopColor: '#DDDDDD',
        borderTopWidth: px(1),
    },
    changeTipText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#e74949',
    },
    payMethodTip: {
        paddingTop: px(12),
        paddingHorizontal: px(16),
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA1B2',
    },
    bankChange: {
        paddingVertical: px(12),
    },
    bankIcon: {
        marginRight: px(8),
        width: px(28),
        height: px(28),
    },
    limitDesc: {
        fontSize: Font.textH3,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
});
