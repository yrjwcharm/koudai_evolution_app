/*
 * @Date: 2021-01-06 18:39:56
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-21 11:55:57
 * @Description: 固定按钮
 */
import React, {Component} from 'react';
import {StyleSheet, Keyboard, Animated, View, Text} from 'react-native';
import Button from './Button';
import Agreements from '../Agreements';
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
import {Space} from '../../common/commonStyle';
export default class FixedButton extends Component {
    state = {
        check: this.props.agreement?.default_agree !== undefined ? this.props.agreement?.default_agree : true,
        keyboardHeight: new Animated.Value(0),
        showCheckTag: true,
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
        const {check, keyboardHeight, showCheckTag} = this.state;
        const {
            agreement,
            disabled,
            heightChange,
            suffix = '',
            otherAgreement,
            otherParam,
            checkIcon,
            containerStyle,
        } = this.props;
        return (
            <Animated.View style={[styles.bottom, {bottom: keyboardHeight}, containerStyle]}>
                {agreement?.radio_text && showCheckTag && !check ? (
                    <View style={styles.checkTag}>
                        <Text style={{fontSize: px(14), lineHeight: px(20), color: '#fff'}}>
                            {agreement?.radio_text}
                        </Text>
                        <View style={styles.qualTag} />
                    </View>
                ) : null}
                {agreement ? (
                    <View
                        style={{paddingTop: px(4), paddingBottom: Space.padding}}
                        onLayout={(e) => heightChange && heightChange(e.nativeEvent.layout.height)}>
                        <Agreements
                            check={agreement?.default_agree}
                            data={agreement?.list}
                            otherAgreement={otherAgreement}
                            otherParam={otherParam}
                            title={agreement?.text}
                            text1={agreement?.text1}
                            onChange={(checkStatus) => {
                                this.setState({check: checkStatus});
                                this.setState({showCheckTag: !checkStatus});
                            }}
                            suffix={suffix}
                            checkIcon={checkIcon}
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
    checkTag: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: px(8),
        paddingVertical: px(6),
        position: 'absolute',
        top: -px(30),
        zIndex: 10,
        left: px(12),
        borderRadius: px(4),
    },
    qualTag: {
        position: 'absolute',
        borderWidth: px(6),
        borderTopColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: 'transparent',
        left: px(8),
        bottom: -px(12),
    },
});
