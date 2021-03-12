/*
 * @Date: 2021-02-23 16:31:24
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-11 21:06:14
 * @Description: 添加新银行卡/更换绑定银行卡
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {formCheck} from '../../utils/validator';
import InputView from './components/input';
import {Button} from '../../components/Button';
import Toast from '../../components/Toast';
import {BankCardModal} from '../../components/Modal';
import {useSelector} from 'react-redux';

const AddBankCard = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
    const userInfo = useSelector((store) => store.userInfo);
    const [second, setSecond] = useState(60);
    const [codeText, setCodeText] = useState('');
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

    const getCode = useCallback(() => {
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
        } else {
            btnClick.current = false;
            http.post('http://kapi-web.wanggang.mofanglicai.com.cn:10080/passport/bank_card/bind_prepare/20210101', {
                bank_code: bankCode.current,
                bank_no: cardNum,
                mobile: phone,
            }).then((res) => {
                if (res.code === '000000') {
                    Toast.show(res.message);
                    setCodeText('60秒后可重发');
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
        timerRef.current = setInterval(() => {
            setSecond((prev) => prev - 1);
        }, 1000);
    }, []);
    // 完成找回密码
    const submit = useCallback(() => {
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
        ];
        if (!formCheck(checkData)) {
            return false;
        } else {
            subBtnClick.current = false;
            http.post('/passport/bank_card/bind/20210101', {
                bank_code: bankCode.current,
                bank_no: cardNum,
                mobile: phone,
                code,
            }).then((res) => {
                subBtnClick.current = true;
                if (res.code === '000000') {
                    Toast.show(res.message);
                    navigation.goBack();
                } else {
                    Toast.show(res.message);
                }
            });
        }
    }, [bankName, cardNum, code, phone, navigation]);

    useEffect(() => {
        http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/passport/bank_list/20210101', {
            channel: userInfo.toJS().po_ver === 0 ? 'ym' : 'xy',
        }).then((res) => {
            if (res.code === '000000') {
                setBankList(res.result);
            }
        });
    }, [userInfo]);
    useEffect(() => {
        setCodeText(second + '秒后可重发');
        if (second <= 0) {
            clearInterval(timerRef.current);
            btnClick.current = true;
            setSecond(60);
        } else if (second === 60) {
            if (timerRef.current) {
                setCodeText('重新获取');
            } else {
                setCodeText('发送验证码');
            }
        }
    }, [second]);
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
                style={{height: text(500), paddingBottom: insets.bottom}}
                title={'请选择银行'}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'number-pad'}
                onChangeText={(value) => setCardNum(value.replace(/\D/g, ''))}
                placeholder={'请输入您的银行卡号'}
                style={styles.input}
                title={'银行卡号'}
                value={cardNum}
            />
            <InputView
                clearButtonMode={'while-editing'}
                editable={false}
                onPress={() => bankModal.current.show()}
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
