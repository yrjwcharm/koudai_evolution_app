/*
 * @Date: 2021-02-04 14:55:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-09 20:10:07
 * @Description:首页发现页文章卡片
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Space} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import Praise from '../Praise';
import {useJump} from '../hooks';

export default function ArticleCard({data = ''}) {
    const jump = useJump();
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => {
                jump(data?.url);
            }}>
            <View style={Style.flexRow}>
                <View style={{flex: 1}}>
                    <Text numberOfLines={2} style={styles.article_title}>
                        {data?.title}
                    </Text>
                    {data?.detail ? (
                        <Text numberOfLines={2} style={styles.article_content}>
                            {data?.detail}
                            <Text style={Style.more}>全文</Text>
                        </Text>
                    ) : (
                        <Text style={{height: px(40)}} />
                    )}
                </View>
                <FastImage
                    style={styles.article_img}
                    source={{
                        uri: data?.cover,
                    }}
                />
            </View>
            <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                <Text style={[styles.light_text]}>{data?.view_num}人已阅读</Text>

                <Praise comment={data} type={'article'} />
            </View>
        </TouchableOpacity>
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
        lineHeight: px(20),
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
