/*
 * @Date: 2021-03-18 10:57:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-18 11:38:54
 * @Description: 文章详情
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import {px as text, deviceHeight} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import storage from '../../utils/storage';

const ArticleDetail = () => {
    const webviewRef = useRef(null);
    const [webviewHeight, setHeight] = useState(deviceHeight);

    const onLoadEnd = () => {
        storage.get('loginStatus').then((res) => {
            if (res) {
                webviewRef.current.postMessage(res);
            }
        });
    };
    const onMessage = (event) => {
        const data = event.nativeEvent.data;
        console.log(data);
    };

    return (
        <ScrollView style={styles.container}>
            <RNWebView
                javaScriptEnabled
                onLoadEnd={onLoadEnd}
                onMessage={onMessage}
                originWhitelist={['*']}
                ref={webviewRef}
                source={{uri: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn/article/1'}}
                style={{height: webviewHeight}}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default ArticleDetail;
