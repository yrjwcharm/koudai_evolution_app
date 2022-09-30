import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    RefreshControl,
    Platform,
    Image,
} from 'react-native';
import {px, deviceWidth, formaNum} from '../../utils/appUtil';
import {Colors, Style, Space, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import Swiper from 'react-native-swiper';
import Praise from '../../components/Praise.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BoxShadow} from 'react-native-shadow';
import http from '../../services/index.js';
import BottomDesc from '../../components/BottomDesc';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useJump} from '../../components/hooks';
import _ from 'lodash';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import {updateUserInfo} from '../../redux/actions/userInfo';
// import UpdateCom from '../../components/UpdateCom';
import {useDispatch, useSelector} from 'react-redux';
import GuideTips from '../../components/GuideTips';
// import CodePush from 'react-native-code-push';
import RenderCate from '../Vision/components/RenderCate';
import LiveCard from '../../components/Article/LiveCard';
// let codePushOptions = {
//     checkFrequency: CodePush.CheckFrequency.MANUAL,
// };
const shadow = {
    color: '#E3E6EE',
    border: 8,
    radius: 1,
    opacity: 0.2,
    x: 0,
    y: 2,
    width: deviceWidth - px(32),
};
const RenderTitle = (props) => {
    return (
        <View
            style={[
                Style.flexBetween,
                {
                    marginBottom: px(12),
                },
            ]}>
            <Text style={styles.large_title}>{props.title}</Text>
            {props.more_text ? (
                <Text onPress={props.onPress} style={Style.more}>
                    {props.more_text}
                </Text>
            ) : null}
        </View>
    );
};
let bannerList = [];
const Index = (props) => {
    const inset = useSafeAreaInsets();
    const [data, setData] = useState(null);
    const isFocused = useIsFocused();
    const jump = useJump();
    const scrollView = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allMsg, setAll] = useState(0);
    const [baner, setBaner] = useState([]);
    const userInfo = useSelector((store) => store.userInfo).toJS();
    const dispatch = useDispatch();
    let scrollingRight = '';
    let lastx = '';
    const snapScroll = useRef(null);
    const getData = useCallback(
        (params) => {
            params == 'refresh' && setRefreshing(true);
            http.get('/home/detail/20210101')
                .then((res) => {
                    jump(res?.result?.app_tag_url);
                    setLoading(false);
                    setRefreshing(false);
                    if (bannerList.length == res.result.banner_list.length) {
                        setBaner(res.result.banner_list);
                    } else {
                        setBaner([]);
                        setBaner(res.result.banner_list);
                    }
                    bannerList = res.result.banner_list;

                    setData(res.result);
                    if (res.result.login_status !== 0 && isFocused) {
                        readInterface();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isFocused, readInterface]
    );

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
    }, [userInfo, jump, dispatch]);

    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            if (isFocused) {
                getData('refresh');
                scrollView?.current?.scrollTo({x: 0, y: 0, animated: false});
                global.LogTool('tabDoubleClick', 'Index');
            }
        });
        return () => unsubscribe();
    }, [isFocused, props.navigation, getData]);

    const readInterface = useCallback(() => {
        http.get('/message/unread/20210101').then((res) => {
            setAll(res.result.all);
        });
    }, []);
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
    const renderLoading = () => {
        return (
            <View
                style={{
                    paddingTop: inset.top + px(8),
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <FastImage
                    style={{
                        flex: 1,
                    }}
                    source={require('../../assets/img/loading/indexLoading.png')}
                    resizeMode="contain"
                />
            </View>
        );
    };
    return (
        <>
            {loading ? (
                renderLoading()
            ) : (
                <>
                    <View style={[styles.header, {paddingTop: inset.top}]}>
                        <View style={[Style.flexBetween, {alignItems: 'center'}]}>
                            <FastImage
                                style={styles.logo}
                                resizeMode={FastImage.resizeMode.contain}
                                source={require('../../assets/img/indexLogo.png')}
                            />
                            {data?.login_status == 0 ? (
                                <Text
                                    onPress={() => {
                                        jump({path: 'Register'});
                                        global.LogTool();
                                    }}
                                    style={[Style.more]}>
                                    登录/注册
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{position: 'relative'}}
                                    onPress={() => {
                                        global.LogTool('indexNotificationCenter');
                                        jump({path: 'RemindMessage'});
                                    }}>
                                    {allMsg ? (
                                        <View style={[styles.point_sty, Style.flexCenter]}>
                                            <Text style={styles.point_text}>{allMsg > 99 ? '99+' : allMsg}</Text>
                                        </View>
                                    ) : null}
                                    <FastImage
                                        style={{width: px(32), height: px(32)}}
                                        source={require('../../assets/img/index/message.png')}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <ScrollView
                        style={{backgroundColor: Colors.bgColor}}
                        scrollEventThrottle={16}
                        ref={scrollView}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => getData('refresh')} />
                        }>
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: data?.show_recommend ? 0.1 : 0.3}}
                            colors={['#fff', Colors.bgColor]}
                            style={styles.container}>
                            <View style={styles.swiper}>
                                {baner.length > 0 && (
                                    <Swiper
                                        height={px(120)}
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
                                )}
                            </View>
                            {/* 运营位 */}
                            {data?.ad_info && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        global.LogTool('capsuleStart', data?.ad_info?.id);
                                        jump(data?.ad_info?.url);
                                    }}>
                                    <FastImage
                                        source={{
                                            uri: data?.ad_info?.cover,
                                        }}
                                        style={{
                                            height: px(60),
                                            borderRadius: 8,
                                            marginBottom: px(12),
                                        }}
                                    />
                                </TouchableOpacity>
                            )}
                            {/* 安全保障 */}
                            {data?.buy_status == 0 && renderSecurity(data?.menu_list)}
                            {/* 直播 */}
                            {data?.live_card?.options ? (
                                <>
                                    {data?.live_card?.title ? (
                                        <RenderTitle
                                            title={data?.live_card?.title}
                                            sub_title={data?.live_card?.sub_title}
                                            more_text={data?.live_card?.more ? data?.live_card?.more?.text : ''}
                                            onPress={() => {
                                                jump(data?.live_card?.more?.url);
                                            }}
                                        />
                                    ) : null}
                                    <LiveCard
                                        data={data?.live_card?.options}
                                        style={{marginBottom: px(16), width: '100%'}}
                                        scene="largeLive"
                                    />
                                </>
                            ) : null}
                            {/* 推荐 */}
                            {data?.custom_info ? (
                                !data.show_recommend ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            global.LogTool('IndexCustomCardStart');
                                            data?.login_status == 0
                                                ? props.navigation.navigate('Register', {
                                                      redirect: data?.custom_info?.button?.url,
                                                  })
                                                : jump(data?.custom_info?.button?.url);
                                        }}
                                        style={{marginBottom: px(20), marginTop: px(14)}}>
                                        <ImageBackground
                                            source={require('../../assets/img/robotShadow.png')}
                                            style={styles.robot}>
                                            <FastImage
                                                style={{width: px(80), height: px(80)}}
                                                source={require('../../assets/img/robot.gif')}
                                            />
                                        </ImageBackground>
                                        <View style={styles.recommen_card}>
                                            <ImageBackground
                                                source={require('../../assets/img/index/recommendBg.png')}
                                                style={{height: px(196)}}>
                                                {/* 218 */}
                                                <Text style={[styles.secure_title, styles.recommen_title]}>
                                                    {data?.custom_info?.title}
                                                </Text>
                                                <View style={[Style.flexRow, styles.recommen_con]}>
                                                    <FastImage
                                                        style={{width: px(20), height: px(20)}}
                                                        source={require('../../assets/img/index/categoryLeft.png')}
                                                    />
                                                    <Text style={styles.recommen_text}>{data?.custom_info?.desc}</Text>
                                                    <FastImage
                                                        style={styles.cateRight}
                                                        source={require('../../assets/img/index/categoryRight.png')}
                                                    />
                                                </View>
                                                <View style={[styles.recommen_bottom, Style.flexBetween]}>
                                                    <View style={Style.flexRow}>
                                                        <View style={Style.flexRow}>
                                                            {data?.custom_info?.user_avatar_list
                                                                ?.slice(0, 2)
                                                                .map((avar, index) => {
                                                                    return (
                                                                        <Image
                                                                            key={index}
                                                                            source={{uri: avar}}
                                                                            style={[
                                                                                styles.user_avatar,
                                                                                {marginLeft: index != 0 ? px(-6) : 0},
                                                                            ]}
                                                                        />
                                                                    );
                                                                })}
                                                        </View>
                                                        <Text style={{fontSize: px(12), marginLeft: px(8)}}>
                                                            已有
                                                            <Text
                                                                style={{
                                                                    fontSize: px(13),
                                                                    fontFamily: Font.numFontFamily,
                                                                }}>
                                                                {formaNum(data?.custom_info?.num, 'nozero')}
                                                            </Text>
                                                            人开启
                                                        </Text>
                                                    </View>

                                                    <LinearGradient
                                                        start={{x: 0, y: 0.25}}
                                                        end={{x: 0, y: 0.8}}
                                                        colors={['#FF9463', '#FF7D41']}
                                                        style={[styles.recommend_btn, Style.flexRow]}>
                                                        <Text style={styles.btn_text}>
                                                            {data?.custom_info?.button.text}
                                                        </Text>
                                                        <FontAwesome name={'angle-right'} size={18} color="#fff" />
                                                    </LinearGradient>
                                                </View>
                                            </ImageBackground>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            global.LogTool('IndexProductCardStart');
                                            data?.login_status == 0
                                                ? props.navigation.navigate('Register', {
                                                      redirect: data?.custom_info?.button?.url,
                                                  })
                                                : jump(data?.custom_info?.button?.url);
                                        }}
                                        style={{marginBottom: px(20)}}>
                                        <View style={[styles.recommendBox, {alignItems: 'center'}]}>
                                            <FastImage
                                                source={require('../../assets/img/index/recommendShadow.png')}
                                                style={styles.recommendShadow}
                                            />
                                            <View style={[Style.flexRowCenter, {width: '100%'}]}>
                                                <FastImage
                                                    source={{uri: data?.custom_info?.icon}}
                                                    style={styles.recommendIcon}
                                                />
                                                <Text style={[styles.poName, {marginRight: px(8)}]}>
                                                    {data?.custom_info?.name}
                                                </Text>
                                                <Text style={styles.poDesc}>{data?.custom_info?.desc}</Text>
                                            </View>
                                            <Text style={[styles.yieldRatio, {marginTop: Space.marginVertical}]}>
                                                {data?.custom_info?.yield.ratio}
                                            </Text>
                                            <Text style={[styles.yieldTitle, {marginTop: px(2), textAlign: 'center'}]}>
                                                {data?.custom_info?.yield.title}
                                            </Text>
                                            {data?.custom_info?.labels ? (
                                                <View style={[Style.flexRowCenter, {marginTop: Space.marginVertical}]}>
                                                    {data?.custom_info?.labels?.map?.((item, index) => {
                                                        return (
                                                            <View
                                                                style={[
                                                                    Style.flexRow,
                                                                    index === 0 ? {} : {marginLeft: px(12)},
                                                                ]}
                                                                key={item + index}>
                                                                <FastImage
                                                                    source={require('../../assets/img/index/selling_point.png')}
                                                                    style={styles.sellingPoint}
                                                                />
                                                                <Text style={styles.pointText}>{item}</Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            ) : null}
                                            <LinearGradient
                                                colors={['#FF9463', '#FF7D41']}
                                                start={{x: 0, y: 0}}
                                                end={{x: 0, y: 1}}
                                                style={[Style.flexCenter, styles.recommendBtn]}>
                                                <Text
                                                    style={{
                                                        fontSize: px(15),
                                                        lineHeight: px(21),
                                                        color: '#fff',
                                                        fontWeight: '500',
                                                    }}>
                                                    {data?.custom_info?.button?.text}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                    </TouchableOpacity>
                                )
                            ) : null}
                            {data?.custom_info_tool ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        global.LogTool('IndexProductCardStart');
                                        data?.login_status == 0
                                            ? props.navigation.navigate('Register', {
                                                  redirect: data?.custom_info_tool?.button?.url,
                                              })
                                            : jump(data?.custom_info_tool?.button?.url);
                                    }}
                                    style={{marginBottom: px(20), marginTop: px(14)}}>
                                    <ImageBackground
                                        source={require('../../assets/img/robotShadow.png')}
                                        style={styles.tool_robot}>
                                        <FastImage
                                            style={{width: px(70), height: px(70)}}
                                            source={require('../../assets/img/robot.gif')}
                                        />
                                    </ImageBackground>
                                    <View style={[styles.toolBox, {alignItems: 'center'}]}>
                                        <FastImage
                                            source={require('../../assets/img/index/recommendShadow.png')}
                                            style={styles.recommendShadow}
                                        />
                                        <View style={{paddingLeft: px(70), width: '100%'}}>
                                            <Text style={styles.tool_title}>{data?.custom_info_tool?.title}</Text>
                                        </View>
                                        <View style={[Style.flexRow, styles.tool_content_box]}>
                                            <FastImage
                                                style={styles.quoteLeft}
                                                source={require('../../assets/img/index/categoryLeft.png')}
                                            />
                                            <Text style={styles.tool_content}>{data?.custom_info_tool?.content}</Text>
                                            <FastImage
                                                style={styles.quoteRight}
                                                source={require('../../assets/img/index/categoryRight.png')}
                                            />
                                        </View>
                                        {data?.custom_info_tool?.labels ? (
                                            <View style={[Style.flexRow, {marginTop: px(14)}]}>
                                                {data?.custom_info_tool?.labels?.map?.((item, index) => {
                                                    return (
                                                        <View
                                                            style={[
                                                                Style.flexRow,
                                                                index === 0 ? {} : {marginLeft: px(12)},
                                                            ]}
                                                            key={item + index}>
                                                            <FastImage
                                                                source={require('../../assets/img/index/selling_point.png')}
                                                                style={styles.sellingPoint}
                                                            />
                                                            <Text
                                                                style={[
                                                                    styles.pointText,
                                                                    {
                                                                        color: Colors.defaultColor,
                                                                        fontWeight: Platform.select({
                                                                            android: '700',
                                                                            ios: '500',
                                                                        }),
                                                                    },
                                                                ]}>
                                                                {item}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        ) : null}
                                        <LinearGradient
                                            colors={['#FF9463', '#FF7D41']}
                                            start={{x: 0, y: 0}}
                                            end={{x: 0, y: 1}}
                                            style={[Style.flexCenter, styles.toolBtn]}>
                                            <Text
                                                style={{
                                                    fontSize: px(15),
                                                    lineHeight: px(21),
                                                    color: '#fff',
                                                    fontWeight: '500',
                                                }}>
                                                {data?.custom_info_tool?.button?.text}
                                            </Text>
                                        </LinearGradient>
                                    </View>
                                </TouchableOpacity>
                            ) : null}

                            {/* 推荐阅读 */}
                            {data?.article_list && (
                                <View style={{marginBottom: px(12)}}>
                                    <RenderTitle
                                        title={'推荐阅读'}
                                        more_text={'更多'}
                                        onPress={() => {
                                            global.LogTool('indexRecArticleMore');
                                            jump({path: 'Vision'});
                                        }}
                                    />
                                    {data?.article_list?.map((item, index) => {
                                        return RenderCate(item, {marginBottom: px(12)}, 'index');
                                    })}
                                </View>
                            )}
                            {/* 听听魔方用户怎么说 */}
                            {data?.comment_list ? (
                                <>
                                    <RenderTitle
                                        // more_text={'更多'}
                                        onPress={() => {
                                            jump({
                                                path: 'CommentList',
                                                params: {scene: 'user_say', title: '用户留言详情'},
                                                type: 1,
                                            });
                                        }}
                                        title={'听听魔方用户怎么说'}
                                    />
                                    <ScrollView
                                        style={{paddingLeft: px(16), width: deviceWidth, marginLeft: px(-16)}}
                                        showsPagination={false}
                                        horizontal={true}
                                        height={px(188)}
                                        ref={snapScroll}
                                        onScrollEndDrag={() => {
                                            var interval = Platform.OS == 'android' ? px(295) : px(293.5); // WIDTH OF 1 CHILD COMPONENT
                                            var snapTo = scrollingRight
                                                ? Math.ceil(lastx / interval)
                                                : Math.floor(lastx / interval);
                                            var scrollTo = snapTo * interval;
                                            data?.comment_list[snapTo]?.id &&
                                                global.LogTool('indexUserReviewSlide', data.comment_list[snapTo].id);
                                            snapScroll?.current.scrollTo({x: scrollTo, y: 0, animated: true});
                                        }}
                                        scrollEventThrottle={100}
                                        onScroll={(event) => {
                                            var nextx = event.nativeEvent.contentOffset.x;
                                            scrollingRight = nextx > lastx;
                                            lastx = nextx;
                                        }}
                                        showsHorizontalScrollIndicator={false}>
                                        {data?.comment_list?.map((comment, index) => (
                                            <TouchableOpacity
                                                key={comment.id}
                                                style={[
                                                    styles.about_our,
                                                    styles.common_card,
                                                    {
                                                        marginRight:
                                                            index == data?.comment_list?.length - 1 ? px(28) : px(12),
                                                    },
                                                ]}
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    global.LogTool('indexUserReviewDetail', comment.id);
                                                    jump({path: 'MessageBoard', params: {id: comment.id}});
                                                }}>
                                                <View style={Style.flexRow}>
                                                    <FastImage source={{uri: comment.avatar}} style={styles.avatar} />
                                                    <View style={{flex: 1}}>
                                                        <Text numberOfLines={1} style={styles.avatar_name}>
                                                            {comment.name}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: px(12),
                                                                color: Colors.darkGrayColor,
                                                            }}>
                                                            {comment.time + comment.from}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.about_text} numberOfLines={3}>
                                                    {comment.content}
                                                </Text>
                                                <Praise
                                                    comment={comment}
                                                    style={styles.zan}
                                                    log={'indexUserReviewLike'}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </>
                            ) : null}
                            <>
                                <RenderTitle title={'关于理财魔方'} />
                                {/* 安全保障 */}
                                {data?.buy_status == 1 && renderSecurity(data?.menu_list, px(12))}
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.aboutCard}
                                    onPress={() => {
                                        global.LogTool('indexAboutMofang');
                                        jump(data?.about_info?.url);
                                    }}>
                                    <View
                                        style={[
                                            Style.flexRow,
                                            {height: px(89), paddingHorizontal: px(16), backgroundColor: '#1A61CD'},
                                        ]}>
                                        {data?.about_info?.header.map((text, index) => (
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
                                        {data?.about_info?.items?.map((item, index) => (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                key={index}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    const url = _.cloneDeep(data?.about_info?.url);
                                                    url.params.link += `/${index}`;
                                                    jump(url);
                                                }}
                                                style={{alignItems: 'flex-start', flex: 1, paddingLeft: Space.padding}}>
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
                        </LinearGradient>
                        <BottomDesc />
                        {/* <UpdateCom /> */}
                    </ScrollView>
                    {data?.guide_tip ? (
                        <GuideTips data={data?.guide_tip} style={{position: 'absolute', bottom: px(17)}} />
                    ) : null}
                </>
            )}
        </>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: px(16),
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        paddingLeft: px(7),
    },
    header_title: {
        fontSize: px(20),
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    swiper: {
        marginBottom: px(12),
        marginTop: px(5),
        height: px(120),
    },
    common_card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        marginRight: px(12),
    },
    slide: {
        height: px(120),
        borderRadius: px(6),
    },
    dotStyle: {
        backgroundColor: '#fff',
        borderRadius: 0,
        height: px(3),
    },
    logo: {
        width: px(140),
        height: px(49),
        // marginRight: px(9),
    },
    secure_card: {
        width: px(165),
        paddingVertical: px(12),
        paddingHorizontal: px(14),
        height: px(61),
    },
    cateRight: {
        width: px(20),
        height: px(20),
        position: 'absolute',
        bottom: 0,
        right: px(16),
    },
    V_card: {
        paddingHorizontal: px(16),
        height: px(75),
        backgroundColor: '#fff',
        borderRadius: px(6),
    },
    v_text: {
        color: Colors.lightBlackColor,
        fontSize: px(12),
        flex: 1,
    },
    recommen_card: {
        borderRadius: px(6),
        overflow: 'hidden',
    },
    recommen_con: {
        marginTop: px(20),
        paddingHorizontal: px(16),
        alignItems: 'flex-start',
    },
    robot: {
        width: px(80),
        height: px(80),
        top: px(-24),
        left: px(4),
        position: 'absolute',
        zIndex: 10,
    },
    tool_robot: {
        width: px(70),
        height: px(70),
        top: px(-21),
        left: 0,
        position: 'absolute',
        zIndex: 10,
    },
    recommen_title: {
        fontSize: px(16),
        marginTop: px(25),
        marginLeft: px(80),
        fontWeight: 'bold',
    },
    recommen_text: {
        fontSize: px(14),
        color: Colors.defaultColor,
        lineHeight: px(23),
        flex: 1,
        marginLeft: px(6),
    },
    recommen_bottom: {
        height: px(62),
        backgroundColor: '#FFE9C9',
        paddingHorizontal: px(16),
        marginTop: px(24),
    },
    recommend_btn: {
        height: px(38),
        justifyContent: 'center',
        paddingHorizontal: px(32),
        borderRadius: 20,
    },
    btn_text: {
        fontSize: px(13),
        color: '#fff',
        fontWeight: '700',
        marginRight: px(4),
    },
    light_text: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
    },
    secure_title: {
        fontSize: px(14),
        lineHeight: px(20),
        fontWeight: 'bold',
        color: Colors.defaultColor,
    },
    title_desc: {
        marginTop: px(4),
        fontSize: px(12),
        color: Colors.lightBlackColor,
        lineHeight: px(17),
    },
    large_title: {
        fontWeight: '700',
        fontSize: px(17),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    icon: {
        width: px(24),
        height: px(24),
        marginBottom: px(4),
    },
    about_num: {
        fontFamily: Font.numFontFamily,
        fontSize: px(18),
        color: '#fff',
        marginHorizontal: px(2),
    },
    avatar: {
        width: px(32),
        height: px(32),
        marginRight: px(13),
        borderRadius: px(16),
    },
    user_avatar: {
        width: px(28),
        height: px(28),
        borderRadius: px(14),
        borderWidth: px(2),
        borderColor: '#fff',
    },
    about_our: {
        width: px(282),
        height: px(168),
        padding: px(16),
        paddingBottom: px(12),
    },
    about_text: {
        fontSize: px(13),
        lineHeight: px(20),
        marginTop: px(16),
    },
    zan: {
        position: 'absolute',
        bottom: px(12),
        right: px(16),
    },

    avatar_name: {
        fontSize: px(13),
        color: Colors.lightBlackColor,
        marginBottom: px(6),
    },
    point_sty: {
        position: 'absolute',
        left: px(15),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(50),
        zIndex: 10,
        minWidth: px(20),
        height: px(20),
        borderWidth: 2,
        borderColor: '#fff',
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
    recommendBox: {
        paddingTop: px(24),
        paddingBottom: px(24),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        position: 'relative',
    },
    toolBox: {
        paddingTop: px(20),
        paddingBottom: px(20),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    tool_title: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    tool_content_box: {
        marginTop: Space.marginVertical,
        paddingLeft: px(43),
        paddingRight: Space.padding,
    },
    tool_content: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.descColor,
    },
    quoteLeft: {
        width: px(20),
        height: px(20),
        position: 'absolute',
        top: px(-3),
        left: px(16),
    },
    quoteRight: {
        width: px(20),
        height: px(20),
        position: 'absolute',
        right: px(16),
        bottom: px(-6),
    },
    recommendShadow: {
        // width: deviceWidth - px(32),
        height: px(60),
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    recommendIcon: {
        width: px(24),
        height: px(24),
        marginRight: px(4),
    },
    poName: {
        fontSize: px(17),
        lineHeight: px(24),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    poDesc: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    yieldRatio: {
        fontSize: px(36),
        lineHeight: px(42),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    yieldTitle: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
        fontWeight: '300',
    },
    sellingPoint: {
        width: px(16),
        height: px(16),
        marginRight: px(4),
    },
    pointText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
    },
    recommendBtn: {
        marginTop: px(20),
        borderRadius: px(22),
        width: px(240),
        height: px(44),
    },
    toolBtn: {
        marginTop: Space.marginVertical,
        borderRadius: px(22),
        width: px(263),
        height: px(40),
    },
    point_text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: Font.textSm,
        lineHeight: Platform.select({ios: px(12), android: Font.textSm}),
        fontFamily: Font.numFontFamily,
    },
});
