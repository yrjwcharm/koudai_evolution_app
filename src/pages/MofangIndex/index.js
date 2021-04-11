/*
 * @Date: 2021-02-04 14:17:26
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-11 18:21:18
 * @Description:首页
 */
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
} from 'react-native';
import {px, deviceWidth, formaNum} from '../../utils/appUtil';
import {Colors, Style, Space, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {QuestionCard, ArticleCard} from '../../components/Article';
import Swiper from 'react-native-swiper';
import Praise from '../../components/Praise.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BoxShadow} from 'react-native-shadow';
import http from '../../services/index.js';
import BottomDesc from '../../components/BottomDesc';
import {useLinkTo, useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useJump} from '../../components/hooks';
import JPush from 'jpush-react-native';
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
            {props.more_text ? <Text style={Style.more}>{props.more_text}</Text> : null}
        </View>
    );
};

const Index = (props) => {
    const inset = useSafeAreaInsets();
    const [data, setData] = useState(null);
    const isFocused = useIsFocused();
    const jump = useJump();
    const scrollView = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allMsg, setAll] = useState(0);
    let scrollingRight = '';
    let lastx = '';
    const snapScroll = useRef(null);
    const getData = useCallback(
        (params) => {
            params == 'refresh' && setRefreshing(true);
            http.get('/home/detail/20210101')
                .then((res) => {
                    setData(res.result);
                    setLoading(false);
                    setRefreshing(false);
                    if (res.result.login_status !== 0 && isFocused) {
                        readInterface();
                        // clearInterval(_timer);
                        // _timer = setInterval(() => {
                        //     readInterface();
                        // }, 60 * 1000 * 5);
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        },
        [isFocused, readInterface]
    );
    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    useEffect(() => {
        JPush.init();
        setTimeout(() => {
            //连接状态
            JPush.addConnectEventListener((result) => {
                console.log('connectListener:' + JSON.stringify(result));
            });
            JPush.setBadge({badge: 10, appbadge: '123'});

            JPush.getRegistrationID((result) => {
                console.log('registerID:' + JSON.stringify(result));
            });

            //通知回调
            JPush.addNotificationListener((result) => {
                console.log('notificationListener:' + JSON.stringify(result));
                if (JSON.stringify(result.extras.route)) {
                    props.navigation.navigate(result.extras.route);
                }
            });
            //本地通知回调
            JPush.addLocalNotificationListener((result) => {
                console.log('localNotificationListener:' + JSON.stringify(result));
            });
            //自定义消息回调
            JPush.addCustomMessagegListener((result) => {
                console.log('customMessageListener:' + JSON.stringify(result));
            });
        }, 100);
    }, [props.navigation]);
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            if (isFocused) {
                getData('refresh');
                scrollView?.current?.scrollTo({x: 0, y: 0, animated: true});
            }
        });
        return unsubscribe;
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
                                    style={[Style.more, {marginTop: px(-20)}]}>
                                    登录/注册
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    style={{marginTop: px(-20)}}
                                    onPress={() => {
                                        jump({path: 'RemindMessage'});
                                    }}>
                                    {allMsg ? <View style={styles.new_message} /> : null}
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
                            end={{x: 0, y: 0.3}}
                            colors={['#fff', Colors.bgColor]}
                            style={styles.container}>
                            <View style={styles.swiper}>
                                {data?.banner_list ? (
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
                                        {data?.banner_list?.map((banner, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                activeOpacity={0.9}
                                                onPress={() => {
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
                            {/* 运营位 */}
                            {data?.ad_info && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
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

                            {/* 推荐 */}
                            {data?.custom_info && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        data?.login_status == 0
                                            ? props.navigation.navigate('Register', {
                                                  redirect: data?.custom_info?.button?.url,
                                              })
                                            : jump(data?.custom_info?.button?.url);
                                    }}
                                    style={{marginBottom: px(20), marginTop: px(14)}}>
                                    <FastImage style={styles.robot} source={require('../../assets/img/robot1.png')} />
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
                                                        {data?.custom_info?.user_avatar_list.map((avar, index) => {
                                                            return (
                                                                <FastImage
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
                                                            style={{fontSize: px(13), fontFamily: Font.numFontFamily}}>
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
                            )}
                            {/* 马红漫 */}
                            {data?.polaris_info && (
                                <TouchableOpacity
                                    onPress={() => {
                                        jump(data?.polaris_info?.url);
                                    }}
                                    activeOpacity={0.8}
                                    style={{marginBottom: px(20)}}>
                                    <View style={[styles.V_card, Style.flexRow, styles.common_card]}>
                                        <FastImage
                                            style={{
                                                width: px(40),
                                                height: px(40),
                                                marginRight: px(8),
                                                borderRadius: px(6),
                                            }}
                                            source={{uri: data?.polaris_info?.avatar}}
                                        />
                                        <View style={{flex: 1}}>
                                            <View style={[Style.flexRow, {marginBottom: px(6)}]}>
                                                <Text style={[styles.secure_title, {marginRight: px(4)}]}>
                                                    {data?.polaris_info?.name}
                                                </Text>
                                                <FastImage
                                                    style={{width: px(17), height: px(17)}}
                                                    source={{uri: data?.polaris_info?.v_img}}
                                                />
                                            </View>
                                            <View style={Style.flexBetween}>
                                                <Text numberOfLines={1} style={styles.v_text}>
                                                    {data?.polaris_info?.detail}
                                                </Text>
                                                <View style={[Style.flexRow]}>
                                                    <Text style={[Style.more, {marginRight: px(2)}]}>详情</Text>
                                                    <FontAwesome
                                                        name={'angle-right'}
                                                        color={Colors.btnColor}
                                                        size={18}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {/* 推荐阅读 */}
                            {data?.article_info && (
                                <View style={{marginBottom: px(20)}}>
                                    <RenderTitle title={'推荐阅读'} />
                                    <ArticleCard data={data?.article_info} />
                                </View>
                            )}
                            {/* 魔方问答 */}
                            {data?.qa_list && (
                                <View style={{marginBottom: px(9)}}>
                                    <RenderTitle title={'魔方问答'} />
                                    <QuestionCard data={data?.qa_list} />
                                </View>
                            )}
                            {/* 听听魔方用户怎么说 */}
                            <View style={{width: deviceWidth}}>
                                <RenderTitle title={'听听魔方用户怎么说'} />
                                <ScrollView
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
                                        snapScroll?.current.scrollTo({x: scrollTo, y: 0, animated: true});
                                    }}
                                    scrollEventThrottle={100}
                                    onScroll={(event) => {
                                        var nextx = event.nativeEvent.contentOffset.x;
                                        scrollingRight = nextx > lastx;
                                        lastx = nextx;
                                    }}
                                    showsHorizontalScrollIndicator={false}>
                                    {data?.comment_list?.map((comment) => (
                                        <TouchableOpacity
                                            key={comment.id}
                                            style={[styles.about_our, styles.common_card]}
                                            activeOpacity={0.8}
                                            onPress={() => {
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
                                                        {comment.time + ' ' + comment.from}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.about_text} numberOfLines={4}>
                                                {comment.content}
                                            </Text>
                                            <Praise comment={comment} style={styles.zan} />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            <>
                                <RenderTitle title={'关于理财魔方'} />
                                {/* 安全保障 */}
                                {data?.buy_status == 1 && renderSecurity(data?.menu_list, px(12))}
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.aboutCard}
                                    onPress={() => {
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
                                            <View
                                                key={index}
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
                                                    {item.name}
                                                </Text>
                                            </View>
                                        ))}
                                        <View style={styles.leftLine} />
                                        <View style={styles.rightLine} />
                                    </View>
                                </TouchableOpacity>
                            </>

                            <BottomDesc />
                        </LinearGradient>
                    </ScrollView>
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
        width: px(158),
        height: px(63),
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
        height: px(81),
        top: px(-24),
        left: px(4),
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
        backgroundColor: '#FBEFDD',
        paddingHorizontal: px(16),
        marginTop: px(24),
    },
    recommend_btn: {
        height: px(38),
        justifyContent: 'center',
        paddingHorizontal: px(22),
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
    new_message: {
        width: px(6),
        height: px(6),
        borderRadius: px(4),
        backgroundColor: Colors.red,
        position: 'absolute',
        right: px(3),
        top: px(5),
        zIndex: 10,
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
});
