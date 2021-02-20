/*
 * @Author: xjh
 * @Date: 2021-02-20 16:08:07
 * @Description:私募赎回申请
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-20 16:32:22
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import {FixedButton} from '../../components/Button';
export default function PrivateRedeem() {
    const btnClick = (url) => {};
    return (
        <View style={{flex: 1}}>
            <Text style={[Style.descSty, {padding: text(16)}]}>魔方FOF1号</Text>
            <View style={styles.card_sty}>
                <Text style={{color: Colors.defaultColor, fontSize: Font.textH1}}>赎回份额</Text>
                <View
                    style={[
                        Style.flexRow,
                        {marginTop: text(12), borderBottomWidth: 0.5, borderColor: Colors.borderColor},
                    ]}>
                    <TextInput
                        style={{height: text(50), fontSize: text(26), flex: 1}}
                        placeholder="请输入赎回百分比"
                        value={''}
                    />
                    <Text style={styles.percent_symbol}>全部</Text>
                </View>
                <Text style={{color: '#9095A5', fontSize: Font.textH3, marginTop: text(10)}}>
                    根据监管要求，如果您部分赎回，剩余金额不小于100万元
                </Text>
            </View>
            <View style={[styles.card_sty, {paddingVertical: 0}]}>
                <View
                    style={[
                        Style.flexBetween,
                        {borderColor: Colors.borderColor, borderBottomWidth: 0.5, paddingVertical: text(16)},
                    ]}>
                    <Text>当前资产</Text>
                    <Text>123213</Text>
                </View>
            </View>
            <FixedButton title={'申请赎回'} style={styles.btn_sty} onPress={() => btnClick()} />
        </View>
    );
}
const styles = StyleSheet.create({
    percent_symbol: {
        fontSize: Font.textH3,
        color: '#0051CC',
    },
    card_sty: {
        padding: text(15),
        paddingBottom: text(10),
        backgroundColor: '#fff',
        marginBottom: text(16),
    },
    btn_sty: {
        marginHorizontal: Space.padding,
        backgroundColor: '#CEA26B',
    },
});
