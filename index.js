/*
 * @Date: 2021-03-18 14:33:48
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-13 18:57:52
 * @Description:
 */
/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';
import {PlaybackService} from './src/pages/Community/components/audioService/AudioConfig';
LogBox.ignoreLogs([
    'Warning: BackAndroid is deprecated. Please use BackHandler instead.',
    'source.uri should not be an empty string',
    'Invalid props.style key',
]);
LogBox.ignoreAllLogs(true); // 关闭全部黄色警告
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
