/*
 * @Date: 2021-02-04 14:55:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-07 17:50:20
 * @Description:首页发现页文章卡片
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Space} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import Praise from '../Praise';
import {useJump} from '../hooks';

export default function ArticleCard({data = '', style}) {
    const jump = useJump();
    return (
        <TouchableOpacity
            key={data.id}
            style={[styles.card, style]}
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
            <View style={[Style.flexBetween, {marginTop: px(8)}]}>
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
    },
    article_title: {
        fontSize: px(14),
        fontWeight: 'bold',
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    article_img: {
        width: px(84),
        height: px(63),
        borderRadius: 4,
        marginLeft: px(10),
        alignSelf: 'flex-start',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    article_content: {
        fontSize: px(12),
        color: Colors.lightBlackColor,
        lineHeight: px(20),
        marginTop: px(8),
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
