/*
 * @Date: 2021-01-28 15:50:06
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-29 17:12:55
 * @Description: 基金详情
 */
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tab from '../../components/TabBar';
import Chart from '../../components/Chart';
import {baseChart} from './Detail/ChartOption';
import ChartData from './Detail/data.json';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const FundDetail = ({navigation, route}) => {
    const [data, setData] = useState({});
    const [chart1, setChart1] = useState({});
    const [chart2, setChart2] = useState({});
    const [curTab, setCurTab] = useState(0);
    const [period, setPeriod] = useState('m1');

    const init = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/detail/20210101', {
            fund_code: route.params.code,
        }).then((res) => {
            setData(res.result);
        });
    }, [route]);
    const getChart1 = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/nav_inc/20210101', {
            fund_code: route.params.code,
            period,
        }).then((res) => {
            setChart1(res.result);
        });
    }, [route, period]);
    const getChart2 = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/nav_trend/20210101', {
            fund_code: route.params.code,
            period,
        }).then((res) => {
            setChart2(res.result);
        });
    }, [route, period]);
    const onChangeTab = useCallback((i) => {
        setCurTab(i);
    }, []);
    const jump = useCallback(
        (item) => {
            if (item.url.indexOf('http') !== -1) {
                navigation.navigate({name: 'OpenPdf', params: {url: item.url, title: `${data.part1.name}${item.key}`}});
            }
        },
        [navigation, data]
    );
    const renderChart = useCallback(() => {
        return (
            <>
                {curTab === 0 && (
                    <View style={[Style.flexRow]}>
                        <View style={styles.legendItem}>
                            <Text style={styles.legendTitle}>{'2020-11'}</Text>
                            <Text style={styles.legendDesc}>时间</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <Text style={[styles.legendTitle, {color: getColor('30.3%')}]}>{'30.3%'}</Text>
                            <Text>
                                <FontAwesome5 name={'dot-circle'} color={Colors.red} size={12} />
                                <Text style={styles.legendDesc}> 本基金</Text>
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <Text style={[styles.legendTitle, {color: getColor('-0.28%')}]}>{'-0.28%'}</Text>
                            <Text>
                                <FontAwesome5 name={'dot-circle'} color={Colors.descColor} size={12} />
                                <Text style={styles.legendDesc}> 同类平均</Text>
                            </Text>
                        </View>
                    </View>
                )}
                <View style={{height: curTab === 0 ? 260 : 300}}>
                    <Chart initScript={baseChart(ChartData)} style={{width: '100%'}} />
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
    }, [data, curTab, period, getColor]);
    const getColor = useCallback((t) => {
        if (parseFloat(t.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replaceAll(',', '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);

    useEffect(() => {
        init();
    }, [init]);
    useEffect(() => {
        if (curTab === 0) {
            // getChart1();
        } else {
            // getChart2();
        }
    }, [curTab, getChart1, getChart2]);
    return (
        Object.keys(data).length > 0 && (
            <ScrollView style={styles.container} scrollIndicatorInsets={{right: 1}}>
                {data.part1 && (
                    <View style={styles.topPart}>
                        <View style={styles.borderBottom}>
                            <Text style={[styles.bigTitle, {paddingVertical: text(12)}]}>
                                {data.part1.name}
                                <Text style={{fontFamily: Font.numRegular}}>({data.part1.code})</Text>
                            </Text>
                            <Text style={[styles.subTitle]}>{'近一年涨跌'}</Text>
                            <Text
                                style={[
                                    styles.inc_yearly,
                                    {color: parseFloat(data.part1.inc_yearly) >= 0 ? Colors.red : Colors.green},
                                ]}>
                                {data.part1.inc_yearly}
                            </Text>
                            <View style={[Style.flexRow, {paddingVertical: text(12)}]}>
                                {data.part1.labels &&
                                    data.part1.labels.map((item, index) => {
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
                                    navigation.navigate({name: 'HistoryNav', params: {code: data.part1.code}})
                                }>
                                <View>
                                    <Text style={[styles.subTitle, {marginBottom: text(4)}]}>
                                        净值{data.part1.date}
                                    </Text>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.navText}>{data.part1.nav}</Text>
                                        <View
                                            style={[
                                                styles.incBox,
                                                {
                                                    backgroundColor:
                                                        parseFloat(data.part1.inc) >= 0 ? Colors.red : Colors.green,
                                                },
                                            ]}>
                                            <Text style={styles.incText}>{data.part1.inc}</Text>
                                        </View>
                                    </View>
                                </View>
                                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity style={[Style.flexBetween, styles.rankBox]}>
                                <View>
                                    <Text style={[styles.subTitle, {marginBottom: text(4)}]}>{'月度同类排名'}</Text>
                                    <Text style={styles.navText}>{data.part1.rank}</Text>
                                </View>
                                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {data.part2 && (
                    <ScrollableTabView
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
                                {item.items.length === 1 && (
                                    <TouchableOpacity
                                        style={[Style.flexBetween, {padding: Space.padding}]}
                                        onPress={() => jump(item.items[0])}>
                                        <Text style={[styles.title, {color: Colors.defaultColor, fontWeight: '500'}]}>
                                            {item.items[0].key}
                                        </Text>
                                        <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                                    </TouchableOpacity>
                                )}
                                {item.items.length > 1 && (
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
                                                        style={[{paddingVertical: text(20)}, Style.flexBetween]}>
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
