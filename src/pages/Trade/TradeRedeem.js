/*
 * @Description:赎回
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-23 15:13:19
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px as text} from '../../utils/appUtil';
import {Space, Style, Colors, Font} from '../../common/commonStyle';
import Radio from '../../components/Radio';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import Http from '../../services/';
import BottomDesc from '../../components/BottomDesc';
import {Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Picker from 'react-native-picker';
import Mask from '../../components/Mask';
const deviceWidth = Dimensions.get('window').width;
export default class TradeRedeem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            text: '',
            check: [true, false],
            inputValue: '',
            toggleList: false,
            btnClick: false,
            showMask: false,
            password: '',
            trade_method: 0,
            tableData: {},
            reasonParams: '',
            redeem_id: '',
        };
    }
    componentDidMount() {
        Http.get('/trade/redeem/info/20210101', {
            poid: this.props.route.params.poid,
        }).then((res) => {
            this.getPlanInfo();
            if (res.result.pay_methods.default === 1) {
                this.setState({
                    check: [false, true],
                });
            } else {
                this.setState({
                    check: [true, false],
                });
            }
            this.setState({
                data: res.result,
            });
        });
    }
    componentWillUnmount() {
        Picker.hide();
    }
    getPlanInfo() {
        const {tableData} = this.state;
        Http.get('/trade/redeem/plan/20210101', {
            percent: this.state.inputValue / 100,
            trade_method: this.state.trade_method,
            poid: this.props.route.params.poid,
        }).then((res) => {
            tableData['head'] = res.result.header;
            tableData['body'] = res.result.body;
            this.setState({
                tableData,
                redeem_id: res.result.redeem_id,
            });
        });
    }
    radioChange(index, type) {
        let check = this.state.check;
        // const lastIndex = check.indexOf(true);
        check = check.map((item) => false);
        // if (index !== lastIndex) {
        //     check[index] = true;
        // }
        check[index] = true;
        this.setState({
            check,
            trade_method: type,
        });
    }
    pressChange(percent) {
        this.setState(
            {
                inputValue: (percent * 100).toString(),
            },
            () => {
                this.getPlanInfo();
            }
        );
    }
    toggleFund() {
        const toggleList = this.state.toggleList;
        this.setState({
            toggleList: !toggleList,
        });
    }

    passwordInput = () => {
        this.passwordModal.show();
    };
    submitData = (password) => {
        Http.post('/trade/redeem/do/20210101', {
            redeem_id: this.state.redeem_id,
            password,
            percent: this.state.inputValue / 100,
            trade_method: this.state.trade_method,
            poid: this.props.route.params.poid,
        }).then((res) => {
            if (res.code === '000000') {
                this.props.navigation.navigate('TradeProcessing', {txn_id: res.result.txn_id});
            } else {
                Modal.show({
                    content: res.message,
                });
            }
        });
    };
    onChange = (text) => {
        if (text > 0) {
            this.getPlanInfo();
            if (text > 100) {
                text = '100';
            }
            text = text.replace(/[^\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            this.setState({inputValue: text, btnClick: true});
        }
    };
    selectAge = () => {
        const option = [];
        var _id;
        this.state.data.survey.option.forEach((_item, _index) => {
            option.push(_item.v);
        });

        this.setState({showMask: true});
        Picker.init({
            pickerTitleText: '您赎回的原因？',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [1],
            pickerBg: [255, 255, 255, 1],
            pickerData: option,
            pickerFontColor: [33, 33, 33, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                this.state.data.survey.option.forEach((_item, _index) => {
                    if (_item.v === pickedValue[0]) {
                        _id = _item.id;
                    }
                });
                this.setState({showMask: false});
                Http.get('/trade/redeem/survey/20210101', {
                    id: _id,
                }).then((res) => {
                    this.passwordInput();
                });
            },
            onPickerCancel: () => {
                this.setState({showMask: false});
            },
        });
        Picker.show();
    };
    render() {
        const {data, tableData, toggleList, btnClick} = this.state;
        return (
            <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
                {!!data && (
                    <ScrollView>
                        <Text style={styles.redeem_desc}>赎回至银行卡</Text>
                        {data?.pay_methods?.methods.map((_item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        Style.flexRow,
                                        styles.card_item,
                                        styles.card_select,
                                        {
                                            borderBottomWidth: index < data.length - 1 ? 0.5 : 0,
                                            borderColor: Colors.borderColor,
                                        },
                                    ]}>
                                    <View style={[Style.flexRow, {flex: 1}]}>
                                        <FastImage
                                            style={{width: 24, height: 24}}
                                            source={{
                                                uri: _item.bank_icon,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        <Text style={{color: Colors.descColor, paddingLeft: text(10)}}>
                                            {_item.bank_name}
                                        </Text>
                                        <Text style={{color: '#DC4949', paddingLeft: text(10)}}>{_item.desc}</Text>
                                    </View>
                                    <Radio
                                        checked={this.state.check[index]}
                                        index={index}
                                        onChange={() => this.radioChange(index, _item.pay_type)}
                                    />
                                </View>
                            );
                        })}
                        <View style={styles.card_wrap}>
                            <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
                                <Text style={{fontSize: Font.textH1, color: '#1F2432'}}>
                                    {data?.redeem_info?.title}
                                </Text>
                                <View style={Style.flexRow}>
                                    {data?.redeem_info?.options.map((_i, _d) => {
                                        return (
                                            <TouchableOpacity
                                                style={styles.btn_percent}
                                                key={_d + _i}
                                                onPress={() => this.pressChange(_i.percent)}>
                                                <Text style={{color: '#0051CC'}}>{_i.text}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                            <View
                                style={[
                                    Style.flexRow,
                                    {marginTop: text(12), borderBottomWidth: 0.5, borderColor: Colors.borderColor},
                                ]}>
                                <TextInput
                                    style={{height: text(50), fontSize: text(26), flex: 1, textAlign: 'center'}}
                                    placeholder={data?.redeem_info?.redeem_text}
                                    value={this.state.inputValue}
                                    onChangeText={(text) => this.onChange(text)}
                                />
                                <Text style={styles.percent_symbol}>%</Text>
                            </View>
                            <TouchableOpacity
                                style={[Style.flexRow, {marginTop: text(17)}]}
                                onPress={() => this.toggleFund()}
                                activeOpacity={1}>
                                <Text style={{color: '#1F2432', fontSize: Font.textH2, flex: 1}}>
                                    {data?.redeem_info?.redeem_text}
                                </Text>
                                <AntDesign name={toggleList ? 'up' : 'down'} size={12} color={'#9095A5'} />
                            </TouchableOpacity>
                            {toggleList && Object.keys(tableData).length > 0 && (
                                <View>
                                    <View style={[Style.flexRow, {paddingVertical: text(5)}]}>
                                        <Text style={styles.head_sty}></Text>
                                        <Text style={styles.head_sty}>{tableData?.head?.amount_total}</Text>
                                        <Text style={styles.head_sty}>{tableData?.head?.amount}</Text>
                                    </View>
                                    <View>
                                        {tableData?.body?.map((_item, _index) => {
                                            return (
                                                <View
                                                    key={_index + 'item'}
                                                    style={[Style.flexRow, {paddingVertical: text(5)}]}>
                                                    <Text style={[styles.body_sty, {textAlign: 'left', flexShrink: 1}]}>
                                                        {_item.name}
                                                    </Text>
                                                    <Text style={styles.body_sty}>{_item?.amount_total}</Text>
                                                    <Text style={styles.body_sty}>{_item?.amount}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        </View>
                        <PasswordModal
                            ref={(ref) => {
                                this.passwordModal = ref;
                            }}
                            onDone={this.submitData}
                        />
                        {this.state.showMask && <Mask />}
                        <BottomDesc />
                    </ScrollView>
                )}
                {!!data && (
                    <FixedButton
                        title={data?.button?.text}
                        disabled={data?.button?.avail == 0 || btnClick == false}
                        onPress={this.selectAge}
                    />
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    redeem_desc: {
        color: Colors.descColor,
        fontSize: Font.placeholderFont,
        paddingVertical: text(12),
        paddingLeft: text(15),
    },
    card_select: {
        backgroundColor: '#fff',
        paddingLeft: text(15),
        paddingRight: text(10),
    },
    card_item: {
        flex: 1,
        paddingVertical: text(16),
    },
    card_wrap: {
        padding: text(15),
        backgroundColor: '#fff',
        marginTop: text(12),
    },
    btn_percent: {
        borderRadius: text(10),
        backgroundColor: '#F1F6FF',
        paddingHorizontal: text(8),
        paddingVertical: text(3),
        marginLeft: text(10),
    },
    percent_symbol: {
        fontSize: text(20),
        color: '#333',
        width: text(20),
        fontWeight: 'bold',
    },
    head_sty: {
        flex: 1,
        color: '#9095A5',
        fontSize: text(12),
        textAlign: 'right',
    },
    body_sty: {
        color: '#4E556C',
        fontSize: text(12),
        textAlign: 'right',
        flex: 1,
    },
});
