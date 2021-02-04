/*
 * @Date: 2021-02-01 10:18:42
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-02 19:00:32
 * @Description: 基金公告
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';

const FundAnnouncement = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([
        {
            title:
                '申万菱信沪深300指数增强C:申万菱信基金管理有限公司关于旗下部分基金新增招商银行招赢通为代销机构的公告',
            url: 'http://news.windin.com/bulletin/93008860.pdf?mediatype=03&&pkid=93008860&&id=121059264',
        },
        {
            title: '申万菱信沪深300指数增强C:关于旗下部分基金参加中国银行开展的费率优惠活动的公告',
            url: 'http://news.windin.com/bulletin/92706614.pdf?mediatype=03&&pkid=92706614&&id=120948374',
        },
        {
            title: '申万菱信沪深300指数增强C:关于旗下部分基金参加平安银行开展的费率优惠活动的公告',
            url: 'http://news.windin.com/bulletin/92706712.pdf?mediatype=03&&pkid=92706712&&id=120948568',
        },
        {
            title:
                '申万菱信沪深300指数增强C:申万菱信基金管理有限公司关于提请投资者更新过期身份证件或一代身份证件及对直销渠道未及时更新相关信息的客户限制办理部分业务的提示性公告',
            url: 'http://news.windin.com/bulletin/92578629.pdf?mediatype=03&&pkid=92578629&&id=120921680',
        },
        {
            title:
                '申万菱信沪深300指数增强C:申万菱信基金管理有限公司关于提请网上直销渠道个人投资者及时上传身份证件影印件及完善更新身份信息的第二次提示性公告',
            url: 'http://news.windin.com/bulletin/92578718.pdf?mediatype=03&&pkid=92578718&&id=120921852',
        },
    ]);

    const init = useCallback(
        (status, first) => {
            status === 'refresh' && setRefreshing(true);
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/announcement/20210101', {
                fund_code: (route.params && route.params.code) || '',
                page,
            }).then((res) => {
                setRefreshing(false);
                setHasMore(res.result.has_more);
                first && navigation.setOptions({title: res.result.title || '基金公告'});
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
    const onEndReached = useCallback(() => {
        if (hasMore) {
            setPage((p) => p + 1);
        }
    }, [hasMore]);
    // 渲染底部
    const renderFooter = useCallback(() => {
        return (
            <>
                {list.length > 0 && (
                    <View style={[styles.separator, {paddingVertical: Space.padding}]}>
                        <Text style={[styles.headerText]}>{hasMore ? '正在加载...' : '暂无更多了'}</Text>
                    </View>
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return <Empty text={'暂无基金公告'} />;
    }, []);
    // 渲染列表项
    const renderItem = useCallback(
        ({item, index, separators}) => {
            return (
                <TouchableOpacity
                    onPress={() => navigation.navigate({name: 'OpenPdf', params: {url: item.url, title: item.title}})}>
                    <View style={[Style.flexRow, styles.item]}>
                        <Text numberOfLines={3} style={[styles.itemText]}>
                            {item.title}
                        </Text>
                        <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                    </View>
                </TouchableOpacity>
            );
        },
        [navigation]
    );

    useEffect(() => {
        if (page === 1) {
            // init('refresh', true);
        } else {
            // init('loadmore');
        }
    }, [page, init]);
    return (
        <View style={styles.container}>
            <FlatList
                data={list}
                initialNumToRender={20}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
        backgroundColor: '#fff',
    },
    headerText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    item: {
        marginHorizontal: Space.marginAlign,
        paddingVertical: text(13),
    },
    itemText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.descColor,
        textAlign: 'justify',
        marginRight: text(8),
    },
    separator: {
        marginHorizontal: Space.marginAlign,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
});

export default FundAnnouncement;
