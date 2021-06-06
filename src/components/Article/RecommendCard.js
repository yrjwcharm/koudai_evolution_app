/*
 * @Date: 2021-05-31 10:22:09
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-06 15:56:59
 * @Description:推荐模块
 */
import React, {useState, useRef} from 'react';
import {StyleSheet, Text, View, findNodeHandle, TouchableOpacity} from 'react-native';
import {Colors, Style} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import {useJump} from '../hooks';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';
import {Button} from '../Button';
import Praise from '../Praise';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import {Modal} from '../Modal';
const RecommendCard = ({data, style}) => {
    const jump = useJump();
    const [blurRef, setBlurRef] = useState(null);
    const [reserved, setReserved] = useState(data.reserved);
    const viewRef = useRef(null);
    const subscription = () => {
        if (reserved) {
            return;
        }
        checkNotifications().then(({status, settings}) => {
            if (status == 'denied' || status == 'blocked') {
                openLink();
            } else {
                setReserved(true);
                // http
            }
        });
    };
    const openLink = () => {
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {
            // …
            if (status == 'granted') {
                setReserved(true);
            } else {
                blockCal();
            }
        });
    };
    //权限提示弹窗
    const blockCal = () => {
        Modal.show({
            title: '权限申请',
            content: '避免错过调仓加仓消息，请打开通知权限',
            confirm: true,
            confirmText: '前往',
            confirmCallBack: () => {
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
                <Button
                    onPress={subscription}
                    title={reserved ? '已预约' : '更新提醒'}
                    disabled={reserved}
                    disabledColor={'#9AA1B2'}
                    style={{height: px(32), paddingHorizontal: px(14), borderRadius: px(16)}}
                    textStyle={{fontSize: px(13), fontWeight: '700'}}
                />
                {data?.locked ? (
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
