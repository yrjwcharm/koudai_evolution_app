import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView} from 'react-native';
import NavBar from '~/components/NavBar';
import {WebView as RNWebView} from 'react-native-webview';
import {useJump} from '~/components/hooks';
import Storage from '~/utils/storage';
import Loading from '../Portfolio/components/PageLoading';
import URI from 'urijs';
import {Style} from '~/common/commonStyle';
import FastImage from 'react-native-fast-image';
import {deviceHeight, px} from '~/utils/appUtil';

const ToolWebView = ({route}) => {
    const jump = useJump();
    const [token, setToken] = useState('');
    const [res, setRes] = useState({});
    const [webviewHeight, setHeight] = useState(deviceHeight - 97);
    const webview = useRef(null);

    const timeStamp = useRef(Date.now());

    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setToken(result?.access_token ? result?.access_token : 'null');
            });
        };
        getToken();
    }, []);

    return (
        <View style={styles.container}>
            <NavBar
                leftIcon="chevron-left"
                title={res.title}
                titleIcon={res.titleIcon}
                fontStyle={{color: '#fff'}}
                style={{backgroundColor: '#1E5AE7'}}
            />
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}} scrollEventThrottle={16} bounces={false}>
                {token ? (
                    <RNWebView
                        bounces={false}
                        ref={webview}
                        onMessage={(event) => {
                            const data = event.nativeEvent.data;
                            console.log(data)
                            if (data?.indexOf('data=') > -1) {
                                let _res = JSON.parse(data?.split('data=')[1] || []);
                                setRes(_res);
                            }
                            if (data * 1) {
                                setHeight(data * 1 || deviceHeight);
                            }
                        }}
                        originWhitelist={['*']}
                        onHttpError={(syntheticEvent) => {
                            const {nativeEvent} = syntheticEvent;
                            console.warn('WebView received error status code: ', nativeEvent.statusCode);
                        }}
                        javaScriptEnabled={true}
                        injectedJavaScript={`window.sessionStorage.setItem('token','${token}');`}
                        // injectedJavaScriptBeforeContentLoaded={`window.sessionStorage.setItem('token','${token}');`}
                        onLoadEnd={async (e) => {
                            const loginStatus = await Storage.get('loginStatus');
                            // console.log(loginStatus);
                            webview.current.postMessage(
                                JSON.stringify({
                                    ...loginStatus,
                                    did: global.did,
                                    timeStamp: timeStamp.current + '',
                                    ver: global.ver,
                                })
                            );
                        }}
                        renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                        startInLoadingState={true}
                        style={{height: webviewHeight}}
                        source={{
                            uri: URI(route.params.link).addQuery({timeStamp: timeStamp.current}).valueOf(),
                        }}
                        textZoom={100}
                    />
                ) : null}
                {res.risk_tip ? <Text style={styles.riskTip}>{res.risk_tip}</Text> : null}
            </ScrollView>
        </View>
    );
};

export default ToolWebView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    riskTip: {},
});
