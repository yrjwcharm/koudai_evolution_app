/*
 * @Date: 2021-02-23 10:41:48
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-03 14:51:10
 * @Description: 银行卡
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const BankCard = ({navigation, route}) => {
    const [data, setData] = useState({});
    useEffect(() => {
        http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/passport/bank_card/detail/20210101', {
            pay_method: route.params?.pay_method,
        }).then((res) => {
            navigation.setOptions({title: res.title});
            setData(res);
        });
    }, [navigation, route]);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.cardBox}>
                <ImageBackground
                    source={{
                        uri:
                            'https://upload-images.jianshu.io/upload_images/18473180-21e6eec3cac99e8b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
                    }}
                    style={styles.cardBg}>
                    <View style={{paddingTop: text(19), paddingLeft: text(68)}}>
                        <Text style={[styles.name, {marginBottom: text(2)}]}>{'招商银行储蓄卡'}</Text>
                        <Text style={styles.limit}>{'限额：单笔5千元、单日3万元'}</Text>
                    </View>
                    <View style={[Style.flexRow, {marginTop: text(32)}]}>
                        <Text style={styles.cardNo}>{'****'}</Text>
                        <Text style={styles.cardNo}>{'****'}</Text>
                        <Text style={styles.cardNo}>{'****'}</Text>
                        <Text style={styles.cardNo}>{'8899'}</Text>
                    </View>
                </ImageBackground>
                <View style={{paddingHorizontal: Space.padding, backgroundColor: '#fff'}}>
                    <TouchableOpacity
                        style={[Style.flexBetween, {height: text(60)}]}
                        onPress={() => navigation.navigate({name: 'ModifyPhoneNum'})}>
                        <View style={Style.flexRow}>
                            <Image source={require('../../assets/personal/modifyPhoneNum.png')} style={styles.icon} />
                            <Text style={styles.opTitle}>{'修改预留手机号'}</Text>
                        </View>
                        <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <TouchableOpacity style={[Style.flexBetween, {height: text(60)}]}>
                        <View style={Style.flexRow}>
                            <Image source={require('../../assets/personal/unbundleCard.png')} style={styles.icon} />
                            <Text style={styles.opTitle}>{'解绑银行卡'}</Text>
                        </View>
                        <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                    </TouchableOpacity>
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
