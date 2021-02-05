/*
 * @Date: 2021-01-30 11:09:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-04 15:23:28
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
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {QuestionCard, ArticleCard} from '../../components/Article';
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
    const renderTitle = (title, more_text) => {
        return (
            <View
                style={[
                    Style.flexBetween,
                    {
                        marginBottom: px(16),
                    },
                ]}>
                <Text style={styles.large_title}>{title}</Text>
                {more_text ? <Text style={Style.more}>查看更多</Text> : null}
            </View>
        );
    };
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
                            {renderTitle('魔方谈养老', '查看更多')}

                            <ArticleCard />
                        </View>
                        <View style={{marginBottom: px(20)}}>
                            {renderTitle('魔方问答', '查看更多')}
                            <QuestionCard />
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
        color: Colors.lightBlackColor,
        paddingHorizontal: px(16),
        paddingVertical: px(8),
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

    close_img: {
        position: 'absolute',
        right: px(16),
        zIndex: 20,
    },
});
export default FindDetail;
