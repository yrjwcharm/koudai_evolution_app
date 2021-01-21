/*
 * @Date: 2021-01-18 10:27:05
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-20 16:26:27
 * @Description:银行卡信息
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '../../../utils/appUtil';
import {Style, Colors} from '../../../common/commonStyle';
import Input from '../../../components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FixedButton} from '../../../components/Button';
import Agreements from '../../../components/Agreements';
import {BankCardModal} from '../../../components/Modal';
import {formCheck} from '../../../utils/validator';
export class bankInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '', //手机号
            code: '', //验证码
            bank_no: '', //银行卡号
            bank_code: '', //银行代码
            btnClick: true, //开户按钮是否能点击
            verifyText: '获取验证码',
            second: 60,
            checked: true, //协议
            code_btn_click: true, //验证码按钮
        };
    }
    confirm = () => {
        const {phone, code, bank_code, bank_no, checked} = this.state;
        var checkData = [
            {
                field: bank_no,
                text: '银行卡号不能为空',
            },
            {
                field: bank_code,
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
    };
    sendCode = () => {
        const {code_btn_click, phone, bank_code, bank_no} = this.state;
        if (code_btn_click) {
            var checkData = [
                {
                    field: bank_no,
                    text: '银行卡号不能为空',
                },
                {
                    field: bank_code,
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
            this.timer();
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
    componentWillUnmount() {
        this.time && clearInterval(this.time);
    }
    jumpPage = () => {
        this.props.navigation.navigate('BankInfo');
    };
    onChangeBankNo = (value) => {
        this.setState({
            bank_no: (value + '')
                .replace(/\s/g, '')
                .replace(/\D/g, '')
                .replace(/(\d{4})(?=\d)/g, '$1 '),
        });
    };
    render() {
        const {verifyText, bank_no} = this.state;
        return (
            <View style={styles.con}>
                <ScrollView scrollEnabled={false} style={{paddingHorizontal: px(16)}}>
                    <BankCardModal
                        title="请选择银行卡"
                        style={{height: px(500)}}
                        ref={(ref) => (this.bankCard = ref)}
                    />
                    <FastImage
                        style={styles.pwd_img}
                        source={require('../../../assets/img/account/second.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <View style={styles.card}>
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
                            onChange={this.onChangeBankNo}
                        />
                        <View style={Style.flexRow}>
                            <Input
                                label="银行"
                                isUpdate={false}
                                placeholder="请选择您银行"
                                value={this.state.rname}
                                onClick={this._showBankCard}
                                inputStyle={{flex: 1}}
                                returnKeyType={'done'}
                            />
                            <FontAwesome name={'angle-right'} size={18} color={'#999999'} style={{marginLeft: -14}} />
                        </View>
                        <Input
                            label="手机号"
                            placeholder="请输入您的手机号"
                            keyboardType={'number-pad'}
                            maxLength={11}
                            onChange={(phone) => {
                                this.setState({phone});
                            }}
                        />
                        <View style={Style.flexRow}>
                            <Input
                                label="验证码"
                                placeholder="请输入验证码"
                                keyboardType={'number-pad'}
                                maxLength={6}
                                onChange={(phone) => {
                                    this.setState({phone});
                                }}
                                inputStyle={{flex: 1, borderBottomWidth: 0}}
                            />
                            <View style={[styles.border]}>
                                <TouchableOpacity onPress={this.sendCode}>
                                    <Text style={{color: Colors.btnColor}}>{verifyText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Agreements
                        onChange={(checked) => {
                            this.setState({checked});
                        }}
                    />
                </ScrollView>
                <FixedButton title={'立即开户'} onPress={this.confirm} />
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
        width: px(84),
        alignItems: 'flex-end',
        borderColor: Colors.borderColor,
    },
});
export default bankInfo;
