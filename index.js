/*
 * @Date: 2021-03-18 14:33:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-12-21 12:02:14
 * @Description:
 */
/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
    'Warning: BackAndroid is deprecated. Please use BackHandler instead.',
    'source.uri should not be an empty string',
    'Invalid props.style key',
]);
LogBox.ignoreAllLogs(true); // 关闭全部黄色警告
AppRegistry.registerComponent(appName, () => App);
