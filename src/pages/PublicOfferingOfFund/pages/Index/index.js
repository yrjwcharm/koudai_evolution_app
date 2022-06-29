/*
 * @Date: 2022-06-21 14:36:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-29 17:55:29
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
import {useJump} from '~/components/hooks';
import HTML from '~/components/RenderHtml';
import Loading from '~/pages/Portfolio/components/PageLoading';
import http from '~/services';
import {deviceWidth, px} from '~/utils/appUtil';
import RenderPart from './RenderPart';

/** @name 顶部菜单 */
const TopMenu = ({data = []}) => {
    const jump = useJump();
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topMenuCon}>
            {data.map((item, index, arr) => {
                const {icon, text, url} = item;
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={index}
                        onPress={() => jump(url)}
                        style={[
                            styles.menuItemBox,
                            index === arr.length - 1 ? {marginRight: 2 * Space.marginAlign} : {},
                        ]}>
                        <Image source={{uri: icon}} style={styles.menuIcon} />
                        <Text style={styles.menuItemText}>{text}</Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

/** @name 轮播 */
const SwiperCom = ({data = []}) => {
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
                {data.map((item, index) => {
                    const {button, name, rank_tag, tags, title, yield_info} = item;
                    return (
                        <TouchableOpacity key={name + index} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#FFF7EC', '#FFFFFF']}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}
                                style={styles.slider}>
                                {rank_tag ? (
                                    <View style={styles.tagBox}>
                                        <Text style={styles.tagText}>{rank_tag}</Text>
                                    </View>
                                ) : null}
                                {title ? (
                                    <View style={{marginTop: px(20)}}>
                                        {/* <View style={styles.underline} /> */}
                                        <Text style={styles.sliderTitle}>{title}</Text>
                                    </View>
                                ) : null}
                                <View style={[Style.flexRowCenter, {marginTop: px(12)}]}>
                                    {yield_info?.text ? (
                                        <View style={[Style.flexCenter, {marginRight: px(40), marginLeft: px(20)}]}>
                                            <HTML html={yield_info.value} style={styles.profit} />
                                            <Text style={[styles.label, {marginTop: px(2)}]}>{yield_info.text}</Text>
                                        </View>
                                    ) : null}
                                    <View>
                                        <Text numberOfLines={1} style={[styles.title, {maxWidth: px(150)}]}>
                                            {name}
                                        </Text>
                                        {tags?.length > 0 && (
                                            <View style={[Style.flexRow, {marginTop: px(4)}]}>
                                                {tags.map((tag, i) => (
                                                    <View key={tag + i} style={styles.labelBox}>
                                                        <Text style={styles.labelText}>{tag}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>
                                {button?.text ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={[Style.flexRowCenter, styles.sliderBtn]}>
                                        <Text style={[styles.title, {marginRight: px(6), color: '#fff'}]}>
                                            {button.text}
                                        </Text>
                                        <FontAwesome color={'#fff'} name={'angle-right'} size={18} />
                                    </TouchableOpacity>
                                ) : null}
                            </LinearGradient>
                        </TouchableOpacity>
                    );
                })}
            </Swiper>
        </View>
    );
};

const Index = ({navigation, route}) => {
    const [data, setData] = useState({});
    const {live, sub_list = [], suggest_list = [], tabs = [], un_buy_img} = data;

    useEffect(() => {
        http.get('/fund/public/index/20220610').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({
                    headerRight: () => (
                        <TouchableOpacity activeOpacity={0.8} style={{marginRight: Space.marginAlign}}>
                            <Feather color={Colors.defaultColor} name={'search'} size={px(20)} />
                        </TouchableOpacity>
                    ),
                    title: res.result.title || '公募基金',
                });
                setData(res.result);
            }
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
                <TopMenu data={tabs} />
                <SwiperCom data={suggest_list} />
                <LinearGradient
                    colors={['#FFFFFF', '#F4F5F7']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 0.2}}
                    style={styles.bottomContainer}>
                    <View style={{paddingHorizontal: Space.padding}}>
                        {live?.items?.length > 0 && <RenderPart data={live} />}
                        {sub_list?.length > 0 ? (
                            sub_list.map((item, index) => <RenderPart data={item} key={index} />)
                        ) : (
                            <Image source={{uri: un_buy_img}} style={styles.blocked} />
                        )}
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
    blocked: {
        marginTop: Space.marginVertical,
        marginHorizontal: -Space.marginAlign,
        width: deviceWidth,
        height: px(210),
    },
});

export default Index;
