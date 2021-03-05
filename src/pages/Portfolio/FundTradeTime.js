/*
 * @Date: 2021-01-30 11:30:36
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-04 10:29:43
 * @Description: 交易时间说明
 */
import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const FundTradeTime = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [buy, setBuy] = useState({});
    const [redeem, setRedeem] = useState({});

    const init = useCallback(
        (first) => {
            setRefreshing(true);
            http.get('/fund/trade_time/20210101', {
                fund_code: (route.params && route.params.code) || '',
            }).then((res) => {
                setRefreshing(false);
                first && navigation.setOptions({title: res.result.title || '交易时间说明'});
                setBuy(res.result.buy);
                setRedeem(res.result.redeem);
            });
        },
        [navigation, route]
    );
    // 下拉刷新
    const onRefresh = useCallback(() => {
        init();
    }, [init]);
    // 渲染头部
    const renderHeader = useCallback(() => {
        return (
            <View style={[Style.flexRow, styles.header]}>
                {buy.table?.head?.map((item, index) => {
                    return (
                        <Text
                            style={[
                                styles.headerText,
                                index === 0 ? {textAlign: 'left'} : {},
                                index === buy.table.head.length - 1 ? {textAlign: 'right'} : {},
                            ]}>
                            {item}
                        </Text>
                    );
                })}
            </View>
        );
    }, [buy]);
    // 渲染列表项
    const renderItem = useCallback((item, index) => {
        return (
            <View
                key={index}
                style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                {item?.map((value, idx) => {
                    return (
                        <Text
                            style={[
                                styles.itemText,
                                idx === 0 ? {textAlign: 'left'} : {},
                                idx === item.length - 1 ? {textAlign: 'right'} : {},
                            ]}>
                            {value}
                        </Text>
                    );
                })}
            </View>
        );
    }, []);

    useEffect(() => {
        init(true);
    }, [init]);
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {renderHeader()}
            {buy.table?.rows.map((item, index) => {
                return renderItem(item, index);
            })}
            <View style={[Style.flexRow, styles.header, {marginTop: text(24)}]}>
                <Text style={[styles.headerText, {textAlign: 'left'}]}>{'赎回确认时间'}</Text>
            </View>
            <Text style={styles.desc}>{redeem.desc}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: text(36),
        backgroundColor: Colors.bgColor,
        paddingLeft: text(12),
        paddingRight: text(14),
    },
    headerText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    item: {
        height: text(45),
        backgroundColor: '#fff',
        paddingLeft: text(12),
        paddingRight: text(14),
    },
    itemText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
    desc: {
        padding: text(14),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
});

export default FundTradeTime;
