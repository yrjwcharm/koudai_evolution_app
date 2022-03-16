/*
 * @Date: 2022-03-15 17:15:29
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-03-16 14:26:28
 * @Description: 理性等级升级
 */
import React, {useEffect, useReducer, useRef} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {Modal} from '../../components/Modal';
import http from '../../services';
import {px, isIphoneX} from '../../utils/appUtil';

function reducer(state, action) {
    switch (action.type) {
        case 'setData':
            return {...action.payload};
        case 'setChosen':
            return {
                ...state,
                chosen: action.payload,
            };
        case 'toggleShowAnswer':
            return {
                ...state,
                showAnswer: !state.showAnswer,
            };
        default:
            throw new Error();
    }
}

export default ({navigation}) => {
    const listener = useRef();
    const [data, dispatch] = useReducer(reducer, {
        chosen: '',
        showAnswer: false,
        options: [
            {
                index: 'A',
                content: '不低于300万元或者最近3年个人年均收入不低于50万元的个人',
            },
            {
                index: 'B',
                content: '不低于300万元或者最近3年个人年均收入不低于50万元的个人',
            },
            {
                index: 'C',
                content: '不低于300万元或者最近3年个人年均收入不低于50万元的个人',
            },
            {
                index: 'D',
                content: '不低于300万元或者最近3年个人年均收入不低于50万元的个人',
            },
        ],
        answer: 'A',
    });
    const {answer, chosen, options, showAnswer} = data;

    useEffect(() => {
        listener.current = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            // Prompt the user before leaving the screen
            Modal.show({
                title: '放弃升级',
                content: '确定要放弃本次升级吗？',
                confirm: true,
                confirmCallBack: () => {
                    navigation.dispatch(e.data.action);
                },
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView bounces={false} style={{flex: 1}}>
                <View style={styles.contentCon}>
                    <View style={styles.topicCon}>
                        <Text style={styles.topicIndex}>
                            <Text style={{color: Colors.brandColor}}>{1}</Text>
                            {` / ${9}`}
                        </Text>
                        <Text style={styles.topicText}>
                            {
                                '非公开募集基金应当向合格投资者募集，合格投资者累计不得超过200人。合格投资者是指具备相应风险识别和承担能力，投资于单只私募基金的金额不低于100万元且符合下列相关标准的单位和个人：①净资产不低于1000万元的单位；②金融资产（  ）。'
                            }
                        </Text>
                    </View>
                    {options.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={showAnswer ? 1 : 0.8}
                                key={item + index}
                                onPress={() => !showAnswer && dispatch({payload: item.index, type: 'setChosen'})}
                                style={[
                                    Style.flexRow,
                                    styles.optionCon,
                                    chosen === item.index ? {borderColor: Colors.brandColor} : {},
                                    showAnswer && item.index === answer ? {borderColor: Colors.green} : {},
                                    showAnswer && chosen === item.index && item.index !== answer
                                        ? {borderColor: Colors.red}
                                        : {},
                                ]}>
                                {showAnswer && item.index === answer ? (
                                    <Image
                                        source={require('../../assets/img/vision/correct.png')}
                                        style={styles.statusIcon}
                                    />
                                ) : showAnswer && chosen === item.index && item.index !== answer ? (
                                    <Image
                                        source={require('../../assets/img/vision/error.png')}
                                        style={styles.statusIcon}
                                    />
                                ) : (
                                    <View
                                        style={[
                                            Style.flexCenter,
                                            styles.optionIndexCon,
                                            chosen === item.index ? {backgroundColor: Colors.brandColor} : {},
                                        ]}>
                                        <Text
                                            style={[
                                                styles.optionIndexText,
                                                chosen === item.index ? {color: '#fff'} : {},
                                            ]}>
                                            {item.index}
                                        </Text>
                                    </View>
                                )}
                                <Text
                                    style={[
                                        styles.optionText,
                                        chosen === item.index ? {color: Colors.brandColor} : {},
                                        showAnswer && item.index === answer ? {color: Colors.green} : {},
                                        showAnswer && chosen === item.index && item.index !== answer
                                            ? {color: Colors.defaultColor}
                                            : {},
                                    ]}>
                                    {item.content}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    {showAnswer && (
                        <>
                            <View style={[styles.answerCon, {marginTop: px(28)}]}>
                                <Text style={styles.answerText}>
                                    我的选项：
                                    <Text style={{color: chosen === answer ? Colors.green : Colors.red}}>{chosen}</Text>
                                </Text>
                            </View>
                            <View style={styles.answerCon}>
                                <Text style={styles.answerText}>正确选项：{'A'}</Text>
                            </View>
                            <View style={[Style.flexRow, {marginTop: px(28)}]}>
                                <View style={styles.bar} />
                                <Text style={styles.answerText}>问题解析：</Text>
                            </View>
                            <Text style={styles.answerAnalysis}>
                                {
                                    '非公开募集基金应当向合格投资者募集，合格投资者累计不得超过200人。合格投资者是指具备相应风险识别和承担能力，投资于单只私募基金的金额不低于100万元且符合下列相关标准的单位和个人：①净资产不低于1000万元的单位；\n②金融资产不低于300万元或者最近3年个人年均收入不低于50万元的个人，金融资产包括银行存款、股票、债券、基金份额、资产管理计划、银行理财产品、信托计划、保险产品、期货权益等。'
                                }
                            </Text>
                        </>
                    )}
                </View>
            </ScrollView>
            <Button
                disabled={!chosen}
                onPress={() => dispatch({type: 'toggleShowAnswer'})}
                style={styles.btn}
                title="提交答案"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    contentCon: {
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 + px(44) : px(56),
    },
    topicCon: {
        paddingTop: px(12),
        paddingHorizontal: px(4),
        paddingBottom: px(8),
    },
    topicIndex: {
        fontSize: px(18),
        lineHeight: px(20),
        color: Colors.lightGrayColor,
        fontFamily: Font.numFontFamily,
    },
    topicText: {
        marginTop: px(8),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    optionCon: {
        marginTop: px(12),
        paddingVertical: Space.padding,
        paddingHorizontal: px(12),
        borderWidth: px(1),
        borderColor: '#fff',
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
    optionIndexCon: {
        marginRight: px(8),
        borderRadius: px(20),
        backgroundColor: Colors.bgColor,
        width: px(20),
        height: px(20),
    },
    optionIndexText: {
        fontSize: px(13),
        lineHeight: px(13),
        color: Colors.defaultColor,
    },
    optionText: {
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.defaultColor,
        flex: 1,
    },
    statusIcon: {
        marginRight: px(8),
        width: px(20),
        height: px(20),
    },
    answerCon: {
        marginTop: px(12),
        paddingVertical: px(7),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#E9EAEF',
    },
    answerText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    bar: {
        marginRight: px(8),
        width: px(4),
        height: px(16),
        backgroundColor: Colors.brandColor,
    },
    answerAnalysis: {
        marginTop: px(12),
        marginBottom: px(32),
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.descColor,
    },
    btn: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(12),
        left: px(16),
    },
});
