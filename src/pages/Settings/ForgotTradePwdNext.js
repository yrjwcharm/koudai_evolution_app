/*
 * @Date: 2021-02-23 16:31:24
 * @Description: 找回交易密码下一步
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {px as text} from '~/utils/appUtil.js';
import {Colors, Font, Space} from '~/common/commonStyle';
import http from '~/services';
import {formCheck} from '~/utils/validator';
import InputView from '../Assets/components/input';
import {Button} from '~/components/Button';
import {useCountdown} from '~/components/hooks';
import Toast from '~/components/Toast';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '~/redux/actions/userInfo';

const ForgotTradePwdNext = ({navigation, route}) => {
    const dispatch = useDispatch();
    const [msg] = useState(route.params?.msg);
    const [codeText, setCodeText] = useState('60秒后可重发');
    const {countdown, start} = useCountdown(() => {
        setCodeText('重新获取');
        btnClick.current = true;
    });
    const btnClick = useRef(true);
    const [code, setCode] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const subBtnClick = useRef(true);

    const getCode = useCallback(() => {
        if (btnClick.current) {
            global.LogTool('click', 'getCode');
            btnClick.current = false;
            http.post('/passport/reset_trade_password_prepare/20210101', {
                name: route.params?.name,
                id_no: route.params?.id_no,
            }).then((res) => {
                if (res.code === '000000') {
                    Toast.show(res.message);
                    start();
                } else {
                    Toast.show(res.message);
                    btnClick.current = true;
                }
            });
        }
    }, []);
    // 完成找回密码
    const submit = useCallback(() => {
        global.LogTool('click', 'submit');
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
        } else if (newPwd !== confirmPwd) {
            Toast.show('两次输入的密码不一致');
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
                    global.LogTool('submit', 'success');
                    dispatch(getUserInfo());
                    Toast.show(res.message);
                    navigation.pop(2);
                } else {
                    Toast.show(res.message);
                }
            });
        }
    }, [code, dispatch, newPwd, confirmPwd, navigation]);

    useEffect(() => {
        btnClick.current = false;
        start();
    }, []);
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
                    {countdown > 0 ? `${countdown}秒后可重发` : codeText}
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
            <Button
                disabled={newPwd.length < 6 || confirmPwd.length < 6}
                onPress={submit}
                style={styles.btn}
                title={'确认'}
            />
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
