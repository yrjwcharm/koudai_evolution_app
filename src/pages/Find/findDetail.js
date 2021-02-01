/*
 * @Date: 2021-01-30 11:09:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-01 19:36:45
 * @Description:发现
 */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {px} from '../../utils/appUtil';
import {Colors, Space, Style, Font} from '../../common/commonStyle';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import * as MagicMove from 'react-native-magic-move';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';
const FindDetail = (props) => {
    const ZoomIn = {
        0: {
            scale: 0.9,
        },
        0.8: {
            scale: 1.05,
        },
        1: {
            scale: 1,
        },
    };
    const containerRef = useRef(null);
    return (
        <View>
            <ScrollView>
                <Animatable.View ref={containerRef} animation={ZoomIn} duration={800} style={styles.container}>
                    {/* header */}

                    <View
                        style={[styles.recommend]}
                        duration={600}
                        id="logo"
                        transition={MagicMove.Transition.shrinkAndGrow}>
                        <FastImage
                            style={{
                                height: px(350),
                            }}
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片42.png'}}
                        />

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
                                <View style={Style.flexRow}>
                                    <Text style={[styles.card_title, {fontSize: px(16)}]}>养老计划</Text>
                                </View>
                                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                                    <Text style={[styles.radio, {fontSize: px(26), marginTop: px(4)}]}>
                                        132.87%~156.58%
                                    </Text>
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
                    </View>

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
                        <TouchableOpacity
                            onPress={() => {
                                containerRef?.current.fadeOutDown(300).then(() => {
                                    props.navigation.goBack();
                                });
                            }}>
                            <Text>返回</Text>
                        </TouchableOpacity>
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
                                            source={require('../../assets/img/question.png')}
                                        />
                                        <Text style={[styles.article_title, {marginBottom: 0}]}>
                                            投资一支基金和一个组合的区别？
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.article_content}>
                                            <Text style={{color: Colors.defaultColor, fontWeight: '500'}}>
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
                </Animatable.View>
            </ScrollView>
        </View>
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
        paddingVertical: px(8),
        paddingHorizontal: px(26),
        borderRadius: 20,
    },
    card: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 8,
    },
    card_title: {
        fontSize: px(15),
        fontWeight: '500',
        color: Colors.defaultColor,
        marginRight: px(12),
    },
    article_title: {
        fontSize: px(14),
        fontWeight: '500',
        color: Colors.defaultColor,
        marginBottom: px(9),
    },
    radio: {
        color: Colors.red,
        fontFamily: Font.numFontFamily,
    },

    btn_text: {
        fontSize: px(13),
        color: '#fff',
        fontWeight: '500',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginTop: px(4),
    },
    large_title: {
        fontWeight: '500',
        fontSize: px(17),
        color: Colors.defaultColor,
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
    ques_img: {
        width: px(18),
        height: px(18),
        marginRight: px(8),
    },
});
export default FindDetail;
