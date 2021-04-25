/*
 * @Date: 2021-03-08 15:03:20
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-13 21:32:30
 * @Description: 历史投资计划
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import http from '../../services';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Empty from '../../components/EmptyTip';

const HistoryInvestPlan = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);

    const init = useCallback(
        (status, first) => {
            http.get('/position/history_deploy/20210101', {
                poid: route.params?.poid || 'X04F000002',
                page,
            }).then((res) => {
                setShowEmpty(true);
                setRefreshing(false);
                setHasMore(res.result.has_more);
                first && navigation.setOptions({title: res.result.title || '历史投资计划'});
                if (status === 'refresh') {
                    const table_list =
                        res.result.table_list?.map((item) => ({
                            ...item,
                            activeSections: item.extend ? [0] : [],
                        })) || [];
                    setList(table_list);
                } else if (status === 'loadmore') {
                    const table_list =
                        res.result.table_list?.map((item) => ({
                            ...item,
                            activeSections: item.extend ? [0] : [],
                        })) || [];
                    setList((prevList) => [...prevList, ...table_list]);
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
                    <Text style={[styles.tableHeadText, {paddingVertical: Space.padding}]}>
                        {hasMore ? '正在加载...' : '我们是有底线的...'}
                    </Text>
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return showEmpty ? <Empty text={'暂无历史投资计划'} /> : null;
    }, [showEmpty]);
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <Accordion
                sections={[item]}
                touchableProps={{activeOpacity: 0.8}}
                activeSections={item.activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={(active) => updateSections(index, active)}
                touchableComponent={TouchableOpacity}
            />
        );
    };
    const renderHeader = (section, index, isActive) => {
        return (
            <View style={[Style.flexBetween, {padding: Space.padding, backgroundColor: '#fff'}]}>
                <Text style={styles.headText}>{section.title}</Text>
                <Icon name={`${isActive ? 'angle-up' : 'angle-down'}`} size={20} color={Colors.descColor} />
            </View>
        );
    };
    const renderContent = (section) => {
        return (
            <View>
                <View style={[Style.flexRow, styles.tableHead]}>
                    <Text style={[styles.tableHeadText, {textAlign: 'left'}]}>{section?.th?.name}</Text>
                    <Text style={[styles.tableHeadText, {textAlign: 'right'}]}>{section?.th?.ratio}</Text>
                </View>
                {section?.tr_list?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={item + index}
                            onPress={() => {
                                global.LogTool('click', 'fund', item.code);
                                navigation.navigate('FundDetail', {code: item.code});
                            }}
                            style={[
                                Style.flexRow,
                                styles.tableRow,
                                index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {},
                            ]}>
                            <View>
                                <Text numberOfLines={1} style={[styles.tableRowText]}>
                                    {item.name}
                                </Text>
                                <Text style={[styles.tableRowText, {fontFamily: Font.numRegular}]}>{item.code}</Text>
                            </View>
                            <Text style={[styles.tableRowText, {textAlign: 'right', fontFamily: Font.numRegular}]}>
                                {item.percent}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    const updateSections = (index, active) => {
        // console.log(index, active);
        setList((prev) => {
            prev[index].activeSections = active;
            return [...prev];
        });
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
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => item + index}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={renderItem}
            style={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingTop: text(10),
    },
    headText: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
    },
    tableHead: {
        height: text(36),
        backgroundColor: Colors.bgColor,
        paddingHorizontal: Space.padding,
    },
    tableHeadText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    tableRow: {
        paddingVertical: text(14),
        backgroundColor: '#fff',
        paddingHorizontal: Space.padding,
    },
    tableRowText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    separator: {
        marginBottom: text(10),
    },
});

export default HistoryInvestPlan;
