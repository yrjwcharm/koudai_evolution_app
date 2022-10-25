/*
 * @Description: 创作者中心首页
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:22
 */
import React, {useCallback, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px} from '~/utils/appUtil';
import {getData, getList, getUnRead} from './services';
import bellWhite from '~/assets/img/creatorCenter/bell-white.png';
import bellBlack from '~/assets/img/creatorCenter/bell-black.png';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Colors, Font, Style} from '~/common/commonStyle';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';
import LoginMask from '~/components/LoginMask';
import Loading from '~/pages/Portfolio/components/PageLoading';
import RenderHtml from '~/components/RenderHtml';

const CreatorCenterIndex = () => {
    const inset = useSafeAreaInsets();
    const userInfo = useSelector((store) => store.userInfo);
    const jump = useJump();

    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(true);
    const [{system}, setUnreadData] = useState({});
    const [data, setData] = useState();
    const [list, setList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [criticalState, setScrollCriticalState] = useState(false);

    const navBarRef = useRef();
    const scrollableRef = useRef();
    const showNum = useRef(0);

    useFocusEffect(
        useCallback(() => {
            if (userInfo.toJS().is_login) getUnReadData();

            showNum.current === 0 && setLoading(true);

            getData()
                .then((res) => {
                    if (res.code === '000000') {
                        setData(res.result);
                        setLoading(false);
                        showNum.current > 0 && getListData(res.result?.items);
                    }
                })
                .finally((_) => {
                    showNum.current++;
                });
        }, [getUnReadData, userInfo])
    );

    const getListData = (items) => {
        setListLoading(true);
        const index = scrollableRef.current?.state?.currentPage || 0;
        getList(items?.[index]?.params)
            .then((res) => {
                if (res.code === '000000') {
                    setList(res.result);
                }
            })
            .finally((_) => {
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

    const onChangeTab = useCallback(() => {
        getListData(data?.items);
    }, [data]);

    return loading ? (
        <Loading color={Colors.btnColor} />
    ) : (
        <View style={styles.container}>
            <View style={{width: '100%', height: px(265)}}>
                <FastImage source={{uri: data?.head?.bg_img}} style={styles.topBgImg} />
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
            <ScrollView
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
                                        uri: 'http://static.licaimofang.com/wp-content/uploads/2022/10/edit-icon.png',
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
                        renderTabBar={() => <ScrollableTabBar style={{paddingHorizontal: px(15), marginTop: px(2)}} />}
                        ref={scrollableRef}
                        onChangeTab={onChangeTab}>
                        {data?.items?.map?.((item, idx) => {
                            return (
                                <View style={styles.cardWrap} key={idx} tabLabel={item.title}>
                                    {listLoading ? (
                                        <View style={{paddingVertical: px(20)}}>
                                            <ActivityIndicator />
                                        </View>
                                    ) : (
                                        <>
                                            {list?.list?.map((itm, index) => (
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
                                    )}
                                </View>
                            );
                        })}
                    </ScrollableTabView>
                </View>
            </ScrollView>
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
        padding: px(16),
        marginTop: px(24),
    },
    cardWrap: {
        marginTop: px(12),
    },
    cardItem: {
        borderRadius: px(6),
        backgroundColor: '#fff',
        marginBottom: px(12),
        padding: px(16),
    },
    cardItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        paddingBottom: px(10),
    },
    cardItemHeaderTitle: {
        fontSize: px(13),
        lineHeight: px(14),
        color: '#121D3A',
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
