/*
 * @Date: 2021-02-23 15:56:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-23 16:22:49
 * @Description: 修改预留手机号
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Button} from '../../components/Button';
import InputView from './components/input';

const ModifyPhoneNum = ({navigation}) => {
    const [phone, setPhone] = useState('');

    return (
        <ScrollView style={styles.container}>
            <View style={[Style.flexRowCenter, {paddingVertical: text(32), paddingBottom: Space.padding}]}>
                <Image
                    source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2020/10/schoolseason_course4.png'}}
                    style={styles.icon}
                />
                <Text style={styles.cardNum}>{'招商银行储蓄卡(4569)'}</Text>
            </View>
            <InputView
                clearButtonMode={'while-editing'}
                keyboardType={'phone-pad'}
                maxLength={11}
                onChangeText={(value) => setPhone(value.replace(/\D/g, ''))}
                placeholder={'请输入您的银行预留手机号'}
                style={{marginHorizontal: text(22), backgroundColor: '#F4F4F4'}}
                textContentType={'telephoneNumber'}
                title={'手机号'}
                value={phone}
            />
            <Text style={[styles.tips, {paddingTop: text(12), paddingBottom: text(24), paddingLeft: text(32)}]}>
                {'请务必确认已在发卡行完成预留手机号修改'}
            </Text>
            <Button title={'修改'} style={{marginHorizontal: text(22)}} />
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
        marginRight: text(12),
    },
    cardNum: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    tips: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightGrayColor,
    },
});

export default ModifyPhoneNum;
