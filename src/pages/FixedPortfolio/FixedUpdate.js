/*
 * @Author: xjh
 * @Date: 2021-02-19 17:34:35
 * @Description:修改定投
 * @LastEditors: dx
 * @LastEditTime: 2021-04-08 15:46:04
 */
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
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
import {InputModal} from '../../components/Modal';
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
    const addNum = () => {
        setNum((prev) => {
            return prev + intervalRef.current > 100000 ? 100000 : prev + intervalRef.current;
        });
    };
    const subtractNum = () => {
        setNum((prev) => {
            return prev - intervalRef.current < 500 ? 500 : prev - intervalRef.current;
        });
    };

    useEffect(() => {
        Http.get('/trade/update/invest_plan/info/20210101', {
            invest_id: route.params.invest_id,
        }).then((res) => {
            intervalRef.current = res.result.target_info.invest.incr;
            setData(res.result);
            setNum(parseFloat(res.result.target_info.invest.amount));
            const _date = res.result.target_info.fix_period.current_date;
            setCycle(_date);
            cycleRef.current = _date.slice(0, 2);
            timingRef.current = _date.slice(2);
        });
    }, [route.params.invest_id]);
    const selectTime = () => {
        Picker.init({
            pickerTitleText: '时间选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [cycleRef.current, timingRef.current],
            pickerBg: [255, 255, 255, 1],
            pickerData: _createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                cycleRef.current = pickedValue[0];
                timingRef.current = pickedValue[1];
                const _str = cycleRef.current + timingRef.current;
                setCycle(_str);
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
                setTimeout(() => {
                    jump(data.button[0].url);
                }, 1000);
            });
        } else {
            Http.get('/trade/update/invest_plan/20210101', {
                invest_id: data?.invest_id,
                amount: data?.target_info?.target_amount?.value,
                cycle: cycleRef.current,
                timing: timingRef.current,
                password,
            }).then((res) => {
                Toast.show(res.message);
                setTimeout(() => {
                    jump(data.button[1].url);
                }, 1000);
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
            setIptVal((prev) => prev + key.replace(/\D/g, ''));
        }
    };
    const showInputModal = () => {
        setIptVal(`${num}`);
        setModalProps({
            confirmClick,
            placeholder: '请输入每月投入金额',
            title: '每月投入金额',
        });
    };
    const confirmClick = () => {
        console.log(iptValRef.current);
        if (iptValRef.current < 500) {
            Toast.show(`每月投入金额最小为${formaNum(500, 'nozero')}`);
        } else if (iptValRef.current > 100000) {
            Toast.show(`每月投入金额最大为${formaNum(100000, 'nozero')}`);
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
                <View style={{backgroundColor: Colors.bgColor}}>
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
                    <View style={styles.wrap_sty}>
                        {data?.target_info?.target_amount?.text && (
                            <Text style={{color: '#9AA1B2'}}>{data?.target_info?.target_amount?.text} </Text>
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
                            <Text style={{color: '#545968', flex: 1}}>每月投入金额(元)</Text>
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
                                    color={'#8D96AF'}
                                    size={12}
                                    style={{marginLeft: text(4)}}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            Style.flexRow,
                            {justifyContent: 'space-between', marginHorizontal: text(16), marginTop: text(16)},
                        ]}>
                        <TouchableOpacity
                            activeOpacity={1}
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
                            activeOpacity={1}
                            style={{backgroundColor: '#0051CC', borderRadius: text(6), flex: 1}}
                            onPress={() => handleClick('update')}>
                            <Text style={[styles.btn_sty, {color: '#fff'}]}>{data.button[1].text}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    wrap_sty: {
        marginTop: text(12),
        backgroundColor: '#fff',
        padding: text(16),
        paddingBottom: 0,
    },
    input_sty: {
        color: Colors.defaultColor,
        fontSize: text(34),
        fontFamily: Font.numFontFamily,
        marginVertical: text(12),
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
});
