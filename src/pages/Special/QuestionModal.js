/*
 * @Date: 2022-11-10 16:09:15
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-17 17:46:20
 * @FilePath: /koudai_evolution_app/src/pages/Special/QuestionModal.js
 * @Description:
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {constants} from '~/components/Modal/util';
import {BottomModal} from '~/components/Modal';
import {useRef, useState} from 'react/cjs/react.development';
import {Colors, Font, Style} from '~/common/commonStyle';
import {deviceHeight, deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import http from '~/services';
import Toast from '~/components/Toast';
import FastImage from 'react-native-fast-image';
import SelectIcon from '~/assets/img/special/select_checked.png';
import {i} from 'mathjs';

console.log('SelectIcon:', SelectIcon);
function AnswerItem({question, ans, index, ...other}) {
    const selected = question.answer_num === ans.num;
    return (
        <TouchableOpacity style={[styles.answerItem, selected && styles.answerItem_selected]} {...other}>
            <Text style={[styles.answerTitle, selected && styles.answerTitle_selected]}>{ans.desc}</Text>

            {selected ? <FastImage source={SelectIcon} style={styles.selectedIcon} /> : null}
        </TouchableOpacity>
    );
}

function QuestionModal(props, ref) {
    const [params, setParams] = useState({});
    const [isLoading, setLoading] = useState(false);
    const modal = useRef(null);
    const itemsY = useRef([]);
    const scrollRef = useRef();
    const show = (config) => {
        if (!config) {
            console.log('QuestionModal show with config is null');
            return;
        }
        // config.questions = [...config.questions, ...config.questions, ...config.questions, ...config.questions];
        // config.questions.forEach((it, index) => {
        //     it.answer_num = null;
        //     it.title += index;
        // });
        setParams(config);
        modal.current.show();
    };
    const hide = () => {
        modal.current?.hide?.();
    };
    const handleAnswer = (question, answer, index) => {
        question.answer_num = answer.num;
        setParams({
            ...params,
            questions: [...params.questions],
        });
    };
    const handleSure = () => {
        const answer = {};
        // 检查是否有没选择的，滚动到该选项
        let emptyIndex = -1;
        params.questions.forEach((q, i) => {
            answer[q.question_num] = q.answer_num;
            if (!q.answer_num) {
                emptyIndex = i;
            }
        });
        if (emptyIndex !== -1) {
            scrollRef.current?.scrollTo({x: 0, y: itemsY[emptyIndex], animated: true});
            return;
        }

        const result = {
            advisor_id: params.advisor_id,
            answer_str: '',
        };

        result.answer_str = JSON.stringify(answer);
        setLoading(true);
        // http.post('http://localhost:3001/kyc/answer/20220901', result)
        http.post('/kyc/answer/20220901', result)
            .then((res) => {
                if (res.code === '000000') {
                    props.onSure();
                } else {
                    Toast.show(res.message);
                }
            })
            .finally((_) => {
                setLoading(false);
            });
    };

    const handleClose = () => {
        //  是否要返回前一页
        props.onClose(params.answered ? false : true);
    };
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });

    const {questions} = params;
    return (
        <BottomModal
            ref={modal}
            isTouchMaskToClose={false}
            header={
                <View style={[styles.header]}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.title}>{params.answer_title}</Text>
                    </View>
                    <TouchableOpacity style={styles.close} onPress={handleClose}>
                        <Icon color={Colors.descColor} name={'close'} size={18} />
                    </TouchableOpacity>
                </View>
            }>
            <>
                <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 30}} ref={scrollRef}>
                    {(questions || []).map((item, i) => (
                        <View style={styles.questionItem} onLayout={({layout: {y}}) => (itemsY[i] = y)}>
                            <Text style={styles.questionTitle}>{item.title}</Text>
                            <View style={styles.answerWrap}>
                                {(item.answer_list || []).map((ans, index) => (
                                    <>
                                        {index % 2 === 1 && <View style={{width: 10, height: 1}} />}
                                        <AnswerItem
                                            question={item}
                                            ans={ans}
                                            key={ans.id}
                                            onPress={() => handleAnswer(item, ans)}
                                        />
                                    </>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.btn} onPress={handleSure}>
                    <ActivityIndicator animating={isLoading} style={{marginLeft: -20}} />
                    <Text style={styles.btn_text}>{params?.answer_button?.text}</Text>
                </TouchableOpacity>
            </>
        </BottomModal>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
        position: 'relative',
    },
    close: {
        width: 60,
        // height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: Font.textH1,
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    content: {
        paddingTop: 4,
        // flex: 1,
        height: 360,
        maxHeight: deviceHeight - 100,
    },
    questionItem: {
        marginTop: 16,
        paddingHorizontal: 28,
    },
    questionTitle: {
        fontSize: px(14),
        color: Colors.defaultFontColor,
    },
    answerWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    answerItem: {
        backgroundColor: '#F5F6F8',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        minWidth: '40%',
        flex: 1,
        marginRight: 10,
        marginTop: 10,
    },
    answerItem_selected: {
        backgroundColor: '#DEE8FF',
    },
    selectedIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 16,
        height: 16,
    },
    answerTitle: {
        fontSize: px(12),
        color: Colors.defaultFontColor,
    },
    answerTitle_selected: {
        color: '#0051CC',
        fontWeight: 'bold',
    },
    btn: {
        backgroundColor: '#0051CC',
        height: 40,
        // width: 'auto',
        marginHorizontal: 28,
        borderRadius: 6,
        marginBottom: isIphoneX() ? 34 : 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        color: '#fff',
        fontSize: px(14),
    },
});
export default React.forwardRef(QuestionModal);
