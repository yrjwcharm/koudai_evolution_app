/*
 * @Date: 2021-02-04 14:17:26
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-05 16:25:56
 * @Description:首页
 */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {QuestionCard, ArticleCard} from '../../components/Article';
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BoxShadow} from 'react-native-shadow';
const shadow = {
    color: '#E3E6EE',
    border: 10,
    radius: 1,
    opacity: 0.4,
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
            {props.more_text ? <Text style={Style.more}>查看更多</Text> : null}
        </View>
    );
};

const Index = (props) => {
    const inset = useRef(useSafeAreaInsets()).current;
    return (
        <>
            <View style={[styles.header, {paddingTop: inset.top + (isIphoneX() ? 0 : px(8))}]}>
                <View style={Style.flexBetween}>
                    <View style={Style.flexRow}>
                        <FastImage style={styles.logo} source={require('../../assets/img/index/logo.png')} />
                        <Text style={styles.header_title}>理财魔方</Text>
                    </View>
                    {/* <Text style={Style.more}>登录/注册</Text> */}
                    <FastImage
                        style={{width: px(24), height: px(24)}}
                        source={require('../../assets/img/index/message.png')}
                    />
                </View>
                <Text style={styles.title_desc}>您的智能基金组合专家</Text>
            </View>
            <ScrollView style={{backgroundColor: Colors.bgColor}}>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={['#fff', Colors.bgColor]}
                    style={styles.container}>
                    <View style={{marginBottom: px(12), marginTop: px(4)}}>
                        <Swiper
                            height={px(120)}
                            autoplay
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
                            <FastImage
                                style={styles.slide}
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/banner-老版.jpg',
                                }}
                            />
                            <FastImage
                                style={styles.slide}
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/banner-老版.jpg',
                                }}
                            />
                            <FastImage
                                style={styles.slide}
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/banner-老版.jpg',
                                }}
                            />
                            <FastImage
                                style={styles.slide}
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/banner-老版.jpg',
                                }}
                            />
                        </Swiper>
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
                    <View style={{marginBottom: px(20), marginTop: px(14)}}>
                        <FastImage style={styles.robot} source={require('../../assets/img/robot.png')} />
                        <View style={styles.recommen_card}>
                            <ImageBackground
                                source={require('../../assets/img/index/recommendBg.png')}
                                style={{height: px(134)}}>
                                <Text style={[styles.secure_title, styles.recommen_title]}>您好，投资者</Text>
                                <View style={[Style.flexRow, styles.recommen_con]}>
                                    <FastImage
                                        style={{width: px(20), height: px(20)}}
                                        source={require('../../assets/img/index/douhao.png')}
                                    />
                                    <Text style={styles.recommen_text}>
                                        理财魔方将根据您的个人情况，为您定制基金组合，提升您的基金理
                                    </Text>
                                </View>
                            </ImageBackground>
                            <View style={[styles.recommen_bottom, Style.flexBetween]}>
                                <FastImage source={require('../../assets/img/index/logo.png')} style={styles.avatar} />
                                <Text style={{fontSize: px(12)}}>
                                    已有<Text style={{fontSize: px(13), fontFamily: Font.numFontFamily}}>1234</Text>
                                    人开启
                                </Text>
                                <TouchableOpacity>
                                    <LinearGradient
                                        start={{x: 0, y: 0.25}}
                                        end={{x: 0, y: 0.8}}
                                        colors={['#FF9463', '#FF7D41']}
                                        style={[styles.recommend_btn, Style.flexRow]}>
                                        <Text style={styles.btn_text}>开始定制</Text>
                                        <FontAwesome name={'angle-right'} size={18} color="#fff" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* 马红漫 */}
                    <View style={{marginBottom: px(20)}}>
                        <BoxShadow setting={{...shadow, height: px(75), width: deviceWidth - px(32)}}>
                            <View style={[styles.V_card, Style.flexRow, styles.common_card]}>
                                <FastImage
                                    style={{width: px(40), height: px(40), marginRight: px(8)}}
                                    source={require('../../assets/img/index/logo.png')}
                                />
                                <View style={{flex: 1}}>
                                    <View style={[Style.flexRow, {marginBottom: px(6)}]}>
                                        <Text style={[styles.secure_title, {marginRight: px(4)}]}>主理人：马红漫</Text>
                                        <FastImage
                                            style={{width: px(17), height: px(17)}}
                                            source={require('../../assets/img/index/logo.png')}
                                        />
                                    </View>
                                    <View style={Style.flexBetween}>
                                        <Text numberOfLines={1} style={styles.v_text}>
                                            经济学博士、经主持人、财经评…经济学博士经评…
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
                    {/* 推荐阅读 */}
                    <View style={{marginBottom: px(20)}}>
                        <RenderTitle title={'推荐阅读'} more_text={'更多文章'} />
                        <ArticleCard />
                    </View>
                    {/* 用户问答 */}
                    <View style={{marginBottom: px(9)}}>
                        <RenderTitle title={'用户问答'} />
                        <QuestionCard />
                    </View>
                    {/* 听听魔方用户怎么说 */}
                    <View>
                        <RenderTitle title={'听听魔方用户怎么说'} />
                        <ScrollView
                            loop={true}
                            showsPagination={false}
                            horizontal={true}
                            height={px(188)}
                            snapToInterval={px(282)}
                            decelerationRate={0.99}
                            showsHorizontalScrollIndicator={false}>
                            <BoxShadow
                                setting={{
                                    ...shadow,
                                    width: px(282),
                                    height: px(168),
                                    style: {marginRight: px(16)},
                                }}>
                                <View style={[styles.about_our, styles.common_card]}>
                                    <View style={Style.flexRow}>
                                        <FastImage
                                            source={require('../../assets/img/index/logo.png')}
                                            style={styles.avatar}
                                        />
                                        <View style={{flex: 1}}>
                                            <Text style={styles.avatar_name}>繁星点点</Text>
                                            <Text
                                                style={{
                                                    fontSize: px(12),
                                                    color: Colors.darkGrayColor,
                                                }}>
                                                2020-08-05 通过微信公众号留言
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.about_text} numberOfLines={4}>
                                        魔方加油！只要信任，不乱操作，买魔方肯定能挣到钱的！不要羡慕那些挣得多的，得多的，因为他们没有风险
                                    </Text>
                                    <View style={[Style.flexRow, styles.zan]}>
                                        <FastImage
                                            resizeMode={FastImage.resizeMode.contain}
                                            style={styles.zan_img}
                                            source={require('../../assets/img/article/zan.png')}
                                        />
                                        <Text
                                            style={{
                                                fontSize: px(12),
                                                color: Colors.lightBlackColor,
                                                marginLeft: px(4),
                                            }}>
                                            11
                                        </Text>
                                    </View>
                                </View>
                            </BoxShadow>
                            <BoxShadow setting={{...shadow, width: px(282), height: px(168), marginBottom: 0}}>
                                <View style={[styles.about_our, styles.common_card]}>
                                    <View style={Style.flexRow}>
                                        <FastImage
                                            source={require('../../assets/img/index/logo.png')}
                                            style={styles.avatar}
                                        />
                                        <View style={{flex: 1}}>
                                            <Text style={styles.avatar_name}>繁星点点</Text>
                                            <Text
                                                style={{
                                                    fontSize: px(12),
                                                    color: Colors.darkGrayColor,
                                                }}>
                                                2020-08-05 通过微信公众号留言
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.about_text} numberOfLines={4}>
                                        魔方加油！只要信任，不乱操作，买魔方肯定能挣到钱的！不要羡慕那些挣得多的，得多的，因为他们没有风险
                                    </Text>
                                    <View style={[Style.flexRow, styles.zan]}>
                                        <FastImage
                                            resizeMode={FastImage.resizeMode.contain}
                                            style={styles.zan_img}
                                            source={require('../../assets/img/article/zan.png')}
                                        />
                                        <Text
                                            style={{
                                                fontSize: px(12),
                                                color: Colors.lightBlackColor,
                                                marginLeft: px(4),
                                            }}>
                                            11
                                        </Text>
                                    </View>
                                </View>
                            </BoxShadow>
                        </ScrollView>
                    </View>
                    <View style={{marginBottom: px(20)}}>
                        <RenderTitle title={'关于理财魔方'} />
                        <BoxShadow setting={{...shadow, height: px(135)}}>
                            <View style={{borderRadius: px(6), overflow: 'hidden'}}>
                                <ImageBackground
                                    style={[Style.flexRow, {height: px(52), paddingLeft: px(16)}]}
                                    source={require('../../assets/img/index/aboutOur.png')}>
                                    <View style={[Style.flexRow]}>
                                        <Text style={{fontSize: px(11), color: '#fff'}}>累计基金交易额超过</Text>
                                        <Text style={styles.about_num}>200</Text>
                                        <Text style={{fontSize: px(11), color: '#fff'}}>亿元</Text>
                                    </View>
                                </ImageBackground>
                                <View
                                    style={[
                                        Style.flexRow,
                                        {backgroundColor: '#fff', justifyContent: 'space-evenly', height: px(83)},
                                    ]}>
                                    <View style={{alignItems: 'center'}}>
                                        <FastImage
                                            source={require('../../assets/img/index/logo.png')}
                                            style={styles.icon}
                                        />
                                        <Text style={{color: Colors.lightBlackColor, fontSize: px(11)}}>团队介绍</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <FastImage
                                            source={require('../../assets/img/index/logo.png')}
                                            style={styles.icon}
                                        />
                                        <Text style={{color: Colors.lightBlackColor, fontSize: px(11)}}>团队介绍</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <FastImage
                                            source={require('../../assets/img/index/logo.png')}
                                            style={styles.icon}
                                        />
                                        <Text style={{color: Colors.lightBlackColor, fontSize: px(11)}}>团队介绍</Text>
                                    </View>
                                </View>
                            </View>
                        </BoxShadow>
                    </View>
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
        marginBottom: px(8),
    },
    about_num: {
        fontFamily: Font.numFontFamily,
        fontSize: px(18),
        color: '#fff',
        marginHorizontal: px(2),
    },
    avatar: {
        width: px(31),
        height: px(31),
        marginRight: px(13),
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
    zan_img: {
        width: px(12),
        height: px(12),
    },
    avatar_name: {
        fontSize: px(13),
        color: Colors.lightBlackColor,
        marginBottom: px(6),
    },
});
