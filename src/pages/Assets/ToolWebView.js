import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity} from 'react-native';
import NavBar from '~/components/NavBar';
import {WebView as RNWebView} from 'react-native-webview';
import {useJump} from '~/components/hooks';
import Storage from '~/utils/storage';
import Loading from '../Portfolio/components/PageLoading';
import URI from 'urijs';
import {deviceHeight, px} from '~/utils/appUtil';
import http from '~/services';
import ProductCards from '~/components/Portfolios/ProductCards';
import {Style} from '~/common/commonStyle';
import FastImage from 'react-native-fast-image';
import Toast from '~/components/Toast';

const ToolWebView = ({route}) => {
    const jump = useJump();
    const [token, setToken] = useState('');
    const [res, setRes] = useState({});
    const [webviewHeight, setHeight] = useState(deviceHeight - 97);
    const [listData, setListData] = useState(null);
    const [topButton, setTopButton] = useState(null);
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

    useEffect(() => {
        if (res.tool_id) {
            getRelation();
        }
        if (res.top_button) {
            setTopButton(res.top_button);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [res]);

    const renderRight = () => {
        const onPress = () => {
            http.post('/project/set/subscribe/conf/202207', {
                item_id: topButton.item_id,
                status: 'ON',
            }).then((result) => {
                console.log(result);
                if (result.code === '000000') {
                    setTopButton(null);
                    Toast.show('订阅成功');
                }
            });
        };
        return (
            <TouchableOpacity style={Style.flexRowCenter} activeOpacity={0.8} onPress={onPress}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/subscribe.png'}}
                    style={{width: px(16), height: px(16), marginRight: px(2)}}
                />
                <Text style={styles.rightText}>{topButton.text}</Text>
            </TouchableOpacity>
        );
    };

    const navBarOption = useMemo(() => {
        return res.title
            ? {
                  title: res.title,
                  titleIcon: res.titleIcon,
                  fontStyle: {color: res.type === 'index' ? '#121D3A' : '#fff'},
                  renderRight: topButton ? renderRight() : null,
                  style: {backgroundColor: res.type === 'index' ? '#fff' : '#1E5AE7'},
              }
            : {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [res, topButton]);

    const getRelation = () => {
        http.get('/tool/signal/relation/20220711', {tool_id: res.tool_id}).then((result) => {
            if (result.code === '000000') {
                setListData(result.result);
            }
        });
    };

    return (
        <View style={styles.container}>
            <NavBar leftIcon="chevron-left" {...navBarOption} />
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}} scrollEventThrottle={16} bounces={false}>
                {token ? (
                    <RNWebView
                        bounces={false}
                        ref={webview}
                        onMessage={(event) => {
                            const data = event.nativeEvent.data;
                            if (data?.indexOf('data=') > -1) {
                                let _res = JSON.parse(data?.split('data=')[1] || []);
                                setRes(_res);
                            } else if (data?.indexOf('url=') > -1) {
                                const url = JSON.parse(data.split('url=')[1]);
                                jump(url);
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
                {listData && (
                    <View style={styles.listDataWrap}>
                        <Text style={styles.title}>
                            使用了{['牛人', '牛人', '估值', '概率'][res.tool_id - 1]}信号的计划
                        </Text>
                        {listData.map((item, idx) => (
                            <View style={styles.listDataItem} key={idx}>
                                <ProductCards type="project_sm_card" data={item} />
                            </View>
                        ))}
                    </View>
                )}
                {res.card ? (
                    <View style={styles.listDataWrap}>
                        <Text style={styles.title}>{res.card.title}</Text>
                        {res.card.list?.map((item, idx) => (
                            <View style={styles.listDataItem} key={idx}>
                                <ProductCards type="project_sm_card" data={item} />
                            </View>
                        ))}
                    </View>
                ) : null}

                {res.risk_tip ? <Text style={styles.riskTip}>{res.risk_tip}</Text> : null}
                <View style={{height: px(50)}} />
            </ScrollView>
        </View>
    );
};

export default ToolWebView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listDataWrap: {
        margin: px(16),
    },
    title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121D3A',
    },
    listDataItem: {
        marginTop: px(12),
    },
    riskTip: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA0B1',
        marginHorizontal: px(16),
    },
    rightText: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121D3A',
    },
});
