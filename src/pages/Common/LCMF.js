/*
 * @Date: 2021-03-19 11:23:44
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-04-20 22:14:51
 * @Description:webview
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform} from 'react-native';
import Image from 'react-native-fast-image';
import {WebView as RNWebView} from 'react-native-webview';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Feather from 'react-native-vector-icons/Feather';
import {ShareModal} from '../../components/Modal';
import http from '../../services';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector} from 'react-redux';
export default function LCMF({route, navigation}) {
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(true);
    const jump = useJump();
    const shareModal = useRef(null);
    const [data, setData] = useState({});

    const onMessage = (event) => {
        const eventData = JSON.parse(event.nativeEvent.data);
        // console.log(eventData);
        if (typeof eventData === 'object') {
            // console.log(route.params?.scene, userInfo.is_login);
            if (route.params?.scene === 'know_lcmf' && !userInfo.is_login) {
                navigation.navigate('Register');
            } else {
                jump(eventData);
            }
        }
    };
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);
    useEffect(() => {
        navigation.setOptions({
            headerBackImage: () => {
                return (
                    <Feather
                        name="chevron-left"
                        size={30}
                        color={'#fff'}
                        style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                    />
                );
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
                        <Image source={require('../../assets/img/article/white_more.png')} style={styles.moreImg} />
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
        if (hasNet) {
            http.get('/share/common/info/20210101', {scene: route.params?.scene || 'fund_safe'}).then((res) => {
                if (res.code === '000000') {
                    StatusBar.setBarStyle('light-content');
                    setData(res.result);
                }
            });
        }
    }, [hasNet, route]);
    useEffect(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);

    return (
        <View style={{flex: 1, backgroundColor: Colors.brandColor}}>
            {hasNet ? (
                <>
                    <RNWebView
                        bounces={false}
                        javaScriptEnabled
                        onMessage={onMessage}
                        originWhitelist={['*']}
                        source={{
                            uri: route?.params?.link,
                        }}
                        startInLoadingState={true}
                        style={{flex: 1}}
                    />
                    <ShareModal ref={shareModal} title={'分享理财魔方'} shareContent={data?.share_info || {}} />
                </>
            ) : (
                <>
                    <Empty
                        img={require('../../assets/img/emptyTip/noNetwork.png')}
                        text={'哎呀！网络出问题了'}
                        desc={'网络不给力，请检查您的网络设置'}
                        style={{paddingVertical: text(60)}}
                    />
                    <Button title={'刷新一下'} style={{marginHorizontal: text(20)}} onPress={refreshNetWork} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    topRightBtn: {
        flex: 1,
        width: text(36),
        marginRight: Platform.select({ios: text(10), android: text(6)}),
    },
    moreImg: {
        width: text(28),
        height: text(28),
    },
});
