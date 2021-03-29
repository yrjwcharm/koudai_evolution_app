/*
 * @Author: xjh
 * @Date: 2021-03-29 17:35:00
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-29 17:46:28
 */
import React from 'react';
import {View, StyleSheet, DynamicColorIOS} from 'react-native';
import {px as text} from '../utils/appUtil';

export default function CircleLegend(props) {
    const {color} = props;
    console.log(DynamicColorIOS);
    return (
        <View style={[styles.circle_black, {backgroundColor: color[0]}]}>
            <View style={[styles.circle_inner_black, {backgroundColor: color[1]}]}></View>
        </View>
    );
}
const styles = StyleSheet.create({
    circle_black: {
        backgroundColor: '#E8EAEF',
        width: text(10),
        height: text(10),
        borderRadius: text(25),
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle_inner_black: {
        backgroundColor: '#545968',
        width: text(5),
        height: text(5),
        borderRadius: text(25),
    },
});
