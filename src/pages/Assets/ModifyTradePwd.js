/*
 * @Date: 2021-02-18 14:54:52
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-04 10:02:17
 * @Description: 修改交易密码
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {formCheck} from '../../utils/validator';
import InputView from './components/input';
import {Button} from '../../components/Button';

const ModifyTradePwd = ({navigation}) => {
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [btnClick, setBtnClick] = useState(true);

    // 完成密码修改
    const submit = useCallback(() => {
        const checkData = [
            {
                field: oldPwd,
                text: '当前交易密码不能为空',
            },
            {
                field: newPwd,
                text: '新交易密码不能为空',
            },
            {
                field: confirmPwd,
                text: '确认密码不能为空',
            },
        ];
        if (!formCheck(checkData)) {
            return false;
        }
    }, [oldPwd, newPwd, confirmPwd]);
    useEffect(() => {
        // if (oldPwd.length >= 6 && newPwd.length >= 6 && confirmPwd.length >= 6) {
        //     setBtnClick(true);
        // } else {
        //     setBtnClick(false);
        // }
    }, [oldPwd, newPwd, confirmPwd]);
    return (
        <ScrollView style={styles.container}>
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'numeric'}
                maxLength={6}
                onChangeText={(pwd) => setOldPwd(pwd.replace(/\D/g, ''))}
                placeholder={'请输入当前交易密码'}
                secureTextEntry={true}
                textContentType={'password'}
                title={'当前密码'}
                value={oldPwd}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'numeric'}
                maxLength={6}
                onChangeText={(pwd) => setNewPwd(pwd.replace(/\D/g, ''))}
                placeholder={'请输入新的6位数字交易密码'}
                secureTextEntry={true}
                textContentType={'password'}
                title={'新的密码'}
                value={newPwd}
            />
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'numeric'}
                maxLength={6}
                onChangeText={(pwd) => setConfirmPwd(pwd.replace(/\D/g, ''))}
                placeholder={'确认新的交易密码'}
                secureTextEntry={true}
                textContentType={'password'}
                title={'确认密码'}
                value={confirmPwd}
            />
            <Button disabled={!btnClick} onPress={submit} style={styles.btn} title={'确定'} />
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

export default ModifyTradePwd;
