/*
 * @Description: 产品首页
 * @Autor: wxp
 * @Date: 2022-09-13 11:45:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-21 14:13:42
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Platform, RefreshControl} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Loading from '~/pages/Portfolio/components/PageLoading';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {px} from '~/utils/appUtil';
import {useJump} from '~/components/hooks';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {BoxShadow} from 'react-native-shadow';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LiveCard from '~/components/Article/LiveCard';
import BottomDesc from '~/components/BottomDesc';
import FollowTable from '../Attention/Index/FollowTable';
import http from '~/services';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import withNetState from '~/components/withNetState';
import {AlbumCard, ProductList} from '~/components/Product';
import {useSelector} from 'react-redux';
import LoadingTips from '~/components/LoadingTips';
import Feather from 'react-native-vector-icons/Feather';

const Product = ({navigation}) => {
    const jump = useJump();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const userInfo = useSelector((store) => store.userInfo);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [proData, setProData] = useState(null);
    const [followTabs, setFollowTabs] = useState();
    const [followData, setFollowData] = useState();
    const [tabActive, setTabActive] = useState(1);
    const [optionalTabActive, setOptionalTabActive] = useState(0);
    const [allMsg, setAll] = useState(0);

    const tabRef = useRef(null);
    const optionalTabRef = useRef(null);
    const isFirst = useRef(1);
    const scrollViewRef = useRef();

    const bgType = useMemo(() => {
        return tabActive === 1 && proData?.popular_banner_list ? false : true;
    }, [tabActive, proData]);

    useFocusEffect(
        useCallback(() => {
            [getFollowTabs, getProData][tabRef.current?.state?.currentPage || 1]?.(isFirst.current++);
            isFirst.current === 1 && tabRef.current?.goToPage?.(1);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (userInfo.toJS().is_login) readInterface();
        }, [readInterface, userInfo])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if (isFocused) {
                getProData(0);
                scrollViewRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                global.LogTool('tabDoubleClick', 'ProductIndex');
            }
        });
        return () => unsubscribe();
    }, [isFocused, navigation]);

    useEffect(() => {
        const tabs = followTabs?.follow?.tabs;
        if (tabs) {
            let item_type = tabs[optionalTabActive]?.item_type || tabs[0]?.item_type;
            getFollowData({
                item_type,
            }).then(() => {
                optionalTabRef.current?.goToPage?.(tabs?.[optionalTabActive]?.item_type ? optionalTabActive : 0);
            });
        }
    }, [optionalTabActive, followTabs]);

    const getProData = (type) => {
        type === 0 && setRefreshing(true);
        type === 1 && setLoading(true);
        http.get('/products/index/20220901')
            .then((res) => {
                if (res.code === '000000') {
                    setProData(res.result);
                }
            })
            .finally((_) => {
                setRefreshing(false);
                setLoading(false);
            });
    };

    const getFollowTabs = (type) => {
        type === 0 && setRefreshing(true);
        type === 1 && setLoading(true);
        http.get('/follow/index/202206')
            .then((res) => {
                if (res.code === '000000') {
                    setFollowTabs(res.result);
                }
            })
            .finally((_) => {
                setRefreshing(false);
                setLoading(false);
            });
    };

    const getFollowData = async (params) => {
        let res = await http.get('/follow/list/202206', params);
        setFollowData(res.result);
    };

    const readInterface = useCallback(() => {
        http.get('/message/unread/20210101').then((res) => {
            setAll(res.result.all);
        });
    }, []);

    const onChangeTab = useCallback((cur) => {
        setTabActive(cur.i);
        [getFollowTabs, getProData][cur.i]();
    }, []);

    const onChangeOptionalTab = useCallback((cur) => {
        setOptionalTabActive(cur.i);
    }, []);

    const renderSecurity = (menu_list) => {
        return menu_list ? (
            <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                {menu_list.map((item, index) => (
                    <BoxShadow
                        key={index}
                        setting={{
                            color: '#E3E6EE',
                            border: 8,
                            radius: 1,
                            opacity: 0.2,
                            x: 0,
                            y: 2,
                            width: px(167),
                            height: px(61),
                        }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={[Style.flexBetween, styles.secure_card, styles.common_card]}
                            onPress={() => {
                                index == 0 ? global.LogTool('indexSecurity') : global.LogTool('indexInvestPhilosophy');
                                jump(item?.url);
                            }}>
                            <View>
                                <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                                    <FastImage
                                        resizeMode={FastImage.resizeMode.contain}
                                        style={{width: px(24), height: px(24)}}
                                        source={{uri: item.icon}}
                                    />
                                    <Text style={[styles.secure_title, {marginLeft: px(4)}]}>{item?.title}</Text>
                                </View>
                                <Text style={styles.light_text}>{item.desc}</Text>
                            </View>
                            <FontAwesome name={'angle-right'} size={18} color={'#9397A3'} />
                        </TouchableOpacity>
                    </BoxShadow>
                ))}
            </View>
        ) : null;
    };

    return loading ? (
        <Loading color={Colors.btnColor} />
    ) : (
        <View style={[styles.container, {backgroundColor: bgType ? '#F4F5F7' : '#1B45B7'}]}>
            <LinearGradient
                style={{paddingTop: insets.top + px(7), height: px(178)}}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                colors={
                    (bgType ? proData?.bg_colors : proData?.popular_banner_list?.bg_colors) || ['#EBF5FF', '#F4F5F7']
                }>
                <View style={[styles.searchWrap]}>
                    <View style={styles.tabTextWrap}>
                        <Text
                            style={[
                                styles.tabText,
                                {color: bgType ? '#121D3A' : '#fff'},
                                tabActive === 0 ? styles.tabActive : {},
                            ]}
                            suppressHighlighting={true}
                            onPress={() => {
                                tabRef.current.goToPage(0);
                            }}>
                            自选
                        </Text>
                        <Text
                            style={[
                                styles.tabText,
                                {color: bgType ? '#121D3A' : '#fff'},
                                tabActive === 1 ? styles.tabActive : {},
                            ]}
                            suppressHighlighting={true}
                            onPress={() => {
                                tabRef.current.goToPage(1);
                            }}>
                            产品
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.searchInput]}
                        onPress={() => {
                            jump(proData?.search?.url);
                        }}>
                        <FastImage
                            source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/pk-search.png'}}
                            style={{width: px(18), height: px(18), marginRight: px(4)}}
                        />
                        <Text style={styles.searchPlaceHolder}>{proData?.search?.placeholder}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            global.LogTool('indexNotificationCenter');
                            jump({path: 'RemindMessage'});
                        }}>
                        {allMsg ? (
                            <View style={[styles.point_sty, Style.flexCenter, {left: allMsg > 99 ? px(11) : px(15)}]}>
                                <Text style={styles.point_text}>{allMsg > 99 ? '99+' : allMsg}</Text>
                            </View>
                        ) : null}
                        <FastImage
                            style={{width: px(24), height: px(24), marginRight: px(12)}}
                            source={{
                                uri: bgType
                                    ? 'http://static.licaimofang.com/wp-content/uploads/2022/09/message-centre.png'
                                    : 'http://static.licaimofang.com/wp-content/uploads/2022/09/message-centre-2.png',
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            <ScrollableTabView
                ref={(e) => {
                    tabRef.current = e;
                }}
                style={{flex: 1, marginTop: px(-83)}}
                initialPage={1}
                renderTabBar={false}
                locked={true}
                onChangeTab={onChangeTab}>
                <ScrollView
                    tabLabel="自选"
                    ref={scrollViewRef}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getFollowTabs(0)} />}
                    style={{flex: 1}}>
                    <View style={{paddingHorizontal: px(16)}}>
                        {followTabs?.follow?.tabs ? (
                            <ScrollableTabView
                                prerenderingSiblingsNumber={followTabs?.follow?.tabs?.length}
                                locked={true}
                                renderTabBar={() => <RenderOptionalTabBar />}
                                onChangeTab={onChangeOptionalTab}
                                ref={optionalTabRef}>
                                {followTabs?.follow?.tabs?.map?.((tab, index) => {
                                    const curTabs = followTabs?.follow?.tabs?.[optionalTabActive];
                                    return (
                                        <View
                                            key={index + tab?.type_text}
                                            tabLabel={tab?.type_text}
                                            style={{marginTop: px(12)}}>
                                            {tab.item_type === 6 ? (
                                                <SpecialList data={followData} tabButton={curTabs?.button_list} />
                                            ) : (
                                                <FollowTable
                                                    data={followData}
                                                    activeTab={curTabs?.item_type || 0}
                                                    handleSort={getFollowData}
                                                    tabButton={curTabs?.button_list}
                                                    notStickyHeader={true}
                                                />
                                            )}
                                        </View>
                                    );
                                })}
                            </ScrollableTabView>
                        ) : null}
                    </View>
                </ScrollView>
                <ScrollView
                    tabLabel="产品"
                    ref={scrollViewRef}
                    style={{flex: 1}}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            {...(bgType ? {} : {tintColor: '#fff', colors: ['#fff']})}
                            refreshing={refreshing}
                            onRefresh={() => getProData(0)}
                        />
                    }>
                    <View style={styles.menuWrap}>
                        {proData?.nav?.map?.((item, idx) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        // jump({
                                        //     path: 'PortfolioDetails',
                                        //     params: {
                                        //         link: 'http://192.168.88.170:3000/portfolioDetails',
                                        //         params: {
                                        //             plan_id: '123',
                                        //         },
                                        //     },
                                        // });
                                        // jump({
                                        //     path: 'SpecialDetail',
                                        // });
                                        jump(item.url);
                                    }}
                                    style={styles.menuItem}
                                    key={idx}>
                                    <FastImage
                                        source={{
                                            uri: item.icon,
                                        }}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={[styles.menuItemText, {color: bgType ? '#121d3a' : '#fff'}]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={styles.bannerWrap}>
                        {bgType ? (
                            <View style={styles.swiperWrap}>
                                {proData?.banner_list?.[0] ? (
                                    <Swiper
                                        height={px(100)}
                                        autoplay
                                        loadMinimal={Platform.OS == 'ios' ? true : false}
                                        removeClippedSubviews={false}
                                        autoplayTimeout={4}
                                        paginationStyle={{
                                            bottom: px(5),
                                        }}
                                        dotStyle={{
                                            opacity: 0.5,
                                            width: px(4),
                                            ...styles.dotStyle,
                                        }}
                                        activeDotStyle={{
                                            width: px(12),
                                            ...styles.dotStyle,
                                        }}>
                                        {proData?.banner_list?.map?.((banner, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                activeOpacity={0.9}
                                                onPress={() => {
                                                    global.LogTool('swiper', banner.id);
                                                    jump(banner.url);
                                                }}>
                                                <FastImage
                                                    style={styles.slide}
                                                    source={{
                                                        uri: banner.cover,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </Swiper>
                                ) : null}
                            </View>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    jump(proData?.popular_banner_list?.url);
                                }}>
                                <FastImage
                                    style={{width: '100%', height: px(120), marginTop: px(8)}}
                                    resizeMode="cover"
                                    source={{uri: proData?.popular_banner_list?.cover}}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.othersWrap}>
                        {proData?.menu_list ? renderSecurity(proData?.menu_list) : null}
                        {proData?.live_list && (
                            <View style={styles.liveCardsWrap}>
                                <View style={styles.liveCardsHeader}>
                                    <Text style={styles.liveCardsTitleText}>{proData?.live_list?.title}</Text>
                                    {proData?.live_list.has_more ? (
                                        <FontAwesome
                                            name={'angle-right'}
                                            size={18}
                                            color={'#545968'}
                                            onPress={() => {
                                                jump(proData?.live_list?.more?.url);
                                            }}
                                        />
                                    ) : null}
                                </View>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{marginTop: px(8)}}>
                                    {proData?.live_list.items.map?.((item, idx) => (
                                        <LiveCard
                                            data={item}
                                            key={idx}
                                            style={{
                                                marginLeft: px(idx > 0 ? 6 : 0),
                                                width: px(213),
                                                borderWidth: 0.5,
                                                borderColor: '#E9EAEF',
                                            }}
                                            coverStyle={{width: px(213), height: px(94)}}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                        {proData?.popular_subject ? (
                            <LinearGradient
                                colors={['#FFFFFF', '#F4F5F7']}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}
                                style={{marginTop: px(12), borderRadius: px(6)}}>
                                <View style={{backgroundColor: '#fff', borderRadius: Space.borderRadius}}>
                                    <ProductList
                                        data={proData?.popular_subject?.items}
                                        type={proData?.popular_subject.type}
                                    />
                                </View>
                            </LinearGradient>
                        ) : null}
                        {proData?.subjects ? (
                            <View style={{backgroundColor: Colors.bgColor}}>
                                {proData?.subjects?.map?.((subject, index) => (
                                    <View key={subject.subject_id + index} style={{marginTop: px(12)}}>
                                        <AlbumCard {...subject} />
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </View>
                    <View style={{backgroundColor: '#f5f6f8'}}>
                        <BottomDesc />
                    </View>
                </ScrollView>
            </ScrollableTabView>
        </View>
    );
};

export default withNetState(Product);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabTextWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabText: {
        marginLeft: px(20),
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
    },
    tabActive: {
        fontSize: px(18),
        lineHeight: px(25),
    },
    searchInput: {
        marginLeft: px(20),
        marginRight: px(12),
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: px(146),
        paddingHorizontal: px(6),
        paddingVertical: px(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchPlaceHolder: {
        fontSize: px(13),
        color: '#545968',
        lineHeight: px(18),
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
    menuWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: px(28),
    },
    menuItem: {
        justifyContent: 'center',
    },
    menuItemIcon: {
        width: px(26),
        height: px(26),
    },
    menuItemText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#fff',
        marginTop: px(7),
        textAlign: 'center',
    },
    secure_card: {
        width: px(165),
        paddingVertical: px(12),
        paddingHorizontal: px(14),
        height: px(61),
    },
    common_card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginRight: px(12),
    },
    secure_title: {
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: 'bold',
        color: Colors.defaultColor,
    },
    light_text: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
    },
    othersWrap: {
        backgroundColor: '#f5f6f8',
        paddingHorizontal: px(16),
    },
    liveCardsWrap: {
        marginTop: px(12),
        backgroundColor: '#fff',
        borderRadius: px(6),
        padding: px(12),
    },
    liveCardsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    liveCardsTitleText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
    slide: {
        height: px(100),
        borderRadius: px(6),
    },
    dotStyle: {
        backgroundColor: '#fff',
        borderRadius: 0,
        height: px(3),
    },
    swiperWrap: {
        paddingHorizontal: px(16),
        marginTop: px(16),
    },
    optionalTabsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionalTabWrap: {
        borderRadius: px(20),
        paddingHorizontal: px(12),
        paddingVertical: px(6),
    },
    optionalTabText: {
        fontSize: px(11),
        lineHeight: px(15),
    },
    specialItem: {
        backgroundColor: '#fff',
        marginBottom: px(12),
        borderRadius: px(6),
        padding: px(12),
    },
    specialItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    specialItemText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
    specialContent: {
        flexDirection: 'row',
        marginTop: px(6),
    },
    specialContentText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
    },
});

const RenderOptionalTabBar = (props) => {
    return (
        <View style={styles.optionalTabsWrap}>
            {props.tabs.map((item, idx) => (
                <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    style={[
                        styles.optionalTabWrap,
                        {
                            backgroundColor: props.activeTab === idx ? '#0051CC' : '#fff',
                        },
                        {marginLeft: idx > 0 ? px(8) : 0},
                    ]}
                    onPress={() => {
                        props.goToPage(idx);
                    }}>
                    <Text style={[styles.optionalTabText, {color: props.activeTab === idx ? '#fff' : '#121D3A'}]}>
                        {item}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const SpecialList = ({data, tabButton}) => {
    const jump = useJump();
    return data?.items ? (
        <View>
            {data?.items?.map((item, idx) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        jump(item.url);
                    }}
                    key={idx}
                    style={styles.specialItem}>
                    <View style={styles.specialItemHeader}>
                        <Text style={styles.specialItemText}>{item.name}</Text>
                        <FontAwesome name={'angle-right'} size={18} color={'#545968'} />
                    </View>
                    <View style={styles.specialContent}>
                        <FastImage
                            source={{uri: item.desc_icon}}
                            style={{width: px(8), height: px(8), marginTop: px(3), marginRight: px(4)}}
                        />
                        <Text style={styles.specialContentText} numberOfLines={1}>
                            {item.desc}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
            {tabButton ? (
                <View style={[Style.flexRow, {backgroundColor: '#fff'}]}>
                    {tabButton?.map((btn, dex) => (
                        <TouchableOpacity
                            key={dex}
                            activeOpacity={0.9}
                            onPress={() => jump(btn.url)}
                            style={[Style.flexRow, {flex: 1, paddingVertical: px(14), justifyContent: 'center'}]}>
                            <Feather
                                size={px(16)}
                                name={btn.icon == 'FollowAddFund' ? 'plus-circle' : 'list'}
                                color={Colors.btnColor}
                            />
                            <View style={{width: px(6)}} />
                            <Text style={{color: Colors.btnColor}}>{btn.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : null}
        </View>
    ) : (
        <View style={{...Style.flexCenter, height: px(200)}}>
            <LoadingTips color="#ddd" />
        </View>
    );
};

const menuList = [
    {
        title: '安全保障',
        desc: '证监会批准持牌机构',
        icon: 'https://static.licaimofang.com/wp-content/uploads/2021/04/icon_home_aq@3x.png',
        url: {
            path: 'LCMF',
            type: 4,
            params: {
                link: 'https://edu.licaimofang.cn/fundSafe',
                title: '资金安全',
                scene: 'fund_safe',
            },
        },
    },
    {
        title: '理财原则',
        desc: '放大钱+稳定的复利',
        icon: 'https://static.licaimofang.com/wp-content/uploads/2021/04/icon_touzililian@3x.png',
        url: {
            path: 'ArticleDetail',
            type: 1,
            params: {
                article_id: 4,
                type: 1,
                is_article: true,
                fr: '',
            },
        },
    },
];

const liveOption = {
    title: '直播',
    has_more: true,
    options: [
        {
            id: 63,
            title: '魔方7周年系列畅聊会（第4场）',
            cover: 'https://public.licaimofang.com/cms/upload/2022-09-08/b561a6e0502e1e242c5ff357d1a496e9.png',
            cl_cover_multi: 'https://public.licaimofang.com/cms/upload/2022-09-08/95fd4ebe70deff323661a7b08fa42bed.png',
            cl_land_image: '',
            people_num_desc: '494人预约',
            status_desc: '今天19:30直播',
            live_time_desc: '9月14日 19:30',
            avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/05/mofang-avatar.png',
            user_name: '理财魔方',
            status: 1,
            type: 20,
            reserved: true,
            reserved_num: 494,
            button: {
                text: '预约',
            },
            url: {
                path: 'Live',
                type: 1,
                params: {
                    link:
                        'https://live.youinsh.com/livestreamapi/v1/user/from_channel_register?user_id=1000000002&auth_token=3a02096d267fc1be0cb84e5e77c6a8d6&enterprise_id=996&next=https%3A%2F%2Flive.youinsh.com%2Flivestream%2FverticalScreen%2F%3Fliveid%3D15185%26enterprise_id%3D996',
                },
            },
        },
        {
            id: 63,
            title: '魔方7周年系列畅聊会（第4场）',
            cover: 'https://public.licaimofang.com/cms/upload/2022-09-08/b561a6e0502e1e242c5ff357d1a496e9.png',
            cl_cover_multi: 'https://public.licaimofang.com/cms/upload/2022-09-08/95fd4ebe70deff323661a7b08fa42bed.png',
            cl_land_image: '',
            people_num_desc: '494人预约',
            status_desc: '今天19:30直播',
            live_time_desc: '9月14日 19:30',
            avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/05/mofang-avatar.png',
            user_name: '理财魔方',
            status: 1,
            type: 20,
            reserved: true,
            reserved_num: 494,
            button: {
                text: '预约',
            },
            url: {
                path: 'Live',
                type: 1,
                params: {
                    link:
                        'https://live.youinsh.com/livestreamapi/v1/user/from_channel_register?user_id=1000000002&auth_token=3a02096d267fc1be0cb84e5e77c6a8d6&enterprise_id=996&next=https%3A%2F%2Flive.youinsh.com%2Flivestream%2FverticalScreen%2F%3Fliveid%3D15185%26enterprise_id%3D996',
                },
            },
        },
        {
            id: 63,
            title: '魔方7周年系列畅聊会（第4场）',
            cover: 'https://public.licaimofang.com/cms/upload/2022-09-08/b561a6e0502e1e242c5ff357d1a496e9.png',
            cl_cover_multi: 'https://public.licaimofang.com/cms/upload/2022-09-08/95fd4ebe70deff323661a7b08fa42bed.png',
            cl_land_image: '',
            people_num_desc: '494人预约',
            status_desc: '今天19:30直播',
            live_time_desc: '9月14日 19:30',
            avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/05/mofang-avatar.png',
            user_name: '理财魔方',
            status: 1,
            type: 20,
            reserved: true,
            reserved_num: 494,
            button: {
                text: '预约',
            },
            url: {
                path: 'Live',
                type: 1,
                params: {
                    link:
                        'https://live.youinsh.com/livestreamapi/v1/user/from_channel_register?user_id=1000000002&auth_token=3a02096d267fc1be0cb84e5e77c6a8d6&enterprise_id=996&next=https%3A%2F%2Flive.youinsh.com%2Flivestream%2FverticalScreen%2F%3Fliveid%3D15185%26enterprise_id%3D996',
                },
            },
        },
    ],
};

const _followData = {
    params: {
        item_type: 4,
        page: 1,
        page_size: 300,
        order_by: 'list_order',
        sort: 'desc',
        total_count: 2,
    },
    body: {
        th: [
            {
                line: {
                    title: '组合名称',
                },
                align: 'left',
            },
            {
                line: {
                    title: '净值',
                    desc: '09-12',
                },
                align: 'center',
                order_by_field: 'nav',
                current_order: '',
            },
            {
                line: {
                    title: '关注以来',
                    desc: '添加时间',
                },
                align: 'left',
            },
            {
                line: {
                    title: '近1周',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'week',
                current_order: '',
            },
            {
                line: {
                    title: '近1月',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'month',
                current_order: '',
            },
            {
                line: {
                    title: '近3月',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'three_month',
                current_order: '',
            },
            {
                line: {
                    title: '近半年',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'half_year',
                current_order: '',
            },
            {
                line: {
                    title: '近1年',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'year',
                current_order: '',
            },
            {
                line: {
                    title: '近3年',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'three_year',
                current_order: '',
            },
            {
                line: {
                    title: '近5年',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'five_year',
                current_order: '',
            },
            {
                line: {
                    title: '成立以来',
                    desc: '09-12',
                },
                align: 'left',
                order_by_field: 'founding',
                current_order: '',
            },
        ],
        tr: [
            [
                {
                    line1: {
                        value: '养老组合',
                        color: '#121D3A',
                    },
                    line2: {
                        value: '',
                        color: '#9AA0B1',
                    },
                    url: {
                        path: 'DetailRetiredPlan',
                        type: 1,
                        params: {
                            upid: 19,
                            amount: '',
                        },
                    },
                },
                {
                    line1: {
                        value: '1.3852',
                        color: '#121D3A',
                    },
                    line2: {
                        value: '0.00%',
                        color: '#121D3A',
                    },
                },
                {
                    line1: {
                        value: '1.39%',
                        color: '#E74949',
                    },
                    line2: {
                        value: '2022-07-12',
                        color: '#9AA0B1',
                    },
                },
                {
                    line1: {
                        value: '-0.04%',
                        color: '#4BA471',
                    },
                    sort_value: -0.04,
                },
                {
                    line1: {
                        value: '-0.14%',
                        color: '#4BA471',
                    },
                    sort_value: -0.13999999999999999,
                },
                {
                    line1: {
                        value: '1.88%',
                        color: '#E74949',
                    },
                    sort_value: 1.8800000000000001,
                },
                {
                    line1: {
                        value: '3.15%',
                        color: '#E74949',
                    },
                    sort_value: 3.15,
                },
                {
                    line1: {
                        value: '1.58%',
                        color: '#E74949',
                    },
                    sort_value: 1.58,
                },
                {
                    line1: {
                        value: '14.38%',
                        color: '#E74949',
                    },
                    sort_value: 14.38,
                },
                {
                    line1: {
                        value: '30.53%',
                        color: '#E74949',
                    },
                    sort_value: 30.53,
                },
                {
                    line1: {
                        value: '38.94%',
                        color: '#E74949',
                    },
                    sort_value: 38.940000000000005,
                },
            ],
            [
                {
                    line1: {
                        value: '子女教育组合',
                        color: '#121D3A',
                    },
                    line2: {
                        value: '',
                        color: '#9AA0B1',
                    },
                    url: {
                        path: 'DetailEducation',
                        type: 1,
                        params: {
                            upid: 20,
                            amount: '',
                        },
                    },
                },
                {
                    line1: {
                        value: '1.3852',
                        color: '#121D3A',
                    },
                    line2: {
                        value: '0.00%',
                        color: '#121D3A',
                    },
                },
                {
                    line1: {
                        value: '1.31%',
                        color: '#E74949',
                    },
                    line2: {
                        value: '2022-07-11',
                        color: '#9AA0B1',
                    },
                },
                {
                    line1: {
                        value: '-0.04%',
                        color: '#4BA471',
                    },
                    sort_value: -0.04,
                },
                {
                    line1: {
                        value: '-0.14%',
                        color: '#4BA471',
                    },
                    sort_value: -0.13999999999999999,
                },
                {
                    line1: {
                        value: '1.88%',
                        color: '#E74949',
                    },
                    sort_value: 1.8800000000000001,
                },
                {
                    line1: {
                        value: '3.15%',
                        color: '#E74949',
                    },
                    sort_value: 3.15,
                },
                {
                    line1: {
                        value: '1.58%',
                        color: '#E74949',
                    },
                    sort_value: 1.58,
                },
                {
                    line1: {
                        value: '14.38%',
                        color: '#E74949',
                    },
                    sort_value: 14.38,
                },
                {
                    line1: {
                        value: '30.53%',
                        color: '#E74949',
                    },
                    sort_value: 30.53,
                },
                {
                    line1: {
                        value: '38.94%',
                        color: '#E74949',
                    },
                    sort_value: 38.940000000000005,
                },
            ],
        ],
    },
};

const _tabs = [
    {
        item_type: 4,
        type_text: '组合',
    },
    {
        item_type: 666,
        type_text: '专题',
    },
];