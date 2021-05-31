/*
 * @Date: 2021-05-31 10:21:59
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-31 11:07:48
 * @Description:音频模块
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Style} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
const VideoCard = (props) => {
    return (
        <View style={[styles.card, props.style]}>
            <View style={Style.flexRow}>
                <View style={{flex: 1}}>
                    <View style={Style.flexRow}>
                        <FastImage
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/04/投顾观点@3x1.png'}}
                            style={{width: px(16), height: px(16), marginRight: px(6)}}
                        />
                        <Text style={{fontSize: px(13), color: Colors.lightBlackColor}}>小马哥财道</Text>
                    </View>
                    <Text numberOfLines={2} style={styles.title}>
                        第39期：韭菜大战华尔街？莫把炮灰当精英。战华尔街？莫把炮灰当精英
                    </Text>
                    <View style={Style.flexRow}>
                        <FastImage
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/04/投顾观点@3x1.png'}}
                            style={{width: px(26), height: px(26)}}
                        />
                        <Text style={{fontSize: px(13), color: Colors.lightBlackColor, marginHorizontal: px(6)}}>
                            小马哥
                        </Text>
                        <FastImage
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/04/投顾观点@3x1.png'}}
                            style={{width: px(12), height: px(12)}}
                        />
                    </View>
                </View>
                <View style={styles.cover_con}>
                    <FastImage
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/04/子女教育2_副本1.jpg'}}
                        style={styles.cover}
                    />
                </View>
            </View>
            <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                <Text style={styles.light_text}>22人已收听</Text>

                {/* <Praise comment={data} type={'article'} /> */}
            </View>
        </View>
    );
};

export default VideoCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(8),
        backgroundColor: '#fff',
        padding: px(16),
    },
    title: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        lineHeight: px(20),
        marginBottom: px(12),
        marginTop: px(9),
        height: px(40),
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
});
