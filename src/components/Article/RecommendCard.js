/*
 * @Date: 2021-05-31 10:22:09
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-13 16:14:53
 * @Description:推荐模块
 */
import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, AppState} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import Praise from '../Praise';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import {Modal} from '../Modal';
import LinearGradient from 'react-native-linear-gradient';
import http from '../../services';
import Toast from '../Toast';
import {useFocusEffect} from '@react-navigation/native';
import LazyImage from '../LazyImage';
const RecommendCard = ({data, style, onPress}) => {
    const [is_new, setIsNew] = useState(data.is_new);
    const [reserved, setReserved] = useState(data.reserved);
    const jump = useJump();
    const postReserve = (sucess) => {
        http.post('/vision/recommend/reserve/20210524', {id: data.id}).then((res) => {
            if (res.code === '000000') {
                AppState.removeEventListener('change', _handleAppStateChange);
                sucess();
                Toast.show(res.message);
            }
        });
    };
    useEffect(() => {
        setIsNew((pre_new) => {
            return data.is_new != pre_new ? data.is_new : pre_new;
        });
    }, [data.is_new]);
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
        <>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setIsNew(false);
                    onPress && onPress();
                    jump(data?.url);
                }}
                style={[styles.card, style]}>
                <LazyImage
                    style={{width: '100%', height: px(210)}}
                    source={{
                        uri: data?.cover,
                    }}>
                    {data?.tag_image ? (
                        <FastImage
                            style={styles.tag_img}
                            source={{
                                uri: data?.tag_image,
                            }}
                        />
                    ) : null}
                    {data?.recommend_time ? (
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            style={[styles.bottom_text, Style.flexBetween]}
                            colors={['rgba(0, 0, 0, 0)', 'rgba(27, 25, 32, 1)']}>
                            <Text style={{color: '#fff', fontSize: px(14), fontFamily: Font.numFontFamily}}>
                                {data?.recommend_time}
                            </Text>
                            <TouchableOpacity
                                style={[styles.btn, Style.flexRowCenter]}
                                activeOpacity={0.9}
                                onPress={subscription}>
                                <Text style={[{fontSize: px(13), fontWeight: 'bold'}]}>
                                    {reserved ? '已预约' : '更新提醒'}
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    ) : null}
                </LazyImage>
                <View style={{padding: px(16)}}>
                    {is_new ? (
                        <View>
                            <FastImage
                                source={require('../../assets/img/article/voiceUpdate.png')}
                                style={styles.new_tag}
                            />
                            <Text style={styles.recommend_title} numberOfLines={2}>
                                &emsp;&emsp;
                                {data?.title}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.recommend_title} numberOfLines={2}>
                            {data?.title}
                        </Text>
                    )}
                    <>
                        <View style={[Style.flexRow, {marginTop: px(12)}]}>
                            <FastImage
                                source={{uri: data?.author?.avatar}}
                                style={{
                                    width: px(26),
                                    height: px(26),
                                    borderRadius: px(13),
                                    borderColor: Colors.lineColor,
                                    borderWidth: 0.5,
                                }}
                            />
                            <Text style={{fontSize: px(13), color: Colors.lightBlackColor, marginHorizontal: px(6)}}>
                                {data?.author?.nickname}
                            </Text>
                            {data?.author?.icon ? (
                                <FastImage
                                    source={{uri: data?.author?.icon}}
                                    style={{
                                        width: px(12),
                                        height: px(12),
                                    }}
                                />
                            ) : null}
                        </View>

                        <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                            <Text style={styles.light_text}>{data.view_num}人已阅读</Text>

                            <Praise
                                type={'article'}
                                noClick={true}
                                comment={{
                                    favor_status: data?.favor_status,
                                    favor_num: parseInt(data?.favor_num),
                                    id: data?.id,
                                }}
                            />
                        </View>
                    </>
                </View>
            </TouchableOpacity>
        </>
    );
};

export default RecommendCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(6),
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    recommend_title: {
        fontSize: px(17),
        lineHeight: px(26),
        fontWeight: '700',
    },
    blur_text: {
        fontSize: px(14),
        color: Colors.defaultColor,
        fontWeight: '700',
        marginTop: px(12),
        marginBottom: px(24),
    },
    bottom_text: {
        width: '100%',
        height: px(50),
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: px(16),
        zIndex: 10,
    },
    btn: {width: px(80), height: px(28), backgroundColor: '#fff', borderRadius: px(18)},
    tag_img: {width: px(90), height: px(28), position: 'absolute', top: 0, left: 0},
    new_tag: {
        width: px(23),
        height: px(18),
        position: 'absolute',
        left: 0,
        top: px(4),
    },
});
