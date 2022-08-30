/*
 * @Date: 2021-05-18 11:10:23
 * @Description:视野
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, RefreshControl, ScrollView, Text, Platform} from 'react-native';

import http from '~/services';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {px, deviceWidth} from '~/utils/appUtil';
import RenderTitle from './components/RenderTitle.js';
import RenderCate from './components/RenderCate';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '~/redux/actions/visionData';
import {updateUserInfo} from '~/redux/actions/userInfo';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '~/components/hooks';
import BottomDesc from '~/components/BottomDesc';
import LoadingTips from '~/components/LoadingTips.js';
import LiveCard from '~/components/Article/LiveCard.js';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {BoxShadow} from 'react-native-shadow';
import _ from 'lodash';
const shadow = {
    color: '#E3E6EE',
    border: 8,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 2,
    width: deviceWidth - px(32),
};
let bannerList = [];
const Vision = ({navigation}) => {
    const isFocused = useIsFocused();

    const inset = useSafeAreaInsets();
    const scrollRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const userInfo = useSelector((store) => store.userInfo).toJS();
    const [data, setData] = useState();
    const [, setAll] = useState(0);
    const [banner, setBanner] = useState([]);
    const jump = useJump();
    const init = useCallback((type) => {
        type == 'refresh' && setRefreshing(true);
        http.get('/vision/index/20220215').then((res) => {
            jump(res?.result?.app_tag_url);
            if (bannerList.length == res.result?.part2?.banner_list.length) {
                setBanner(res?.result?.part2?.banner_list);
            } else {
                setBanner([]);
                setBanner(res?.result?.part2?.banner_list);
            }
            bannerList = res?.result?.part2?.banner_list;
            setData(res.result);
            setRefreshing(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const readInterface = useCallback(() => {
        http.get('/message/unread/20210101').then((res) => {
            setAll(res.result.all);
        });
    }, []);
    useEffect(() => {
        if (userInfo?.pushRoute) {
            http.get('/common/push/jump/redirect/20210810', {
                url: encodeURI(userInfo?.pushRoute),
            }).then((res) => {
                dispatch(updateUserInfo({pushRoute: ''}));
                if (res.code == '000000') {
                    jump(res.result?.url);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);
    useFocusEffect(
        useCallback(() => {
            init();
            userInfo?.is_login && readInterface();
            dispatch(updateVision({visionUpdate: ''}));
        }, [init, dispatch, readInterface, userInfo.is_login])
    );

    useEffect(() => {
        const listener = navigation.addListener('tabPress', () => {
            if (isFocused && userInfo.is_login) {
                scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                init('refresh');
                global.LogTool('tabDoubleClick', 'Vision');
            }
        });
        return () => listener();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, userInfo.is_login]);
    //上传滚动百分比
    const onScroll = (evt) => {
        const event = evt.nativeEvent;
        global.LogTool(
            'pageScroll',
            Math.round((event.contentOffset.y / (event.contentSize.height - event.layoutMeasurement.height)) * 100)
        );
    };

    const header = () => {
        return (
            <>
                <View style={{height: inset.top, backgroundColor: '#fff'}} />
                <View style={[styles.header, Style.flexBetween]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={Style.flexRow}
                        onPress={() => {
                            jump(data?.part1?.url);
                        }}>
                        <Image source={{uri: data?.part1?.user?.avatar}} style={styles.avatar} />
                        <Text style={styles.name}>{data?.part1?.user?.nickname || '昵称'}</Text>
                        {data?.part1?.url ? (
                            <FontAwesome name={'angle-right'} color={Colors.defaultColor} size={18} />
                        ) : null}
                    </TouchableOpacity>
                    <View style={Style.flexRow}>
                        {/* 收藏 */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                global.LogTool('visionMisc');
                                if (userInfo.is_login) {
                                    jump({path: 'VisionCollect'});
                                } else {
                                    jump({path: 'Login'});
                                }
                            }}
                            style={Style.flexRow}>
                            <Image
                                source={require('../../assets/img/vision/collect_icon.png')}
                                style={styles.header_icon}
                            />
                            <Text style={styles.headerIconDesc}>{'我的收藏'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    };
    const renderSecurity = (menu_list, bottom) => {
        return menu_list ? (
            <View style={[Style.flexBetween, {marginBottom: bottom || px(20)}]}>
                {menu_list.map((item, index) => (
                    <BoxShadow key={index} setting={{...shadow, width: px(167), height: px(61)}}>
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
    const renderContent = () => {
        return (
            <>
                {header()}
                <ScrollView
                    ref={scrollRef}
                    key={1}
                    scrollEventThrottle={200}
                    onMomentumScrollEnd={onScroll}
                    style={{backgroundColor: Colors.bgColor}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
                    {data ? (
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 0.05}}
                            colors={['#fff', '#F5F6F8']}
                            style={styles.con_bg}>
                            <View style={{paddingHorizontal: px(16)}}>
                                <View style={styles.swiper}>
                                    {banner?.length > 0 && (
                                        <Swiper
                                            height={px(190)}
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
                                            {banner?.map((_banner, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    activeOpacity={0.9}
                                                    onPress={() => {
                                                        global.LogTool('swiper', _banner.id);
                                                        jump(_banner.url);
                                                    }}>
                                                    <FastImage
                                                        style={styles.slide}
                                                        source={{
                                                            uri: _banner.cover,
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </Swiper>
                                    )}
                                </View>
                                {/* 其他模块 */}
                                {data?.part3?.map((item, index) => {
                                    return (
                                        <View key={index + 'i'}>
                                            {item?.items?.length > 0 ? (
                                                <RenderTitle
                                                    _key={index}
                                                    title={item.title}
                                                    sub_title={item?.sub_title}
                                                    more_text={item?.more ? item?.more?.text : ''}
                                                    onPress={() => {
                                                        global.LogTool('visionspecial', item.title);
                                                        jump(item?.more?.url);
                                                    }}
                                                />
                                            ) : null}
                                            {item?.scene == 'live' && item?.items?.length == 1 ? (
                                                // 单场直播
                                                <LiveCard
                                                    data={item?.items[0]}
                                                    style={{marginBottom: px(12), width: '100%'}}
                                                />
                                            ) : item?.direction == 'horizontal' ? (
                                                <ScrollView
                                                    horizontal
                                                    style={styles.horiView}
                                                    showsHorizontalScrollIndicator={false}>
                                                    <View style={[{marginLeft: px(16)}, Style.flexRow]}>
                                                        {item?.items?.map((_article) => {
                                                            return RenderCate(_article, {
                                                                marginBottom: px(12),
                                                                marginRight: px(12),
                                                            });
                                                        })}
                                                    </View>
                                                </ScrollView>
                                            ) : (
                                                item?.items?.map((_article) => {
                                                    return RenderCate(_article, {marginBottom: px(12)});
                                                })
                                            )}
                                        </View>
                                    );
                                })}
                                <>
                                    <RenderTitle title={'关于理财魔方'} />
                                    {/* 安全保障 */}
                                    {renderSecurity(data?.part4?.menu_list, px(12))}
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={styles.aboutCard}
                                        onPress={() => {
                                            global.LogTool('indexAboutMofang');
                                            jump(data?.part4?.about_info?.url);
                                        }}>
                                        <View
                                            style={[
                                                Style.flexRow,
                                                {height: px(89), paddingHorizontal: px(16), backgroundColor: '#1A61CD'},
                                            ]}>
                                            {data?.part4?.about_info?.header.map((text, index) => (
                                                <View key={index} style={{marginRight: index == 0 ? px(60) : 0}}>
                                                    <View style={[Style.flexRow, {marginBottom: px(2)}]}>
                                                        <Text style={styles.large_num}>{text?.value}</Text>
                                                        <Text style={styles.num_unit}>{text?.unit}</Text>
                                                    </View>
                                                    <Text style={{fontSize: px(12), color: '#fff', opacity: 0.5}}>
                                                        {text?.content}
                                                    </Text>
                                                </View>
                                            ))}
                                            <FastImage
                                                source={require('../../assets/img/index/aboutBg.png')}
                                                style={styles.aboutBg}
                                            />
                                        </View>
                                        <BoxShadow
                                            setting={{
                                                color: Colors.brandColor,
                                                width: px(28),
                                                height: px(28),
                                                radius: 6,
                                                border: 6,
                                                opacity: 0.08,
                                                x: 0,
                                                y: 2,
                                                style: {position: 'absolute', right: px(12), top: px(75), zIndex: 10},
                                            }}>
                                            <View style={styles.right}>
                                                <FontAwesome name={'angle-right'} color={Colors.btnColor} size={18} />
                                            </View>
                                        </BoxShadow>
                                        <View
                                            style={[
                                                Style.flexRow,
                                                {
                                                    flex: 1,
                                                    backgroundColor: '#fff',
                                                },
                                            ]}>
                                            {data?.part4?.about_info?.items?.map((item, index) => (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    key={index}
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        const url = _.cloneDeep(data?.part4?.about_info?.url);
                                                        url.params.link += `/${index}`;
                                                        jump(url);
                                                    }}
                                                    style={{
                                                        alignItems: 'flex-start',
                                                        flex: 1,
                                                        paddingLeft: Space.padding,
                                                    }}>
                                                    <FastImage source={{uri: item.icon}} style={styles.icon} />
                                                    <Text
                                                        style={{
                                                            color: Colors.defaultColor,
                                                            fontWeight: 'bold',
                                                            fontSize: px(14),
                                                            marginBottom: px(6),
                                                        }}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={{color: Colors.lightBlackColor, fontSize: px(11)}}>
                                                        {item.desc}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                            <View style={styles.leftLine} />
                                            <View style={styles.rightLine} />
                                        </View>
                                    </TouchableOpacity>
                                </>
                            </View>
                            <BottomDesc />
                        </LinearGradient>
                    ) : (
                        <LoadingTips loadingStyle={{marginTop: px(100)}} />
                    )}
                </ScrollView>
            </>
        );
    };

    return renderContent();
};

export default Vision;

const styles = StyleSheet.create({
    header: {
        height: px(42),
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
    },
    avatar: {width: px(32), height: px(32), borderRadius: px(16), marginRight: px(10)},
    name: {color: Colors.defaultColor, fontSize: px(14), fontWeight: '700', marginRight: px(4)},
    header_icon: {
        width: px(20),
        height: px(20),
    },
    headerIconDesc: {
        marginLeft: px(2),
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },

    horiView: {
        width: deviceWidth,
        position: 'relative',
        left: -px(16),
    },
    con_bg: {
        flex: 1,
        borderColor: '#fff',
        borderWidth: 0.5,
        paddingBottom: px(16),
        paddingTop: px(4),
    },
    rationalBox: {
        marginTop: px(4),
        marginBottom: px(16),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    beginRationalBg: {
        width: deviceWidth - Space.padding * 2,
        height: px(92),
        position: 'absolute',
        top: 0,
        right: 0,
    },
    rationalBg: {
        width: deviceWidth - Space.padding * 2,
        height: px(57),
        position: 'absolute',
        top: 0,
        right: 0,
    },
    levelIcon: {
        marginRight: px(5),
        width: px(16),
        height: px(16),
    },
    levelText: {
        fontSize: Font.textH1,
        lineHeight: Platform.select({android: px(19), ios: px(18)}),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    levelNum: {
        fontSize: px(24),
        lineHeight: px(24),
        color: '#EB7121',
        fontFamily: Font.numFontFamily,
    },
    levelTipsIcon: {
        width: px(17),
        height: px(16),
    },
    nowNum: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    nextNum: {
        fontSize: Font.textH3,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    taskBar: {
        marginTop: px(2),
        marginBottom: Space.marginVertical,
        borderRadius: px(3),
        width: px(190),
        height: px(3),
        backgroundColor: '#FBF3E4',
    },
    taskActiveBar: {
        borderRadius: px(3),
        height: px(3),
        backgroundColor: '#E8CF9D',
    },
    getRational: {
        marginRight: px(4),
        paddingVertical: px(5),
        paddingHorizontal: px(12),
        borderRadius: px(16),
        backgroundColor: '#E8CF9D',
    },
    getRationalText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    levelTips: {
        fontSize: px(13),
        lineHeight: px(17),
        color: Colors.descColor,
    },
    upgradeBtn: {
        marginVertical: px(20),
        marginHorizontal: px(46),
        borderRadius: px(20),
        backgroundColor: '#E9CE99',
        height: px(40),
    },
    upgradeBtnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    upgradeBox: {
        position: 'absolute',
        top: px(18),
        right: px(2),
    },
    upgradeImg: {
        width: px(100),
        height: px(57),
    },
    currentLevel: {
        fontSize: px(11.66),
        lineHeight: px(16),
        color: '#C5A25F',
        fontWeight: Platform.select({android: '700', ios: '500'}),
        position: 'absolute',
        bottom: px(15),
        left: px(12),
    },
    nextLevel: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#C5A25F',
        fontWeight: Platform.select({android: '700', ios: '500'}),
        position: 'absolute',
        top: px(13),
        right: px(8),
    },
    loadingChart: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: '#fff',
    },
    swiper: {
        marginBottom: px(12),
        marginTop: px(5),
        height: px(190),
    },
    common_card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginRight: px(12),
    },
    slide: {
        height: px(190),
        borderRadius: px(6),
    },
    dotStyle: {
        backgroundColor: '#fff',
        borderRadius: 0,
        height: px(3),
    },
    secure_card: {
        width: px(165),
        paddingVertical: px(12),
        paddingHorizontal: px(14),
        height: px(61),
    },
    large_num: {
        fontSize: px(28),
        fontFamily: Font.numMedium,
        color: '#fff',
        marginRight: px(4),
    },
    num_unit: {
        fontSize: px(14),
        color: '#fff',
        marginTop: px(10),
    },
    aboutCard: {
        borderRadius: px(6),
        overflow: 'hidden',
        height: px(191),
        flexDirection: 'column',
    },
    right: {
        backgroundColor: '#fff',
        width: px(28),
        height: px(28),
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    aboutBg: {
        width: px(121),
        height: px(83),
        position: 'absolute',
        top: px(8),
        right: 0,
    },
    leftLine: {
        position: 'absolute',
        left: px(114),
        bottom: px(21),
        width: Space.borderWidth,
        height: px(33),
        backgroundColor: Colors.borderColor,
    },
    rightLine: {
        position: 'absolute',
        right: px(113),
        bottom: px(21),
        width: Space.borderWidth,
        height: px(33),
        backgroundColor: Colors.borderColor,
    },
    icon: {
        width: px(24),
        height: px(24),
        marginBottom: px(4),
    },
});
