/*
 * @Date: 2021-02-04 14:18:38
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-18 18:37:35
 * @Description:用户问答卡片
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Space} from '../../common/commonStyle';
import {px, debounce} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import {useJump} from '../hooks';
import {useSelector} from 'react-redux';
import Praise from '../Praise';
export default function QuestionCard({data, scene}) {
    const jump = useJump();
    const visionData = useSelector((store) => store.vision).toJS();
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={debounce(() => {
                global.LogTool(scene === 'index' ? 'indexRecArticle' : 'visionArticle', data.id);
                jump(data?.url, scene == 'article' ? 'push' : 'navigate');
            }, 300)}
            style={styles.ques_card}>
            <FastImage style={styles.big_ques} source={require('../../assets/img/article/big_ques.png')} />
            <View style={Style.flexRow}>
                <FastImage style={styles.ques_img} source={require('../../assets/img/find/question.png')} />
                {data?.cate_name ? (
                    <Text style={[styles.article_content, {color: Colors.defaultColor}]}>{data?.cate_name}</Text>
                ) : null}
            </View>
            <View style={[Style.flexRow, {marginVertical: px(8)}]}>
                <Text
                    numberOfLines={2}
                    style={[
                        styles.article_title,
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
            </View>
            <View style={styles.content}>
                <Text numberOfLines={2} style={[styles.article_content, {fontSize: px(12)}]}>
                    <Text style={{color: Colors.defaultColor, fontWeight: '700'}}>{data.author_name}：</Text>
                    {data?.desc}
                </Text>
            </View>
            {scene == 'collect' ? null : data?.tag_list ? (
                <View style={[Style.flexRow, {marginTop: px(8)}]}>
                    {data?.tag_list?.map((item, index) => {
                        return (
                            <Text key={index} style={[styles.light_text, {marginRight: px(4)}]}>
                                {item}
                            </Text>
                        );
                    })}
                </View>
            ) : null}
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    big_ques: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: px(63),
        height: px(63),
    },
    article_title: {
        flex: 1,
        fontSize: px(14),
        color: Colors.defaultColor,
        lineHeight: px(20),
    },
    article_content: {
        fontSize: px(13),
        color: Colors.lightBlackColor,
        lineHeight: px(20),
    },
    content: {
        backgroundColor: '#F5F6FA',
        padding: px(10),
        borderRadius: 8,
    },
    ques_img: {
        width: px(18),
        height: px(18),
        marginRight: px(8),
        marginTop: px(2),
    },
    ques_card: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 8,
        padding: Space.cardPadding,
        paddingTop: px(20),
        paddingBottom: px(12),
        marginBottom: px(12),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    new_tag: {
        width: px(23),
        height: px(18),
        marginRight: px(6),
        // position: 'absolute',
        // left: 0,
        // top: px(1),
    },
});
