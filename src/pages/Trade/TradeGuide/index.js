/*
 * @Date: 2022-09-16 11:07:12
 * @Description: 交易引导
 */
import React, {useCallback, useMemo, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import finished from '~/assets/img/icon/finished.png';
import noticeIcon from '~/assets/img/icon/notice.png';
import ongoing from '~/assets/img/icon/ongoing.png';
import reward from '~/assets/img/icon/reward.png';
import todo from '~/assets/img/icon/todo.png';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import BottomDesc from '~/components/BottomDesc';
import {Button} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import {ProductList} from '~/components/Product';
import HTML from '~/components/RenderHtml';
import UnderlineText from '~/components/UnderlineText';
import {deviceWidth, px} from '~/utils/appUtil';
import {getPageData, getReward, reportPop} from './services';

const Steps = ({steps}) => {
    const jump = useJump();
    const [heightArr, setHeight] = useState([]);

    const isFinished = useMemo(() => {
        return steps?.every?.((step) => step.status === 2);
    }, [steps]);

    return (
        <LinearGradient
            colors={['#DFECFF', '#fff']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: isFinished ? 0 : 0.2}}
            style={styles.stepBox}>
            {steps?.map?.((step, i, arr) => {
                const {button, content, desc, status, step_key, title} = step;
                return (
                    <View
                        key={step_key + i}
                        onLayout={({
                            nativeEvent: {
                                layout: {height},
                            },
                        }) =>
                            setHeight((prev) => {
                                const next = [...prev];
                                next[i] = height;
                                return next;
                            })
                        }
                        style={{flexDirection: 'row', marginTop: i === 0 ? 0 : Space.marginVertical}}>
                        <View style={{marginTop: px(1), width: px(42)}}>
                            {status === 1 ? (
                                <View>
                                    <UnderlineText
                                        color="#FFEC92"
                                        height={px(6)}
                                        text={step_key}
                                        underlineWidthDelta={-px(6)}
                                    />
                                </View>
                            ) : (
                                <Text style={styles.desc}>{step_key}</Text>
                            )}
                        </View>
                        <View>
                            <FastImage
                                source={status === 0 ? todo : status === 1 ? ongoing : finished}
                                style={styles.status}
                            />
                            {i < arr.length - 1 && (
                                <View
                                    style={[
                                        styles.line,
                                        {height: heightArr[i], backgroundColor: status === 1 ? '#E1EDFF' : '#E8ECF4'},
                                    ]}
                                />
                            )}
                        </View>
                        <View style={{flexShrink: 1}}>
                            <View style={Style.flexRow}>
                                {desc ? <Text style={[styles.desc, {marginRight: px(8)}]}>{desc}</Text> : null}
                                {title ? <Text style={styles.title}>{title}</Text> : null}
                            </View>
                            <Text style={[styles.desc, {marginTop: px(4)}]}>{content}</Text>
                            {button?.text ? (
                                <Button
                                    disabled={button.avail === 0}
                                    onPress={() => jump(button.url)}
                                    style={styles.button}
                                    textStyle={styles.btnText}
                                    title={button.text}
                                />
                            ) : null}
                        </View>
                    </View>
                );
            })}
        </LinearGradient>
    );
};

const Index = ({navigation, route}) => {
    const [data, setData] = useState({});
    const {bg, notice, pop, show_pop, tip, steps, user_bag} = data;

    const init = () => {
        getPageData({}).then((res) => {
            if (res.code === '000000') {
                const {title = '交易引导'} = res.result;
                navigation.setOptions({title});
                setData(res.result);
            }
        });
    };

    const handleGetReward = () => {
        getReward().then((res) => {
            if (res.code === '000000') {
                const {back_close, device_width, image, touch_close} = res.result.pop;
                Image.getSize(image, (w, h) => {
                    const height = (h * (device_width ? deviceWidth : px(280))) / w;
                    Modal.show({
                        backButtonClose: back_close,
                        confirmCallBack: init,
                        imageUrl: image,
                        imgHeight: height,
                        imgWidth: device_width ? deviceWidth : px(280),
                        isTouchMaskToClose: touch_close,
                        type: 'image',
                    });
                });
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const listener = navigation.addListener('beforeRemove', (e) => {
                const {action} = e.data;
                if (['GO_BACK', 'POP'].includes(action.type) && show_pop) {
                    e.preventDefault();
                    listener();
                    const {back_close, device_width, image, touch_close} = pop;
                    Image.getSize(image, (w, h) => {
                        const height = (h * (device_width ? deviceWidth : px(280))) / w;
                        reportPop().then((res) => {
                            if (res.code === '000000') {
                                Modal.show({
                                    backButtonClose: back_close,
                                    confirmCallBack: handleGetReward,
                                    imageUrl: image,
                                    imgHeight: height,
                                    imgWidth: device_width ? deviceWidth : px(280),
                                    isTouchMaskToClose: touch_close,
                                    type: 'image',
                                });
                            }
                        });
                    });
                }
            });
            return () => {
                listener();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [data])
    );

    return Object.keys(data).length > 0 ? (
        <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
            <FastImage source={{uri: bg}} style={styles.topBg} />
            <View style={styles.contentWrapper}>
                {notice ? (
                    <View style={[Style.flexRow, styles.noticeBox]}>
                        <FastImage source={noticeIcon} style={styles.noticeIcon} />
                        <Text style={styles.noticeText}>{notice}</Text>
                    </View>
                ) : null}
                {user_bag ? (
                    <View style={styles.recommandBox}>
                        <Text style={styles.title}>{user_bag.title}</Text>
                        {user_bag.notice ? (
                            <View style={[Style.flexRow, styles.rewardBox]}>
                                <FastImage
                                    source={user_bag.notice.icon ? {uri: user_bag.notice.icon} : reward}
                                    style={styles.reward}
                                />
                                <View style={{flexShrink: 1}}>
                                    <HTML
                                        html={user_bag.notice.content}
                                        style={{...styles.tip, color: Colors.descColor}}
                                    />
                                </View>
                            </View>
                        ) : null}
                        {user_bag.product ? (
                            <View style={{marginTop: px(8)}}>
                                <ProductList data={user_bag.product.items} type={user_bag.product.style_type} />
                            </View>
                        ) : null}
                    </View>
                ) : null}
                {steps?.length > 0 && <Steps steps={steps} />}
                {tip ? <Text style={styles.tip}>{tip}</Text> : null}
            </View>
            <BottomDesc />
        </ScrollView>
    ) : null;
};

const styles = StyleSheet.create({
    topBg: {
        width: '100%',
        height: px(300),
    },
    contentWrapper: {
        marginTop: -px(130),
        paddingHorizontal: Space.padding,
    },
    noticeBox: {
        marginBottom: px(12),
        padding: px(8),
        borderRadius: Space.borderRadius,
        backgroundColor: '#FFF5E5',
    },
    noticeIcon: {
        marginRight: px(6),
        width: px(16),
        height: px(16),
    },
    noticeText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FF7D41',
    },
    stepBox: {
        padding: Space.padding,
        borderRadius: Space.borderRadius,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    status: {
        marginTop: px(2),
        marginRight: px(8),
        width: px(16),
        height: px(16),
    },
    line: {
        position: 'absolute',
        top: px(18),
        left: px(7.5),
        width: px(1),
    },
    button: {
        marginTop: px(12),
        borderRadius: px(4),
        width: px(80),
        height: px(29),
    },
    btnText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        fontWeight: Font.weightMedium,
    },
    tip: {
        marginTop: px(12),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.lightGrayColor,
    },
    recommandBox: {
        marginBottom: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    rewardBox: {
        marginTop: px(8),
        padding: px(8),
        borderRadius: Space.borderRadius,
        backgroundColor: '#FFF2F2',
        alignItems: 'flex-start',
    },
    reward: {
        marginRight: px(2),
        width: px(16),
        height: px(16),
    },
});

export default Index;
