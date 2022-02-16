/*
 * @Date: 2021-05-31 10:22:09
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-16 15:41:11
 * @Description:推荐模块
 */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import LazyImage from '../LazyImage';
import LinearGradient from 'react-native-linear-gradient';
const RecommendCard = ({data, style, onPress}) => {
    const jump = useJump();

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    onPress && onPress();
                    jump(data?.url);
                }}
                style={[styles.card, style]}>
                <LazyImage
                    style={{width: '100%', height: px(190)}}
                    source={{
                        uri: data?.cover,
                    }}>
                    {data?.tag_image ? (
                        <FastImage
                            style={styles.tag_img}
                            source={{
                                uri: data?.tag_image,
                            }}
                        />
                    ) : null}
                </LazyImage>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={{padding: px(16), position: 'absolute', bottom: px(0)}}
                    colors={['rgba(0, 0, 0, 0)', 'rgba(27, 25, 32, 1)']}>
                    <Text style={styles.recommend_title} numberOfLines={2}>
                        {data?.title}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </>
    );
};

export default RecommendCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(6),
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    recommend_title: {
        color: '#fff',
        fontSize: px(17),
        lineHeight: px(26),
        fontWeight: '700',
    },
    blur_text: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: '700',
        marginTop: px(12),
        marginBottom: px(24),
    },
    bottom_text: {
        width: '100%',
        height: px(50),
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: px(16),
        zIndex: 10,
    },
    btn: {width: px(80), height: px(28), backgroundColor: '#fff', borderRadius: px(18)},
    tag_img: {width: px(90), height: px(28), position: 'absolute', top: 0, left: 0},
    new_tag: {
        width: px(23),
        height: px(18),
        position: 'absolute',
        left: 0,
        top: px(4),
    },
});
