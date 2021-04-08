/*
 * @Date: 2021-02-03 10:00:26
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-07 16:32:53
 * @Description: 调仓信息
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import http from '../../services';
import Empty from '../../components/EmptyTip';

const AdjustInformation = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);

    const init = useCallback(
        (status, first) => {
            // status === 'refresh' && setRefreshing(true);
            http.get('/position/adjust_record/20210101', {
                poid: route.params?.poid || '',
                page,
            }).then((res) => {
                setRefreshing(false);
                if (res.result?.items?.length < 20) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                first && navigation.setOptions({title: res.result.title || '调仓信息'});
                if (status === 'refresh') {
                    setList(res.result.items || []);
                } else if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...(res.result.items || [])]);
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
                    <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>
                        {hasMore ? '正在加载...' : '我们是有底线的...'}
                    </Text>
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return <Empty text={'暂无调仓信息'} />;
    }, []);
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[Style.flexRow, styles.infoItem]}
                onPress={() => {
                    global.LogTool('click', 'adjust_record', item.lcmf_adjust_id);
                    navigation.navigate('HistoryAdjust', {
                        adjust_id: item.lcmf_adjust_id,
                        fr: 'holding',
                    });
                }}>
                <View style={{flex: 1, marginRight: text(12)}}>
                    <View style={[Style.flexRow, styles.titleBox]}>
                        <Text style={[styles.title, {marginRight: text(12)}]}>{item.adjust_name}</Text>
                        <Text style={[styles.subTitle, {color: item.color}]}>{item.adjust_status}</Text>
                    </View>
                    <View style={[Style.flexRow, styles.dateBox]}>
                        <View style={[Style.flexRow, {flex: 1}]}>
                            <Text style={[styles.subTitle, {marginRight: text(10)}]}>{'通知时间'}</Text>
                            <Text style={styles.date}>{item.notice_time}</Text>
                        </View>
                        <View style={[Style.flexRow, {flex: 1}]}>
                            <Text style={[styles.subTitle, {marginRight: text(10)}]}>{'调仓时间'}</Text>
                            <Text style={styles.date}>{item.adjust_time}</Text>
                        </View>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
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
            initialNumToRender={20}
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
        backgroundColor: Colors.bgColor,
        paddingHorizontal: Space.padding,
    },
    headerText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    infoItem: {
        marginTop: text(12),
        paddingHorizontal: Space.padding,
        borderRadius: text(4),
        // ...Space.boxShadow('#767FB6', 0, text(2), 0.08, text(10)),
        backgroundColor: '#fff',
    },
    titleBox: {
        flex: 1,
        paddingVertical: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    dateBox: {
        flex: 1,
        paddingTop: text(12),
        paddingBottom: Space.padding,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    subTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightGrayColor,
    },
    date: {
        fontSize: Font.textH3,
        lineHeight: text(14),
        color: Colors.lightBlackColor,
        fontFamily: Font.numFontFamily,
    },
});

export default AdjustInformation;
