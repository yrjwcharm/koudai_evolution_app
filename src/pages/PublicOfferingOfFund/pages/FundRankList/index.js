/*
 * @Date: 2022-06-23 15:13:37
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-14 11:10:25
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
import PKBall from '~/pages/PK/components/PKBall';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import {getFeatureList, getRankList} from './services';

const Index = ({route}) => {
    const {rank_type, initialPage = 0} = route.params;
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [title, setTitle] = useState('');
    const [list, setList] = useState([]);
    const [showEmpty, setShowEmpty] = useState(false);
    const [headImg, setHeadImg] = useState('');
    const [scrollY, setScrollY] = useState(0);

    /** @name 上拉加载 */
    const onEndReached = ({distanceFromEnd}) => {
        // console.log(distanceFromEnd);
        // if (distanceFromEnd < 0) {
        //     return false;
        // }
        if (hasMore) {
            setPage((p) => p + 1);
        }
    };

    const renderItem = ({item, index}) => {
        return (
            <View style={{paddingHorizontal: Space.padding}}>
                <ProductCards data={item} style={index === 0 ? {marginTop: px(-80)} : {}} />
            </View>
        );
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
            <View style={styles.listContainer}>
                <FlatList
                    data={list}
                    initialNumToRender={20}
                    keyExtractor={(item, index) => item + index}
                    ListHeaderComponent={headImg ? <Image source={{uri: headImg}} style={styles.topBg} /> : null}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.9}
                    onRefresh={() => (page > 1 ? setPage(1) : getData())}
                    onScroll={({
                        nativeEvent: {
                            contentOffset: {y},
                        },
                    }) => setScrollY(y)}
                    refreshing={refreshing}
                    renderItem={renderItem}
                    scrollIndicatorInsets={{right: 1}}
                    style={styles.flatList}
                />
                <PKBall />
            </View>
        );
    };

    const getData = () => {
        if (rank_type) {
            getRankList({
                page,
                rank_type,
            })
                .then((res) => {
                    if (res.code === '000000') {
                        const {has_more, head_pic, list: _list = []} = res.result;
                        setShowEmpty(true);
                        setRefreshing(false);
                        setHasMore(has_more);
                        setHeadImg(head_pic);
                        setTitle(res.result.title);
                        if (page === 1) {
                            setList(_list);
                        } else {
                            setList((prev) => [...prev, ..._list]);
                        }
                    }
                })
                .finally(() => {
                    setShowEmpty(true);
                    setRefreshing(false);
                });
        } else {
            getFeatureList()
                .then((res) => {
                    if (res.code === '000000') {
                        setShowEmpty(true);
                        const {header_pic, items = []} = res.result;
                        setHeadImg(header_pic);
                        const {plateid, rec_json} = items[0];
                        plateid && rec_json && global.LogTool({event: 'rec_show', plateid, rec_json});
                        setList(items);
                    }
                })
                .finally(() => {
                    setShowEmpty(true);
                });
        }
    };

    useEffect(() => {
        global.LogTool({ctrl: rank_type || 'mofang', event: 'view'});
    }, [rank_type]);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <View style={styles.container}>
            {headImg ? (
                <>
                    <NavBar
                        leftIcon={'chevron-left'}
                        fontStyle={{color: scrollY > 0 || scrollY < -60 ? Colors.navLeftTitleColor : '#fff'}}
                        style={{
                            backgroundColor: scrollY > 0 ? '#fff' : 'transparent',
                            opacity: scrollY < 50 && scrollY > 0 ? scrollY / 50 : 1,
                            position: 'absolute',
                        }}
                        title={scrollY > 0 ? title : ''}
                    />
                    {rank_type ? (
                        // 有分页榜单
                        renderList()
                    ) : (
                        // 无分页榜单
                        <>
                            {headImg ? (
                                <Image
                                    source={{uri: headImg}}
                                    style={[styles.topBg, {position: 'absolute', height: px(230)}]}
                                />
                            ) : null}
                            <LinearGradient
                                colors={['rgba(255, 243, 243, 0.79)', '#F5F6F8']}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 0.05}}
                                style={styles.scrollTabContainer}>
                                <ScrollableTabView
                                    initialPage={initialPage}
                                    onChangeTab={({i}) => {
                                        const {plateid, rec_json} = list[i];
                                        plateid && rec_json && global.LogTool({event: 'rec_show', plateid, rec_json});
                                    }}
                                    prerenderingSiblingsNumber={Infinity}
                                    renderTabBar={(props) => (
                                        <View>
                                            <CapsuleTabbar {...props} boxStyle={styles.tabsContainer} />
                                        </View>
                                    )}
                                    style={{flex: 1}}>
                                    {list.map((tab) => {
                                        const {
                                            items: tabItems = [],
                                            plateid,
                                            rank_type: key,
                                            rec_json,
                                            title: tabTitle,
                                        } = tab;
                                        return (
                                            <ScrollView
                                                bounces={false}
                                                key={key}
                                                scrollIndicatorInsets={{right: 1}}
                                                style={{paddingHorizontal: Space.padding}}
                                                tabLabel={tabTitle}>
                                                {tabItems?.length > 0
                                                    ? tabItems.map((item, index, arr) => (
                                                          <ProductCards
                                                              data={{
                                                                  ...item,
                                                                  LogTool: () => {
                                                                      plateid &&
                                                                          rec_json &&
                                                                          global.LogTool({
                                                                              event: 'rec_click',
                                                                              plateid,
                                                                              rec_json,
                                                                          });
                                                                  },
                                                              }}
                                                              key={index}
                                                              style={{
                                                                  ...(index === 0 ? {marginTop: 0} : {}),
                                                                  ...(index === arr.length - 1
                                                                      ? {
                                                                            marginBottom: isIphoneX()
                                                                                ? 34
                                                                                : Space.marginVertical,
                                                                        }
                                                                      : {}),
                                                              }}
                                                          />
                                                      ))
                                                    : renderEmpty()}
                                            </ScrollView>
                                        );
                                    })}
                                </ScrollableTabView>
                                <PKBall />
                            </LinearGradient>
                        </>
                    )}
                </>
            ) : (
                <Loading />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topBg: {
        top: 0,
        left: 0,
        width: deviceWidth,
        height: px(268),
        zIndex: 8,
    },
    listContainer: {
        flex: 1,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    scrollTabContainer: {
        marginTop: px(182),
        paddingTop: px(24),
        borderRadius: px(8),
        flex: 1,
        position: 'relative',
        zIndex: 9,
    },
    flatList: {
        backgroundColor: Colors.bgColor,
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
