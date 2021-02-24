/*
 * @Description:赎回
 * @Autor: xjh
 * @Date: 2021-01-15 15:56:47
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-23 12:12:04
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
            tableData: {
                head: {percent: '当前持仓金额', amount: '赎回金额'},
                body: [
                    {name: '货币', percent: '20', amount: '3.45'},
                    {name: '货币', percent: '20', amount: '3.45'},
                    {name: '货币', percent: '20', amount: '3.45'},
                ],
            },
        };
    }
    componentDidMount() {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/trade/redeem/info/20210101', {
            poid: 'VV00000065',
        }).then((res) => {
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
        this.setState({
            inputValue: (percent * 100).toString(),
        });
    }
    toggleFund() {
        const toggleList = this.state.toggleList;
        this.setState({
            toggleList: !toggleList,
        });
    }
    getPlanInfo() {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/trade/redeem/plan/20210101', {
            percent: this.state.inputValue / 100,
            trade_method: this.state.trade_method,
            poid: 'VV00000065',
        }).then((res) => {});
    }
    passwordInput = () => {
        this.passwordModal.show();
        this.setState({showMask: true});
    };
    submitData = (password) => {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/trade/redeem/do/20210101', {
            redeemid: 12,
            password,
            percent: this.state.inputValue / 100,
            trade_method: this.state.trade_method,
            poid: 'VV00000065',
        }).then((res) => {
            if (res.code === '000000') {
                this.props.navigation.navigate(this.state.data.button.url);
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
    render() {
        const {data, tableData, toggleList, btnClick} = this.state;
        return (
            <View style={{flex: 1}}>
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
                                <AntDesign name={toggleList ? 'down' : 'up'} size={12} color={'#9095A5'} />
                            </TouchableOpacity>
                            {toggleList && (
                                <View>
                                    <View style={[Style.flexRow, {paddingVertical: text(5)}]}>
                                        <Text style={styles.head_sty}></Text>
                                        <Text style={styles.head_sty}>{tableData.head.percent}</Text>
                                        <Text style={styles.head_sty}>{tableData.head.amount}</Text>
                                    </View>
                                    <View>
                                        {tableData.body.map((_item, _index) => {
                                            return (
                                                <View
                                                    key={_index + 'item'}
                                                    style={[Style.flexRow, {paddingVertical: text(5)}]}>
                                                    <Text style={[styles.body_sty, {textAlign: 'left'}]}>
                                                        {_item.name}
                                                    </Text>
                                                    <Text style={styles.body_sty}>{_item.percent}</Text>
                                                    <Text style={styles.body_sty}>{_item.amount}</Text>
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
                            onClose={() => {
                                this.setState({showMask: false});
                            }}
                        />
                        <BottomDesc />
                    </ScrollView>
                )}
                {!!data && (
                    <FixedButton
                        title={data?.button?.text}
                        disabled={data?.button?.avail == 0 || btnClick == false}
                        onPress={this.passwordInput}
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
        flex: 1,
        color: '#4E556C',
        fontSize: text(12),
        textAlign: 'right',
    },
});
