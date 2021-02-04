/*
 * @Date: 2021-01-30 11:30:36
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-30 18:01:27
 * @Description: 基金排名
 */
import React, {useCallback, useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';

const FundRanking = ({navigation, route}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [header, setHeader] = useState(['期限', '累计涨跌幅', '同类排名']);
    const [list, setList] = useState([
        ['最近一周', '0.09%', '39/50'],
        ['最近一月', '0.09%', '39/50'],
        ['最近一季', '0.09%', '39/50'],
        ['最近半年', '0.09%', '39/50'],
        ['今年以来', '0.09%', '39/50'],
        ['最近一年', '0.09%', '39/50'],
        ['最近两年', '0.09%', '39/50'],
        ['最近三年', '0.09%', '39/50'],
    ]);

    const init = useCallback(
        (first) => {
            setRefreshing(true);
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/nav_rank/20210101', {
                fund_code: (route.params && route.params.code) || '',
            }).then((res) => {
                setRefreshing(false);
                first && navigation.setOptions({title: res.result.title || '基金排名'});
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
                <Text style={[styles.headerText, {textAlign: 'left'}]}>{header[0]}</Text>
                <Text style={[styles.headerText]}>{header[1]}</Text>
                <Text style={[styles.headerText, {textAlign: 'right'}]}>{header[2]}</Text>
            </View>
        );
    }, [header]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return <Empty text={'暂无基金排名数据'} />;
    }, []);
    // 渲染列表项
    const renderItem = useCallback(
        ({item, index}) => {
            return (
                <View style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                    <Text style={[styles.itemText, {textAlign: 'left'}]}>{item[0]}</Text>
                    <Text style={[styles.itemText, {color: getColor(item[1]), fontFamily: Font.numFontFamily}]}>
                        {parseFloat(item[1].replaceAll(',', '')) > 0 ? `+${item[1]}` : item[1]}
                    </Text>
                    <Text style={[styles.itemText, {textAlign: 'right', fontFamily: Font.numRegular}]}>{item[2]}</Text>
                </View>
            );
        },
        [getColor]
    );
    // 获取涨跌颜色
    const getColor = useCallback((t) => {
        if (parseFloat(t.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replaceAll(',', '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);

    useEffect(() => {
        // init();
    }, [init]);
    return (
        <View style={styles.container}>
            <SectionList
                sections={list.length > 0 ? [{data: list, title: 'list'}] : []}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                ListEmptyComponent={renderEmpty}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={renderItem}
                renderSectionHeader={renderHeader}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
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
});

export default FundRanking;
