/*
 * @Date: 2021-01-06 18:39:56
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-11 10:43:59
 * @Description: 固定按钮
 */
import React, {Component} from 'react';
import {StyleSheet, Keyboard, Animated, View} from 'react-native';
import Button from './Button';
import Agreements from '../Agreements';
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
import {Space} from '../../common/commonStyle';
export default class FixedButton extends Component {
    state = {
        check: this.props.agreement?.default_agree !== undefined ? this.props.agreement?.default_agree : true,
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
        const {check, keyboardHeight} = this.state;
        const {agreement, disabled, heightChange} = this.props;
        return (
            <Animated.View style={[styles.bottom, {bottom: keyboardHeight}]}>
                {agreement ? (
                    <View
                        style={{paddingTop: px(4), paddingBottom: Space.padding}}
                        onLayout={(e) => heightChange && heightChange(e.nativeEvent.layout.height)}>
                        <Agreements
                            check={agreement?.default_agree}
                            data={agreement?.list}
                            onChange={(checkStatus) => this.setState({check: checkStatus})}
                        />
                    </View>
                ) : null}
                <Button {...this.props} disabled={!check || disabled} />
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
