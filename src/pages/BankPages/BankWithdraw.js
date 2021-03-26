/*
 * @Author: xjh
 * @Date: 2021-02-27 16:12:22
 * @Description:银行产品提现
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-26 19:41:54
 */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Toast from '../../components/Toast/';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import {FixedButton} from '../../components/Button';
import {PasswordModal} from '../../components/Password';
import {Modal, BottomModal, VerifyCodeModal} from '../../components/Modal';
var verify_method, msg_seq, code;
export default function BankWithdraw({navigation, route}) {
    const [data, setData] = useState({});
    const passwordModal = useRef(null);
    const verifyCodeModel = useRef(null);
    const [amount, setAmount] = useState('');
    const [enable, setEnable] = useState(false);
    const [tips, setTips] = useState('');
    const passwordInput = () => {
        passwordModal.current.show();
    };
    useEffect(() => {
        Http.get('trade/bank/withdraw/info/20210101', {
            bank_code: route.params.bank_code,
        }).then((res) => {
            setData(res.result);
            verify_method = res.result.verify_method;
            // setAmount(res.result.withdraw_info.min.toString());
        });
    }, []);

    const showPop = () => {
        // 验证码方式
        if (verify_method == 1) {
            verifyCodeModel.current.show();
        } else {
            //交易密码方式
            passwordModal.current.show();
        }
    };
    // 数据提交 verify_method. 0 交易密码 1验证码
    const submitData = (password) => {
        const pay_method = data.pay_info.pay_method;
        Http.post('/trade/bank/withdraw/do/20210101', {
            bank_code: route.params.bank_code,
            poid: data.poid,
            amount,
            password,
            pay_method: pay_method.pay_method,
            msg_seq: msg_seq,
            verify_code: code,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.navigate('TradeProcessing', res.result);
            } else {
                Toast.show(res.message);
            }
        });
    };
    const onChangeText = useCallback((value) => {
        console.log(value);
        code = value;
        if (value.length === 6) {
            Http.post(
                '/trade/bank/send/verify_code/20210101',
                {
                    bank_code: route.params.bank_code,
                    amount,
                    from: 'withdraw',
                }.then((res) => {
                    msg_seq = res.msg_seq;
                    verifyCodeModel.current.hide();
                    setTimeout(() => {
                        passwordModal.current.show();
                    }, 300);
                })
            );
        }
    }, []);
    const onInput = (amount) => {
        if (amount >= data.bank_account.balance.val) {
            setTips(`最大可取出额为${data.bank_account.balance.val}`);
            setAmount(data.bank_account.balance.val.toString());
            setEnable(false);
        } else {
            setTips('');
            setAmount(amount.toString());
            setEnable(true);
        }
    };

    return (
        <>
            {Object.keys(data).length > 0 && (
                <View style={{flex: 1}}>
                    <View style={{position: 'relative', margin: text(16)}}>
                        <FastImage
                            style={styles.bank_bg_sty}
                            source={{
                                uri: data.bank_account.bank_icon,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.bank_name_sty}>{data.bank_account.bank_name}</Text>
                        <View style={styles.bank_fund_wrap_sty}>
                            <Text style={{color: '#fff', fontWeight: 'bold'}}>{data.bank_account.balance.key}</Text>
                            <Text style={styles.bank_fund_sty}>{data.bank_account.balance.val}</Text>
                        </View>
                    </View>
                    <View style={styles.card_sty}>
                        <Text style={styles.title_sty}>{data.withdraw_info.title}</Text>
                        <View style={[Style.flexRow, {alignItems: 'center', marginTop: text(18)}]}>
                            <Text style={{fontSize: text(24)}}>¥</Text>
                            <TextInput
                                keyboardType="numeric"
                                value={amount}
                                style={[
                                    styles.num_sty,
                                    {
                                        fontFamily: amount.toString().length > 0 ? Font.numFontFamily : null,
                                        fontSize: amount.toString().length > 0 ? text(35) : text(26),
                                    },
                                ]}
                                placeholderTextColor={'#CCD0DB'}
                                placeholder={'请输入提现金额'}
                                onChangeText={(value) => onInput(value)}
                            />
                        </View>
                    </View>
                    {tips ? <Text style={{color: Colors.red}}>{tips}</Text> : null}
                    <Text style={[{padding: text(15)}, Style.descSty]}>{data.pay_info.title}</Text>
                    <View style={[Style.flexRow, styles.card_item, styles.card_select]}>
                        <View style={Style.flexRow}>
                            <FastImage
                                style={{width: text(30), height: text(30)}}
                                source={{
                                    uri: data.pay_info.pay_method.bank_icon,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <View>
                                <Text
                                    style={{
                                        color: Colors.defaultColor,
                                        paddingLeft: text(10),
                                        fontWeight: 'bold',
                                        fontSize: text(14),
                                    }}>
                                    {data.pay_info.pay_method.bank_name}
                                </Text>
                                <Text
                                    style={{
                                        color: '#9095A5',
                                        paddingLeft: text(10),
                                        fontSize: text(12),
                                        marginTop: text(4),
                                    }}>
                                    {data.pay_info.pay_method.limit_desc}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.tips_sty}>{data.notice}</Text>
                    <PasswordModal ref={passwordModal} onDone={submitData} />
                    <VerifyCodeModal ref={verifyCodeModel} onChangeText={onChangeText} />
                    <FixedButton
                        title={data.button.text}
                        onPress={showPop}
                        disabled={data.button?.avail == 0 || !enable}
                    />
                    <VerifyCodeModal ref={verifyCodeModel} mobile={'12321'} />
                </View>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    bank_bg_sty: {
        height: text(150),
    },
    bank_name_sty: {
        position: 'absolute',
        top: '22%',
        left: '20%',
        fontSize: Font.textH1,
        color: '#fff',
        fontWeight: 'bold',
    },
    bank_fund_wrap_sty: {
        position: 'absolute',
        top: '50%',
        left: text(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    bank_fund_sty: {
        color: '#fff',
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
        marginLeft: text(5),
    },
    card_sty: {
        backgroundColor: '#fff',
        padding: text(16),
        marginTop: text(-50),
    },
    title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
    },
    num_sty: {
        color: '#333333',
        fontSize: text(35),
        marginLeft: text(5),
        flex: 1,
        padding: 0,
    },
    card_select: {
        backgroundColor: '#fff',
        paddingLeft: text(15),
        paddingRight: text(10),
    },
    card_item: {
        paddingVertical: text(16),
    },
    tips_sty: {
        color: '#9095A5',
        fontSize: Font.textH3,
        marginHorizontal: text(16),
        paddingTop: text(12),
    },
});
