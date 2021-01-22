/*
 * @Autor: xjh
 * @Date: 2021-01-20 11:43:47
 * @LastEditors: xjh
 * @Desc:私募预约
 * @LastEditTime: 2021-01-22 12:27:04
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Linking,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Picker from 'react-native-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default class PrivateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: this._getCurrentDate(),
        };
    }
    _getCurrentDate() {
        var currDate = new Date();
        var month = (currDate.getMonth() + 1).toString();
        month = month.padStart(2, '0');
        var dateDay = currDate.getDate().toString();
        dateDay = dateDay.padStart(2, '0');
        let time = month + '月' + dateDay + '日';
        return time;
    }
    _showDatePicker = () => {
        var year = '';
        var month = '';
        var day = '';
        var dateStr = this.state.currentDate;
        //console.log('dateStr',dateStr)
        year = dateStr.substring(0, 4);
        month = parseInt(dateStr.substring(5, 7));
        day = parseInt(dateStr.substring(8, 10));
        Picker.init({
            pickerTitleText: '时间选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [month + '月', day + '日'],
            pickerBg: [255, 255, 255, 1],
            pickerData: [
                {
                    1: [1, 2, 3, 4],
                },
                {
                    2: [5, 6, 7, 8],
                },
            ],
            pickerFontColor: [33, 33, 33, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                // var year = pickedValue[0].substring(0, pickedValue[0].length - 1);
                // var month = pickedValue[1].substring(0, pickedValue[1].length - 1);
                let _month = pickedValue[0];
                let _day = pickedValue[1];
                console.log(_month, _day);
                let _str = _month + '月' + _day + '日';
                this.setState({
                    currentDate: _str,
                });
            },
        });
        Picker.show();
    };
    render() {
        const {currentDate} = this.state;
        return (
            <View style={Style.containerPadding}>
                <View style={styles.card_wrap}>
                    <View style={[Style.flexRow, styles.card_list]}>
                        <Text style={styles.card_label}>预约产品</Text>
                        <TextInput
                            placeholder="100万起投，10万递增"
                            value="安志理财魔方私募对冲FOF1号"
                            style={{flex: 1}}
                        />
                    </View>
                    <View style={[Style.flexRow, styles.card_list]}>
                        <Text style={styles.card_label}>投资金额</Text>
                        <TextInput placeholder="100万起投，10万递增" keyboardType={'number-pad'} style={{flex: 1}} />
                    </View>
                    <View style={[Style.flexRow, styles.card_list]}>
                        <View style={[Style.flexRow, {flex: 1}]}>
                            <Text style={styles.card_label}>打款时间</Text>
                            <TouchableOpacity onPress={() => this._showDatePicker()}>
                                <Text>{currentDate}</Text>
                            </TouchableOpacity>
                        </View>
                        <AntDesign name={'right'} color={'#B8C1D3'} />
                    </View>
                    <View style={[Style.flexRow, styles.card_list, {borderBottomWidth: 0}]}>
                        <Text style={styles.card_label}>手机号</Text>
                        <TextInput placeholder="请输入预约手机号" keyboardType={'number-pad'} style={{flex: 1}} />
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card_wrap: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: text(16),
    },
    card_label: {
        minWidth: text(60),
        color: Colors.defaultColor,
    },
    card_list: {
        paddingVertical: text(18),
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
    },
});
