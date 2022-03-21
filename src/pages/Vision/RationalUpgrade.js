/*
 * @Date: 2022-03-15 17:15:29
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-03-21 17:43:43
 * @Description: 理性等级升级
 */
import React, {useEffect, useReducer, useRef} from 'react';
import {Modal as ModalContainer, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import http from '../../services';
import {px, isIphoneX, deviceWidth, deviceHeight} from '../../utils/appUtil';

const initData = {
    btn: '提交答案',
    chosen: {},
    current: 0,
    showAnswer: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setData':
            return {
                ...action.payload,
                ...initData,
            };
        case 'setBtn':
            return {
                ...state,
                btn: action.payload,
            };
        case 'setChosen':
            return {
                ...state,
                chosen: action.payload,
            };
        case 'setCurrent':
            return {
                ...state,
                current: action.payload,
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

export default ({navigation, route}) => {
    const jump = useJump();
    const listener = useRef();
    const [data, dispatch] = useReducer(reducer, initData);
    const {all_count = 9, btn, chosen, current, question_list = [], showAnswer, summary_id = 0} = data;
    const {chosenId, chosenIndex} = chosen; // 选中的选项ID和索引
    const question = question_list[current] || {};
    const {
        cate_id = 0,
        now_count = 1,
        options = [],
        question_analysis = '',
        question_answer_id: answer = '',
        question_content = '',
        id: question_id = '',
    } = question; // 当前题目
    const timeRef = useRef();

    // 获取题目
    const getQuestions = (id) => {
        http.get('/rational/grade/questions/20220317', {summary_id: id}).then((res) => {
            if (res.code === '000000') {
                dispatch({payload: res.result, type: 'setData'});
                timeRef.current = Date.now();
            }
        });
    };

    // 点击弹窗按钮
    const pressModalBtn = (button) => {
        Modal.close({});
        if (button.action === 'reset') {
            getQuestions(0);
        } else {
            listener.current?.();
            setTimeout(() => {
                if (button.action === 'jump') {
                    jump(button.url);
                } else if (button.action === 'back') {
                    navigation.goBack();
                }
            });
        }
    };

    // 结果弹窗
    const showModal = (popup) => {
        const {cancel, confirm, grade, image, prefix, status, suffix} = popup;
        global.LogTool(
            route.params.scene === 'grade' ? 'evaluationresults' : 'testpage',
            status === 1 ? 'success' : 'fail'
        );
        Modal.showCustomModal(
            <ModalContainer animationType="fade" onRequestClose={(a) => a} transparent visible>
                <View style={[Style.flexCenter, styles.modalContainer]}>
                    <TouchableOpacity activeOpacity={1} style={styles.modalMask} />
                    <View style={Style.flexCenter}>
                        <Image source={{uri: image}} style={styles.modalImage} />
                        <View style={[Style.flexRowCenter, styles.modalTips]}>
                            <Text style={styles.modalTipsText}>{prefix}</Text>
                            <Text style={styles.modalLevel}>{grade}</Text>
                            <Text style={styles.modalTipsText}>{suffix}</Text>
                        </View>
                        <View style={[Style.flexRowCenter, styles.modalBtns]}>
                            {cancel ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => pressModalBtn(cancel)}
                                    style={[Style.flexCenter, styles.modalBtn]}>
                                    <Text style={styles.modalBtnText}>{cancel.text}</Text>
                                </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => pressModalBtn(confirm)}
                                style={[Style.flexCenter, styles.modalBtn, {backgroundColor: '#fff'}]}>
                                <Text style={{...styles.modalBtnText, color: Colors.defaultColor}}>{confirm.text}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ModalContainer>
        );
    };

    // 上报用户选项
    const reportAnswer = async (last) => {
        const time = Date.now();
        http.post('/rational/grade/answer/20220317', {
            cate_id,
            during_time: time - timeRef.current,
            question_id,
            summary_id,
            user_option: chosenId,
        }).then((res) => {
            if (res.code === '000000') {
                if (last) {
                    showModal(res.result);
                }
            }
        });
        timeRef.current = time;
    };

    // 下一题/完成答题
    const onNext = async () => {
        if (!showAnswer) {
            dispatch({type: 'toggleShowAnswer'});
            if (now_count === all_count) {
                dispatch({payload: '完成答题，开始评估', type: 'setBtn'});
            } else {
                dispatch({payload: '进入下一题', type: 'setBtn'});
            }
        } else {
            if (now_count === all_count) {
                return reportAnswer(true);
            }
            await reportAnswer();
            if (current === question_list.length - 1) {
                getQuestions(summary_id);
            } else {
                dispatch({payload: '提交答案', type: 'setBtn'});
                dispatch({payload: {}, type: 'setChosen'});
                dispatch({payload: current + 1, type: 'setCurrent'});
                dispatch({type: 'toggleShowAnswer'});
            }
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);

    useEffect(() => {
        listener.current = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            // Prompt the user before leaving the screen
            Modal.show({
                backButtonClose: false,
                isTouchMaskToClose: false,
                title: route.params.scene === 'grade' ? '放弃评估' : '放弃升级',
                content: `确定放弃本次${route.params.scene === 'grade' ? '评估' : '升级'}么？`,
                confirm: true,
                confirmCallBack: () => {
                    navigation.dispatch(e.data.action);
                },
            });
        });
        return () => {
            listener.current?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView bounces={false} style={{flex: 1}}>
                <View style={styles.contentCon}>
                    <View style={styles.topicCon}>
                        <Text style={styles.topicIndex}>
                            <Text style={{color: Colors.brandColor}}>{now_count}</Text>
                            {` / ${all_count}`}
                        </Text>
                        <Text style={styles.topicText}>{question_content}</Text>
                    </View>
                    {options?.map?.((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={showAnswer ? 1 : 0.8}
                                disabled={showAnswer}
                                key={item + index}
                                onPress={() =>
                                    dispatch({
                                        payload: {chosenId: item.id, chosenIndex: String.fromCharCode(index + 65)},
                                        type: 'setChosen',
                                    })
                                }
                                style={[
                                    Style.flexRow,
                                    styles.optionCon,
                                    chosenId === item.id ? {borderColor: Colors.brandColor} : {},
                                    showAnswer && item.id === answer ? {borderColor: Colors.green} : {},
                                    showAnswer && chosenId === item.id && item.id !== answer
                                        ? {borderColor: Colors.red}
                                        : {},
                                ]}>
                                {showAnswer && item.id === answer ? (
                                    <Image
                                        source={require('../../assets/img/vision/correct.png')}
                                        style={styles.statusIcon}
                                    />
                                ) : showAnswer && chosenId === item.id && item.id !== answer ? (
                                    <Image
                                        source={require('../../assets/img/vision/error.png')}
                                        style={styles.statusIcon}
                                    />
                                ) : (
                                    <View
                                        style={[
                                            Style.flexCenter,
                                            styles.optionIndexCon,
                                            chosenId === item.id ? {backgroundColor: Colors.brandColor} : {},
                                        ]}>
                                        <Text
                                            style={[
                                                styles.optionIndexText,
                                                chosenId === item.id ? {color: '#fff'} : {},
                                            ]}>
                                            {String.fromCharCode(index + 65)}
                                        </Text>
                                    </View>
                                )}
                                <Text
                                    style={[
                                        styles.optionText,
                                        chosenId === item.id ? {color: Colors.brandColor} : {},
                                        showAnswer && item.id === answer ? {color: Colors.green} : {},
                                        showAnswer && chosenId === item.id && item.id !== answer
                                            ? {color: Colors.defaultColor}
                                            : {},
                                    ]}>
                                    {item.option_content}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    {showAnswer && (
                        <>
                            <View style={[styles.answerCon, {marginTop: px(28)}]}>
                                <Text style={styles.answerText}>
                                    我的选项：
                                    <Text style={{color: chosenId === answer ? Colors.green : Colors.red}}>
                                        {chosenIndex}
                                    </Text>
                                </Text>
                            </View>
                            <View style={styles.answerCon}>
                                <Text style={styles.answerText}>
                                    正确选项：
                                    {String.fromCharCode(options.findIndex((item) => item.id === answer) + 65)}
                                </Text>
                            </View>
                            <View style={[Style.flexRow, {marginTop: px(28)}]}>
                                <View style={styles.bar} />
                                <Text style={styles.answerText}>问题解析：</Text>
                            </View>
                            <Text style={styles.answerAnalysis}>{question_analysis}</Text>
                        </>
                    )}
                </View>
            </ScrollView>
            <Button disabled={!chosenId} onPress={onNext} style={styles.btn} title={btn} />
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
    modalContainer: {
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    modalImage: {
        width: px(250),
        height: px(250),
    },
    modalTips: {
        marginTop: px(-28),
    },
    modalTipsText: {
        fontSize: px(20),
        lineHeight: px(28),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    modalLevel: {
        fontSize: px(44),
        lineHeight: px(44),
        color: '#FFCE51',
        fontFamily: Font.numFontFamily,
    },
    modalBtns: {
        marginTop: px(20),
    },
    modalBtn: {
        marginHorizontal: px(4),
        width: px(124),
        height: px(44),
        borderWidth: px(1),
        borderColor: '#fff',
        borderRadius: px(22),
    },
    modalBtnText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
});
