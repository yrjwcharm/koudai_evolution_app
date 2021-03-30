/*
 * @Date: 2021-03-30 09:57:08
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-30 10:08:39
 * @Description: 图例圆点
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {px as text} from '../../../utils/appUtil';
import {Style} from '../../../common/commonStyle';

const Dot = ({bgColor, color}) => {
    return (
        <View style={[Style.flexCenter, styles.container, {backgroundColor: bgColor}]}>
            <View style={[styles.dot, {backgroundColor: color}]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: text(12),
        height: text(12),
        borderRadius: text(12),
    },
    dot: {
        width: text(5),
        height: text(5),
        borderRadius: text(5),
    },
});

Dot.propTypes = {
    bgColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
};

export default Dot;
