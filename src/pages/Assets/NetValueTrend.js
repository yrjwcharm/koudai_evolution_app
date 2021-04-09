/*
 * @Date: 2021-01-27 17:19:14
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-09 15:19:20
 * @Description: 净值走势
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px as text, deviceWidth} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Chart} from '../../components/Chart';
import Dot from '../Portfolio/components/Dot';
import {baseAreaChart} from '../Portfolio/components/ChartOption';
import EmptyTip from '../../components/EmptyTip';

const NetValueTrend = ({poid}) => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [period, setPeriod] = useState('m1');
    const [chartData, setChart] = useState({});
    const [chart_data, setChart_data] = useState([]);
    const textTime = useRef(null);
    const textThisFund = useRef(null);
    const textBenchmark = useRef(null);

    const init = useCallback(() => {
        http.get('/profit/portfolio_nav/20210101', {period, poid}).then((res) => {
            if (res.code === '000000') {
                setRefreshing(false);
                setChart_data([]);
                setChart(res.result);
                setChart_data(res.result.chart);
            }
        });
    }, [period, poid]);
    // 下拉刷新回调
    const onRefresh = useCallback(() => {
        init();
    }, [init]);
    // 获取日收益背景颜色
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.darkGrayColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) === 0) {
            return Colors.darkGrayColor;
        } else {
            return Colors.red;
        }
    }, []);
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            // console.log(items);
            textTime.current.setNativeProps({text: items[0]?.title});
            textThisFund.current.setNativeProps({
                text: `${items[0]?.value}`,
                style: [styles.legendTitle, {color: getColor(`${items[0]?.value}`)}],
            });
            textBenchmark.current.setNativeProps({
                text: `${items[1]?.value}`,
                style: [styles.legendTitle, {color: getColor(`${items[1]?.value}`)}],
            });
        },
        [getColor]
    );
    // 图表滑动结束
    const onHide = useCallback(
        ({items}) => {
            chartData.label[0] && textTime.current.setNativeProps({text: chartData.label[0]?.val});
            chartData.label[1] &&
                textThisFund.current.setNativeProps({
                    text: `${chartData.label[1]?.val}`,
                    style: [styles.legendTitle, {color: getColor(`${chartData.label[1]?.val}`)}],
                });
            chartData.label[2] &&
                textBenchmark.current.setNativeProps({
                    text: `${chartData.label[2]?.val}`,
                    style: [styles.legendTitle, {color: getColor(`${chartData.label[2]?.val}`)}],
                });
        },
        [chartData, getColor]
    );

    useEffect(() => {
        init();
    }, [init]);
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            scrollEventThrottle={1000}
            style={[styles.container, {transform: [{translateY: text(-1.5)}]}]}>
            {chartData.chart ? (
                <>
                    <View style={styles.netValueChart}>
                        <View style={[Style.flexRow, {paddingTop: Space.padding, paddingHorizontal: text(24)}]}>
                            {chartData?.label?.map((item, index) => {
                                return (
                                    <View key={item.val + index} style={styles.legendItem}>
                                        <TextInput
                                            defaultValue={`${item.val}`}
                                            editable={false}
                                            ref={index === 0 ? textTime : index === 1 ? textThisFund : textBenchmark}
                                            style={[
                                                styles.legendTitle,
                                                index !== 0 ? {color: getColor(`${item.val}`)} : {},
                                            ]}
                                        />
                                        <View style={Style.flexRow}>
                                            {index !== 0 && (
                                                <Dot
                                                    bgColor={
                                                        index === 1
                                                            ? 'rgba(231, 73, 73, 0.15)'
                                                            : 'rgba(84, 89, 104, 0.15)'
                                                    }
                                                    color={index === 1 ? Colors.red : Colors.descColor}
                                                />
                                            )}
                                            <Text style={[styles.legendDesc, index !== 0 ? {marginLeft: text(4)} : {}]}>
                                                {item.name}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{height: 220}}>
                            {chart_data.length > 0 ? (
                                <Chart
                                    initScript={baseAreaChart(
                                        chart_data,
                                        [Colors.red, Colors.lightBlackColor, 'transparent'],
                                        ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                                        true,
                                        2,
                                        deviceWidth - text(10),
                                        10,
                                        chartData?.tag_position
                                    )}
                                    onChange={onChartChange}
                                    onHide={onHide}
                                    style={{width: '100%'}}
                                />
                            ) : null}
                        </View>
                        <View
                            style={[
                                Style.flexRow,
                                {justifyContent: 'center', paddingTop: text(8), paddingBottom: text(28)},
                            ]}>
                            {chartData?.sub_tabs?.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={item.val + index}
                                        onPress={() => {
                                            global.LogTool('click', item.val);
                                            setPeriod(item.val);
                                        }}
                                        style={[
                                            Style.flexCenter,
                                            styles.subtab,
                                            period === item.val ? styles.activeTab : {},
                                        ]}>
                                        <Text
                                            style={[
                                                styles.subTitle,
                                                {color: period === item.val ? Colors.brandColor : Colors.descColor},
                                            ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <View style={styles.buyTableWrap}>
                        <View style={styles.buyTableHead}>
                            <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                <Text style={[styles.buyTableItem, styles.fontColor]}>{chartData.table?.th[0]}</Text>
                            </View>
                            <View style={[styles.buyTableCell]}>
                                <Text style={[styles.buyTableItem, styles.fontColor]}>{chartData.table?.th[1]}</Text>
                            </View>
                            <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                <Text style={[styles.buyTableItem, styles.fontColor]}>{chartData.table?.th[2]}</Text>
                            </View>
                        </View>
                        {chartData.table?.tr_list?.map((item, index) => {
                            return (
                                <View
                                    key={index + 'c'}
                                    style={[
                                        styles.buyTableBody,
                                        {backgroundColor: (index + 1) % 2 == 0 ? Colors.bgColor : '#fff'},
                                    ]}>
                                    <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                        <Text style={styles.buyTableItem}>{item[0]}</Text>
                                    </View>
                                    <View style={[styles.buyTableCell]}>
                                        <Text style={[styles.buyTableItem, {color: getColor(item[1])}]}>{item[1]}</Text>
                                    </View>
                                    <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                        <Text style={[styles.buyTableItem, {color: getColor(item[2])}]}>{item[2]}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </>
            ) : (
                <EmptyTip style={{paddingVertical: text(40)}} text="暂无数据" />
            )}
            <View style={{padding: Space.padding, marginBottom: insets.bottom}}>
                <Text style={[styles.bigTitle, {marginBottom: text(4)}]}>{'什么是净值'}</Text>
                <Text style={[styles.descContent, {marginBottom: text(14)}]}>
                    {'每份基金单位的净资产价值，等于基金的总资产减去总负债后的余额再除以基金全部发行的单位份额总数。'}
                </Text>
                <Text style={[styles.bigTitle, {marginBottom: text(4)}]}>{'什么我的净值走势和我的累计收益不一致'}</Text>
                <Text style={[styles.descContent, {marginBottom: text(14)}]}>
                    {
                        '每份基金单位的净资产价值，等于基金的总资产减去总负债后的余额再除以基金全部发行的单位份额总数每份基金单位的净资产价值，等于基金的总资产减去总负债后的余额再除以基金全部发行的单位份额总数。'
                    }
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    chart: {
        height: text(282),
    },
    netValueChart: {
        backgroundColor: '#fff',
        // height: text(320),
    },
    bigTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    descContent: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.darkGrayColor,
        textAlign: 'justify',
    },
    buyTableCell: {
        flex: 1,
        height: '100%',
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyTableItem: {
        flex: 1,
        textAlign: 'center',
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
    buyTableWrap: {
        marginBottom: text(20),
        marginHorizontal: Space.marginAlign,
        borderColor: Colors.borderColor,
        borderWidth: Space.borderWidth,
        borderRadius: Space.borderRadius,
        overflow: 'hidden',
    },
    buyTableHead: {
        flexDirection: 'row',
        backgroundColor: Colors.bgColor,
        height: text(43),
    },
    buyTableBody: {
        flexDirection: 'row',
        height: text(40),
    },
    fontColor: {
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    legendItem: {
        flex: 1,
        alignItems: 'center',
    },
    legendTitle: {
        fontSize: Font.textH1,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        padding: 0,
        // fontWeight: 'bold',
    },
    legendDesc: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.descColor,
    },
    subtab: {
        paddingHorizontal: text(10),
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
    subTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
});

NetValueTrend.propTypes = {
    poid: PropTypes.string.isRequired,
};

export default NetValueTrend;
