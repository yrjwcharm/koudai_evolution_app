/*
 * @Date: 2021-01-18 10:27:05
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-24 17:48:29
 * @Description:银行卡信息
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px, inputInt} from '../../../utils/appUtil';
import {Style, Colors} from '../../../common/commonStyle';
import Input from '../../../components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FixedButton} from '../../../components/Button';
import Agreements from '../../../components/Agreements';
import {BankCardModal} from '../../../components/Modal';
import {formCheck} from '../../../utils/validator';
import Toast from '../../../components/Toast';
import http from '../../../services';
import {Modal} from '../../../components/Modal';
import _ from 'lodash';
export class bankInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '', //手机号
            code: '', //验证码
            bank_no: '', //银行卡号
            btnClick: true, //开户按钮是否能点击
            verifyText: '获取验证码',
            second: 60,
            checked: true, //协议
            code_btn_click: true, //验证码按钮
            bankList: [],
            selectBank: '',
        };
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('beforeRemove', this.back);
        http.get('/passport/bank_list/20210101').then((data) => {
            this.setState({bankList: data.result});
        });
    }
    componentWillUnmount() {
        this._unsubscribe && this._unsubscribe();
        this.time && clearInterval(this.time);
    }
    /**
     * @description: 开户
     * @param {*} confirm
     * @return {*}
     */
    confirm = () => {
        const {phone, code, selectBank, bank_no, checked} = this.state;
        var checkData = [
            {
                field: bank_no,
                text: '银行卡号不能为空',
            },
            {
                field: selectBank.bank_code,
                text: '请选择银行',
            },

            {
                field: phone,
                text: '手机号不能为空',
            },
            {
                field: code,
                text: '验证码不能为空',
            },
            {
                field: checked,
                text: '必须同意服务协议才能完成开户',
                append: '!',
            },
        ];
        if (!formCheck(checkData)) {
            return;
        }
        http.post(
            '/passport/xy_account/bind_confirm/20210101',
            {
                phone,
                code,
                bank_no: bank_no.replace(/ /g, ''),
                bank_code: selectBank.bank_code,
                id_no: this.props.route?.params?.id_no,
                name: this.props.route?.params?.name,
                rcode: this.props.route?.params?.rcode,
                rname: this.props.route?.params?.rname,
                poid: this.props.route?.params?.poid,
            },
            '正在提交数据...'
        ).then((res) => {
            if (res.code == '000000') {
                Toast.show('开户成功', {
                    onHidden: () => {
                        this.props.navigation.replace(res.result?.jump_url?.path, {
                            ...res.result?.jump_url?.params,
                            fr: this.props.route?.params?.fr || '',
                        });
                    },
                });
            } else {
                Toast.show(res.message);
            }
        });
    };
    /**
     * @description: 发送验证码
     * @param {*} sendCode
     * @return {*}
     */
    sendCode = () => {
        const {code_btn_click, phone, selectBank, bank_no} = this.state;
        if (code_btn_click) {
            var checkData = [
                {
                    field: bank_no,
                    text: '银行卡号不能为空',
                },
                {
                    field: selectBank.bank_code,
                    text: '请选择银行',
                },

                {
                    field: phone,
                    text: '手机号不能为空',
                },
            ];
            if (!formCheck(checkData)) {
                return;
            }
            http.post(
                '/passport/xy_account/bind_prepare/20210101',
                {
                    id_no: this.props.route?.params?.id_no,
                    name: this.props.route?.params?.name,
                    bank_no: bank_no.replace(/ /g, ''),
                    bank_code: selectBank.bank_code,
                    phone,
                },
                '正在发送验证码...'
            ).then((res) => {
                if (res.code == '000000') {
                    Toast.show('验证码发送成功');
                    this.timer();
                } else {
                    Toast.show(res.message);
                }
            });
        }
    };
    time = null;
    //倒计时函数
    timer = () => {
        let {second} = this.state;
        this.setState({
            verifyText: second + '秒重发',
        });
        this.time = setTimeout(() => {
            this.setState({
                second: --second,
                verifyText: second + '秒重发',
                code_btn_click: false,
            });
            if (second <= 0) {
                clearInterval(this.time);
                this.setState({
                    second: 60,
                    verifyText: '重新发送验证码',
                    code_btn_click: true,
                });
            } else {
                this.timer();
            }
        }, 1000);
    };
    _showBankCard = () => {
        this.bankCard.show();
    };
    jumpPage = () => {
        this.props.navigation.navigate('BankInfo');
    };

    back = (e) => {
        if (e.data.action.type == 'REPLACE') {
            return;
        }
        e.preventDefault();
        Modal.show({
            title: '结束开户',
            content: '您马上就开户完成了，确定要离开吗？',
            confirm: true,
            confirmCallBack: () => {
                this.props.navigation.dispatch(e.data.action);
            },
        });
    };
    /**
     * @description: 回填银行信息，格式化
     * @param {*} onChangeBankNo
     * @return {*}
     */
    onChangeBankNo = (value) => {
        if (value && value.length > 11) {
            http.get('/passport/match/bank_card_info/20210101', {
                bank_no: this.state.bank_no.replace(/ /g, ''),
            }).then((res) => {
                this.setState({
                    selectBank: res.result,
                });
            });
        }
        this.setState({
            bank_no: (value + '')
                .replace(/\s/g, '')
                .replace(/\D/g, '')
                .replace(/(\d{4})(?=\d)/g, '$1 '),
        });
    };
    render() {
        const {verifyText, bank_no, bankList, selectBank, phone, code} = this.state;
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.con} keyboardShouldPersistTaps="handled">
                    <KeyboardAvoidingView
                        behavior="position"
                        keyboardVerticalOffset={px(120)}
                        style={{paddingHorizontal: px(16)}}>
                        <BankCardModal
                            title="请选择银行卡"
                            data={bankList}
                            style={{height: px(500)}}
                            onDone={(data) => {
                                this.setState({selectBank: data});
                            }}
                            ref={(ref) => (this.bankCard = ref)}
                        />
                        <FastImage
                            style={styles.pwd_img}
                            source={require('../../../assets/img/account/second.png')}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <View
                            // style={{height: height}}

                            style={styles.card}>
                            <View style={styles.card_header}>
                                <Image
                                    source={require('../../../assets/img/account/cardMes.png')}
                                    style={{width: px(22), resizeMode: 'contain'}}
                                />
                                <Text style={styles.card_head_text}>银行卡信息</Text>
                            </View>
                            <Input
                                label="银行卡号"
                                placeholder="请输入您的银行卡号"
                                keyboardType={'number-pad'}
                                maxLength={25}
                                value={bank_no}
                                onChangeText={this.onChangeBankNo}
                            />
                            <View style={Style.flexRow}>
                                <Input
                                    label="银行"
                                    isUpdate={false}
                                    placeholder="请选择您银行"
                                    value={selectBank.bank_name}
                                    onClick={this._showBankCard}
                                    inputStyle={{flex: 1}}
                                    returnKeyType={'done'}
                                />
                                <FontAwesome
                                    name={'angle-right'}
                                    size={18}
                                    color={'#999999'}
                                    style={{marginLeft: -14}}
                                />
                            </View>

                            <Input
                                label="手机号"
                                placeholder="请输入您的手机号"
                                keyboardType={'number-pad'}
                                maxLength={11}
                                value={phone}
                                onChangeText={(_phone) => {
                                    this.setState({phone: inputInt(_phone)});
                                }}
                            />
                            <View style={Style.flexRow}>
                                <Input
                                    label="验证码"
                                    placeholder="请输入验证码"
                                    keyboardType={'number-pad'}
                                    maxLength={6}
                                    value={code}
                                    onChangeText={(_code) => {
                                        this.setState({code: inputInt(_code)});
                                    }}
                                    inputStyle={{flex: 1, borderBottomWidth: 0}}
                                />
                                <View style={[styles.border, {width: verifyText.length > 5 ? px(110) : px(84)}]}>
                                    <Text
                                        onPress={_.debounce(this.sendCode, 500)}
                                        style={{
                                            color: Colors.btnColor,
                                        }}>
                                        {verifyText}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Agreements
                            onChange={(checked) => {
                                this.setState({checked});
                            }}
                            title="本人承诺仅为中国税收居民且为该基金投资账户的实际控制 人及受益人，我已阅读并同意"
                            data={[
                                {
                                    title: '《基金电子交易远程服务协议》',
                                    id: 16,
                                },
                                {
                                    title: '《委托支付协议》',
                                    id: 15,
                                },
                            ]}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
                <FixedButton title={'立即开户'} onPress={_.debounce(this.confirm, 500)} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    pwd_img: {
        width: '100%',
        height: px(55),
        marginVertical: px(24),
    },
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        borderRadius: px(8),
        marginBottom: px(12),
    },
    card_header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
        paddingVertical: px(6),
    },
    card_head_text: {
        fontSize: px(14),
        color: '#292D39',
        marginLeft: px(6),
    },
    border: {
        borderLeftWidth: px(0.5),
        alignItems: 'flex-end',
        borderColor: Colors.borderColor,
    },
});
export default bankInfo;
