/*
 * @Date: 2021-02-24 14:09:57
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-06 16:12:09
 * @Description: 体验金首页
 */

import React, {useCallback, useRef, useState} from 'react';
import {Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {px as text, isIphoneX, countdownTool, resolveTimeStemp} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Http from '../../services/index.js';
import {Button} from '../../components/Button';
import {BottomModal} from '../../components/Modal';
import {useJump} from '../../components/hooks';

const ExperienceGold = ({navigation}) => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const bottomModal = useRef(null);
    const Jump = useJump();
    const [countdown, setCountdown] = useState([]);
    const cancelRef = useRef();

    const init = () => {
        Http.get('/freefund/detail/20210101').then((res) => {
            if (res.code === '000000') {
                setRefreshing(false);
                if (res.result.part1?.time_countdown?.remaining_time) {
                    cancelRef.current = countdownTool({
                        callback: (resetTime) => {
                            const c = resolveTimeStemp(+resetTime);
                            setCountdown(c);
                        },
                        immediate: true,
                        timeStemp: res.result.part1?.time_countdown?.remaining_time,
                    });
                }
                setData(res.result);
                navigation.setOptions({
                    headerRight: () => {
                        return (
                            <Text onPress={rightPress} style={{color: '#fff', marginRight: 16}}>
                                规则说明
                            </Text>
                        );
                    },
                    title: res.result.title,
                });
                StatusBar.setBarStyle('light-content');
            }
        });
    };
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            init();
            return () => {
                StatusBar.setBarStyle('dark-content');
                cancelRef.current && cancelRef.current();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    const rightPress = () => {
        global.LogTool('click', 'rule');
        navigation.navigate('ExperienceGoldRule');
    };
    return (
        <>
            <ScrollView
                style={{flex: 1, backgroundColor: Colors.bgColor}}
                refreshControl={<RefreshControl onRefresh={init} refreshing={refreshing} />}>
                <LinearGradient
                    style={styles.bg}
                    colors={['#D4AC6F', 'rgba(212, 172, 111, 0)']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                />
                <View style={styles.topBox}>
                    {/* <View style={[Style.flexRow, styles.noticeBar]}>
                        <Image source={require('../../assets/personal/volume.png')} style={styles.noticeIcon} />
                        <Text style={styles.noticeText}>{data?.part1?.notice?.message}</Text>
                    </View> */}
                    <Text style={[styles.title, {marginTop: text(8)}]}>{data?.part1?.title}</Text>
                    <Text style={[styles.num, {marginTop: text(8)}]}>{data.part1?.money}</Text>
                    {data?.part1?.income_yesterday && (
                        <View style={styles.profitBox}>
                            <Text style={styles.profitText}>{data?.part1?.income_yesterday}</Text>
                        </View>
                    )}
                    {data?.part1?.label?.length > 0 && (
                        <View style={[Style.flexBetween, styles.items]}>
                            {data?.part1?.label?.map((_item, _index) => {
                                return (
                                    <View style={Style.flexCenter} key={_index + '_item'}>
                                        <Text style={[styles.profitText, {color: Colors.lightGrayColor}]}>
                                            {_item.key}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.itemValue,
                                                {marginTop: text(7)},
                                                _index === 0 ? {color: getColor(`${_item.val}`)} : {},
                                            ]}>
                                            {_item.val}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                    {data?.part1?.expire ? (
                        <Text style={[styles.noticeText, styles.expireText]}>{data?.part1?.expire}</Text>
                    ) : null}
                    {data?.part1?.button?.title && (
                        <Button
                            activeOpacity={1}
                            title={data?.part1?.button?.title}
                            disabled={data?.part1?.button?.available === 0}
                            disabledColor={Colors.bgColor}
                            color={'#D7AF74'}
                            style={styles.useBtn}
                            textStyle={{...styles.title, color: '#fff', fontWeight: '500'}}
                            onPress={() => {
                                global.LogTool('click', 'use');
                                Jump(data?.part1?.button?.url);
                            }}
                        />
                    )}
                </View>

                {data?.part1?.content && (
                    <View style={[styles.withdrawBox, data?.part1?.cashout_button ? Style.flexBetween : {}]}>
                        <View style={Style.flexRow}>
                            <View>
                                <Text style={styles.title}>
                                    {data?.part1?.content}
                                    <Text style={{fontSize: Font.textH1, fontFamily: Font.numMedium}}>
                                        {data?.part1?.income}
                                    </Text>
                                </Text>
                                {data?.part1?.is_give ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            global.LogTool('click', 'showTips');
                                            bottomModal.current.show();
                                        }}
                                        style={[Style.flexCenter, styles.tipIcon]}>
                                        <Text style={[styles.yieldKey, {color: '#fff'}]}>{'补'}</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                        {data?.part1?.cashout_button ? (
                            <View style={[styles.buttonBox, {marginTop: data?.part1?.time_desc ? text(4) : 0}]}>
                                {data?.part1?.give_title ? (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[Style.flexCenter, styles.fill]}
                                        onPress={() => {
                                            global.LogTool('click', 'showTips');
                                            bottomModal.current.show();
                                        }}>
                                        <Text style={[styles.yieldKey, {color: '#fff'}]}>
                                            {data?.part1?.give_title}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                                <Button
                                    onPress={() => {
                                        global.LogTool('click', 'cashout');
                                        Jump(data?.part1?.cashout_button?.url);
                                    }}
                                    title={data?.part1?.cashout_button?.title}
                                    disabled={!data?.part1?.cashout_button?.avail}
                                    disabledColor={Colors.bgColor}
                                    color={'#D7AF74'}
                                    style={{...styles.withdrawBtn, marginBottom: !data?.part1?.time_desc ? 0 : text(6)}}
                                    textStyle={{
                                        ...styles.profitText,
                                        color: data?.part1?.cashout_button?.avail ? '#fff' : Colors.placeholderColor,
                                        fontWeight: '500',
                                    }}
                                />
                                {data?.part1?.time_desc ? (
                                    <Text style={{...styles.yieldKey, color: Colors.red}}>{data.part1.time_desc}</Text>
                                ) : null}
                            </View>
                        ) : null}
                        {data?.part1?.time_desc ? (
                            <Text style={{marginTop: text(8), ...styles.yieldKey, color: Colors.red}}>
                                {data.part1.time_desc}
                            </Text>
                        ) : null}
                        {countdown?.length > 0 ? (
                            <View style={[Style.flexBetween, styles.countdownBox]}>
                                <Text style={[styles.noticeText, {color: Colors.descColor}]}>
                                    {data.part1.time_countdown.countdown_desc}
                                </Text>
                                <View style={Style.flexRow}>
                                    {countdown.map((item, index) => {
                                        const unitArr = ['天', '时', '分', '秒'];
                                        return (
                                            <View key={index} style={Style.flexRow}>
                                                <View style={styles.countdownTextBox}>
                                                    <Text style={styles.countdownText}>{item}</Text>
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.yieldKey,
                                                        {color: Colors.descColor, marginHorizontal: text(4)},
                                                    ]}>
                                                    {unitArr[index]}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        ) : null}
                    </View>
                )}
                {/* 未购买稳健组合后展示的样式 */}
                {data?.part2?.cards && (
                    <Text style={[styles.bigTitle, {marginLeft: Space.marginAlign, marginTop: text(20)}]}>
                        {data?.part2?.title}
                    </Text>
                )}
                {data?.part2?.cards?.map((_item, _index, arr) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Style.flexBetween, styles.productBox]}
                            key={_index + '_i'}
                            onPress={() => {
                                global.LogTool('click', 'account', _item.plan_id);
                                Jump(_item.url);
                            }}>
                            <View style={{flex: 1}}>
                                <View style={[Style.flexRow]}>
                                    <Text style={[styles.title, {fontWeight: '500'}]}>{_item.name}</Text>
                                    <Text
                                        style={{
                                            fontSize: Font.textH3,
                                            lineHeight: text(20),
                                            color: Colors.descColor,
                                            marginLeft: text(5),
                                        }}>
                                        {_item.desc}
                                    </Text>
                                </View>
                                <View style={[Style.flexRow, styles.yieldBox]}>
                                    <Text style={[styles.yieldVal, {marginRight: text(5)}]}>
                                        <Text>{_item.ratio}</Text>
                                        {/* <Text style={{fontSize: text(18)}}>{'%'}</Text> */}
                                    </Text>
                                    <Text style={[styles.yieldKey, {marginBottom: text(2)}]}>{_item.ratio_desc}</Text>
                                </View>

                                <View style={Style.flexRow} key={_index + '_item'}>
                                    {_item?.label?.map((_label, _idx) => {
                                        return (
                                            <Text key={_label + _idx} style={[styles.yieldKey, styles.tag]}>
                                                {_label}
                                            </Text>
                                        );
                                    })}
                                </View>
                            </View>
                            <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                    );
                })}

                {/* 购买稳健组合后展示的样式 */}
                {data?.part2?.portfolios && (
                    <View style={[Style.flexRow, {paddingLeft: Space.padding, paddingTop: text(20)}]}>
                        <Text style={{...styles.bigTitle, marginRight: text(8)}}>{data?.part2?.title}</Text>
                        <Text style={{...styles.noticeText, color: Colors.lightGrayColor}}>{data?.part2?.desc}</Text>
                    </View>
                )}
                {data?.part2?.portfolios?.map((_p, _index, arr) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Style.flexBetween, styles.productBox]}
                            key={_index + '_p'}
                            onPress={() => {
                                global.LogTool('click', 'account', _p.plan_id);
                                Jump(_p.button.url);
                            }}>
                            <View style={{flex: 1}}>
                                <Text style={[styles.title, {fontWeight: '500'}]}>{_p.name}</Text>
                                <View style={[Style.flexBetween, {marginTop: text(8)}]}>
                                    {_p.items.map((_i, _d) => {
                                        return (
                                            <View key={_d + '_i0'}>
                                                <Text
                                                    style={{
                                                        ...styles.noticeText,
                                                        color: Colors.lightGrayColor,
                                                        marginBottom: text(4),
                                                    }}>
                                                    {_i.key}
                                                </Text>
                                                <Text
                                                    style={{
                                                        ...styles.itemValue,
                                                        color: _d == 0 ? '#292D39' : '#DC4949',
                                                        fontFamily: Font.numFontFamily,
                                                    }}>
                                                    {_i.val}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                            <Button
                                title={_p.button.text}
                                disabled={false}
                                color={'#fff'}
                                style={styles.buyBtn}
                                onPress={() => {
                                    global.LogTool('click', 'account', _p.plan_id);
                                    Jump(_p.button.url);
                                }}
                                textStyle={{...styles.profitText, color: Colors.brandColor, fontWeight: '500'}}
                            />
                        </TouchableOpacity>
                    );
                })}
                {data?.part1?.notice?.message ? (
                    <Text
                        style={{
                            marginTop: text(12),
                            marginHorizontal: Space.marginAlign,
                            marginBottom: isIphoneX() ? 34 : text(12),
                            ...styles.noticeText,
                            color: Colors.lightGrayColor,
                        }}>
                        {data.part1.notice.message}
                    </Text>
                ) : null}
            </ScrollView>
            {Object.keys(data).length > 0 && (
                <BottomModal
                    title={data?.part1?.give_pop?.title}
                    ref={bottomModal}
                    confirmText={data?.part1?.give_pop?.button_title}
                    children={
                        <View style={{padding: Space.padding}}>
                            <Text style={styles.htmlStyle}>{data?.part1?.give_pop?.desc1}</Text>
                            <Text style={[styles.htmlStyle, {marginTop: text(15)}]}>
                                {data?.part1?.give_pop?.desc2}
                            </Text>
                        </View>
                    }
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topRightBtn: {
        flex: 1,
        width: text(64),
        marginRight: text(14),
    },
    bg: {
        height: text(224),
    },
    topBox: {
        marginTop: text(-214),
        marginHorizontal: Space.marginAlign,
        paddingVertical: Space.padding,
        paddingHorizontal: text(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    noticeBar: {
        marginBottom: text(24),
        paddingVertical: text(5),
        paddingLeft: text(6),
        borderRadius: text(2),
        backgroundColor: '#FEF6E9',
        width: '100%',
    },
    noticeIcon: {
        width: text(24),
        height: text(24),
        marginRight: text(7),
    },
    noticeText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#A0793E',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    fill: {
        position: 'absolute',
        left: text(2),
        top: 0,
        backgroundColor: Colors.red,
        borderTopRightRadius: text(16),
        borderBottomRightRadius: text(16),
        borderTopLeftRadius: text(Platform.select({ios: 8, android: 12})),
        borderBottomLeftRadius: 0,
        width: text(21),
        height: text(16),
    },
    num: {
        fontSize: text(34),
        lineHeight: text(41),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    expireText: {
        lineHeight: text(15),
        color: Colors.lightGrayColor,
        marginTop: text(5),
    },
    useBtn: {
        marginVertical: Space.marginVertical,
        borderRadius: text(6),
        width: text(152),
        height: text(38),
        backgroundColor: '#D7AF74',
    },
    profitBox: {
        marginTop: text(13),
        paddingVertical: text(7),
        paddingHorizontal: text(30),
        borderRadius: text(16),
        backgroundColor: Colors.bgColor,
        marginBottom: text(20),
    },
    profitText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.lightBlackColor,
    },
    items: {
        paddingBottom: text(20),
        paddingHorizontal: text(10),
        width: '100%',
    },
    itemValue: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: Colors.defaultColor,
        fontFamily: Font.numRegular,
    },
    withdrawBox: {
        margin: Space.marginAlign,
        marginBottom: 0,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    withdrawBtn: {
        marginBottom: text(6),
        width: text(84),
        height: text(32),
        backgroundColor: '#D7AF74',
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
    productBox: {
        marginTop: text(12),
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    yieldBox: {
        paddingTop: text(6),
        paddingBottom: text(8),
        alignItems: 'flex-end',
    },
    yieldVal: {
        fontSize: text(22),
        lineHeight: text(26),
        color: Colors.red,
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
    },
    yieldKey: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.lightGrayColor,
    },
    tag: {
        marginRight: text(8),
        paddingVertical: text(2),
        paddingHorizontal: text(6),
        backgroundColor: '#F0F6FD',
        color: Colors.brandColor,
    },
    buyBtn: {
        marginLeft: text(32),
        borderRadius: text(6),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
        backgroundColor: '#fff',
        width: text(72),
        height: text(32),
    },
    htmlStyle: {
        fontSize: text(13),
        lineHeight: text(20),
        color: Colors.descColor,
    },
    buttonBox: {
        flex: 1,
        alignItems: 'flex-end',
        marginTop: text(4),
        position: 'relative',
    },
    tipIcon: {
        width: text(21),
        height: text(16),
        position: 'absolute',
        right: text(-25),
        bottom: text(10),
        borderTopLeftRadius: text(50),
        borderTopRightRadius: text(100),
        borderBottomRightRadius: text(100),
        borderBottomLeftRadius: 0,
        backgroundColor: Colors.red,
    },
    countdownBox: {
        marginTop: text(12),
        paddingTop: text(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    countdownTextBox: {
        paddingVertical: text(2),
        paddingHorizontal: text(3),
        borderRadius: text(2),
        backgroundColor: Colors.bgColor,
    },
    countdownText: {
        fontSize: Font.textH3,
        lineHeight: text(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
});

export default ExperienceGold;
