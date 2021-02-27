/*
 * @Date: 2021-02-22 18:20:12
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-23 11:44:04
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
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                <Text style={[styles.title, {paddingTop: text(12), paddingBottom: text(6)}]}>{'玄元银行卡'}</Text>
                <TouchableOpacity
                    style={[Style.flexRow, styles.cardBox]}
                    onPress={() => navigation.navigate({name: 'BankCard'})}>
                    <View style={[Style.flexRow, {flex: 1}]}>
                        <Image
                            source={{
                                uri:
                                    'https://static.licaimofang.com/wp-content/uploads/2020/10/schoolseason_course4.png',
                            }}
                            style={styles.bankLogo}
                        />
                        <View style={{flex: 1}}>
                            <Text style={styles.cardNum}>{'招商银行储蓄卡(4569)'}</Text>
                            <Text style={[styles.title, {marginTop: text(2)}]}>{'限额：单笔5千元、单日3万元'}</Text>
                        </View>
                    </View>
                    <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                </TouchableOpacity>
                <TouchableOpacity style={[Style.flexRow, styles.cardBox]}>
                    <View style={[Style.flexRow, {flex: 1}]}>
                        <Image
                            source={{
                                uri:
                                    'https://static.licaimofang.com/wp-content/uploads/2020/10/schoolseason_course4.png',
                            }}
                            style={styles.bankLogo}
                        />
                        <View style={{flex: 1}}>
                            <Text style={styles.cardNum}>{'招商银行储蓄卡(4569)'}</Text>
                            <Text style={[styles.title, {marginTop: text(2)}]}>{'限额：单笔5千元、单日3万元'}</Text>
                        </View>
                    </View>
                    <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                </TouchableOpacity>
                <Text style={[styles.title, {paddingBottom: text(6)}]}>{'盈米银行卡'}</Text>
                <TouchableOpacity style={[Style.flexRow, styles.cardBox]}>
                    <View style={[Style.flexRow, {flex: 1}]}>
                        <Image
                            source={{
                                uri:
                                    'https://static.licaimofang.com/wp-content/uploads/2020/10/schoolseason_course4.png',
                            }}
                            style={styles.bankLogo}
                        />
                        <View style={{flex: 1}}>
                            <Text style={styles.cardNum}>{'招商银行储蓄卡(4569)'}</Text>
                            <Text style={[styles.title, {marginTop: text(2)}]}>{'限额：单笔5千元、单日3万元'}</Text>
                        </View>
                    </View>
                    <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                </TouchableOpacity>
                <TouchableOpacity style={[Style.flexRow, styles.cardBox]}>
                    <View style={[Style.flexRow, {flex: 1}]}>
                        <Image
                            source={{
                                uri:
                                    'https://static.licaimofang.com/wp-content/uploads/2020/10/schoolseason_course4.png',
                            }}
                            style={styles.bankLogo}
                        />
                        <View style={{flex: 1}}>
                            <Text style={styles.cardNum}>{'招商银行储蓄卡(4569)'}</Text>
                            <Text style={[styles.title, {marginTop: text(2)}]}>{'限额：单笔5千元、单日3万元'}</Text>
                        </View>
                    </View>
                    <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                </TouchableOpacity>
                {/* <Empty img={require('../../assets/img/emptyTip/noCard.png')} text={'暂无银行卡'} />
                <Button title={'添加新银行卡'} style={[styles.btn, {marginHorizontal: text(4), marginTop: text(86)}]} /> */}
            </ScrollView>
            <Button title={'添加新银行卡'} style={styles.btn} />
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
