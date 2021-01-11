/*
 * @Date: 2020-11-04 15:30:56
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-06 10:37:42
 * @Description: 全局配置及异常机型处理
 */
import * as React from 'react';
import {TextInput, Text, Platform} from 'react-native';
//解决小米手机字体显示不全
const defaultFontFamily = {
    ...Platform.select({
        android: {fontFamily: ' '},
    }),
};
const oldRender = Text.render;
Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
        style: [defaultFontFamily, origin.props.style],
    });
};
//控制字体不受手机字体影响
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false});
