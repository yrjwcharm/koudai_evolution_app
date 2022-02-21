/*
 * @Date: 2022-02-16 15:15:02
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-21 14:39:41
 * @Description:直播
 */
import {StyleSheet, Text, View, ScrollView, Platform, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import http from '../../services';
import RenderTitle from './components/RenderTitle';
import {WebView as RNWebView} from 'react-native-webview';
import RenderCate from './components/RenderCate';
import {deviceHeight, px} from '../../utils/appUtil';
import {useJump} from '../../components/hooks';
import NavBar from '../../components/NavBar';

const Live = ({route, navigation}) => {
    return (
        <View style={{flex: 1}}>
            <NavBar
                leftIcon="chevron-left"
                title={''}
                leftPress={() => {
                    navigation.goBack();
                }}
                style={{backgroundColor: 'transparent', position: 'absolute', zIndex: 20}}
            />
            {/* <ShareModal ref={shareLinkModal} title={'分享理财魔方'} shareContent={shareData || {}} /> */}

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
                // onNavigationStateChange={onNavigationStateChange}
                // renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                // showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({});
