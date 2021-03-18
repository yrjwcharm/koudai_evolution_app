/*
 * @Date: 2021-02-04 14:18:38
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-18 17:37:31
 * @Description:用户问答卡片
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Style, Space} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import {useJump} from '../hooks';
import {BoxShadow} from 'react-native-shadow';
const shadow = {
    width: deviceWidth - px(32),
    height: px(168),
    color: '#E3E6EE',
    border: 14,
    radius: 10,
    opacity: 0.2,
    x: 0,
    y: 6,
    style: {marginBottom: px(12)},
};

export default function QuestionCard({data = []}) {
    const jump = useJump();
    return (
        <>
            {data.map((item, index) => {
                let height = item?.content.length > 18 ? px(190) : px(168);
                return (
                    <BoxShadow setting={{...shadow, height}} key={index}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                jump(item?.url);
                            }}
                            style={[styles.ques_card, {height}]}>
                            <FastImage
                                style={styles.big_ques}
                                source={require('../../assets/img/article/big_ques.png')}
                            />
                            <Text style={styles.article_content}>{item?.nickname}</Text>
                            <View style={[Style.flexRow, {marginVertical: px(14), alignItems: 'flex-start'}]}>
                                <FastImage
                                    style={styles.ques_img}
                                    source={require('../../assets/img/find/question.png')}
                                />
                                <Text numberOfLines={2} style={styles.article_title}>
                                    {item?.name}
                                </Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={[styles.article_content, {fontSize: px(12)}]}>
                                    <Text style={{color: Colors.defaultColor, fontWeight: '700'}}>魔方回答：</Text>
                                    {item?.content}
                                    <Text style={Style.more}>全文</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </BoxShadow>
                );
            })}
        </>
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
        fontWeight: '700',
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
        // marginBottom: px(12),
    },
});
