/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-06-30 10:11:07
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-22 16:51:07
 * @Description: 私募风险测评
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {deviceHeight, isIphoneX, px} from '../../utils/appUtil';
import http from '../../services';
import HTML from '../../components/RenderHtml';
import {Modal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {debounce} from 'lodash';

const PEQuestionnaire = () => {
    const headerHeight = useHeaderHeight();
    const navigation = useNavigation();
    const route = useRoute();
    const summaryIdRef = useRef('');
    const questionnaireRef = useRef('');
    const upidRef = useRef('');
    const startTimeRef = useRef('');
    const endTimeRef = useRef('');
    const [current, setCurrent] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tips, setTips] = useState('');
    const [endTips, setEndTips] = useState('');
    const listener = useRef();

    const init = () => {
        http.get('/questionnaire/start/20210101', {plan_id: route.params?.plan_id, fr: route.params?.fr}).then(
            (res) => {
                if (res.code === '000000') {
                    navigation.setOptions({title: res.result.title || '风险测评'});
                    summaryIdRef.current = res.result.summary_id;
                    getQuestions();
                } else {
                    Toast.show(res.message);
                }
            }
        );
    };
    const getQuestions = () => {
        const params = {
            summary_id: summaryIdRef.current,
            questionnaire_cate: questionnaireRef.current,
            fr: route.params?.fr,
        };
        http.get('/questionnaire/questions/20210101', params).then((res) => {
            if (res.code === '000000') {
                if (res.result.pop) {
                    const {
                        button: {text: btnText},
                        content,
                        title,
                    } = res.result.pop;
                    Modal.show({
                        title,
                        content,
                        confirmText: btnText,
                        confirmTextColor: '#D7AF74',
                        isTouchMaskToClose: false,
                        onCloseCallBack: () => {
                            listener.current?.();
                            setTimeout(() => {
                                navigation.goBack();
                            });
                        },
                    });
                }
                setTips(res.result.tip);
                setEndTips(res.result.endTip);
                setQuestions((prev) => prev.concat(res.result.questions));
                startTimeRef.current = Date.now();
                questionnaireRef.current = res.result.questionnaire_cate;
            } else {
                Toast.show(res.message);
            }
        });
    };
    const jumpNext = useCallback(
        debounce(
            (item) => {
                setAnswers((prev) => {
                    const next = [...prev];
                    next[current] = item.id;
                    return next;
                });
                if (current === questions.length - 1) {
                    reportResult(item);
                } else {
                    reportResult(item);
                    if (Platform.OS === 'android') {
                        Vibration.vibrate(100);
                    }
                    setTimeout(() => {
                        setCurrent((prev) => prev + 1);
                        startTimeRef.current = Date.now();
                    }, 500);
                }
            },
            1000,
            {leading: true, trailing: false}
        ),
        [current, questions]
    );
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
            fr: route.params?.fr,
        };
        http.post('/questionnaire/report/20210101', params).then((res) => {
            if (res.code === '000000') {
                if (option.action === 'submit') {
                    upidRef.current = res.result.upid;
                    navigation.replace('PEQuestionnaireResult', {
                        upid: upidRef.current,
                        summary_id: summaryIdRef.current,
                        fr: route.params?.fr,
                    });
                }
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            const fun = () => true;
            if (route.params.fr === 'private_index_risk') {
                navigation.setOptions({gestureEnabled: false, headerLeft: () => null});
                BackHandler.addEventListener('hardwareBackPress', fun);
            }
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', fun);
            };
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );
    useEffect(() => {
        listener.current = navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') {
                e.preventDefault();
                // Prompt the user before leaving the screen
                Modal.show({
                    title: '结束测评',
                    backButtonClose: false,
                    content: '确定要结束本次风险测评吗？',
                    confirm: true,
                    confirmCallBack: () => {
                        navigation.dispatch(e.data.action);
                    },
                    confirmTextColor: '#D7AF74',
                    isTouchMaskToClose: false,
                });
            }
        });
        return () => {
            listener.current?.();
        };
    }, [navigation, route]);

    return (
        <ScrollView bounces={false} style={styles.container}>
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
                                    backgroundColor: '#D7AF74',
                                    width: `${((current + 1) / questions.length) * 100}%`,
                                    height: '100%',
                                }}
                            />
                        </View>
                    ) : null}
                    <View style={{paddingHorizontal: Space.padding}}>
                        <View style={[Style.flexRow, styles.curStyle]}>
                            <Text style={styles.current}>{current + 1}</Text>
                            <Text style={styles.total}>/ {questions.length}</Text>
                        </View>
                        <Text style={styles.questionTitle}>{questions[current]?.name}</Text>
                        <View style={{paddingBottom: isIphoneX() ? 34 : px(20)}}>
                            {questions[current] &&
                                questions[current].options.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            key={item + index}
                                            style={[
                                                styles.optionItem,
                                                answers[current] === item.id ? styles.acOption : {},
                                                index === 0 ? {marginTop: px(24)} : {},
                                            ]}
                                            onPress={() => jumpNext(item)}>
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    answers[current] === item.id ? styles.acOptionText : {},
                                                ]}>
                                                {item.content}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            {current !== 0 && (
                                <View style={[Style.flexRow, {marginTop: px(24)}]}>
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
                            {current === questions.length - 1 && endTips ? (
                                <View style={{marginTop: px(24)}}>
                                    <HTML html={endTips} style={styles.endTips} />
                                </View>
                            ) : null}
                        </View>
                    </View>
                </>
            ) : (
                <View style={[Style.flexCenter, {height: deviceHeight - headerHeight}]}>
                    <ActivityIndicator color={'#D7AF74'} />
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
    tipBox: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    tipText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#EB7121',
    },
    progressBar: {
        backgroundColor: 'transparent',
        height: px(6),
    },
    curStyle: {
        paddingTop: px(24),
        paddingBottom: px(8),
        alignItems: 'flex-end',
    },
    current: {
        fontSize: px(40),
        lineHeight: px(47),
        color: '#D7AF74',
        fontFamily: Font.numFontFamily,
    },
    total: {
        fontSize: px(20),
        lineHeight: px(24),
        color: Colors.lightGrayColor,
        fontFamily: Font.numFontFamily,
        marginBottom: px(6),
        marginLeft: px(4),
    },
    questionTitle: {
        fontSize: px(20),
        lineHeight: px(28),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    optionItem: {
        marginTop: px(12),
        paddingVertical: px(26),
        paddingHorizontal: px(20),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        borderWidth: px(1),
        borderColor: '#fff',
    },
    acOption: {
        borderColor: '#D7AF74',
    },
    optionText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
    },
    acOptionText: {
        color: '#D7AF74',
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    preBtn: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightGrayColor,
    },
    endTips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
});

export default PEQuestionnaire;
