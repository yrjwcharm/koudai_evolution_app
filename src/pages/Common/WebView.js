/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-19 15:09:32
 * @Description:webview
 */
import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import {Colors} from '../../common/commonStyle';
export default function WebView({route}) {
    return (
        <View style={{flex: 1}}>
            <RNWebView
                // injectedJavaScript={injectedJS}
                javaScriptEnabled
                // onLoadEnd={onLoadEnd}
                // onMessage={onMessage}
                originWhitelist={['*']}
                renderLoading={() => <ActivityIndicator color={Colors.brandColor} />}
                // ref={webviewRef}
                source={{
                    uri: route?.params?.link,
                }}
                startInLoadingState
            />
        </View>
    );
}
