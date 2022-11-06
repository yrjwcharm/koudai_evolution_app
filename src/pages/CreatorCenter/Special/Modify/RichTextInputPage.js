/*
 * @Date: 2022-10-15 16:57:18
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-05 16:37:20
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/RichTextInputPage.js
 * @Description: 富文本编辑器
 */

import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, Platform, Text, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import NavBar from '~/components/NavBar';
import {deviceWidth, px, isIphoneX} from '~/utils/appUtil';
import {WebView as RNWebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Style} from '~/common/commonStyle';
import {constants} from '~/components/Modal/util.js';

const html = `
<!DOCTYPE html>
<html lang="zh" class="focus-outline-visible" lazy-loaded="true">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
  <title>富文本编辑框</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
    }

    .con {
      width: 100%;
      height: 100%;
      min-height: 150px;
      outline: none;
      font-size: 14px;
      padding: 20px 16px;
      box-sizing: border-box;
    }

    .placeholder {
      color: '#BDC2CC';
      font-size: 14px;
      position: absolute;
      top: 0;
      left: 0;
    }

    .con:empty:before {
      /* content: "请产\u8bf7\u586b\u5199\u4ea7\u54c1\u63a8\u8350\u8bed\uff0c\u6700\u591a\u0031\u0035\u4e2a\u5b57\u7b26";  */
      content: '请填写产品推荐语，最多15个字符';
      color: gray;
    }

    .con:focus:before {
      content: none;
    }
  </style>

</head>

<body>
  <div class="con" id="input" contenteditable="true"></div>
  <!-- <button id="btn" onclick="toggleRedInner()" >red</button> -->
  <script>
    // from  https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
    if (!String.prototype.replaceAll) {
      String.prototype.replaceAll = function (str, newStr) {
        if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
          return this.replace(str, newStr);
        }

        let copy = '' + this
        while (copy && copy.indexOf(str) !== -1) {
          copy = copy.replace(str, newStr)
        }
        return copy
      }
    }


    let isRed = false
    const cntMaxLength = 15; // 最大长度为15
    const input = document.getElementById('input')

    // function toggleRedInner() {
    //   isRed = !isRed
    //   document.getElementById('btn').innerHTML = isRed ? 'Red':'nRed'
    // }
    function log(msg) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'log',
        msg: msg,
      }))
    }

    function insertEl() {

      let span = document.getElementById('last')
      if (!span) {
        span = document.createElement('span')
        span.id = 'last'
        input.appendChild(span)
      }

      return span
    }

    // 获取焦点
    function focusInput() {
      input.focus()
      // const s = window.getSelection();
      // s.removeAllRanges();
      // let el = insertEl()
      // const range = document.createRange()
      // range.setStart(el, 0)
      // range.setEnd(el, 0)
      // s.addRange(range);
      // input.removeChild(el)
    }

    function focusLastInput() {
      input.focus()
      const s = window.getSelection();
      s.removeAllRanges();
      const el = insertEl()
      const range = document.createRange()
      range.setStart(el, 0)
      range.setEnd(el, 0)
      s.addRange(range);
      input.removeChild(el)
    }

    const tag1 = '<span style="color: rgb(255, 0, 0);">'
    const tag2 = "</span>"
    const tag3 = '<span>'

    const flag1 = '☞'
    const flag2 = '☜'

    input.addEventListener('input', (e) => {
      let html = e.target.innerHTML
      let text = e.target.innerText
      log('input: ' + e.target.innerHTML)

      // 富文本限制字数处理
      if (text.length > cntMaxLength) {

        let resultText = text.substr(0, 15)

        let grayHtml = html.replaceAll(tag1, flag1.repeat(tag1.length)).replaceAll(tag2, flag2.repeat(tag2.length))
        let endIndex = 0
        let endInScope = false
        for (let i = 0; i < cntMaxLength; i++) {
          let c
          while (c = grayHtml.charAt(endIndex), c === flag1 || c === flag2) {
            if (c === flag1) {
              endInScope = true
            }
            if (c === flag2) {
              endInScope = false
            }
            endIndex++
          }
          endIndex++
        }

        html = html.substr(0, endIndex) + (endInScope ? tag2 : '')

        e.target.innerHTML = html
        focusLastInput()
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'red',
        // 获取当前颜色是不是红色，需要点击输入时才有用
        value: document.queryCommandValue('foreColor').indexOf('255') !== -1
      }))

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'input',
        html: e.target.innerHTML,
        text: e.target.innerText,
      }))
    })
    input.addEventListener('keydown', handleMaxLength)
    input.addEventListener('paste', handleMaxLength)

    function handleMaxLength(event) {
      log('event handleMaxLength :' + JSON.stringify(event))
      if (this.innerText.length >= cntMaxLength && event.keyCode != 8) {
        event.preventDefault();
      }
    }

    function toggleRed(flag) {
      log('toggleRed:' + flag ? 'red' : null)
      document.execCommand('styleWithCSS', false, flag);
      document.execCommand('foreColor', false, flag ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 0)');
    }

    function setInputValue(str) {
      input.innerHTML = str
    }
  </script>
</body>

</html>
`;

export default function RichTextInputPage({navigation, route}) {
    /** 显示，附带额外参数，用来标记是谁调用的 */
    const {onChangeText, val, extra} = route.params;
    const webviewRef = useRef(null);

    const extraData = useRef(null);
    const [richText, setRichText] = useState({
        html: '',
        text: '',
    });
    const [isRed, setRed] = useState(false);

    useEffect(() => {
        console.log('show:', val, extra);
        const html = val || '';
        const text = html.replace(/<[^>]*>/g, '');
        setRichText({
            html,
            text,
        });
        setRed(false);
        extraData.current = extra;
    }, [route]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleSave = () => {
        onChangeText(richText.html, extraData.current);
        // webviewRef.current?.req;
        navigation.goBack();
    };
    const handleClear = () => {
        setRichText({
            html: '',
            text: '',
        });
        setRed(false);
        webviewRef.current.injectJavaScript(`setInputValue(null);`);
    };

    return (
        <View style={styles.pageWrap}>
            <View style={styles.content}>
                <View style={[styles.header]}>
                    <TouchableOpacity style={styles.close} onPress={handleBack}>
                        <Icon color={Colors.descColor} name={'close'} size={18} />
                    </TouchableOpacity>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.title}>产品推荐语</Text>
                    </View>
                    <TouchableOpacity style={[styles.confirm]} onPress={handleSave}>
                        <Text style={{fontSize: px(14), color: '#0051CC'}}>{'完成'}</Text>
                    </TouchableOpacity>
                </View>
                 
                <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.richTextModal}>
                    <RNWebView
                        style={styles.webView}
                        androidLayerType="software"
                        allowFileAccess
                        allowFileAccessFromFileURLs
                        allowUniversalAccessFromFileURLs
                        javaScriptEnabled
                        source={{html: html}}
                        // source={{uri: 'http://localhost:3000/public/index.html'}}
                        originWhitelist={['*']}
                        startInLoadingState
                        keyboardDisplayRequiresUserAction={false}
                        scalesPageToFit
                        bounces={false}
                        ref={webviewRef}
                        onLoad={() => {
                            console.log('onLoad');
                            webviewRef.current?.injectJavaScript(`setInputValue('${richText.html}')`);
                            // if (Platform.OS === 'ios') {
                            //     webviewRef.current?.requestFocus?.();
                                // setTimeout(() => {
                                //   webviewRef.current?.injectJavaScript(`focusInput()`);
                                // }, 200);
                            // }
                            
                        }}
                        onMessage={(event) => {
                            const data = event.nativeEvent.data;
                            const msgObj = JSON.parse(data);
                            const {type} = msgObj;
                            if (type === 'input') {
                                setRichText(msgObj);
                            } else if (type === 'red') {
                                setRed(msgObj.value);
                            } else if (type === 'log') {
                                console.log('webview msg:', msgObj.msg);
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
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        // backgroundColor: '#fff',
        backgroundColor: 'rgba(0,0,0,0.6)',
        // backgroundColor: 'transparent',
        position: 'relative',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    content: {
        paddingBottom: isIphoneX() ? 34 : 20,
        backgroundColor: '#fff',
        minHeight: constants.bottomMinHeight,
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
        overflow: 'hidden',
    },
    header: {
        paddingVertical: px(16),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
    },
    close: {
        position: 'absolute',
        right: 0,
        left: 0,
        width: 60,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirm: {
        position: 'absolute',
        right: 20,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: Font.textH1,
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
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
