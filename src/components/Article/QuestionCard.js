/*
 * @Date: 2021-02-04 14:18:38
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-23 12:09:40
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
export default function QuestionCard({data = [], scene}) {
    const jump = useJump();
    const visionData = useSelector((store) => store.vision).toJS();
    return (
        <>
            {data.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.9}
                        onPress={debounce(() => {
                            global.LogTool('visionArticle', item.id);
                            jump(item?.url, scene == 'article' ? 'push' : 'navigate');
                        }, 300)}
                        style={[styles.ques_card]}>
                        <FastImage style={styles.big_ques} source={require('../../assets/img/article/big_ques.png')} />
                        <Text style={styles.article_content}>
                            {item?.phase ? (
                                <Text style={{color: Colors.defaultColor, fontWeight: 'bold'}}>{item?.phase}：</Text>
                            ) : null}
                            {item?.nickname}
                        </Text>
                        <View style={[Style.flexRow, {marginVertical: px(16), alignItems: 'flex-start'}]}>
                            <FastImage style={styles.ques_img} source={require('../../assets/img/find/question.png')} />
                            <Text
                                numberOfLines={2}
                                style={[
                                    styles.article_title,
                                    {
                                        color:
                                            visionData?.readList?.includes(item.id) && scene !== 'collect'
                                                ? Colors.lightBlackColor
                                                : Colors.defaultColor,
                                    },
                                ]}>
                                {item?.name}
                            </Text>
                        </View>
                        <View style={styles.content}>
                            <Text numberOfLines={2} style={[styles.article_content, {fontSize: px(12)}]}>
                                <Text style={{color: Colors.defaultColor, fontWeight: '700'}}>
                                    {item.author_name}：
                                </Text>
                                {item?.content}
                            </Text>
                        </View>
                        {scene == 'collect' ? null : (
                            <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                                <Text style={styles.light_text}>{item?.view_num}人已阅读</Text>
                                <Praise
                                    type={'article'}
                                    comment={{
                                        favor_status: item?.favor_status,
                                        favor_num: parseInt(item?.favor_num),
                                        id: item?.id,
                                    }}
                                />
                            </View>
                        )}
                    </TouchableOpacity>
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
        paddingBottom: px(12),
        marginBottom: px(12),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
});
