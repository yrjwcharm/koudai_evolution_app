/*
 * @Date: 2022-06-28 13:48:18
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-28 16:27:47
 * @Description: 基金详情
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {WebView} from 'react-native-webview';
import shareFund from '~/assets/img/icon/shareFund.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {ShareModal} from '~/components/Modal';
import Toast from '~/components/Toast';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, px} from '~/utils/appUtil';

const Index = ({navigation, route}) => {
    const jump = useJump();
    const shareModal = useRef();
    const webview = useRef();

    const onMessage = (event) => {
        const data = event.nativeEvent.data;
        console.log('RN端接收到消息，消息内容=' + event.nativeEvent.data);
        if (data?.indexOf('logParams=') > -1) {
            const logParams = JSON.parse(data?.split('logParams=')[1] || []);
            global.LogTool(...logParams);
        } else if (data && data.indexOf('url=') > -1) {
            const url = JSON.parse(data.split('url=')[1]);
            jump(url);
        } else if (data && data.indexOf('https') <= -1) {
            const url = data.split('phone=')[1] ? `tel:${data.split('phone=')[1]}` : '';
            if (url) {
                global.LogTool('call');
                Linking.canOpenURL(url)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show(`您的设备不支持该功能，请手动拨打 ${data.split('phone=')[1]}`);
                        }
                        return Linking.openURL(url);
                    })
                    .catch((err) => Toast.show(err));
            }
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => shareModal.current?.show()}
                    style={{marginRight: Space.marginAlign}}>
                    <Image source={shareFund} style={styles.shareFund} />
                </TouchableOpacity>
            ),
            title: '公募基金',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            <ShareModal ref={shareModal} title={'分享理财魔方'} shareContent={{}} />
            <WebView
                bounces={false}
                javaScriptEnabled
                onError={(syntheticEvent) => {
                    const {nativeEvent} = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                    const {nativeEvent} = syntheticEvent;
                    console.warn('WebView received error status code: ', nativeEvent.statusCode);
                }}
                onMessage={onMessage}
                originWhitelist={['*']}
                ref={webview}
                renderLoading={Platform.select({android: () => <Loading />, ios: undefined})}
                source={{uri: 'http://localhost:3000/fundDetail'}}
                startInLoadingState
                style={{flex: 1}}
                textZoom={100}
            />
            <View style={[Style.flexRow, styles.bottomBtns]}>
                <TouchableOpacity activeOpacity={0.8} style={[Style.flexCenter, styles.leftBtns]}>
                    <Image
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/06/consult_icon.png'}}
                        style={styles.leftBtnIcon}
                    />
                    <Text style={styles.leftBtnText}>{'咨询'}</Text>
                </TouchableOpacity>
                <View style={[Style.flexRow, styles.rightBtns]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[Style.flexCenter, styles.rightBtn, {backgroundColor: '#E6F0FF'}]}>
                        <Text style={[styles.rightBtnText, {color: Colors.brandColor}]}>{'定投'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[Style.flexCenter, styles.rightBtn, {backgroundColor: Colors.brandColor}]}>
                        <Text style={[styles.rightBtnText, {color: '#fff'}]}>{'买入'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    shareFund: {
        width: px(20),
        height: px(20),
    },
    bottomBtns: {
        paddingTop: Space.padding,
        paddingHorizontal: px(12),
        paddingBottom: isIphoneX() ? 34 : Space.padding,
        backgroundColor: '#fff',
    },
    leftBtns: {
        paddingHorizontal: px(12),
    },
    leftBtnIcon: {
        marginBottom: px(4),
        width: px(24),
        height: px(24),
    },
    leftBtnText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    rightBtns: {
        marginLeft: px(12),
        borderRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
        overflow: 'hidden',
    },
    rightBtn: {
        flex: 1,
        height: '100%',
    },
    rightBtnText: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        fontWeight: Font.weightMedium,
    },
});

export default Index;
