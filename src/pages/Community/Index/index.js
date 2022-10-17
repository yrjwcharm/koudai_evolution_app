/*
 * @Date: 2022-10-08 15:06:39
 * @Description: 社区首页
 */
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import WaterfallFlow from 'react-native-waterfall-flow';
import {useIsFocused} from '@react-navigation/native';
import close from '~/assets/img/icon/close.png';
import live from '~/assets/img/vision/live.gif';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import AnimateAvatar from '~/components/AnimateAvatar';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {BottomModal} from '~/components/Modal';
import HTML from '~/components/RenderHtml';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {deviceWidth, px} from '~/utils/appUtil';
import {CommunityCardCover, CommunityFollowCard} from '../components/CommunityCard';
import {
    getCanPublishContent,
    getFollowedData,
    getPageData,
    getRecommendData,
    getRecommendFollowUsers,
} from './services';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {debounce, groupBy} from 'lodash';

/** @name 社区头部 */
const Header = ({active, setActive, tabs, userInfo = {}}) => {
    const jump = useJump();
    const insets = useSafeAreaInsets();
    const {url, user: {avatar} = {}} = userInfo;

    return (
        <View style={[Style.flexBetween, styles.header, {paddingTop: insets.top + px(4)}]}>
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
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={type}
                            onPress={() => setActive(i)}
                            style={{marginLeft: i === 0 ? px(30) : px(20)}}>
                            <Text style={[styles.headerTabText, active === i ? styles.activeTabText : {}]}>{name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={Style.flexRow}>
                <TouchableOpacity activeOpacity={0.8} style={{marginRight: px(12)}}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/09/header-right.png'}}
                        style={styles.headerRightIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                    <Image
                        source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/09/message-centre.png'}}
                        style={styles.headerRightIcon}
                    />
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
    const allFollow = async () => {
        const _data = groupBy(data, (item) => item.item_type);
        const responses = await Promise.all(
            Object.entries(_data).map((item) =>
                followAdd({item_id: item[1].map((v) => v.item_id).join(','), item_type: item[0]})
            )
        );
        if (responses.every((res) => res.code === '000000')) {
            Toast.show(responses[0].message);
            refresh?.();
        }
    };

    useImperativeHandle(ref, () => ({
        refresh: () => {
            setRefreshing(true);
            init();
        },
    }));

    useEffect(() => {
        init();
    }, []);

    return data?.length > 0 ? (
        <>
            <ScrollView
                refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, paddingHorizontal: Space.padding}}>
                <Text style={[styles.title, {marginTop: px(8)}]}>推荐关注</Text>
                {data.map((item, index) => {
                    const {avatar, count_str, item_id, item_type, name, status, url} = item;
                    const isFollowed = status === 1;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={item_id}
                            onPress={() => jump(url)}
                            style={[Style.flexBetween, styles.recommendItem]}>
                            <View style={Style.flexRow}>
                                <Image
                                    source={{
                                        uri: avatar,
                                    }}
                                    style={styles.authorAvatar}
                                />
                                <View>
                                    <Text style={styles.subTitle}>{name}</Text>
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

/** @name 关注 */
const Follow = forwardRef(({list = []}, ref) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const flatList = useRef();

    const init = () => {
        getFollowedData({page})
            .then((res) => {
                if (res.code === '000000') {
                    setData((prev) => {
                        if (page === 1) {
                            return res.result.list;
                        } else {
                            return prev.concat(res.result.list);
                        }
                    });
                    setHasMore(res.result.has_more);
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
            <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false}>
                <View style={[Style.flexRow, styles.followedList]}>
                    {list.map((item, index) => {
                        const {avatar, live_status, name, url} = item;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={name + index}
                                onPress={() => jump(url)}
                                style={[Style.flexCenter, {marginLeft: index === 0 ? 0 : px(28)}]}>
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
        );
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
        init();
    }, [page]);

    return (
        <FlatList
            data={data}
            initialNumToRender={20}
            keyExtractor={(item, index) => item.title + item.id + index}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.99}
            onRefresh={() => (page > 1 ? setPage(1) : init())}
            ref={flatList}
            refreshing={refreshing}
            renderItem={({item, index}) => (
                <CommunityFollowCard
                    {...item}
                    style={{marginTop: index === 0 ? 0 : px(12), marginHorizontal: Space.marginAlign}}
                />
            )}
            scrollIndicatorInsets={{right: 1}}
        />
    );
});

/** @name 推荐瀑布流列表 */
export const WaterfallFlowList = forwardRef(({getData = () => {}, params}, ref) => {
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const waterfallFlow = useRef();

    const init = () => {
        getData({...params, page})
            .then((res) => {
                if (res.code === '000000') {
                    setData((prev) => {
                        if (page === 1) {
                            return res.result.items;
                        } else {
                            return prev.concat(res.result.items);
                        }
                    });
                    setHasMore(res.result.has_more);
                }
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    const refresh = () => {
        waterfallFlow.current?.scrollToOffset({animated: false, offset: 0});
        setRefreshing(true);
        page > 1 ? setPage(1) : init();
    };

    const renderItem = ({item, index, columnIndex}) => {
        const {author, cover, desc, live_status, title, type: _type, url} = item;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => jump(url)}
                style={[
                    styles.waterfallFlowItem,
                    {
                        marginTop: index < 2 ? 0 : px(5),
                        marginRight: columnIndex === 1 ? px(5) : px(5) / 2,
                        marginLeft: columnIndex === 0 ? px(5) : px(5) / 2,
                    },
                ]}>
                {cover ? (
                    <CommunityCardCover {...item} style={{width: '100%'}} width={deviceWidth - 3 * px(5)} />
                ) : (
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/contentBg.png'}}
                        style={styles.contentBg}
                    />
                )}
                <View style={{padding: px(10), paddingBottom: px(12)}}>
                    {title ? (
                        <View>
                            <HTML html={title} numberOfLines={2} style={styles.subTitle} />
                        </View>
                    ) : null}
                    {desc ? (
                        <View style={{marginTop: px(8)}}>
                            <HTML html={desc} numberOfLines={4} style={styles.desc} />
                        </View>
                    ) : null}
                    {author ? (
                        <View style={[Style.flexRow, {marginTop: px(12)}]}>
                            {_type === 9 && live_status === 2 ? (
                                <AnimateAvatar source={author.avatar} style={styles.recommendAvatar} />
                            ) : (
                                <Image source={{uri: author.avatar}} style={styles.recommendAvatar} />
                            )}
                            <Text style={styles.smText}>{author.nickname}</Text>
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
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
        init();
    }, [page]);

    return (
        <WaterfallFlow
            data={data}
            initialNumToRender={20}
            keyExtractor={(item, index) => item.title + item.id + index}
            ListFooterComponent={renderFooter}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.99}
            onRefresh={() => (page > 1 ? setPage(1) : init())}
            ref={waterfallFlow}
            refreshing={refreshing}
            renderItem={renderItem}
            scrollIndicatorInsets={{right: 1}}
        />
    );
});

/** @name 推荐 */
const Recommend = forwardRef(({tabs = []}, ref) => {
    const [current, setCurrent] = useState(0);
    const scrollTab = useRef();
    const recommendList = useRef([]);

    const refresh = () => {
        recommendList.current[current]?.refresh?.();
    };

    useImperativeHandle(ref, () => ({refresh}));

    return (
        <>
            <View style={[Style.flexRow, {paddingTop: px(8), paddingHorizontal: Space.padding}]}>
                {tabs?.map((tab, i) => {
                    const {name, type} = tab;
                    const isActive = current === i;
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={isActive}
                            key={name + type}
                            onPress={() => {
                                setCurrent(i);
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
                                params={{type}}
                                ref={(list) => (recommendList.current[i] = list)}
                            />
                        </View>
                    );
                })}
            </ScrollableTabView>
        </>
    );
});

export const PublishContent = forwardRef(({community_id = 0}, ref) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {add_icon, btn_list = []} = data;
    const bottomModal = useRef();

    const init = () => {
        getCanPublishContent({community_id}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    };

    useImperativeHandle(ref, () => ({refresh: init}));

    useEffect(() => {
        init();
    }, []);

    return Object.keys(data).length > 0 ? (
        <>
            <TouchableOpacity activeOpacity={0.8} onPress={() => bottomModal.current.show()} style={styles.addContent}>
                <Image source={{uri: add_icon}} style={styles.addIcon} />
            </TouchableOpacity>
            <BottomModal header={<View />} ref={bottomModal} style={{minHeight: px(218)}}>
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => bottomModal.current.hide()}
                        style={styles.closeBtn}>
                        <Image source={close} style={styles.close} />
                    </TouchableOpacity>
                    <View style={[Style.flexEvenly, {paddingTop: px(64)}]}>
                        {btn_list?.map((item, index) => {
                            const {icon, name, url} = item;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={name + index}
                                    onPress={() => {
                                        bottomModal.current.hide();
                                        jump(url);
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

const Index = ({navigation, setLoading}) => {
    const isFocused = useIsFocused();
    const [active, setActive] = useState(0);
    const [data, setData] = useState({});
    const {follow, recommend, tabs, user_info} = data;
    const followRef = useRef();
    const recommendRef = useRef();
    const publishRef = useRef();

    const init = () => {
        getPageData()
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const listener = navigation.addListener('tabPress', () => {
            if (isFocused) {
                init();
                if (active === 0) {
                    followRef.current?.refresh?.();
                } else {
                    recommendRef.current?.refresh?.();
                }
                publishRef.current?.refresh?.();
            }
        });
        return () => listener();
    }, [active, isFocused]);

    useEffect(() => {
        init();
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <Header active={active} setActive={setActive} tabs={tabs} userInfo={user_info} />
            <ScrollableTabView locked page={active} renderTabBar={false} style={{flex: 1}}>
                {tabs?.map((tab, i) => {
                    const {name, type} = tab;
                    return (
                        <View key={type} style={{flex: 1}} tabLabel={name}>
                            {type === 'follow' ? (
                                follow?.list?.length > 0 ? (
                                    <Follow list={follow.list} ref={followRef} />
                                ) : (
                                    <RecommendFollow ref={followRef} refresh={init} />
                                )
                            ) : null}
                            {type === 'recommend' ? <Recommend ref={recommendRef} tabs={recommend?.tags} /> : null}
                        </View>
                    );
                })}
            </ScrollableTabView>
            <PublishContent ref={publishRef} />
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
    headerRightIcon: {
        width: px(24),
        height: px(24),
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
        paddingTop: px(8),
        paddingHorizontal: Space.padding,
        paddingBottom: Space.padding,
    },
    followedAvatar: {
        borderRadius: px(54),
        width: px(54),
        height: px(54),
    },
    liveIcon: {
        padding: px(4),
        borderRadius: px(20),
        backgroundColor: Colors.red,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    recommendTab: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    waterfallFlowItem: {
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
        flex: 1,
        backgroundColor: '#fff',
    },
    contentBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px(68),
        height: px(54),
    },
    recommendAvatar: {
        marginRight: px(4),
        borderRadius: px(16),
        width: px(16),
        height: px(16),
    },
    addContent: {
        position: 'absolute',
        right: px(5),
        bottom: px(120),
    },
    addIcon: {
        width: px(60),
        height: px(60),
    },
    closeBtn: {
        position: 'absolute',
        top: px(16),
        right: px(16),
    },
    close: {
        width: px(24),
        height: px(24),
    },
});

export default withPageLoading(Index);