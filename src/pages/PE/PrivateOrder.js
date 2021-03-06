/*
 * @Autor: xjh
 * @Date: 2021-01-20 11:43:47
 * @LastEditors: xjh
 * @Desc:私募预约
 * @LastEditTime: 2021-03-06 13:31:41
 */
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Picker from 'react-native-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import Http from '../../services';
import {Toast} from '../../components/Toast';
import {Modal} from '../../components/Modal';
export default class PrivateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: this._getCurrentDate(),
            amount: '',
            phone: '',
            data: {},
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
    componentDidMount() {
        Http.get('/pe/appointment_detail/20210101', {
            fund_code: 'SGX499',
        }).then((res) => {
            this.setState({
                data: res.result,
                amount: res.result.quote.start_amount,
                phone: res.result.quote.phone,
            });
        });
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
            pickerData: this.state.data.quote.month,
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
    onInput = (text) => {
        this.setState({
            amount: text,
        });
    };
    submitOrder = () => {
        const {data, amount, currentDate} = this.state;
        Http.post('/pe/do_appointment/20210101', {
            order_id: data.order_id,
            amount: amount,
            date: currentDate,
            mobile: this.state.data.quote.phone,
        }).then((res) => {
            if (res.code === '000000') {
                Modal.show({
                    title: '恭喜您预约成功',
                    content: '已成功预约',
                    confirmText: '确定',
                });
                // Toast.show('预约成功');
            }
        });
    };
    render() {
        const {currentDate, data, amount, phone} = this.state;
        return (
            <View style={Style.containerPadding}>
                {Object.keys(data).length > 0 && (
                    <View style={styles.card_wrap}>
                        <View style={[Style.flexRow, styles.card_list]}>
                            <Text style={styles.card_label}>预约产品</Text>
                            <TextInput placeholder="产品名称" value={data.quote.name} style={{flex: 1}} />
                        </View>
                        <View style={[Style.flexRow, styles.card_list]}>
                            <Text style={styles.card_label}>投资金额</Text>
                            <TextInput
                                placeholder="100万起投，10万递增"
                                keyboardType={'number-pad'}
                                style={{flex: 1}}
                                value={amount}
                                onChangeText={(text) => {
                                    this.setState({
                                        amount: text,
                                    });
                                }}
                            />
                        </View>
                        <TouchableOpacity style={[Style.flexRow, styles.card_list]} onPress={this._showDatePicker}>
                            <View style={[Style.flexRow, {flex: 1}]}>
                                <Text style={styles.card_label}>打款时间</Text>
                                <Text>{currentDate}</Text>
                            </View>
                            <AntDesign name={'right'} color={'#B8C1D3'} />
                        </TouchableOpacity>
                        <View style={[Style.flexRow, styles.card_list, {borderBottomWidth: 0}]}>
                            <Text style={styles.card_label}>手机号</Text>
                            <TextInput
                                placeholder="请输入预约手机号"
                                keyboardType={'number-pad'}
                                style={{flex: 1}}
                                value={phone}
                                maxLength={11}
                                onChangeText={(phone) => {
                                    this.setState({phone});
                                }}
                            />
                        </View>
                    </View>
                )}
                {Object.keys(data).length > 0 && (
                    <FixedButton
                        title={'立即申请'}
                        style={{backgroundColor: '#CEA26B'}}
                        onPress={this.submitOrder}
                        color={'#CEA26B'}
                    />
                )}
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
