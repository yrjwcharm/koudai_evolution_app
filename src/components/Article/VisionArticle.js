/*
 * @Date: 2021-05-31 18:46:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-18 19:13:49
 * @Description:视野文章模块
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Space} from '../../common/commonStyle';
import {px, debounce} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import Praise from '../Praise';
import {useJump} from '../hooks';
import {useSelector} from 'react-redux';
import LazyImage from '../LazyImage';
export default function VisionArticle({data = '', style, scene}) {
    const visionData = useSelector((store) => store.vision).toJS();
    //上下布局 默认左右布局 图片资源在右边
    const isHorizontal = data?.show_mode ? data?.show_mode == 'horizontal' : true;
    const jump = useJump();
    let numberOfLines = 2;
    return (
        <TouchableOpacity
            style={[styles.card, {width: isHorizontal ? 'auto' : px(230)}, style]}
            activeOpacity={0.9}
            onPress={debounce(() => {
                global.LogTool(scene === 'index' ? 'indexRecArticle' : 'visionArticle', data.id);
                jump(data?.url, scene == 'article' ? 'push' : 'navigate');
            }, 300)}>
            <View style={{flexDirection: 'row'}}>
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
                    {/* 博主大v */}
                    {data?.blogger ? (
                        <View style={[Style.flexRow, {marginBottom: px(8)}]}>
                            <FastImage
                                source={{uri: data?.blogger?.avatar}}
                                style={{width: px(36), height: px(36), marginRight: px(6), borderRadius: px(18)}}
                            />
                            <View>
                                <Text style={styles.blogger_name}>{data?.blogger?.nickname}</Text>
                                <Text style={{fontSize: px(12), color: Colors.lightGrayColor}}>
                                    {data?.blogger?.fans_num_desc}
                                </Text>
                            </View>
                        </View>
                    ) : null}
                    {data?.title ? (
                        <Text
                            numberOfLines={numberOfLines}
                            style={[
                                styles.article_content,
                                {
                                    color:
                                        (data.view_status == 1 || visionData?.readList?.includes(data.id)) &&
                                        scene !== 'collect'
                                            ? Colors.lightBlackColor
                                            : Colors.defaultColor,
                                },
                            ]}>
                            {data?.title}
                        </Text>
                    ) : (
                        <Text style={{height: px(20) * numberOfLines}} />
                    )}
                    {data?.tag_list ? (
                        <View style={[Style.flexRow, {marginTop: isHorizontal ? px(13) : px(8)}]}>
                            {data?.tag_list?.map((item, index) => {
                                return (
                                    <Text key={index} style={[styles.light_text]}>
                                        {item}
                                    </Text>
                                );
                            })}
                        </View>
                    ) : null}
                </View>
                {data?.cover && isHorizontal ? (
                    <View style={{alignSelf: 'flex-end'}}>
                        <LazyImage
                            style={styles.article_img}
                            source={{
                                uri: data?.cover,
                            }}
                            logoStyle={{
                                width: px(22),
                                height: px(24),
                            }}
                        />
                    </View>
                ) : null}
            </View>
            {data?.cover && !isHorizontal ? (
                <LazyImage
                    style={styles.vertical_article_img}
                    source={{
                        uri: data?.cover,
                    }}
                    logoStyle={{
                        width: px(22),
                        height: px(24),
                    }}
                />
            ) : null}
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

    article_img: {
        width: px(98),
        height: px(70),
        borderRadius: px(4),
        marginLeft: px(10),
        alignSelf: 'flex-end',
    },
    vertical_article_img: {
        width: px(198),
        height: px(110),
        borderRadius: px(4),
        marginTop: px(12),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginRight: px(4),
    },
    article_content: {
        fontSize: px(14),
        height: px(42),
        color: Colors.defaultColor,
        lineHeight: px(20),
    },
    content: {
        fontSize: px(12),
        backgroundColor: '#F5F6FA',
        padding: px(10),
        borderRadius: 8,
    },
    blogger_name: {
        fontSize: px(14),
        color: Colors.lightBlackColor,
        fontWeight: '700',
        marginBottom: px(4),
    },
});
