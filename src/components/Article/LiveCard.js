/* eslint-disable radix */
/*
 * @Date: 2021-05-31 10:21:59
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-16 17:25:02
 * @Description:直播模块
 */

import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, AppState} from 'react-native';
import {Colors, Style} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import AnimateAvatar from '../AnimateAvatar';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import {Modal} from '../Modal';
import http from '../../services';
import Toast from '../Toast';
const LiveCard = ({data, style, scene}) => {
    // 直播状态:status 1预约 2直播 3回放
    const [reserved, setReserved] = useState(data.reserved);
    const jump = useJump();
    useFocusEffect(
        useCallback(() => {
            setReserved((pre) => {
                if (pre == data.reserved) {
                    return pre;
                } else {
                    return data.reserved;
                }
            });
            return () => {
                AppState.removeEventListener('change', _handleAppStateChange);
            };
        }, [_handleAppStateChange, data.reserved])
    );
    //预约或者跳转进入直播
    const handleClick = () => {
        if (data.status == 1) {
            subscription();
        } else {
            jump(data?.button?.url);
        }
    };
    const _handleAppStateChange = useCallback(
        (nextAppState) => {
            if (nextAppState === 'active' && !reserved) {
                _checkNotifications(
                    () => {
                        postReserve(() => {
                            setReserved(true);
                        });
                    },
                    () => {
                        AppState.removeEventListener('change', _handleAppStateChange);
                        setReserved(false);
                    }
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [reserved]
    );
    const _checkNotifications = (sucess, fail) => {
        checkNotifications().then(({status, settings}) => {
            if (status == 'denied' || status == 'blocked') {
                fail();
            } else {
                sucess();
            }
        });
    };
    const postReserve = (sucess) => {
        http.post('/vision/recommend/reserve/20210524', {id: data.id}).then((res) => {
            if (res.code === '000000') {
                AppState.removeEventListener('change', _handleAppStateChange);
                sucess();
                Toast.show(res.message);
            }
        });
    };
    const subscription = () => {
        if (reserved) {
            return;
        }
        _checkNotifications(
            () => {
                postReserve(() => {
                    setReserved(true);
                });
            },
            () => {
                openLink();
            }
        );
    };
    const openLink = () => {
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {
            if (status == 'granted') {
                postReserve(() => {
                    setReserved(true);
                });
            } else {
                blockCal();
            }
        });
    };
    //权限提示弹窗
    const blockCal = () => {
        Modal.show({
            title: '权限申请',
            content: '我们将在文章更新的时候，为您推送提醒，请开启通知权限。',
            confirm: true,
            confirmText: '前往',
            confirmCallBack: () => {
                AppState.addEventListener('change', _handleAppStateChange);
                openSettings().catch(() => console.warn('cannot open settings'));
            },
        });
    };
    return (
        <TouchableOpacity style={[styles.card, style]} activeOpacity={0.8} onPress={handleClick}>
            {/* 封面 */}
            <FastImage source={{uri: data?.cover}} style={styles.cover} />
            {/* 预约人数直播观看人数 */}
            <View style={[styles.live_order, Style.flexBetween]}>
                <Image
                    source={
                        data?.status == 2
                            ? require('../../assets/img/vision/live.gif')
                            : require('../../assets/img/vision/video.png')
                    }
                    style={{height: px(26), width: px(30), marginLeft: px(-2)}}
                />

                <Text style={{color: '#fff', fontSize: px(11)}}>{data?.people_num_desc}</Text>
            </View>
            {/* 直播状态 */}
            {data?.status_desc ? (
                <View
                    style={[
                        styles.live_status,
                        Style.flexRowCenter,
                        {backgroundColor: data?.status == 1 ? '#F06F1A' : data?.status == 2 ? '#E74949' : '#3E8BFF'},
                    ]}>
                    <Text style={{color: '#fff', fontSize: px(12), fontWeight: '600'}}>{data?.status_desc}</Text>
                </View>
            ) : null}
            <View style={styles.card_bottom}>
                <Text style={styles.title}>{data?.title}</Text>
                {data?.avatar ? (
                    <View
                        style={[
                            Style.flexRow,
                            {
                                marginTop: px(12),
                            },
                        ]}>
                        {data?.status == 2 ? (
                            <AnimateAvatar source={data?.avatar} />
                        ) : (
                            <Image
                                source={{
                                    uri: data?.avatar,
                                }}
                                style={styles.avatar}
                            />
                        )}
                        <Text style={{fontSize: px(13), color: Colors.lightBlackColor, marginHorizontal: px(6)}}>
                            {data?.user_name}
                        </Text>
                    </View>
                ) : null}
                <View style={[Style.flexBetween, {marginTop: px(12)}]}>
                    {data?.start_desc ? (
                        <View style={[styles.time]}>
                            <Text style={styles.time}>{data?.start_desc}</Text>
                        </View>
                    ) : (
                        <View />
                    )}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[
                            styles.button,
                            {
                                backgroundColor: data?.status == 1 && reserved ? '#F5F6F8' : '#fff',
                                borderWidth: data?.status == 1 && reserved ? 0 : px(0.5),
                            },
                        ]}
                        onPress={handleClick}>
                        <Text
                            style={{
                                fontSize: px(13),
                                color: data?.status == 1 && reserved ? '#9AA1B2' : Colors.btnColor,
                            }}>
                            {data?.status == 1 ? (reserved ? '已预约' : '预约') : data?.button?.text}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default LiveCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(8),
        backgroundColor: '#fff',
        width: px(213),
        overflow: 'hidden',
    },
    card_bottom: {
        paddingHorizontal: px(16),
        paddingVertical: px(12),
    },

    title: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        lineHeight: px(20),
    },
    time: {
        color: Colors.defaultColor,
        fontSize: px(11),
        paddingVertical: px(3),
        paddingHorizontal: px(5),
        borderRadius: px(6),
        backgroundColor: Colors.bgColor,
    },
    animate_border: {
        borderColor: 'red',
        width: px(26),
        height: px(26),
        borderWidth: px(1),
        borderRadius: px(15),
        position: 'absolute',
    },
    button: {
        borderColor: Colors.btnColor,
        paddingHorizontal: px(14),
        paddingVertical: px(5),
        borderRadius: px(13),
    },

    cover: {
        height: px(118),
        width: '100%',
    },
    avatar: {
        width: px(26),
        height: px(26),
        borderRadius: px(13),
    },
    live_order: {
        paddingRight: px(8),
        height: px(20),
        position: 'absolute',
        top: px(12),
        overflow: 'hidden',
        left: px(12),
        borderRadius: px(9),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    live_status: {
        height: px(22),
        position: 'absolute',
        top: px(97),
        right: px(0),
        borderTopLeftRadius: px(6),
        paddingHorizontal: px(8),
    },
});
