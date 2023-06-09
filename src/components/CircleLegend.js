/*
 * @Author: xjh
 * @Date: 2021-03-29 17:35:00
 * @Description:
 * @LastEditors: dx
 * @LastEditTime: 2021-04-30 10:14:23
 */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {px as text} from '../utils/appUtil';

export default function CircleLegend(props) {
    const {color} = props;
    return (
        <View style={[styles.circle_black, {backgroundColor: color[0]}]}>
            <View style={[styles.circle_inner_black, {backgroundColor: color[1]}]} />
        </View>
    );
}
const styles = StyleSheet.create({
    circle_black: {
        backgroundColor: '#E8EAEF',
        width: text(12),
        height: text(12),
        borderRadius: text(25),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: text(2),
    },
    circle_inner_black: {
        backgroundColor: '#545968',
        width: text(5),
        height: text(5),
        borderRadius: text(25),
    },
});
