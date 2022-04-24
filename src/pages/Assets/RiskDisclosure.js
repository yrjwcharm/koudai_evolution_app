/*
 * @Date: 2022-04-21 10:34:25
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-04-24 18:15:18
 * @Description: 风险揭示书
 */
import React, {useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import Loading from '../Portfolio/components/PageLoading';
import {PasswordModal} from '../../components/Password';
import Toast from '../../components/Toast';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {processing_info = {}, risk_disclosure = []} = data;
    const {content = '', url = ''} = processing_info;
    const [button, setButton] = useState({disabled: true, text: ''});
    const {disabled, text} = button;
    const [ticking, setTicking] = useState(true); // 是否正在倒计时
    const countdownRef = useRef(10);
    const timeRef = useRef();
    const passwordRef = useRef();
    const {poids} = route.params;

    useEffect(() => {
        http.get('/advisor/need_sign/info/20220422', {poids}).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '风险揭示书'});
                countdownRef.current = res.result.countdown;
                setButton({disabled: true, text: `${countdownRef.current}s后确认`});
                const {risk_disclosure: arr = []} = res.result;
                arr.forEach((item) => (item.status = 0));
                setData(res.result);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        timeRef.current = setInterval(() => {
            if (countdownRef.current <= 1) {
                clearInterval(timeRef.current);
                setTicking(false);
            } else {
                countdownRef.current -= 1;
                setButton({disabled: true, text: `${countdownRef.current}s后确认`});
            }
        }, 1000);
        return () => {
            clearInterval(timeRef.current);
        };
    }, []);

    useEffect(() => {
        const {risk_disclosure: arr = []} = data;
        if (!ticking) {
            const finishRead = arr.every((item) => item.status === 2);
            setButton({disabled: !finishRead, text: finishRead ? '确认' : '请阅读完成后确认'});
        }
    }, [data, ticking]);

    /** @name 滚动阅读内容 @description status 0 未读 1 未读完 2 已读 */
    const onScroll = (e, index) => {
        const {
            contentOffset: {y},
            contentSize: {height: height1},
            layoutMeasurement: {height: height2},
        } = e;
        const _data = {...data};
        const {risk_disclosure: arr = []} = _data;
        if (arr[index].status === 2) {
            return false;
        }
        if (arr[index].status === 0) {
            arr[index].status = 1;
        }
        if (y === height1 - height2) {
            arr[index].status = 2;
        }
        setData(_data);
    };

    /** @name 点击确认签约，完成输入交易密码 */
    const onSubmit = (password) => {
        http.post('/adviser/sign/20210923', {password, poids}).then((res) => {
            Toast.show(res.message);
            if (res.code === '000000') {
                setTimeout(() => {
                    navigation.go(-2);
                }, 1000);
            }
        });
    };

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={url ? 0.8 : 1} onPress={() => jump(url)} style={styles.tipsCon}>
                <Text style={styles.tips}>{content}</Text>
            </TouchableOpacity>
            <ScrollView bounces={false} style={{flex: 1}}>
                <View style={styles.contentBox}>
                    {risk_disclosure?.map?.((item, index) => {
                        return (
                            <View key={item + index} style={[styles.itemBox, {marginTop: index === 0 ? 0 : px(12)}]}>
                                <View style={[Style.flexBetween, {paddingHorizontal: Space.padding}]}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <View
                                        style={[
                                            Style.flexRow,
                                            styles.statusBox,
                                            {backgroundColor: item.status === 2 ? '#EFF5FF' : '#FFF2F2'},
                                        ]}>
                                        <Text
                                            style={[
                                                styles.statusText,
                                                {color: item.status === 2 ? Colors.brandColor : Colors.red},
                                            ]}>
                                            {item.status === 0 ? '未读' : item.status === 1 ? '未读完' : '已读'}
                                        </Text>
                                        {item.status === 2 && (
                                            <Image
                                                source={require('../../assets/personal/finished.png')}
                                                style={styles.finished}
                                            />
                                        )}
                                    </View>
                                </View>
                                <ScrollView
                                    bounces={false}
                                    onScroll={(e) => onScroll(e.nativeEvent, index)}
                                    scrollEventThrottle={100}
                                    style={styles.itemContentBox}>
                                    <HTML html={item.content} style={styles.itemContent} />
                                </ScrollView>
                            </View>
                        );
                    })}
                </View>
                <PasswordModal onDone={onSubmit} ref={passwordRef} />
            </ScrollView>
            <View style={{backgroundColor: '#fff'}}>
                <Button
                    disabled={disabled}
                    onPress={() => passwordRef.current?.show?.()}
                    style={styles.button}
                    title={text}
                />
            </View>
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    tipsCon: {
        paddingVertical: px(9),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    tips: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.orange,
    },
    contentBox: {
        marginTop: Space.marginVertical,
        marginBottom: px(20),
        paddingHorizontal: Space.padding,
    },
    itemBox: {
        paddingVertical: Space.padding,
        borderRadius: Space.borderRadius,
        height: px(228),
        backgroundColor: '#fff',
    },
    itemTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    statusBox: {
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(2),
    },
    statusText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
    },
    finished: {
        marginLeft: px(2),
        width: px(11),
        height: px(8),
    },
    itemContentBox: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        flex: 1,
    },
    itemContent: {
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    button: {
        marginTop: px(20),
        marginHorizontal: Space.marginAlign,
        marginBottom: isIphoneX() ? 34 : px(20),
    },
});
