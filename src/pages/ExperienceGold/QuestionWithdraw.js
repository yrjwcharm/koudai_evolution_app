/*
 * @Date: 2021-03-03 11:03:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-25 20:30:11
 * @Description: 答题提现
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';

const QuestionWithdraw = ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [answer, setAnswer] = useState([]);
    const [current, setCurrent] = useState(0);

    const handleAnswer = useCallback(
        (item) => {
            global.LogTool('click', 'answer', item.name);
            setAnswer([item]);
            if (item.val === 1) {
                setTimeout(() => {
                    setCurrent((prev) => {
                        if (prev + 1 === 2) {
                            setTimeout(() => {
                                jump(data.jump_url, 'replace');
                            }, 0);
                            return prev;
                        } else {
                            return prev + 1;
                        }
                    });
                }, 300);
            } else {
                Toast.show('答案错误');
                setTimeout(() => {
                    setAnswer([]);
                }, 2000);
            }
        },
        [data, jump]
    );

    useEffect(() => {
        http.get('/freefund/cash_out/20210101').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '答题提现'});
                setData(res.result);
            }
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.noticeBox}>
                <Text style={styles.notice}>{data?.wenda_message}</Text>
            </View>
            {Object.keys(data).length > 0 && (
                <View style={{paddingHorizontal: text(14)}}>
                    <View style={[Style.flexRow, {alignItems: 'flex-end', marginBottom: text(8)}]}>
                        <Text style={styles.current}>{data?.wenda_form[current]?.number}</Text>
                        <Text style={[styles.total, {marginBottom: text(6)}]}>
                            / {data?.wenda_form[current]?.total}
                        </Text>
                    </View>
                    <Text style={styles.cardTitle}>{data?.wenda_form[current]?.title}</Text>
                    {data?.wenda_form[current]?.items?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={index + 'item'}
                                style={[
                                    styles.cardList,
                                    {
                                        borderColor: answer.some((i) => i.name === item.name)
                                            ? answer[0].val === 1
                                                ? '#D4AC6F'
                                                : Colors.red
                                            : '#EEF0F6',
                                    },
                                ]}
                                onPress={() => handleAnswer(item)}>
                                <Text
                                    style={[
                                        styles.cardText,
                                        {
                                            fontWeight: answer.some((i) => i.name === item.name) ? '500' : '400',
                                            color: answer.some((i) => i.name === item.name)
                                                ? answer[0].val === 1
                                                    ? '#C7964B'
                                                    : Colors.red
                                                : '#262626',
                                        },
                                    ]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
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
