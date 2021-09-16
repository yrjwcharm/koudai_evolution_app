/*
 * @Date: 2021-01-27 17:19:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-16 18:11:01
 * @Description: 智能组合投资分析
 */
import React, {useState, useEffect, useRef} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px as text, deviceWidth, isIphoneX} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Html from '../../components/RenderHtml';
import {Chart} from '../../components/Chart';
import Dot from '../Portfolio/components/Dot';
import {baseAreaChart, dodgeColumn} from '../Portfolio/components/ChartOption';
import EmptyTip from '../../components/EmptyTip';
import {BottomModal} from '../../components/Modal';
import {throttle} from 'lodash';

const IntelligentInvestAnalysis = ({navigation, route}) => {
    const [period, setPeriod] = useState('y1');
    const [chartData, setChart] = useState({});
    const [chart_data, setChart_data] = useState([]);
    const textTime = useRef(null);
    const textThisFund = useRef(null);
    const textBenchmark = useRef(null);
    const [showEmpty, setShowEmpty] = useState(false);
    const [chartData2, setChart2] = useState({});
    const textTime2 = useRef(null);
    const textThisFund2 = useRef(null);
    const [showEmpty2, setShowEmpty2] = useState(false);
    const [tip, setTip] = useState({});
    const bottomModal = useRef(null);

    const init = () => {
        setChart_data([]);
        http.get('/profit/portfolio_nav/20210101', {period, poid: route.params?.poid}).then((res) => {
            setShowEmpty(true);
            if (res.code === '000000') {
                setChart(res.result);
                setChart_data(res.result.chart);
            }
        });
    };
    // 获取日收益背景颜色
    const getColor = (t) => {
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
    };
    // 净值走势图表滑动legend变化
    const onChartChange = ({items}) => {
        textTime.current.setNativeProps({text: items[0]?.title});
        textThisFund.current.setNativeProps({
            text: `${items[0]?.value}`,
            style: [styles.legendTitle, {color: getColor(`${items[0]?.value}`)}],
        });
        textBenchmark.current.setNativeProps({
            text: `${items[1]?.value}`,
            style: [styles.legendTitle, {color: getColor(`${items[1]?.value}`)}],
        });
    };
    // 净值走势图表滑动结束
    const onHide = () => {
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
    };
    // 月度收益率图表滑动legend变化
    const onChartChange2 = ({items}) => {
        textTime2.current.setNativeProps({text: items[0]?.title});
        textThisFund2.current.setNativeProps({
            text: `${items[0]?.value}`,
            style: [styles.legendTitle, {color: getColor(`${items[0]?.value}`)}],
        });
    };
    // 月度收益率图表滑动结束
    const onHide2 = () => {
        chartData2.label[0] && textTime2.current.setNativeProps({text: chartData2.label[0]?.val});
        chartData2.label[1] &&
            textThisFund2.current.setNativeProps({
                text: `${chartData2.label[1]?.val}`,
                style: [styles.legendTitle, {color: getColor(`${chartData2.label[1]?.val}`)}],
            });
    };
    const showTips = (tips) => {
        setTip(tips);
        bottomModal.current.show();
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);
    useEffect(() => {
        http.get('/profit/month_ratio/20210101', {poid: route.params?.poid}).then((res) => {
            setShowEmpty2(true);
            if (res.code === '000000') {
                setChart2(res.result);
            }
        });
    }, [route.params]);
    useEffect(() => {
        if (chartData.label) {
            onHide();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartData]);
    return (
        <ScrollView style={styles.container}>
            <View style={{minHeight: text(360)}}>
                {chartData.chart ? (
                    <View style={styles.netValueChart}>
                        <Text style={styles.bigTitle}>净值走势</Text>
                        <View style={[Style.flexRow, {paddingTop: text(20)}]}>
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
                                            {index === 1 ? (
                                                <Dot
                                                    bgColor={
                                                        index === 1
                                                            ? 'rgba(231, 73, 73, 0.15)'
                                                            : 'rgba(84, 89, 104, 0.15)'
                                                    }
                                                    color={index === 1 ? Colors.red : Colors.descColor}
                                                />
                                            ) : index === 2 ? (
                                                <Text
                                                    style={{
                                                        color: Colors.defaultColor,
                                                        fontSize: Font.textH3,
                                                        fontWeight: Platform.select({android: '700', ios: '600'}),
                                                    }}>
                                                    --
                                                </Text>
                                            ) : null}
                                            <TouchableOpacity
                                                style={Style.flexRow}
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    chartData?.tips && index === 2 && showTips(chartData.tips);
                                                }}>
                                                <Text
                                                    style={[
                                                        styles.legendDesc,
                                                        index !== 0 ? {marginLeft: text(4)} : {},
                                                    ]}>
                                                    {item.name}
                                                </Text>
                                                {chartData?.tips && index === 2 && (
                                                    <FastImage
                                                        style={{
                                                            width: text(12),
                                                            height: text(12),
                                                            marginLeft: text(4),
                                                        }}
                                                        source={require('../../assets/img/tip.png')}
                                                    />
                                                )}
                                            </TouchableOpacity>
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
                                        deviceWidth - text(16),
                                        [10, 24, 10, 4],
                                        chartData?.tag_position,
                                        220,
                                        chartData.max_ratio
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
                                {justifyContent: 'center', paddingTop: text(8), paddingBottom: Space.padding},
                            ]}>
                            {chartData?.sub_tabs?.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        key={item.val + index}
                                        onPress={throttle(() => {
                                            global.LogTool('click', item.val);
                                            setPeriod(item.val);
                                        }, 300)}
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
                        <View>
                            <View style={[Style.flexRow, {marginBottom: text(4)}]}>
                                <MaterialCommunityIcons name={'circle-medium'} color={Colors.green} size={18} />
                                <Text style={{fontSize: text(12), lineHeight: text(17)}}>
                                    {chartData?.remark?.title}{' '}
                                </Text>
                                <Text
                                    style={{
                                        color: Colors.green,
                                        fontSize: text(15),
                                        lineHeight: text(17),
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {chartData?.remark?.ratio}
                                </Text>
                            </View>
                            {chartData?.remark?.content && (
                                <Html
                                    html={chartData?.remark?.content}
                                    style={{
                                        fontSize: Font.textH3,
                                        lineHeight: text(18),
                                        color: Colors.darkGrayColor,
                                        textAlign: 'justify',
                                    }}
                                />
                            )}
                        </View>
                    </View>
                ) : null}
                {showEmpty &&
                    showEmpty2 &&
                    Object.keys(chartData).length === 0 &&
                    Object.keys(chartData2).length === 0 && (
                        <EmptyTip style={{paddingVertical: text(40)}} text={'暂无数据'} />
                    )}
            </View>
            <View style={[styles.monthRatio, {paddingBottom: isIphoneX() ? 34 + Space.padding : Space.padding}]}>
                <View style={{minHeight: text(220)}}>
                    {chartData2.chart ? (
                        <View style={styles.netValueChart}>
                            <Text style={styles.bigTitle}>月度收益率（近6个月）</Text>
                            <View style={[Style.flexRow, {paddingTop: text(20)}]}>
                                {chartData2?.label?.map((item, index) => {
                                    return (
                                        <View key={item.val + index} style={styles.legendItem}>
                                            <TextInput
                                                defaultValue={`${item.val}`}
                                                editable={false}
                                                ref={index === 0 ? textTime2 : textThisFund2}
                                                style={[
                                                    styles.legendTitle,
                                                    index !== 0 ? {color: getColor(`${item.val}`)} : {},
                                                ]}
                                            />
                                            {/* <View style={Style.flexRow}> */}
                                            {/* {index !== 0 && (
                                                    <Dot
                                                        bgColor={
                                                            index === 1
                                                                ? 'rgba(231, 73, 73, 0.15)'
                                                                : 'rgba(84, 89, 104, 0.15)'
                                                        }
                                                        color={index === 1 ? Colors.red : Colors.descColor}
                                                    />
                                                )} */}

                                            <Text style={[styles.legendDesc, index !== 0 ? {marginLeft: text(4)} : {}]}>
                                                {item.name}
                                            </Text>

                                            {/* </View> */}
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={{height: 240}}>
                                {chartData2.chart && (
                                    <Chart
                                        initScript={dodgeColumn(
                                            chartData2.chart,
                                            [Colors.red, Colors.green],
                                            deviceWidth,
                                            [10, 24, 10, 0],
                                            16,
                                            0,
                                            false,
                                            true,
                                            true
                                        )}
                                        data={chartData2.chart}
                                        onChange={onChartChange2}
                                        onHide={onHide2}
                                        style={{width: '100%'}}
                                    />
                                )}
                            </View>
                        </View>
                    ) : null}
                </View>
            </View>
            <BottomModal ref={bottomModal} title={tip?.title}>
                <View style={{padding: text(16)}}>
                    {tip?.content?.map((item, index) => {
                        return (
                            <View key={index}>
                                <Text style={styles.tipTitle}>{item.key}:</Text>
                                <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                    {item?.val}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </BottomModal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
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
        padding: Space.padding,
        backgroundColor: '#fff',
        // height: text(320),
    },
    bigTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
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
        position: 'relative',
        alignItems: 'center',
    },
    legendTitle: {
        fontSize: Font.textH1,
        lineHeight: text(20),
        width: text(120),
        textAlign: 'center',
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        padding: 0,
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
    tipTitle: {
        fontWeight: 'bold',
        lineHeight: text(20),
        fontSize: Font.textH2,
        marginBottom: text(4),
    },
    monthRatio: {
        marginTop: text(12),
    },
});

export default IntelligentInvestAnalysis;
