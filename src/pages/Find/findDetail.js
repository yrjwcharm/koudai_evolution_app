/*
 * @Date: 2021-01-30 11:09:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-02 17:22:15
 * @Description:发现
 */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import * as MagicMove from 'react-native-magic-move';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
const FindDetail = (props) => {
    // const ZoomIn = {
    //     0: {
    //         scale: 0.9,
    //     },
    //     0.8: {
    //         scale: 1.05,
    //     },
    //     1: {
    //         scale: 1,
    //     },
    // };
    const containerRef = useRef(null);
    const insets = useRef(useSafeAreaInsets()).current;
    return (
        <MagicMove.Scene>
            <Animatable.View ref={containerRef} style={styles.container}>
                <TouchableOpacity
                    style={[styles.close_img, {top: insets.top}]}
                    onPress={() => {
                        Platform.OS == 'ios'
                            ? containerRef?.current.fadeOutDown(300).then(() => {
                                  props.navigation.goBack();
                              })
                            : props.navigation.goBack();
                    }}>
                    <FastImage
                        style={{width: px(24), height: px(24)}}
                        source={require('../../assets/img/find/close.png')}
                    />
                </TouchableOpacity>
                <ScrollView>
                    {/* header */}
                    <MagicMove.View style={[styles.recommend]} id="logo" transition={MagicMove.Transition.morph}>
                        <FastImage
                            style={{
                                height: px(350),
                            }}
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片42.png'}}
                        />
                        <View style={[styles.header, {top: insets.top + px(4)}]}>
                            <Text style={styles.img_desc}>35+必备</Text>
                            <Text style={styles.img_title}>美好生活提前储备</Text>
                        </View>
                        <View
                            style={[
                                styles.card,
                                {
                                    marginTop: px(-78),
                                    marginHorizontal: px(16),
                                },
                            ]}>
                            <View
                                style={{
                                    padding: Space.cardPadding,
                                }}>
                                <Text style={[styles.card_title, {fontSize: px(16)}]}>养老计划</Text>
                                <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                                    <Text style={styles.radio}>132.87%~156.58%</Text>
                                    <TouchableOpacity>
                                        <LinearGradient
                                            start={{x: 0, y: 0.25}}
                                            end={{x: 0, y: 0.8}}
                                            colors={['#FF9463', '#FF7D41']}
                                            style={styles.recommend_btn}>
                                            <Text style={styles.btn_text}>开启计划</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.light_text}>35+必备 ｜ 美好生活提前储备</Text>
                            </View>

                            <Text style={styles.tip_text}>已有 212,345 同龄人开启计划</Text>
                        </View>
                    </MagicMove.View>

                    <View style={{paddingHorizontal: px(16)}}>
                        <View style={{marginBottom: px(20)}}>
                            <View
                                style={[
                                    Style.flexBetween,
                                    {
                                        marginBottom: px(16),
                                    },
                                ]}>
                                <Text style={styles.large_title}>魔方谈养老</Text>
                                <Text style={styles.more}>查看更多</Text>
                            </View>
                            <View
                                style={[
                                    styles.card,
                                    {
                                        padding: Space.cardPadding,
                                        paddingBottom: px(12),
                                    },
                                ]}>
                                <View style={[Style.flexRow]}>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.article_title}>为什么35岁要开始养老</Text>
                                        <Text style={styles.article_content}>
                                            当你亏了90%，你需要900%的收益率才可以赚回本金，所以说你需要控…
                                            <Text style={styles.more}>全文</Text>
                                        </Text>
                                    </View>
                                    <FastImage
                                        style={styles.article_img}
                                        source={{
                                            uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片33.png',
                                        }}
                                    />
                                </View>
                                <View style={[Style.flexBetween, {marginTop: px(10)}]}>
                                    <Text style={[styles.light_text, {marginTop: 0}]}>122,025人已阅读</Text>
                                    <View style={Style.flexRow}>
                                        <Icon name="thumbs-up" color={Colors.darkGrayColor} size={px(14)} />
                                        <Text
                                            style={{fontSize: px(12), color: Colors.darkGrayColor, marginLeft: px(4)}}>
                                            11
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{marginBottom: px(20)}}>
                            <View
                                style={[
                                    Style.flexBetween,
                                    {
                                        marginBottom: px(16),
                                    },
                                ]}>
                                <Text style={styles.large_title}>魔方问答</Text>
                                <Text style={styles.more}>查看更多</Text>
                            </View>
                            <View
                                style={[
                                    styles.card,
                                    {
                                        borderRadius: 8,
                                        padding: Space.cardPadding,
                                        paddingTop: px(20),
                                    },
                                ]}>
                                <View>
                                    <Text style={[styles.article_content, {fontSize: px(13)}]}>
                                        理财魔方用户-高先生
                                    </Text>
                                    <View style={[Style.flexRow, {marginVertical: px(15)}]}>
                                        <FastImage
                                            style={styles.ques_img}
                                            source={require('../../assets/img/find/question.png')}
                                        />
                                        <Text style={[styles.article_title, {marginBottom: 0}]}>
                                            投资一支基金和一个组合的区别？
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.article_content}>
                                            <Text style={{color: Colors.defaultColor, fontWeight: '700'}}>
                                                魔方回答：
                                            </Text>
                                            一支基金的风险是不可控的，只有基金组合投资到多个市场中，才可以进行市场风险对冲…
                                            <Text style={styles.more}>全文</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Animatable.View>
        </MagicMove.Scene>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    recommend: {
        borderRadius: 8,
        marginBottom: px(20),
    },
    recommend_btn: {
        height: px(32),
        justifyContent: 'center',
        paddingHorizontal: px(22),
        borderRadius: 20,
    },
    card: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 8,
    },
    card_title: {
        fontSize: px(15),
        fontWeight: '700',
        color: Colors.defaultColor,
        marginRight: px(12),
    },
    article_title: {
        fontSize: px(14),
        fontWeight: '700',
        color: Colors.defaultColor,
        marginBottom: px(9),
    },
    radio: {
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        fontSize: px(24),
        marginTop: px(6),
        lineHeight: px(28),
    },

    btn_text: {
        fontSize: px(13),
        color: '#fff',
        fontWeight: '700',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginTop: px(4),
    },
    large_title: {
        fontWeight: '700',
        fontSize: px(17),
        color: Colors.defaultColor,
    },
    img_title: {
        color: '#fff',
        fontSize: px(26),
        lineHeight: px(28),
        fontWeight: '700',
    },
    tip_text: {
        backgroundColor: '#FEF8EE',
        fontSize: px(13),
        color: '#4E556C',
        paddingHorizontal: px(16),
        paddingVertical: px(8),
    },
    more: {
        fontSize: px(12),
        color: Colors.btnColor,
    },
    article_img: {width: px(84), height: px(63), borderRadius: 4, marginLeft: px(10)},
    article_content: {
        fontSize: px(12),
        color: Colors.darkGrayColor,
        lineHeight: px(20),
    },
    header: {
        position: 'absolute',
        paddingHorizontal: px(16),
    },
    img_desc: {
        color: '#fff',
        fontSize: px(14),
        marginBottom: px(10),
    },
    ques_img: {
        width: px(18),
        height: px(18),
        marginRight: px(8),
    },
    close_img: {
        position: 'absolute',
        right: px(16),
        zIndex: 20,
    },
});
export default FindDetail;
