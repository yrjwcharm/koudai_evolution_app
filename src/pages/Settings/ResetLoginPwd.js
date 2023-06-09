/*
 * @Date: 2021-02-18 14:54:52
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-17 15:05:47
 * @Description: 重设登录密码
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font} from '../../common/commonStyle';
import http from '../../services/index.js';
import {formCheck} from '../../utils/validator';
import InputView from '../Assets/components/input';
import {Button} from '../../components/Button';
import Toast from '../../components/Toast';

const ResetLoginPwd = ({navigation}) => {
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const btnClick = useRef(true);

    // 完成密码重设
    const submit = useCallback(() => {
        global.LogTool('click', 'submit');
        if (!btnClick.current) {
            return false;
        }
        const checkData = [
            {
                field: oldPwd,
                text: '旧密码不能为空',
            },
            {
                field: newPwd,
                text: '请输入新密码',
            },
            {
                field: confirmPwd,
                text: '请确认新密码',
            },
        ];
        if (!formCheck(checkData)) {
            return false;
        } else {
            if (oldPwd.length < 6) {
                Toast.show('旧密码错误');
                return false;
            }
            const reg = /(?!\d+$)(?![a-zA-Z]+$)(?![_!"#$%&'()*+,-./:;<=>?@[\]^`{|}~\\]+$).{8,20}/;
            if (newPwd.length < 8 || newPwd.length > 20) {
                Toast.show('密码必须8-20位');
                return false;
            } else if (!reg.test(newPwd)) {
                Toast.show('密码必须包含数字、英文和符号至少两项');
                return false;
            }
            const leftChar = newPwd
                .replace(/\d/g, '')
                .replace(/[a-zA-Z]/g, '')
                .replace(/[_!"#$%&'()*+,-./:;<=>?@[\]^`{|}~\\]/g, '');
            if (leftChar) {
                Toast.show('密码含有无效字符');
                return false;
            }
            if (newPwd !== confirmPwd) {
                Toast.show('输入的新密码不一致');
                return false;
            } else {
                btnClick.current = false;
                http.post('/passport/update_login_password/20210101', {
                    old: oldPwd,
                    new: newPwd,
                }).then((res) => {
                    btnClick.current = true;
                    if (res.code === '000000') {
                        global.LogTool('submit', 'success');
                        Toast.show(res.message);
                        navigation.goBack();
                    } else {
                        Toast.show(res.message);
                    }
                });
            }
        }
    }, [oldPwd, newPwd, confirmPwd, navigation]);
    useEffect(() => {
        // if (oldPwd.length >= 6 && newPwd.length >= 6) {
        //     setBtnClick(true);
        // } else {
        //     setBtnClick(false);
        // }
    }, [oldPwd, newPwd]);
    return (
        <ScrollView style={styles.container}>
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'ascii-capable'}
                maxLength={20}
                onChangeText={(pwd) => setOldPwd(pwd)}
                placeholder={'请输入旧的登录密码'}
                secureTextEntry={true}
                textContentType={'password'}
                title={'旧密码'}
                value={oldPwd}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'ascii-capable'}
                maxLength={20}
                onChangeText={(pwd) => setNewPwd(pwd)}
                placeholder={'8-20位数字、英文或符号'}
                // placeholderTextSize={Font.textH3}
                secureTextEntry={true}
                textContentType={'newPassword'}
                title={'新密码'}
                value={newPwd}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'ascii-capable'}
                maxLength={20}
                onChangeText={(pwd) => setConfirmPwd(pwd)}
                placeholder={'请输入相同的新密码'}
                secureTextEntry={true}
                textContentType={'newPassword'}
                title={'确认密码'}
                value={confirmPwd}
            />
            <Button disabled={!btnClick.current} onPress={submit} style={styles.btn} title={'完成密码重设'} />
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
