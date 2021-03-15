/*
 * @Date: 2021-02-23 16:31:24
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-12 15:59:40
 * @Description: 找回交易密码下一步
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

const ForgotTradePwdNext = ({navigation, route}) => {
    const [msg] = useState(route.params?.msg);
    const [second, setSecond] = useState(0);
    const [codeText, setCodeText] = useState('60秒后可重发');
    const btnClick = useRef(true);
    const timerRef = useRef('');
    const [code, setCode] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const subBtnClick = useRef(true);

    const getCode = useCallback(() => {
        if (btnClick.current) {
            btnClick.current = false;
            http.post('/passport/reset_trade_password_prepare/20210101', {
                name: route.params?.name,
                id_no: route.params?.id_no,
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
    }, [btnClick, timer, route]);
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
    // 完成找回密码
    const submit = useCallback(() => {
        if (!subBtnClick.current) {
            return false;
        }
        const checkData = [
            {
                field: code,
                text: '验证码不能为空',
            },
            {
                field: newPwd,
                text: '新密码不能为空',
            },
            {
                field: confirmPwd,
                text: '确认密码不能为空',
            },
        ];
        if (!formCheck(checkData)) {
            return false;
        } else {
            subBtnClick.current = false;
            http.post('/passport/reset_trade_password/20210101', {
                code,
                new_password: newPwd,
                con_new_password: confirmPwd,
            }).then((res) => {
                subBtnClick.current = true;
                if (res.code === '000000') {
                    Toast.show(res.message);
                    navigation.pop(2);
                } else {
                    Toast.show(res.message);
                }
            });
        }
    }, [code, newPwd, confirmPwd, navigation]);

    useEffect(() => {
        timer();
        return () => {
            clearInterval(timerRef.current);
        };
    }, [timer, timerRef]);
    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.desc, {paddingTop: text(22), paddingLeft: Space.padding}]}>{msg}</Text>
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
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'number-pad'}
                maxLength={6}
                onChangeText={(value) => setNewPwd(value.replace(/\D/g, ''))}
                placeholder={'请输入新的6位数字交易密码'}
                secureTextEntry={true}
                style={styles.input}
                textContentType={'password'}
                title={'新密码'}
                value={newPwd}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'number-pad'}
                maxLength={6}
                onChangeText={(value) => setConfirmPwd(value.replace(/\D/g, ''))}
                placeholder={'请确认新的交易密码'}
                secureTextEntry={true}
                style={styles.input}
                textContentType={'newPassword'}
                title={'确认密码'}
                value={confirmPwd}
            />
            <Button onPress={submit} style={styles.btn} title={'确认'} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
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

export default ForgotTradePwdNext;
