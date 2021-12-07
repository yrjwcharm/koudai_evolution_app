/*
 * @Date: 2021-12-06 14:17:56
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-12-07 19:04:08
 * @Description: 财富工具
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {useJump} from '../../components/hooks';
import {Modal} from '../../components/Modal';
import Header from '../../components/NavBar';
import HTML from '../../components/RenderHtml';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {deviceWidth, px} from '../../utils/appUtil';

export default () => {
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const navigation = useNavigation();
    const [scrollY, setScrollY] = useState(0);
    const [percentTextBoxWidth, setWidth] = useState(px(30)); // 百分比容器宽度
    const [data, setData] = useState({
        img: 'https://static.licaimofang.com/wp-content/uploads/2021/12/tool_top_bg.png',
        close_list: [
            {
                button: {
                    text: '去开启',
                    type: 'default',
                },
                content: '牛人买入信号是魔方根据平台收益top1%用户的加仓点为用户进行推送追加购买时间点。',
                icon: 'https://static.licaimofang.com/wp-content/uploads/2021/12/top_buy.png',
                margin_type: 3,
                state_info: {
                    value: '<span style="color: #121D3A;">增强择时能力</span>',
                    value_tip: '',
                    value_type: 'text',
                },
                tags: [],
                title: '牛人买入工具',
            },
            {
                content: '帮助用户降低风险',
                icon: 'https://static.licaimofang.com/wp-content/uploads/2021/12/target_profit.png',
                margin_type: 3,
                pop: {
                    cancel: {
                        text: '取消',
                    },
                    confirm: {
                        text: '去购买',
                        url: {
                            params: {poid: 'X00F456509'},
                            path: 'TradeBuy',
                            type: 1,
                        },
                    },
                    content: '该工具帮助您的低估值组合进行止盈提醒，因此您需要持有低估值组合。',
                    title: '止盈工具开启',
                },
                state_info: {
                    value: '<span style="color: #121D3A;">止盈提醒落袋为安</span>',
                    value_tip: '',
                    value_type: 'text',
                },
                style: 2,
                tags: [],
                tip: '购买低估值组合可开启',
                title: '止盈工具',
            },
        ],
        open_list: [
            {
                button: {
                    text: '去购买',
                    type: 'primary',
                },
                content: '本次买入持仓成本可降低1.12%，长期来看收益可增加1.12%，建议您追加购买50,000.00元。',
                icon: 'https://static.licaimofang.com/wp-content/uploads/2021/12/low_buy.png',
                margin_type: 2,
                state_info: {
                    value: '<span style="color: #4BA471;">-0.61%</span>',
                    value_tip: '今日买入持仓成本',
                    value_type: 'number',
                },
                tags: ['建议买入'],
                title: '低位买入工具',
            },
            {
                content: '由于您当前持有组合于最优组合出现偏离，您可以选择调仓把所有持仓调整为最新比例。',
                icon: 'https://static.licaimofang.com/wp-content/uploads/2021/12/intelligent_adjust.png',
                margin_type: 3,
                state_info: {
                    value: '<span style="color: #4BA471;">健康</span>',
                    value_tip: '',
                    value_type: 'text',
                },
                tags: [],
                title: '智能调仓工具',
            },
            {
                content: '当前低估值智能定投止盈进度达到86%，还未达成止盈条件，您可以保持现有投资或追加购买。',
                icon: 'https://static.licaimofang.com/wp-content/uploads/2021/12/target_profit.png',
                margin_type: 2,
                progress: {
                    percent: 0.86,
                    percent_text: '86%',
                    range_text: [
                        '<span style="fontFamily: DINAlternate-Bold;">0%</span>',
                        '目标收益率<span style="fontFamily: DINAlternate-Bold;">20%</span>',
                    ],
                },
                state_info: {
                    value: '<span style="color: #121D3A;">17%</span>',
                    value_tip: '当前收益率',
                    value_type: 'number',
                },
                tags: [],
                title: '止盈工具',
            },
        ],
    });

    /**
     * 渲染每个工具模块
     * @param {*} item 每个工具模块数据
     * @param {number} index 数组索引
     * @returns React Node
     */
    const renderToolBox = (item = {}, index = 0) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                key={item + index}
                onPress={() => {
                    // 未开启展示弹窗
                    if (item.pop) {
                        Modal.show({
                            backButtonClose: false,
                            cancelCallBack: () => jump(item.pop.cancel?.url),
                            cancelText: item.pop.cancel?.text,
                            children: () => (
                                <View style={styles.popContentBox}>
                                    <Text style={styles.popContent}>{item.pop.content}</Text>
                                </View>
                            ),
                            confirm: !!item.pop.cancel?.text,
                            confirmCallBack: () => jump(item.pop.confirm?.url),
                            confirmText: item.pop.confirm?.text,
                            isTouchMaskToClose: false,
                            title: item.pop.title,
                        });
                    }
                }}
                style={styles.toolBox}>
                {item.tip ? (
                    <LinearGradient
                        colors={['#F9CF95', '#FFEDD5']}
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 0}}
                        style={styles.notOpen}>
                        <Text style={[styles.typeTitle, {fontWeight: '400'}]}>{item.tip}</Text>
                    </LinearGradient>
                ) : null}
                <View style={{opacity: item.style === 2 ? 0.2 : 1}}>
                    {/* 标题区域 */}
                    <View style={Style.flexRow}>
                        <Image
                            source={{
                                uri: item.icon,
                            }}
                            style={styles.icon}
                        />
                        <Text style={styles.typeTitle}>{item.title}</Text>
                        {item.tags?.map?.((tag, i) => (
                            <View key={tag + i} style={styles.tagBox}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                    {/* 状态区域 */}
                    {item.state_info?.value ? (
                        <View style={{marginTop: px(10)}}>
                            <View style={Style.flexBetween}>
                                <View>
                                    <HTML
                                        html={item.state_info.value}
                                        style={
                                            item.state_info?.value_type === 'number' ? styles.numberSty : styles.textSty
                                        }
                                    />
                                    {item.state_info.value_tip ? (
                                        <Text style={styles.desc}>{item.state_info.value_tip}</Text>
                                    ) : null}
                                </View>
                                {/* 进度条区域 */}
                                {item.progress ? (
                                    <View>
                                        <View style={styles.percentBar}>
                                            <LinearGradient
                                                colors={['#FF9393', Colors.red]}
                                                start={{x: 0, y: 0}}
                                                end={{x: 1, y: 0}}
                                                style={[
                                                    styles.activePart,
                                                    {
                                                        width:
                                                            item.progress.percent > 1
                                                                ? '100%'
                                                                : item.progress.percent_text,
                                                    },
                                                ]}
                                            />
                                            <View
                                                style={[
                                                    styles.currentBox,
                                                    {
                                                        left:
                                                            px(203) *
                                                                (item.progress.percent > 1
                                                                    ? 1
                                                                    : item.progress.percent) -
                                                            percentTextBoxWidth / 2,
                                                    },
                                                ]}>
                                                <View
                                                    style={styles.percentTextBox}
                                                    onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
                                                    <Text style={styles.percentText}>{item.progress.percent_text}</Text>
                                                </View>
                                                <Image
                                                    source={require('../../assets/personal/arrow_down.png')}
                                                    style={{width: px(8), height: px(3)}}
                                                />
                                            </View>
                                        </View>
                                        <View style={[Style.flexBetween, {marginTop: px(9), marginRight: px(8)}]}>
                                            {item.progress.range_text?.map?.((text, i) => (
                                                <HTML html={text} key={text + i} style={styles.rangeText} />
                                            ))}
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    ) : null}
                    {/* margin_type 1: 没有state_info 2: state_info.value和.value_tip都有 3: state_info只有value */}
                    <Text style={[styles.contentSty, {marginTop: {1: px(14), 2: px(12), 3: px(6)}[item.margin_type]}]}>
                        {item.content}
                    </Text>
                    {/* button type primary: 实底 default: 默认边框 */}
                    {item.button ? (
                        <View style={Style.flexRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(item.button.url)}
                                style={[
                                    Style.flexRow,
                                    styles.buttonSty,
                                    {
                                        backgroundColor: item.button.type === 'primary' ? '#DA9E47' : '#fff',
                                        borderColor: item.button.type === 'primary' ? '#DA9E47' : '#E3B776',
                                    },
                                ]}>
                                <Text
                                    style={[
                                        styles.btnText,
                                        {color: item.button.type === 'primary' ? '#fff' : '#E3B776'},
                                    ]}>
                                    {item.button.text}
                                </Text>
                                <Icon
                                    color={item.button.type === 'primary' ? '#fff' : '#E3B776'}
                                    name="right"
                                    size={px(12)}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: '#EFBF7B',
                elevation: 0,
                shadowOffset: {
                    height: 0,
                },
            },
        });
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            http.get('/tool/manage/detail/20211207').then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            });
        }, [])
    );

    return Object.keys(data || {}).length > 0 ? (
        <View style={styles.container}>
            <Header
                leftIcon="chevron-left"
                title={scrollY > 0 ? '财富工具' : ''}
                scrollY={scrollY}
                style={{
                    opacity: scrollY > 0 ? 0 : 1,
                    width: deviceWidth,
                    backgroundColor: scrollY > 0 ? '#fff' : 'transparent',
                    position: 'absolute',
                }}
            />
            <ScrollView
                bounces={false}
                onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={16}
                style={{flex: 1}}>
                <Image source={{uri: data.img}} style={styles.topBg} />
                <View style={{paddingTop: insets.top + px(44), paddingBottom: insets.bottom}}>
                    <View style={{paddingLeft: px(24)}}>
                        <Text style={styles.title}>{'财富工具'}</Text>
                        <Text style={styles.subTitle}>{'帮你快速进行交易决策'}</Text>
                    </View>
                    <View style={{marginTop: px(176), paddingHorizontal: Space.padding}}>
                        {data.open_list?.length > 0 ? (
                            <Text style={[styles.typeTitle, {paddingBottom: px(12)}]}>{'已开启'}</Text>
                        ) : null}
                        {data.open_list?.map?.((item, index) => renderToolBox(item, index))}
                        {data.close_list?.length > 0 ? (
                            <Text style={[styles.typeTitle, {paddingBottom: px(12)}]}>{'未开启'}</Text>
                        ) : null}
                        {data.close_list?.map?.((item, index) => renderToolBox(item, index))}
                    </View>
                </View>
            </ScrollView>
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
    topBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: deviceWidth,
        height: px(311),
    },
    title: {
        fontSize: px(30),
        lineHeight: px(42),
        color: '#5E4523',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    subTitle: {
        marginTop: px(1),
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: '#795B33',
    },
    typeTitle: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    toolBox: {
        marginBottom: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    icon: {
        marginRight: px(6),
        width: px(16),
        height: px(16),
    },
    tagBox: {
        marginLeft: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(2),
        backgroundColor: Colors.red,
    },
    tagText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    statusText: {
        fontSize: px(22),
        lineHeight: px(30),
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    textSty: {
        fontSize: px(22),
        lineHeight: px(30),
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    numberSty: {
        fontSize: px(26),
        lineHeight: px(30),
        fontFamily: Font.numFontFamily,
    },
    desc: {
        marginTop: px(2),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    contentSty: {
        fontSize: px(13),
        lineHeight: px(21),
        color: Colors.descColor,
    },
    buttonSty: {
        marginTop: px(12),
        paddingVertical: px(5),
        paddingHorizontal: px(12),
        borderRadius: px(15),
        borderWidth: Space.borderWidth,
    },
    btnText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#fff',
        marginRight: px(4),
    },
    notOpen: {
        paddingVertical: px(6),
        paddingHorizontal: px(10),
        borderTopRightRadius: Space.borderRadius,
        borderBottomLeftRadius: px(16),
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 5,
    },
    popContentBox: {
        marginTop: px(12),
        marginHorizontal: px(20),
        marginBottom: px(27),
    },
    popContent: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
        textAlign: 'center',
    },
    percentBar: {
        marginTop: px(15),
        marginRight: px(8),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        width: px(203),
        height: px(8),
        position: 'relative',
    },
    activePart: {
        borderRadius: px(4),
        height: '100%',
        position: 'relative',
    },
    rangeText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    currentBox: {
        position: 'absolute',
        bottom: px(10),
        alignItems: 'center',
    },
    percentTextBox: {
        paddingVertical: px(1),
        paddingHorizontal: px(3),
        borderRadius: px(4),
        backgroundColor: Colors.red,
        minWidth: px(30),
        alignItems: 'center',
    },
    percentText: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
});
