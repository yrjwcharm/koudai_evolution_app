/*
 * @Date: 2021-01-12 21:35:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-08 20:09:41
 * @Description:
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    PermissionsAndroid,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
// import { Header, NavigationActions } from 'react-navigation'
// import {AudioRecorder, AudioUtils} from 'react-native-audio'
// import RNFS from 'react-native-fs'
// import Sound from 'react-native-sound'
import {ChatScreen} from '../../components/IM';
// import {ChatScreen} from 'react-native-easy-chat-ui';
import {useHeaderHeight} from '@react-navigation/stack';
import {isIphoneX, px} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import HTML from '../../components/RenderHtml';
import http from '../../services';
const url = 'ws://192.168.88.68:39503';
/**
 * @description:
 * @param {*} targetId: 消息谁发的就是谁的用户ID
             chatInfo: 与你聊天人的资料(id, 头像, 昵称)
 * @return {*}
 */
const IM = () => {
    const headerHeight = useHeaderHeight();
    const [uid, setUid] = useState('');
    const [intellectList, setIntellectList] = useState([]); //智能提示列表
    const [shortCutList, setShortCutList] = useState([]); //底部快捷提问菜单
    let token = useRef(null);
    let WS = useRef(null);
    let timeout = null;

    const [messages, setMessages] = useState([]);
    useEffect(() => {
        initWebSocket();
    }, [initWebSocket]);
    /**
     * 初始化WebSocket
     */
    const initWebSocket = useCallback(() => {
        try {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            WS.current = new WebSocket(url);
            console.log(WS.current);
            initWsEvent();
        } catch (e) {
            console.log('WebSocket err:', e);
            //重连
            reconnect();
        }
    }, [initWsEvent, reconnect]);
    /**
     * 初始化WebSocket相关事件
     */
    const initWsEvent = useCallback(() => {
        //建立WebSocket连接
        WS.current.onopen = function () {
            http.get('http://mapi.lengxiaochu.mofanglicai.com.cn:10080/20180417/webim/get/token').then((data) => {
                setUid(data.result.uid);
                token = data.result.token;
                WS.current.send(handleMsgParams('LIR', '哈哈哈', data.result.uid));
                console.log(handleMsgParams('LIR', '哈哈哈', data.result.uid));
            });
            // console.log('WebSocket:', 'connect to server');
        };
        //客户端接收服务端数据时触发
        WS.current.onmessage = function (evt) {
            // 消息处理逻辑
            let _data = JSON.parse(evt.data);
            console.log('WebSocket: response msg', _data);
            switch (_data.cmd) {
                //登录状态
                case 'LIA':
                    if (_data.data.code == 20000) {
                        WS.current.send(handleMsgParams('LMR', 0));
                        WS.current.send(handleMsgParams('QMR', 0));
                        // WS.current.send(handleMsgParams('PMR', randomMsgId('PMR'), 1));
                    }
                    break;
                //发送消息回馈
                case 'TMA':
                case 'IMA':
                case 'EMA':
                case 'VMA':
                case 'AMA':
                    if (_data.data && _data.data) {
                        handleMessage(_data.data);
                    } else {
                        // checkStatus(_data.cmid, 1);
                    }
                    break;
            }
        };
        //连接错误
        WS.current.onerror = function () {
            console.log('WebSocket:', 'connect to server error');
            //重连
            reconnect();
        };
        //连接关闭
        WS.current.onclose = function () {
            console.log('WebSocket:', 'connect close');
            //重连
            reconnect();
        };
    }, []);
    const handleMessage = (message, type) => {
        const newMsg = [...messages];
        newMsg.push({
            id: message.cmd,
            type: type || 'text',
            content: message.data,
            targetId: message.from,
            renderTime: false,
            sendStatus: 1,
            chatInfo: {
                id: message.to,
            },
            time: `${new Date().getTime()}`,
        });
        setMessages(newMsg);
    };
    //断开重连
    const reconnect = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(function () {
            //重新连接WebSocket
            initWebSocket();
        }, 15000);
    }, [initWebSocket, timeout]);
    //发送消息
    const sendMessage = (type, content, isInverted) => {
        handleMessage({
            cmd: randomMsgId('TMR'),
            data: content,
            from: uid,
            to: 'S',
            type,
        });
        console.log(content);
        if (WS.current && WS.current.readyState === WebSocket.OPEN) {
            try {
                WS.current.send(handleMsgParams('TMR', content));
            } catch (err) {
                console.warn('WS.current sendMessage', err.message);
            }
        } else {
            console.log('WebSocket:', 'connect not open to send message');
        }
    };
    const handleMsgParams = (cmd, content, _uid) => {
        var params = {};
        params.token = token;
        params.cmd = cmd;
        params.from = _uid || uid;
        params.cmid = randomMsgId(cmd);
        params.to = 'S';
        params.data = content;
        return JSON.stringify(params);
    };
    /**
     * @description: 根据cmd生产消息ID
     * @param {*} cmd
     * @return {*}
     */
    function randomMsgId(cmd) {
        cmd ? cmd : '';
        var date = new Date();
        var str =
            date.getFullYear().toString() +
            _handleTime(date.getMonth() + 1) +
            _handleTime(date.getDate()) +
            _handleTime(date.getHours()) +
            _handleTime(date.getMinutes()) +
            _handleTime(date.getSeconds()) +
            '|' +
            cmd +
            '|' +
            // eslint-disable-next-line radix
            parseInt(Math.random() * 10000 + 10000).toString() +
            '|' +
            'A' +
            '|' +
            '0';
        return str;
    }
    /**
     * 处理时间格式
     *
     * @param {any} int
     * @returns
     */
    const _handleTime = (int) => {
        return int < 10 ? '0' + int.toString() : int.toString();
    };
    const renderShortCutList = () => {
        return (
            <ScrollView>
                <View
                    style={{
                        paddingHorizontal: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginTop: 11,
                    }}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.shortCutItem}>
                        <Text style={{fontSize: 12, color: '#545968'}}>魔方公司介绍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.shortCutItem}>
                        <Text style={{fontSize: 12, color: '#545968'}}>资金安全</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.shortCutItem}>
                        <Text style={{fontSize: 12, color: '#545968'}}>个性化定制</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.shortCutItem}>
                        <Text style={{fontSize: 12, color: '#545968'}}>购买须知</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };
    const renderIntelList = () => {
        return null;
        // return (
        //     <View style={{backgroundColor: '#fff', paddingHorizontal: px(16)}}>
        //         <TouchableOpacity activeOpacity={0.8} style={[{height: px(43)}, Style.flexRow]}>
        //             <HTML style={{fontSize: px(14)}} html="基金组合有哪些" />
        //         </TouchableOpacity>
        //         <TouchableOpacity activeOpacity={0.8} style={[{height: px(43)}, Style.flexRow]}>
        //             <HTML style={{fontSize: px(14)}} html="基金组合有哪些" />
        //         </TouchableOpacity>
        //     </View>
        // );
    };
    return (
        <View style={{flex: 1}}>
            <ChatScreen
                // rightMessageBackground="#CEE3FE"
                messageList={messages}
                isIPhoneX={isIphoneX()}
                iphoneXBottomPadding={24}
                containerBackgroundColor={Colors.inputBg}
                sendMessage={sendMessage}
                inputStyle={styles.inputStyle}
                inputOutContainerStyle={{backgroundColor: '#F7F7F7'}}
                usePopView={false} //长按消息选项
                useVoice={false} //关闭语音
                headerHeight={headerHeight}
                intellectList={renderIntelList}
                shortCutList={renderShortCutList}
                userProfile={{
                    //个人资料
                    id: uid,
                    avatar: 'https://static.licaimofang.com/wp-content/uploads/2021/01/vip_index_12.png',
                }}
                // sendIcon={<Text>发送</Text>}
                // renderImageMessage={(data) => {
                //     console.log(data);
                // }}
                inputHeightFix={px(5)}
                panelContainerStyle={{backgroundColor: Colors.bgColor}}
            />
        </View>
    );
};
export default IM;
const styles = StyleSheet.create({
    inputStyle: {
        backgroundColor: '#fff',
        borderRadius: px(4),
        paddingTop: Platform.OS == 'ios' ? px(10) : 0,
    },
    shortCutItem: {
        borderRadius: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
});
