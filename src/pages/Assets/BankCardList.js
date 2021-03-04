/*
 * @Date: 2021-02-22 18:20:12
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-03 14:53:45
 * @Description: 银行卡管理
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Button} from '../../components/Button';
import Empty from '../../components/EmptyTip';

const BankCardList = ({navigation}) => {
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/passport/bank_card/manage/20210101').then((res) => {
            // console.log(res);
            navigation.setOptions({title: res.title});
            setData(res);
        });
    }, [navigation]);
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.xy?.cards?.length > 0 && (
                    <Text style={[styles.title, {paddingTop: text(12), paddingBottom: text(6)}]}>{data.xy.text}</Text>
                )}
                {data.xy?.cards?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={item.pay_method}
                            style={[Style.flexRow, styles.cardBox]}
                            onPress={() =>
                                navigation.navigate({name: 'BankCard', params: {pay_method: item.pay_method}})
                            }>
                            <View style={[Style.flexRow, {flex: 1}]}>
                                <Image source={{uri: item.bank_icon}} style={styles.bankLogo} />
                                <View style={{flex: 1}}>
                                    <Text style={styles.cardNum}>
                                        {item.bank_name}
                                        {item.bank_no}
                                    </Text>
                                    <Text style={[styles.title, {marginTop: text(2)}]}>{item.limit_desc}</Text>
                                </View>
                            </View>
                            <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                    );
                })}
                {data.ym?.cards?.length > 0 && (
                    <Text style={[styles.title, {paddingBottom: text(6)}]}>{'盈米银行卡'}</Text>
                )}
                {data.ym?.cards?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={item.pay_method}
                            style={[Style.flexRow, styles.cardBox]}
                            onPress={() =>
                                navigation.navigate({name: 'BankCard', params: {pay_method: item.pay_method}})
                            }>
                            <View style={[Style.flexRow, {flex: 1}]}>
                                <Image source={{uri: item.bank_icon}} style={styles.bankLogo} />
                                <View style={{flex: 1}}>
                                    <Text style={styles.cardNum}>
                                        {item.bank_name}
                                        {item.bank_no}
                                    </Text>
                                    <Text style={[styles.title, {marginTop: text(2)}]}>{item.limit_desc}</Text>
                                </View>
                            </View>
                            <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                    );
                })}
                {data.xy?.cards?.length === 0 && data.ym?.cards?.length === 0 && (
                    <>
                        <Empty img={require('../../assets/img/emptyTip/noCard.png')} text={'暂无银行卡'} />
                        <Button
                            title={'添加新银行卡'}
                            style={[styles.btn, {marginHorizontal: text(4), marginTop: text(86)}]}
                        />
                    </>
                )}
            </ScrollView>
            {data.xy?.cards?.length === 0 && data.ym?.cards?.length === 0 ? null : (
                <Button title={'添加新银行卡'} style={styles.btn} />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    title: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightGrayColor,
    },
    cardBox: {
        marginBottom: text(12),
        paddingVertical: text(13),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    bankLogo: {
        width: text(28),
        height: text(28),
        marginRight: text(13),
    },
    cardNum: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    btn: {
        marginHorizontal: text(20),
    },
});

export default BankCardList;
