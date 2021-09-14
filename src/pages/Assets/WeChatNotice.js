/*
 * @Date: 2021-09-14 09:59:48
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-14 11:57:16
 * @Description: 开启微信通知
 */
import React, {useEffect, useRef, useState} from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import * as WeChat from 'react-native-wechat-lib';
import Image from 'react-native-fast-image';
import Clipboard from '@react-native-community/clipboard';
import {Button} from '../../components/Button';
import {Colors, Style} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import http from '../../services';
import {Modal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {getUserInfo} from '../../redux/actions/userInfo';

const WeChatNotice = ({navigation, route}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const canInit = useRef(false);

    const init = () => {
        http.get('/wechat/notice/info/20210906', {poid: route.params.poid}).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title});
                setData(res.result);
                canInit.current = false;
            }
        });
    };

    const onPress = () => {
        if (data?.status === 0) {
            WeChat.isWXAppInstalled().then((isInstalled) => {
                if (isInstalled) {
                    const scope = 'snsapi_userinfo';
                    const state = '_' + +new Date();
                    try {
                        canInit.current = false;
                        WeChat.sendAuthRequest(scope, state).then((response) => {
                            // console.log(response.code);
                            if (response.code) {
                                http.post('/wechat/open/notice/20210906', {code: response.code}).then((res) => {
                                    Toast.show(res.message);
                                    if (res.code === '000000') {
                                        global.LogTool('bindWX', 'success');
                                        dispatch(getUserInfo());
                                        init();
                                    }
                                });
                            }
                        });
                    } catch (e) {
                        if (e instanceof WeChat.WechatError) {
                            console.error(e.stack);
                        } else {
                            throw e;
                        }
                    }
                } else {
                    Toast.show('请安装微信');
                }
            });
        } else if (data?.status === 2) {
            Clipboard.setString(data?.wx);
            Modal.show({
                confirm: true,
                content: `微信公众账号(${data?.wx})已经复制成功`,
                confirmText: '去粘贴',
                confirmCallBack: () => {
                    WeChat.isWXAppInstalled().then((isInstalled) => {
                        if (isInstalled) {
                            try {
                                canInit.current = true;
                                WeChat.openWXApp();
                            } catch (e) {
                                if (e instanceof WeChat.WechatError) {
                                    console.error(e.stack);
                                } else {
                                    throw e;
                                }
                            }
                        } else {
                            Toast.show('请安装微信');
                        }
                    });
                },
                isTouchMaskToClose: false,
                title: '关注微信公众号',
            });
        }
    };

    const handleStateChange = (nextState) => {
        // console.log(nextState);
        if (nextState === 'active') {
            canInit.current && init();
        }
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        AppState.addEventListener('change', handleStateChange);
        return () => {
            AppState.removeEventListener('change', handleStateChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        Object.keys(data).length > 0 && (
            <View style={styles.container}>
                <View style={[Style.flexRowCenter, {paddingTop: px(40)}]}>
                    <Image source={require('../../assets/personal/wechat.png')} style={styles.wechat} />
                </View>
                <Text style={styles.title}>{data?.head}</Text>
                <View style={{paddingTop: px(12), paddingHorizontal: px(20)}}>
                    <Text style={styles.content}>{data?.content}</Text>
                </View>
                <Button
                    title={data?.button?.text}
                    disabled={!data?.button?.avail}
                    style={{marginTop: px(48), marginHorizontal: px(20)}}
                    onPress={onPress}
                />
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wechat: {
        width: px(60),
        height: px(60),
    },
    title: {
        fontSize: px(18),
        lineHeight: px(25),
        color: Colors.defaultColor,
        textAlign: 'center',
        marginTop: px(20),
    },
    content: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
        textAlign: 'justify',
    },
});

export default WeChatNotice;
