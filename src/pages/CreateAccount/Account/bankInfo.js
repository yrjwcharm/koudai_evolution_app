/*
 * @Date: 2021-01-18 10:27:05
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 15:59:10
 * @Description:银行卡信息
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { px } from '../../../utils/appUtil';
import { Style, Colors } from '../../../common/commonStyle';
import Input from '../../../components/Input';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FixedButton } from '../../../components/Button';
import Agreements from '../../../components/Agreements';
import { BankCardModal } from '../../../components/Modal'
export class bankInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '', //手机号
            code: '', //验证码
            bank_no: '', //银行代码
            card_no: '', //银行卡号
            btnClick: true,//开户按钮是否能点击
            verifyText: '获取验证码',
            second: 60,
            code_btn_click: true, //验证码按钮
        };
    }

    sendCode = () => {
        const { code_btn_click } = this.state;
        if (code_btn_click) {
            this.timer();
        }
    };
    time = null;
    //倒计时函数
    timer = () => {
        let { second } = this.state;
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
        this.bankCard.show()
    }
    componentWillUnmount() {
        this.time && clearInterval(this.time);
    }
    jumpPage = () => {
        this.props.navigation.navigate('BankInfo');
    };
    render() {
        const { verifyText } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ScrollView scrollEnabled={false} style={{ padding: px(16) }}>
                    <BankCardModal title="请选择银行卡" style={{ height: px(500) }} ref={(ref) => this.bankCard = ref} />
                    <FastImage
                        style={styles.pwd_img}
                        source={require('../../../assets/img/account/second.png')}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <View style={styles.card}>
                        <View style={styles.card_header}>
                            <Image
                                source={require('../../../assets/img/account/cardMes.png')}
                                style={{ width: px(22), resizeMode: 'contain' }}
                            />
                            <Text style={styles.card_head_text}>银行卡信息</Text>
                        </View>
                        <Input
                            label="银行卡号"
                            placeholder="请输入您的银行卡号"
                            keyboardType={'number-pad'}
                            onChange={(card_no) => {
                                var str = '';
                                //输入数字长度大于输入框内长度，每4个就一个空格
                                if (card_no.length > this.state.card_no.length) {
                                    var reg = /\s/g;//加入正则，过滤掉字符串中的空格
                                    card_no.replace(reg, "").split('').map(function (item, index) {
                                        (index + 1) % 4 == 0 ? str = str + item + ' ' : str += item;
                                    })
                                    console.log(str)
                                    this.setState({
                                        card_no: str
                                    })
                                    return str;
                                } else {
                                    // 通过这样判断回删才会正常，不然会一直卡在空格位置
                                    this.setState({
                                        card_no: card_no
                                    })
                                }
                            }}
                        />
                        <View style={Style.flexRow}>
                            <Input
                                label="银行"
                                isUpdate={false}
                                placeholder="请选择您银行"
                                value={this.state.rname}
                                onClick={this._showBankCard}
                                inputStyle={{ flex: 1 }}
                                returnKeyType={'done'}
                            />
                            <FontAwesome name={'angle-right'} size={18} color={'#999999'} style={{ marginLeft: -14 }} />
                        </View>
                        <Input
                            label="手机号"
                            placeholder="请输入您的手机号"
                            keyboardType={'number-pad'}
                            onChange={(phone) => {
                                this.setState({ phone });
                            }}
                        />
                        <View style={Style.flexRow}>
                            <Input
                                label="验证码"
                                placeholder="请输入验证码"
                                keyboardType={'number-pad'}
                                onChange={(phone) => {
                                    this.setState({ phone });
                                }}
                                inputStyle={{ flex: 1, borderBottomWidth: 0 }}
                            />
                            <View style={[styles.border]}>
                                <TouchableOpacity onPress={this.sendCode}><Text style={{ color: Colors.btnColor }}>{verifyText}</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Agreements />

                </ScrollView>
                <FixedButton title={'立即开户'} onPress={this.jumpPage} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    pwd_img: {
        width: '100%',
        height: px(55),
    },
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        borderRadius: px(8),
        marginBottom: px(12),
        marginTop: px(24),
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
        borderColor: Colors.borderColor
    },
});
export default bankInfo;
