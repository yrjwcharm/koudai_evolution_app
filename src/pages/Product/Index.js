/*
 * @Description: 产品首页
 * @Autor: wxp
 * @Date: 2022-09-13 11:45:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-24 14:20:31
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
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
import LogView from '~/components/LogView';
import ScrollableTabBar from '~/components/ScrollableTabBar';
import HotFund from '../Attention/Index/HotFund';
import Toast from '~/components/Toast';
import {followAdd} from '../Attention/Index/service';

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
    const [allMsg, setAll] = useState(0);
    const [subjectLoading, setSubjectLoading] = useState(false); // 显示加载动画
    const [subjectData, setSubjectsData] = useState({});
    const [subjectList, setSubjectList] = useState([]);

    const tabRef = useRef(null);
    const optionalTabRef = useRef(null);
    const isFirst = useRef(1);
    const scrollViewRef = useRef();
    const pageRef = useRef(1);
    const subjectToBottomHeight = useRef(0);

    const subjectLoadingRef = useRef(false); // 为了流程控制

    const bgType = useMemo(() => {
        return tabActive === 1 && proData?.popular_banner_list ? false : true;
    }, [tabActive, proData]);

    useFocusEffect(
        useCallback(() => {
            [(getFollowTabs, getProData)][tabRef.current?.state?.currentPage]?.(isFirst.current++);
            tabRef.current?.goToPage?.(tabRef.current?.state?.currentPage);
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
                scrollViewRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                setTimeout(() => {
                    [getFollowTabs, getProData][tabRef.current?.state?.currentPage]?.(0);
                }, 0);
                global.LogTool('tabDoubleClick', 'ProductIndex');
            }
        });
        return () => unsubscribe();
    }, [isFocused, navigation]);

    const getProData = (type) => {
        type === 0 && setRefreshing(true);
        type === 1 && setLoading(true);
        http.get('/products/index/20220901')
            .then((res) => {
                if (res.code === '000000') {
                    setProData(res.result);
                    // 获取专题
                    pageRef.current = 1;
                    getSubjects(res.result?.page_type, 'init');
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
                    optionalTabRef.current?.goToPage(0);
                    setFollowTabs(res.result);
                }
            })
            .finally((_) => {
                setRefreshing(false);
                setLoading(false);
            });
    };

    const getSubjects = (page_type, type) => {
        if (subjectLoadingRef.current) return;
        setSubjectLoading(true);
        subjectLoadingRef.current = true;
        http.get('/products/subject/list/20220901', {page_type, page: pageRef.current++}).then((res) => {
            if (res.code === '000000') {
                setSubjectLoading(false);
                subjectLoadingRef.current = false;
                setSubjectsData(res.result);
                const newList = res.result.items || [];
                setSubjectList((val) => (type === 'init' ? newList : val.concat(newList)));
            }
        });
    };

    const getFollowData = async (params) => {
        let res = await http.get('/follow/list/202206', params);

        const obj = res.result.body?.tr?.[0]?.[0];
        if (obj) {
            obj.LogTool = () => {
                global.LogTool({
                    event: 'optionalDetail',
                    oid: obj?.url?.params?.params?.plan_id || obj?.url?.params?.code,
                    ctrl: followTabs?.follow?.tabs[optionalTabRef.current?.state?.currentPage]?.type_text,
                });
            };
        }
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

    const onChangeOptionalTab = (cur) => {
        const tabs = followTabs?.follow?.tabs;
        global.LogTool({event: tabs[cur.i].event_id});
        let item_type = tabs[cur.i]?.item_type;
        getFollowData({
            item_type,
        });
    };

    //一键关注
    const onFollow = async (params) => {
        let res = await followAdd(params);
        if (res.code == '000000') {
            getFollowTabs();
        }
        Toast.show(res.message);
    };

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
                            style={[styles.secure_card, styles.common_card]}
                            onPress={() => {
                                global.LogTool(item.click_code);
                                jump(item?.url);
                            }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FastImage style={{width: px(18), height: px(18)}} source={{uri: item.icon}} />
                                <View style={{marginLeft: px(5)}}>
                                    <Text style={[styles.secure_title]}>{item?.title}</Text>
                                    <Text style={styles.light_text}>{item.desc}</Text>
                                </View>
                            </View>
                            <FastImage
                                style={{width: px(10), height: px(10)}}
                                source={{
                                    uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/right-arrow2.png',
                                }}
                            />
                        </TouchableOpacity>
                    </BoxShadow>
                ))}
            </View>
        ) : null;
    };

    const proScroll = useCallback(
        (e, cHeight, cScrollHeight) => {
            let resetHeight = cScrollHeight - cHeight;
            let y = e.nativeEvent.contentOffset.y;

            if (
                !subjectLoading &&
                subjectList?.[0] &&
                subjectData?.has_more &&
                resetHeight - y <= subjectToBottomHeight.current + 20
            ) {
                getSubjects(proData.page_type);
            }
        },
        [subjectLoading, subjectList, subjectData, proData]
    );

    return loading ? (
        <Loading color={Colors.btnColor} />
    ) : (
        <View
            style={[
                styles.container,
                {backgroundColor: bgType ? proData?.bg_colors?.[1] : proData?.popular_banner_list?.bg_colors?.[1]},
            ]}>
            <LinearGradient
                style={{paddingTop: insets.top + px(6), height: px(170)}}
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
                            source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/pk-search.png'}}
                            style={{width: px(18), height: px(18), marginLeft: px(2), marginRight: px(4)}}
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
                ref={tabRef}
                style={{flex: 1, marginTop: Platform.OS === 'ios' ? px(-83) : px(-95)}}
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
                    <View style={{paddingHorizontal: px(16), marginTop: px(8)}}>
                        {followTabs?.follow?.tabs ? (
                            <ScrollableTabView
                                prerenderingSiblingsNumber={followTabs?.follow?.tabs?.length}
                                locked={true}
                                renderTabBar={() => <ScrollableTabBar />}
                                onChangeTab={onChangeOptionalTab}
                                ref={optionalTabRef}>
                                {followTabs?.follow?.tabs?.map?.((tab, index) => {
                                    const curTabs =
                                        followTabs?.follow?.tabs?.[optionalTabRef.current?.state?.currentPage];
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
                        ) : (
                            <HotFund data={followTabs?.hot_fund || {}} onFollow={onFollow} />
                        )}
                    </View>
                </ScrollView>
                <LogView.Wrapper
                    tabLabel="产品"
                    ref={scrollViewRef}
                    style={{flex: 1}}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            {...(bgType ? {} : {tintColor: '#fff'})}
                            refreshing={refreshing}
                            onRefresh={() => getProData(0)}
                        />
                    }
                    onScroll={proScroll}>
                    {Object.keys(proData || {}).length ? (
                        <>
                            <View style={styles.menuWrap}>
                                {proData?.nav?.map?.((item, idx) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                // jump({
                                                //     path: 'PortfolioDetails',
                                                //     params: {
                                                //         link: 'http://192.168.190.43:3000/portfolioDetails',
                                                //         params: {
                                                //             plan_id: '29',
                                                //         },
                                                //     },
                                                // });
                                                // jump({
                                                //     path: 'SpecialDetail',
                                                //     params: {
                                                //         link: 'http://192.168.190.33:3000/specialDetail',
                                                //         params: {
                                                //             subject_id: '1',
                                                //         },
                                                //     },
                                                // });
                                                // jump({
                                                //     path: 'PortfolioDetails',
                                                //     type: 1,
                                                //     params: {
                                                //         link: 'http://192.168.190.57:3000/portfolioDetails',
                                                //         params: {
                                                //             plan_id: 30,
                                                //         },
                                                //     },
                                                // });
                                                jump(item.url);
                                                global.LogTool({
                                                    event: item.event_id,
                                                });
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

                                {proData?.popular_subject ? (
                                    <LinearGradient
                                        colors={['#FFFFFF', '#F4F5F7']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 1}}
                                        style={{marginTop: px(12), borderRadius: px(6)}}>
                                        <LogView.Item
                                            logKey={proData?.popular_subject.type}
                                            handler={() => {
                                                global.LogTool({
                                                    event: 'rec_show',
                                                    ctrl: proData?.popular_subject.subject_id,
                                                    plateid: proData?.popular_subject.plateid,
                                                    rec_json: proData?.popular_subject.rec_json,
                                                });
                                            }}
                                            style={{
                                                backgroundColor: '#fff',
                                                borderRadius: Space.borderRadius,
                                                overflow: 'hidden',
                                            }}>
                                            <ProductList
                                                data={proData?.popular_subject?.items}
                                                type={proData?.popular_subject.type}
                                                logParams={{
                                                    event: 'rec_click',
                                                    ctrl: proData?.popular_subject.subject_id,
                                                    plateid: proData?.popular_subject.plateid,
                                                    rec_json: proData?.popular_subject.rec_json,
                                                }}
                                            />
                                        </LogView.Item>
                                    </LinearGradient>
                                ) : null}
                                {proData?.live_list && (
                                    <View style={styles.liveCardsWrap}>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={styles.liveCardsHeader}
                                            onPress={() => {
                                                jump(proData?.live_list?.more?.url);
                                            }}>
                                            <Text style={styles.liveCardsTitleText}>{proData?.live_list.title}</Text>
                                            {proData?.live_list.more ? (
                                                <FontAwesome name={'angle-right'} size={px(14)} color={'#545968'} />
                                            ) : null}
                                        </TouchableOpacity>
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
                                {subjectList?.[0] ? (
                                    <>
                                        <View style={{backgroundColor: Colors.bgColor}}>
                                            {subjectList?.map?.((subject, index, ar) => (
                                                <LogView.Item
                                                    logKey={subject.subject_id}
                                                    handler={() => {
                                                        let subject = subjectList?.[index];
                                                        global.LogTool({
                                                            event: 'rec_show',
                                                            ctrl: subject.subject_id,
                                                            plateid: subject.plateid,
                                                            rec_json: subject.rec_json,
                                                        });
                                                    }}
                                                    key={subject.subject_id + index}
                                                    style={{marginTop: px(12)}}>
                                                    <AlbumCard {...subject} />
                                                </LogView.Item>
                                            ))}
                                        </View>
                                        {subjectLoading ? (
                                            <View style={{paddingVertical: px(20)}}>
                                                <ActivityIndicator />
                                            </View>
                                        ) : null}
                                        {!subjectData?.has_more ? (
                                            <Text style={{textAlign: 'center'}}>已经没有更多了</Text>
                                        ) : null}
                                    </>
                                ) : null}
                            </View>
                            {/* subjectList以下的内容请写到这里，因为在计算其距底部的距离 */}
                            <View
                                style={{backgroundColor: '#f5f6f8'}}
                                onLayout={(e) => {
                                    subjectToBottomHeight.current = e.nativeEvent.layout.height;
                                }}>
                                <BottomDesc />
                            </View>
                        </>
                    ) : (
                        <View style={{marginTop: px(20)}}>
                            <LoadingTips color="#ddd" size={30} />
                        </View>
                    )}
                </LogView.Wrapper>
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
        fontWeight: '500',
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
        marginTop: px(8),
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
        padding: px(14),
        height: px(61),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    common_card: {
        backgroundColor: '#fff',
        borderRadius: px(5),
        marginRight: px(12),
    },
    secure_title: {
        fontSize: px(13),
        lineHeight: px(18),
        fontWeight: 'bold',
        color: Colors.defaultColor,
    },
    light_text: {
        fontSize: px(11),
        lineHeight: px(15),
        color: Colors.lightGrayColor,
        marginTop: px(4),
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
        fontWeight: 'bold',
    },
    specialContent: {
        flexDirection: 'row',
        marginTop: px(6),
    },
    specialContentText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
        flex: 1,
    },
    emptyWrap: {
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
    },
});

const SpecialList = ({data, tabButton}) => {
    const jump = useJump();
    return data?.items ? (
        <View>
            {data?.items?.map((item, idx) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        global.LogTool({
                            event: 'optionalDetail',
                            oid: item?.url?.params?.params?.subject_id,
                            ctrl: '专题',
                        });
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
                <View style={[Style.flexRow, {backgroundColor: '#fff', borderRadius: px(6)}]}>
                    {tabButton?.map((btn, dex) => (
                        <TouchableOpacity
                            key={dex}
                            activeOpacity={0.9}
                            onPress={() => {
                                global.LogTool({event: btn.event_id});
                                jump(btn.url);
                            }}
                            style={[Style.flexRow, {flex: 1, paddingVertical: px(14), justifyContent: 'center'}]}>
                            {btn.icon == 'FollowAddFund' ? (
                                <Feather size={px(16)} name={'plus-circle'} color={Colors.btnColor} />
                            ) : (
                                <FastImage
                                    style={{width: px(16), height: px(16)}}
                                    source={{
                                        uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/edit-sort.png',
                                    }}
                                />
                            )}
                            <View style={{width: px(6)}} />
                            <Text style={{color: Colors.btnColor, fontSize: px(12), lineHeight: px(17)}}>
                                {btn.text}
                            </Text>
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
