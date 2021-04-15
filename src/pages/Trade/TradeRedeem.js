/*
 * @Description:赎回
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-15 11:29:40
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions, Keyboard} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px as text, isIphoneX, onlyNumber} from '../../utils/appUtil';
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
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast/Toast.js';
const btnHeight = isIphoneX() ? text(90) : text(66);
const deviceWidth = Dimensions.get('window').width;
var inputValue = 0;
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
            redeemTo: '银行卡',
            tips: '',
            init: 1,
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
        const {tableData, init} = this.state;
        Http.get('/trade/redeem/plan/20210101', {
            percent: inputValue / 100,
            trade_method: this.state.trade_method,
            poid: this.props.route.params.poid,
            init,
        }).then((res) => {
            if (res.code === '000000') {
                tableData.head = res.result.header;
                tableData.body = res.result.body;
                if (init != 1) {
                    this.setState({
                        tableData,
                        redeem_id: res.result.redeem_id,
                        tips: res.result.amount_desc,
                    });
                }
            } else {
                this.setState({
                    btnClick: false,
                });
                Toast.show(res.message);
            }
        });
    }
    radioChange(index, type, name) {
        let check = this.state.check;
        check = check.map((item) => false);
        check[index] = true;
        this.setState(
            {
                check,
                trade_method: type,
                redeemTo: name,
            },
            () => {
                this.getPlanInfo();
            }
        );
    }
    pressChange(percent) {
        inputValue = percent * 100;
        this.setState(
            {
                inputValue: (percent * 100).toString(),
                btnClick: true,
                init: 0,
            },
            () => {
                this.getPlanInfo();
            }
        );
    }
    toggleFund() {
        Keyboard.dismiss();
        const toggleList = this.state.toggleList;
        this.setState({
            toggleList: !toggleList,
        });
    }

    passwordInput = () => {
        this.passwordModal.show();
    };
    submitData = (password) => {
        let toast = Toast.showLoading();
        Http.post('/trade/redeem/do/20210101', {
            redeem_id: this.state.redeem_id,
            password,
            percent: inputValue / 100,
            trade_method: this.state.trade_method,
            poid: this.props.route.params.poid,
        }).then((res) => {
            Toast.hide(toast);
            if (res.code === '000000') {
                this.props.navigation.navigate('TradeProcessing', {txn_id: res.result.txn_id});
            } else {
                Modal.show({
                    content: res.message,
                });
            }
        });
    };
    onChange = (_text) => {
        let text = onlyNumber(_text);
        if (text) {
            if (text > 100) {
                text = '100';
            }
            inputValue = text;
            // text = text.replace(/[^\d.]/g, '').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            this.getPlanInfo();
            this.setState({inputValue: text, btnClick: true, init: 0});
        } else {
            this.setState({inputValue: '', btnClick: false, tips: '', init: 1});
        }
    };
    selectAge = () => {
        setTimeout(() => {
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
                pickerTextEllipsisLen: 20,
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
            Keyboard.dismiss();
        }, 250);
    };
    render() {
        const {data, tableData, toggleList, btnClick, redeemTo, tips} = this.state;
        return (
            <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
                {!!data && (
                    <ScrollView keyboardShouldPersistTaps="handled" style={{marginBottom: btnHeight}}>
                        <Text style={styles.redeem_desc}>赎回至{redeemTo}</Text>
                        <View style={{paddingHorizontal: text(16), backgroundColor: '#fff'}}>
                            {data?.pay_methods?.methods.map((_item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={[
                                            Style.flexRow,
                                            styles.card_item,
                                            {
                                                borderBottomWidth: index == 0 ? 0.5 : 0,
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
                                            onChange={() => this.radioChange(index, _item.pay_type, _item.bank_name)}
                                        />
                                    </View>
                                );
                            })}
                        </View>

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
                                    placeholder={this.state.inputValue ? '' : data?.redeem_info?.hidden_text}
                                    value={this.state.inputValue}
                                    onChangeText={(text) => this.onChange(text)}
                                />
                                <Text style={styles.percent_symbol}>%</Text>
                            </View>
                            {tips ? (
                                <View style={{paddingTop: text(12)}}>
                                    <Html
                                        html={tips}
                                        style={{color: '#545968', fontSize: text(12), lineHeight: text(18)}}
                                    />
                                </View>
                            ) : null}
                        </View>
                        <TouchableOpacity
                            style={[Style.flexRow, {marginTop: text(12), backgroundColor: '#fff', padding: text(16)}]}
                            onPress={() => this.toggleFund()}
                            activeOpacity={1}>
                            <Text style={{color: '#1F2432', fontSize: Font.textH2, flex: 1}}>
                                {data?.redeem_info?.redeem_text}
                            </Text>
                            <AntDesign name={toggleList ? 'up' : 'down'} size={12} color={'#9095A5'} />
                        </TouchableOpacity>
                        {toggleList && Object.keys(tableData).length > 0 && tableData?.body.length > 0 && (
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    padding: text(16),
                                    borderTopWidth: 0.5,
                                    borderColor: Colors.borderColor,
                                }}>
                                <View style={[Style.flexRow, {paddingVertical: text(5)}]}>
                                    <Text style={[styles.head_sty, {textAlign: 'left', flexShrink: 0}]}>
                                        {tableData?.head?.name}
                                    </Text>
                                    <Text style={[styles.body_item_sty, {color: '#9095A5'}]}>
                                        {tableData?.head?.amount_total}
                                    </Text>
                                    <Text style={[styles.body_item_sty, {color: '#9095A5'}]}>
                                        {tableData?.head?.amount}
                                    </Text>
                                </View>
                                <View>
                                    {tableData?.body?.map((_item, _index) => {
                                        return (
                                            <View
                                                key={_index + 'item'}
                                                style={[Style.flexRow, {paddingVertical: text(5)}]}>
                                                <Text style={[styles.body_sty, {textAlign: 'left', flexShrink: 0}]}>
                                                    {_item.name}
                                                </Text>
                                                <Text style={[styles.body_item_sty, {textAlign: 'center'}]}>
                                                    {_item?.amount_total}
                                                </Text>
                                                <Text style={styles.body_item_sty}>{_item?.amount}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                        <PasswordModal
                            ref={(ref) => {
                                this.passwordModal = ref;
                            }}
                            onDone={this.submitData}
                        />
                        {this.state.showMask && (
                            <Mask
                                onClick={() => {
                                    this.setState({showMask: false});
                                    Picker.hide();
                                }}
                            />
                        )}
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
        borderRadius: text(15),
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
    },
    body_sty: {
        color: '#4E556C',
        fontSize: text(12),
        textAlign: 'right',
        flex: 1,
    },
    body_item_sty: {
        color: '#4E556C',
        fontSize: text(12),
        textAlign: 'right',
        width: text(80),
    },
});
