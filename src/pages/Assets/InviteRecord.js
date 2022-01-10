/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-01-29 17:10:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-01-07 17:45:52
 * @Description: 邀请好友记录
 */
import React, {useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import Empty from '../../components/EmptyTip';
import HTML from '../../components/RenderHtml';
import Loading from '../Portfolio/components/PageLoading';

const InviteRecord = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [header, setHeader] = useState([]);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);

    const init = (status, first) => {
        // status === 'refresh' && setRefreshing(true);
        http.get('/promotion/invitees/20210101', {
            page,
            ...route.params,
        }).then((res) => {
            setShowEmpty(true);
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
    };
    // 上拉加载
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) {
            return false;
        }
        if (hasMore) {
            setPage((p) => p + 1);
        }
    };
    // 渲染头部
    const renderHeader = () => {
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
    };
    // 渲染底部
    const renderFooter = () => {
        return (
            <>
                {list.length > 0 && (
                    <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>
                        {hasMore ? '正在加载...' : '我们是有底线的...'}
                    </Text>
                )}
            </>
        );
    };
    // 渲染空数据状态
    const renderEmpty = () => {
        return showEmpty ? (
            <Empty text={route.params.type === 'year_share_withdraw' ? '暂无提现记录' : '暂无邀请记录'} />
        ) : null;
    };
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <View style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                {item?.map?.((html, idx, arr) => {
                    return html ? (
                        <View
                            key={html + idx}
                            style={[
                                idx === 0 || idx === arr.length - 1 ? {flex: 1} : {flex: 1.5},
                                idx === 0 ? {alignItems: 'flex-start'} : {alignItems: 'center'},
                                idx === arr.length - 1 ? {alignItems: 'flex-end'} : {},
                            ]}>
                            <HTML html={html} style={styles.itemText} />
                        </View>
                    ) : null;
                })}
            </View>
        );
    };

    useEffect(() => {
        if (page === 1) {
            init('refresh', true);
        } else {
            init('loadmore');
        }
    }, [page]);
    return list.length > 0 ? (
        <View style={styles.container}>
            <SectionList
                sections={list.length > 0 ? [{data: list, title: 'list'}] : []}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onRefresh={() => setPage(1)}
                refreshing={refreshing}
                renderItem={renderItem}
                renderSectionHeader={renderHeader}
                stickySectionHeadersEnabled
            />
        </View>
    ) : (
        <Loading />
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
