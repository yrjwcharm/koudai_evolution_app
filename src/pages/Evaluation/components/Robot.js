/*
 * @Date: 2021-03-02 14:32:03
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-30 17:35:04
 * @Description: 机器人
 */
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {px} from '../../../utils/appUtil';
import FastImage from 'react-native-fast-image';
export default class Robot extends Component {
    render() {
        return (
            <FastImage style={[styles.robot, this.props.style]} source={require('../../../assets/img/robot3x.png')} />
        );
    }
}
const styles = StyleSheet.create({
    robot: {
        width: px(86),
        height: px(86),
        marginLeft: px(-10),
        marginBottom: px(14),
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#fff',
    },
});
