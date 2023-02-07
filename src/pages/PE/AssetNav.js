/*
 * @Date: 2021-02-26 16:16:16
 * @Description:私募净值
 */

import React, {useCallback, useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, getColor, Space, Style} from '~/common/commonStyle';
import http from '~/services';
import Empty from '~/components/EmptyTip';

/**
 * 渲染头部
 * @param header
 * @returns {JSX.Element}
 * @constructor
 */
export const Header = ({header}) => {
    return (
        <View style={[Style.flexRow, styles.header]}>
            {header?.map((item, index, arr) => {
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

/**
 * 渲染底部
 * @param hasMore
 * @returns {JSX.Element}
 * @constructor
 */
export const Footer = ({hasMore}) => {
    return (
        <Text style={[styles.headerText, {paddingBottom: Space.padding}]}>
            {hasMore ? '正在加载...' : '我们是有底线的...'}
        </Text>
    );
};

const AssetNav = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [header, setHeader] = useState([]);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);

    const init = useCallback(
        (status, first) => {
            http.get('/pe/asset_nav/20210101', {
                fund_code: route.params?.code,
                page,
            }).then((res) => {
                setShowEmpty(true);
                setRefreshing(false);
                setHasMore(res.result.has_more);
                first && navigation.setOptions({title: res.result.title || '历史净值'});
                first && setHeader(res.result.th);
                const {tr_list} = res.result;
                if (status === 'refresh') {
                    setList(tr_list || []);
                } else if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...(tr_list || [])]);
                }
            });
        },
        [navigation, route, page]
    );
    // 上拉加载
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) return false;
        hasMore && setPage((p) => p + 1);
    };
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <View style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                {item?.map((value, idx, arr) => {
                    return (
                        <Text
                            key={value + idx}
                            style={[
                                styles.itemText,
                                {fontFamily: Font.numFontFamily},
                                idx === 0 ? {textAlign: 'left'} : {},
                                idx === arr.length - 1
                                    ? {color: getColor(value.text, Colors.defaultColor), textAlign: 'right'}
                                    : {},
                            ]}>
                            {idx === arr.length - 1
                                ? parseFloat(value?.text?.replace(/,/g, '')) > 0
                                    ? `+${value.text}`
                                    : value.text
                                : value.text}
                        </Text>
                    );
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
    }, [page, init]);
    return (
        <View style={styles.container}>
            <SectionList
                sections={list.length > 0 ? [{data: list, title: 'list'}] : []}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={() => (list?.length > 0 ? <Footer hasMore={hasMore} /> : null)}
                ListEmptyComponent={() => (showEmpty ? <Empty text={'暂无净值数据'} /> : null)}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onRefresh={() => setPage(1)}
                refreshing={refreshing}
                renderItem={renderItem}
                renderSectionHeader={() => <Header header={header} />}
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

export default AssetNav;
