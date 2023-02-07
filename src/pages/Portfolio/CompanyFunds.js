/*
 * @Date: 2021-01-29 17:10:11
 * @Description: 旗下基金
 */
import React, {useCallback, useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text} from '~/utils/appUtil';
import {Colors, Font, getColor, Style} from '~/common/commonStyle';
import http from '~/services';
import Empty from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import {Footer, Header} from '~/pages/PE/AssetNav';

const CompanyFunds = ({navigation, route}) => {
    const jump = useJump();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [header, setHeader] = useState([]);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);

    const init = useCallback(
        (status, first) => {
            // status === 'refresh' && setRefreshing(true);
            http.get('/fund/company/funds/20210101', {
                company_id: route.params?.company_id,
                page,
            }).then((res) => {
                setShowEmpty(true);
                setRefreshing(false);
                setHasMore(res.result.has_more);
                first && setHeader(res.result.header);
                if (status === 'refresh') {
                    setList(res.result.list || []);
                } else if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...(res.result.list || [])]);
                }
            });
        },
        [route, page]
    );
    // 上拉加载
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) return false;
        hasMore && setPage((p) => p + 1);
    };
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => jump(item.url, 'push')}
                style={[Style.flexRow, styles.item, index % 2 === 1 ? {backgroundColor: Colors.bgColor} : {}]}>
                <Text numberOfLines={1} style={[styles.itemText]}>
                    {item.name}
                </Text>
                <Text
                    style={[
                        styles.itemText,
                        {
                            textAlign: 'right',
                            color: getColor(item.inc, Colors.defaultColor),
                            fontFamily: Font.numFontFamily,
                        },
                    ]}>
                    {parseFloat(item.inc?.replace(/,/g, '')) > 0 ? `+${item.inc}` : item.inc}
                </Text>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        navigation.setOptions({title: route.params.title || '旗下基金'});
    }, [navigation, route]);
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
                ListEmptyComponent={() => (showEmpty ? <Empty text={'暂无旗下基金'} /> : null)}
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
    },
});

export default CompanyFunds;
