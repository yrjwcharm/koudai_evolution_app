/*
 * @Author: xjh
 * @Date: 2021-02-19 17:34:35
 * @Description:修改定投
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-29 16:18:11
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Dimensions} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text, formaNum} from '../../utils/appUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-picker';
import Http from '../../services';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks/';
var interval, _cycle, _timing;
export default function FixedUpdate({navigation, route}) {
    const [data, setData] = useState({});
    const [num, setNum] = useState(1000);
    const [cycle, setCycle] = useState('');
    const jump = useJump();
    const addNum = () => {
        setNum(num + interval);
    };
    const subtractNum = () => {
        setNum(num - interval);
    };
    useEffect(() => {
        Http.get('/trade/update/invest_plan/info/20210101', {
            invest_id: route.params.invest_id,
        }).then((res) => {
            interval = res.result.target_info.invest.incr;
            setData(res.result);
            const _date = res.result.target_info.fix_period.current_date;
            setCycle(_date);
            _cycle = _date.slice(0, 2);
            _timing = _date.slice(2);
        });
    }, []);
    const selectTime = () => {
        Picker.init({
            pickerTitleText: '时间选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [cycle],
            pickerBg: [255, 255, 255, 1],
            pickerData: _createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                _cycle = pickedValue[0];
                _timing = pickedValue[1];
                let _str = _cycle + _timing;
                setCycle(_str);
            },
        });
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

    const jumpTo = (type) => {
        console.log(_cycle, _timing);
        if (type == 'redeem') {
            Http.get('/trade/stop/invest_plan/20210101', {
                invest_id: data.invest_id,
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
                cycle: _cycle,
                timing: _timing,
            }).then((res) => {
                Toast.show(res.message);
                setTimeout(() => {
                    jump(data.button[1].url);
                }, 1000);
            });
        }
    };
    return (
        <>
            {Object.keys(data).length > 0 && (
                <View style={{backgroundColor: Colors.bgColor}}>
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
                                <TouchableOpacity onPress={subtractNum}>
                                    <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                </TouchableOpacity>
                                <Text style={styles.count_num_sty}>{formaNum(num)}</Text>
                                <TouchableOpacity onPress={addNum}>
                                    <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                            <Text style={{color: '#545968'}}>{data?.target_info?.fix_period?.text}</Text>
                            <TouchableOpacity style={Style.flexRow} onPress={selectTime}>
                                <Text style={{color: Colors.defaultFontColor}}>{cycle}</Text>
                                <AntDesign name={'down'} color={'#8D96AF'} size={12} />
                            </TouchableOpacity>
                        </View>
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
                            onPress={() => jumpTo('redeem')}>
                            <Text style={styles.btn_sty}>{data.button[0].text}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{backgroundColor: '#0051CC', borderRadius: text(6), flex: 1}}
                            onPress={() => jumpTo('update')}>
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
});
