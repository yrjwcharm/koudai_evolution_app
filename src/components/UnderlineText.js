/*
 * @Date: 2021-12-31 17:55:32
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-16 19:18:34
 * @Description: 带下划线的文字
 */
import React, {useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {px} from '../utils/appUtil';
import PropTypes from 'prop-types';

const UnderlineText = (props) => {
    const {color = '#003FAC', height = px(9), style = {}, text = '', underlineWidthDelta = 0} = props;
    const underlineRef = useRef();

    return (
        <>
            <View ref={underlineRef} style={[styles.underline, {backgroundColor: color, height}]} />
            <Text
                onLayout={({nativeEvent: {layout}}) => {
                    underlineRef.current?.setNativeProps?.({
                        style: {left: layout.x, width: layout.width + underlineWidthDelta},
                    });
                }}
                style={style}>
                {text}
            </Text>
        </>
    );
};

const styles = StyleSheet.create({
    underline: {
        position: 'absolute',
        bottom: px(2),
        height: px(9),
        backgroundColor: '#003FAC',
    },
});

UnderlineText.propTypes = {
    color: PropTypes.string,
    height: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    text: PropTypes.string.isRequired,
    underlineWidthDelta: PropTypes.number,
};

export default UnderlineText;
