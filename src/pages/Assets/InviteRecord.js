/*
 * @Date: 2021-01-29 17:10:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-13 16:05:40
 * @Description: 邀请好友记录
 */
import React, {useCallback, useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';

const InviteRecord = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [header, setHeader] = useState([]);
    const [list, setList] = useState([]);

    const init = useCallback(
        (status, first) => {
            // status === 'refresh' && setRefreshing(true);
            http.get('/promotion/invitees/20210101', {
                page,
            }).then((res) => {
                setRefreshing(false);
                if (res.code === '000000') {
                    setHasMore(res.result.has_more || false);
                    first && navigation.setOptions({title: res.result.title || '邀请好友记录'});
                    first && setHeader(res.result.head);
                    if (status === 'refresh') {
                        setList(res.result.list || []);
                    } else if (status === 'loadmore') {
                        setList((prevList) => [...prevList, ...(res.result.list || [])]);
                    }
                }
            });
        },
        [navigation, page]
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
                    <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>
                        {hasMore ? '正在加载...' : '我们是有底线的...'}
                    </Text>
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return <Empty text={'暂无邀请好友记录'} />;
    }, []);
    // 渲染列表项
    const renderItem = useCallback(({item, index}) => {
        return (
            <View style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                <Text style={[styles.itemText, {textAlign: 'left', fontFamily: Font.numRegular}]}>{item[0]}</Text>
                <Text style={[styles.itemText, {flex: 1.5}]}>
                    <Text style={{fontFamily: Font.numRegular}}>{item[1]} </Text>({item[2]})
                </Text>
                <Text style={[styles.itemText, {textAlign: 'right', fontFamily: Font.numRegular}]}>{item[3]}</Text>
            </View>
        );
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
        // fontFamily: Font.numRegular,
        textAlign: 'center',
    },
});

export default InviteRecord;
