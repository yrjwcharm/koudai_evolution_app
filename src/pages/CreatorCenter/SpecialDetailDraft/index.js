import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Platform, TextInput, TouchableOpacity} from 'react-native';
import NavBar from '~/components/NavBar';
import {isIphoneX, px} from '~/utils/appUtil';
import {WebView as RNWebView} from 'react-native-webview';
import Storage from '~/utils/storage';
import {useJump} from '~/components/hooks';
import Loading from '../../Portfolio/components/PageLoading';
import URI from 'urijs';
import {Style} from '~/common/commonStyle';
import {Modal, PageModal} from '~/components/Modal';
import {Button} from '~/components/Button';
import Toast from '~/components/Toast';
import {editComment} from './services';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const SpecialDetailDraft = ({navigation, route}) => {
    const jump = useJump();
    const [title, setTitle] = useState();
    const [token, setToken] = useState('');
    const [content, setContent] = useState('');
    const [scrolling, setScrolling] = useState(false);
    const [refuseObj, setRefuseObj] = useState({});

    const webview = useRef(null);
    const timeStamp = useRef(Date.now());
    const inputModal = useRef();
    const inputRef = useRef();
    const navBarRef = useRef();
    const refuseModal = useRef();

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

    //发布评论
    const publish = () => {
        const loading = Toast.showLoading();
        editComment({
            subject_id: route.params?.params?.subject_id,
            content,
        })
            .then((res) => {
                if (res.code == '000000') {
                    inputModal.current.cancel();
                    setContent('');
                    Toast.show('发布成功');
                    webview.current && webview.current.postMessage(JSON.stringify({action: 'reload'}));
                } else {
                    Toast.show(res.message);
                }
            })
            .finally((_) => {
                Toast.hide(loading);
            });
    };

    const writeComment = () => {
        inputModal.current.show();
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 100);
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
                        {title}
                    </Text>
                }
                style={{
                    backgroundColor: scrolling ? '#fff' : 'transparent',
                    position: 'absolute',
                    zIndex: 2,
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
                        } else if (data?.indexOf('title=') > -1) {
                            const _title = JSON.parse(data.split('title=')[1]);
                            setTitle(_title);
                        } else if (data?.indexOf('scrolling=') > -1) {
                            const _scrolling = JSON.parse(data.split('scrolling=')[1]);
                            setScrolling(_scrolling == 1);
                        } else if (data?.indexOf('goBack=') > -1) {
                            navigation.goBack();
                        } else if (data?.indexOf('writeComment=') > -1) {
                            const _content = JSON.parse(data.split('writeComment=')[1]);
                            setContent(_content + '');
                            setTimeout(() => {
                                writeComment();
                            });
                        } else if (data?.indexOf('refuse=') > -1) {
                            const _refuseObj = JSON.parse(data.split('refuse=')[1]);
                            setRefuseObj(_refuseObj);
                            setTimeout(() => {
                                refuseModal.current.show();
                            });
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
                            {content.length || 0}/{500}
                        </Text>
                        <Button title="发布" disabled={content.length <= 0} style={styles.button} onPress={publish} />
                    </View>
                </View>
            </PageModal>
            <PageModal
                ref={refuseModal}
                style={{height: px(315)}}
                header={
                    <View style={styles.auditHeader}>
                        <Text style={styles.auditHeaderLeft}>{refuseObj.title}</Text>
                        {refuseObj.right_button ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={Style.flexRow}
                                onPress={() => {
                                    jump(refuseObj.right_button.url);
                                }}>
                                <Text style={styles.auditHeaderRight}>{refuseObj.right_button.text}</Text>
                                <FastImage
                                    source={{
                                        uri:
                                            'http://static.licaimofang.com/wp-content/uploads/2022/10/right-blue-icon.png',
                                    }}
                                    style={{width: px(10), height: px(10), marginLeft: px(4)}}
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                }>
                <View style={{}}>
                    <TextInput
                        value={refuseObj.reason}
                        editable={false}
                        multiline={true}
                        style={styles.input}
                        maxLength={500}
                        textAlignVertical="top"
                        placeholder=""
                    />
                </View>
            </PageModal>
        </View>
    );
};

export default SpecialDetailDraft;

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
        width: px(255),
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
        color: '#545968',
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
    auditHeader: {
        paddingVertical: px(16),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 0.5,
    },
    auditHeaderLeft: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#1e2331',
    },
    auditHeaderRight: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#0051cc',
    },
    auditContent: {
        flex: 1,
    },
    auditFooter: {
        paddingTop: px(8),
        paddingBottom: isIphoneX() ? 34 : px(8),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    auditFooterLeftBtn: {
        borderWidth: 0.5,
        borderColor: '#545968',
        borderRadius: px(6),
        width: px(165),
        paddingVertical: px(12),
    },
    auditFooterRightBtn: {
        borderRadius: px(6),
        width: px(165),
        paddingVertical: px(12),
        backgroundColor: '#0051CC',
    },
    auditFooterLeftBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#545968',
        textAlign: 'center',
    },
    auditFooterRightBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#fff',
        textAlign: 'center',
    },
});
