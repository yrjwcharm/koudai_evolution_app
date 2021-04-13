/*
 * @Date: 2021-01-29 17:11:34
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-04-13 16:11:54
 * @Description:交易记录
 */
import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../../components/TabBar.js';
import http from '../../services/index.js';
import EmptyTip from '../../components/EmptyTip';
import {Colors, Style, Font} from '../../common/commonStyle.js';
import {px, tagColor} from '../../utils/appUtil.js';
import {useJump} from '../../components/hooks';
import Toast from '../../components/Toast/Toast.js';
const trade_type = [0, 3, 5, 6, 4, 7];
const mfb_type = [0, 1, 2];
const TradeRecord = ({route, navigation}) => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabActive, setActiveTab] = useState(0);
    const jump = useJump();
    const isMfb = route?.params?.fr == 'mfb';
    const getData = useCallback(
        (_page, toast) => {
            let Page = _page || page;
            setLoading(true);
            http.get(isMfb ? 'wallet/records/20210101' : '/order/records/20210101', {
                type: isMfb ? mfb_type[tabActive] : trade_type[tabActive],
                page: Page,
                poid: route.params?.poid,
                prod_code: route.params?.prod_code,
            })
                .then((res) => {
                    setLoading(false);
                    if (toast) {
                        Toast.show('交易记录已更新', {duration: 500});
                    }
                    if (Page == 1) {
                        setData(res.result.list);
                    } else {
                        setData((prevData) => {
                            return prevData.concat(res?.result?.list);
                        });
                    }
                    setHasMore(res.result.has_more);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [page, tabActive, route, isMfb]
    );
    useEffect(() => {
        getData();
    }, [getData]);
    const onLoadMore = () => {
        if (hasMore) {
            setPage(page + 1);
        }
    };
    const onRefresh = () => {
        // if (page == 1) {
        getData(1, 'toast');
        // } else {
        //     getData(1);
        //     // setPage(1);
        // }
    };
    const changeTab = (obj) => {
        setHasMore(false);
        setPage(1);
        setActiveTab(obj.i);
    };

    const tradeStuatusColor = (status) => {
        if (status < 0) {
            return Colors.red;
        } else if (status == 0 || status == 1) {
            return Colors.orange;
        } else if (status == 5 || status == 6) {
            return Colors.green;
        } else {
            return Colors.defaultColor;
        }
    };

    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingVertical: px(6)}]}>
                {hasMore ? (
                    <>
                        <ActivityIndicator size="small" animating={true} />
                        <Text style={{color: Colors.darkGrayColor, marginLeft: px(4)}}>正在加载...</Text>
                    </>
                ) : (
                    <Text style={{color: Colors.darkGrayColor, marginTop: px(16)}}>我们是有底线的...</Text>
                )}
            </View>
        );
    };
    const renderItem = ({item}) => {
        return (
            item && (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.card}
                    key={item?.time}
                    onPress={() => {
                        jump(item.url);
                    }}>
                    <>
                        <View style={Style.flexBetween}>
                            <View style={Style.flexRow}>
                                <View
                                    style={[
                                        Style.tag,
                                        {marginRight: px(8), backgroundColor: tagColor(item?.type?.val).bg_color},
                                    ]}>
                                    <Text style={{fontSize: px(11), color: tagColor(item?.type?.val).text_color}}>
                                        {item?.type?.text}
                                    </Text>
                                </View>
                                <Text style={{color: Colors.defaultColor, fontSize: px(14)}}>{item.name}</Text>
                            </View>
                            <Text style={styles.date}>{item.time}</Text>
                        </View>
                        <View style={[Style.flexRow, {paddingVertical: px(13)}]}>
                            {item?.items.map((_item, _index, arr) => (
                                <View
                                    key={_index}
                                    style={{
                                        flex: 1,
                                        alignItems:
                                            _index === 0
                                                ? 'flex-start'
                                                : _index === arr.length - 1
                                                ? 'flex-end'
                                                : 'center',
                                    }}>
                                    <Text style={styles.light_text}>{_item.k}</Text>
                                    <Text
                                        style={[
                                            styles.num_text,
                                            {
                                                fontFamily: _index != item?.items.length - 1 ? Font.numMedium : null,
                                                color:
                                                    _index == item?.items.length - 1
                                                        ? tradeStuatusColor(_item.v.val)
                                                        : Colors.defaultColor,
                                            },
                                        ]}>
                                        {_index == item?.items.length - 1 ? (
                                            <Text>{_item.v.text}</Text>
                                        ) : (
                                            <Text>{_item.v}</Text>
                                        )}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {item.notice ? (
                            <View style={styles.notice}>
                                <Text style={styles.notice_text}>{item.notice}</Text>
                            </View>
                        ) : null}
                    </>
                </TouchableOpacity>
            )
        );
    };

    const renderContent = () => {
        return (
            <FlatList
                data={data}
                ListEmptyComponent={!loading && <EmptyTip text={'暂无交易记录'} />}
                renderItem={renderItem}
                ListFooterComponent={!loading && data?.length > 0 && ListFooterComponent}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.2}
                onEndReached={onLoadMore}
                refreshing={loading}
                onRefresh={onRefresh}
            />
        );
    };

    return (
        <View style={{flex: 1, paddingTop: 1}}>
            {isMfb ? (
                <ScrollableTabView onChangeTab={changeTab} renderTabBar={() => <TabBar />} initialPage={0}>
                    <View tabLabel="全部" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="转入" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="转出" style={styles.container}>
                        {renderContent()}
                    </View>
                </ScrollableTabView>
            ) : (
                <ScrollableTabView
                    onChangeTab={changeTab}
                    renderTabBar={() => <TabBar />}
                    initialPage={0}
                    onScroll={(a) => {
                        // console.log(a);
                    }}>
                    <View tabLabel="全部" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="购买" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="定投" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="调仓" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="赎回" style={styles.container}>
                        {renderContent()}
                    </View>
                    <View tabLabel="分红" style={styles.container}>
                        {renderContent()}
                    </View>
                </ScrollableTabView>
            )}
        </View>
    );
};

export default TradeRecord;

const styles = StyleSheet.create({
    container: {backgroundColor: Colors.bgColor, flex: 1, paddingBottom: px(10)},
    card: {
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
        marginTop: px(12),
        paddingTop: px(16),
        borderRadius: 8,
        marginHorizontal: px(16),
    },
    date: {
        fontSize: px(12),
        fontFamily: Font.numRegular,
        color: Colors.lightGrayColor,
    },
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightGrayColor,
        marginBottom: px(3),
    },
    num_text: {
        fontSize: px(13),
        lineHeight: px(16),
    },
    notice: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    notice_text: {
        fontSize: px(12),
        color: Colors.lightGrayColor,
        height: px(36),
        lineHeight: px(36),
    },
});
