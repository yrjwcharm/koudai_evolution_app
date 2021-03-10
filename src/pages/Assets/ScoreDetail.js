/*
 * @Date: 2021-02-02 09:59:31
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-09 19:06:31
 * @Description: 魔分明细
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BoxShadow} from 'react-native-shadow';
import Feather from 'react-native-vector-icons/Feather';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth, deviceHeight} from '../../utils/appUtil';
import http from '../../services';

const ScoreDetail = ({navigation, route}) => {
    const insets = useSafeAreaInsets();
    const [data, setData] = useState({});
    const [tabs, setTabs] = useState([]);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [type, setType] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [show, setShow] = useState(false);
    const shadow = useRef({
        color: '#174384',
        border: 4,
        radius: text(12),
        opacity: 0.25,
        x: 0,
        y: 2,
        width: text(90),
        height: text(102),
        style: {
            position: 'absolute',
            top: 0,
            right: Space.padding,
            zIndex: 10,
        },
    });

    const init = useCallback(
        (status, first = false) => {
            status === 'refresh' &&
                http.get('/promotion/point/20210101').then((res) => {
                    if (res.code === '000000') {
                        StatusBar.setBarStyle('light-content');
                        setData(res.result);
                    }
                });
            http.get('/promotion/point/records/20210101', {page, type}).then((res) => {
                if (res.code === '000000') {
                    first && setTabs(res.result.tabs);
                    status === 'refresh' && setShow(false);
                    if (!res.result.records || res.result.records?.length < 20) {
                        setHasMore(false);
                    } else {
                        setHasMore(true);
                    }
                    if (status === 'refresh') {
                        setList(res.result.records || []);
                        setRefreshing(false);
                    } else if (status === 'loadmore') {
                        setList((prevList) => [...prevList, ...(res.result.records || [])]);
                    }
                }
            });
        },
        [page, type]
    );
    // 切换类型
    const onTab = (t) => {
        setShow(false);
        setPage(1);
        setType(t);
    };
    // 下拉刷新
    const onRefresh = () => {
        setPage(1);
    };
    // 上拉加载
    const onEndReached = useCallback(
        ({distanceFromEnd}) => {
            if (distanceFromEnd < 0) {
                return false;
            }
            if (hasMore) {
                setPage((p) => p + 1);
            }
        },
        [hasMore]
    );
    const renderItem = ({item, index}) => {
        return (
            <View
                style={[
                    styles.itemBox,
                    {marginTop: index === 0 ? text(20) : 0},
                    index === 0 ? styles.borderRadius : {},
                ]}>
                <View style={[Style.flexBetween, {marginBottom: text(8)}]}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.largeTitle,
                            {color: item.type === 3 ? Colors.lightGrayColor : Colors.defaultColor, maxWidth: '80%'},
                        ]}>
                        {item.title}
                    </Text>
                    <Text
                        style={[
                            styles.moreTitle,
                            {
                                fontFamily: Font.numFontFamily,
                                color:
                                    item.type === 1
                                        ? Colors.red
                                        : item.type === 3
                                        ? Colors.lightGrayColor
                                        : Colors.defaultColor,
                            },
                        ]}>{`${item.type === 1 ? '+' : '-'}${item.point}`}</Text>
                </View>
                <View style={Style.flexBetween}>
                    <Text style={[styles.date, item.type === 3 ? {color: Colors.lightGrayColor} : {}]}>
                        {item.date}
                    </Text>
                    {item.type === 3 && <Text style={[styles.smTips, {color: Colors.lightGrayColor}]}>未使用消失</Text>}
                </View>
            </View>
        );
    };
    // 渲染头部
    const renderHeader = useCallback(() => {
        return (
            <>
                <Image
                    source={require('../../assets/personal/score-bg.png')}
                    style={{width: deviceWidth, height: text(167), marginLeft: -Space.marginAlign}}
                />
                <View style={[Style.flexCenter, styles.scoreNumContainer]}>
                    <View style={[Style.flexRowCenter, styles.scoreNum]}>
                        <Text style={styles.scoreNumText}>{data.bonus || '****'}</Text>
                    </View>
                    <View style={Style.flexRowCenter}>
                        <Text style={[styles.tipText, {marginRight: text(50)}]}>{`累计获取 ${
                            data.acquired_acc !== undefined
                                ? data.acquired_acc > 0
                                    ? '+' + data.acquired_acc
                                    : data.acquired_acc
                                : '**'
                        }`}</Text>
                        <Text style={styles.tipText}>{`累计使用 ${
                            data.used_acc !== undefined
                                ? data.used_acc > 0
                                    ? '-' + data.used_acc
                                    : data.used_acc
                                : '**'
                        }`}</Text>
                    </View>
                </View>
            </>
        );
    }, [data]);
    // 渲染底部
    const renderFooter = useCallback(() => {
        return (
            <>
                {list.length > 0 && (
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{hasMore ? '正在加载...' : '暂无更多了'}</Text>
                    </View>
                )}
            </>
        );
    }, [list.length, hasMore]);

    useEffect(() => {
        navigation.setOptions({
            title: route.params?.title || '魔分明细',
            headerBackImage: () => {
                return <Feather name="chevron-left" size={30} color={'#fff'} />;
            },
            headerRight: () => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[Style.flexRowCenter, styles.selectCon]}
                        onPress={() => setShow((prev) => !prev)}>
                        <Text style={[styles.detail, {marginRight: text(4)}]}>{tabs[type - 1]?.text}</Text>
                        <AntDesign name={show ? 'caretup' : 'caretdown'} size={8} color={'#fff'} />
                    </TouchableOpacity>
                );
            },
            headerStyle: {
                backgroundColor: Colors.brandColor,
                shadowOffset: {
                    height: 0,
                },
                elevation: 0,
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: text(18),
            },
        });
    });
    useEffect(() => {
        if (page === 1) {
            init('refresh', true);
        } else {
            init('loadmore');
        }
    }, [page, type, init]);
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );

    return (
        <View style={[styles.container]}>
            {show && <TouchableOpacity style={styles.mask} activeOpacity={1} onPress={() => setShow(false)} />}
            {show && (
                <BoxShadow setting={shadow.current}>
                    <View style={styles.optionsBox}>
                        {tabs.map((tab, index) => {
                            return index === 1 ? (
                                <View key={tab.type} style={[styles.border, {flex: 1, height: '100%'}]}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => onTab(tab.type)}
                                        style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                        <Text style={[styles.tipText, {color: '#101A30'}]}>{tab.text}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => onTab(tab.type)}
                                    key={tab.type}
                                    style={[{flex: 1, height: '100%'}, Style.flexCenter]}>
                                    <Text style={[styles.tipText, {color: '#101A30'}]}>{tab.text}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </BoxShadow>
            )}

            <SectionList
                sections={list.length > 0 ? [{data: list, title: 'list'}] : []}
                contentContainerStyle={styles.exchangeContainer}
                initialNumToRender={10}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={renderFooter}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={renderItem}
                renderSectionHeader={renderHeader}
                stickySectionHeadersEnabled={false}
                style={{flex: 1, marginBottom: insets.bottom}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    selectCon: {
        height: text(24),
        marginRight: Space.marginAlign,
        paddingHorizontal: text(12),
        borderRadius: text(12),
        backgroundColor: '#6299EA',
        position: 'relative',
    },
    detail: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: '#fff',
    },
    optionsBox: {
        flex: 1,
        borderRadius: Space.borderRadius,
        paddingHorizontal: text(10),
        backgroundColor: '#fff',
    },
    border: {
        borderTopWidth: Space.borderWidth,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scoreNumContainer: {
        marginTop: text(-152),
    },
    scoreNum: {
        marginBottom: text(8),
    },
    scoreNumText: {
        fontSize: text(30),
        color: '#fff',
        fontFamily: Font.numFontFamily,
        marginRight: text(8),
    },
    tipText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#fff',
    },
    exchangeContainer: {
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        minHeight: text(90),
        backgroundColor: '#fff',
    },
    availableScore: {
        fontSize: text(20),
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    num: {
        fontSize: text(30),
        fontFamily: Font.numFontFamily,
    },
    smTips: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#80899B',
    },
    moreTitle: {
        fontSize: text(18),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    largeTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
    },
    date: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#80899B',
    },
    separator: {
        marginHorizontal: Space.marginAlign,
        borderTopColor: Colors.borderColor,
        borderTopWidth: Space.borderWidth,
    },
    itemBox: {
        padding: Space.padding,
        backgroundColor: '#fff',
    },
    borderRadius: {
        borderTopLeftRadius: Space.borderRadius,
        borderTopRightRadius: Space.borderRadius,
    },
    footer: {
        marginHorizontal: Space.marginAlign,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    footerText: {
        paddingVertical: Space.padding,
        textAlign: 'center',
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: 'transparent',
        zIndex: 9,
    },
});

export default ScoreDetail;
