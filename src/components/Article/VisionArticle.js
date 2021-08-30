/*
 * @Date: 2021-05-31 18:46:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-30 14:43:35
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
    const [is_new, setIsNew] = useState(data.is_new);
    const jump = useJump();
    let numberOfLines = scene == 'recommend' || scene == 'index' || scene == 'collect' ? 2 : data?.cover ? 3 : 2;
    useEffect(() => {
        setIsNew((pre_new) => {
            return data.is_new != pre_new ? data.is_new : pre_new;
        });
    }, [data.is_new]);

    console.log(data.id, (data.view_status == 1 || visionData?.readList?.includes(data.id)) && scene !== 'collect');
    return (
        <TouchableOpacity
            style={[styles.card, style]}
            activeOpacity={0.9}
            onPress={debounce(() => {
                setIsNew(false);
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
                    {data?.title ? (
                        <View>
                            {is_new ? (
                                <>
                                    <FastImage
                                        source={require('../../assets/img/article/voiceUpdate.png')}
                                        style={styles.new_tag}
                                    />
                                    <Text
                                        numberOfLines={2}
                                        style={[
                                            styles.article_content,
                                            {
                                                height: px(21) * numberOfLines,
                                                color:
                                                    (data.view_status == 1 ||
                                                        visionData?.readList?.includes(data.id)) &&
                                                    scene !== 'collect'
                                                        ? Colors.lightBlackColor
                                                        : Colors.defaultColor,
                                            },
                                        ]}>
                                        &emsp;&emsp;
                                        {data?.title}
                                    </Text>
                                </>
                            ) : (
                                <Text
                                    numberOfLines={numberOfLines}
                                    style={[
                                        styles.article_content,
                                        {
                                            height: px(21) * numberOfLines,
                                            color:
                                                (data.view_status == 1 || visionData?.readList?.includes(data.id)) &&
                                                scene !== 'collect'
                                                    ? Colors.lightBlackColor
                                                    : Colors.defaultColor,
                                        },
                                    ]}>
                                    {data?.title}
                                </Text>
                            )}
                        </View>
                    ) : (
                        <Text style={{height: px(21) * numberOfLines}} />
                    )}
                </View>
                {data?.cover ? (
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
                ) : null}
            </View>

            {scene == 'collect' ? null : (
                <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                    <Text style={[styles.light_text]}>{data?.view_num}人已阅读</Text>
                    <Praise
                        comment={{
                            favor_status: data?.favor_status,
                            favor_num: parseInt(data?.favor_num),
                            id: data?.id,
                        }}
                        noClick={true}
                        type={'article'}
                    />
                </View>
            )}
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
    },
    article_img: {
        width: px(84),
        height: px(63),
        borderRadius: px(4),
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
    new_tag: {
        width: px(23),
        height: px(18),
        position: 'absolute',
        left: 0,
        top: px(1),
    },
});
