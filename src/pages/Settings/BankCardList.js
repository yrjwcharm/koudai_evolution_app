/*
 * @Date: 2021-02-22 18:20:12
 * @Description: 银行卡管理
 */
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text, isIphoneX} from '~/utils/appUtil.js';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import http from '~/services';
import {Button} from '~/components/Button';
import Empty from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import {useNetInfo} from '@react-native-community/netinfo';
import Toast from '~/components/Toast';

const BankCardList = ({navigation}) => {
    const jump = useJump();
    const netInfo = useNetInfo();
    const [data, setData] = useState({});
    const [showEmpty, setShowEmpty] = useState(false);

    /**
     * 渲染银行卡
     * @param item
     * @returns {JSX.Element}
     */
    const renderCards = (item) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={item.pay_method}
                style={[Style.flexRow, styles.cardBox]}
                onPress={() => {
                    global.LogTool('click', 'bankcard', item.pay_method);
                    navigation.navigate('BankCard', {pay_method: item.pay_method});
                }}>
                <View style={[Style.flexRow, {flex: 1}]}>
                    <Image source={{uri: item.bank_icon}} style={styles.bankLogo} />
                    <View style={{flex: 1}}>
                        <Text style={styles.cardNum}>
                            {item.bank_name}({item.bank_no})
                        </Text>
                        <Text style={[styles.title, {marginTop: text(2)}]}>{item.limit_desc}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
            </TouchableOpacity>
        );
    };

    const onPress = () => {
        if (data?.button?.url) {
            global.LogTool('click', 'addBankCard');
            jump(data?.button?.url);
        } else Toast.show('当前网络状况差，请稍后再试');
    };

    useFocusEffect(
        useCallback(() => {
            http.get('/passport/bank_card/manage/20210101').then((res) => {
                setShowEmpty(true);
                if (res.code === '000000') {
                    navigation.setOptions({title: res.result.title || '绑定银行卡'});
                    setData(res.result);
                }
            });
        }, [navigation])
    );
    return (
        <View style={styles.container}>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.xy?.cards?.length > 0 && (
                    <Text style={[styles.title, {paddingTop: text(12), paddingBottom: text(6)}]}>{data.xy.text}</Text>
                )}
                {data.xy?.cards?.map(renderCards)}
                {data.ym?.cards?.length > 0 && (
                    <Text style={[styles.title, {paddingTop: text(12), paddingBottom: text(6)}]}>{'盈米银行卡'}</Text>
                )}
                {data.ym?.cards?.map(renderCards)}
                {showEmpty &&
                (Object.keys(data).length === 0 ||
                    (!data?.xy?.cards && !data?.ym?.cards) ||
                    (data?.xy?.cards?.length === 0 && data?.ym?.cards?.length === 0)) ? (
                    <>
                        <Empty
                            img={require('../../assets/img/emptyTip/noCard.png')}
                            text={'暂无银行卡'}
                            desc={'您目前还未绑定任何银行卡'}
                        />
                        <Button
                            title={data?.button?.text || '添加银行卡'}
                            style={{...styles.btn, ...{marginHorizontal: text(4), marginTop: text(86)}}}
                            onPress={onPress}
                        />
                    </>
                ) : null}
            </ScrollView>
            {Object.keys(data).length === 0 ||
            (!data?.xy?.cards && !data?.ym?.cards) ||
            (data?.xy?.cards?.length === 0 && data?.ym?.cards?.length === 0) ? null : data?.button?.text ? (
                <Button title={data?.button?.text || '添加银行卡'} style={styles.btn} onPress={onPress} />
            ) : null}
        </View>
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
        marginBottom: isIphoneX() ? 34 + Space.marginVertical : Space.marginVertical,
    },
});

export default BankCardList;
