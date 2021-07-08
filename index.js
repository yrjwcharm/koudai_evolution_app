/*
 * @Date: 2021-03-18 14:33:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-08 14:22:56
 * @Description:
 */
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.ignoredYellowBox = [
    'Warning: BackAndroid is deprecated. Please use BackHandler instead.',
    'source.uri should not be an empty string',
    'Invalid props.style key',
];
console.disableYellowBox = true; // 关闭全部黄色警告
AppRegistry.registerComponent(appName, () => {
    return App;
});
