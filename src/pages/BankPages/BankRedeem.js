/*
 * @Author: xjh
 * @Date: 2021-01-26 11:04:08
 * @Description:银行提现
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-13 21:52:13
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle.js';
import {px, isIphoneX} from '../../utils/appUtil.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';
import {VerifyCodeModal} from '../../components/Modal';
import Radio from '../../components/Radio';
import http from '../../services';
import Toast from '../../components/Toast';
import Agreements from '../../components/Agreements';
class BankRedeem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            amount: '',
            password: '',
            tips: '',
            enable: false,
            items: [],
            check: true,
        };
    }
    msg_seq = '';
    order_no = '';
    txn_id = this.props.route?.params?.txn_id;
    poid = this.props.route?.params?.poid;
    prod_code = this.props.route?.params?.prod_code;
    UNSAFE_componentWillMount() {
        http.get('/trade/redeem/info/20210101', {
            prod_code: this.prod_code,
            poid: this.poid,
            txn_id: this.txn_id,
        }).then((data) => {
            this.props.navigation.setOptions({title: data?.result?.title});
            this.setState({
                data: data.result,
                items: data.result.redeem_info.items,
            });
        });
    }

    onInput = (val) => {
        const {data} = this.state;
        if (val) {
            this.getPlanInfo(val);
            if (val > data.amount) {
                this.setState({
                    tips: `最大可支取金额为${data.amount}元`,
                    enable: false,
                    amount: val,
                });
            } else if (data.min_amount && val < data.amount && data.amount - val < data.min_amount) {
                this.setState({
                    amount: data.amount.toString(),
                    tips: `支取后剩余金额小于最低可持有金额${data.min_amount}元, 将进行全部赎回`,
                    enable: false,
                });
            } else {
                this.setState({
                    tips: '',
                    amount: val,
                    enable: true,
                });
            }
        } else {
            this.setState({
                tips: '',
                amount: '',
                enable: false,
            });
        }
    };
    onChangeText = (code) => {
        if (code.length == 6) {
            this.verifyCodeModel.hide();
            this.submitData('', code);
        }
    };
    signSendVerify = () => {
        http.post('/trade/bank/send/verify_code/20210101', {
            bank_code: this.state.data?.bank_code,
            amount: this.state.amount,
            from: 'redeem',
            scene: 2,
        }).then((res) => {
            if (res.code === '000000') {
                this.order_no = res.result.order_no;
                this.msg_seq = res.result.msg_seq;
                this.verifyCodeModel.show();
            } else {
                Toast.show(res.message);
            }
        });
    };
    submit = () => {
        if (this.state.data?.bank_code == 'ZBB' && !this.state.check) {
            Toast.show('请勾选协议');
            return;
        }
        if (this.state.data?.trade_method == 1) {
            //验证码
            this.signSendVerify();
        } else {
            this.passwordModal.show();
        }
    };
    allAmount = () => {
        this.setState(
            {
                amount: this.state.data.amount.toString(),
            },
            () => {
                this.onInput(this.state.amount);
            }
        );
    };

    // 提交数据
    submitData(password, code) {
        this.setState({password: this.state.password}, () => {
            http.post('/trade/redeem/do/20210101', {
                verify_code: code,
                redeem_id: this.redeem_id,
                poid: this.poid,
                amount: this.state.amount,
                msg_seq: this.msg_seq,
                order_no: this.order_no,
                password,
            }).then((res) => {
                if (res.code == '000000') {
                    this.props.navigation.navigate('TradeProcessing', res.result);
                } else {
                    Toast.show(res.message);
                }
            });
        });
    }
    getPlanInfo(amount) {
        http.get('/trade/redeem/plan/20210101', {
            amount,
            prod_code: this.prod_code,
            poid: this.poid,
            txn_id: this.txn_id,
            bank_code: this.state.data?.bank_code,
        }).then((res) => {
            this.redeem_id = res.result.redeem_id;
            this.setState({
                items: res.result.part3.items,
            });
        });
    }
    render_buy() {
        const {amount, data, tips, items} = this.state;
        return (
            <ScrollView style={{color: Colors.bgColor, flex: 1}}>
                <PasswordModal
                    ref={(ref) => {
                        this.passwordModal = ref;
                    }}
                    onDone={(password) => this.submitData(password, '')}
                />
                <VerifyCodeModal
                    ref={(ref) => (this.verifyCodeModel = ref)}
                    desc={`验证码发送至${data?.mobile}`}
                    // modalCancelCallBack={modalCancelCallBack}
                    onChangeText={this.onChangeText}
                    // isSign={isSign}
                    getCode={this.signSendVerify}
                />
                {data?.header && (
                    <View style={[Style.flexBetween, {paddingHorizontal: px(16), paddingTop: px(12)}]}>
                        <Text style={Style.descSty}>
                            {data?.header[0][0]} {data?.header[0][1]}
                        </Text>
                        <Text style={Style.descSty}>
                            {data.header[1][0]} {data.header[1][1]}
                        </Text>
                    </View>
                )}
                <View style={styles.buyCon}>
                    <Text style={{fontSize: px(16), marginVertical: px(4)}}>{data.redeem_info.text}</Text>
                    <View style={styles.buyInput}>
                        <Text style={{fontSize: px(26), fontFamily: Font.numFontFamily}}>¥</Text>
                        <View style={{flex: 1}}>
                            <TextInput
                                keyboardType="numeric"
                                style={[styles.inputStyle, {fontFamily: amount.length > 0 ? Font.numFontFamily : null}]}
                                placeholder={data.redeem_info?.hidden_text}
                                placeholderTextColor={'#CCD0DB'}
                                onChangeText={(value) => {
                                    this.onInput(value);
                                }}
                                value={amount}
                            />
                            {tips ? <Text style={styles.tips_sty}>{tips}</Text> : null}
                        </View>
                        <TouchableOpacity onPress={this.allAmount} activeOpacity={1}>
                            <Text style={{color: '#0051CC'}}>{data.redeem_info?.btn}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}>
                    {items?.length > 0 &&
                        items.map((_item, _index) => {
                            return (
                                <View style={styles.amount_wrap} key={_index + '_item'}>
                                    <Text style={styles.desc_sty}>{_item[0]}</Text>
                                    <Text style={styles.desc_sty}>{_item[1]}</Text>
                                </View>
                            );
                        })}
                </View>
                <Text style={[Style.descSty, {padding: px(14)}]}>{data.feeText}</Text>
                {this.state.data?.bank_code == 'ZBB' ? (
                    <View style={{marginHorizontal: px(16)}}>
                        <Agreements
                            onChange={(check) => {
                                this.setState({check});
                            }}
                            check={true}
                            data={[
                                {
                                    title: '《定期存款收益权转让合同》',
                                    id: 24,
                                },
                            ]}
                        />
                    </View>
                ) : null}
            </ScrollView>
        );
    }

    render() {
        const {data, enable} = this.state;
        const {button} = data;
        return (
            <View style={{flex: 1, paddingBottom: isIphoneX() ? px(85) : px(51)}}>
                {Object.keys(data).length > 0 && this.render_buy()}
                {button && (
                    <FixedButton title={button?.text} disabled={button?.avail == 0 || !enable} onPress={this.submit} />
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    title: {
        fontSize: px(13),
        paddingVertical: px(12),
        paddingLeft: px(16),
        color: '#4E556C',
    },
    buyCon: {
        backgroundColor: '#fff',
        paddingTop: px(15),
        paddingHorizontal: px(15),
        marginTop: px(12),
    },
    buyInput: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: px(16),
        paddingBottom: px(8),
    },
    inputStyle: {
        flex: 1,
        fontSize: px(26),
        marginLeft: px(14),
        padding: 0,
    },

    line: {
        height: 0.5,
        marginHorizontal: px(15),
        backgroundColor: Colors.lineColor,
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        marginRight: px(6),
    },
    tips_sty: {
        fontSize: px(12),
        color: '#DC4949',
        marginLeft: px(14),
    },
    amount_wrap: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: px(16),
    },
    desc_sty: {
        color: '#545968',
        fontSize: px(13),
    },
});

export default BankRedeem;
