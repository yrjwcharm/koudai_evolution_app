/*
 * @Date: 2021-02-23 16:31:24
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-30 14:34:55
 * @Description: 添加新银行卡/更换绑定银行卡
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {formCheck} from '../../utils/validator';
import InputView from './components/input';
import Agreements from '../../components/Agreements';
import {Button} from '../../components/Button';
import Toast from '../../components/Toast';
import {BankCardModal} from '../../components/Modal';
import {useSelector} from 'react-redux';

const AddBankCard = ({navigation, route}) => {
    const userInfo = useSelector((store) => store.userInfo);
    const [second, setSecond] = useState(0);
    const [codeText, setCodeText] = useState('发送验证码');
    const btnClick = useRef(true);
    const timerRef = useRef('');
    const [bankList, setBankList] = useState([]);
    const [cardNum, setCardNum] = useState('');
    const [bankName, setBankName] = useState('');
    const bankCode = useRef('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const subBtnClick = useRef(true);
    const bankModal = useRef(null);
    const [check, setCheck] = useState(true);

    const getCode = useCallback(() => {
        global.LogTool('click', 'getCode');
        if (!btnClick.current) {
            return false;
        }
        const checkData = [
            {
                field: cardNum,
                text: '银行卡号不能为空',
            },
            {
                field: bankCode.current,
                text: '请选择银行',
            },
            {
                field: phone,
                text: '银行预留手机号不能为空',
            },
        ];
        if (!formCheck(checkData)) {
            return false;
        } else if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phone)) {
            Toast.show('手机号不合法');
            return false;
        } else if (cardNum.replace(/ /g, '').length < 16) {
            Toast.show('银行卡号不能少于16位');
            return false;
        } else {
            btnClick.current = false;
            http.post('/passport/bank_card/bind_prepare/20210101', {
                bank_code: bankCode.current,
                bank_no: cardNum,
                mobile: phone,
            }).then((res) => {
                if (res.code === '000000') {
                    Toast.show(res.message);
                    timer();
                } else {
                    Toast.show(res.message);
                    btnClick.current = true;
                }
            });
        }
    }, [bankCode, cardNum, phone, timer]);
    const onSelectBank = (value) => {
        bankCode.current = value.bank_code;
        setBankName(value.bank_name);
    };
    const timer = useCallback(() => {
        setSecond(60);
        setCodeText('60秒后可重发');
        btnClick.current = false;
        timerRef.current = setInterval(() => {
            setSecond((prev) => {
                if (prev === 1) {
                    clearInterval(timerRef.current);
                    setCodeText('重新获取');
                    btnClick.current = true;
                    return prev;
                } else {
                    setCodeText(prev - 1 + '秒后可重发');
                    return prev - 1;
                }
            });
        }, 1000);
    }, []);
    // 完成添加银行卡
    const submit = useCallback(() => {
        global.LogTool('click', 'submit');
        if (!subBtnClick.current) {
            return false;
        }
        const checkData = [
            {
                field: cardNum,
                text: '银行卡号不能为空',
            },
            {
                field: bankName,
                text: '请选择银行',
            },
            {
                field: phone,
                text: '银行预留手机号不能为空',
            },
            {
                field: code,
                text: '验证码不能为空',
            },
            {
                field: check,
                text: '必须同意服务协议才能完成开户',
                append: '!',
            },
        ];
        if (!formCheck(checkData)) {
            return false;
        } else if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phone)) {
            Toast.show('手机号不合法');
            return false;
        } else if (cardNum.replace(/ /g, '').length < 16) {
            Toast.show('银行卡号不能少于16位');
            return false;
        } else {
            subBtnClick.current = false;
            http.post(
                '/passport/bank_card/bind/20210101',
                {
                    bank_code: bankCode.current,
                    bank_no: cardNum.replace(/ /g, ''),
                    mobile: phone,
                    code,
                },
                '正在提交数据...'
            ).then((res) => {
                subBtnClick.current = true;
                if (res.code === '000000') {
                    Toast.show(res.message);
                    navigation.goBack();
                } else {
                    Toast.show(res.message);
                }
            });
        }
    }, [bankName, cardNum, check, code, phone, navigation]);

    useEffect(() => {
        http.get('/passport/bank_list/20210101', {
            channel: userInfo.toJS().po_ver === 0 ? 'ym' : 'xy',
        }).then((res) => {
            if (res.code === '000000') {
                setBankList(res.result);
            }
        });
    }, [userInfo]);
    useEffect(() => {
        if (route.params?.action === 'add') {
            navigation.setOptions({title: '添加新银行卡'});
        } else {
            navigation.setOptions({title: '更换绑定银行卡'});
        }
        return () => {
            clearInterval(timerRef.current);
        };
    }, [navigation, route]);
    return (
        <ScrollView style={styles.container}>
            <BankCardModal
                data={bankList}
                onDone={onSelectBank}
                ref={bankModal}
                style={{height: text(500)}}
                title={'请选择银行'}
                type={'hidden'}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'number-pad'}
                maxLength={23}
                onChangeText={(value) =>
                    setCardNum(
                        value
                            .replace(/\s/g, '')
                            .replace(/\D/g, '')
                            .replace(/(\d{4})(?=\d)/g, '$1 ')
                    )
                }
                placeholder={'请输入您的银行卡号'}
                style={styles.input}
                title={'银行卡号'}
                value={cardNum}
            />
            <InputView
                clearButtonMode={'while-editing'}
                editable={false}
                onPress={() => {
                    global.LogTool('click', 'chooseBank');
                    bankModal.current.show();
                }}
                placeholder={'请选择银行'}
                style={styles.input}
                textContentType={'newPassword'}
                title={'银行名称'}
                value={bankName}>
                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
            </InputView>
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'phone-pad'}
                maxLength={11}
                onChangeText={(value) => setPhone(value.replace(/\D/g, ''))}
                placeholder={'请输入您的银行预留手机号'}
                style={styles.input}
                title={'手机号'}
                value={phone}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'number-pad'}
                maxLength={6}
                onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
                placeholder={'请输入验证码'}
                style={styles.input}
                textContentType={'telephoneNumber'}
                title={'验证码'}
                value={code}>
                <Text style={styles.inputRightText} onPress={getCode}>
                    {codeText}
                </Text>
            </InputView>
            <View style={{paddingTop: Space.padding, paddingHorizontal: Space.padding}}>
                <Agreements onChange={(checked) => setCheck(checked)} data={[{title: '《委托支付协议》', id: 15}]} />
            </View>
            <Button onPress={submit} style={styles.btn} title={'添加新银行卡'} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    input: {
        marginTop: text(12),
        paddingHorizontal: Space.padding,
    },
    inputRightText: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.brandColor,
    },
    btn: {
        marginTop: text(28),
        marginHorizontal: text(20),
    },
});

export default AddBankCard;
