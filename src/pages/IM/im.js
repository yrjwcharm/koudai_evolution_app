/*
 * @Date: 2021-01-12 21:35:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-13 15:47:43
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
    PermissionsAndroid,
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
} from 'react-native';
// import { Header, NavigationActions } from 'react-navigation'
// import {AudioRecorder, AudioUtils} from 'react-native-audio'
// import RNFS from 'react-native-fs'
// import Sound from 'react-native-sound'
import {ChatScreen} from '../../components/IM';
// import {ChatScreen} from 'react-native-easy-chat-ui';
import {useHeaderHeight} from '@react-navigation/stack';
import {isIphoneX, px, requestExternalStoragePermission, deviceWidth} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import HTML from '../../components/RenderHtml';
import http from '../../services';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {BottomModal, Modal} from '../../components/Modal';
import {Button} from '../../components/Button';
import {check, PERMISSIONS, RESULTS, request, openSettings} from 'react-native-permissions';
import _ from 'lodash';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import Toast from '../../components/Toast';
const url = 'ws://192.168.88.68:39503';
/**
 * @description:
 * @param {*} targetId: 消息谁发的就是谁的用户ID
             chatInfo: 与你聊天人的资料(id, 头像, 昵称)
 * @return {*}
 */
const IM = () => {
    const userInfo = useSelector((store) => store.userInfo);
    const headerHeight = useHeaderHeight();
    const [uid, setUid] = useState('');
    const [intellectList, setIntellectList] = useState([]); //智能提示列表
    const [shortCutList, setShortCutList] = useState([]); //底部快捷提问菜单
    const [modalContent, setModalContent] = useState(null); //弹窗内容
    const [refresh, setRefresh] = useState(false);
    let token = useRef(null);
    let WS = useRef(null);
    let page = useRef(1);
    let timeout = null;
    let _uid = useRef(null);
    const [messages, setMessages] = useState([]);
    const bottomModal = useRef(null);
    useEffect(() => {
        initWebSocket();

        Keyboard.addListener('keyboardWillHide', clearIntelList);
    }, [initWebSocket, clearIntelList]);
    const clearIntelList = useCallback(() => {
        setIntellectList([]);
    }, []);
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
                _uid.current = data.result.uid;
                token.current = data.result.token;
                WS.current.send(handleMsgParams('LIR', 'loign'));
                console.log(handleMsgParams('LIR', 'loign'));
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
                        WS.current.send(handleMsgParams('LMR', {page: 1}));
                        WS.current.send(handleMsgParams('QMR', {question_id: 0}));
                        _data.data.result.questions && setShortCutList(_data.data.result.questions);
                    } else {
                        Toast.show(_data.data.message);
                    }
                    break;
                //发送消息回馈
                case 'SMA': //点击按钮的恢复
                case 'TMA':
                case 'IMA':
                case 'EMA':
                case 'VMA':
                case 'AMA':
                    if (_data.data) {
                        handleMessage(_data);
                    } else {
                        // checkStatus(_data.cmid, 1);
                    }
                    break;
                //收到问题列表
                case 'QMA':
                    if (_data.data) {
                        handleMessage(_data);
                    } else {
                        // checkStatus(_data.cmid, 1);
                    }
                    break;
                //收到历史信息
                case 'LMA':
                    setRefresh(false);
                    if (_data.data.code == 20000) {
                        if (_data.data.result.messages.length > 0) {
                            handleMessage(_data.data.result.messages);
                        }
                    }
                    break;
                //输入提示
                case 'DMA':
                    _data.data && setIntellectList(_data.data);
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
                    }
                    break;
                //接收到文章
                case 'AMN':
                    if (_data.data) {
                        handleMessage(_data);
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
    }, [handleMessage, handleMsgParams, reconnect]);
    const handleMessage = useCallback((message, messageType, isInverted) => {
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
                default:
                    return 'text';
            }
        };
        let _mes = [];
        //获取图片宽高
        const getImageWH = (uri) => {
            let data = {};
            Image.getSize(uri, (w, h) => {
                data.width = w;
                data.height = h;
                data.uri = uri;
            });
            return data;
        };
        if (Array.isArray(message)) {
            message.forEach((item) => {
                _mes.push({
                    id: item.cmid,
                    type: getType(item.cmd),
                    content: getType(item.cmd) == 'image' ? getImageWH(item.data.uri) : item.data,
                    targetId: `${item.from}`,
                    renderTime: true,
                    sendStatus: item.hasOwnProperty('sendStatus') ? item.sendStatus : 1,
                    chatInfo: {
                        id: item.to,
                        nickName: item?.user_info?.nickname || '智能客服',
                        avatar: item?.user_info?.avatar,
                    },
                    time: item.time,
                });
            });
        } else {
            _mes = [
                {
                    id: message.cmid,
                    type: getType(message.cmd),
                    content: getType(message.cmd) == 'image' ? getImageWH(message.data.uri) : message.data,
                    targetId: `${message.from}`,
                    renderTime: true,
                    sendStatus: message.hasOwnProperty('sendStatus') ? message.sendStatus : 1,
                    chatInfo: {
                        id: message.to,
                        nickName: message?.user_info?.nickname || '智能客服',
                        avatar: message?.user_info?.avatar,
                    },
                    time: message.time,
                },
            ];
        }

        // setMessages((preMes) => {
        //     return isInverted ? [_mes, ...preMes] : [...preMes, _mes];
        // });
        setMessages((preMes) => {
            return [...preMes, ..._mes];
        });
    }, []);

    //断开重连
    const reconnect = useCallback(() => {
        if (timeout?.current) {
            clearTimeout(timeout?.current);
        }
        timeout.current = setTimeout(function () {
            //重新连接WebSocket
            initWebSocket();
        }, 15000);
    }, [initWebSocket, timeout]);
    //点击发送按钮发送消息
    const sendMessage = (type, content, isInverted, cmd, question_id) => {
        handleMessage({
            cmid: randomMsgId(cmd || 'TMR'),
            data: content,
            cmd,
            from: uid,
            to: 'S',
            type,
            sendStatus: 0,
            user_info: {
                avatar: userInfo.toJS().avatar,
            },
            time: `${new Date().getTime()}`,
        });
        wsSend(cmd, content, question_id);
    };
    //真实发送
    const wsSend = (cmd, content, question_id) => {
        if (WS.current && WS.current.readyState === WebSocket.OPEN) {
            try {
                console.log(handleMsgParams(cmd || 'TMR', cmd == 'QMR' ? question_id : content));
                WS.current.send(handleMsgParams(cmd || 'TMR', cmd == 'QMR' ? question_id : content));
            } catch (err) {
                console.warn('WS.current sendMessage', err.message);
            }
        } else {
            console.log('WebSocket:', 'connect not open to send message');
        }
    };
    //问题解决 未解决
    const submitQues = (status, question_id, id) => {
        wsSend('SMR', {status, question_id});
        console.log(id, messages, '123');
        let copyMes = [...messages];
        copyMes.forEach((item) => {
            if (item.id == id) {
                item.content.result.status = status;
            }
        });
        setMessages(copyMes);
        bottomModal.current.hide();
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
    const handleMsgParams = useCallback(
        (cmd, content) => {
            var params = {};
            params.token = token.current;
            params.cmd = cmd;
            params.from = _uid.current;
            params.cmid = randomMsgId(cmd);
            params.to = 'S';
            params.data = content;
            return JSON.stringify(params);
        },
        [randomMsgId]
    );
    const loadHistory = () => {
        console.log('loadHistory');
        setRefresh(true);
        console.log(handleMsgParams('LMR'));
        WS.current.send(handleMsgParams('LMR', {page: page.current++}));
    };
    //转换时间20210312115002
    const genTimeStamp = useCallback(() => {
        var date = new Date();
        return (
            date.getFullYear().toString() +
            _handleTime(date.getMonth() + 1) +
            _handleTime(date.getDate()) +
            _handleTime(date.getHours()) +
            _handleTime(date.getMinutes()) +
            _handleTime(date.getSeconds())
        );
    }, []);
    /**
     * @description: 根据cmd生产消息ID
     * @param {*} cmd
     * @return {*}
     */
    const randomMsgId = useCallback(
        (cmd) => {
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
        },
        [genTimeStamp]
    );

    //打开相册
    const openPicker = () => {
        const options = {
            width: px(300),
            height: px(190),
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
                    sendMessage(
                        'image',
                        {
                            uri: response.uri,
                        },
                        null,
                        'IMR'
                    );
                    // this.uploadImage(response);
                }
            });
        }, 100);
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
                                sendMessage('text', item.question, null, 'QMR', {question_id: item.question_id});
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
                            sendMessage('text', item.question_ori, null, 'QMR', item.question_id);
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
            <View style={{flexDirection: 'row'}}>
                <View style={[styles.triangle, styles.left_triangle]} />
                <View
                    style={{
                        backgroundColor: '#fff',
                        width: px(238),
                        borderRadius: px(4),
                    }}>
                    <View style={{paddingHorizontal: px(12)}}>
                        <Text style={{fontSize: px(14), lineHeight: px(20), marginVertical: px(16)}} numberOfLines={8}>
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
                                        展开全部 <FontAwesome name={'angle-down'} size={14} color={Colors.btnColor} />
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            message?.buttons?.length > 0 && (
                                <>
                                    <View style={[Style.flexRowCenter, {marginBottom: px(16)}]}>
                                        <Button title="未解决" style={styles.button} textStyle={{fontSize: px(12)}} />
                                        <Button
                                            title="已解决"
                                            style={{
                                                ...styles.button,
                                                ...styles.lightBtn,
                                            }}
                                            textStyle={{color: Colors.lightGrayColor, fontSize: px(12)}}
                                        />
                                    </View>
                                    <Text style={[styles.sm_text, {marginBottom: px(10)}]}>
                                        还未解决？转<Text style={{color: Colors.btnColor}}>投资顾问</Text>
                                    </Text>
                                </>
                            )
                        )}
                    </View>
                </View>
            </View>
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
    const renderImageMessage = ({isOpen, isSelf, message}) => {
        console.log('图片111');
        return message.content.uri ? (
            <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={{width: 100, height: 100}}
                source={{uri: message.content.uri}}
            />
        ) : null;
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
                                    sendMessage('text', item.question, null, 'QMR', {question_id: item.question_id});
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
                        {message?.content?.foot ? (
                            <View
                                style={{
                                    paddingVertical: px(14),
                                    justifyContent: 'center',
                                    borderTopColor: '#E2E4EA',
                                    borderTopWidth: 0.5,
                                }}>
                                <Text style={[styles.sm_text, {textAlign: 'left'}]}>
                                    以上问题都没有，请转<Text style={{color: Colors.btnColor}}>投资顾问</Text>
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };
    console.log(messages);
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
                                    <Button
                                        title={'未解决'}
                                        onPress={() => {
                                            submitQues(0, modalContent.question_id, modalContent.id);
                                        }}
                                        style={{...styles.button}}
                                        textStyle={{fontSize: px(12)}}
                                    />
                                    <Button
                                        title={'已解决'}
                                        style={{
                                            ...styles.button,
                                            ...styles.lightBtn,
                                        }}
                                        onPress={() => {
                                            submitQues(1, modalContent.question_id, modalContent.id);
                                        }}
                                        textStyle={{fontSize: px(12), color: Colors.lightGrayColor}}
                                    />
                                </View>
                                <Text style={styles.sm_text}>
                                    以上问题都没有，请转<Text style={{color: Colors.btnColor}}>投资顾问</Text>
                                </Text>
                            </>
                        ) : null}
                    </View>
                </ScrollView>
            </BottomModal>
            <ChatScreen
                messageList={messages}
                isIPhoneX={isIphoneX()}
                inverted={false}
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
                renderArticle={renderArticle}
                panelSource={[{text: '相册', icon: require('../../assets/img/photo.png')}]}
                // renderImageMessage={renderImageMessage}
                textOnChange={_.debounce((text) => {
                    wsSend('DMR', text);
                }, 500)}
                textMessageContanierStyle={{
                    paddingVertical: px(12),
                    maxWidth: px(238),
                }}
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
    lightBtn: {
        marginLeft: px(12),
        backgroundColor: 'transparent',
        borderColor: '#E2E4EA',
        borderWidth: 0.5,
    },
    article_con: {
        backgroundColor: '#fff',
        width: px(238),
        borderRadius: px(4),
        padding: px(8),
        flexDirection: 'row',
    },
});
