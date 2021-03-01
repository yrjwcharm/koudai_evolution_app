/*
 * @Date: 2021-01-28 15:50:06
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-01 20:25:44
 * @Description: 基金详情
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tab from '../../components/TabBar';
import {Chart} from '../../components/Chart';
import {baseAreaChart, baseLineChart} from './components/ChartOption';
import Toast from '../../components/Toast';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {useJump} from '../../components/hooks';

const FundDetail = ({navigation, route}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [chart1, setChart1] = useState({});
    const [chart2, setChart2] = useState({});
    const [chart3, setChart3] = useState({});
    const [curTab, setCurTab] = useState(0);
    const [period, setPeriod] = useState('m1');
    const [summary, setSummary] = useState([]);

    const init = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/fund/detail/20210101', {
            fund_code: route.params?.code,
            // fund_code: '006322',
        }).then((res) => {
            setData(res.result);
        });
    }, [route]);
    const getChart1 = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/fund/nav/inc/20210101', {
            fund_code: route.params?.code,
            // fund_code: '006322',
            period,
        }).then((res) => {
            setChart1(res.result);
            setSummary(res.result.summary);
        });
    }, [route, period]);
    const getChart2 = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/fund/nav/trend/20210101', {
            fund_code: route.params?.code,
            // fund_code: '006322',
            period,
        }).then((res) => {
            setChart2(res.result);
            setSummary(res.result.summary);
        });
    }, [route, period]);
    const getChart3 = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/fund/nav/monetary/20210101', {
            fund_code: route.params?.code,
            // fund_code: '006322',
            period,
        }).then((res) => {
            setChart3(res.result);
            setSummary(res.result.summary);
        });
    }, [route, period]);
    const onChangeTab = useCallback((i) => {
        setCurTab(i);
        setPeriod('m1');
    }, []);
    const renderChart = useCallback(() => {
        return (
            <>
                <View style={[Style.flexRow]}>
                    {summary.map((item, index) => {
                        return (
                            <View key={item.key} style={styles.legendItem}>
                                <Text style={[styles.legendTitle, index !== 0 ? {color: getColor(`${item.val}`)} : {}]}>
                                    {item.val}
                                </Text>
                                <View style={Style.flexRow}>
                                    {index !== 0 && (
                                        <FontAwesome5
                                            name={'dot-circle'}
                                            color={index === 1 ? Colors.red : Colors.descColor}
                                            size={12}
                                        />
                                    )}
                                    <Text style={[styles.legendDesc, index !== 0 ? {marginLeft: text(4)} : {}]}>
                                        {item.key}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
                <View style={{height: 260}}>
                    {data.part1 && !data.part1.fund.is_monetary ? (
                        <>
                            {curTab === 0 ? (
                                <Chart
                                    initScript={baseAreaChart(chart1.chart, [Colors.red, Colors.lightBlackColor], true)}
                                    data={chart1.chart}
                                    onChange={onChartChange}
                                    onHide={onHide}
                                    style={{width: '100%'}}
                                />
                            ) : (
                                <Chart
                                    initScript={baseLineChart(chart2.chart, [Colors.red], false, 4)}
                                    data={chart2.chart}
                                    onChange={onChartChange}
                                    onHide={onHide}
                                    style={{width: '100%'}}
                                />
                            )}
                        </>
                    ) : (
                        <Chart
                            initScript={baseLineChart(chart3.chart, [Colors.red, Colors.lightBlackColor], true)}
                            data={chart3.chart}
                            onChange={onChartChange}
                            onHide={onHide}
                            style={{width: '100%'}}
                        />
                    )}
                </View>
                <View style={[Style.flexRow, {justifyContent: 'center'}]}>
                    {data.part2[curTab].subtabs.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={`subtab${index}`}
                                onPress={() => setPeriod(item.val)}
                                style={[Style.flexCenter, styles.subtab, period === item.val ? styles.activeTab : {}]}>
                                <Text
                                    style={[
                                        styles.subTitle,
                                        {color: period === item.val ? Colors.brandColor : Colors.descColor},
                                    ]}>
                                    {item.key}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </>
        );
    }, [
        data.part1,
        data.part2,
        curTab,
        period,
        chart1.chart,
        chart2.chart,
        chart3.chart,
        summary,
        getColor,
        onChartChange,
        onHide,
    ]);
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replaceAll(',', '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            // console.log(items);
            if (curTab === 0) {
                setSummary((prev) => [
                    {
                        ...prev[0],
                        val: items[0]?.title,
                    },
                    {
                        ...prev[1],
                        val: items[0]?.value,
                    },
                    {
                        ...prev[2],
                        val: items[1]?.value,
                    },
                ]);
            } else {
                setSummary((prev) => [
                    {
                        ...prev[0],
                        val: items[0]?.title,
                    },
                    {
                        ...prev[1],
                        val: items[0]?.value,
                    },
                ]);
            }
        },
        [curTab]
    );
    // 图表滑动结束
    const onHide = useCallback(
        ({items}) => {
            if (curTab === 0) {
                if (data.part1 && !data.part1.fund.is_monetary) {
                    setSummary(chart1.summary);
                } else {
                    setSummary(chart3.summary);
                }
            } else {
                setSummary(chart2.summary);
            }
        },
        [data.part1, curTab, chart1.summary, chart2.summary, chart3.summary]
    );

    useEffect(() => {
        init();
    }, [init]);
    useEffect(() => {
        if (curTab === 0) {
            if (data.part1 && !data.part1.fund.is_monetary) {
                getChart1();
            } else {
                getChart3();
            }
        } else {
            getChart2();
        }
    }, [data.part1, curTab, getChart1, getChart2, getChart3]);
    return (
        Object.keys(data).length > 0 && (
            <ScrollView style={styles.container} scrollIndicatorInsets={{right: 1}}>
                {data.part1 && (
                    <View style={styles.topPart}>
                        <View style={styles.borderBottom}>
                            <Text style={[styles.bigTitle, {paddingVertical: text(12)}]}>
                                {data.part1.fund && data.part1.fund.name}
                                <Text style={{fontFamily: Font.numRegular}}>
                                    ({data.part1.fund && data.part1.fund.code})
                                </Text>
                            </Text>
                            <Text style={[styles.subTitle]}>{data.part1.yield && data.part1.yield.key}</Text>
                            <Text
                                style={[
                                    styles.inc_yearly,
                                    {
                                        color: getColor(data.part1.yield?.val),
                                    },
                                ]}>
                                {data.part1.yield && data.part1.yield.val}
                            </Text>
                            <View style={[Style.flexRow, {paddingVertical: text(12)}]}>
                                {data.part1.fund &&
                                    data.part1.fund.tags &&
                                    data.part1.fund.tags.map((item, index) => {
                                        return (
                                            <View style={styles.label} key={item}>
                                                <Text style={[styles.smTitle]}>{item}</Text>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                        <View style={[{paddingLeft: text(4), paddingVertical: text(12)}, Style.flexRow]}>
                            <TouchableOpacity
                                style={[Style.flexBetween, styles.navBox]}
                                onPress={() =>
                                    navigation.navigate({name: 'HistoryNav', params: {code: data.part1.fund.code}})
                                }>
                                <View>
                                    <Text style={[styles.subTitle, {marginBottom: text(4)}]}>
                                        {data.part1.nav && data.part1.nav.key}
                                    </Text>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.navText}>{data.part1.nav && data.part1.nav.val}</Text>
                                        <View
                                            style={[
                                                styles.incBox,
                                                {
                                                    backgroundColor:
                                                        parseFloat(data.part1.nav ? data.part1.nav.subVal : 0) >= 0
                                                            ? Colors.red
                                                            : Colors.green,
                                                },
                                            ]}>
                                            <Text style={styles.incText}>
                                                {data.part1.nav && data.part1.nav.subVal}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={[Style.flexBetween, styles.rankBox]}
                                onPress={() =>
                                    navigation.navigate({name: 'FundRanking', params: {code: data.part1.fund.code}})
                                }>
                                <View>
                                    <Text style={[styles.subTitle, {marginBottom: text(4)}]}>
                                        {data.part1.rank && data.part1.rank.key}
                                    </Text>
                                    <Text style={styles.navText}>{data.part1.rank && data.part1.rank.val}</Text>
                                </View>
                                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {data.part2 && (
                    <ScrollableTabView
                        locked
                        style={[styles.groupContainer, {overflow: 'hidden'}]}
                        renderTabBar={() => <Tab />}
                        initialPage={0}
                        onChangeTab={(cur) => onChangeTab(cur.i)}>
                        {data.part2.map((item, index) => {
                            return (
                                <View
                                    key={`tab${index}`}
                                    tabLabel={item.tab}
                                    style={[{transform: [{translateY: text(-1.5)}]}]}>
                                    <View style={styles.chartContainer}>{renderChart()}</View>
                                </View>
                            );
                        })}
                    </ScrollableTabView>
                )}
                {data.part3 &&
                    data.part3.map((item, index) => {
                        return (
                            <View style={styles.groupContainer} key={`group${index}`}>
                                {item.items.length === 0 && (
                                    <TouchableOpacity
                                        style={[Style.flexBetween, {padding: Space.padding}]}
                                        onPress={() => jump(item)}>
                                        <Text style={[styles.title, {color: Colors.defaultColor, fontWeight: '500'}]}>
                                            {item.group}
                                        </Text>
                                        <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                                    </TouchableOpacity>
                                )}
                                {item.items.length >= 1 && (
                                    <View style={[{paddingHorizontal: Space.padding}]}>
                                        <Text
                                            style={[
                                                styles.title,
                                                {
                                                    color: Colors.defaultColor,
                                                    fontWeight: '500',
                                                    paddingVertical: text(13),
                                                },
                                            ]}>
                                            {item.group}
                                        </Text>
                                        {item.items.map((v, i) => {
                                            return (
                                                <View
                                                    style={{
                                                        borderTopWidth: Space.borderWidth,
                                                        borderColor: Colors.borderColor,
                                                    }}
                                                    key={`${item.group}info${i}`}>
                                                    <TouchableOpacity
                                                        style={[{paddingVertical: text(20)}, Style.flexBetween]}
                                                        onPress={() => jump(v)}>
                                                        <Text style={styles.title}>{v.key}</Text>
                                                        <Text style={styles.groupVal}>
                                                            {Object.prototype.toString.call(v.val) ===
                                                            '[object Object]' ? (
                                                                <>
                                                                    <Text style={styles.origin}>{v.val.origin}</Text>
                                                                    &nbsp;&nbsp;
                                                                    <Text>{v.val.mofang}</Text>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {v.val}
                                                                    &nbsp;&nbsp;
                                                                    <FontAwesome
                                                                        name={'angle-right'}
                                                                        size={20}
                                                                        color={Colors.descColor}
                                                                    />
                                                                </>
                                                            )}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                <View style={styles.bottom}>
                    {data.bottom &&
                        data.bottom.map((item, index) => {
                            return (
                                <Text style={styles.bottomText} key={`bottom${index}`}>
                                    {item}
                                </Text>
                            );
                        })}
                </View>
            </ScrollView>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
    },
    borderBottom: {
        paddingLeft: text(4),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
    },
    subTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
    inc_yearly: {
        fontSize: text(30),
        lineHeight: text(36),
        fontFamily: Font.numFontFamily,
    },
    label: {
        paddingVertical: text(2),
        paddingHorizontal: text(8),
        marginRight: text(8),
        borderRadius: text(2),
        backgroundColor: '#EDF4FF',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
    },
    smTitle: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.brandColor,
    },
    navBox: {
        flex: 1,
        paddingRight: Space.padding,
    },
    navText: {
        fontSize: text(20),
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    incBox: {
        marginLeft: text(10),
        paddingVertical: text(2),
        paddingHorizontal: text(6),
        borderRadius: text(4),
    },
    incText: {
        fontSize: Font.textH3,
        lineHeight: text(16),
        color: '#fff',
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    rankBox: {
        flex: 1,
        paddingLeft: text(12),
    },
    divider: {
        width: Space.borderWidth,
        height: text(44),
        backgroundColor: '#E2E4EA',
    },
    chartContainer: {
        minHeight: text(320),
        paddingVertical: Space.padding,
    },
    legendItem: {
        flex: 1,
        alignItems: 'center',
    },
    legendTitle: {
        fontSize: Font.textH1,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    legendDesc: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.descColor,
    },
    subtab: {
        paddingHorizontal: text(14),
        marginHorizontal: text(6),
        borderRadius: text(14),
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        height: text(28),
        backgroundColor: '#fff',
    },
    activeTab: {
        borderWidth: 0,
        backgroundColor: '#F1F6FF',
    },
    groupContainer: {
        marginHorizontal: Space.marginAlign,
        marginTop: Space.marginVertical,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    bottom: {
        paddingVertical: text(24),
        paddingHorizontal: Space.padding,
    },
    bottomText: {
        fontSize: Font.textH3,
        lineHeight: text(20),
        color: Colors.darkGrayColor,
    },
    groupVal: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
    },
    origin: {
        marginRight: text(4),
        color: Colors.darkGrayColor,
        textDecorationLine: 'line-through',
        textDecorationColor: Colors.darkGrayColor,
    },
});

export default FundDetail;
