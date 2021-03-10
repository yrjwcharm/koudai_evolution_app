/*
 * @Date: 2021-02-18 14:54:52
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-10 12:28:23
 * @Description: 重设登录密码
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
import Toast from '../../components/Toast';

const ResetLoginPwd = ({navigation}) => {
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const btnClick = useRef(true);

    // 完成密码重设
    const submit = useCallback(() => {
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
                text: '新密码不能为空',
            },
        ];
        if (!formCheck(checkData)) {
            return false;
        } else {
            if (newPwd.length < 6) {
                Toast.show('请输入不少于6位新密码');
                return false;
            } else {
                btnClick.current = false;
                http.post('/passport/update_login_password/20210101', {
                    old: oldPwd,
                    new: newPwd,
                }).then((res) => {
                    btnClick.current = true;
                    if (res.code === '000000') {
                        Toast.show(res.message);
                        navigation.goBack();
                    } else {
                        Toast.show(res.message);
                    }
                });
            }
        }
    }, [oldPwd, newPwd, navigation]);
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
                placeholder={'请输入不少于6位新密码'}
                secureTextEntry={true}
                textContentType={'newPassword'}
                title={'新密码'}
                value={newPwd}
            />
            <Button disabled={!btnClick} onPress={submit} style={styles.btn} title={'完成密码重设'} />
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
