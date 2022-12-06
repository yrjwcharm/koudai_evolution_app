import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {WebView as RNWebView} from 'react-native-webview';
import {useJump} from '~/components/hooks';
import Storage from '~/utils/storage';
import Loading from '../Portfolio/components/PageLoading';
import URI from 'urijs';
import {deviceHeight, px} from '~/utils/appUtil';
import http from '~/services';
import ProductCards from '~/components/Portfolios/ProductCards';
import {Colors, Space, Style} from '~/common/commonStyle';
import FastImage from 'react-native-fast-image';
import Toast from '~/components/Toast';
import {useFocusEffect} from '@react-navigation/native';

const ToolWebView = ({navigation, route}) => {
    const jump = useJump();
    const [token, setToken] = useState('');
    const [res, setRes] = useState({});
    const [webviewHeight, setHeight] = useState(deviceHeight - 97);
    const [listData, setListData] = useState(null);
    const [topButton, setTopButton] = useState(null);
    const [, setReminder] = useState('');
    const httpFlag = useRef(true);
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
        const index_id = route.params.link?.split?.('index_id=')?.[1] || '';
        index_id && global.LogTool({ctrl: 'index', event: 'jump', oid: index_id});
        if (res.tool_id) {
            global.LogTool({ctrl: 'tool', event: 'jump', oid: res.tool_id});
            getRelation();
            getShareHoldings();
        }
        if (res.top_button) {
            setTopButton(res.top_button);
        }
    }, [res]);

    const renderRight = () => {
        const onPress = () => {
            if (!httpFlag.current) return;
            httpFlag.current = false;
            http.post('/project/set/subscribe/conf/202207', {
                item_id: topButton.item_id,
                status: 'ON',
            })
                .then((result) => {
                    if (result.code === '000000') {
                        setTopButton(null);
                        Toast.show('订阅成功');
                    }
                })
                .finally((_) => {
                    httpFlag.current = true;
                });
        };
        return (
            <TouchableOpacity
                style={[Style.flexRowCenter, {marginRight: Space.marginAlign}]}
                activeOpacity={0.8}
                onPress={onPress}>
                <FastImage
                    source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2022/08/subscribe.png'}}
                    style={{width: px(16), height: px(16), marginRight: px(2)}}
                />
                <Text style={styles.rightText}>{topButton.text}</Text>
            </TouchableOpacity>
        );
    };

    const getRelation = () => {
        http.get('/tool/signal/relation/20220711', {tool_id: res.tool_id})
            .then((result) => {
                if (result.code === '000000') {
                    setListData(result.result);
                }
            })
            .finally(() => {
                StatusBar.setBarStyle('light-content');
            });
    };
    /**
     * 获取持仓份额
     */
    const getShareHoldings = () => {
        http.get('/tool/signal/chart/20220711', {tool_id: res.tool_id})
            .then((resp) => {
                if (resp.code === '000000') {
                    const {reminder = ''} = resp?.result?.compare_table;
                    setReminder(reminder);
                }
            })
            .finally(() => {
                StatusBar.setBarStyle('light-content');
            });
    };

    useEffect(() => {
        const {title, title_icon, type} = res;
        const titleColor = type === 'index' ? '#121D3A' : '#fff';
        if (title) {
            navigation.setOptions({
                headerBackImage: () => {
                    return (
                        <Feather
                            name="chevron-left"
                            color={titleColor}
                            size={px(26)}
                            style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                        />
                    );
                },
                headerRight: topButton ? renderRight : undefined,
                headerStyle: {
                    backgroundColor: type === 'index' ? '#fff' : '#1E5AE7',
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    elevation: 0.1,
                },
                headerTitle: ({allowFontScaling}) => (
                    <View style={Style.flexRow}>
                        {title_icon ? <FastImage source={{uri: title_icon}} style={styles.titleIcon} /> : null}
                        <Text allowFontScaling={allowFontScaling} style={{fontSize: px(18), color: titleColor}}>
                            {title}
                        </Text>
                    </View>
                ),
            });
        }
    }, [res, topButton]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* <NavBar leftIcon="chevron-left" {...navBarOption} /> */}
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
                                jump(url, url.path === 'ToolWebView' ? 'push' : 'navigate');
                            }
                            if (data * 1) {
                                setHeight((prev) => (data * 1 < deviceHeight / 2 ? prev : data * 1));
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
                        onLoadEnd={async () => {
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
                        style={{height: webviewHeight, opacity: 0.99}}
                        source={{
                            uri: URI(route.params.link).addQuery({timeStamp: timeStamp.current}).valueOf(),
                        }}
                        textZoom={100}
                    />
                ) : null}
                {listData ? (
                    <View style={{backgroundColor: Colors.bgColor}}>
                        {listData && (
                            <View style={styles.listDataWrap}>
                                <Text style={styles.title}>使用了{res.title}的计划</Text>
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
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
};

export default ToolWebView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    titleIcon: {
        marginRight: px(4),
        width: px(22),
        height: px(22),
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
