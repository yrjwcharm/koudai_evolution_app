import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity, TextInput, DeviceEventEmitter} from 'react-native';
import NavBar from '~/components/NavBar';
import {isIphoneX, px} from '~/utils/appUtil';
import {WebView as RNWebView} from 'react-native-webview';
import Storage from '~/utils/storage';
import http from '~/services';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '~/components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import URI from 'urijs';
import {Style} from '~/common/commonStyle';
import FastImage from 'react-native-fast-image';
import {Modal, PageModal} from '~/components/Modal';
import {Button} from '~/components/Button';
import Toast from '~/components/Toast';

const SpecialDetail = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState('green');
    const [token, setToken] = useState('');
    const [content, setContent] = useState('');
    const [scrolling, setScrolling] = useState(false);

    const webview = useRef(null);
    const timeStamp = useRef(Date.now());
    const inputModal = useRef();
    const inputRef = useRef();
    const navBarRef = useRef();
    useEffect(() => {
        const getToken = () => {
            Storage.get('loginStatus').then((result) => {
                setToken(result?.access_token ? result?.access_token : 'null');
            });
        };
        getToken();
    }, []);

    const init = () => {
        http.get('/portfolio/buttons/20220914', route?.params?.params).then((res) => {
            if (res.code === '000000') {
                const {title} = res.result;
                setData(res.result);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    //发布评论
    const publish = () => {
        http.post('/community/article/comment/add/20210101', {article_id: 666, content}).then((res) => {
            if (res.code == '000000') {
                inputModal.current.cancel();
                setContent('');
                Modal.show({
                    title: '提示',
                    content: res.result.message,
                });
            } else {
                Toast.show(res.message);
            }
        });
    };
    return (
        <View style={styles.container}>
            <NavBar
                ref={navBarRef}
                renderLeft={
                    <Text
                        style={{
                            fontSize: px(16),
                            lineHeight: px(22),
                            marginLeft: px(13),
                            color: scrolling ? '#121D3A' : '#fff',
                        }}>
                        专题名称
                    </Text>
                }
                renderRight={
                    <View
                        style={[
                            styles.rightIconWrap,
                            {
                                backgroundColor: scrolling ? '#fff' : 'rgba(0,0,0,0.2)',
                                borderColor: scrolling ? '#E9EAEF' : 'rgba(255,255,255,0.4)',
                            },
                        ]}>
                        <View style={styles.rightIconItemWrap}>
                            <FastImage
                                style={styles.rightIcon}
                                source={{
                                    uri:
                                        'http://static.licaimofang.com/wp-content/uploads/2022/09/more-' +
                                        (scrolling ? 'black' : 'white') +
                                        '.png',
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                navigation.goBack();
                            }}
                            style={[
                                styles.rightIconItemWrap,
                                {
                                    borderLeftWidth: 0.5,
                                    borderLeftColor: scrolling ? '#E9EAEF' : 'rgba(255,255,255,0.5)',
                                },
                            ]}>
                            <FastImage
                                style={styles.rightIcon}
                                source={{
                                    uri:
                                        'http://static.licaimofang.com/wp-content/uploads/2022/09/close-' +
                                        (scrolling ? 'black' : 'white') +
                                        '.png',
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                }
                style={{
                    backgroundColor: scrolling ? '#fff' : 'transparent',
                    position: 'absolute',
                    zIndex: 20,
                }}
            />
            {token ? (
                <RNWebView
                    bounces={false}
                    ref={webview}
                    onMessage={(event) => {
                        const data = event.nativeEvent.data;
                        if (data?.indexOf('url=') > -1) {
                            const url = JSON.parse(data.split('url=')[1]);
                            jump(url);
                        } else if (data?.indexOf('scrolling=') > -1) {
                            const _scrolling = JSON.parse(data.split('scrolling=')[1]);
                            setScrolling(_scrolling == 1);
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
                        console.log(
                            JSON.stringify({
                                ...loginStatus,
                                did: global.did,
                                timeStamp: timeStamp.current + '',
                                ver: global.ver,
                            })
                        );
                        webview.current.postMessage(
                            JSON.stringify({
                                ...loginStatus,
                                did: global.did,
                                timeStamp: timeStamp.current + '',
                                ver: global.ver,
                                navBarHeight: navBarRef.current.navBarHeight,
                            })
                        );
                    }}
                    renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                    startInLoadingState={true}
                    style={{opacity: 0.99, flex: 1}}
                    source={{
                        uri: URI('http://192.168.88.171:3000/SpecialDetail')
                            .addQuery({
                                timeStamp: timeStamp.current,
                                ...route.params.params,
                            })
                            .valueOf(),
                    }}
                    textZoom={100}
                />
            ) : null}

            <View style={[styles.footer, Style.flexRow]}>
                <TouchableOpacity
                    style={styles.footer_content}
                    activeOpacity={0.9}
                    onPress={() => {
                        inputModal.current.show();
                        setTimeout(() => {
                            inputRef?.current?.focus();
                        }, 100);
                    }}>
                    <Text style={{fontSize: px(12), color: '#9AA0B1'}}>我来聊两句...</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: px(24)}} activeOpacity={0.8} onPress={() => {}}>
                    <FastImage
                        source={require('../../assets/img/article/share.png')}
                        style={[styles.actionIcon, {width: px(20), height: px(20), marginBottom: px(4)}]}
                    />
                    <Text style={{fontSize: px(11), lineHeight: px(15), color: '#3d3d3d'}}>自选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{marginLeft: px(24)}}
                    activeOpacity={0.8}
                    onPress={() => {
                        DeviceEventEmitter.emit('globalShareShow');
                    }}>
                    <FastImage
                        source={require('../../assets/img/article/share.png')}
                        style={[styles.actionIcon, {width: px(20), height: px(20), marginBottom: px(4)}]}
                    />
                    <Text style={{fontSize: px(11), lineHeight: px(15), color: '#3d3d3d'}}>自选</Text>
                </TouchableOpacity>
            </View>
            <PageModal ref={inputModal} title="写评论" style={{height: px(360)}} backButtonClose={true}>
                <TextInput
                    ref={inputRef}
                    value={content}
                    multiline={true}
                    style={styles.input}
                    onChangeText={(value) => {
                        setContent(value);
                    }}
                    maxLength={500}
                    textAlignVertical="top"
                    placeholder="我来聊两句..."
                />
                <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                    <View style={Style.flexRow}>
                        <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                            {content.length}/{500}
                        </Text>
                        <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={publish} />
                    </View>
                </View>
            </PageModal>
        </View>
    );
};

export default SpecialDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: px(16),
        borderColor: '#DDDDDD',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        paddingTop: px(8),
        paddingBottom: isIphoneX() ? 35 : px(15),
    },
    footer_content: {
        height: px(36),
        backgroundColor: '#F3F5F8',
        borderRadius: px(322),
        flex: 1,
        paddingLeft: px(16),
        justifyContent: 'center',
    },
    button: {
        marginLeft: px(7),
        borderRadius: px(18),
        width: px(80),
        height: px(36),
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
        height: px(215),
        fontSize: px(14),
        lineHeight: px(20),
    },
    rightIconWrap: {
        borderRadius: px(19),
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        width: px(90),
        paddingVertical: px(5),
    },
    rightIconItemWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    rightIcon: {
        width: px(20),
        height: px(20),
    },
});
