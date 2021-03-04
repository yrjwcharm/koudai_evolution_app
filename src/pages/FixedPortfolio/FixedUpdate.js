/*
 * @Author: xjh
 * @Date: 2021-02-19 17:34:35
 * @Description:修改定投
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-25 14:29:00
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Dimensions} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-picker';
import Http from '../../services';
export default function FixedUpdate() {
    const [num, setNum] = useState(1000);
    const [cycle, setCycle] = useState('每月一号');
    const addNum = () => {
        setNum(num + 1000);
    };
    const subtractNum = () => {
        setNum(num - 1000);
    };
    const selectTime = () => {
        Picker.init({
            pickerTitleText: '时间选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [cycle],
            pickerBg: [255, 255, 255, 1],
            pickerData: [
                {
                    每月: [1, 2, 3, 4],
                },
                {
                    每周: ['周一', '周二', '周三', '周四', '周五'],
                },
            ],
            pickerFontColor: [33, 33, 33, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                let _month = pickedValue[0];
                let _day = pickedValue[1];
                let _str = _month + _day;
                setCycle(_str);
            },
        });
        Picker.show();
    };
    useEffect(() => {
        Http.get('/trade/update/invest_plan/20210101', {}).then(
            (res) => {
                this.setState({
                    data: res.result,
                });
            }
        );
    });
    return (
        <>
            <View style={styles.wrap_sty}>
                <Text style={{color: '#9AA1B2'}}>目标金额(元) </Text>
                <TextInput value="100000" style={styles.input_sty} />
                <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                    <Text style={{color: '#545968', flex: 1}}>首次投入金额(元)</Text>
                    <Text style={[styles.count_num_sty, {textAlign: 'right'}]}>1,000,000</Text>
                </View>
                <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                    <Text style={{color: '#545968', flex: 1}}>每月投入金额(元)</Text>
                    <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                        <TouchableOpacity onPress={subtractNum}>
                            <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                        </TouchableOpacity>
                        <Text style={styles.count_num_sty}>{num}</Text>
                        <TouchableOpacity onPress={addNum}>
                            <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                    <Text style={{color: '#545968'}}>定投周期</Text>
                    <TouchableOpacity style={Style.flexRow} onPress={selectTime}>
                        <Text style={{color: '#545968'}}>{cycle}</Text>
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
                    style={{
                        borderColor: '#4E556C',
                        borderWidth: 0.5,
                        borderRadius: text(6),
                        flex: 1,
                        marginRight: text(10),
                    }}>
                    <Text style={{paddingVertical: text(10), textAlign: 'center'}}>终止计划</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: '#0051CC', borderRadius: text(6), flex: 1}}>
                    <Text style={{paddingVertical: text(10), textAlign: 'center', color: '#fff'}}>确认修改</Text>
                </TouchableOpacity>
            </View>
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
        marginTop: text(4),
    },
    count_wrap_sty: {
        paddingVertical: text(19),
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    count_num_sty: {
        color: '#292D39',
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
        minWidth: text(130),
        textAlign: 'center',
    },
});
