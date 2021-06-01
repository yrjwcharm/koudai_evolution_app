/*
 * @Date: 2021-05-31 18:46:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-01 17:08:52
 * @Description:视野文章模块
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Space} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import Praise from '../Praise';
import {useJump} from '../hooks';

export default function VisionArticle({data = '', style}) {
    const jump = useJump();
    return (
        <TouchableOpacity
            style={[styles.card, style]}
            activeOpacity={0.9}
            onPress={() => {
                jump(data?.url);
            }}>
            <View style={Style.flexRow}>
                <View style={{flex: 1}}>
                    {data?.cate_icon ? (
                        <View style={[Style.flexRow, {marginBottom: px(8)}]}>
                            <FastImage
                                source={{uri: data?.cate_icon}}
                                style={{width: px(16), height: px(16), marginRight: px(6)}}
                            />
                            <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>{data?.cate_name}</Text>
                        </View>
                    ) : null}
                    {data?.title ? (
                        <Text
                            numberOfLines={data?.cover ? 3 : 2}
                            style={[styles.article_content, {height: data?.cover ? px(63) : px(42)}]}>
                            {data?.title}
                        </Text>
                    ) : (
                        <Text style={{height: data?.cover ? px(63) : px(42)}} />
                    )}
                </View>
                {data?.cover ? (
                    <FastImage
                        style={styles.article_img}
                        source={{
                            uri: data?.cover,
                        }}
                    />
                ) : null}
            </View>
            <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                <Text style={[styles.light_text]}>{data?.view_num}人已阅读</Text>

                <Praise
                    comment={{
                        favor_status: data?.favor_status,
                        favor_num: parseInt(data?.favor_num),
                        id: data?.id,
                    }}
                    type={'article'}
                />
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
        fontSize: px(14),
        color: Colors.defaultColor,
        lineHeight: px(20),

        fontWeight: 'bold',
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
