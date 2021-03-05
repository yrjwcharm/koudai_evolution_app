/*
 * @Date: 2021-03-03 11:03:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-03 14:09:12
 * @Description: 答题提现
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';

const QuestionWithdraw = ({navigation}) => {
    const [data, setData] = useState({
        current: 1,
        total: 2,
        caption: '购买了理财魔方的基金组合后应该如何操作?',
        options: [
            {
                key: 1,
                val: '自己观察市场行情进行赎回或者购买',
            },
            {
                key: 2,
                val: '每天观察组合收益情况，跌了就清仓止损',
            },
            {
                key: 3,
                val: '不需要管. 等待人工智能系统发出调仓信号.收到通知后进行”一键调仓”',
            },
        ],
    });
    const [answer, setAnswer] = useState([]);

    const handleAnswer = useCallback((item) => {
        setAnswer([item.key]);
    }, []);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.noticeBox}>
                <Text style={styles.notice}>
                    {'恭喜您，完成了提现任务，接下来花30s的时间回答下面的问题就可以进行体验金收益的提现啦!'}
                </Text>
            </View>
            <View style={{paddingHorizontal: text(14)}}>
                <View style={[Style.flexRow, {alignItems: 'flex-end', marginBottom: text(8)}]}>
                    <Text style={styles.current}>{data.current}</Text>
                    <Text style={[styles.total, {marginBottom: text(6)}]}>/ {data.total}</Text>
                </View>
                <Text style={styles.cardTitle}>{data.caption}</Text>
                {data.options?.length > 0 &&
                    data.options.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={index + 'item'}
                                style={[
                                    styles.cardList,
                                    {
                                        borderColor: answer.indexOf(item.key) >= 0 ? '#D4AC6F' : '#EEF0F6',
                                    },
                                ]}
                                onPress={() => handleAnswer(item)}>
                                <Text
                                    style={[
                                        styles.cardText,
                                        {
                                            fontWeight: answer.indexOf(item.key) >= 0 ? '500' : '400',
                                            color: answer.indexOf(item.key) >= 0 ? '#C7964B' : '#262626',
                                        },
                                    ]}>
                                    {item.val}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    noticeBox: {
        marginBottom: text(24),
        paddingVertical: text(12),
        paddingHorizontal: text(14),
        backgroundColor: '#FEF6E9',
    },
    notice: {
        fontSize: Font.textH2,
        lineHeight: text(22),
        color: '#A0793E',
    },
    current: {
        fontSize: text(42),
        lineHeight: text(48),
        color: '#D4AC6F',
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    total: {
        fontSize: text(16),
        lineHeight: text(19),
        color: '#999',
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    cardTitle: {
        marginBottom: text(4),
        fontSize: text(22),
        lineHeight: text(30),
        color: '#333',
        fontWeight: '600',
    },
    cardList: {
        paddingVertical: text(26),
        paddingHorizontal: text(14),
        backgroundColor: '#fff',
        marginTop: Space.marginVertical,
        borderRadius: text(6),
        borderColor: '#EEF0F6',
        borderWidth: Space.borderWidth,
    },
    cardText: {
        fontSize: text(15),
        lineHeight: text(21),
        color: '#333',
    },
});

export default QuestionWithdraw;
