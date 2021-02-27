/*
 * @Date: 2021-02-23 16:31:24
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-23 19:00:47
 * @Description: 找回交易密码
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {formCheck} from '../../utils/validator';
import InputView from './components/input';
import {Button} from '../../components/Button';

const ForgotTradePwd = ({navigation}) => {
    const [second, setSecond] = useState(59);
    const [codeText, setCodeText] = useState('60秒后可重发');
    const [btnClick, setBtnClick] = useState(true);
    const timerRef = useRef('');
    const [code, setCode] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    const getCode = useCallback(() => {
        if (btnClick) {
            setSecond(59);
            setCodeText('60秒后可重发');
            timer();
        }
    }, [btnClick, timer]);
    const timer = useCallback(() => {
        timerRef.current = setInterval(() => {
            setSecond((prev) => prev - 1);
            setCodeText(second + '秒后可重发');
            setBtnClick(false);
            if (second <= 0) {
                clearInterval(timerRef.current);
                setCodeText('重新获取');
                setBtnClick(true);
            }
        }, 1000);
    }, [second, timerRef]);
    // 完成找回密码
    const submit = useCallback(() => {
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
        }
    }, [code, newPwd, confirmPwd]);

    useEffect(() => {
        timer();
        return () => {
            clearInterval(timerRef.current);
        };
    }, [timer, timerRef]);
    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.desc, {paddingTop: text(22), paddingLeft: Space.padding}]}>
                {'已向您的注册手机号138****8888发送验证码'}
            </Text>
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'phone-pad'}
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
                keyboardType={'phone-pad'}
                maxLength={6}
                onChangeText={(value) => setNewPwd(value.replace(/\D/g, ''))}
                placeholder={'请输入新的6位数字交易密码'}
                secureTextEntry={true}
                style={styles.input}
                textContentType={'telephoneNumber'}
                title={'新密码'}
                value={newPwd}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'phone-pad'}
                maxLength={6}
                onChangeText={(value) => setConfirmPwd(value.replace(/\D/g, ''))}
                placeholder={'请确认新的交易密码'}
                secureTextEntry={true}
                style={styles.input}
                textContentType={'telephoneNumber'}
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

export default ForgotTradePwd;
