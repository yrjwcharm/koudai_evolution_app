/* eslint-disable radix */
/*
 * @Date: 2021-05-31 10:21:59
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-07 19:39:01
 * @Description:音频模块
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, Style, Font } from '../../common/commonStyle';
import { px } from '../../utils/appUtil';
import { useJump } from '../hooks';
import FastImage from 'react-native-fast-image';
import Praise from '../Praise';
import Icon from 'react-native-vector-icons/Ionicons';
const VioceCard = ({ data, style, scene }) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, style]}
            onPress={() => {
                jump(data?.url, scene == 'article' ? 'push' : 'navigate');
            }}>
            <View style={Style.flexRow}>
                <View style={{ flex: 1 }}>
                    {data?.cate_icon ? (
                        <View style={[Style.flexRow, { marginBottom: px(9) }]}>
                            <FastImage
                                source={{ uri: data?.cate_icon }}
                                style={{ width: px(16), height: px(16), marginRight: px(6) }}
                            />
                            <Text style={{ fontSize: px(13), color: Colors.lightBlackColor }}>{data?.cate_name}</Text>
                        </View>
                    ) : null}
                    {scene == 'recommend' || scene == 'collect' ? (
                        <Text numberOfLines={2} style={styles.title}>
                            {data.title}
                        </Text>
                    ) : (
                            <>
                                <Text numberOfLines={1} style={styles.title}>
                                    {data.album_name}
                                </Text>
                                <Text numberOfLines={2} style={styles.detail}>
                                    {data.title}
                                </Text>
                            </>
                        )}

                    <View style={Style.flexRow}>
                        <FastImage source={{ uri: data?.author?.avatar }} style={{ width: px(26), height: px(26) }} />
                        <Text style={{ fontSize: px(13), color: Colors.lightBlackColor, marginHorizontal: px(6) }}>
                            {data?.author?.nickname}
                        </Text>
                        {data?.author?.icon ? (
                            <FastImage source={{ uri: data?.author?.icon }} style={{ width: px(12), height: px(12) }} />
                        ) : null}
                    </View>
                </View>
                {data?.cover ? (
                    <View style={styles.cover_con}>
                        <FastImage source={{ uri: data?.cover }} style={styles.cover} />
                        <View style={[styles.media_duration, Style.flexRow]}>
                            <Icon name="md-play-circle-outline" size={px(16)} color="#fff" />

                            <Text
                                style={{
                                    fontSize: px(12),
                                    color: '#fff',
                                    fontFamily: Font.numMedium,
                                    marginLeft: px(3),
                                }}>
                                {data?.media_duration}
                            </Text>
                        </View>
                    </View>
                ) : null}
            </View>
            {scene == 'collect' ? null : (
                <View style={[Style.flexBetween, { marginTop: px(8) }]}>
                    <Text style={styles.light_text}>{data?.view_num}人已收听</Text>
                    <Praise
                        type={'article'}
                        comment={{
                            favor_status: data?.favor_status,
                            favor_num: parseInt(data?.favor_num),
                            id: data?.id,
                        }}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default VioceCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(8),
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        paddingTop: px(15),
        paddingBottom: px(12),
    },
    detail: {
        fontSize: px(12),
        color: Colors.lightBlackColor,
        lineHeight: px(17),
        height: px(36),
    },
    title: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        lineHeight: px(20),
        marginBottom: px(12),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    cover_con: {
        marginLeft: px(13),
    },
    cover: {
        height: px(106),
        width: px(106),
        borderRadius: px(6),
    },
    media_duration: {
        top: 46,
        zIndex: 100,
        paddingHorizontal: px(10),
        paddingVertical: px(4),
        position: 'absolute',
        borderRadius: px(6),
        opacity: 0.8,
        left: px(20),
        backgroundColor: '#000000',
    },
});
