/*
 * @Date: 2021-01-06 18:39:56
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 21:13:25
 * @Description: 固定按钮
 */
import React, {Component} from 'react';
import {StyleSheet, Keyboard, Animated} from 'react-native';
import Button from './Button';
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
export default class FixedButton extends Component {
    state = {
        keyboardHeight: new Animated.Value(0),
    };

    UNSAFE_componentWillMount() {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    keyboardWillShow = (e) => {
        const {keyboardHeight} = this.state;
        Animated.timing(keyboardHeight, {
            toValue: e.endCoordinates.height - (isIphoneX() ? 34 - px(8) : px(8)),
            duration: e.duration,
            useNativeDriver: false,
        }).start();
    };
    keyboardWillHide = (e) => {
        const {keyboardHeight} = this.state;
        Animated.timing(keyboardHeight, {
            toValue: 0,
            duration: e.duration,
            useNativeDriver: false,
        }).start();
    };
    componentWillUnmount() {
        Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow);
        Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide);
    }
    render() {
        const {keyboardHeight} = this.state;
        return (
            <Animated.View style={[styles.bottom, {bottom: keyboardHeight}]}>
                <Button {...this.props} />
            </Animated.View>
        );
    }
}
const styles = StyleSheet.create({
    bottom: {
        backgroundColor: '#fff',
        position: 'absolute',
        paddingTop: px(8),
        paddingHorizontal: px(16),
        width: deviceWidth,
        paddingBottom: isIphoneX() ? 34 : px(8),
    },
});
