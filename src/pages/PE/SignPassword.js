/*
 * @Date: 2022-06-06 16:18:56
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-06 16:54:23
 * @Description: 设置签署密码
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import http from '../../services';
import {px} from '../../utils/appUtil';
import {debounce} from 'lodash';
import Toast from '../../components/Toast';

const SignPassword = ({navigation, route}) => {
    const {button = {}, old_password, password, re_password, tip, title} = route.params;
    const [oldPwd, setOldPwd] = useState('');
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const inputArr = useRef([]);

    const onSubmit = useCallback(
        debounce(
            () => {
                const toast = Toast.showLoading('设置中');
                http.post('/private_fund/set_sign_password/20220510', {
                    old_password: oldPwd,
                    password: pwd,
                    re_password: confirmPwd,
                }).then((res) => {
                    Toast.hide(toast);
                    if (res.code === '000000') {
                        navigation.goBack();
                        res.result.message && Toast.show(res.result.message);
                    } else {
                        Toast.show(res.message);
                    }
                });
            },
            1000,
            {leading: true, trailing: false}
        ),
        [confirmPwd, oldPwd, pwd]
    );

    useEffect(() => {
        navigation.setOptions({title: title || '设置签署密码'});
        let input;
        if (old_password) {
            input = inputArr.current[0];
        } else if (password) {
            input = inputArr.current[1];
        }
        const isFocused = input?.isFocused?.();
        if (!isFocused) {
            setTimeout(() => {
                input?.focus?.();
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[styles.tips, {marginTop: px(4)}]}>{tip}</Text>
            {old_password ? (
                <View style={[Style.flexRow, styles.inputBox, {marginTop: Space.marginVertical}]}>
                    <View style={styles.divider} />
                    <Text style={styles.inputLabel}>{old_password.name}</Text>
                    <TextInput
                        keyboardType="number-pad"
                        maxLength={6}
                        onChangeText={(val) => setOldPwd(val.replace(/\D/g, ''))}
                        placeholder={old_password.placeholder}
                        placeholderTextColor={'#BDC2CC'}
                        ref={(ref) => (inputArr.current[0] = ref)}
                        secureTextEntry={true}
                        style={styles.inputStyle}
                        textContentType={'password'}
                        value={oldPwd}
                    />
                </View>
            ) : null}
            {password ? (
                <View style={[Style.flexRow, styles.inputBox, !old_password ? {marginTop: Space.marginVertical} : {}]}>
                    <View style={styles.divider} />
                    <Text style={styles.inputLabel}>{password.name}</Text>
                    <TextInput
                        keyboardType="number-pad"
                        maxLength={6}
                        onChangeText={(val) => setPwd(val.replace(/\D/g, ''))}
                        placeholder={password.placeholder}
                        placeholderTextColor={'#BDC2CC'}
                        ref={(ref) => (inputArr.current[1] = ref)}
                        secureTextEntry={true}
                        style={styles.inputStyle}
                        textContentType={'password'}
                        value={pwd}
                    />
                </View>
            ) : null}
            {re_password ? (
                <View style={[Style.flexRow, styles.inputBox]}>
                    <View style={styles.divider} />
                    <Text style={styles.inputLabel}>{re_password.name}</Text>
                    <TextInput
                        keyboardType="number-pad"
                        maxLength={6}
                        onChangeText={(val) => setConfirmPwd(val.replace(/\D/g, ''))}
                        placeholder={re_password.placeholder}
                        placeholderTextColor={'#BDC2CC'}
                        secureTextEntry={true}
                        style={styles.inputStyle}
                        textContentType={'password'}
                        value={confirmPwd}
                    />
                </View>
            ) : null}
            {button.text ? (
                <Button
                    color="#EDDBC5"
                    disabled={
                        !(password && pwd.length === 6 && ((re_password && confirmPwd.length === 6) || !re_password))
                    }
                    disabledColor="#EDDBC5"
                    onPress={onSubmit}
                    style={styles.button}
                    title={button.text}
                />
            ) : null}
        </View>
    );
};

export default SignPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
    },
    tips: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
    button: {
        backgroundColor: '#D7AF74',
        marginTop: px(40),
    },
    inputBox: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: px(50),
    },
    inputLabel: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.descColor,
        minWidth: px(64),
    },
    inputStyle: {
        marginLeft: Space.marginAlign,
        paddingTop: px(4),
        paddingLeft: px(12),
        height: '100%',
        flex: 1,
        flexShrink: 1,
        fontSize: Font.textH1,
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    divider: {
        width: px(1),
        height: px(12),
        backgroundColor: Colors.descColor,
        position: 'absolute',
        top: px(19),
        left: px(95),
    },
});
