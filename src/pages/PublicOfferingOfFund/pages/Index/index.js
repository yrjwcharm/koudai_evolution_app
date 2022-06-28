/*
 * @Date: 2022-06-21 14:36:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-24 15:55:19
 * @Description: 公募基金首页
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, px} from '~/utils/appUtil';
import RenderPart from './RenderPart';

/** @name 顶部菜单 */
const TopMenu = () => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topMenuCon}>
            {['基金分类', '稳健增值', '追求收益', '指数增强', '海外热门', '长期牛基'].map((item, index, arr) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    style={[styles.menuItemBox, index === arr.length - 1 ? {marginRight: 2 * Space.marginAlign} : {}]}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/06/public.png'}}
                        style={styles.menuIcon}
                    />
                    <Text style={styles.menuItemText}>{item}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

/** @name 轮播 */
const SwiperCom = () => {
    return (
        <View style={styles.swiperContainer}>
            <Swiper
                activeDotStyle={[styles.dotStyle, styles.activeDotStyle]}
                autoplay
                autoplayTimeout={4}
                dotStyle={styles.dotStyle}
                height={px(172)}
                loadMinimal={Platform.select({android: false, ios: true})}
                paginationStyle={{bottom: px(8)}}
                removeClippedSubviews={false}>
                {[1, 2, 3, 4].map((item, index) => (
                    <TouchableOpacity key={item + index} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#FFF7EC', '#FFFFFF']}
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            style={styles.slider}>
                            <View style={styles.tagBox}>
                                <Text style={styles.tagText}>{'标签内容'}</Text>
                            </View>
                            <View style={{marginTop: px(20)}}>
                                <View style={styles.underline} />
                                <Text style={styles.sliderTitle}>{'价值投资布局绿色新能源'}</Text>
                            </View>
                            <View style={[Style.flexRowCenter, {marginTop: px(12)}]}>
                                <View style={{marginRight: px(40), marginLeft: px(20)}}>
                                    <Text style={styles.profit}>{'+38.67%'}</Text>
                                    <Text style={[styles.label, {marginTop: px(2)}]}>{'近一年收益率'}</Text>
                                </View>
                                <View>
                                    <Text style={styles.title}>{'工银新能源汽车混合C'}</Text>
                                    <View style={[Style.flexRow, {marginTop: px(4)}]}>
                                        <View style={styles.labelBox}>
                                            <Text style={styles.labelText}>{'绿色新能源'}</Text>
                                        </View>
                                        <View style={styles.labelBox}>
                                            <Text style={styles.labelText}>{'业绩优秀'}</Text>
                                        </View>
                                        <View style={styles.labelBox}>
                                            <Text style={styles.labelText}>{'复购高'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} style={[Style.flexRowCenter, styles.sliderBtn]}>
                                <Text style={[styles.title, {marginRight: px(6), color: '#fff'}]}>{'立即购买'}</Text>
                                <FontAwesome color={'#fff'} name={'angle-right'} size={18} />
                            </TouchableOpacity>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </Swiper>
        </View>
    );
};

const Index = ({navigation, route}) => {
    const [data, setData] = useState({});

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity activeOpacity={0.8} style={{marginRight: Space.marginAlign}}>
                    <Feather color={Colors.defaultColor} name={'search'} size={px(20)} />
                </TouchableOpacity>
            ),
            title: '公募基金',
        });
        setData({
            title: '公募基金',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <LinearGradient
            colors={['#FFFFFF', '#F4F5F7']}
            start={{x: 0, y: 0.5}}
            end={{x: 0, y: 1}}
            style={styles.container}>
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <TopMenu />
                <SwiperCom />
                <LinearGradient
                    colors={['#FFFFFF', '#F4F5F7']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 0.2}}
                    style={styles.bottomContainer}>
                    <View style={{paddingHorizontal: Space.padding}}>
                        {[
                            {
                                items: [{type: 'rank_card'}, {type: 'rank_card'}, {type: 'rank_card'}],
                                more: {text: '更多', url: ''},
                                sub_title: '',
                                tabs: [
                                    {key: '1', value: '高净值用户热门'},
                                    {key: '2', value: '牛人购买热卖'},
                                    {key: '3', value: '近一周交易量最大'},
                                ],
                                title: '魔方特色榜单',
                            },
                            {
                                items: [{type: 'default_card'}, {type: 'default_card'}, {type: 'default_card'}],
                                more: {text: '更多', url: ''},
                                sub_title: '长期投资回报高',
                                tabs: [],
                                title: '追求收益',
                            },
                        ].map((item, index) => (
                            <RenderPart data={item} key={index} />
                        ))}
                    </View>
                    <BottomDesc />
                </LinearGradient>
            </ScrollView>
        </LinearGradient>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topMenuCon: {
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
        paddingBottom: px(20),
        width: deviceWidth,
    },
    menuItemBox: {
        marginRight: px(18),
        alignItems: 'center',
        minWidth: px(48),
    },
    menuIcon: {
        width: px(24),
        height: px(24),
    },
    menuItemText: {
        marginTop: px(8),
        fontSize: Font.textH3,
        lineHeight: px(18),
        color: '#3D3D3D',
    },
    swiperContainer: {
        marginHorizontal: Space.marginAlign,
        height: px(172),
        position: 'relative',
        zIndex: 2,
    },
    bottomContainer: {
        flex: 1,
        marginTop: px(-134),
        paddingTop: px(134),
    },
    dotStyle: {
        borderRadius: px(5),
        width: px(4),
        height: px(3),
        backgroundColor: 'rgba(18, 29, 58, 0.2)',
    },
    activeDotStyle: {
        width: px(12),
        backgroundColor: '#545968',
    },
    slider: {
        borderRadius: px(8),
        height: px(172),
        overflow: 'hidden',
        alignItems: 'center',
    },
    tagBox: {
        paddingHorizontal: px(8),
        borderBottomLeftRadius: px(4),
        justifyContent: 'center',
        height: px(22),
        backgroundColor: Colors.red,
        position: 'absolute',
        top: 0,
        right: 0,
    },
    tagText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#fff',
    },
    underline: {
        width: px(64),
        height: px(8),
        backgroundColor: '#FFE9AD',
        position: 'absolute',
        right: px(56),
        bottom: px(1),
        left: px(56),
    },
    sliderTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    sliderBtn: {
        marginTop: Space.marginVertical,
        borderRadius: px(50),
        width: px(220),
        height: px(40),
        backgroundColor: '#E2BB7D',
    },
    profit: {
        fontSize: px(20),
        lineHeight: px(24),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },
    label: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    labelBox: {
        marginRight: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#AD9064',
    },
    labelText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#AD9064',
    },
});

export default Index;
