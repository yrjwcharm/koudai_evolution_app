/*
 * @Date: 2022-03-14 17:22:17
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-03-15 16:38:37
 * @Description: 理性值记录
 */
import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Empty from '../../components/EmptyTip';
import HTML from '../../components/RenderHtml';
import http from '../../services';
import {px} from '../../utils/appUtil';

export default () => {
    const [, setPage] = useState(1);
    const [refreshing] = useState(false);
    const [hasMore] = useState(false);
    const [data, setData] = useState(new Map());
    const [showEmpty, setShowEmpty] = useState(false);

    // 渲染列表项
    const renderItem = ({item}) => {
        return (
            <View style={styles.recordContainer}>
                <View style={styles.dotLine} />
                <View style={Style.flexRow}>
                    <View style={styles.circle} />
                    <Text style={styles.dateText}>{item[0]}</Text>
                </View>
                <View style={{paddingLeft: px(15)}}>
                    {item[1]?.map?.((record, index) => {
                        return (
                            <View
                                key={record + index}
                                style={[Style.flexBetween, styles.recordItem, index === 0 ? {marginTop: px(8)} : {}]}>
                                {/* <TouchableOpacity activeOpacity={0.8} style={{marginRight: px(24), flex: 1}}>
                                    <HTML html={record.content} style={styles.content} />
                                </TouchableOpacity> */}
                                <Text style={styles.content}>
                                    {record.prefix}
                                    <Text style={{color: Colors.brandColor}}>{record.content}</Text>
                                </Text>
                                <Text style={styles.numText}>{record.score_text}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    // 渲染空数据状态
    const renderEmpty = () => {
        return showEmpty ? <Empty text={'暂无基金公告'} /> : null;
    };

    // 渲染底部
    const renderFooter = () => {
        return (
            <>
                {data.size > 0 && (
                    <View style={{paddingVertical: Space.padding}}>
                        <Text style={styles.footerText}>{hasMore ? '正在加载...' : '我们是有底线的...'}</Text>
                    </View>
                )}
            </>
        );
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

    useEffect(() => {
        http.get('http://127.0.0.1:4523/mock/587315/rational/score/list/20220315').then((res) => {
            if (res.code === '000000') {
                setData((prev) => {
                    const next = new Map(prev);
                    res.result?.forEach?.((item) => {
                        if (next.has(item.time)) {
                            next.get(item.time).push?.(item);
                        } else {
                            next.set(item.time, [item]);
                        }
                    });
                    return next;
                });
                setShowEmpty(true);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                bounces={false}
                data={Array.from(data.entries())}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onRefresh={() => setPage(1)}
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
    recordContainer: {
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        position: 'relative',
    },
    dotLine: {
        position: 'absolute',
        top: px(18),
        left: px(19),
        width: Space.borderWidth,
        height: '100%',
        backgroundColor: Colors.borderColor,
    },
    circle: {
        marginRight: px(8),
        borderRadius: px(6),
        borderWidth: px(1),
        borderColor: '#BDC2CC',
        width: px(6),
        height: px(6),
    },
    dateText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    footerText: {
        flex: 1,
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    recordItem: {
        marginTop: px(12),
        padding: px(12),
        paddingRight: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    content: {
        marginRight: px(24),
        flex: 1,
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    numText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#EB7121',
        fontFamily: Font.numFontFamily,
    },
});
