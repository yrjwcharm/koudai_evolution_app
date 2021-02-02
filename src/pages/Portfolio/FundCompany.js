/*
 * @Date: 2021-01-30 11:30:36
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-30 18:42:27
 * @Description: 基金公司
 */
import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const FundCompany = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [list, setList] = useState([
        ['成立日期', '2004-01-05'],
        ['注册资本', '1.50亿元'],
        ['总经理', '过振华'],
        ['公司邮箱', '--'],
        ['公司电话', '010-2325 6277'],
        ['客服电话', '010-2527 3466'],
    ]);

    const init = useCallback(
        (first) => {
            setRefreshing(true);
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/company/20210101', {
                fund_code: (route.params && route.params.code) || '',
            }).then((res) => {
                setRefreshing(false);
                first && navigation.setOptions({title: res.result.title || '基金公司'});
                setList([...(res.result.list || [])]);
            });
        },
        [navigation, route]
    );
    // 下拉刷新
    const onRefresh = useCallback(() => {
        init();
    }, [init]);
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
            {list.map((item, index) => {
                return renderItem(item, index);
            })}
            <TouchableOpacity style={[styles.totalFunds, Style.flexBetween]}>
                <Text style={styles.title}>{'旗下基金（144只）'}</Text>
                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
            </TouchableOpacity>
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
    totalFunds: {
        marginHorizontal: Space.marginAlign,
        marginTop: text(24),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        height: text(50),
        shadowColor: '#E0E2E7',
        shadowOffset: {width: 0, height: text(2)},
        shadowOpacity: 1,
        shadowRadius: text(8),
        elevation: 10,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
});

export default FundCompany;
