/*
 * @Description: 创作者中心首页
 * @Autor: wxp
 * @Date: 2022-10-09 10:51:22
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, RefreshControl} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px} from '~/utils/appUtil';
import {getData, getUnRead} from './services';
import bellWhite from '~/assets/img/creatorCenter/bell-white.png';
import bellBlack from '~/assets/img/creatorCenter/bell-black.png';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Colors, Font, Style} from '~/common/commonStyle';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollableTabBar from '../components/ScrollableTabBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';

const CreatorCenterIndex = () => {
    const inset = useSafeAreaInsets();
    const userInfo = useSelector((store) => store.userInfo);
    const jump = useJump();

    const [{system}, setUnreadData] = useState({});
    const [data, setData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [criticalState, setScrollCriticalState] = useState(false);

    const navBarRef = useRef();

    useEffect(() => {
        getData().then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (userInfo.toJS().is_login) getUnReadData();
        }, [getUnReadData, userInfo])
    );

    const getUnReadData = useCallback(() => {
        getUnRead().then((res) => {
            setUnreadData(res.result);
        });
    }, []);

    const onChangeTab = useCallback(() => {}, []);

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

    return (
        <View style={styles.container}>
            <View style={{width: '100%', height: px(265)}}>
                <FastImage
                    source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/51664352728_.pic_.png'}}
                    style={styles.topBgImg}
                />
                <View style={[styles.navBar, {paddingTop: inset.top}]} ref={navBarRef}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.bellWrap}>
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}
                onScroll={onScroll}>
                <View style={{height: px(25)}} />
                <View style={styles.briefWrap}>
                    <View style={styles.briefMain}>
                        <View style={styles.briefMainLeft}>
                            <FastImage
                                style={styles.avatar}
                                source={{
                                    uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/break_even.png',
                                }}
                            />
                            <Text style={styles.nickName}>理财小能手</Text>
                        </View>
                        <View style={styles.briefMainRight}>
                            <TouchableOpacity style={styles.editBtnWrap} activeOpacity={0.8}>
                                <Text style={styles.editBtnText}>编辑</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.briefDescWrap}>
                        <Text style={styles.briefDesc}>理财魔方联合创始人，对外经贸大学经济学硕士</Text>
                        <Text style={styles.briefDesc}>理财魔方联合创始人，对外经贸大学经济学硕士</Text>
                    </View>
                </View>
                <View style={styles.cardsWrap}>
                    <ScrollableTabView
                        initialPage={1}
                        renderTabBar={() => <ScrollableTabBar style={{paddingHorizontal: px(15), marginTop: px(2)}} />}
                        onChangeTab={onChangeTab}>
                        {['作品', '专题', '社区', '评论'].map((item, idx) => {
                            return (
                                <View style={styles.cardWrap} key={idx} tabLabel={item}>
                                    <View style={styles.cardItem}>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={styles.cardItemHeader}
                                            onPress={() => {
                                                jump({path: 'SubjectCollection'});
                                            }}>
                                            <Text style={styles.cardItemHeaderTitle}>社区合集</Text>
                                            <Icon color={Colors.descColor} name="angle-right" size={px(14)} />
                                        </TouchableOpacity>
                                        <View style={styles.cardItemPanel}>
                                            {[1, 2, 3].map((itm, index) => (
                                                <View style={styles.cardItemPanelSubItem} key={index}>
                                                    <Text style={styles.cardItemPanelSubItemNum}>10</Text>
                                                    <Text style={styles.cardItemPanelSubItemDesc}>已发布</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={styles.cardItem}>
                                        <TouchableOpacity activeOpacity={0.7} style={styles.cardItemHeader}>
                                            <Text style={styles.cardItemHeaderTitle}>数据明细</Text>
                                            <Icon color={Colors.descColor} name="angle-right" size={px(14)} />
                                        </TouchableOpacity>
                                        <View style={styles.cardItemPanel}>
                                            {[1, 2, 3].map((itm, index) => (
                                                <View style={styles.cardItemPanelSubItem} key={index}>
                                                    <Text style={styles.cardItemPanelSubItemNum}>8899</Text>
                                                    <Text style={styles.cardItemPanelSubItemDesc}>单日访问量uv</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollableTabView>
                </View>
            </ScrollView>
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
    },
    briefDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
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
