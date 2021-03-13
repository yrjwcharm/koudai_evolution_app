/*
 * @Date: 2021-02-23 15:56:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-13 15:29:10
 * @Description: 修改预留手机号
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {px as text, handlePhone} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Button} from '../../components/Button';
import InputView from './components/input';
import Toast from '../../components/Toast';
import {VerifyCodeModal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';

const ModifyPhoneNum = ({navigation, route}) => {
    const [phone, setPhone] = useState('');
    const [params] = useState(route.params || {});
    const btnClick = useRef(true);
    const codeModal = useRef(null);
    const passwordModal = useRef(null);
    const tradePwdVerified = useRef(false);

    const submit = useCallback(() => {
        if (!btnClick.current) {
            return false;
        }
        if (phone.length === 0) {
            Toast.show('手机号不能为空');
        } else {
            if (phone.length < 11) {
                Toast.show('手机号格式错误');
            } else {
                btnClick.current = false;
                http.post('/passport/check/payment_mobile/20210101', {
                    mobile: phone,
                    pay_method: params.pay_method,
                }).then((res) => {
                    if (res.code === '000000') {
                        if (tradePwdVerified.current === true) {
                            getCode(phone);
                        } else {
                            passwordModal.current.show();
                        }
                    } else {
                        Toast.show(res.message, {
                            onHidden: () => {
                                btnClick.current = true;
                            },
                        });
                    }
                });
            }
        }
    }, [getCode, params, phone]);
    const onDone = useCallback(
        (password) => {
            http.post('/passport/verify_trade_password/20210101', {password}).then((res) => {
                if (res.code === '000000') {
                    tradePwdVerified.current = true;
                    getCode(phone);
                } else {
                    Toast.show(res.message);
                    btnClick.current = true;
                }
            });
        },
        [getCode, phone]
    );
    const getCode = useCallback((mobile) => {
        if (!mobile) {
            return false;
        }
        http.post('/passport/send_verify_code/20210101', {
            mobile,
            operation: 'change_payment_mobile',
        }).then((res) => {
            btnClick.current = true;
            Toast.show(res.message);
            if (res.code === '000000') {
                setTimeout(() => {
                    codeModal.current.show();
                }, 2000);
            }
        });
    }, []);
    const onChangeText = useCallback(
        (value) => {
            if (value.length === 6) {
                http.post('/passport/update/payment_mobile/20210101', {
                    mobile: phone,
                    pay_method: params.pay_method,
                    verify_code: value,
                }).then((res) => {
                    Toast.show(res.message);
                    if (res.code === '000000') {
                        codeModal.current.hide();
                        navigation.goBack();
                    }
                });
            }
        },
        [navigation, params, phone]
    );

    return (
        <ScrollView style={styles.container}>
            <VerifyCodeModal
                ref={codeModal}
                desc={`验证码已发送至${handlePhone(phone)}`}
                isTouchMaskToClose
                onChangeText={onChangeText}
                getCode={getCode}
                phone={phone}
            />
            <PasswordModal
                ref={passwordModal}
                onDone={onDone}
                onClose={() => {
                    btnClick.current = true;
                }}
            />
            <View style={[Style.flexRowCenter, {paddingVertical: text(32), paddingBottom: Space.padding}]}>
                <Image source={{uri: params.bank_icon}} style={styles.icon} />
                <Text style={styles.cardNum}>{params.bank_name}</Text>
            </View>
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'phone-pad'}
                maxLength={11}
                onChangeText={(value) => setPhone(value.replace(/\D/g, ''))}
                placeholder={'请输入您的银行预留手机号'}
                style={styles.inputView}
                textContentType={'telephoneNumber'}
                title={'手机号'}
                value={phone}
            />
            <Text style={[styles.tips, {paddingTop: text(12), paddingBottom: text(24), paddingLeft: text(32)}]}>
                {'请务必确认已在发卡行完成预留手机号修改'}
            </Text>
            <Button title={'修改'} style={{marginHorizontal: text(22)}} onPress={submit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    icon: {
        width: text(28),
        height: text(28),
        borderRadius: text(14),
        marginRight: text(12),
    },
    cardNum: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    inputView: {
        marginHorizontal: text(22),
        backgroundColor: '#F4F4F4',
        height: text(50),
    },
    tips: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightGrayColor,
    },
});

export default ModifyPhoneNum;
