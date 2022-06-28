/*
 * @Date: 2022-06-22 14:14:23
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-28 17:21:13
 * @Description: 基金分类
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import sort from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Empty from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import HTML from '~/components/RenderHtml';
import TabBar from '~/components/ScrollTabbar';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import {debounce} from 'lodash';

const FundList = () => {
    const jump = useJump();
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);

    /** @name 上拉加载 */
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) {
            return false;
        }
        if (hasMore) {
            setPage((p) => p + 1);
        }
    };

    /** @name 渲染头部 */
    const renderHeader = () => {
        return (
            <View style={[Style.flexRow, styles.headerContainer]}>
                <View style={[Style.flexRow, {width: px(218)}]}>
                    <Text style={[styles.headerText, {marginLeft: px(40)}]}>{'基金名称'}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} style={[Style.flexRowCenter, {flex: 1}]}>
                    <Text style={styles.headerText}>{'净值'}</Text>
                    <Image source={sort} style={styles.sortIcon} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={[Style.flexRowCenter, {flex: 1}]}>
                    <Text style={styles.headerText}>{'近1年'}</Text>
                    <Image source={sortDown} style={styles.sortIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    /** @name 渲染列表项 */
    const renderItem = ({item, index}) => {
        const {fund_code, fund_name, nav, nav_inc} = item;
        return (
            <TouchableOpacity activeOpacity={0.8} style={[Style.flexRow, styles.fundItem]}>
                <View style={[Style.flexRow, styles.nameBox, {width: px(218)}]}>
                    <TouchableOpacity activeOpacity={0.8}>
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/06/public.png'}}
                            style={styles.collectIcon}
                        />
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                        <Text numberOfLines={1} style={styles.baseText}>
                            {fund_name}
                        </Text>
                        <Text style={styles.fundCode}>{fund_code}</Text>
                    </View>
                </View>
                <View style={[Style.flexRowCenter, {flex: 1}]}>
                    <HTML html={`${nav}`} style={styles.numberText} />
                </View>
                <View style={[Style.flexRowCenter, {flex: 1}]}>
                    <HTML html={nav_inc} style={styles.numberText} />
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

    useEffect(() => {
        setList([
            {
                fund_code: '000466',
                fund_name: '工银新能源汽车混合C',
                nav: 1.4336,
                nav_inc: '<span style="color: #E74949;">23.49%</span>',
            },
            {
                fund_code: '000467',
                fund_name: '平安策略先锋混合',
                nav: 1.4336,
                nav_inc: '<span style="color: #E74949;">23.49%</span>',
            },
        ]);
    }, []);

    return (
        <SectionList
            sections={list.length > 0 ? [{data: list, title: 'list'}] : []}
            initialNumToRender={20}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item) => item.fund_code}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            onRefresh={() => setPage(1)}
            refreshing={refreshing}
            renderItem={renderItem}
            renderSectionHeader={renderHeader}
            stickySectionHeadersEnabled
        />
    );
};

const Index = ({navigation, route}) => {
    const [tabs, setTabs] = useState([
        {label: '全部', value: 1},
        {label: 'A股', value: 2},
        {label: '美股', value: 3},
        {label: '港股', value: 4},
        {label: '黄金', value: 5},
        {label: '原油', value: 6},
        {label: '灵活配置', value: 7},
        {label: '灵活配置', value: 8},
        {label: '灵活配置', value: 9},
    ]);
    const [activeTab, setActiveTab] = useState(0);
    const [periods, setPeriods] = useState([
        {label: '近1月', value: 'm1'},
        {label: '近3月', value: 'm3'},
        {label: '近6月', value: 'm6'},
        {label: '近1年', value: 'y1'},
        {label: '近3年', value: 'y3'},
    ]);
    const [activePeriod, setActivePeriod] = useState('m1');

    const changePage = (p) => {
        setActiveTab(p);
    };

    const changePeriod = useCallback(
        debounce(
            (p) => {
                setActivePeriod(p);
            },
            500,
            {leading: true, trailing: false}
        ),
        []
    );

    useEffect(() => {
        navigation.setOptions({title: '基金分类'});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            <ScrollableTabView
                initialPage={0}
                onChangeTab={(value) => changePage(value.i)}
                prerenderingSiblingsNumber={1}
                renderTabBar={() => <TabBar btnColor={Colors.defaultColor} />}
                style={{flex: 1}}>
                {tabs.map((tab, index) => (
                    <View key={tab.value} style={styles.tabContentBox} tabLabel={tab.label}>
                        <FundList />
                    </View>
                ))}
            </ScrollableTabView>
            <View style={[Style.flexRowCenter, styles.barContainer]}>
                {periods.map((period, index) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={activePeriod === period.value}
                        key={period.value}
                        onPress={() => changePeriod(period.value)}
                        style={[
                            styles.barBox,
                            index === 0 ? {marginLeft: 0} : {},
                            activePeriod === period.value ? styles.activeBarBox : {},
                        ]}>
                        <Text style={[styles.barText, activePeriod === period.value ? styles.activeBarText : {}]}>
                            {period.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
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
        width: px(12),
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
