/*
 * @Date: 2022-10-08 15:06:39
 * @Description: 社区首页
 */
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Image from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import WaterFlow from 'react-native-waterflow-list';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import close from '~/assets/img/icon/close.png';
import live from '~/assets/img/vision/live.gif';
import listIcon from '~/assets/img/community/list.png';
import waterflowIcon from '~/assets/img/community/waterflow.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import AnimateAvatar from '~/components/AnimateAvatar';
import {Button} from '~/components/Button';
import EmptyTip from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import {BottomModal} from '~/components/Modal';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';
import {CommunityCard} from '../components/CommunityCard';
import {
    getAllMsg,
    getCanPublishContent,
    getFollowedData,
    getNewsData,
    getPageData,
    getRecommendData,
    getRecommendFollowUsers,
    saveShowType,
} from './services';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import actionTypes from '~/redux/actionTypes';
import {debounce, groupBy, isEqual, sortBy} from 'lodash';
import hintIcon from '~/assets/img/hint-icon.png';
import * as Animatable from 'react-native-animatable';
import {TextInput} from 'react-native-gesture-handler';

/** @name 社区头部 */
const Header = ({active, isLogin, message_url, newsData, refresh, search_url, setActive, tabs, userInfo = {}}) => {
    const jump = useJump();
    const insets = useSafeAreaInsets();
    const {url, user: {avatar} = {}} = userInfo;
    const [allMsg, setAll] = useState(0);

    useFocusEffect(
        useCallback(() => {
            isLogin
                ? getAllMsg().then((res) => {
                      if (res.code === '000000') {
                          setAll(res.result.all);
                      }
                  })
                : setActive(1);
        }, [isLogin])
    );

    return (
        <View style={[Style.flexBetween, styles.header, {paddingTop: insets.top + px(5)}]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => jump(url)}>
                <Image
                    source={{
                        uri: avatar,
                    }}
                    style={styles.avatar}
                />
            </TouchableOpacity>
            <View style={Style.flexRow}>
                {tabs?.map((tab, i) => {
                    const {name, type} = tab;
                    const needRefresh =
                        type === 'follow' ? newsData?.communityFollowNews : newsData?.communityRecommendNews;
                    return (
                        <TouchableOpacity
                            activeOpacity={active === i ? 1 : 0.8}
                            key={type}
                            onPress={() => {
                                global.LogTool({event: `${type}_click`});
                                if (type === 'follow' && !isLogin) jump({path: 'Register', type: 1});
                                else {
                                    setActive(i);
                                    needRefresh && refresh?.(i);
                                }
                                active === i && refresh?.(i);
                            }}
                            style={{marginLeft: i === 0 ? px(30) : px(20)}}>
                            <Text style={[styles.headerTabText, active === i ? styles.activeTabText : {}]}>{name}</Text>
                            {needRefresh && <View style={styles.redPoint} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={Style.flexRow}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => jump(search_url)} style={{marginRight: px(12)}}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/09/header-right.png'}}
                        style={styles.headerRightIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => jump(message_url)}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/09/message-centre.png'}}
                        style={styles.headerRightIcon}
                    />
                    {allMsg && isLogin ? (
                        <View style={[styles.allMsg, Style.flexCenter, {left: allMsg > 99 ? px(11) : px(15)}]}>
                            <Text style={styles.msgNum}>{allMsg > 99 ? '99+' : allMsg}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>
        </View>
    );
};

/** @name 推荐关注 */
const RecommendFollow = forwardRef(({refresh}, ref) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);

    const allFollowed = useMemo(() => {
        return data.every((item) => item.status === 1);
    }, [data]);

    const init = () => {
        getRecommendFollowUsers()
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    /** @name 关注/取消关注 */
    const onFollow = useCallback(
        debounce(
            ({isFollowed, item_id, item_type}) => {
                global.LogTool({event: isFollowed ? 'cancel_follow' : 'follow_user', oid: item_id});
                (isFollowed ? followCancel : followAdd)({item_id, item_type}).then((res) => {
                    res.message && Toast.show(res.message);
                    if (res.code === '000000') init();
                });
            },
            500,
            {leading: true, trailing: false}
        ),
        []
    );

    /** @name 一键关注 */
    const allFollow = useCallback(
        debounce(
            () => {
                global.LogTool({event: 'follow_button'});
                const _data = groupBy(data, (item) => item.item_type);
                Promise.all(
                    Object.entries(_data).map((item) =>
                        followAdd({item_id: item[1].map((v) => v.item_id).join(','), item_type: item[0]})
                    )
                ).then((responses) => {
                    if (responses.every((res) => res.code === '000000')) {
                        responses?.[0]?.message && Toast.show(responses[0].message);
                        refresh?.();
                    }
                });
            },
            500,
            {leading: true, trailing: false}
        ),
        [data]
    );

    useImperativeHandle(ref, () => ({
        refresh: () => {
            setRefreshing(true);
            init();
        },
    }));

    useEffect(() => {
        global.LogTool({event: 'follow_recommend'});
        init();
    }, []);

    useEffect(() => {
        allFollowed && refresh?.();
    }, [allFollowed]);

    return data?.length > 0 ? (
        <>
            <ScrollView
                refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, paddingHorizontal: Space.padding}}>
                <Text style={[styles.title, {marginTop: px(8)}]}>推荐关注</Text>
                {data.map((item, index, arr) => {
                    const {avatar, count_str, item_id, item_type, name, status, url} = item;
                    const isFollowed = status === 1;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={item_id}
                            onPress={() => jump(url)}
                            style={[
                                Style.flexBetween,
                                styles.recommendItem,
                                index === arr.length - 1 ? {marginBottom: px(76)} : {},
                            ]}>
                            <View style={Style.flexRow}>
                                <Image
                                    source={{
                                        uri: avatar,
                                    }}
                                    style={styles.authorAvatar}
                                />
                                <View>
                                    <Text numberOfLines={1} style={[styles.subTitle, {maxWidth: px(200)}]}>
                                        {name}
                                    </Text>
                                    <View style={{marginTop: px(2)}}>
                                        <HTML html={count_str} style={styles.smText} />
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => onFollow({isFollowed, item_id, item_type})}
                                style={[
                                    styles.followBtn,
                                    {
                                        borderColor: isFollowed ? Colors.placeholderColor : Colors.brandColor,
                                    },
                                ]}>
                                <Text
                                    style={[
                                        styles.desc,
                                        {
                                            color: isFollowed ? Colors.placeholderColor : Colors.brandColor,
                                        },
                                    ]}>
                                    {isFollowed ? '已关注' : '+关注'}
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <Button onPress={allFollow} style={styles.quickFollowBtn} title="一键关注" />
        </>
    ) : null;
});

/** @name 渲染头部 */
const renderHeader = (jump, list) => {
    return list?.length > 0 ? (
        <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false} style={{flexGrow: 0}}>
            <View style={[Style.flexRow, styles.followedList]}>
                {list.map((item, index) => {
                    const {avatar, item_id, live_status, name, url} = item;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={name + index}
                            onPress={() => {
                                item_id === 0 && global.LogTool({event: 'follow_whole'});
                                jump(url);
                            }}
                            style={[
                                Style.flexCenter,
                                index > 0 ? {width: px(62)} : {},
                                {marginLeft: index === 0 ? 0 : index === 1 ? px(29) : px(18)},
                            ]}>
                            <View>
                                {live_status === 2 ? (
                                    <>
                                        <AnimateAvatar source={avatar} style={styles.followedAvatar} />
                                        <View style={styles.liveIcon}>
                                            <Image source={live} style={{width: px(12), height: px(12)}} />
                                        </View>
                                    </>
                                ) : (
                                    <Image
                                        source={{
                                            uri: avatar,
                                        }}
                                        style={styles.followedAvatar}
                                    />
                                )}
                            </View>
                            <Text numberOfLines={1} style={[styles.desc, {marginTop: px(8), maxWidth: px(70)}]}>
                                {name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    ) : null;
};

/** @name 关注 */
const Follow = forwardRef(({list = [], refreshNews, tabs = []}, ref) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [current, setCurrent] = useState(0);
    const flatList = useRef();
    const followedList = useRef(list);
    const logedPage = useRef([]);

    const init = () => {
        getFollowedData({page, type: current})
            .then((res) => {
                if (res.code === '000000') {
                    const {has_more, list: _list = []} = res.result;
                    setHasMore(has_more);
                    setData((prev) => (page === 1 ? _list : prev.concat(_list)));
                }
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    const refresh = () => {
        flatList.current?.scrollToOffset({animated: false, offset: 0});
        setRefreshing(true);
        page > 1 ? setPage(1) : init();
    };

    /** @name 上拉加载 */
    const onEndReached = ({distanceFromEnd}) => {
        if (distanceFromEnd < 0) return false;
        if (hasMore) setPage((p) => p + 1);
    };

    /** @name 渲染底部 */
    const renderFooter = () => {
        return data?.length > 0 ? (
            <Text style={[styles.desc, {paddingVertical: Space.padding, textAlign: 'center'}]}>
                {hasMore ? '正在加载...' : '我们是有底线的...'}
            </Text>
        ) : null;
    };

    useImperativeHandle(ref, () => ({refresh}));

    useEffect(() => {
        if (followedList.current?.length > 0) {
            const prev = sortBy(followedList.current, ['item_id']).map((item) => item.item_id);
            const next = sortBy(list, ['item_id']).map((item) => item.item_id);
            if (!isEqual(prev, next)) {
                init();
                followedList.current = list;
            }
        } else {
            followedList.current = list;
        }
    }, [list]);

    useEffect(() => {
        init();
    }, [current, page]);

    useEffect(() => {
        global.LogTool({event: 'follow'});
    }, []);

    return (
        <>
            <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false} style={{flexGrow: 0}}>
                <View style={[Style.flexRow, {paddingVertical: px(8), paddingHorizontal: Space.padding}]}>
                    {tabs?.map((tab, i) => {
                        const {name, type} = tab;
                        const isActive = current === type;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isActive}
                                key={name + type}
                                onPress={() => {
                                    flatList.current?.scrollToOffset({animated: false, offset: 0});
                                    setCurrent(type);
                                    setPage(1);
                                    setRefreshing(true);
                                }}
                                style={[
                                    styles.recommendTab,
                                    {
                                        marginLeft: i === 0 ? 0 : px(8),
                                        backgroundColor: isActive ? Colors.brandColor : '#fff',
                                    },
                                ]}>
                                <Text
                                    style={[
                                        styles.smText,
                                        {
                                            color: isActive ? '#fff' : Colors.defaultColor,
                                            fontWeight: isActive ? Font.weightMedium : '400',
                                        },
                                    ]}>
                                    {name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
            <FlatList
                data={data}
                initialNumToRender={20}
                keyExtractor={(item, index) => item.title + item.id + index}
                ListEmptyComponent={() => (!refreshing ? <EmptyTip /> : null)}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={() => renderHeader(jump, list)}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.99}
                onLayout={() => {
                    global.LogTool({ctrl: 'follow', event: 'community_browsing', oid: 1});
                    logedPage.current.push(1);
                }}
                onRefresh={() => {
                    refreshNews?.('follow');
                    page > 1 ? setPage(1) : init();
                }}
                onScroll={({
                    nativeEvent: {
                        contentOffset: {y},
                        layoutMeasurement: {height},
                    },
                }) => {
                    const screen = Math.floor(y / height) + 1;
                    if (screen > 1 && !logedPage.current.includes(screen)) {
                        global.LogTool({ctrl: 'follow', event: 'community_browsing', oid: screen});
                        logedPage.current.push(screen);
                    }
                }}
                ref={flatList}
                refreshing={refreshing}
                renderItem={({item, index}) => (
                    <CommunityCard
                        data={item}
                        scene="community"
                        style={{marginTop: index === 0 ? px(8) : px(12), marginHorizontal: Space.marginAlign}}
                    />
                )}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}
            />
        </>
    );
});

/** @name 推荐瀑布流列表 */
export const WaterfallFlowList = forwardRef(
    ({getData = () => {}, listType = 'waterflow', params, refreshNews, wrapper, onUpdate, ...rest}, ref) => {
        const [refreshing, setRefreshing] = useState(true);
        const [data, setData] = useState([]);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);
        const waterfallFlow = useRef();
        const waterfallWrapper = useRef();
        const [resource_private_tip, setTip] = useState('');
        const [loading, setLoading] = useState(true);
        const logedPage = useRef([]);
        const waterfallFlowHeight = useRef(0);

        const init = () => {
            getData({...params, page})
                .then((res) => {
                    if (res.code === '000000') {
                        const {has_more, items = [], update_community_guide, resource_private_tip: tip} = res.result;
                        setHasMore(has_more);
                        onUpdate(update_community_guide);
                        page === 1 && waterfallWrapper.current?.clear?.();
                        setData((prev) => (page === 1 ? items : prev.concat(items)));
                        tip && setTip(tip);
                    }
                })
                .finally(() => {
                    setLoading(false);
                    setRefreshing(false);
                });
        };

        const refresh = () => {
            waterfallFlow.current?.scrollToOffset?.({animated: false, offset: 0});
            setRefreshing(true);
            page > 1 ? setPage(1) : init();
        };

        const renderItem = ({item = {}, index}) => {
            return (
                <CommunityCard
                    cardType={listType}
                    data={item}
                    scene="community"
                    style={
                        listType === 'list'
                            ? {marginTop: index === 0 ? 0 : px(12), marginHorizontal: Space.marginAlign}
                            : styles.waterfallFlowItem
                    }
                />
            );
        };

        /** @name 上拉加载 */
        const onEndReached = ({distanceFromEnd}) => {
            if (distanceFromEnd < 0) return false;
            if (hasMore) setPage((p) => p + 1);
        };

        /** @name 渲染底部 */
        const renderFooter = () => {
            return data?.length > 0 && !refreshing ? (
                <Text style={[styles.desc, {paddingVertical: Space.padding, textAlign: 'center'}]}>
                    {hasMore ? '正在加载...' : '我们是有底线的...'}
                </Text>
            ) : null;
        };

        const onViewableItemsChanged = useCallback(({viewableItems: items, changed}) => {
            changed?.forEach(({isViewable, item: {id, rec_json}}) => {
                isViewable && rec_json && global.LogTool({event: 'rec_show', oid: id, rec_json});
            });
        }, []);

        useImperativeHandle(ref, () => ({refresh}));

        useEffect(() => {
            init();
        }, [page]);

        return data?.length > 0 ? (
            <WaterFlow
                columnFlatListProps={{
                    onViewableItemsChanged,
                    style: {
                        marginHorizontal: listType === 'list' ? 0 : px(5) / 2,
                        top: listType === 'list' ? 0 : -px(5),
                    },
                }}
                columnsFlatListProps={{
                    ListFooterComponent: renderFooter,
                    onEndReached,
                    onEndReachedThreshold: 0.05,
                    onLayout: ({
                        nativeEvent: {
                            layout: {height},
                        },
                    }) => {
                        waterfallFlowHeight.current = height;
                        wrapper === 'Recommend' &&
                            global.LogTool({ctrl: 'recommend', event: 'community_browsing', oid: 1});
                        logedPage.current.push(1);
                    },
                    onRefresh: () => {
                        setRefreshing(true);
                        refreshNews?.('recommend');
                        page > 1 ? setPage(1) : init();
                    },
                    _onScroll: (e) => {
                        if (wrapper === 'Recommend') {
                            const {
                                contentOffset: {y},
                            } = e.nativeEvent;
                            const screen = Math.floor(y / waterfallFlowHeight.current) + 1;
                            if (screen > 1 && !logedPage.current.includes(screen)) {
                                global.LogTool({ctrl: 'recommend', event: 'community_browsing', oid: screen});
                                logedPage.current.push(screen);
                            }
                        }
                    },
                    ref: waterfallFlow,
                    refreshing,
                    style: {paddingHorizontal: listType === 'list' ? 0 : px(5) / 2, backgroundColor: Colors.bgColor},
                    ...rest,
                }}
                data={data}
                key={listType}
                keyForItem={(item) => item.title + item.id}
                numColumns={listType === 'list' ? 1 : 2}
                ref={waterfallWrapper}
                renderItem={renderItem}
            />
        ) : (
            <View style={wrapper === 'Recommend' ? [Style.flexCenter, {flex: 1}] : {paddingTop: px(280)}}>
                {loading ? (
                    <ActivityIndicator color={'#ddd'} />
                ) : (
                    <EmptyTip
                        style={wrapper === 'Recommend' ? {paddingTop: 0} : {}}
                        text={resource_private_tip || '暂无数据'}
                    />
                )}
            </View>
        );
    }
);

/** @name 推荐 */
const Recommend = forwardRef(({isLogin, list = [], refreshNews, showType, tabs = []}, ref) => {
    const route = useRoute();
    const jump = useJump();
    const {init_type = 0} = route.params || {};
    const [current, setCurrent] = useState(init_type);
    const [listType, setListType] = useState(showType === 1 ? 'waterflow' : 'list');
    const scrollTab = useRef();
    const recommendList = useRef([]);
    const isLoginRef = useRef(isLogin);
    const updateHintRef = useRef();

    const refresh = () => {
        recommendList.current[current]?.refresh?.();
    };

    /** @name 改变列表展示形式 */
    const changeShowType = useCallback(
        debounce(
            () =>
                setListType((prev) => {
                    saveShowType({show_type: prev === 'list' ? 1 : 2});
                    return prev === 'list' ? 'waterflow' : 'list';
                }),
            500,
            {leading: true, trailing: false}
        ),
        []
    );

    useImperativeHandle(ref, () => ({refresh}));

    const onUpdate = useCallback((text) => {
        if (text) updateHintRef.current.trigger(text);
    }, []);

    useEffect(() => {
        global.LogTool({event: 'recommend'});
    }, []);

    useEffect(() => {
        if (isLoginRef.current !== isLogin) refresh();
        isLoginRef.current = isLogin;
    }, [isLogin]);

    useEffect(() => {
        const index = tabs?.findIndex((tab) => tab.type === init_type);
        if (scrollTab.current) scrollTab.current.goToPage(index);
        else setTimeout(() => scrollTab.current?.goToPage?.(index));
    }, [route.params]);

    return (
        <>
            <UpdateHint ref={updateHintRef} />
            {renderHeader(jump, list)}
            <View style={[Style.flexRow, {paddingTop: px(8)}]}>
                <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                    <View style={[Style.flexRow, {paddingHorizontal: Space.padding}]}>
                        {tabs?.map((tab, i) => {
                            const {name, type} = tab;
                            const isActive = current === i;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={isActive}
                                    key={name + type}
                                    onPress={() => {
                                        global.LogTool({event: 'recommend_content', oid: type});
                                        scrollTab.current.goToPage(i);
                                    }}
                                    style={[
                                        styles.recommendTab,
                                        {
                                            marginLeft: i === 0 ? 0 : px(8),
                                            backgroundColor: isActive ? Colors.brandColor : '#fff',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.smText,
                                            {
                                                color: isActive ? '#fff' : Colors.defaultColor,
                                                fontWeight: isActive ? Font.weightMedium : '400',
                                            },
                                        ]}>
                                        {name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
                <TouchableOpacity activeOpacity={0.8} onPress={changeShowType} style={{marginRight: Space.marginAlign}}>
                    <Image source={listType === 'waterflow' ? listIcon : waterflowIcon} style={styles.modeIcon} />
                </TouchableOpacity>
            </View>
            <ScrollableTabView
                initialPage={0}
                onChangeTab={({i}) => setCurrent(i)}
                renderTabBar={false}
                ref={scrollTab}
                style={{flex: 1, marginTop: px(12)}}>
                {tabs?.map((tab, i) => {
                    const {name, type} = tab;
                    return (
                        <View key={name + type} style={{flex: 1}} tabLabel={name}>
                            <WaterfallFlowList
                                getData={getRecommendData}
                                listType={listType}
                                refreshNews={refreshNews}
                                params={{type}}
                                onUpdate={onUpdate}
                                ref={(flow) => (recommendList.current[i] = flow)}
                                wrapper="Recommend"
                            />
                        </View>
                    );
                })}
            </ScrollableTabView>
        </>
    );
});

export const PublishContent = forwardRef(({community_id = 0, muid = 0, history_id, handleClick, type}, ref) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {add_icon, btn_list = []} = data;
    const bottomModal = useRef();
    const init = () => {
        getCanPublishContent({community_id, muid, history_id, type}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    };

    useImperativeHandle(ref, () => ({refresh: init}));

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    return Object.keys(data).length > 0 ? (
        <>
            <TouchableOpacity activeOpacity={0.8} onPress={() => bottomModal.current.show()} style={styles.addContent}>
                <Image source={{uri: add_icon}} style={styles.addIcon} />
            </TouchableOpacity>
            <BottomModal header={<View />} ref={bottomModal} style={{minHeight: px(218)}}>
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            bottomModal.current.hide();
                        }}
                        style={styles.closeBtn}>
                        <Image source={close} style={styles.close} />
                    </TouchableOpacity>
                    <View style={[Style.flexEvenly, {paddingTop: px(64)}]}>
                        {btn_list?.map((item, index) => {
                            const {event_id, icon, name, url, type: btnType} = item;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={name + index}
                                    onPress={() => {
                                        global.LogTool({event: 'publishing_content', oid: event_id});
                                        bottomModal.current.hide();
                                        if (btnType == 'addArticle') {
                                            handleClick('article');
                                        } else if (btnType == 'addProduct') {
                                            handleClick('all');
                                        } else {
                                            jump(url);
                                        }
                                    }}
                                    style={Style.flexCenter}>
                                    <Image source={{uri: icon}} style={{width: px(48), height: px(48)}} />
                                    <Text style={[styles.desc, {marginTop: px(8), color: Colors.defaultColor}]}>
                                        {name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </>
            </BottomModal>
        </>
    ) : null;
});

const UpdateHint = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const hintViewRef = useRef(null);
    const timer = useRef();
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
        trigger: (text) => {
            requestAnimationFrame(() => {
                trigger(text);
            });
        },
    }));

    const trigger = (text) => {
        clearTimeout(timer.current);
        inputRef.current?.setNativeProps({text});
        setVisible(true);
        hintViewRef.current?.fadeInDown(800)?.then((res) => {
            if (res.finished) {
                timer.current = setTimeout(() => {
                    hintViewRef.current?.fadeOutUp(700).then((res2) => {
                        if (res2.finished) {
                            setVisible(false);
                        }
                    });
                }, 3000);
            }
        });
    };

    return (
        <Animatable.View
            useNativeDriver={true}
            style={[styles.hintWrap, {zIndex: visible ? 3 : -3, opacity: +visible}]}
            ref={hintViewRef}>
            <Image source={hintIcon} style={{width: px(14), height: px(14), marginRight: px(4)}} />
            <TextInput ref={inputRef} style={{fontSize: px(12), lineHeight: px(14), color: '#fff', padding: 0}} />
        </Animatable.View>
    );
});

const Index = ({navigation, route, setLoading}) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const community = useSelector((store) => store.community).toJS();
    const {communityFollowNews, communityRecommendNews} = community;
    const {init_type} = route.params || {};
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.();
    const [active, setActive] = useState(0);
    const [data, setData] = useState({});
    const {follow, message_url, recommend, search_url, show_type, tabs, user_info} = data;
    const followRef = useRef();
    const recommendRef = useRef();
    const publishRef = useRef();
    const firstIn = useRef(true);
    const scrollTab = useRef();

    const init = () => {
        getPageData()
            .then((res) => {
                if (res.code === '000000') {
                    if (firstIn.current) {
                        const page = res.result.tabs?.findIndex((tab) => tab.is_selected);
                        setActive(page);
                    }
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const refresh = (tab) => {
        init();
        refreshNews(tab === 0 ? 'follow' : 'recommend');
        if (tab === 0) {
            followRef.current?.refresh?.();
        } else {
            recommendRef.current?.refresh?.();
        }
        publishRef.current?.refresh?.();
    };

    const refreshNews = (page) => {
        getNewsData({init: 1, tab: page});
        dispatch({
            payload: page === 'follow' ? {communityFollowNews: false} : {communityRecommendNews: false},
            type: actionTypes.Community,
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    useEffect(() => {
        refreshNews('recommend');
    }, []);

    useEffect(() => {
        const listener = navigation.addListener('tabPress', () => {
            if (isFocused) {
                refresh(active);
            } else if (communityFollowNews && active === 0) {
                refreshNews('follow');
                followRef.current?.refresh?.();
            } else if (communityRecommendNews && active === 1) {
                refreshNews('recommend');
                recommendRef.current?.refresh?.();
            }
        });
        return () => listener();
    }, [active, communityFollowNews, communityRecommendNews, isFocused]);

    useEffect(() => {
        if (Object.keys(data).length > 0 && firstIn.current) {
            firstIn.current = false;
            setTimeout(() => {
                scrollTab.current?.goToPage?.(scrollTab.current?.state?.currentPage);
            });
        }
    }, [data]);

    useEffect(() => {
        init_type !== undefined && setTimeout(() => scrollTab.current?.goToPage?.(1));
    }, [route.params]);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <Header
                active={active}
                isLogin={userInfo.is_login}
                message_url={message_url}
                newsData={community}
                refresh={refresh}
                search_url={search_url}
                setActive={(i) => scrollTab.current?.goToPage(i)}
                tabs={tabs}
                userInfo={user_info}
            />
            <ScrollableTabView
                initialPage={active}
                locked
                onChangeTab={({i}) => setActive(i)}
                ref={scrollTab}
                renderTabBar={false}
                style={{flex: 1}}>
                {tabs?.map((tab) => {
                    const {name, type} = tab;
                    return (
                        <View key={type} style={{flex: 1}} tabLabel={name}>
                            {type === 'follow' ? (
                                follow?.list?.length > 0 ? (
                                    <Follow
                                        list={follow.list}
                                        refreshNews={refreshNews}
                                        ref={followRef}
                                        tabs={follow.tags}
                                    />
                                ) : (
                                    <RecommendFollow ref={followRef} refresh={init} />
                                )
                            ) : null}
                            {type === 'recommend' ? (
                                <Recommend
                                    isLogin={data.is_login}
                                    list={recommend?.list}
                                    refreshNews={refreshNews}
                                    ref={recommendRef}
                                    showType={show_type}
                                    tabs={recommend?.tags}
                                />
                            ) : null}
                        </View>
                    );
                })}
            </ScrollableTabView>
            {userInfo.is_login && <PublishContent ref={publishRef} />}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    header: {
        paddingHorizontal: Space.padding,
        paddingBottom: px(10),
    },
    avatar: {
        borderRadius: px(30),
        width: px(30),
        height: px(30),
    },
    headerTabText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    activeTabText: {
        fontSize: px(18),
        lineHeight: px(25),
        fontWeight: Font.weightMedium,
    },
    redPoint: {
        position: 'absolute',
        top: 0,
        right: -px(5),
        borderRadius: px(8),
        width: px(8),
        height: px(8),
        backgroundColor: Colors.red,
    },
    headerRightIcon: {
        width: px(24),
        height: px(24),
    },
    allMsg: {
        position: 'absolute',
        left: px(15),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(20),
        zIndex: 3,
        minWidth: px(14),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
    },
    msgNum: {
        textAlign: 'center',
        color: '#fff',
        fontSize: px(9),
        lineHeight: px(10),
        fontFamily: Font.numFontFamily,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    recommendItem: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    authorAvatar: {
        marginRight: px(6),
        borderRadius: px(32),
        width: px(32),
        height: px(32),
    },
    applyBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(12),
        borderRadius: px(24),
        borderWidth: Space.borderWidth,
    },
    followBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(14),
        borderRadius: px(30),
        borderWidth: Space.borderWidth,
    },
    quickFollowBtn: {
        position: 'absolute',
        right: px(16),
        bottom: px(16),
        left: px(16),
    },
    followedList: {
        paddingVertical: px(8),
        paddingHorizontal: Space.padding,
    },
    followedAvatar: {
        borderRadius: px(40),
        width: px(40),
        height: px(40),
    },
    liveIcon: {
        padding: px(4),
        borderRadius: px(20),
        backgroundColor: Colors.red,
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 11,
    },
    recommendTab: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    modeIcon: {
        width: px(16),
        height: px(16),
    },
    waterfallFlowItem: {
        marginTop: px(5),
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    addContent: {
        position: 'absolute',
        right: px(10),
        bottom: px(38),
    },
    addIcon: {
        width: px(60),
        height: px(60),
    },
    closeBtn: {
        position: 'absolute',
        top: px(16),
        right: px(16),
        zIndex: 1,
    },
    close: {
        width: px(24),
        height: px(24),
    },
    hintWrap: {
        position: 'absolute',
        top: 0,
        left: px(16),
        width: px(343),
        padding: px(8),
        borderRadius: px(6),
        backgroundColor: '#FF7D41',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
});

export default withPageLoading(Index);
