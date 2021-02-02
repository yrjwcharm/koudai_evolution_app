/*
 * @Date: 2021-01-30 11:30:36
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-30 16:26:00
 * @Description: 交易时间说明
 */
import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const FundTradeTime = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [header, setHeader] = useState([]);
    const [list, setList] = useState([
        ['上周五15:00 ~ 周一15:00', '周二'],
        ['周一15:00 ~ 周二15:00', '周三'],
        ['周二15:00 ~ 周三15:00', '周四'],
        ['周三15:00 ~ 周四15:00', '周五'],
        ['周四15:00 ~ 周五15:00', '下周一'],
    ]);

    const init = useCallback(
        (first) => {
            setRefreshing(true);
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/trade_timing/20210101', {
                fund_code: (route.params && route.params.code) || '',
            }).then((res) => {
                setRefreshing(false);
                first && navigation.setOptions({title: res.result.title || '交易时间说明'});
                first && setHeader(res.result.header || []);
                setList([...(res.result.list || [])]);
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
                <Text style={[styles.headerText, {textAlign: 'left'}]}>{'交易申请时间'}</Text>
                <Text style={[styles.headerText, {textAlign: 'right'}]}>{'申购确认'}</Text>
            </View>
        );
    }, []);
    // 渲染列表项
    const renderItem = useCallback((item, index) => {
        return (
            <View
                key={index}
                style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                <Text style={[styles.itemText, {textAlign: 'left'}]}>{item[0]}</Text>
                <Text style={[styles.itemText, {textAlign: 'right'}]}>{item[1]}</Text>
            </View>
        );
    }, []);

    useEffect(() => {
        // init();
    }, [init]);
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {renderHeader()}
            {list.map((item, index) => {
                return renderItem(item, index);
            })}
            <View style={[Style.flexRow, styles.header, {marginTop: text(24)}]}>
                <Text style={[styles.headerText, {textAlign: 'left'}]}>{'赎回确认时间'}</Text>
            </View>
            <Text style={styles.desc}>
                {
                    '大部分基金会在3个工作日内将赎回款划到原银行卡中。工作日15:00之前提交交易按照当日收市后公布的净值成交，15:00之后提交的交易将按照下一个交易日的净值成交'
                }
            </Text>
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
