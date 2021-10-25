/*
 * @Description:赎回
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: dx
 * @LastEditTime: 2021-10-25 15:54:22
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Keyboard, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px as text, isIphoneX, onlyNumber} from '../../utils/appUtil';
import {Style, Colors, Font, Space} from '../../common/commonStyle';
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
let timer = null;
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
            notice: '', //不足7天的基金弹窗
            short_cut_options: [],
            min_ratio: '',
        };
        this.notice = '';
        this.inputValue = 0;
    }
    componentDidMount() {
        Http.get('/trade/redeem/info/20210101', {
            poid: this.props.route?.params?.poid,
        }).then((res) => {
            if (res.code === '000000') {
                this.getPlanInfo(res.result?.scene);
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
                    short_cut_options: res?.result?.redeem_info?.options,
                });
            }
        });
    }
    componentWillUnmount() {
        Picker.hide();
    }
    getPlanInfo(scene) {
        return new Promise((resolve, reject) => {
            const {tableData, init, inputValue} = this.state;
            Http.get('/trade/redeem/plan/20210101', {
                percent: inputValue / 100,
                trade_method: this.state.trade_method,
                poid: this.props.route?.params?.poid,
                init,
            }).then((res) => {
                if (res.code === '000000') {
                    tableData.head = res.result.header || {};
                    tableData.body = res.result.body || [];
                    this.notice = res.result.notice;
                    if (scene == 'adviser' && init == 1) {
                        this.setState((prev) => ({
                            tips: res.result.amount_desc || prev.tips,
                            short_cut_options: res?.result?.options || [],
                            min_ratio: res?.result?.min_percent?.key,
                        }));
                        // if (res.result?.options) {
                        //     this.setState({
                        //         short_cut_options: res?.result?.options||[],
                        //     });
                        // } else {
                        //     this.setState({
                        //         short_cut_options: [],
                        //     });
                        // }
                    }
                    if (init != 1) {
                        this.setState((prev) => ({
                            tableData,
                            redeem_id: res.result.redeem_id,
                            tips: res.result.amount_desc || prev.tips,
                        }));
                    }
                    resolve(res.result.redeem_id);
                } else {
                    this.setState({
                        btnClick: false,
                    });
                    this.notice = '';
                    reject();
                    Toast.show(res.message);
                }
            });
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
        this.inputValue = percent * 100;
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
    submitData = async (password) => {
        let toast = Toast.showLoading();
        let redeem_id = await this.getPlanInfo();
        Http.post('/trade/redeem/do/20210101', {
            redeem_id: redeem_id || this.state.redeem_id,
            password,
            percent: this.inputValue / 100,
            trade_method: this.state.trade_method,
            poid: this.props.route?.params?.poid,
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
        _text = onlyNumber(_text);
        if (_text && _text != 0) {
            if (_text > 100) {
                _text = '100';
            }
            this.inputValue = _text;
            this.setState({btnClick: true, inputValue: _text, init: 0}, () => {
                timer && clearTimeout(timer);
                timer = setTimeout(() => {
                    this.getPlanInfo();
                }, 300);
            });
        } else {
            this.setState({btnClick: false, inputValue: '', tips: this.redeemTip, init: 1});
        }
    };
    redeemClick = () => {
        global.LogTool('confirmRedeemEnd', this.props.route?.params?.poid);
        if (this.notice) {
            Modal.show({
                title: '赎回确认',
                content: this.notice,
                confirmText: '取消赎回',
                cancelText: '继续赎回',
                confirm: true,
                cancelCallBack: () => {
                    this.redeemReason();
                },
                confirmCallBack: () => {
                    this.props.navigation.goBack();
                },
            });
        } else {
            this.redeemReason();
        }
    };
    redeemReason = () => {
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
                pickerTextEllipsisLen: 100,
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
        const {data, tableData, toggleList, btnClick, redeemTo, tips, short_cut_options, min_ratio} = this.state;
        return (
            <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
                {!!data && (
                    <ScrollView keyboardShouldPersistTaps="handled" style={{marginBottom: btnHeight}}>
                        <Text style={styles.redeem_desc}>赎回至{redeemTo}</Text>
                        <View style={{paddingHorizontal: text(16), backgroundColor: '#fff'}}>
                            {data?.pay_methods?.methods.map((_item, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => this.radioChange(index, _item.pay_type, _item.bank_name)}
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
                                            onChange={() => {
                                                this.radioChange(index, _item.pay_type, _item.bank_name);
                                            }}
                                            index={index}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.card_wrap}>
                            <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
                                <Text style={{fontSize: Font.textH1, color: '#1F2432'}}>
                                    {data?.redeem_info?.title}
                                </Text>
                                <View style={Style.flexRow}>
                                    {short_cut_options?.map((_i, _d) => {
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
                                    keyboardType="numeric"
                                    style={{
                                        height: text(50),
                                        fontSize: text(26),
                                        flex: 1,
                                        textAlign: Platform.select({android: 'left', ios: 'center'}),
                                        paddingLeft: Platform.select({android: '25%', ios: 0}),
                                    }}
                                    placeholder={this.state.inputValue ? '' : data?.redeem_info?.hidden_text}
                                    placeholderTextColor={Colors.placeholderColor}
                                    value={this.state.inputValue}
                                    onBlur={() => {
                                        let _text = this.state.inputValue;
                                        if (_text && min_ratio) {
                                            if (_text < min_ratio * 100) {
                                                _text = `${min_ratio * 100}`;
                                                this.inputValue = _text;
                                                this.setState({btnClick: true, inputValue: _text, init: 0}, () => {
                                                    timer && clearTimeout(timer);
                                                    timer = setTimeout(() => {
                                                        this.getPlanInfo();
                                                    }, 300);
                                                });
                                            }
                                        }
                                    }}
                                    onChangeText={(val) => this.onChange(val)}
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
                        {data.scene !== 'adviser' && (
                            <TouchableOpacity
                                style={[
                                    Style.flexRow,
                                    {marginTop: text(12), backgroundColor: '#fff', padding: text(16)},
                                ]}
                                onPress={() => this.toggleFund()}
                                activeOpacity={1}>
                                <Text style={{color: '#1F2432', fontSize: Font.textH2, flex: 1}}>
                                    {data?.redeem_info?.redeem_text}
                                </Text>
                                <AntDesign name={toggleList ? 'up' : 'down'} size={12} color={'#9095A5'} />
                            </TouchableOpacity>
                        )}
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
                        {data.reminder ? (
                            <View style={{paddingTop: Space.padding, paddingHorizontal: Space.padding}}>
                                <Html style={styles.reminderSty} html={data.reminder} />
                            </View>
                        ) : null}
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
                        onPress={this.redeemClick}
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
    reminderSty: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightGrayColor,
    },
});
