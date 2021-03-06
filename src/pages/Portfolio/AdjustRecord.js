/*
 * @Date: 2021-03-04 15:24:59
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-05 10:16:27
 * @Description: 调仓记录
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import http from '../../services';
import Empty from '../../components/EmptyTip';
import HTML from '../../components/RenderHtml';

const AdjustRecord = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);

    const init = useCallback(
        (status, first) => {
            status === 'refresh' && setRefreshing(true);
            http.get('/portfolio/adjust/20210101', {
                upid: route.params?.poid || 1,
                page,
                scene: 'history',
            }).then((res) => {
                setRefreshing(false);
                setHasMore(res.result.record?.items?.length < 10 ? false : true);
                first && navigation.setOptions({title: res.result.title || '调仓记录'});
                if (status === 'refresh') {
                    setList(res.result.record?.items || []);
                } else if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...(res.result.record?.items || [])]);
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
    // 渲染底部
    const renderFooter = useCallback(() => {
        return (
            <>
                {list.length > 0 && (
                    <>
                        <View style={{borderBottomWidth: Space.borderWidth, borderColor: Colors.borderColor}} />
                        <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>
                            {hasMore ? '正在加载...' : '暂无更多了'}
                        </Text>
                    </>
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return <Empty text={'暂无调仓记录'} />;
    }, []);
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.adjustRecord, Style.flexRow]}
                onPress={() => navigation.navigate({name: 'HistoryAdjust', params: {id: item.id}})}>
                <View style={{flex: 1}}>
                    <Text style={[Style.flexRow, {textAlign: 'justify'}]}>
                        <Text style={[styles.recordTitle, {fontWeight: '500'}]}>{item.title}</Text>
                        <Text style={[styles.recordTitle, {fontSize: Font.textH3}]}>&nbsp;&nbsp;({item.date})</Text>
                    </Text>
                    <HTML numberOfLines={1} html={item.content} style={styles.recordDesc} />
                </View>
                <Icon name={'angle-right'} size={20} color={Colors.descColor} style={{marginLeft: text(12)}} />
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (page === 1) {
            init('refresh', true);
        } else {
            init('loadmore');
        }
    }, [page, init]);

    return (
        <FlatList
            data={list}
            initialNumToRender={10}
            ItemSeparatorComponent={() => (
                <View style={{borderBottomWidth: Space.borderWidth, borderColor: Colors.borderColor}} />
            )}
            keyExtractor={(item, index) => item + index}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={renderItem}
            style={[styles.container, {paddingBottom: insets.bottom}]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: Space.padding,
    },
    headerText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    adjustRecord: {
        paddingVertical: text(13),
    },
    recordTitle: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
    },
    recordDesc: {
        marginTop: text(6),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
});

export default AdjustRecord;
