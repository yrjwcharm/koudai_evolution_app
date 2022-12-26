/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-06-30 10:11:07
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-23 15:45:47
 * @Description: 传统风险测评
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {deviceHeight, px as text} from '../../utils/appUtil';
import http from '../../services';
import {Modal} from '../../components/Modal';
import Toast from '../../components/Toast';

const Questionnaire = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {fr, fund_code = '', plan_id = '', append = ''} = route.params;
    const summaryIdRef = useRef('');
    const questionnaireRef = useRef('');
    const upidRef = useRef('');
    const startTimeRef = useRef('');
    const endTimeRef = useRef('');
    const [current, setCurrent] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tips, setTips] = useState('');
    const clickRef = useRef(true);

    const init = () => {
        http.get('/questionnaire/start/20210101', {fr, fund_code, plan_id}).then((res) => {
            if (res.code === '000000') {
                summaryIdRef.current = res.result.summary_id;
                getQuestions();
            } else {
                Toast.show(res.message);
            }
        });
    };
    const getQuestions = () => {
        const params = {
            summary_id: summaryIdRef.current,
            questionnaire_cate: questionnaireRef.current,
            fr,
        };
        http.get('/questionnaire/questions/20210101', params).then((res) => {
            if (res.code === '000000') {
                //已经答过的题
                setTips(res.result.tip);
                setQuestions((prev) => prev.concat(res.result.questions));
                startTimeRef.current = Date.now();
                questionnaireRef.current = res.result.questionnaire_cate;
            } else {
                Toast.show(res.message);
            }
        });
    };
    const jumpNext = (item) => {
        if (!clickRef.current) {
            return false;
        }
        clickRef.current = false;
        setAnswers((prev) => {
            const next = [...prev];
            next[current] = item.id;
            return next;
        });
        if (current === questions.length - 1) {
            reportResult(item);
            setTimeout(() => {
                clickRef.current = true;
            }, 1000);
        } else {
            reportResult(item);
            if (Platform.OS === 'android') {
                Vibration.vibrate(100);
            }
            setTimeout(() => {
                setCurrent((prev) => prev + 1);
                startTimeRef.current = Date.now();
                setTimeout(() => {
                    clickRef.current = true;
                }, 500);
            }, 500);
        }
    };
    const reportResult = (option) => {
        endTimeRef.current = Date.now();
        const params = {
            summary_id: summaryIdRef.current,
            action: option.action,
            question_id: questions[current].id,
            option_id: option.id,
            option_val: option.content,
            questionnaire_cate: questionnaireRef.current,
            latency: endTimeRef.current - startTimeRef.current,
            fr,
            append,
        };
        http.post('/questionnaire/report/20210101', params).then((res) => {
            if (res.code === '000000') {
                if (option.action === 'submit') {
                    upidRef.current = res.result.upid;
                    navigation.replace('QuestionnaireResult', {
                        upid: upidRef.current,
                        summary_id: summaryIdRef.current,
                        fr,
                        fund_code,
                        append,
                        plan_id,
                    });
                }
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );
    useEffect(() => {
        const listener = navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') {
                e.preventDefault();
                // Prompt the user before leaving the screen
                Modal.show({
                    title: '结束测评',
                    backButtonClose: false,
                    isTouchMaskToClose: false,
                    content: '确定要结束本次风险测评吗？',
                    confirm: true,
                    confirmCallBack: () => {
                        navigation.dispatch(e.data.action);
                    },
                });
            }
        });
        return () => {
            listener();
        };
    }, []);

    return (
        <ScrollView style={styles.container}>
            {questions.length > 0 ? (
                <>
                    {current === 0 && tips ? (
                        <View style={styles.tipBox}>
                            <Text style={styles.tipText}>{tips}</Text>
                        </View>
                    ) : null}
                    {current > 0 || !tips ? (
                        <View style={styles.progressBar}>
                            <View
                                style={{
                                    backgroundColor: Colors.brandColor,
                                    width: `${((current + 1) / questions.length) * 100}%`,
                                    height: '100%',
                                }}
                            />
                        </View>
                    ) : null}
                    <Text style={styles.title}>{questions[current]?.risk_title}</Text>
                    <View style={{paddingHorizontal: Space.padding}}>
                        <View style={[Style.flexRow, styles.curStyle]}>
                            <Text style={styles.current}>{current + 1}</Text>
                            <Text style={styles.total}>/ {questions.length}</Text>
                        </View>
                        <Text style={styles.questionTitle}>{questions[current]?.name}</Text>
                        <View style={{paddingBottom: '10%'}}>
                            {questions[current] &&
                                questions[current].options.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            key={item + index}
                                            style={[
                                                styles.optionItem,
                                                answers[current] === item.id ? styles.acOption : {},
                                                index === 0 ? {marginTop: text(24)} : {},
                                            ]}
                                            onPress={() => jumpNext(item)}>
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    {
                                                        color:
                                                            answers[current] === item.id
                                                                ? Colors.brandColor
                                                                : Colors.defaultColor,
                                                        fontWeight: answers[current] === item.id ? '500' : '400',
                                                    },
                                                ]}>
                                                {item.content}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            {current !== 0 && (
                                <View style={[Style.flexRow, {marginTop: text(24)}]}>
                                    <Text
                                        style={styles.preBtn}
                                        onPress={() => {
                                            setCurrent((prev) => prev - 1);
                                            startTimeRef.current = Date.now();
                                        }}>
                                        {'上一题'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </>
            ) : (
                <View style={[Style.flexCenter, {height: deviceHeight}]}>
                    <ActivityIndicator color={Colors.brandColor} />
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
    title: {
        fontSize: text(14),
        lineHeight: text(20),
        color: Colors.lightGrayColor,
        padding: text(16),
        paddingBottom: 0,
    },
    tipBox: {
        paddingVertical: text(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    tipText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#EB7121',
    },
    progressBar: {
        backgroundColor: '#D8D8D8',
        height: text(6),
    },
    curStyle: {
        paddingTop: text(24),
        paddingBottom: text(8),
        alignItems: 'flex-end',
    },
    current: {
        fontSize: text(40),
        lineHeight: text(47),
        color: Colors.brandColor,
        fontFamily: Font.numFontFamily,
    },
    total: {
        fontSize: text(20),
        lineHeight: text(24),
        color: Colors.lightGrayColor,
        fontFamily: Font.numFontFamily,
        marginBottom: text(6),
        marginLeft: text(4),
    },
    questionTitle: {
        fontSize: text(20),
        lineHeight: text(28),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    optionItem: {
        marginTop: text(12),
        paddingVertical: text(26),
        paddingHorizontal: text(20),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        borderWidth: text(1),
        borderColor: '#fff',
    },
    acOption: {
        borderColor: Colors.brandColor,
    },
    optionText: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
    },
    preBtn: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.lightGrayColor,
    },
});

export default Questionnaire;
