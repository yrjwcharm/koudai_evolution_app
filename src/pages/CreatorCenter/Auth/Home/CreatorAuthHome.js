/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-18 20:03:10
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Auth/Home/CreatorAuthHome.js
 * @Description: 修改专题的入口
 */

import React, {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {deviceHeight, px} from '~/utils/appUtil';

import bellWhite from '~/assets/img/creatorCenter/bell-white.png';
import bellBlack from '~/assets/img/creatorCenter/bell-black.png';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Colors, Font, Style} from '~/common/commonStyle';

import Icon from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {getData, getList, getUnRead} from './services.js';
import FollowTable from './FollowTable';
import ScrollableTabBar from './ScrollableTabBar';

export default function CreatorAuthHome(props) {
    const inset = useSafeAreaInsets();
    const jump = useJump();

    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(true);
    const [listLoadingMore, setListLoadingMore] = useState(true);
    const [{system}, setUnreadData] = useState({});
    const [data, setData] = useState();
    const [list, setList] = useState([]);
    const [listHeader, setListHeader] = useState({});

    const [refreshing, setRefreshing] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [criticalState, setScrollCriticalState] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const navBarRef = useRef();

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            getUnRead().then((res) => {
                setUnreadData(res.result);
            });

            getData().then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    setLoading(false);
                    setTabs(res.result.items.map((it) => it.title));
                    const item = res.result.items[activeTab];
                    getListData(item, 1);
                }
            });
        }, [])
    );

    const getListData = (item, nextPage) => {
        if (nextPage > page) {
            setListLoadingMore(true);
        } else {
            setListLoading(true);
        }

        const oldActiveTab = activeTab;
        getList({type: item.type})
            .then((res) => {
                if (res.code === '000000' && oldActiveTab === activeTab) {
                    if (nextPage > page) {
                        setList(list.concat(res.result.items));
                    } else {
                        setList(res.result.items);
                    }

                    setListHeader(res.result.header);
                    setHasMore(res.result.hasMore);
                    setPage(nextPage);
                }
            })
            .catch((_) => {
                setPage(Math.max(1, nextPage - 1));
            })
            .finally((_) => {
                setListLoading(false);
                setListLoadingMore(false);
            });
    };

    const onScroll = (e) => {
        const y = e.nativeEvent.contentOffset.y;
        const criticalNum = 100;
        const interval = 1 / criticalNum;

        let opacity = 0;

        if (y > criticalNum) {
            opacity = 1;
        } else {
            opacity = interval * y;
        }

        if (opacity > 0.8) {
            !criticalState && setScrollCriticalState(true);
        } else {
            criticalState && setScrollCriticalState(false);
        }

        requestAnimationFrame(() => {
            navBarRef.current.setNativeProps({
                style: {backgroundColor: `rgba(255,255,255,${opacity})`},
            });
        });
    };

    const handleTabChange = useCallback(
        (idx) => {
            if (activeTab === idx) return;
            setActiveTab(idx);
            let item = data.items[idx];
            getListData(item, 1);
        },
        [data, activeTab]
    );

    const handleNoticeClick = () => {
        jump({
            path: 'MessageNotice',
            type: 1,
            params: {
                type: 'system',
            },
        });
    };

    const handleRefresh = () => {
        setRefreshing(true);
        getData()
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    setLoading(false);
                    setTabs(res.result.items.map((it) => it.title));
                    const item = res.result.items[activeTab];
                    getListData(item, 1);
                }
            })
            .finally((_) => setRefreshing(false));
    };
    const handleListNextPage = () => {
        if (!hasMore && listLoadingMore) return;
        const item = data.items[activeTab];
        getListData(item, page + 1);
    };

    const columns = useMemo(() => {
        if (!listHeader) return [];
        let cols = Object.keys(listHeader);
        cols = cols.filter((key) => key !== 'id');
        return cols;
    }, [listHeader]);

    if (loading) {
        return <Loading color={Colors.btnColor} />;
    }

    return (
        <View style={styles.container}>
            <View style={{width: '100%', height: px(265)}}>
                <FastImage source={{uri: data?.head?.bg_img}} style={styles.topBgImg} />
                <View style={[styles.navBar, {paddingTop: inset.top}]} ref={navBarRef}>
                    {criticalState && <Text style={styles.navTitle}>审核中心</Text>}
                    <TouchableOpacity activeOpacity={0.8} style={styles.bellWrap} onPress={handleNoticeClick}>
                        <FastImage source={criticalState ? bellBlack : bellWhite} style={styles.bell} />
                        {system ? (
                            <View style={[styles.point_sty, Style.flexCenter, {left: system > 99 ? px(11) : px(15)}]}>
                                <Text style={styles.point_text}>{system > 99 ? '99+' : system}</Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                style={{flex: 1, marginTop: px(-178)}}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} tintColor="#fff" onRefresh={handleRefresh} />}
                onScroll={onScroll}>
                <View style={{height: px(25)}} />
                <View style={styles.infoWrap}>
                    <FastImage
                        style={styles.avatar}
                        source={{
                            uri: data?.head?.info?.avatar,
                        }}
                    />
                    <View style={styles.nickNameWrap}>
                        <Text style={styles.nickName}>{data?.head?.info?.name}</Text>
                        <Text style={styles.desc}>{data?.head?.info?.desc}</Text>
                    </View>
                </View>
                <View style={styles.cardsWrap}>
                    <ScrollableTabBar
                        tabs={tabs}
                        activeTab={activeTab}
                        goToPage={handleTabChange}
                        style={{paddingHorizontal: px(15), marginTop: px(2)}}
                    />
                    <View
                        style={{
                            marginTop: px(12),
                            height: deviceHeight - px(44) - inset.top,
                            paddingBottom: inset.bottom,
                        }}>
                        <FollowTable
                            style={[styles.table, {}]}
                            data={list}
                            headerData={listHeader}
                            columns={columns}
                            isLoading={listLoading}
                            isLoadingMore={listLoadingMore}
                            scrollY={px(100)}
                            onloadMore={handleListNextPage}
                            stickyHeaderY={px(41)}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    topBgImg: {width: '100%', height: '100%', position: 'absolute', top: 0, left: 0},
    navBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: px(12),
        paddingRight: px(16),
        width: '100%',
    },
    navTitle: {
        position: 'absolute',
        left: px(14),
        bottom: px(10),
        width: '100%',
        textAlign: 'center',
        color: Colors.navTitleColor,
        fontWeight: 'bold',
        fontSize: px(17),
    },
    bellWrap: {
        marginVertical: px(10),
    },
    bell: {
        width: px(24),
        height: px(24),
    },
    point_sty: {
        position: 'absolute',
        left: px(15),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(20),
        zIndex: 3,
        minWidth: px(14),
        height: px(14),
        paddingHorizontal: 4,
    },
    point_text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: px(9),
        lineHeight: px(13),
        fontFamily: Font.numFontFamily,
    },
    infoWrap: {
        paddingHorizontal: px(20),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    avatar: {
        width: px(52),
        height: px(52),
        borderRadius: px(52),
        borderWidth: 2,
        borderColor: '#fff',
    },
    nickNameWrap: {
        marginLeft: px(16),
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    nickName: {
        fontSize: px(18),
        lineHeight: px(25),
        color: '#fff',
    },

    desc: {
        marginTop: px(2),
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
    },
    table: {
        marginTop: px(20),
        flex: 1,
        paddingBottom: px(30),
    },

    cardsWrap: {
        backgroundColor: '#F5F6F8',
        borderTopLeftRadius: px(12),
        borderTopRightRadius: px(12),
        paddingLeft: px(16),
        paddingTop: px(16),
        marginTop: px(24),
    },
});
