/*
 * @Date: 2022-06-23 15:13:37
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-02 14:21:39
 * @Description: 基金榜单
 */
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors, Font, Space} from '~/common/commonStyle';
import CapsuleTabbar from '~/components/CapsuleTabbar';
import Empty from '~/components/EmptyTip';
import NavBar from '~/components/NavBar';
import ProductCards from '~/components/Portfolios/ProductCards';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import {getFeatureList, getRankList} from './services';

const Index = ({route}) => {
    const {rank_type, initialPage = 0} = route.params;
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);
    const [headImg, setHeadImg] = useState('');

    /** @name 上拉加载 */
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) {
            return false;
        }
        if (hasMore) {
            setPage((p) => p + 1);
        }
    };

    const renderItem = ({item, index}) => {
        return <ProductCards data={item} style={index === 0 ? {marginTop: 0} : {}} />;
    };

    /** @name 渲染底部 */
    const renderFooter = () => {
        return list.length > 0 ? (
            <Text
                style={[
                    styles.headerText,
                    {paddingVertical: Space.padding, paddingBottom: isIphoneX() ? 34 : Space.padding},
                ]}>
                {hasMore ? '正在加载...' : '我们是有底线的...'}
            </Text>
        ) : null;
    };

    /** @name 渲染空数据状态 */
    const renderEmpty = () => {
        return showEmpty ? <Empty text={'暂无基金数据'} /> : null;
    };

    const renderList = () => {
        return (
            <>
                <FlatList
                    data={list}
                    initialNumToRender={20}
                    keyExtractor={(item, index) => item + index}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    onRefresh={() => setPage(1)}
                    refreshing={refreshing}
                    renderItem={renderItem}
                    style={styles.flatList}
                />
            </>
        );
    };

    useEffect(() => {
        if (rank_type) {
            getRankList({
                page,
                rank_type,
            }).then((res) => {
                if (res.code === '000000') {
                    const {has_more, head_pic, list: _list = []} = res.result;
                    setShowEmpty(true);
                    setRefreshing(false);
                    setHasMore(has_more);
                    setHeadImg(head_pic);
                    if (page === 1) {
                        setList(_list);
                    } else {
                        setList((prev) => [...prev, ..._list]);
                    }
                }
            });
        } else {
            getFeatureList().then((res) => {
                if (res.code === '000000') {
                    const {header_pic, items = []} = res.result;
                    setHeadImg(header_pic);
                    setList(items);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return list?.length > 0 ? (
        <View style={styles.container}>
            {headImg ? (
                <Image source={{uri: headImg}} style={[styles.topBg, {height: rank_type ? px(268) : px(230)}]} />
            ) : null}
            <NavBar leftIcon={'chevron-left'} fontStyle={{color: '#fff'}} style={{backgroundColor: 'transparent'}} />
            {rank_type ? (
                <View style={styles.listContainer}>{renderList()}</View>
            ) : (
                <LinearGradient
                    colors={['rgba(255, 243, 243, 0.79)', '#F5F6F8']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 0.05}}
                    style={[styles.listContainer, {paddingTop: px(24)}]}>
                    <ScrollableTabView
                        initialPage={initialPage}
                        // onChangeTab={(value) => console.log(value)}
                        prerenderingSiblingsNumber={Infinity}
                        renderTabBar={(props) => (
                            <View>
                                <CapsuleTabbar {...props} boxStyle={styles.tabsContainer} />
                            </View>
                        )}
                        style={{flex: 1}}>
                        {list.map((tab) => {
                            const {items: tabItems = [], rank_type: key, title: tabTitle} = tab;
                            return (
                                <ScrollView
                                    key={key}
                                    scrollIndicatorInsets={{right: 1}}
                                    style={{paddingHorizontal: Space.padding}}
                                    tabLabel={tabTitle}>
                                    {tabItems.map((item, index, arr) => (
                                        <ProductCards
                                            data={item}
                                            key={index}
                                            style={{
                                                ...(index === 0 ? {marginTop: 0} : {}),
                                                ...(index === arr.length - 1
                                                    ? {marginBottom: isIphoneX() ? 34 : Space.marginVertical}
                                                    : {}),
                                            }}
                                        />
                                    ))}
                                </ScrollView>
                            );
                        })}
                    </ScrollableTabView>
                </LinearGradient>
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
    },
    topBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: px(268),
        zIndex: 9,
    },
    listContainer: {
        marginTop: px(100),
        borderRadius: px(8),
        flex: 1,
        position: 'relative',
        zIndex: 10,
    },
    flatList: {
        paddingHorizontal: Space.marginAlign,
        flex: 1,
    },
    headerText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
        textAlign: 'center',
    },
    tabsContainer: {
        paddingHorizontal: Space.padding,
        paddingBottom: px(18),
        width: deviceWidth,
    },
});

export default Index;
