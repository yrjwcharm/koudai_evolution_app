/*
 * @Date: 2021-05-31 10:21:59
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-18 14:06:36
 * @Description:直播模块
 */

import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, AppState, ImageBackground} from 'react-native';
import video from '~/assets/img/vision/video.png';
import live from '~/assets/img/vision/live.gif';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {useJump} from '../hooks';
import AnimateAvatar from '../AnimateAvatar';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import {Modal} from '../Modal';
import http from '~/services';
const LiveCard = ({data, style, coverStyle, scene}) => {
    // 直播状态:status 1预约 2直播 3回放
    const [reserved, setReserved] = useState(data.reserved);
    //特殊处理预约人数
    const [, setReservedNum] = useState(data?.reserved_num);
    //直播推荐位大卡片
    const isLiveRecommend = scene == 'largeLiveCard';
    //是否是回放小卡片 针对回放小卡片特殊处理
    const issmLiveCard = scene == 'smLiveCard';

    const jump = useJump();
    useFocusEffect(
        useCallback(() => {
            setReserved((pre) => {
                return pre == data.reserved ? pre : data.reserved;
            });
            return () => {
                AppState.removeEventListener('change', _handleAppStateChange);
            };
        }, [_handleAppStateChange, data.reserved])
    );
    useEffect(() => {
        setReservedNum(data?.reserved_num);
    }, [data.reserved_num]);
    //预约或者跳转进入直播
    const handleClick = () => {
        if (data.status == 1) {
            subscription();
        } else {
            jump(data?.url);
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
        http.post('/live/reserve/202202015', {id: data.id}).then((res) => {
            if (res.code === '000000') {
                AppState.removeEventListener('change', _handleAppStateChange);
                sucess();
                //预约人数加1
                setReservedNum((pre) => pre + 1);
                //弹窗
                if (res.result?.title) {
                    Modal.show({title: res.result?.title, content: res.result?.desc});
                }
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
                    global.LogTool('visionappointment', data.id);
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
            content: '我们将在直播前10分钟为您推送提醒，请开启通知权限',
            confirm: true,
            confirmText: '前往',
            confirmCallBack: () => {
                AppState.addEventListener('change', _handleAppStateChange);
                openSettings().catch(() => console.warn('cannot open settings'));
            },
        });
    };
    return (
        <TouchableOpacity
            style={[styles.card, style]}
            activeOpacity={0.8}
            onPress={() => {
                global.LogTool('visionbroadcast', data.id);
                jump(data?.url);
            }}>
            {/* 封面 */}
            <ImageBackground source={{uri: data?.cover}} style={[styles.cover, coverStyle]}>
                {/* 预约人数直播观看人数 */}
                <View style={[Style.flexRow, styles.live_order]}>
                    <View
                        style={[
                            Style.flexRow,
                            styles.waitTag,
                            {
                                backgroundColor:
                                    data?.status === 1 ? '#FF7D41' : data?.status === 2 ? Colors.red : 'transparent',
                            },
                        ]}>
                        <Image
                            source={data?.status === 1 || data?.status === 3 ? video : live}
                            style={styles.liveIcon}
                        />
                        <Text style={styles.numDesc}>{data.status === 2 ? '直播中' : data?.people_num_desc}</Text>
                    </View>
                    {data?.status === 1 ? (
                        <View style={[Style.flexRow, styles.waitTag, {paddingLeft: px(6)}]}>
                            <Text style={styles.numDesc}>{data.status_desc}</Text>
                        </View>
                    ) : null}
                </View>
            </ImageBackground>
            <View style={[Style.flexBetween, styles.card_bottom]}>
                {data?.avatar ? (
                    <View style={Style.flexRow}>
                        {!issmLiveCard ? (
                            data?.status === 2 ? (
                                <AnimateAvatar source={data?.avatar} />
                            ) : (
                                <Image
                                    source={{
                                        uri: data?.avatar,
                                    }}
                                    style={styles.avatar}
                                />
                            )
                        ) : null}
                        <View>
                            <Text
                                style={{
                                    fontSize: isLiveRecommend ? px(14) : px(13),
                                    lineHeight: isLiveRecommend ? px(20) : px(18),
                                    color: Colors.lightBlackColor,
                                    marginHorizontal: px(8),
                                    marginLeft: issmLiveCard ? 0 : px(8),
                                    maxWidth: isLiveRecommend ? px(84) : px(78),
                                }}>
                                {data?.user_name}
                            </Text>
                            {data?.user_desc ? (
                                <Text numberOfLines={1} style={styles.user_desc}>
                                    {data?.user_desc}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                ) : null}
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                        styles.button,
                        Style.flexRow,
                        {
                            backgroundColor: data?.status == 1 && reserved ? '#F5F6F8' : '#fff',
                            borderWidth: data?.status == 1 && reserved ? 0 : 0.5,
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
        </TouchableOpacity>
    );
};

export default LiveCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        width: px(213),
        overflow: 'hidden',
    },
    card_bottom: {
        paddingHorizontal: Space.padding,
        height: px(48),
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
        paddingHorizontal: px(12),
        paddingVertical: px(5),
        borderRadius: px(13),
        height: px(26),
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
        borderBottomRightRadius: Space.borderRadius,
        height: px(20),
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    live_status: {
        height: px(22),
        position: 'absolute',
        bottom: px(0),
        right: px(0),
        borderTopLeftRadius: px(6),
        paddingHorizontal: px(8),
    },
    user_desc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightGrayColor,
        marginHorizontal: px(6),
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        marginRight: px(4),
    },
    waitTag: {
        paddingRight: px(6),
        paddingLeft: px(8),
        height: '100%',
    },
    liveIcon: {
        marginRight: px(4),
        width: px(12),
        height: px(12),
    },
    numDesc: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#fff',
    },
});
