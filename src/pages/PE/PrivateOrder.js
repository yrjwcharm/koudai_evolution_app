/*
 * @Autor: xjh
 * @Date: 2021-01-20 11:43:47
 * @LastEditors: yhc
 * @Desc:私募预约
 * @LastEditTime: 2021-04-14 16:01:36
 */
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Style} from '../../common//commonStyle';
import {px as text, onlyNumber, inputInt, px} from '../../utils/appUtil';
import Picker from 'react-native-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import Http from '../../services';
import Toast from '../../components/Toast';
import {Modal} from '../../components/Modal';
import Mask from '../../components/Mask';
export default class PrivateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: this._getCurrentDate(),
            amount: '',
            phone: '',
            data: {},
            fund_code: props.route?.params?.fund_code || '',
            showMask: false,
        };
    }
    componentDidMount() {
        Http.get('/pe/appointment_detail/20210101', {
            fund_code: this.state.fund_code,
        }).then((res) => {
            this.setState({
                data: res.result,
            });
        });
    }
    //获取当前日期  格式如 2018-12-15
    _getCurrentDate() {
        var currDate = new Date();
        var year = currDate.getFullYear();
        var month = (currDate.getMonth() + 1).toString();
        month = month.padStart(2, '0');
        var dateDay = currDate.getDate().toString();
        dateDay = dateDay.padStart(2, '0');
        let time = year + '年' + month + '月' + dateDay + '日';
        return time;
    }

    //组装日期数据
    _createDateData() {
        let date = [];
        var currDate = new Date();
        var i = currDate.getFullYear();
        // var month = currDate.getMonth() + 1;
        let month = [];
        for (let j = 3; j < 13; j++) {
            let day = [];
            if (j === 2) {
                for (let k = 1; k < 29; k++) {
                    day.push(k + '日');
                }
                if (i % 4 === 0) {
                    day.push(29 + '日');
                }
            } else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
                for (let k = 1; k < 32; k++) {
                    day.push(k + '日');
                }
            } else {
                for (let k = 1; k < 31; k++) {
                    day.push(k + '日');
                }
            }
            let _month = {};
            _month[j + '月'] = day;
            month.push(_month);
        }
        let _date = {};
        _date[i + '年'] = month;
        date.push(_date);
        return date;
    }
    _showDatePicker = () => {
        this.setState({showMask: true});
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
            pickerData: this._createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            wheelFlex: [1, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                let _str = pickedValue[0] + pickedValue[1] + pickedValue[2];
                this.setState({
                    currentDate: _str,
                    showMask: false,
                });
            },
            onPickerCancel: () => {
                this.setState({showMask: false});
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
        const {data, amount, currentDate, phone} = this.state;
        if (!amount) {
            Toast.show('请输入正确的购买金额');
            return;
        }
        if (!phone) {
            Toast.show('请输入您的登录手机号');
            return;
        }
        Http.post('/pe/do_appointment/20210101', {
            order_id: data.order_id,
            amount: amount,
            date: currentDate,
            mobile: phone,
        }).then((res) => {
            if (res.code === '000000') {
                Modal.show({
                    title: '恭喜您预约成功',
                    content: `<div>已成功预约:${data.quote.name}</div><div>预约金额:${amount}万元</div>`,
                    confirmText: '确定',
                    confirmCallBack: () => {
                        setTimeout(() => {
                            this.props.navigation.goBack();
                        }, 250);
                    },
                });
            } else {
                Toast.show(res.message);
            }
        });
    };

    render() {
        const {currentDate, data, amount, phone, showMask} = this.state;
        return (
            <>
                <ScrollView style={Style.containerPadding}>
                    {Object.keys(data).length > 0 && (
                        <View style={styles.card_wrap}>
                            <View style={[Style.flexRow, styles.card_list]}>
                                <Text style={styles.card_label}>预约产品</Text>
                                <Text style={{flex: 1, fontWeight: 'bold'}}>{data.quote.name}</Text>
                            </View>
                            <View style={[Style.flexRow, styles.card_list]}>
                                <Text style={styles.card_label}>投资金额</Text>
                                <TextInput
                                    placeholder="100万起投，10万递增"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={Colors.placeholderColor}
                                    style={{flex: 1, fontWeight: 'bold'}}
                                    value={amount}
                                    onChangeText={(text) => {
                                        this.setState({
                                            amount: onlyNumber(text),
                                        });
                                    }}
                                />
                                <Text style={[{fontSize: text(12)}]}>万</Text>
                            </View>
                            <TouchableOpacity style={[Style.flexRow, styles.card_list]} onPress={this._showDatePicker}>
                                <View style={[Style.flexRow, {flex: 1}]}>
                                    <Text style={styles.card_label}>打款时间</Text>
                                    <Text style={{fontWeight: 'bold'}}>{currentDate}</Text>
                                </View>
                                <AntDesign name={'right'} color={'#B8C1D3'} />
                            </TouchableOpacity>
                            <View style={[Style.flexRow, styles.card_list, {borderBottomWidth: 0}]}>
                                <Text style={styles.card_label}>手机号</Text>
                                <TextInput
                                    placeholder="请输入预约手机号"
                                    keyboardType={'number-pad'}
                                    style={{flex: 1, fontWeight: 'bold'}}
                                    value={phone}
                                    placeholderTextColor={Colors.placeholderColor}
                                    maxLength={11}
                                    onChangeText={(phone) => {
                                        this.setState({phone: inputInt(phone)});
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </ScrollView>
                {Object.keys(data).length > 0 && (
                    <FixedButton
                        title={data.button.text}
                        style={{backgroundColor: '#CEA26B'}}
                        onPress={this.submitOrder}
                        color={'#CEA26B'}
                    />
                )}
                {showMask && <Mask />}
            </>
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
