/*
 * @Date: 2022-02-16 15:15:02
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-02 13:53:57
 * @Description:直播
 */
import {View} from 'react-native';
import React from 'react';
import {WebView as RNWebView} from 'react-native-webview';

import NavBar from '../../components/NavBar';

const Live = ({route, navigation}) => {
    return (
        <View style={{flex: 1, borderWidth: 0.5, borderColor: '#000'}}>
            <NavBar
                rightIcon="x"
                title={''}
                fontStyle={{color: '#fff', fontSize: 20}}
                rightPress={() => {
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
                style={{opacity: 0.99, flex: 1}}
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback={true}
                javaScriptEnabled={true}
                androidLayerType="hardware"
                source={{
                    uri: route.params.link,
                }}
                textZoom={100}
            />
        </View>
    );
};

export default Live;
