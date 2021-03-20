/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-20 15:23:02
 * @Description:webview
 */
import React, {useEffect, useRef} from 'react';
import {View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import {Colors, Style, Font} from '../../common/commonStyle';

export default function WebView({route}) {
    return (
        <View style={{flex: 1}}>
            <RNWebView
                javaScriptEnabled
                originWhitelist={['*']}
                source={{
                    uri: route?.params?.link,
                }}
                startInLoadingState={true}
                style={{flex: 1}}
            />
        </View>
    );
}
