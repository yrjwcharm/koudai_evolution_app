/*
 * @Date: 2021-03-02 14:32:03
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-31 14:14:38
 * @Description: 机器人
 */
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {px} from '../../../utils/appUtil';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
export default class Robot extends Component {
    render() {
        return (
            <Animatable.Image
                animation="fadeInUp"
                style={[styles.robot, this.props.style]}
                source={require('../../../assets/img/robot3x.png')}
            />
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
