/*
 * @Date: 2022-02-16 15:15:02
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-23 15:05:09
 * @Description:直播
 */
import {View} from 'react-native';
import React from 'react';
import {WebView as RNWebView} from 'react-native-webview';

import NavBar from '../../components/NavBar';

const Live = ({route, navigation}) => {
    return (
        <View style={{flex: 1, borderWidth: 0.1}}>
            <NavBar
                leftIcon="chevron-left"
                title={''}
                leftPress={() => {
                    navigation.goBack();
                }}
                style={{backgroundColor: 'transparent', position: 'absolute', zIndex: 20}}
            />

            <RNWebView
                bounces={false}
                originWhitelist={['*']}
                onHttpError={(syntheticEvent) => {
                    const {nativeEvent} = syntheticEvent;
                    console.warn('WebView received error status code: ', nativeEvent.statusCode);
                }}
                onError={(syntheticEvent) => {
                    const {nativeEvent} = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                allowsInlineMediaPlayback={true}
                javaScriptEnabled={true}
                style={{flex: 1}}
                source={{
                    uri: route.params.link,
                }}
                textZoom={100}
            />
        </View>
    );
};

export default Live;
