/*
 * @Date: 2021-01-27 18:11:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-03 19:33:27
 * @Description: 持有基金
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {useHeaderHeight} from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Tab from '../../components/TabBar';
import {deviceHeight, deviceWidth, px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';
import {useJump} from '../../components/hooks';
import Notice from '../../components/Notice';

const RatioColor = [
    '#E1645C',
    '#6694F3',
    '#F8A840',
    '#CC8FDD',
    '#5DC162',
    '#C7AC6B',
    '#62C4C7',
    '#E97FAD',
    '#C2E07F',
    '#B1B4C5',
    '#E78B61',
    '#8683C9',
    '#EBDD69',
];

const HoldingFund = ({navigation, route}) => {
    const headerHeight = useHeaderHeight();
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [curTab, setCurTab] = useState(0);
    const [list1, setList1] = useState([]);
    const [list2, setList2] = useState([]);
    const [loading, setLoading] = useState(false);
    const urlRef = useRef('');
    const [emptyTip, setEmptyTip] = useState('');
    const [tradeTip, setTradeTip] = useState('');

    const init = () => {
        http.get(
            curTab === 0 ? '/portfolio/funds/user_holding/20210101' : '/portfolio/funds/user_confirming/20210101',
            {
                poid: route.params?.poid || 'X00F000003',
            }
        ).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '持有基金'});
                setTabs((prev) => (prev.length > 0 ? prev : res.result.tabs));
                setEmptyTip(res.result.tip || '');
                if (res.result.processing_info) {
                    setTradeTip(res.result.processing_info);
                }
                curTab === 0 ? setList1(res.result.list || []) : setList2(res.result.list || []);
                urlRef.current = res.result.url;
            }
            setLoading(false);
            setRefreshing(false);
        });
    };
    const onChangeTab = (i) => {
        setCurTab(i);
        // setLoading(true);
        // setRefreshing(true);
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
    const onRefresh = useCallback(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curTab]);

    const renderContent = useCallback(
        (current) => {
            return (
                <>
                    {loading && (
                        <ActivityIndicator
                            color={Colors.brandColor}
                            style={{width: deviceWidth, height: deviceHeight - headerHeight - text(42)}}
                        />
                    )}
                    {current === 1 && tradeTip ? <Notice content={tradeTip} /> : null}
                    <View style={styles.subContainer}>
                        {(current === 0 ? list1 : list2)?.map((item, index) => {
                            return (
                                <View key={`type${index}`} style={{marginBottom: text(8)}}>
                                    <View style={[styles.titleContainer, Style.flexRow]}>
                                        <View
                                            style={[styles.circle, {backgroundColor: item.color || RatioColor[index]}]}
                                        />
                                        <Text
                                            style={[
                                                styles.name,
                                                {color: item.color || RatioColor[index], fontWeight: '500'},
                                            ]}>
                                            {item.name}
                                        </Text>
                                        {current === 0 && (
                                            <Text style={[styles.numStyle, {color: item.color || RatioColor[index]}]}>
                                                {item.percent < 0.01 ? '<0.01' : item.percent}%
                                            </Text>
                                        )}
                                    </View>
                                    {item?.funds?.map((fund, i, arr) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    global.LogTool('click', 'fund', item.code);
                                                    navigation.navigate('FundDetail', {code: fund.code});
                                                }}
                                                style={[
                                                    styles.fundContainer,
                                                    i === arr.length - 1 ? {marginBottom: 0} : {},
                                                    current === 1 ? {paddingVertical: text(12)} : {},
                                                ]}
                                                key={`${item.type}${fund.code}${i}`}>
                                                <View
                                                    style={[
                                                        styles.fundTitle,
                                                        Style.flexBetween,
                                                        current === 1 ? {marginBottom: text(8)} : {},
                                                    ]}>
                                                    <View style={Style.flexRow}>
                                                        <Text style={[styles.name]}>{fund.name}</Text>
                                                        {/* <Text
                                                        style={[
                                                            styles.numStyle,
                                                            {
                                                                fontFamily: Font.numRegular,
                                                                color: Colors.darkGrayColor,
                                                            },
                                                        ]}>
                                                        ({fund.code})
                                                    </Text> */}
                                                    </View>
                                                    <Text style={styles.subTitle}>
                                                        {current === 0 ? fund.profit_date : fund.acked_date}
                                                    </Text>
                                                </View>
                                                <View style={Style.flexRow}>
                                                    {current === 0 && (
                                                        <View style={{flex: 1}}>
                                                            <View style={[Style.flexRow, {marginBottom: text(12)}]}>
                                                                <Text
                                                                    style={[
                                                                        styles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'占比'}
                                                                </Text>
                                                                <Text style={[styles.numStyle]}>
                                                                    {fund.percent < 0.01 ? '<0.01' : fund.percent}%
                                                                </Text>
                                                            </View>
                                                            <View style={Style.flexRow}>
                                                                <Text
                                                                    style={[
                                                                        styles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'份额(份)'}
                                                                </Text>
                                                                <Text style={[styles.numStyle]}>{fund.share}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    {current === 0 && (
                                                        <View style={{flex: 1}}>
                                                            <View style={[Style.flexRow, {marginBottom: text(12)}]}>
                                                                <Text
                                                                    style={[
                                                                        styles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'累计收益(元)'}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.numStyle,
                                                                        {color: getColor(fund.profit_acc)},
                                                                    ]}>
                                                                    {fund.profit_acc}
                                                                </Text>
                                                            </View>
                                                            <View style={Style.flexRow}>
                                                                <Text
                                                                    style={[
                                                                        styles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'金额(元)'}
                                                                </Text>
                                                                <Text style={[styles.numStyle]}>{fund.amount}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    {current === 1 && (
                                                        <>
                                                            <Text
                                                                style={[
                                                                    styles.subTitle,
                                                                    {color: Colors.darkGrayColor},
                                                                ]}>
                                                                {fund.key}
                                                            </Text>
                                                            <Text style={[styles.numStyle]}>{fund.val}</Text>
                                                        </>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })}
                        {/* {list1?.length === 0 && current === 0 && <Empty text={'暂无持有中基金'} />}
                        {list2?.length === 0 && current === 1 && <Empty text={'暂无确认中基金'} />} */}
                        {emptyTip ? <Empty text={emptyTip} /> : null}
                        {current === 0 && (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.historyHolding, Style.flexBetween]}
                                onPress={() => {
                                    global.LogTool('click', 'history');
                                    jump(urlRef.current);
                                }}>
                                <Text style={[styles.name, {fontWeight: '500'}]}>{'历史持有基金'}</Text>
                                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            );
        },
        [list1, list2, getColor, navigation, jump, loading, headerHeight, emptyTip, tradeTip]
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: (props) => (
                <>
                    <TouchableOpacity
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => {
                            global.LogTool('click', 'search');
                            navigation.navigate('FundSearching', {poid: route.params?.poid || ''});
                        }}>
                        <Text>基金查询</Text>
                    </TouchableOpacity>
                </>
            ),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curTab]);

    useEffect(() => {
        if (list1?.length === 0 && curTab === 0) {
            setEmptyTip((prev) => (prev === '' ? '暂无持有中基金' : prev));
        } else if (list2?.length === 0 && curTab === 1) {
            setEmptyTip((prev) => (prev === '' ? '暂无确认中基金' : prev));
        } else {
            setEmptyTip('');
        }
    }, [curTab, list1, list2]);

    return tabs?.length > 0 ? (
        <ScrollableTabView
            style={[styles.container]}
            renderTabBar={() => <Tab />}
            initialPage={0}
            onChangeTab={(cur) => onChangeTab(cur.i)}>
            {tabs.map((tab, index) => {
                return (
                    <ScrollView
                        key={`tab${index}`}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        tabLabel={tab}
                        style={[{transform: [{translateY: text(-1.5)}]}]}>
                        {renderContent(index)}
                    </ScrollView>
                );
            })}
        </ScrollableTabView>
    ) : (
        <ActivityIndicator
            color={Colors.brandColor}
            style={{width: deviceWidth, height: deviceHeight - headerHeight}}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topRightBtn: {
        flex: 1,
        width: text(72),
        marginRight: text(8),
    },
    subContainer: {
        paddingHorizontal: Space.padding,
    },
    titleContainer: {
        paddingVertical: text(14),
    },
    circle: {
        width: text(10),
        height: text(10),
        borderRadius: text(6),
        marginRight: text(8),
    },
    name: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    numStyle: {
        fontSize: text(13),
        lineHeight: text(16),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        marginLeft: text(4),
    },
    fundContainer: {
        marginBottom: text(12),
        paddingTop: text(14),
        paddingBottom: text(18),
        paddingHorizontal: text(14),
        borderRadius: text(4),
        backgroundColor: '#fff',
    },
    fundTitle: {
        marginBottom: text(14),
    },
    subTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.brandColor,
    },
    historyHolding: {
        padding: Space.padding,
        marginVertical: text(28),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
});

export default HoldingFund;
