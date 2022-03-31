/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-12-29 15:55:31
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-01-04 11:23:53
 * @Description: 评论列表
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {px} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';
import Praise from '../../components/Praise';

export default ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);

    const init = (status) => {
        http.get('/community/comment/list/20220101', {
            page,
            ...route.params,
        }).then((res) => {
            setShowEmpty(true);
            setRefreshing(false);
            setHasMore(res.result.has_more);
            if (status === 'refresh') {
                setList(res.result.items || []);
            } else if (status === 'loadmore') {
                setList((prevList) => [...prevList, ...(res.result.items || [])]);
            }
        });
    };
    // 下拉刷新
    const onRefresh = () => {
        setPage(1);
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
    // 渲染底部
    const renderFooter = () => {
        return (
            list.length > 0 && (
                <View style={{paddingVertical: Space.padding}}>
                    <Text style={styles.emptyText}>
                        {hasMore ? '正在加载...' : `以上为全部${route.params.scene === 'product' ? '评论' : '留言'}`}
                    </Text>
                </View>
            )
        );
    };
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return showEmpty ? <Empty text={`暂无${route.params.scene === 'product' ? '评论' : '留言'}`} /> : null;
    }, [showEmpty]);
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <View style={styles.commentItem}>
                <View style={[Style.flexBetween, {alignItems: 'flex-start'}]}>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            source={{
                                uri: item.avatar,
                            }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.nickname}>{item.name}</Text>
                            <Text style={styles.commentDate}>{item.from || item.time}</Text>
                        </View>
                    </View>
                    <Praise comment={item} type="product" />
                </View>
                <Text style={styles.commentContent}>{item.content}</Text>
            </View>
        );
    };

    useEffect(() => {
        navigation.setOptions({title: route.params?.title || '全部评论'});
    }, []);

    useEffect(() => {
        if (page === 1) {
            init('refresh');
        } else {
            init('loadmore');
        }
    }, [page]);

    return (
        <View style={styles.container}>
            <FlatList
                data={list}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    commentItem: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    avatar: {
        marginRight: px(12),
        borderRadius: px(100),
        width: px(32),
        height: px(32),
    },
    nickname: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
    },
    commentDate: {
        marginTop: px(1),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    commentContent: {
        marginTop: px(8),
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    emptyText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
});
