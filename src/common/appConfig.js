/*
 * @Date: 2020-11-04 15:30:56
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-28 17:46:45
 * @Description: 全局配置及异常机型处理
 */
import * as React from 'react';
import {TextInput, Text, Platform} from 'react-native';
import {Colors} from './commonStyle';
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
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false, color: Colors.defaultColor});
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false});
