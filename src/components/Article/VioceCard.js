/* eslint-disable radix */
/*
 * @Date: 2021-05-31 10:21:59
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-16 18:12:30
 * @Description:音频模块
 */

import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, debounce} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import LazyImage from '../LazyImage';
const VioceCard = ({data, style, scene}) => {
    const visionData = useSelector((store) => store.vision).toJS();
    const jump = useJump();

    //上下布局 默认左右布局 图片资源在右边
    const isHorizontal = data?.show_mode ? data?.show_mode == 'horizontal' : true;
    const coverRender = () => {
        return (
            <View style={styles.cover_con}>
                <LazyImage
                    source={{uri: data?.cover}}
                    style={styles.cover}
                    logoStyle={{width: px(30), height: px(32)}}
                />
                <View style={[styles.media_duration, Style.flexRow]}>
                    <Image
                        source={require('../../assets/img/vision/play.png')}
                        style={{width: px(14), height: px(14)}}
                    />
                    <Text style={styles.duration_text}>{data?.media_duration}</Text>
                </View>
            </View>
        );
    };
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, !isHorizontal && {width: px(162)}, style]}
            onPress={debounce(() => {
                global.LogTool(scene === 'index' ? 'indexRecArticle' : 'visionArticle', data.id);
                jump(data?.url, scene == 'article' ? 'push' : 'navigate');
            }, 300)}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    {data?.cate_icon ? (
                        <View style={[Style.flexRow, {marginBottom: px(9)}]}>
                            <FastImage
                                source={{uri: data?.cate_icon}}
                                style={{width: px(16), height: px(16), marginRight: px(6)}}
                            />
                            <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>{data?.cate_name}</Text>
                        </View>
                    ) : null}

                    <Text numberOfLines={1} style={[styles.title]}>
                        {data.album_name}
                    </Text>
                    <Text numberOfLines={2} style={styles.detail}>
                        {data.title}sadasda
                    </Text>
                </View>
                {data?.cover && isHorizontal ? coverRender() : null}
            </View>
            {scene == 'collect' ? null : (
                <View style={[Style.flexRow, {marginTop: px(8)}]}>
                    {data?.tag_list?.map((item, index) => {
                        return (
                            <Text key={index} style={[styles.light_text]}>
                                {item}
                            </Text>
                        );
                    })}
                </View>
            )}
            {data?.cover && !isHorizontal ? coverRender() : null}
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
        color: Colors.defaultColor,
        fontSize: px(14),
        lineHeight: px(20),
        height: px(42),
    },
    title: {
        fontSize: px(14),
        color: Colors.lightBlackColor,

        lineHeight: px(20),
        marginBottom: px(12),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    cover_con: {
        marginLeft: px(13),
        height: px(106),
        width: px(106),
    },
    cover: {
        height: px(106),
        width: px(106),
        borderRadius: px(6),
    },
    media_duration: {
        paddingHorizontal: px(4),
        paddingVertical: px(4),
        position: 'absolute',
        bottom: px(7),
        right: px(7),
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: px(2),
    },
    avatar: {
        width: px(26),
        height: px(26),
        borderColor: Colors.lineColor,
        borderWidth: 0.5,
        borderRadius: px(13),
    },
    duration_text: {
        fontSize: px(12),
        color: '#fff',
        fontFamily: Font.numMedium,
        marginLeft: px(3),
    },
    badge: {
        width: px(8),
        height: px(8),
        borderRadius: px(4),
        marginLeft: px(8),
        marginTop: px(-12),
        backgroundColor: Colors.red,
    },
    new_tag: {
        width: px(23),
        height: px(18),
        position: 'absolute',
        left: 0,
        top: px(1),
    },
});
