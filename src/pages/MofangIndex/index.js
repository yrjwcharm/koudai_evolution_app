/*
 * @Date: 2021-02-04 14:17:26
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-02 16:21:28
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
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
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
import {NavigationContainer, LinkingOptions, useLinkTo, useFocusEffect, useIsFocused} from '@react-navigation/native';
const shadow = {
    color: '#E3E6EE',
    border: 10,
    radius: 1,
    opacity: 0.3,
    x: 0,
    y: 4,
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
    const inset = useRef(useSafeAreaInsets()).current;
    const linkTo = useLinkTo();
    const [data, setData] = useState(null);
    const isFocused = useIsFocused();

    const [refreshing, setRefreshing] = useState(false);
    const getData = useCallback((params) => {
        params == 'refresh' && setRefreshing(true);
        http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/home/detail/20210101').then((res) => {
            setData(res.result);
            setRefreshing(false);
        });
    }, []);
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            isFocused && getData('refresh');
        });
        return unsubscribe;
    }, [getData, props.navigation, isFocused]);
    const jumpPage = (url, params) => {
        // linkTo('/login');
        props.navigation.navigate(url, params);
    };

    useFocusEffect(
        useCallback(() => {
            getData();
        }, [getData])
    );
    return (
        <>
            {/* header */}
            <View style={[styles.header, {paddingTop: inset.top + px(8)}]}>
                <View style={Style.flexBetween}>
                    <View style={Style.flexRow}>
                        <FastImage style={styles.logo} source={require('../../assets/img/index/logo.png')} />
                        <Text style={styles.header_title}>理财魔方</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            jumpPage('Register');
                            global.LogTool();
                        }}>
                        <Text style={Style.more}>登录/注册</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            jumpPage('TradeBuy');
                        }}>
                        <View style={styles.new_message} />
                        <FastImage
                            style={{width: px(24), height: px(24)}}
                            source={require('../../assets/img/index/message.png')}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title_desc}>您的智能基金组合专家</Text>
            </View>
            <ScrollView
                style={{backgroundColor: Colors.bgColor}}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getData('refresh')} />}>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
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
                                    <TouchableOpacity key={index} activeOpacity={0.8}>
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

                    {/* 安全保障 */}
                    <View style={[Style.flexBetween, {marginBottom: px(20)}]}>
                        <BoxShadow setting={{...shadow, width: px(165), height: px(61)}}>
                            <View style={[Style.flexBetween, styles.secure_card, styles.common_card]}>
                                <View>
                                    <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                                        <FastImage
                                            resizeMode={FastImage.resizeMode.contain}
                                            style={{width: px(24), height: px(24)}}
                                            source={require('../../assets/img/index/anquan.png')}
                                        />
                                        <Text style={[styles.secure_title, {marginLeft: px(4)}]}>安全保障</Text>
                                    </View>
                                    <Text style={styles.light_text}>证监会批准持牌机构</Text>
                                </View>
                                <FontAwesome name={'angle-right'} size={18} color={'#9397A3'} />
                            </View>
                        </BoxShadow>
                        <BoxShadow setting={{...shadow, width: px(165), height: px(61)}}>
                            <View style={[Style.flexBetween, styles.secure_card, styles.common_card]}>
                                <View>
                                    <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                                        <FastImage
                                            resizeMode={FastImage.resizeMode.contain}
                                            style={{width: px(24), height: px(24)}}
                                            source={require('../../assets/img/index/anquan.png')}
                                        />
                                        <Text style={[styles.secure_title, {marginLeft: px(4)}]}>安全保障</Text>
                                    </View>
                                    <Text style={styles.light_text}>证监会批准持牌机构</Text>
                                </View>
                                <FontAwesome name={'angle-right'} size={18} color={'#9397A3'} />
                            </View>
                        </BoxShadow>
                    </View>
                    {/* 推荐 */}
                    {data?.custom_info && (
                        <View style={{marginBottom: px(20), marginTop: px(14)}}>
                            <FastImage style={styles.robot} source={require('../../assets/img/robot.png')} />
                            <View style={styles.recommen_card}>
                                <ImageBackground
                                    source={require('../../assets/img/index/recommendBg.png')}
                                    style={{height: px(134)}}>
                                    <Text style={[styles.secure_title, styles.recommen_title]}>
                                        {data?.custom_info?.title}
                                    </Text>
                                    <View style={[Style.flexRow, styles.recommen_con]}>
                                        <FastImage
                                            style={{width: px(20), height: px(20)}}
                                            source={require('../../assets/img/index/douhao.png')}
                                        />
                                        <Text style={styles.recommen_text}>{data?.custom_info?.desc}</Text>
                                    </View>
                                </ImageBackground>
                                <View style={[styles.recommen_bottom, Style.flexBetween]}>
                                    <View style={Style.flexRow}>
                                        {data?.custom_info?.user_avatar_list.map((avar, index) => {
                                            return (
                                                <FastImage
                                                    key={index}
                                                    source={{uri: avar}}
                                                    style={[styles.user_avatar, {marginLeft: index != 0 ? px(-6) : 0}]}
                                                />
                                            );
                                        })}
                                    </View>
                                    <Text style={{fontSize: px(12)}}>
                                        已有<Text style={{fontSize: px(13), fontFamily: Font.numFontFamily}}>1234</Text>
                                        人开启
                                    </Text>
                                    <TouchableOpacity activeOpacity={0.8}>
                                        <LinearGradient
                                            start={{x: 0, y: 0.25}}
                                            end={{x: 0, y: 0.8}}
                                            colors={['#FF9463', '#FF7D41']}
                                            style={[styles.recommend_btn, Style.flexRow]}>
                                            <Text style={styles.btn_text}>{data?.custom_info?.button.text}</Text>
                                            <FontAwesome name={'angle-right'} size={18} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    {/* 马红漫 */}
                    {data?.polaris_info && (
                        <View style={{marginBottom: px(20)}}>
                            <BoxShadow setting={{...shadow, height: px(75), width: deviceWidth - px(32)}}>
                                <View style={[styles.V_card, Style.flexRow, styles.common_card]}>
                                    <FastImage
                                        style={{width: px(40), height: px(40), marginRight: px(8)}}
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
                                                <FontAwesome name={'angle-right'} color={Colors.btnColor} size={18} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </BoxShadow>
                        </View>
                    )}
                    {/* 推荐阅读 */}
                    {data?.article_info && (
                        <View style={{marginBottom: px(20)}}>
                            <RenderTitle title={'推荐阅读'} />
                            <ArticleCard data={data?.article_info} />
                        </View>
                    )}
                    {/* 用户问答 */}
                    {data?.qa_list && (
                        <View style={{marginBottom: px(9)}}>
                            <RenderTitle title={'用户问答'} />
                            <QuestionCard data={data?.qa_list} />
                        </View>
                    )}
                    {/* 听听魔方用户怎么说 */}
                    <View>
                        <RenderTitle title={'听听魔方用户怎么说'} />
                        <ScrollView
                            loop={true}
                            showsPagination={false}
                            horizontal={true}
                            height={px(188)}
                            snapToInterval={px(298)}
                            decelerationRate={0.99}
                            showsHorizontalScrollIndicator={false}>
                            {data?.comment_list?.map((comment) => (
                                <BoxShadow
                                    key={comment.id}
                                    setting={{
                                        ...shadow,
                                        width: px(282),
                                        height: px(168),
                                        style: {marginRight: px(16)},
                                    }}>
                                    <TouchableOpacity
                                        style={[styles.about_our, styles.common_card]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            jumpPage('MessageBoard', {id: comment.id});
                                        }}>
                                        <View style={Style.flexRow}>
                                            <FastImage source={{uri: comment.avatar}} style={styles.avatar} />
                                            <View style={{flex: 1}}>
                                                <Text style={styles.avatar_name}>{comment.name}</Text>
                                                <Text
                                                    style={{
                                                        fontSize: px(12),
                                                        color: Colors.darkGrayColor,
                                                    }}>
                                                    {comment.from}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.about_text} numberOfLines={4}>
                                            {comment.content}
                                        </Text>
                                        <Praise comment={comment} id={comment.id} style={styles.zan} />
                                    </TouchableOpacity>
                                </BoxShadow>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={{marginBottom: px(20)}}>
                        <RenderTitle title={'关于理财魔方'} />
                        {/* 安全保障 */}

                        <View style={[Style.flexBetween, {marginBottom: px(12)}]}>
                            <BoxShadow setting={{...shadow, width: px(165), height: px(61)}}>
                                <View style={[Style.flexBetween, styles.secure_card, styles.common_card]}>
                                    <View>
                                        <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                                            <FastImage
                                                resizeMode={FastImage.resizeMode.contain}
                                                style={{width: px(24), height: px(24)}}
                                                source={require('../../assets/img/index/anquan.png')}
                                            />
                                            <Text style={[styles.secure_title, {marginLeft: px(4)}]}>安全保障</Text>
                                        </View>
                                        <Text style={styles.light_text}>证监会批准持牌机构</Text>
                                    </View>
                                    <FontAwesome name={'angle-right'} size={18} color={'#9397A3'} />
                                </View>
                            </BoxShadow>
                            <BoxShadow setting={{...shadow, width: px(165), height: px(61)}}>
                                <View style={[Style.flexBetween, styles.secure_card, styles.common_card]}>
                                    <View>
                                        <View style={[Style.flexRow, {marginBottom: px(4)}]}>
                                            <FastImage
                                                resizeMode={FastImage.resizeMode.contain}
                                                style={{width: px(24), height: px(24)}}
                                                source={require('../../assets/img/index/anquan.png')}
                                            />
                                            <Text style={[styles.secure_title, {marginLeft: px(4)}]}>安全保障</Text>
                                        </View>
                                        <Text style={styles.light_text}>证监会批准持牌机构</Text>
                                    </View>
                                    <FontAwesome name={'angle-right'} size={18} color={'#9397A3'} />
                                </View>
                            </BoxShadow>
                        </View>
                        <BoxShadow setting={{...shadow, height: px(191)}}>
                            <View style={{borderRadius: px(6), overflow: 'hidden'}}>
                                <ImageBackground
                                    style={[Style.flexBetween, {height: px(89), paddingHorizontal: px(16)}]}
                                    source={require('../../assets/img/index/aboutOur.png')}>
                                    <View>
                                        <View style={[Style.flexRow, {marginBottom: px(2)}]}>
                                            <Text style={styles.large_num}>200</Text>
                                            <Text style={styles.num_unit}>亿元</Text>
                                        </View>
                                        <Text style={{fontSize: px(12), color: '#fff', opacity: 0.5}}>
                                            累计基金交易额超过
                                        </Text>
                                    </View>
                                    <View>
                                        <View style={[Style.flexRow, {marginBottom: px(2)}]}>
                                            <Text style={styles.large_num}>200</Text>
                                            <Text style={styles.num_unit}>%</Text>
                                        </View>
                                        <Text style={{fontSize: px(12), color: '#fff', opacity: 0.5}}>
                                            累计基金交易额超过
                                        </Text>
                                    </View>
                                    <FontAwesome name={'angle-right'} color={'#fff'} size={18} />
                                    {/* <Text style={{fontSize: px(11), color: '#fff'}}>
                                        {data?.about_info?.header.map((text, index) => (
                                            <Text key={index} style={text.type == 'number' ? styles.about_num : null}>
                                                {text.content}
                                            </Text>
                                        ))}
                                    </Text> */}
                                </ImageBackground>
                                <View
                                    style={[
                                        Style.flexRow,
                                        {backgroundColor: '#fff', justifyContent: 'space-evenly', height: px(83)},
                                    ]}>
                                    {data?.about_info?.items?.map((item, index) => (
                                        <View key={index} style={{alignItems: 'flex-start'}}>
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
                                </View>
                            </View>
                        </BoxShadow>
                    </View>

                    <BottomDesc />
                </LinearGradient>
            </ScrollView>
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
        paddingBottom: px(8),
    },
    header_title: {
        fontSize: px(20),
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    swiper: {
        marginBottom: px(12),
        marginTop: px(4),
        height: px(120),
    },
    common_card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
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
        width: px(26),
        height: px(26),
        marginRight: px(9),
    },
    secure_card: {
        width: px(165),
        paddingVertical: px(12),
        paddingHorizontal: px(14),
        height: px(61),
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
        width: px(86),
        height: px(86),
        top: px(-20),
        left: px(4),
        position: 'absolute',
        zIndex: 10,
    },
    recommen_title: {
        fontSize: px(16),
        marginTop: px(26),
        marginLeft: px(94),
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
        backgroundColor: '#fbecd9',
        paddingHorizontal: px(16),
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
        borderRadius: px(3),
        backgroundColor: 'red',
        position: 'absolute',
        right: px(1),
        top: px(3),
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
});
