/*
 * @Date: 2021-02-23 10:41:48
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-13 13:41:39
 * @Description: 银行卡
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Toast from '../../components/Toast';
import {useSelector} from 'react-redux';

const BankCard = ({navigation, route}) => {
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo);
    const [data, setData] = useState({});
    const passwordModal = useRef(null);

    const onPress = useCallback(
        (item) => {
            if (item.url) {
                if (item.type === 'modify_phone') {
                    if (userInfo.toJS().has_trade_pwd) {
                        jump(item.url);
                    } else {
                        Modal.show({
                            title: item.text,
                            confirm: true,
                            confirmCallBack: () =>
                                navigation.navigate('SetTradePassword', {fr: 'BankCard', url: item.url}),
                            confirmText: '设置交易密码',
                            content: `为了资金安全，修改预留手机号需先设置<font style="color: ${Colors.red};">数字交易密码</font>`,
                        });
                    }
                }
            } else {
                if (item.type === 'unbind') {
                    passwordModal.current.show();
                }
            }
        },
        [jump, navigation, userInfo]
    );
    const onDone = useCallback(
        (password) => {
            http.post('/passport/bank_card/unbind/20210101', {
                password,
                pay_method: route.params?.pay_method,
            }).then((res) => {
                Toast.show(res.message);
                if (res.code === '000000') {
                    navigation.goBack();
                }
            });
        },
        [navigation, route]
    );

    useEffect(() => {
        http.get('/passport/bank_card/detail/20210101', {
            pay_method: route.params?.pay_method,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '银行卡'});
                setData(res.result);
            }
        });
    }, [navigation, route]);
    return (
        <ScrollView style={styles.container}>
            <PasswordModal ref={passwordModal} onDone={onDone} />
            <View style={styles.cardBox}>
                <ImageBackground source={{uri: data?.bank_info?.bank_bg}} style={styles.cardBg}>
                    <View style={{paddingTop: text(19), paddingLeft: text(68)}}>
                        <Text style={[styles.name, {marginBottom: text(2)}]}>{data?.bank_info?.bank_name}</Text>
                        <Text style={styles.limit}>{data?.bank_info?.limit_desc}</Text>
                    </View>
                    <View style={[Style.flexRow, {marginTop: text(32)}]}>
                        <Text style={styles.cardNo}>{'****'}</Text>
                        <Text style={styles.cardNo}>{'****'}</Text>
                        <Text style={styles.cardNo}>{'****'}</Text>
                        <Text style={styles.cardNo}>{data?.bank_info?.bank_no}</Text>
                    </View>
                </ImageBackground>
                <View style={{paddingHorizontal: Space.padding, backgroundColor: '#fff'}}>
                    {data?.operation?.map((item, index) => {
                        return (
                            <View key={item + index}>
                                {index !== 0 && <View style={styles.line} />}
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[Style.flexBetween, {height: text(60)}]}
                                    onPress={() => onPress(item)}>
                                    <View style={Style.flexRow}>
                                        <Image source={{uri: item.icon}} style={styles.icon} />
                                        <Text style={styles.opTitle}>{item.text}</Text>
                                    </View>
                                    <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    cardBox: {
        margin: Space.marginAlign,
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
    },
    cardBg: {
        width: '100%',
        height: text(150),
    },
    name: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: '#fff',
        fontWeight: '500',
    },
    limit: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#fff',
        opacity: 0.69,
    },
    cardNo: {
        flex: 1,
        fontSize: text(24),
        lineHeight: text(29),
        color: '#fff',
        fontWeight: '500',
        fontFamily: Font.numMedium,
        textAlign: 'center',
    },
    icon: {
        width: text(22),
        height: text(22),
        marginRight: text(8),
    },
    opTitle: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
    line: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
});

export default BankCard;
