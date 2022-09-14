/*
 * @Description: 产品首页
 * @Autor: wxp
 * @Date: 2022-09-13 11:45:41
 * @LastEditors: wxp
 * @LastEditTime: 2022-09-14 15:57:16
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Platform, RefreshControl} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Font, Style} from '~/common/commonStyle';
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
import Animated from 'react-native-reanimated';

const Product = () => {
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [tabActive, setTabActive] = useState(1);
    const [optionalTabActive, setOptionalTabActive] = useState(1);
    const [followData, setFollowData] = useState();

    const tabRef = useRef(null);
    const optionalTabRef = useRef(null);

    const bgType = useMemo(() => {
        return true;
    }, [tabActive]);

    useEffect(() => {
        getFollowData();
    }, []);

    const getFollowData = useCallback(async (params) => {
        // let res = await getFollowList(params);
        let res = _followData;
        setFollowData(res);
    }, []);

    const onChangeTab = useCallback((cur) => {
        setTabActive(cur.i);
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
                                    <Text style={[styles.secure_title, {marginLeft: px(4)}]}>{item.title}</Text>
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
                colors={bgType ? ['#EBF5FF', '#F4F5F7'] : ['#1F58C8', '#1B45B7']}>
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
                            // jump();
                        }}>
                        <FastImage
                            source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/pk-search.png'}}
                            style={{width: px(18), height: px(18), marginRight: px(4)}}
                        />
                        <Text style={styles.searchPlaceHolder}>{'搜索基金/组合/计划'}</Text>
                    </TouchableOpacity>
                    <View>
                        {true ? (
                            <View style={[styles.point_sty, Style.flexCenter, {left: 100 > 99 ? px(11) : px(15)}]}>
                                <Text style={styles.point_text}>{100 > 99 ? '99+' : 55}</Text>
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
                    </View>
                </View>
            </LinearGradient>
            <ScrollableTabView
                ref={(e) => {
                    tabRef.current = e;
                }}
                style={{flex: 1, marginTop: px(-83)}}
                initialPage={1}
                renderTabBar={false}
                onChangeTab={onChangeTab}>
                <ScrollView tabLabel="自选">
                    <View style={{paddingHorizontal: px(16)}}>
                        <ScrollableTabView
                            prerenderingSiblingsNumber={_tabs?.length}
                            locked={true}
                            renderTabBar={() => <RenderOptionalTabBar />}
                            onChangeTab={onChangeOptionalTab}
                            ref={optionalTabRef}>
                            {_tabs?.map((tab, index) => (
                                <View key={index} tabLabel={tab?.type_text} style={{marginTop: px(12)}}>
                                    {tab.item_type === 666 ? (
                                        <SpecialList />
                                    ) : (
                                        <FollowTable
                                            data={followData}
                                            activeTab={_tabs?.[optionalTabActive]?.item_type || 0}
                                            handleSort={getFollowData}
                                            tabButton={_tabs[optionalTabActive]?.button_list}
                                            notStickyHeader={true}
                                        />
                                    )}
                                </View>
                            ))}
                        </ScrollableTabView>
                    </View>
                </ScrollView>
                <ScrollView
                    tabLabel="产品"
                    style={{flex: 1}}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}>
                    <View style={styles.menuWrap}>
                        {[1, 2, 3].map((item, idx) => {
                            return (
                                <View style={styles.menuItem} key={idx}>
                                    <FastImage
                                        source={{
                                            uri: bgType
                                                ? 'http://static.licaimofang.com/wp-content/uploads/2022/09/message-centre.png'
                                                : 'http://static.licaimofang.com/wp-content/uploads/2022/09/message-centre-2.png',
                                        }}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={[styles.menuItemText, {color: bgType ? '#121d3a' : '#fff'}]}>
                                        基金
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.bannerWrap}>
                        {bgType ? (
                            <View style={styles.swiperWrap}>
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
                                    {baner.map((banner, index) => (
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
                            </View>
                        ) : (
                            <FastImage
                                style={{width: '100%', height: px(120), marginTop: px(8)}}
                                resizeMode="cover"
                                source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/08/PR966-818.png'}}
                            />
                        )}
                    </View>
                    <View style={styles.othersWrap}>
                        {true ? renderSecurity(menuList) : null}
                        <View style={styles.liveCardsWrap}>
                            <View style={styles.liveCardsHeader}>
                                <Text style={styles.liveCardsTitleText}>{liveOption.title}</Text>
                                {liveOption.has_more ? (
                                    <FontAwesome name={'angle-right'} size={18} color={'#545968'} />
                                ) : null}
                            </View>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{marginTop: px(8)}}>
                                {liveOption.options.map((item, idx) => (
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
                    </View>
                    <View style={{backgroundColor: '#f5f6f8'}}>
                        <BottomDesc />
                    </View>
                </ScrollView>
            </ScrollableTabView>
        </View>
    );
};

export default Product;

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

const SpecialList = () => {
    return (
        <View>
            {[1, 2, 3].map((item, idx) => (
                <View key={idx} style={styles.specialItem}>
                    <View style={styles.specialItemHeader}>
                        <Text style={styles.specialItemText}>追求高收益基金</Text>
                        <FontAwesome name={'angle-right'} size={18} color={'#545968'} />
                    </View>
                    <View style={styles.specialContent}>
                        <FastImage
                            source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/09/quotation.png'}}
                            style={{width: px(8), height: px(8), marginTop: px(3), marginRight: px(4)}}
                        />
                        <Text style={styles.specialContentText} numberOfLines={1}>
                            专题描述详细内容展示内容，包括内容是两行的情展示专题描述详细内容展示内容，包括内容是两行的情展示专题描述详细内容展示内容，包括内容是两行的情展示
                        </Text>
                    </View>
                </View>
            ))}
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

const baner = [
    {
        id: 207,
        cover: 'https://public.licaimofang.com/cms/upload/2022-09-13/46917ece2bf2984374b280af1ecbe34b.png',
        url: {
            path: 'WebView',
            type: 4,
            params: {
                link: 'https://edu.licaimofang.cn/active818?title=818%E7%90%86%E8%B4%A2%E8%8A%82&uid=1000000002',
                title: '818理财节',
                timestamp: 1,
            },
        },
    },
    {
        id: 211,
        cover: 'https://public.licaimofang.com/cms/upload/2022-08-26/b1e9a3986323fab1eaa258d88fde1beb.png',
        url: {
            path: 'ArticleDetail',
            type: 1,
            params: {
                article_id: '2710',
                type: 5,
            },
            id: 1,
        },
    },
    {
        id: 180,
        cover: 'https://public.licaimofang.com/cms/upload/2022-09-05/9a1243ed554add764d4aa5f16dece18b.jpg',
        url: {
            path: 'ArticleDetail',
            type: 1,
            params: {
                article_id: '2788',
                type: 1,
            },
            id: 1,
        },
    },
    {
        id: 161,
        cover: 'https://public.licaimofang.com/cms/upload/2022-09-13/0134a87507f87aa28ffc351f95c19049.png',
        url: {
            path: 'ArticleDetail',
            type: 1,
            params: {
                article_id: '2851',
                type: 1,
            },
            id: 1,
        },
    },
    {
        id: 166,
        cover: 'https://public.licaimofang.com/cms/upload/2022-09-05/58b1089355cae985cfc69239ce6b9395.png',
        url: {
            path: 'ArticleDetail',
            type: 1,
            params: {
                article_id: '2781',
                type: 5,
            },
            id: 1,
        },
    },
];

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
