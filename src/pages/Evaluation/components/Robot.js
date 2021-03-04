/*
 * @Date: 2021-03-02 14:32:03
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-04 15:53:43
 * @Description: 机器人
 */
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {px} from '../../../utils/appUtil';

export default class Robot extends Component {
    render() {
        return (
            <Animatable.Image
                animation="rotate"
                style={[styles.robot, this.props.style]}
                source={require('../../../assets/img/robot.png')}
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
