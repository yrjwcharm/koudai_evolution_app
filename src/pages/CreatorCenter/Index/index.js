/*
 * @Description: 创作者中心首页
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:22
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px} from '~/utils/appUtil';
import {getData, getList, getUnRead} from './services';
import bellWhite from '~/assets/img/creatorCenter/bell-white.png';
import bellBlack from '~/assets/img/creatorCenter/bell-black.png';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Colors, Font, Style} from '~/common/commonStyle';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';
import LoginMask from '~/components/LoginMask';
import Loading from '~/pages/Portfolio/components/PageLoading';
import RenderHtml from '~/components/RenderHtml';
import {CommunityCard} from '~/pages/Community/components/CommunityCard';

const CreatorCenterIndex = ({navigation}) => {
    const inset = useSafeAreaInsets();
    const userInfo = useSelector((store) => store.userInfo);
    const jump = useJump();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [{system}, setUnreadData] = useState({});
    const [data, setData] = useState();
    const [list, setList] = useState([]);
    const [listLoading, setListLoading] = useState(false); // 只针对社区tab的loading
    const [refreshing, setRefreshing] = useState(false);
    const [criticalState, setScrollCriticalState] = useState(false);

    const navBarRef = useRef();
    const scrollableRef = useRef();
    const showNum = useRef(1);
    const scrollViewRef = useRef();
    const pageRef = useRef(1);
    const containerHeight = useRef(0);
    const containerScrollHeight = useRef(0);
    const listLoadingRef = useRef(false); // 只针对社区tab的流程控制

    useFocusEffect(
        useCallback(() => {
            showNum.current++ === 1 && setLoading(true);
            if (userInfo.toJS().is_login) getUnReadData();
        }, [getUnReadData, userInfo])
    );

    const init = () => {
        getData().then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                scrollViewRef.current?.scrollTo?.(0);
                setList(new Array(res.result?.items?.length || 0).fill({}));
                setLoading(false);
                pageRef.current = 1;
                showNum.current > 1 && getListData(res.result?.items);
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if (isFocused) {
                init();
            }
        });
        return () => unsubscribe();
    }, [isFocused, navigation]);

    const getListData = (items) => {
        const index = scrollableRef.current?.state?.currentPage || 0;
        let params = items?.[index]?.params;
        if (index === 0) {
            if (listLoadingRef.current) return;
            params.page = pageRef.current++;
            listLoadingRef.current = true;
        }
        setListLoading(index === 0);
        getList(params)
            .then((res) => {
                if (res.code === '000000') {
                    setList((val) => {
                        let newVal = [...val];
                        if (index === 0) {
                            if (pageRef.current === 2) {
                                newVal[index] = res.result;
                            } else {
                                newVal[index].has_more = res.result.has_more;
                                newVal[index].list = newVal[index].list?.concat(res.result.list);
                            }
                        } else {
                            newVal[index] = res.result;
                        }
                        return newVal;
                    });
                }
            })
            .finally((_) => {
                listLoadingRef.current = false;
                setListLoading(false);
            });
    };

    const getUnReadData = useCallback(() => {
        getUnRead().then((res) => {
            setUnreadData(res.result);
        });
    }, []);

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

    const communityScroll = (e) => {
        let resetHeight = containerScrollHeight.current - containerHeight.current;
        let y = e.nativeEvent.contentOffset.y;

        if (!listLoading && list?.[0]?.list?.[0] && list?.[0]?.has_more && resetHeight - y <= 40) {
            getListData(data?.items);
        }
    };

    const onChangeTab = useCallback(() => {
        const cPage = scrollableRef.current?.state?.currentPage;
        (cPage > 0 || !list?.[cPage]?.list?.length) && getListData(data?.items);
    }, [data, list]);

    return loading ? (
        <Loading color={Colors.btnColor} />
    ) : (
        <View style={styles.container}>
            <View style={{width: '100%', height: px(265)}}>
                <FastImage source={{uri: data?.head?.bg_img}} style={styles.topBgImg} />
                <View style={styles.topBgImgMask} />
                <View style={[styles.navBar, {paddingTop: inset.top}]} ref={navBarRef}>
                    {criticalState && <Text style={styles.navTitle}>管理中心</Text>}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.bellWrap}
                        onPress={() => {
                            jump({
                                path: 'MessageNotice',
                                type: 1,
                                params: {
                                    type: 'system',
                                },
                            });
                        }}>
                        <FastImage source={criticalState ? bellBlack : bellWhite} style={styles.bell} />
                        {system ? <View style={[styles.point_sty, {}]} /> : null}
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{flex: 1, marginTop: px(-178)}}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        tintColor="#fff"
                        onRefresh={() => {
                            setRefreshing(true);
                            getData()
                                .then((res) => {
                                    if (res.code === '000000') {
                                        setData(res.result);
                                        getListData(res.result.items);
                                    }
                                })
                                .finally((_) => setRefreshing(false));
                        }}
                    />
                }
                onScroll={onScroll}>
                <View style={{height: px(25)}} />
                <View style={styles.briefWrap}>
                    <View style={styles.briefMain}>
                        <View style={styles.briefMainLeft}>
                            <FastImage
                                style={styles.avatar}
                                source={{
                                    uri: data?.head?.info?.avatar,
                                }}
                            />
                            <Text style={styles.nickName}>{data?.head?.info?.name}</Text>
                        </View>
                        <View style={styles.briefMainRight}>
                            {data?.head?.button ? (
                                <TouchableOpacity
                                    style={styles.editBtnWrap}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        jump(data?.head?.button.url);
                                    }}>
                                    <Text style={styles.editBtnText}>{data?.head?.button.text}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                    <View style={styles.briefDescWrap}>
                        {data?.head?.info?.desc?.show_edit ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={Style.flexRow}
                                onPress={() => {
                                    jump(data?.head?.button.url);
                                }}>
                                <Text style={styles.briefDesc}>点击添加我的简介</Text>
                                <FastImage
                                    style={styles.editIcon}
                                    source={{
                                        uri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/edit-icon.png',
                                    }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <RenderHtml style={styles.briefDesc} html={data?.head?.info?.desc?.content} />
                        )}
                    </View>
                </View>
                <View style={styles.cardsWrap}>
                    <ScrollableTabView
                        initialPage={0}
                        renderTabBar={() => (
                            <ScrollableTabBar
                                style={{
                                    paddingHorizontal: px(15),
                                    marginTop: px(2),
                                    justifyContent: 'space-around',
                                    marginBottom: px(12),
                                }}
                            />
                        )}
                        ref={scrollableRef}
                        onChangeTab={onChangeTab}>
                        {data?.items?.map?.((item, idx) => {
                            return (
                                <ScrollView
                                    key={idx}
                                    tabLabel={item.title}
                                    style={{flex: 1}}
                                    contentContainerStyle={{paddingHorizontal: px(16)}}
                                    scrollIndicatorInsets={{right: 1}}
                                    ref={scrollViewRef}
                                    onScroll={idx === 0 ? communityScroll : null}
                                    onLayout={(e) => {
                                        containerHeight.current = e.nativeEvent.layout.height;
                                    }}
                                    onContentSizeChange={(w, h) => {
                                        containerScrollHeight.current = h;
                                    }}>
                                    {item.type === 'product' ? (
                                        <>
                                            {list?.[idx]?.list?.map((itm, index) => (
                                                <CommunityCard
                                                    data={itm}
                                                    key={index}
                                                    style={{
                                                        marginTop: index > 0 ? px(12) : 0,
                                                    }}
                                                />
                                            ))}
                                            {listLoading ? (
                                                <View style={{paddingVertical: px(10)}}>
                                                    <ActivityIndicator />
                                                </View>
                                            ) : null}
                                            <View style={{height: 40}} />
                                        </>
                                    ) : (
                                        <View style={styles.cardWrap}>
                                            <>
                                                {list?.[idx]?.list?.map((itm, index) => (
                                                    <View style={styles.cardItem} key={index}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.7}
                                                            style={styles.cardItemHeader}
                                                            onPress={() => {
                                                                // jump({
                                                                //     path: 'EditProduct',
                                                                //     params: {
                                                                //         id: 179,
                                                                //         product_type: 1,
                                                                //         product_id: '000001',
                                                                //         desc: '',
                                                                //         yield_range: '',
                                                                //         style_id: 0,
                                                                //         category_id: '',
                                                                //     },
                                                                // });
                                                                // jump({path: 'AddProductStep1', params: {subject_id: 111}});
                                                                // jump({
                                                                //     path: 'EditSpecialCardInfo',
                                                                //     params: {
                                                                //         maxNum: 6,
                                                                //         selectType: 1,
                                                                //     },
                                                                // });
                                                                // jump({
                                                                //     path: 'SpecialDetailDraft',
                                                                //     type: 1,
                                                                //     params: {
                                                                //         link:
                                                                //             'http://192.168.190.43:3000/specialDetailDraft',
                                                                //         params: {
                                                                //             subject_id: 1026,
                                                                //             scene: 'creating',
                                                                //         },
                                                                //     },
                                                                // });
                                                                // jump({
                                                                //     path: 'AddProductStep2',
                                                                //     type: 1,
                                                                //     params: {
                                                                //         subject_id: '1030',
                                                                //     },
                                                                // });
                                                                // jump({
                                                                //     path: 'SubjectCollection',
                                                                //     params: {
                                                                //         ...itm?.url?.params,
                                                                //         tab: 1,
                                                                //     },
                                                                // });
                                                                // jump({
                                                                //     path: 'SpecialDetail',
                                                                //     type: 1,
                                                                //     params: {
                                                                //         link: 'http://192.168.2.9:3000/specialDetail',
                                                                //         params: {
                                                                //             subject_id: 1011,
                                                                //             is_preview: 0,
                                                                //         },
                                                                //     },
                                                                // });
                                                                // jump({
                                                                //     path: 'SpecialCardStylePreview',
                                                                //     params: {
                                                                //         subject_id: 134,
                                                                //         img:
                                                                //             'https://lcmf.oss-cn-hangzhou.aliyuncs.com/upload/identity/1000000002/2022102016002449805_png_?OSSAccessKeyId=LTAI51SSQWDG4LDz&Expires=1977292824&Signature=yJ3jQzDLx8OKSE7eDkCNLvYlwJU%3D',
                                                                //         desc: '123123123',
                                                                //     },
                                                                // });
                                                                // jump({
                                                                //     path: 'SpecialExamine',
                                                                //     params: {
                                                                //         apply_id: 2,
                                                                //     },
                                                                // });
                                                                jump(itm?.url);
                                                            }}>
                                                            <Text style={styles.cardItemHeaderTitle}>{itm.title}</Text>
                                                            <Icon
                                                                color={Colors.descColor}
                                                                name="angle-right"
                                                                size={px(14)}
                                                            />
                                                        </TouchableOpacity>
                                                        <View style={styles.cardItemPanel}>
                                                            {itm.items?.map?.((obj, i) => (
                                                                <View style={styles.cardItemPanelSubItem} key={i}>
                                                                    <Text style={styles.cardItemPanelSubItemNum}>
                                                                        {obj.val}
                                                                    </Text>
                                                                    <Text style={styles.cardItemPanelSubItemDesc}>
                                                                        {obj.key}
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                ))}
                                            </>
                                        </View>
                                    )}
                                </ScrollView>
                            );
                        })}
                    </ScrollableTabView>
                </View>
            </View>
            {!userInfo.toJS().is_login && <LoginMask />}
        </View>
    );
};

export default CreatorCenterIndex;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    topBgImg: {width: '100%', height: '100%', position: 'absolute', top: 0, left: 0},
    topBgImgMask: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#121D3A',
        opacity: 0.5,
    },
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
        right: px(0),
        top: px(0),
        backgroundColor: Colors.red,
        borderRadius: px(20),
        zIndex: 3,
        minWidth: px(6),
        height: px(6),
    },
    point_text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: px(9),
        lineHeight: px(13),
        fontFamily: Font.numFontFamily,
    },
    briefWrap: {
        paddingHorizontal: px(20),
    },
    briefMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    briefMainLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: px(52),
        height: px(52),
        borderRadius: px(52),
        borderWidth: 2,
        borderColor: '#fff',
    },
    nickName: {
        marginLeft: px(16),
        fontSize: px(18),
        lineHeight: px(25),
        color: '#fff',
    },
    editBtnWrap: {
        borderWidth: 0.5,
        borderColor: '#fff',
        borderRadius: px(103),
        paddingHorizontal: px(20),
        paddingVertical: px(6),
    },
    editBtnText: {
        fontSize: px(12),
        lineHeight: px(18),
        color: '#fff',
    },
    briefDescWrap: {
        marginTop: px(16),
        height: px(34),
    },
    briefDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
    },
    editIcon: {
        width: px(12),
        height: px(12),
        marginLeft: px(4),
    },
    cardsWrap: {
        backgroundColor: '#F5F6F8',
        borderTopLeftRadius: px(12),
        borderTopRightRadius: px(12),
        paddingTop: px(16),
        paddingBottom: 0,
        marginTop: px(24),
        flex: 1,
    },
    cardWrap: {},
    cardItem: {
        borderRadius: px(6),
        backgroundColor: '#fff',
        marginBottom: px(12),
        padding: px(16),
    },
    cardItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        height: px(24),
    },
    cardItemHeaderTitle: {
        fontSize: px(13),
        lineHeight: px(15),
        color: '#121D3A',
        fontWeight: 'bold',
    },
    cardItemPanel: {
        marginTop: px(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardItemPanelSubItem: {
        flex: 1,
    },
    cardItemPanelSubItemNum: {
        fontSize: px(18),
        lineHeight: px(18),
        color: '#121d3a',
        fontFamily: Font.numFontFamily,
    },
    cardItemPanelSubItemDesc: {
        fontSize: px(12),
        lineHeight: px(14),
        color: '#9aa0b1',
        marginTop: px(4),
    },
});
