/*
 * @Date: 2022-10-15 16:57:18
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-02 19:33:11
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/components/RichTextInputModal.js
 * @Description: 富文本编辑器
 */

import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {deviceWidth, px} from '~/utils/appUtil';

import {BottomModal} from '~/components/Modal';
import {WebView as RNWebView} from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html lang="zh" class="focus-outline-visible" lazy-loaded="true">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
  <title>标题</title>
  <style>
    body {
      margin: 0;
    }

    .con {
      width: 100%;
      height: 150px;
      outline: none;
      font-size: 14px;
      padding: 20px 16px;

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
  <!-- <button onclick="toggleRed(true)" >red</button> -->
  <script>
    const cntMaxLength = 15; // 最大长度为15
    const input = document.getElementById('input')

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
      } else {
        
      }
      
      
      return span
    }

    // 获取焦点
    function focusInput() {
      input.focus()
      const s = window.getSelection();
      s.removeAllRanges();
      let el = insertEl()
      const range = document.createRange()
      range.setStart(el ,0)
      range.setEnd(el,0)
      s.addRange(range);

    }

    function focusLastInput() {
      input.focus()
      const s = window.getSelection();
      s.removeAllRanges();
      const el = insertEl()
      const range = document.createRange()
      range.setStart(el ,0)
      range.setEnd(el,0)
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

      // 富文本限制字数处理
      if (text.length > cntMaxLength) {
        // debugger

        let resultText = text.substr(0, 15)

        let grayHtml = html.replace(tag1, flag1.repeat(tag1.length)).replace(tag2, flag2.repeat(tag2.length))
        let endIndex = 0
        let endInScope = false
        for (let i = 0; i < cntMaxLength; i++) {
          let c
          while (c = grayHtml.charAt(endIndex),c === flag1 || c === flag2) {
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
        type: 'input',
        html: e.target.innerHTML,
        text: e.target.innerText,
      }))
    })
    input.addEventListener('keydown', handleMaxLength)
    input.addEventListener('paste', handleMaxLength)

    // window.ReactNativeWebView = {
    //   postMessage: function(str) {
    //     console.log(JSON.parse(str))
    //   }
    // }

    function handleMaxLength(event) {
      log('event:'+ JSON.stringify(event))
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
    // 获取当前颜色，需要点击输入时才有用
    // function getRangeRed() {
    //   let str = document.queryCommandValue('foreColor')
    //   console.log('getRangeRed:',str)
    // }
  </script>
</body>

</html>
`;

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
                        webviewRef.current?.requestFocus?.();
                        setTimeout(() => {
                            webviewRef.current?.injectJavaScript(`focusInput()`);
                        }, 200);
                    }}
                    onMessage={(event) => {
                        const data = event.nativeEvent.data;
                        const msgObj = JSON.parse(data);
                        const {type} = msgObj;
                        if (type === 'input') {
                            setRichText(msgObj);
                        } else if (type === 'range') {
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
