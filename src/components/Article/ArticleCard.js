/*
 * @Date: 2021-02-04 14:55:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-04 20:12:05
 * @Description:首页发现页文章卡片
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Style, Space} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import {BoxShadow} from 'react-native-shadow';
const shadow = {
    width: deviceWidth - px(32),
    height: px(125),
    color: '#E3E6EE',
    border: 14,
    radius: 10,
    opacity: 0.4,
    x: 0,
    y: 6,
};
export default function ArticleCard() {
    return (
        <BoxShadow setting={shadow}>
            <View style={styles.card}>
                <View style={Style.flexRow}>
                    <View style={{flex: 1}}>
                        <Text numberOfLines={1} style={styles.article_title}>
                            不控制回撤的收益率就是耍流氓
                        </Text>
                        <Text numberOfLines={2} style={styles.article_content}>
                            当你亏了90%，你需要900%的收益率才可以赚回本金，所以说你需要控…
                            <Text style={Style.more}>全文</Text>
                        </Text>
                    </View>
                    <FastImage
                        style={styles.article_img}
                        source={{
                            uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/图片33.png',
                        }}
                    />
                </View>
                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                    <Text style={[styles.light_text]}>122,025人已阅读</Text>
                    <View style={Style.flexRow}>
                        <FastImage
                            resizeMode={FastImage.resizeMode.contain}
                            style={styles.zan_img}
                            source={require('../../assets/img/article/zan.png')}
                        />
                        <Text style={{fontSize: px(12), color: Colors.lightBlackColor, marginLeft: px(4)}}>11</Text>
                    </View>
                </View>
            </View>
        </BoxShadow>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 8,
        padding: Space.cardPadding,
        paddingBottom: px(12),
    },
    article_title: {
        fontSize: px(14),
        fontWeight: '700',
        color: Colors.defaultColor,
    },
    article_img: {width: px(84), height: px(63), borderRadius: 4, marginLeft: px(6)},
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    article_content: {
        fontSize: px(12),
        color: Colors.lightBlackColor,
        lineHeight: px(20),
        marginTop: px(12),
    },
    content: {
        fontSize: px(12),
        backgroundColor: '#F5F6FA',
        padding: px(10),
        borderRadius: 8,
    },
    zan_img: {
        width: px(12),
        height: px(12),
    },
});
