/*
 * @Date: 2022-11-10 16:09:15
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-14 20:02:37
 * @FilePath: /koudai_evolution_app/src/pages/Special/QuestionModal.js
 * @Description:
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {constants} from '~/components/Modal/util';
import {BottomModal} from '~/components/Modal';
import {useRef, useState} from 'react/cjs/react.development';
import {Colors, Font, Style} from '~/common/commonStyle';
import {deviceHeight, deviceWidth, isIphoneX, px} from '~/utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';


function AnswerItem({item, ans, ...other}) {
  const selected = item.answer === ans
  return (
    <TouchableOpacity style={[styles.answerItem, selected && styles.answerItem_selected]} {...other} >
        <Text style={[styles.answerTitle, selected && styles.answerTitle_selected]}>{ans}</Text>
    </TouchableOpacity>
  )
}


function QuestionModal(props, ref) {
    const [params, setParams] = useState({});
    const modal = useRef(null);
    const show = (config) => {
        setParams(config);
        modal.current.show();
    };
    const hide = () => {
        modal.current?.hide?.();
    };
    const handleAnswer = (question, answer) => {
      question.answer = answer
      setParams({
        ...params,
        questions: [...params.questions],
      })
    } 
    const handleSure = () => {
      props.onSure(params)
    } 
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
            header={
                <View style={[styles.header]}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.title}>调整你的投资需求</Text>
                    </View>
                    <TouchableOpacity style={styles.close} onPress={props.onClose}>
                        <Icon color={Colors.descColor} name={'close'} size={18} />
                    </TouchableOpacity>
                </View>
            }>
            <>
                <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 30}}>
                    {(questions || []).map((item) => (
                        <View style={styles.questionItem}>
                            <Text style={styles.questionTitle}>{item.question}</Text>
                            <View style={styles.answerWrap}>
                                {(item.answerList || []).map((ans, index) => (
                                    <>
                                        {index % 2 === 1 && <View style={{width: 10, height: 1}} />}
                                       <AnswerItem item={item} ans={ans} key={ans} onPress={()=>handleAnswer(item, ans)} />
                                        
                                    </>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.btn} onPress={handleSure}>
                    <Text style={styles.btn_text}>确定</Text>
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
        height: deviceHeight * 0.6,
        maxHeight: 500,
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
    answerTitle: {
        fontSize: px(12),
        color: Colors.defaultFontColor,
    },
    answerTitle_selected: {
      color: '#0051CC',
      fontWeight: 'bold'
    },
    btn: {
        backgroundColor: '#0051CC',
        height: 40,
        // width: 'auto',
        marginHorizontal: 28,
        borderRadius: 6,
        marginBottom: isIphoneX() ? 34 : 20,

        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text: {
        color: '#fff',
        fontSize: px(14),
    },
});
export default React.forwardRef(QuestionModal);
