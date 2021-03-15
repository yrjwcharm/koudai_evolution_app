/*
 * @Date: 2021-01-12 21:35:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-15 21:52:27
 * @Description:
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Image,
    Keyboard,
    Modal as _Modal,
    PermissionsAndroid,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native';
// import { Header, NavigationActions } from 'react-navigation'
// import {AudioRecorder, AudioUtils} from 'react-native-audio'
// import RNFS from 'react-native-fs'
// import Sound from 'react-native-sound'
import {ChatScreen} from '../../components/IM';
// import {ChatScreen} from 'react-native-easy-chat-ui';
import {useHeaderHeight} from '@react-navigation/stack';
import {isIphoneX, px, requestExternalStoragePermission, deviceWidth, deviceHeight} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import HTML from '../../components/RenderHtml';
import http from '../../services';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import {BottomModal, Modal} from '../../components/Modal';
import {Button} from '../../components/Button';
import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';
import _ from 'lodash';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import Toast from '../../components/Toast';
import upload from '../../services/upload';
import ImageViewer from 'react-native-image-zoom-viewer';
import BaseUrl from '../../services/config';
const url = BaseUrl.WS;
const interval = 5 * 60 * 1000; //时间显示 隔5分钟显示
const _timeout = 4000; //检测消息是否发送成功
const maxConnectTime = 20 * 60 * 1000; //最大连接时间
let heartCheckTime = null;
let WsColseType = 1; //1表示为用户主动正常关闭,0表示异常关闭需要重新连接,2表示重新连接次数超过3次.判断为网络异常.请用户确认网络情况
let closeSelf = false; //是否是自己主动关闭
/**
 * @description:
 * @param {*} targetId: 消息谁发的就是谁的用户ID
             chatInfo: 与你聊天人的资料(id, 头像, 昵称)
 * @return {*}
 */
const IM = (props) => {
    const userInfo = useSelector((store) => store.userInfo);
    const headerHeight = useHeaderHeight();
    const [uid, setUid] = useState('');
    const [intellectList, setIntellectList] = useState([]); //智能提示列表
    const [shortCutList, setShortCutList] = useState([]); //底部快捷提问菜单
    const [modalContent, setModalContent] = useState(null); //弹窗内容
    const [fullImageUrl, setFullImageUrl] = useState('');
    const [showFullImage, setShowFullImage] = useState(false); //查看大图
    let _ChatScreen = useRef(null);
    let token = useRef(null);
    let WS = useRef(null);
    let page = useRef(1);
    let timeout = useRef(null);
    let _uid = useRef(null);
    let lastShowTimeStamp = useRef(null);
    let connectTime = useState(''); //链接时长
    let unverifiedMsg = useRef([]);

    const [messages, setMessages] = useState([]);
    const bottomModal = useRef(null);
    const clearIntelList = () => {
        intellectList.length > 0 && setIntellectList([]);
    };
    useEffect(() => {
        initWebSocket();
        Keyboard.addListener('keyboardWillHide', clearIntelList);
        return props.navigation.addListener('beforeRemove', closeWs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /**
     * 初始化WebSocket
     */
    const initWebSocket = () => {
        try {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            WS.current = new WebSocket(url);
            initWsEvent();
        } catch (e) {
            console.log('WebSocket err:', e);
            //重连
            reconnect();
        }
    };
    const closeWs = (e) => {
        e.preventDefault();
        closeSelf = true;
        WsColseType = 1;
        clearTimeout(heartCheckTime);
        clearTimeout(timeout?.current);
        WS.current && WS.current.close();
        props.navigation.dispatch(e.data.action);
    };
    /**
     * 初始化WebSocket相关事件
     */
    const initWsEvent = () => {
        //建立WebSocket连接
        WS.current.onopen = function () {
            http.get(`${BaseUrl.IMApi}/im/token`)
                .then((data) => {
                    setUid(data.result.uid);
                    _uid.current = data.result.uid;
                    token.current = data.result.token;
                    WS.current.send(handleMsgParams('LIR', 'loign'));
                    console.log(handleMsgParams('LIR', 'loign'));
                })
                .catch(() => {
                    handelSystemMes('连接错误');
                });
            console.log('WebSocket:', 'connect to server');
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
                        connectTime.current = new Date().getTime();
                        WS.current.send(handleMsgParams('LMR', {page: 1}));
                        WS.current.send(handleMsgParams('QMR', {question_id: 0}));
                        heartCheck();
                        _data.data.result.questions && setShortCutList(_data.data.result.questions);
                        // 再次链接时，将为发送出去的消息发出去
                        unverifiedMsg.current.forEach((item) => {
                            WS.current.send(handleMsgParams(item.cmd, item.content, item.cmid));
                            setTimeout(() => {
                                checkStatus(item.cmid, -1);
                            }, _timeout);
                        });
                    } else {
                        handelSystemMes(_data.data.message);
                        // Toast.show(_data.data.message);
                    }
                    break;
                //发送消息回馈
                case 'SMA': //点击按钮的恢复
                case 'TNA':
                case 'IMA':
                case 'EMA':
                case 'VMA':
                case 'AMA':
                case 'CMN': //链接客服回复
                case 'LAA': //登录的提示语
                    if (_data.data) {
                        handleMessage(_data);
                    } else {
                        checkStatus(_data.cmid, 1);
                    }
                    break;
                //收到问题列表
                case 'QMA':
                    if (_data.data?.result) {
                        handleMessage(_data);
                    } else {
                        // checkStatus(_data.cmid, 1);
                    }
                    break;
                //收到历史信息
                case 'LMA':
                    if (_data.data.code == 20000) {
                        if (_data.data.result.messages.length > 0) {
                            handleMessage(_data.data.result.messages);
                        }
                    }
                    break;
                //输入提示
                case 'DMA':
                    _data?.data?.code == 20000 && setIntellectList(_data.data.result.questions);
                    break;
                //直接是问题答案
                case 'BMA':
                    if (_data.data) {
                        handleMessage(_data);
                    } else {
                        // checkStatus(_data.cmid, 1);
                    }

                    break;
                //接收到图片
                case 'IMN':
                    if (_data.data) {
                        handleMessage(_data);
                        WS.current.send(handleMsgParams('IAR', 'success', _data.cmid));
                    }
                    break;
                //接收到文章
                case 'AMN':
                    if (_data.data) {
                        handleMessage(_data);
                        WS.current.send(handleMsgParams('AAR', 'success', _data.cmid));
                    }
                    break;
            }
        };
        //连接错误
        WS.current.onerror = function () {
            console.log('WebSocket:', 'connect to server error');
            //重连
            WsColseType = 0;
            //重连
            reconnect();
        };
        //连接关闭
        WS.current.onclose = function () {
            console.log('WebSocket:', 'connect close');
            if (WsColseType !== 'timeout') {
                WsColseType = 0;
            }
            //连接被关闭尝试重连 要区分是主动关闭还是异常关闭
            if (!closeSelf) {
                reconnect();
            }
            //重连
        };
    };
    //断开重连
    const reconnect = () => {
        if (timeout?.current) {
            clearTimeout(timeout?.current);
        }
        timeout.current = setTimeout(function () {
            //重新连接WebSocket
            initWebSocket();
        }, 15000);
    };
    const heartCheck = () => {
        if (new Date().getTime() - connectTime.current > maxConnectTime) {
            WS.current.close();
            WsColseType = 'timeout';
            handelSystemMes('由于您长时间未响应，自动断开连接。您可以重新发送信息重新召唤顾问~');
        }
        if (WsColseType != 'timeout') {
            clearTimeout(heartCheckTime);
            heartCheckTime = setTimeout(() => {
                heartCheck();
            }, 5 * 1000);
        }
    };
    const handelSystemMes = (content) => {
        let cmid = randomMsgId('STA');
        handleMessage({
            cmd: 'STA',
            cmid: cmid,
            data: content,
            from: 'S',
            time: new Date().getTime(),
        });
    };
    const handleMessage = (message) => {
        const getType = (cmd) => {
            switch (cmd) {
                case 'IMN':
                case 'IMR':
                    return 'image';
                case 'BMA':
                    return 'textButton';
                case 'AMN':
                    return 'article';
                case 'QMA':
                    return 'Question';
                case 'STA':
                    return 'system';
                default:
                    return 'text';
            }
        };
        let _mes = [];

        const genMessage = (_message) => {
            return {
                id: _message.cmid,
                type: getType(_message.cmd),
                content: _message.data,
                targetId: `${_message.from}`,
                renderTime: _message.renderTime || true,
                sendStatus: _message.sendStatus || 1,
                chatInfo: {
                    id: _message.to,
                    nickName: _message?.user_info?.nickname || '智能客服',
                    avatar: _message?.user_info?.avatar,
                },
                time: _message.time,
            };
        };
        if (Array.isArray(message) && message.length > 0) {
            lastShowTimeStamp.current = message[message.length - 1].time;
            message.forEach((item, index) => {
                if (item.time - lastShowTimeStamp.current > interval) {
                    lastShowTimeStamp.current = item.time;
                    _mes.push(genMessage({...item, renderTime: true}));
                } else {
                    _mes.push(genMessage({...item, renderTime: false}));
                }
            });
        } else {
            if (new Date().getTime() - lastShowTimeStamp.current > interval) {
                _mes = [genMessage({...message, renderTime: true})];
                lastShowTimeStamp.current = message.time;
            } else {
                _mes = [genMessage({...message, renderTime: false})];
            }
        }
        setMessages((pre) => {
            return pre.concat(_mes);
        });
        return [...messages, ..._mes];
    };

    //点击发送按钮发送消息
    const sendMessage = (type, content, isInverted, cmd = 'TMR', question_id, sendStatus) => {
        console.log(userInfo.toJS().avatar);
        let cmid = randomMsgId(cmd);
        const newMessages = handleMessage({
            cmid: cmid,
            data: content,
            cmd,
            from: uid,
            to: 'S',
            type,
            sendStatus: sendStatus || 0,
            user_info: {
                avatar: userInfo.toJS().avatar,
            },
            time: `${new Date().getTime()}`,
        });
        wsSend(cmd, content, question_id, cmid, newMessages);
    };
    //真实发送
    const wsSend = (cmd, content, question_id, cmid, messagesArg) => {
        if (cmd == 'TMR' || cmd == 'IMR') {
            unverifiedMsg.current.push({cmid, content, cmd});
        }
        if (WS.current && WS.current.readyState === WebSocket.OPEN) {
            try {
                WS.current.send(handleMsgParams(cmd, cmd == 'QMR' ? question_id : content, cmid));

                if (cmd == 'TMR' || cmd == 'IMR') {
                    setTimeout(() => {
                        checkStatus(cmid, -1, messagesArg);
                    }, _timeout);
                }
            } catch (err) {
                console.warn('WS.current sendMessage', err.message);
            }
        } else {
            console.log('WebSocket:', 'connect not open to send message');
        }
    };
    //转人工客服
    const staff = () => {
        sendMessage(null, '转投资顾问', null, 'CMR', 1);
        // handelSystemMes('正在转到投资顾问，请稍等…');
    };
    //问题解决 未解决
    const submitQues = (status, question_id, id, isModal) => {
        if (status == 2 || status == 3) {
            return;
        }
        wsSend('SMR', {status, question_id});
        let _modalContent = {...modalContent};
        let copyMes = [].concat(messages);
        copyMes.forEach((item) => {
            if (item.id == id) {
                console.log(item, 'item');
                item.content.buttons.forEach((button, index) => {
                    if (button.status == status) {
                        console.log('button', button);
                        button.status = 2;
                        if (isModal) {
                            _modalContent.buttons[index].status = 2;
                        }
                    } else {
                        console.log('button3', button);
                        if (isModal) {
                            _modalContent.buttons[index].status = 3;
                        }
                        button.status = 3;
                    }
                });
            }
        });
        setMessages(copyMes);
        isModal && setModalContent(_modalContent);
    };
    const showPop = (content) => {
        setModalContent(content);
        bottomModal.current.show();
    };
    /**
     * @description: 处理发送消息参数
     * @param {*}
     * @return {*}
     */
    const handleMsgParams = (cmd, content, cmid) => {
        var params = {};
        params.token = token.current;
        params.cmd = cmd;
        params.from = _uid.current;
        params.cmid = cmid || randomMsgId(cmd);
        params.to = 'S';
        params.data = content;
        return JSON.stringify(params);
    };
    const checkStatus = (cmid, status, messagesArg) => {
        if (!cmid) {
            return;
        }
        status == 1 &&
            unverifiedMsg.current.forEach((item, index) => {
                if (item.cmid == cmid) {
                    unverifiedMsg.current.splice(index, 1);
                }
            });
        setMessages(
            messagesArg.map((item) => {
                if (item.id == cmid) {
                    return {...item, sendStatus: status};
                } else {
                    return item;
                }
            })
        );
    };
    const loadHistory = () => {
        WS.current.send(handleMsgParams('LMR', {page: page.current++}));
    };
    //转换时间20210312115002
    const genTimeStamp = () => {
        var date = new Date();
        return (
            date.getFullYear().toString() +
            _handleTime(date.getMonth() + 1) +
            _handleTime(date.getDate()) +
            _handleTime(date.getHours()) +
            _handleTime(date.getMinutes()) +
            _handleTime(date.getSeconds())
        );
    };
    /**
     * @description: 根据cmd生产消息ID
     * @param {*} cmd
     * @return {*}
     */
    const randomMsgId = (cmd) => {
        cmd ? cmd : '';
        var str =
            genTimeStamp() +
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
    };

    //打开相册
    const openPicker = () => {
        const options = {
            quality: 0.4,
            // maxWidth: px(238),
            // maxHeight: px(300),
        };
        setTimeout(() => {
            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let cmid = randomMsgId('IMR');
                    let mewMes = handleMessage({
                        cmd: 'IMR',
                        cmid,
                        data: response.uri,
                        from: uid,
                        to: 'S',
                        sendStatus: 0,
                        user_info: {
                            avatar: userInfo.toJS().avatar,
                        },
                        time: `${new Date().getTime()}`,
                    });
                    setTimeout(() => {
                        _ChatScreen?.current?.closeAll();
                    });
                    upload(
                        'http://mapi.lengxiaochu.mofanglicai.com.cn:10080/20170831/webim/upload/oss',
                        response,
                        [
                            {name: 'file_key', data: cmid},
                            {name: 'uid', data: uid},
                            {name: 'token', data: token.current},
                        ],
                        (res) => {
                            if (res.code == 20000) {
                                wsSend('IMR', res.result.url, null, cmid, mewMes);
                            } else {
                                checkStatus(cmid, -1, mewMes);
                            }
                        }
                    );
                }
            });
        }, 100);
    };
    //点击查看大图
    const pressMessage = (type, index, uri, message) => {
        if (type == 'image') {
            setShowFullImage(true);
            setFullImageUrl(uri);
        }
    };
    // 选择图片或相册
    const onClickChoosePicture = async () => {
        try {
            if (Platform.OS == 'android') {
                requestExternalStoragePermission(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    openPicker,
                    blockCal
                );
            } else {
                requestExternalStoragePermission(PERMISSIONS.IOS.PHOTO_LIBRARY, openPicker, blockCal);
            }
        } catch (err) {
            console.warn(err);
        }
    };
    //权限提示弹窗
    const blockCal = () => {
        Modal.show({
            title: '权限申请',
            content: '权限没打开,请前往手机的“设置”选项中,允许该权限',
            confirm: true,
            confirmText: '前往',
            confirmCallBack: () => {
                openSettings().catch(() => console.warn('cannot open settings'));
            },
        });
    };
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
        return shortCutList.length > 0 ? (
            <ScrollView horizontal={true} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
                <View
                    style={{
                        paddingHorizontal: px(14),
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        height: px(37),
                    }}>
                    {shortCutList.map((item, index) => (
                        // type, content, isInverted, cmd
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={index}
                            style={styles.shortCutItem}
                            onPress={() => {
                                sendMessage('text', item.question, null, 'QMR', {question_id: item.question_id}, 1);
                                Keyboard.dismiss();
                            }}>
                            <Text style={{fontSize: 12, color: '#545968'}}>{item.question}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        ) : null;
    };
    const renderIntelList = () => {
        return intellectList.length > 0 ? (
            <View style={styles.intellectList}>
                {intellectList.map((item, index) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        key={index}
                        style={[
                            {height: px(43), borderTopColor: '#E2E4EA', borderTopWidth: index == 0 ? 0 : 0.5},
                            Style.flexRow,
                        ]}
                        onPress={() => {
                            sendMessage('text', item.question_ori, null, 'QMR', item.question_id, 1);
                            Keyboard.dismiss();
                            clearIntelList();
                        }}>
                        <HTML style={{fontSize: px(14)}} html={item.question} />
                    </TouchableOpacity>
                ))}
            </View>
        ) : null;
    };
    const renderTextButton = ({isOpen, isSelf, message}) => {
        var id = message.id;
        message = message?.content;
        return (
            message && (
                <View style={{flexDirection: 'row'}}>
                    <View style={[styles.triangle, styles.left_triangle]} />
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width: px(238),
                            borderRadius: px(4),
                        }}>
                        <View style={{paddingHorizontal: px(12)}}>
                            <Text
                                style={{fontSize: px(14), lineHeight: px(20), marginVertical: px(16)}}
                                numberOfLines={8}>
                                {message?.answer}
                            </Text>
                            {message?.hasOwnProperty('expanded') && message?.expanded == false ? (
                                <View
                                    style={{
                                        paddingVertical: px(14),
                                        justifyContent: 'center',
                                        borderTopColor: '#E2E4EA',
                                        borderTopWidth: 0.5,
                                    }}>
                                    <View style={Style.flexBetween}>
                                        {message?.status !== -1 ? (
                                            <Text style={styles.sm_text}>
                                                {message?.status == 0 ? ' 该问题未解决' : '该问题已解决'}
                                            </Text>
                                        ) : (
                                            <Text />
                                        )}
                                        <Text
                                            onPress={() => {
                                                showPop({...message, id});
                                            }}
                                            style={[styles.sm_text, {color: Colors.btnColor}]}>
                                            展开全部{' '}
                                            <FontAwesome name={'angle-down'} size={14} color={Colors.btnColor} />
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                message?.buttons?.length > 0 && (
                                    <>
                                        <View style={[Style.flexRowCenter, {marginBottom: px(16)}]}>
                                            {message?.buttons?.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        key={index}
                                                        title={item.text}
                                                        onPress={() => {
                                                            submitQues(item.status, message.question_id, id);
                                                        }}
                                                        style={[
                                                            Style.flexRowCenter,
                                                            styles.button,
                                                            {
                                                                backgroundColor:
                                                                    item.status == 2 ? Colors.btnColor : '#fff',
                                                            },
                                                        ]}>
                                                        <Text
                                                            style={{
                                                                fontSize: px(12),
                                                                color:
                                                                    item.status == 2 ? '#fff' : Colors.lightGrayColor,
                                                            }}>
                                                            {item.text}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                        {message?.buttons && message?.buttons[0].status == 2 ? (
                                            <Text style={[styles.sm_text, {marginBottom: px(10)}]}>
                                                还未解决？转
                                                <Text onPress={staff} style={{color: Colors.btnColor}}>
                                                    投资顾问
                                                </Text>
                                            </Text>
                                        ) : null}
                                    </>
                                )
                            )}
                        </View>
                    </View>
                </View>
            )
        );
    };
    //文章
    const renderArticle = ({isOpen, isSelf, message}) => {
        const article = message?.content;
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={[styles.triangle, styles.left_triangle]} />
                <View style={styles.article_con}>
                    <FastImage
                        source={{uri: article.img}}
                        style={{width: px(60), height: px(60), borderRadius: px(4)}}
                    />
                    <View
                        style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginLeft: px(8)}}>
                        <Text style={{lineHeight: px(20)}} numberOfLines={2}>
                            {article.desc}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{fontSize: px(11), color: Colors.lightGrayColor, lineHeight: px(16)}}>
                            {article.desc}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderQuestionMessage = ({isOpen, isSelf, message}) => {
        message = message.content.result;
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={[styles.triangle, styles.left_triangle]} />
                <View
                    style={{
                        backgroundColor: '#fff',
                        width: px(238),
                        borderRadius: px(4),
                    }}>
                    <View style={{paddingHorizontal: px(12)}}>
                        {message?.head ? (
                            <View style={styles.card_head}>
                                <Text style={{color: Colors.lightGrayColor, fontSize: px(12), lineHeight: px(17)}}>
                                    {message?.head}
                                </Text>
                            </View>
                        ) : null}
                        {message?.questions?.map((item, index) => (
                            <TouchableHighlight
                                key={index}
                                underlayColor="#eee"
                                onPress={() => {
                                    sendMessage('text', item.question, null, 'QMR', {question_id: item.question_id}, 1);
                                }}
                                style={{
                                    height: px(43),
                                    justifyContent: 'center',
                                    borderTopColor: '#E2E4EA',
                                    borderTopWidth: index == 0 ? 0 : 0.5,
                                }}>
                                <View style={Style.flexBetween}>
                                    <Text>{item.question}</Text>
                                    <FontAwesome name={'angle-right'} size={18} color={'#9AA1B2'} />
                                </View>
                            </TouchableHighlight>
                        ))}
                        {message?.foot ? (
                            <View
                                style={{
                                    paddingVertical: px(14),
                                    justifyContent: 'center',
                                    borderTopColor: '#E2E4EA',
                                    borderTopWidth: 0.5,
                                }}>
                                <Text style={[styles.sm_text, {textAlign: 'left'}]}>
                                    以上问题都没有，请转
                                    <Text onPress={staff} style={{color: Colors.btnColor}}>
                                        投资顾问
                                    </Text>
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };
    const renderLoad = () => {
        //这里是写的一个loading
        return (
            <View style={{marginTop: deviceHeight / 2, flex: 1}}>
                <ActivityIndicator />
            </View>
        );
    };
    return (
        <View style={{flex: 1}}>
            <BottomModal
                style={{height: px(442), backgroundColor: '#fff'}}
                ref={bottomModal}
                title={modalContent?.head}>
                <ScrollView style={{flex: 1}}>
                    <View
                        style={{
                            paddingHorizontal: px(16),
                            paddingTop: px(22),
                            paddingBottom: isIphoneX() ? 34 : px(20),
                        }}>
                        <Text style={{fontSize: px(13), color: Colors.lightBlackColor, lineHeight: px(20)}}>
                            {modalContent?.answer_ori}
                        </Text>
                        {modalContent?.buttons ? (
                            <>
                                <View style={[Style.flexRowCenter, {marginTop: px(30), marginBottom: px(16)}]}>
                                    {modalContent?.buttons?.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                key={index}
                                                title={item.text}
                                                onPress={() => {
                                                    submitQues(
                                                        item.status,
                                                        modalContent.question_id,
                                                        modalContent.id,
                                                        'modal'
                                                    );
                                                }}
                                                style={[
                                                    Style.flexRowCenter,
                                                    styles.button,
                                                    {backgroundColor: item.status == 2 ? Colors.btnColor : '#fff'},
                                                ]}>
                                                <Text
                                                    style={{
                                                        fontSize: px(12),
                                                        color: item.status == 2 ? '#fff' : Colors.lightGrayColor,
                                                    }}>
                                                    {item.text}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                {modalContent?.buttons && modalContent?.buttons[0].status == 2 ? (
                                    <Text style={styles.sm_text}>
                                        以上问题都没有，请转
                                        <Text onPress={staff} style={{color: Colors.btnColor}}>
                                            投资顾问
                                        </Text>
                                    </Text>
                                ) : null}
                            </>
                        ) : null}
                    </View>
                </ScrollView>
            </BottomModal>
            <_Modal visible={showFullImage} transparent={true}>
                <ImageViewer
                    imageUrls={[{url: fullImageUrl}]}
                    loadingRender={renderLoad}
                    enableSwipeDown={true}
                    saveToLocalByLongPress={false}
                    onSwipeDown={() => {
                        setShowFullImage(false);
                    }}
                    onClick={() => {
                        setShowFullImage(false);
                    }}
                />
            </_Modal>
            <ChatScreen
                ref={_ChatScreen}
                messageList={messages}
                isIPhoneX={isIphoneX()}
                inverted={true}
                iphoneXBottomPadding={24}
                containerBackgroundColor={Colors.inputBg}
                sendMessage={sendMessage}
                inputStyle={styles.inputStyle}
                inputOutContainerStyle={{backgroundColor: '#F7F7F7'}}
                usePopView={true} //长按消息选项
                useVoice={false} //关闭语音
                headerHeight={headerHeight}
                loadHistory={loadHistory}
                CustomImageComponent={FastImage}
                intellectList={renderIntelList}
                showUserName={true}
                chatType={'group'}
                avatarStyle={{width: px(38), height: px(38), borderRadius: px(4), marginHorizontal: px(6)}}
                shortCutList={renderShortCutList}
                renderQuestionMessage={renderQuestionMessage}
                renderTextButton={renderTextButton}
                onEndReachedThreshold={0.2}
                renderArticle={renderArticle}
                panelSource={[{text: '相册', icon: require('../../assets/img/photo.png')}]}
                onMessagePress={pressMessage}
                textOnChange={_.debounce((text) => {
                    wsSend('DMR', text);
                }, 500)}
                textMessageContanierStyle={{
                    paddingVertical: px(12),
                    maxWidth: px(238),
                }}
                messageErrorIcon={<AntDesign name="exclamationcircle" size={px(16)} color={Colors.orange} />}
                rightMessageTextStyle={styles.text}
                leftMessageTextStyle={styles.text}
                userNameStyle={{marginBottom: px(6)}}
                rightMessageBackground={'#CEE3FE'}
                renderPanelRow={(item, index) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{alignItems: 'center'}}
                        key={index}
                        onPress={onClickChoosePicture}>
                        <FastImage source={item.icon} style={{width: px(50), height: px(50), marginBottom: px(10)}} />
                        <Text style={{color: Colors.lightGrayColor, fontSize: px(12)}}>{item.text}</Text>
                    </TouchableOpacity>
                )}
                userProfile={{
                    //个人资料
                    id: `${uid}`,
                    avatar: userInfo.toJS().avatar,
                }}
                // sendIcon={<Text>发送</Text>}

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
        marginRight: px(6),
    },
    triangle: {
        width: 0,
        height: 0,
        zIndex: 999,
        borderWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderColor: '#fff',
        marginTop: 16,
        marginRight: -2,
    },
    left_triangle: {
        borderLeftWidth: 0,
        marginTop: 8,
        borderRightWidth: Platform.OS === 'android' ? 6 : 10,
    },
    button: {
        height: px(32),
        width: px(88),
        borderRadius: px(16),
        marginLeft: px(12),
        backgroundColor: 'transparent',
        borderColor: '#E2E4EA',
        borderWidth: 0.5,
    },
    sm_text: {
        textAlign: 'center',
        fontSize: px(12),
        color: Colors.lightGrayColor,
    },
    intellectList: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        position: 'absolute',
        bottom: px(61),
        width: deviceWidth,
        zIndex: 100,
    },
    text: {
        fontSize: px(14),
        lineHeight: px(20),
    },
    card_head: {
        justifyContent: 'center',
        borderBottomColor: '#E2E4EA',
        borderBottomWidth: 0.5,
        paddingVertical: px(14),
    },
    article_con: {
        backgroundColor: '#fff',
        width: px(238),
        borderRadius: px(4),
        padding: px(8),
        flexDirection: 'row',
    },
});
