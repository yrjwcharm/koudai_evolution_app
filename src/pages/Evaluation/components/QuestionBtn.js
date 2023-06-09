/*
 * @Date: 2021-03-02 14:31:45
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-06-15 11:57:40
 * @Description:答题按钮
 */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Style, Colors} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
export default function QuestionBtn(props) {
    const {button, onPress, style, textStyle} = props;
    return (
        <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            <Animatable.View animation="fadeInRight" style={[styles.question_con]}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onPress}
                    style={[styles.ques_btn, Style.flexCenter, style]}>
                    <Text style={[styles.btn_text, textStyle, {backgroundColor: 'transparent'}]}>
                        {button?.text || '查看详情'}
                    </Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}
const styles = StyleSheet.create({
    ques_btn: {
        borderRadius: px(19),
        borderWidth: 1,
        borderColor: Colors.btnColor,
        paddingVertical: px(9),
        paddingHorizontal: px(24),
        minWidth: px(126),
        marginBottom: px(12),
        marginRight: px(16),
    },
    btn_text: {
        fontSize: px(13),
        color: Colors.btnColor,
        backgroundColor: 'transparent',
    },
});
