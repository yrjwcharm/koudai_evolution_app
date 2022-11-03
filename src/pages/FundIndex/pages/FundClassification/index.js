/*
 * @Date: 2022-06-22 14:14:23
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-03 19:28:59
 * @Description: 基金分类
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import sort from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import favor from '~/assets/img/icon/favor.png';
import not_favor from '~/assets/img/icon/not_favor.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Empty from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import HTML from '~/components/RenderHtml';
import TabBar from '~/components/ScrollTabbar';
import Toast from '~/components/Toast';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import {debounce} from 'lodash';
import {getFundCate, getFundList} from './services';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';

const FundList = ({activePeriod, activeTab, periodsObj}) => {
    const jump = useJump();
    const [period, setPeriod] = useState(activePeriod);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [sortType, setSortType] = useState('');
    const clickRef = useRef(true);
    const listRef = useRef();

    const isMonetary = useMemo(() => activeTab === 160401, [activeTab]);

    /** @name 上拉加载 */
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) return false;
        if (hasMore) setPage((p) => p + 1);
    };

    /** @name 渲染头部 */
    const renderHeader = () => {
        const icon1 = sortBy === 'nav' ? (sortType === 1 ? sortUp : sortType === 2 ? sortDown : sort) : sort;
        const icon2 = sortBy === 'inc' ? (sortType === 1 ? sortUp : sortType === 2 ? sortDown : sort) : sort;
        /** @name 更改排序 1 从小到大 2 从大到小 */
        const changeSort = (by) => {
            if (sortBy) {
                if (sortBy === by) {
                    sortType === 2 && setSortType(1);
                    sortType === 1 && setSortType('');
                    sortType === 1 && setSortBy('');
                } else {
                    setSortBy(by);
                    setSortType(2);
                }
            } else {
                setSortBy(by);
                setSortType(2);
            }
            setPage(1);
        };
        return (
            <View style={[Style.flexRow, styles.headerContainer]}>
                <View style={[Style.flexRow, {width: px(220)}]}>
                    <Text style={[styles.headerText, {marginLeft: px(40)}]}>{'基金名称'}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => changeSort('nav')}
                    style={[Style.flexRowCenter, {flex: 1}]}>
                    <Text style={styles.headerText}>{isMonetary ? '万分收益' : '净值'}</Text>
                    <Image source={icon1} style={styles.sortIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => changeSort('inc')}
                    style={[Style.flexRowCenter, {flex: 1}]}>
                    <Text style={styles.headerText}>{isMonetary ? '七日年化' : periodsObj[activePeriod]}</Text>
                    <Image source={icon2} style={styles.sortIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    /** @name 渲染列表项 */
    const renderItem = ({item, index}) => {
        const {code, is_favor, name, nav, url, yield: nav_inc} = item;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    global.LogTool({ctrl: activeTab, event: 'fund_click', oid: code});
                    jump(url);
                }}
                style={[Style.flexRow, styles.fundItem]}>
                <View style={[Style.flexRow, styles.nameBox, {width: px(220)}]}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => onFavor(item, index)}>
                        <Image source={is_favor ? favor : not_favor} style={styles.collectIcon} />
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                        <Text numberOfLines={1} style={styles.baseText}>
                            {name}
                        </Text>
                        <Text style={styles.fundCode}>{code}</Text>
                    </View>
                </View>
                <View style={[Style.flexRowCenter, {flex: 1}]}>
                    <HTML html={`${nav}`} style={styles.numberText} />
                </View>
                <View style={[Style.flexRowCenter, {flex: 1}]}>
                    <HTML html={`${nav_inc}`} style={styles.numberText} />
                </View>
            </TouchableOpacity>
        );
    };

    /** @name 渲染底部 */
    const renderFooter = () => {
        return list.length > 0 ? (
            <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>
                {hasMore ? '正在加载...' : '我们是有底线的...'}
            </Text>
        ) : null;
    };

    /** @name 渲染空数据状态 */
    const renderEmpty = () => {
        return showEmpty ? <Empty text={'暂无基金数据'} /> : null;
    };

    /** @name 关注/取消关注 */
    const onFavor = ({code, is_favor}, index) => {
        clickRef.current = false;
        (is_favor ? followCancel : followAdd)({item_id: code, item_type: 1}).then((res) => {
            if (res.code === '000000') {
                res.message && Toast.show(res.message);
                setTimeout(() => {
                    clickRef.current = true;
                }, 100);
                setList((prev) => {
                    const next = [...prev];
                    next[index].is_favor = is_favor ? 0 : 1;
                    return next;
                });
            }
        });
    };

    const getList = () => {
        getFundList({
            cate_type: activeTab,
            page,
            period,
            sort_by: sortBy,
            sort_type: sortType,
        }).then((res) => {
            if (res.code === '000000') {
                const {has_more, list: _list = []} = res.result;
                setShowEmpty(true);
                setRefreshing(false);
                setHasMore(has_more);
                if (page === 1) {
                    setList((prev) => {
                        if (prev.length > 0) {
                            listRef.current?.scrollToOffset({animated: false, offset: 0});
                        }
                        return _list;
                    });
                } else {
                    setList((prev) => [...prev, ..._list]);
                }
            }
        });
    };

    useEffect(() => {
        setPage(1);
        setPeriod(activePeriod);
    }, [activePeriod]);

    useEffect(() => {
        getList();
    }, [activeTab, page, period, sortBy, sortType]);

    return (
        <FlatList
            data={list}
            initialNumToRender={20}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => item.code + index}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={renderHeader}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            onRefresh={() => (page > 1 ? setPage(1) : getList())}
            ref={listRef}
            refreshing={refreshing}
            renderItem={renderItem}
            scrollIndicatorInsets={{right: 1}}
            stickyHeaderIndices={[0]}
            style={styles.tabContentBox}
        />
    );
};

const Index = ({navigation, route}) => {
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [periods, setPeriods] = useState([]);
    const [activePeriod, setActivePeriod] = useState();
    const scrollTab = useRef();

    const isMonetary = useMemo(() => {
        return tabs?.[activeTab]?.cate_type === 160401;
    }, [activeTab, tabs]);

    const periodsObj = useMemo(() => {
        return periods.reduce((prev, curr) => {
            prev[curr.period_inc] = curr.name;
            return prev;
        }, {});
    }, [periods]);

    const changePeriod = useCallback(
        debounce(
            (p) => {
                global.LogTool({ctrl: p, event: 'fund_timeclassification'});
                setActivePeriod(p);
            },
            500,
            {leading: true, trailing: false}
        ),
        []
    );

    useEffect(() => {
        getFundCate().then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '基金分类'});
                const {navigations, period_tabs} = res.result;
                setActivePeriod(period_tabs.default);
                setActiveTab(navigations.default);
                setPeriods(period_tabs.items);
                setTabs(navigations.items);
            }
        });
    }, []);

    useEffect(() => {
        setTimeout(() => {
            tabs.length > 0 && scrollTab.current?.goToPage?.(activeTab);
        });
    }, [tabs]);

    return tabs?.length > 0 ? (
        <View style={styles.container}>
            <ScrollableTabView
                initialPage={0}
                onChangeTab={({i}) => {
                    setActiveTab(i);
                    global.LogTool({ctrl: i + 1, event: 'fund_classification'});
                }}
                ref={scrollTab}
                renderTabBar={() => <TabBar boxStyle={{backgroundColor: '#fff'}} btnColor={Colors.defaultColor} />}
                style={{flex: 1}}>
                {tabs.map((tab) => (
                    <View key={tab.cate_type} style={{flex: 1}} tabLabel={tab.cate_name}>
                        <FundList activePeriod={activePeriod} activeTab={tab.cate_type} periodsObj={periodsObj} />
                    </View>
                ))}
            </ScrollableTabView>
            {!isMonetary && (
                <View style={[Style.flexRowCenter, styles.barContainer]}>
                    {periods.map((period, index) => {
                        const isActive = activePeriod === period.period_inc;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isActive}
                                key={period.period_inc}
                                onPress={() => changePeriod(period.period_inc)}
                                style={[
                                    styles.barBox,
                                    index === 0 ? {marginLeft: 0} : {},
                                    isActive ? styles.activeBarBox : {},
                                ]}>
                                <Text style={[styles.barText, isActive ? styles.activeBarText : {}]}>
                                    {period.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        paddingTop: 1,
    },
    tabContentBox: {
        flex: 1,
        paddingBottom: Space.padding,
    },
    barContainer: {
        paddingVertical: Space.padding,
        paddingBottom: isIphoneX() ? 34 : Space.padding,
        backgroundColor: '#fff',
    },
    barBox: {
        marginLeft: px(12),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
        borderWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
        minWidth: px(56),
        alignItems: 'center',
    },
    activeBarBox: {
        borderColor: '#DEE8FF',
        backgroundColor: '#DEE8FF',
    },
    barText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    activeBarText: {
        color: Colors.brandColor,
        fontWeight: Font.weightMedium,
    },
    headerContainer: {
        paddingVertical: px(8),
        backgroundColor: Colors.bgColor,
    },
    headerText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
        textAlign: 'center',
    },
    sortIcon: {
        marginLeft: px(2),
        width: px(8),
        height: px(12),
    },
    fundItem: {
        height: px(58),
        backgroundColor: '#fff',
    },
    nameBox: {
        paddingRight: 2 * Space.padding,
        paddingLeft: Space.padding,
    },
    collectIcon: {
        marginRight: px(12),
        width: px(16),
        height: px(16),
    },
    baseText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    fundCode: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    numberText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    separator: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
});

export default Index;
