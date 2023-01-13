/*
 * @Date: 2022-07-16 13:54:16
 * @Description:定投周期
 */
import {StyleSheet, Text, View, TouchableOpacity, Keyboard} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import RenderHtml from '~/components/RenderHtml';
import Icon from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-picker';
import Mask from '~/components/Mask';
import {getNextDay} from './service';
const RenderAutoTime = ({initalData, onChangeAutoTime, style}) => {
    const [data, setData] = useState(initalData);
    const [showMask, setShowMask] = useState(false);
    useEffect(() => {
        onChangeAutoTime({
            cycle: initalData?.current_date[0],
            timing: initalData?.current_date[1],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const _createDateData = () => {
        const {date_items} = initalData;
        var _data = [];
        for (var i in date_items) {
            var obj = {};
            var second = [];
            for (var j in date_items[i].val) {
                second.push(date_items[i].val[j]);
            }
            obj[date_items[i].key] = second;
            _data.push(obj);
        }
        return _data;
    };
    // 打开日期选择 视图
    const showDatePicker = () => {
        Keyboard.dismiss();
        setShowMask(true);
        Picker.init({
            pickerTitleText: '定投周期',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerData: _createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            pickerTextEllipsisLen: 100,
            wheelFlex: [1, 1],
            selectedValue: [data?.current_date[0], data?.current_date[1]],
            onPickerConfirm: async (pickedValue) => {
                setShowMask(false);
                let params = {
                    cycle: pickedValue[0],
                    timing: pickedValue[1],
                };
                let res = await getNextDay(params);
                onChangeAutoTime(params);
                if (res.code === '000000') {
                    setData((prev) => {
                        return {...prev, current_date: pickedValue, nextday: res.result.nextday};
                    });
                }
            },
            onPickerCancel: () => {
                setShowMask(false);
            },
        });

        Picker.show();
    };
    return (
        //定投周期

        <TouchableOpacity style={[styles.auto_time, style]} onPress={() => showDatePicker()} activeOpacity={0.8}>
            {showMask && <Mask />}
            <View style={[Style.flexBetween, {marginBottom: px(8)}]}>
                <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>{initalData?.text}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: px(16), marginRight: 5}}>
                        {data.current_date && data.current_date.join(' ')}
                    </Text>
                    <Icon name={'right'} size={px(12)} color={Colors.lightGrayColor} />
                </View>
            </View>
            <RenderHtml
                style={{color: Colors.darkGrayColor, fontSize: px(12), lineHeight: px(17)}}
                html={data?.nextday}
            />
        </TouchableOpacity>
    );
};

export default RenderAutoTime;

const styles = StyleSheet.create({
    auto_time: {
        paddingVertical: px(12),
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});
