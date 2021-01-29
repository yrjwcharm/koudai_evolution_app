/*
 * @Date: 2021-01-29 17:10:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-29 20:17:38
 * @Description: 历史净值
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const HistoryNav = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);

    const init = useCallback(
        (status, first) => {
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/nav/history/20210101', {
                fund_code: (route.params && route.params.code) || '',
                page,
            }).then((res) => {
                setRefreshing(false);
                setHasMore(res.result.has_more);
                first && navigation.setOptions({title: res.result.title || '历史净值'});
                if (status === 'refresh') {
                    setList(res.result.list);
                } else if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...res.result.list]);
                }
            });
        },
        [navigation, route, page]
    );
    const onRefresh = useCallback(() => {
        setPage(1);
        setRefreshing(true);
        init('refresh');
    }, [init]);
    const onEndReached = useCallback(() => {
        if (hasMore) {
            setPage((p) => p + 1);
            init('loadmore');
        }
    }, [init, hasMore]);
    const renderHeader = useCallback(() => {
        return (
            <View style={[Style.flexRow, styles.header]}>
                <Text style={[styles.headerText, {textAlign: 'left'}]}>{'日期'}</Text>
                <Text style={[styles.headerText]}>{'单位净值'}</Text>
                <Text style={[styles.headerText]}>{'历史净值'}</Text>
                <Text style={[styles.headerText, {textAlign: 'right'}]}>{'日涨跌'}</Text>
            </View>
        );
    }, []);
    const renderFooter = useCallback(() => {
        return (
            <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>{hasMore ? '正在加载...' : ''}</Text>
        );
    }, [hasMore]);
    const renderEmpty = useCallback(() => {
        return (
            <View style={[styles.noData, Style.flexCenter]}>
                <Image source={require('../../assets/personal/noData.png')} style={styles.noDataImg} />
                <Text style={styles.noDataText}>{'暂无历史净值数据'}</Text>
            </View>
        );
    }, []);
    const renderItem = useCallback(
        ({item, index}) => {
            return (
                <View
                    key={index}
                    style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                    <Text style={[styles.itemText, {textAlign: 'left'}]}>{item[0]}</Text>
                    <Text style={[styles.itemText]}>{item[1]}</Text>
                    <Text style={[styles.itemText]}>{item[2]}</Text>
                    <Text
                        style={[
                            styles.itemText,
                            {textAlign: 'right', color: getColor(item[3]), fontFamily: Font.numFontFamily},
                        ]}>
                        {parseFloat(item[3].replaceAll(',', '')) > 0 ? `+${item[3]}` : item[3]}
                    </Text>
                </View>
            );
        },
        [getColor]
    );
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
        init('refresh', true);
    }, [init]);
    return (
        <View style={styles.container}>
            <FlatList
                data={list}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.9}
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
    noData: {
        paddingVertical: text(110),
    },
    noDataImg: {
        width: text(172),
        height: text(96),
        marginBottom: text(36),
    },
    noDataText: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
});

export default HistoryNav;
