/*
 * @Date: 2021-12-06 14:17:56
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-12-14 20:55:59
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
    const [data, setData] = useState({});

    /**
     * 渲染每个工具模块
     * @param {*} item 每个工具模块数据
     * @param {number} index 数组索引
     * @returns React Node
     */
    const renderToolBox = (item = {}, index = 0) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={item + index}
                onPress={() => {
                    // 未开启展示弹窗
                    if (item.pop) {
                        Modal.show({
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
                            title: item.pop.title,
                        });
                    } else {
                        jump(item.url);
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
                                        html={`${item.state_info.value}`}
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
                    <View style={{marginTop: {1: px(14), 2: px(12), 3: px(6)}[item.margin_type]}}>
                        <HTML html={item.content} style={styles.contentSty} />
                    </View>
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
                title={scrollY > 0 ? data.title || '财富工具' : ''}
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
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                <Image onLoad={(e) => console.log(e.nativeEvent)} source={{uri: data.img}} style={styles.topBg} />
                <View style={{paddingTop: insets.top + px(44), paddingBottom: insets.bottom}}>
                    <View style={[styles.titleContainer, {top: insets.top + px(44)}]}>
                        <Text style={styles.title}>{'财富工具'}</Text>
                        <Text style={styles.subTitle}>{'帮你快速进行交易决策'}</Text>
                    </View>
                    <View
                        style={{
                            marginTop: px(311) - insets.top - px(44) + px(12),
                            paddingHorizontal: Space.padding,
                        }}>
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
    titleContainer: {
        paddingLeft: px(24),
        position: 'absolute',
        left: 0,
        width: deviceWidth,
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
        fontSize: px(22),
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