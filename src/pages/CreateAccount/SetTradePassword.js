/*
 * @Description:设置交易密码
 * @Autor: xjh
 * @Date: 2021-01-15 11:12:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-16 10:47:33
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView} from 'react-native';
import {px as text, px} from '../../utils/appUtil';
import {Space, Style, Colors, Font} from '../../common/commonStyle';
import Toast from '../../components/Toast';
import FastImage from 'react-native-fast-image';
import Http from '../../services';
import {Modal} from '../../components/Modal';
import {useJump} from '../../components/hooks';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
import BottomDesc from '../../components/BottomDesc';

const SetTradePassword = ({navigation, route}) => {
    const dispatch = useDispatch();
    const jump = useJump();
    const [password, setPassword] = useState('');
    const [pwdFisrt, setPwdFisrt] = useState('');
    const [pwdMsg, setPwdMsg] = useState('设置6位数字交易密码');
    const textInput = useRef(null);

    const handelReset = () => {
        setPwdFisrt('');
        setPassword('');
        setPwdMsg('设置6位数字交易密码');
    };
    const onTouchInput = () => {
        const isFocused = textInput.current.isFocused();
        if (!isFocused) {
            textInput.current.focus();
        }
    };
    const render_box = useCallback(() => {
        const passarr = new Array(6);
        const box = [];
        Array.from(passarr).map((item, index) =>
            box.push(
                <TouchableOpacity key={index} activeOpacity={1} onPress={onTouchInput} style={styles.box}>
                    {password[index] ? <View style={styles.circle} /> : <Text />}
                </TouchableOpacity>
            )
        );
        return <View style={styles.box_con}>{box}</View>;
    }, [password]);

    useEffect(() => {
        const reg = /^[0-9]*$/;
        if (password.length === 6) {
            if (!reg.test(password)) {
                Toast.show('交易密码只能为6位数字');
            } else {
                if (pwdFisrt !== '') {
                    if (pwdFisrt === password) {
                        Http.post('/passport/set_trade_password/20210101', {
                            password: password,
                            poid: route?.params?.poid || '',
                            fr: route?.params?.fr,
                            fund_code: route?.params?.fund_code,
                            amount: route?.params?.amount,
                            append: route?.params?.append,
                        }).then((data) => {
                            if (data.code === '000000') {
                                dispatch(getUserInfo());
                                textInput.current.blur();
                                if (route.params?.action === 'modify_phone') {
                                    Modal.show({
                                        confirmCallBack: () => jump(route.params?.url, 'replace'),
                                        confirmText: '立即跳转',
                                        content: '交易密码设置成功，即将跳转至修改预留手机号页面',
                                        isTouchMaskToClose: false,
                                    });
                                    return false;
                                } else if (route.params?.fr === 'add_bank_card') {
                                    Modal.show({
                                        confirmCallBack: () => jump(route.params?.url, 'replace'),
                                        confirmText: '立即跳转',
                                        content: '交易密码设置成功，即将跳转至添加银行卡页面',
                                        isTouchMaskToClose: false,
                                    });
                                    return false;
                                } else if (
                                    route.params?.action === 'unbind' ||
                                    route.params?.fr === 'wallet' ||
                                    route.params?.action === 'firstSet' ||
                                    route.params?.fr === 'TradePwdManagement'
                                ) {
                                    Toast.show(data.message);
                                    setTimeout(() => {
                                        navigation.goBack();
                                    }, 1000);
                                    return false;
                                }
                                Toast.show('设置密码成功，即将跳转');
                                setTimeout(() => {
                                    if (data.result?.jump_url?.path) {
                                        jump(
                                            data.result.jump_url,
                                            ['Product'].includes(data.result?.jump_url?.path) ? 'navigate' : 'replace'
                                        );
                                    } else {
                                        navigation.goBack();
                                    }
                                }, 1000);
                            } else {
                                Toast.show(data.message);
                            }
                        });
                    } else {
                        Toast.show('两次设置的交易密码不一致');
                        setPassword('');
                    }
                } else {
                    setPwdMsg('请再次设置您的6位数字交易密码');
                    setPwdFisrt(password);
                    setPassword('');
                }
            }
        }
    }, [jump, navigation, password, pwdFisrt, route, dispatch]);

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={{paddingHorizontal: Space.padding}}>
                <FastImage
                    style={styles.pwd_img}
                    source={require('../../assets/img/account/tradePwd.png')}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.card}>
                    <View style={[Style.flexRow, styles.card_head]}>
                        <FastImage
                            source={require('../../assets/img/account/password.png')}
                            style={{width: px(20), height: px(20), resizeMode: 'contain', marginRight: px(4)}}
                        />
                        <Text style={styles.title}>{pwdMsg}</Text>
                    </View>
                    <View style={{marginTop: text(25), position: 'relative'}}>
                        {render_box()}
                        <TextInput
                            ref={textInput}
                            underlineColorAndroid="transparent"
                            caretHidden
                            keyboardType="number-pad"
                            style={styles.input}
                            autoFocus={true}
                            maxLength={6}
                            value={password}
                            onChangeText={(value) => setPassword(value.replace(/\D/g, ''))}
                        />
                        <Text
                            onPress={handelReset}
                            style={{
                                fontSize: text(12),
                                textAlign: 'center',
                                color: '#0051CC',
                                marginTop: text(20),
                            }}>
                            重新设置密码
                        </Text>
                    </View>
                </View>
            </View>
            <BottomDesc style={{marginTop: text(120)}} />
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingVertical: Space.padding,
    },
    pwd_img: {
        width: '100%',
        height: text(55),
    },
    card: {
        backgroundColor: '#fff',
        paddingVertical: text(16),
        borderRadius: text(8),
        marginBottom: text(10),
        marginTop: text(24),
        padding: Space.padding,
    },
    card_head: {
        borderColor: '#DDDDDD',
        borderBottomWidth: 0.5,
        paddingBottom: text(15),
        // alignItems: 'flex-end',
    },
    title: {
        color: Colors.defaultColor,
        fontSize: Font.textH2,
    },
    box: {
        backgroundColor: '#f5f6f8',
        width: text(35),
        height: text(46),
        marginLeft: text(10),
        borderRadius: text(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    box_con: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginVertical: text(10),
        marginLeft: -10,
    },
    circle: {
        width: text(14),
        height: text(14),
        borderRadius: text(7),
        backgroundColor: '#000',
    },
    input: {
        // width: text(300),
        opacity: 0,
        height: text(46),
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
});

export default SetTradePassword;
