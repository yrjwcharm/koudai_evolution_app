/*
 * @Date: 2021-05-31 10:22:09
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-30 10:38:44
 * @Description:推荐模块
 */
import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, findNodeHandle, TouchableOpacity, AppState} from 'react-native';
import {Colors, Style} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';
import {Button} from '../Button';
import Praise from '../Praise';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import {Modal} from '../Modal';
import http from '../../services';
import Toast from '../Toast';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
const RecommendCard = ({data, style, onPress}) => {
    const jump = useJump();
    const userInfo = useSelector((state) => state.userInfo).toJS();
    const [blurRef, setBlurRef] = useState(null);
    const viewRef = useRef(null);
    const [reserved, setReserved] = useState(data.reserved);
    const postReserve = (sucess) => {
        http.post('/vision/recommend/reserve/20210524', {id: data.id}).then((res) => {
            if (res.code === '000000') {
                AppState.removeEventListener('change', _handleAppStateChange);
                sucess();
                Toast.show(res.message);
            }
        });
    };
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
        onPress && onPress();
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
                    !data?.locked && jump(data?.url);
                }}
                style={[styles.card, style]}
                onLayout={() => {
                    viewRef && setBlurRef(findNodeHandle(viewRef.current));
                }}>
                <FastImage
                    style={{width: '100%', height: px(302)}}
                    source={{
                        uri: data?.cover,
                    }}
                />
                <View style={{padding: px(16)}}>
                    <Text style={styles.recommend_title} numberOfLines={2}>
                        {data?.title}
                    </Text>
                    {data?.locked ? null : (
                        <>
                            <View style={[Style.flexRow, {marginTop: px(12)}]}>
                                <FastImage
                                    source={{uri: data?.author?.avatar}}
                                    style={{width: px(26), height: px(26)}}
                                />
                                <Text
                                    style={{fontSize: px(13), color: Colors.lightBlackColor, marginHorizontal: px(6)}}>
                                    {data?.author?.nickname}
                                </Text>
                                {data?.author?.icon ? (
                                    <FastImage
                                        source={{uri: data?.author?.icon}}
                                        style={{width: px(12), height: px(12)}}
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
                    )}
                </View>

                {data?.locked && userInfo.is_login ? (
                    <>
                        <View
                            style={{
                                position: 'absolute',
                                width: deviceWidth - px(32),
                                height: px(120),
                                top: px(95),
                                zIndex: 10,
                                alignItems: 'center',
                            }}>
                            <FastImage
                                source={require('../../assets/img/vision/suo.png')}
                                style={{width: px(40), height: px(40)}}
                            />
                            <Text style={styles.blur_text}>{data.recommend_time}</Text>
                            <Button
                                onPress={subscription}
                                title={reserved ? '已预约' : '更新提醒'}
                                disabled={reserved}
                                disabledColor={'#9AA1B2'}
                                style={{height: px(32), paddingHorizontal: px(14), borderRadius: px(16)}}
                                textStyle={{fontSize: px(13), fontWeight: '700'}}
                            />
                        </View>
                        <BlurView
                            blurAmount={2}
                            viewRef={blurRef}
                            blurType={'light'}
                            style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: px(8)}}
                        />
                    </>
                ) : null}
            </TouchableOpacity>
        </>
    );
};

export default RecommendCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: px(8),
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
});
