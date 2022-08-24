/*
 * @Date: 2022-07-12 10:18:55
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {px} from '../../utils/appUtil';
import {Colors} from '../../common/commonStyle';
const SmButton = ({title, style, titleStyle, onPress}) => {
    return (
        <TouchableOpacity style={[styles.pkBtn, style]} onPress={onPress} activeOpacity={0.8}>
            <Text style={{fontSize: px(13), lineHeight: px(18), color: Colors.btnColor, ...titleStyle}}>{title}</Text>
        </TouchableOpacity>
    );
};

export default SmButton;

const styles = StyleSheet.create({
    pkBtn: {
        borderRadius: px(103),
        borderColor: Colors.btnColor,
        borderWidth: 0.5,
        paddingHorizontal: px(10),
        paddingVertical: px(4),
        paddingTop: px(3),
    },
});
