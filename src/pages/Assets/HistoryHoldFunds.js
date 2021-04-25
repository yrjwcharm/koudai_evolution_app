/*
 * @Date: 2021-01-29 17:10:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-13 21:31:42
 * @Description: 历史持有基金
 */
import React, {useCallback, useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';

const HistoryHoldFunds = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [header, setHeader] = useState([]);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);

    const init = useCallback(
        (status, first) => {
            // status === 'refresh' && setRefreshing(true);
            http.get('/portfolio/funds/user_redeemed/20210101', {
                poid: route.params?.poid || 'X00F000003',
                page,
            }).then((res) => {
                setShowEmpty(true);
                setRefreshing(false);
                setHasMore(res.result.has_more || false);
                first && navigation.setOptions({title: res.result.title || '历史持有基金'});
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
    const onEndReached = useCallback(
        ({distanceFromEnd}) => {
            if (distanceFromEnd < 0) {
                return false;
            }
            if (hasMore) {
                setPage((p) => p + 1);
            }
        },
        [hasMore]
    );
    // 渲染头部
    const renderHeader = useCallback(() => {
        return (
            <View style={[Style.flexRow, styles.header]}>
                {header.map((item, index, arr) => {
                    return (
                        <Text
                            key={item + index}
                            style={[
                                styles.headerText,
                                index === 0 ? {textAlign: 'left'} : {},
                                index === arr.length - 1 ? {textAlign: 'right'} : {},
                            ]}>
                            {item}
                        </Text>
                    );
                })}
            </View>
        );
    }, [header]);
    // 渲染底部
    const renderFooter = useCallback(() => {
        return (
            <>
                {list.length > 0 && (
                    <Text style={[styles.headerText, {paddingBottom: Space.padding}]}>
                        {hasMore ? '正在加载...' : '我们是有底线的...'}
                    </Text>
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return showEmpty ? <Empty text={'暂无历史持有基金数据'} /> : null;
    }, [showEmpty]);
    // 渲染列表项
    const renderItem = useCallback(
        ({item, index}) => {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        global.LogTool('click', 'fund', item.code);
                        navigation.navigate('FundDetail', {code: item.code});
                    }}
                    style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                    <View>
                        <Text numberOfLines={1} style={[styles.itemText]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.itemText, {fontFamily: Font.numRegular}]}>{item.code}</Text>
                    </View>
                    <Text
                        style={[
                            styles.itemText,
                            {textAlign: 'right', color: getColor(`${item.profit_acc}`), fontFamily: Font.numFontFamily},
                        ]}>
                        {parseFloat(`${item.profit_acc}`?.replace(/,/g, '')) > 0
                            ? `+${item.profit_acc}`
                            : item.profit_acc}
                    </Text>
                </TouchableOpacity>
            );
        },
        [navigation, getColor]
    );
    // 获取涨跌颜色
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) > 0) {
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
                onEndReachedThreshold={0.5}
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
        // height: text(45),
        backgroundColor: '#fff',
        paddingVertical: text(12),
        paddingLeft: text(12),
        paddingRight: text(14),
    },
    itemText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
});

export default HistoryHoldFunds;
