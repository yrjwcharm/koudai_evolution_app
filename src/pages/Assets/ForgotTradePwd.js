/*
 * @Date: 2021-02-18 14:54:52
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-10 14:27:22
 * @Description: 找回交易密码
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {formCheck} from '../../utils/validator';
import InputView from './components/input';
import {Button} from '../../components/Button';
import Toast from '../../components/Toast';

const ResetLoginPwd = ({navigation}) => {
    const [name, setName] = useState('');
    const [idCardNum, setIdCardNum] = useState('');
    const btnClick = useRef(true);

    // 下一步
    const submit = useCallback(() => {
        if (!btnClick.current) {
            return false;
        }
        const checkData = [
            {
                field: name,
                text: '姓名不能为空',
            },
            {
                field: idCardNum,
                text: '身份证号不能为空',
            },
        ];
        if (!formCheck(checkData)) {
            return false;
        } else {
            btnClick.current = false;
            http.post('/passport/reset_trade_password_prepare/20210101', {
                name,
                id_no: idCardNum,
            }).then((res) => {
                btnClick.current = true;
                if (res.code === '000000') {
                    Toast.show(res.message);
                    navigation.navigate({
                        name: 'ForgotTradePwdNext',
                        params: {msg: res.result.msg, name, id_no: idCardNum},
                    });
                } else {
                    Toast.show(res.message);
                }
            });
        }
    }, [name, idCardNum, navigation]);
    useEffect(() => {
        // if (name.length >= 6 && idCardNum.length >= 6) {
        //     setBtnClick(true);
        // } else {
        //     setBtnClick(false);
        // }
    }, [name, idCardNum]);
    return (
        <ScrollView style={styles.container}>
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'default'}
                maxLength={20}
                onChangeText={(pwd) => setName(pwd)}
                placeholder={'请输入您的姓名'}
                title={'姓名'}
                value={name}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'default'}
                maxLength={20}
                onChangeText={(pwd) => setIdCardNum(pwd)}
                placeholder={'请输入您的身份证号'}
                title={'身份证号'}
                value={idCardNum}
            />
            <Button disabled={!btnClick} onPress={submit} style={styles.btn} title={'下一步'} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    btn: {
        marginTop: text(28),
        marginHorizontal: text(20),
    },
    inputRightText: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.brandColor,
    },
});

export default ResetLoginPwd;
