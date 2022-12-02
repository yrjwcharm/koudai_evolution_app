/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-30 14:55:54
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import NavBar from '~/components/NavBar';
import {WebView} from 'react-native-webview';
import {useJump} from '~/components/hooks';
import Storage from '~/utils/storage';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../Portfolio/components/PageLoading';
import URI from 'urijs';

const Popularize = ({route}) => {
    const jump = useJump();
    const [token, setToken] = useState('');

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

    useFocusEffect(
        useCallback(() => {
            webview.current && webview.current.postMessage(JSON.stringify({action: 'reload'}));
        }, [])
    );

    return (
        <View style={styles.container}>
            {token ? (
                <WebView
                    bounces={false}
                    ref={webview}
                    onMessage={(event) => {
                        const _data = event.nativeEvent.data;
                        if (_data?.indexOf('url=') > -1) {
                            const url = JSON.parse(_data.split('url=')[1]);
                            jump(url);
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
                    style={{flex: 1, opacity: 0.9999}}
                    source={{
                        uri: URI(route.params.link)
                            .addQuery({
                                timeStamp: timeStamp.current,
                                ...route.params.params,
                            })
                            .valueOf(),
                    }}
                    textZoom={100}
                />
            ) : null}
        </View>
    );
};

export default Popularize;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
