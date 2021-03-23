/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-23 15:59:49
 * @Description:webview
 */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Feather from 'react-native-vector-icons/Feather';
import {ShareModal} from '../../components/Modal';
import http from '../../services';
export default function LCMF({route, navigation}) {
    const shareModal = useRef(null);
    const [data, setData] = useState({});

    useEffect(() => {
        navigation.setOptions({
            headerBackImage: () => {
                return <Feather name="chevron-left" size={30} color={'#fff'} />;
            },
            headerStyle: {
                backgroundColor: Colors.brandColor,
                shadowOffset: {
                    height: 0,
                },
                elevation: 0,
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: text(18),
            },
            headerRight: (props) => (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => shareModal.current.show()}>
                        <Text style={styles.btnText}>分享</Text>
                    </TouchableOpacity>
                </>
            ),
            title: route?.params?.title || '',
        });
        StatusBar.setBarStyle('light-content');
        return () => {
            StatusBar.setBarStyle('dark-content');
        };
    }, [navigation, route]);
    useEffect(() => {
        http.get('/share/common/info/20210101', {scene: route.params?.scene || 'fund_safe'}).then((res) => {
            if (res.code === '000000') {
                StatusBar.setBarStyle('light-content');
                setData(res.result);
            }
        });
    }, [route]);

    return (
        <View style={{flex: 1, backgroundColor: '#ddd'}}>
            <RNWebView
                javaScriptEnabled
                originWhitelist={['*']}
                source={{
                    uri: route?.params?.link,
                }}
                startInLoadingState={true}
                style={{flex: 1}}
            />
            <ShareModal ref={shareModal} title={'分享理财魔方'} shareContent={data?.share_info || {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    topRightBtn: {
        flex: 1,
        width: text(36),
        marginRight: text(8),
    },
    btnText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#fff',
    },
});
