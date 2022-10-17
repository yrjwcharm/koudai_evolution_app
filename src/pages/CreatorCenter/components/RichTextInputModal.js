/*
 * @Date: 2022-10-15 16:57:18
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-17 15:23:19
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/components/RichTextInputModal.js
 * @Description: 富文本编辑器
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Platform,
    TouchableHighlight,
} from 'react-native';

import {deviceHeight, deviceWidth, px} from '~/utils/appUtil';

import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';
import {WebView as RNWebView} from 'react-native-webview';

const source = Platform.select({
    ios: require('~/assets/html/richTextInput.html'),
    android: {uri: 'file:///android_asset/richTextInput.html'},
});

function RichTextModal(props, ref) {
    const {onChangeText} = props;
    const webviewRef = useRef(null);
    const modalRef = useRef(null);

    const extraData = useRef(null);
    const [richText, setRichText] = useState({
        html: '',
        text: '',
    });
    const [isRed, setRed] = useState(false);

    const handleSave = () => {
        onChangeText(richText.html, extraData.current);
    };
    const handleClear = () => {
        setRichText({
            html: '',
            text: '',
        });
        webviewRef.current.injectJavaScript(`setInputValue(null);`);
    };

    /** 显示，附带额外参数，用来标记是谁调用的 */
    const show = (val, extra) => {
        console.log('show:', val, extra);
        const html = val || '';
        const text = html.replace(/<[^>]*>/g, '');
        setRichText({
            html,
            text,
        });
        setRed(false);
        extraData.current = extra;
        modalRef.current?.show();
    };
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
        };
    });

    return (
        <BottomModal
            ref={modalRef}
            title="产品推荐语"
            isTouchMaskToClose={false}
            onDone={handleSave}
            confirmText="完成">
            <View style={styles.richTextModal}>
                <RNWebView
                    style={styles.webView}
                    androidLayerType="software"
                    allowFileAccess
                    allowFileAccessFromFileURLs
                    allowUniversalAccessFromFileURLs
                    javaScriptEnabled
                    source={source}
                    originWhitelist={['*']}
                    startInLoadingState
                    scalesPageToFit
                    bounces={false}
                    ref={webviewRef}
                    onLoad={() => {
                        console.log('onLoad');
                        webviewRef.current?.injectJavaScript(`setInputValue('${richText.html}')`);
                    }}
                    onMessage={(event) => {
                        const data = event.nativeEvent.data;
                        const msgObj = JSON.parse(data);
                        const {type} = msgObj;
                        if (type === 'input') {
                            setRichText(msgObj);
                        } else if (type === 'range') {
                            setRed(msgObj.value);
                        }
                        console.log('event:', data);
                    }}
                    onHttpError={(syntheticEvent) => {
                        const {nativeEvent} = syntheticEvent;
                        console.warn('WebView received error status code: ', nativeEvent.statusCode);
                    }}
                    textZoom={100}
                />
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.redBtn, isRed ? styles.footer_action_redActive : {}]}
                        onPress={() => {
                            webviewRef.current.injectJavaScript(`toggleRed(${isRed ? 'false' : 'true'})`);
                            setRed(!isRed);
                        }}>
                        <Text style={[styles.redBtn_text, isRed ? styles.footer_action_redActive : {}]}>红</Text>
                    </TouchableOpacity>
                    <View style={styles.wordCountWrap}>
                        <Text style={styles.wordCount}>{richText.text.length}/15</Text>
                        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                            <Text style={styles.clearBtn_text}>清空</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </BottomModal>
    );
}

const styles = StyleSheet.create({
    richTextModal: {
        width: deviceWidth,
        height: px(280),
    },
    webView: {
        width: '100%',
        height: px(243),
    },
    footer: {
        width: '100%',
        height: px(34),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    redBtn: {
        height: px(34),
        width: px(34),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px(6),
    },
    redBtn_text: {
        color: '#E74949',
    },
    footer_action_redActive: {
        backgroundColor: '#F5F6F8',
        fontWeight: 'bold',
    },
    wordCountWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    wordCount: {
        color: '#9AA0B1',
        fontSize: px(14),
    },
    clearBtn: {
        paddingLeft: px(16),
    },
    clearBtn_text: {
        color: '#0051CC',
        fontSize: px(14),
    },
});

export default React.forwardRef(RichTextModal);
