/*
 * @Date: 2021-03-10 15:02:48
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-10 15:37:26
 * @Description: 账号注销
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Button} from '../../components/Button';
import Modal from '../../components/Modal/Modal';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth} from '../../utils/appUtil';
import http from '../../services';
import HTML from '../../components/RenderHtml';

const AccountRemove = ({navigation, route}) => {
    return (
        <ScrollView style={styles.container}>
            <View style={Style.flexCenter}>
                <Image source={require('../../assets/personal/warn.png')} style={styles.warn} />
            </View>
            <View style={[Style.flexCenter, {borderBottomWidth: Space.borderWidth, borderColor: Colors.borderColor}]}>
                <Text style={styles.bigTitle}>{'账号注销'}</Text>
                <Text style={[styles.desc, styles.tips]}>{'当您决定注销账号时，请阅读以下内容'}</Text>
            </View>
            <View>
                <Text style={[styles.title, {marginVertical: text(8)}]}>{'账号注销，将视为放弃以下权益：'}</Text>
                <HTML
                    html={
                        '<span>1. 账号注销后，您在理财魔方App所获得的魔分，优惠券等奖励视作放弃并无法恢复；</span><br><br><span>2. 账号注销后，您在理财魔方App所绑定的银行卡将全部解绑，我的红包金额将清零；</span><br><br><span>3. 账号注销后，您在理财魔方App上所有的交易记录将被清空；</span><br><br><span>4. 账号注销后，理财魔方为您提供的投顾服务将停止；</span><br><br><span>5. 账户注销后，不会注销在理财魔方App上已开通的银行电子账户，如需注销请联系开户银行进行处理；</span><br><br><span>6. 账号注销后，所有信息将被删除并且无法恢复。</span>'
                    }
                    style={styles.desc}
                />
            </View>
            <View>
                <Text style={[styles.title, {marginVertical: text(8)}]}>{'账号注销，需要满足以下条件'}</Text>
                <HTML
                    html={
                        '<span>1. 在理财魔方App上持仓总金额为0；</span><br><br><span>2. 在理财魔方App上购买确认中和赎回确认中金额均为0。</span>'
                    }
                    style={styles.desc}
                />
            </View>
            <Button title={'申请注销'} style={styles.btn} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: Space.padding,
    },
    warn: {
        marginVertical: Space.padding,
        width: text(50),
        height: text(50),
    },
    bigTitle: {
        fontSize: text(20),
        color: Colors.red,
        fontWeight: '500',
    },
    desc: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.lightGrayColor,
    },
    tips: {
        marginTop: text(8),
        marginBottom: text(16),
        color: Colors.lightBlackColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    btn: {
        marginTop: Space.marginVertical,
        marginHorizontal: text(20),
        width: deviceWidth - 2 * Space.padding - text(40),
    },
});

export default AccountRemove;
