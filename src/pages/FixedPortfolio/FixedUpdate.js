/*
 * @Author: xjh
 * @Date: 2021-02-19 17:34:35
 * @Description:修改定投
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-15 21:29:08
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, formaNum} from '../../utils/appUtil';
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
export default function FixedUpdate({navigation, route}) {
    const [data, setData] = useState({});
    const [num, setNum] = useState();
    const [cycle, setCycle] = useState('');
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
    const iptValRef = useRef('');
    const [payMethod, setPayMethod] = useState({});
    const bankCardModal = useRef(null);
    const initAmount = useRef('');
    const addNum = () => {
        setNum((prev) => {
            return prev + intervalRef.current > payMethod.day_limit ? payMethod.day_limit : prev + intervalRef.current;
        });
    };
    const subtractNum = () => {
        setNum((prev) => {
            return prev - intervalRef.current < initAmount.current ? initAmount.current : prev - intervalRef.current;
        });
    };

    useFocusEffect(
        useCallback(() => {
            Http.get('/trade/update/invest_plan/info/20210101', {
                invest_id: route.params.invest_id,
            }).then((res) => {
                intervalRef.current = res.result.target_info.invest.incr;
                initAmount.current = res.result.target_info.invest.init_amount;
                setData(res.result);
                setPayMethod(res.result.pay_methods[0] || {});
                setNum(parseFloat(res.result.target_info.invest.amount));
                const _date = res.result.target_info.fix_period.current_date;
                setCycle(_date);
                cycleRef.current = _date.split(' ')[0];
                timingRef.current = _date.split(' ')[1];
            });
        }, [route.params.invest_id])
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
    const submit = (password) => {
        if (type == 'redeem') {
            Http.get('/trade/stop/invest_plan/20210101', {
                invest_id: data.invest_id,
                password,
            }).then((res) => {
                Toast.show(res.message);
                if (res.code == '000000') {
                    setTimeout(() => {
                        jump(data.button[0].url);
                    }, 1000);
                }
            });
        } else {
            Http.get('/trade/update/invest_plan/20210101', {
                invest_id: data?.invest_id,
                amount: num,
                cycle: cycleRef.current,
                timing: timingRef.current,
                password,
                pay_method: payMethod.pay_method,
            }).then((res) => {
                Toast.show(res.message);
                if (res.code == '000000') {
                    setTimeout(() => {
                        jump(data.button[1].url);
                    }, 1000);
                }
            });
        }
    };
    const handleClick = (t) => {
        setType(t);
        passwordModal?.current?.show();
    };
    const onKeyPress = (e) => {
        const {key} = e.nativeEvent;
        // console.log(key);
        const pos = iptVal.indexOf(key);
        if (iptVal.split('.')[1] && iptVal.split('.')[1].length === 2 && key !== 'Backspace') {
            return false;
        }
        if (key === '.') {
            setIptVal((prev) => {
                if (prev === '') {
                    return prev;
                } else {
                    if (pos !== -1) {
                        return prev;
                    } else {
                        return prev + '.';
                    }
                }
            });
        } else if (key === '0') {
            setIptVal((prev) => {
                if (prev === '') {
                    return prev + '0';
                } else {
                    if (prev === '0') {
                        return prev;
                    } else {
                        return prev + '0';
                    }
                }
            });
        } else if (key === 'Backspace') {
            setIptVal((prev) => prev.slice(0, prev.length - 1));
        } else {
            setIptVal((prev) => (prev === '0' ? prev : prev + key.replace(/\D/g, '')));
        }
    };
    const showInputModal = () => {
        setIptVal(`${num}`);
        setModalProps({
            confirmClick,
            placeholder: `请输入${cycleRef.current}投入金额`,
            title: `${cycleRef.current}投入金额`,
        });
    };
    const confirmClick = () => {
        if (iptValRef.current < initAmount.current) {
            inputModal.current.hide();
            setNum(initAmount.current);
            inputModal.current.toastShow(`${cycleRef.current}投入金额最小为${formaNum(initAmount.current, 'nozero')}`);
        } else if (iptValRef.current > payMethod.day_limit) {
            inputModal.current.hide();
            setNum(payMethod.day_limit);
            inputModal.current.toastShow(`${cycleRef.current}投入金额最大为${formaNum(payMethod.day_limit, 'nozero')}`);
        } else {
            inputModal.current.hide();
            setNum(parseFloat(iptValRef.current));
        }
    };
    useEffect(() => {
        if (Object.keys(modalProps).length > 0) {
            inputModal.current.show();
        }
    }, [modalProps]);
    useEffect(() => {
        iptValRef.current = iptVal;
    }, [iptVal]);
    return (
        <>
            {Object.keys(data).length > 0 && (
                <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
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
                            <TextInput
                                autoFocus={true}
                                clearButtonMode={'never'}
                                keyboardType={'decimal-pad'}
                                onKeyPress={onKeyPress}
                                // placeholder={modalProps?.placeholder}
                                // placeholderTextColor={'#CCD0DB'}
                                style={[styles.inputStyle]}
                                value={iptVal}
                            />
                            {`${iptVal}`.length === 0 && (
                                <Text style={styles.placeholder}>{modalProps?.placeholder}</Text>
                            )}
                            {`${iptVal}`.length > 0 && (
                                <TouchableOpacity onPress={() => setIptVal('')}>
                                    <AntDesign name={'closecircle'} color={'#CDCDCD'} size={text(16)} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </InputModal>
                    <BankCardModal
                        data={data?.pay_methods || []}
                        onDone={(value) => setPayMethod(value)}
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
                        {data?.target_info?.first_invest?.value && (
                            <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                <Text style={{color: '#545968', flex: 1}}>
                                    {formaNum(data?.target_info?.first_invest?.text)}
                                </Text>
                                <Text style={[styles.count_num_sty, {textAlign: 'right'}]}>
                                    {data?.target_info?.first_invest?.value}
                                </Text>
                            </View>
                        )}
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
                    <View
                        style={[
                            Style.flexRow,
                            {justifyContent: 'space-between', marginHorizontal: text(16), marginTop: text(16)},
                        ]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                borderColor: '#4E556C',
                                borderWidth: 0.5,
                                borderRadius: text(6),
                                flex: 1,
                                marginRight: text(10),
                            }}
                            onPress={() => handleClick('redeem')}>
                            <Text style={styles.btn_sty}>{data.button[0].text}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{backgroundColor: '#0051CC', borderRadius: text(6), flex: 1}}
                            onPress={() => handleClick('update')}>
                            <Text style={[styles.btn_sty, {color: '#fff'}]}>{data.button[1].text}</Text>
                        </TouchableOpacity>
                    </View>
                    <BottomDesc />
                </View>
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
});
