/*
 * @Date: 2021-01-29 17:10:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-07 17:17:09
 * @Description: 旗下基金
 */
import React, {useCallback, useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';

const CompanyFunds = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [header, setHeader] = useState([]);
    const [list, setList] = useState([]);

    const init = useCallback(
        (status, first) => {
            status === 'refresh' && setRefreshing(true);
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/fund/company/funds/20210101', {
                company_id: (route.params && route.params.company_id) || '',
                page,
            }).then((res) => {
                setRefreshing(false);
                setHasMore(res.result.has_more);
                first && navigation.setOptions({title: route.params.title || '旗下基金'});
                first && setHeader(res.result.header);
                if (status === 'refresh') {
                    setList(res.result.list || []);
                } else if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...(res.result.list || [])]);
                }
            });
        },
        [navigation, route, page]
    );
    // 下拉刷新
    const onRefresh = useCallback(() => {
        setPage(1);
    }, []);
    // 上拉加载
    const onEndReached = useCallback(() => {
        if (hasMore) {
            setPage((p) => p + 1);
        }
    }, [hasMore]);
    // 渲染头部
    const renderHeader = useCallback(() => {
        return (
            <View style={[Style.flexRow, styles.header]}>
                <Text style={[styles.headerText, {textAlign: 'left'}]}>{header[0]}</Text>
                <Text style={[styles.headerText, {textAlign: 'right'}]}>{header[1]}</Text>
            </View>
        );
    }, [header]);
    // 渲染底部
    const renderFooter = useCallback(() => {
        return (
            <>
                {list.length > 0 && (
                    <Text style={[styles.headerText, {paddingBottom: Space.padding}]}>
                        {hasMore ? '正在加载...' : '暂无更多了'}
                    </Text>
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return <Empty text={'暂无旗下基金数据'} />;
    }, []);
    // 渲染列表项
    const renderItem = useCallback(
        ({item, index}) => {
            return (
                <View style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                    <Text numberOfLines={1} style={[styles.itemText, {textAlign: 'left'}]}>
                        {item.name}
                    </Text>
                    <Text
                        style={[
                            styles.itemText,
                            {textAlign: 'right', color: getColor(item.inc), fontFamily: Font.numFontFamily},
                        ]}>
                        {parseFloat(item.inc.replaceAll(',', '')) > 0 ? `+${item.inc}` : item.inc}
                    </Text>
                </View>
            );
        },
        [getColor]
    );
    // 获取涨跌颜色
    const getColor = useCallback((t) => {
        if (parseFloat(t.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replaceAll(',', '')) > 0) {
            return Colors.red;
        } else {
            return Colors.defaultColor;
        }
    }, []);

    useEffect(() => {
        if (page === 1) {
            init('refresh', true);
        } else {
            init('loadmore');
        }
    }, [page, init]);
    return (
        <View style={styles.container}>
            <SectionList
                sections={list.length > 0 ? [{data: list, title: 'list'}] : []}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={renderItem}
                renderSectionHeader={renderHeader}
                stickySectionHeadersEnabled
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
        fontFamily: Font.numRegular,
        textAlign: 'center',
    },
});

export default CompanyFunds;
