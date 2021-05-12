/*
 * @Date: 2021-01-27 17:19:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-28 11:15:40
 * @Description: 月度收益率
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Chart} from '../../components/Chart';
import {dodgeColumn} from '../Portfolio/components/ChartOption';
import EmptyTip from '../../components/EmptyTip';
import Dot from '../Portfolio/components/Dot';
import {BottomModal} from '../../components/Modal';

const NetValueTrend = ({poid}) => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [chartData, setChart] = useState({});
    const textTime = useRef(null);
    const textThisFund = useRef(null);
    const textBenchmark = useRef(null);
    const [showEmpty, setShowEmpty] = useState(false);
    const [tip, setTip] = useState({});
    const bottomModal = useRef(null);

    const init = useCallback(() => {
        http.get('/profit/month_ratio/20210101', {poid}).then((res) => {
            setShowEmpty(true);
            if (res.code === '000000') {
                setRefreshing(false);
                setChart(res.result);
            }
        });
    }, [poid]);
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
    const onHide = useCallback(() => {
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
    }, [chartData, getColor]);
    const showTips = (tips) => {
        setTip(tips);
        bottomModal.current.show();
    };

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
                    <View style={[styles.netValueChart, {marginBottom: insets.bottom}]}>
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
                                            {chartData?.tips && index === 2 && (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    style={{position: 'absolute', right: text(-16)}}
                                                    onPress={() => showTips(chartData.tips)}>
                                                    <FastImage
                                                        style={{width: text(16), height: text(16)}}
                                                        source={require('../../assets/img/tip.png')}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{height: 220}}>
                            {chartData.chart && (
                                <Chart
                                    initScript={dodgeColumn(chartData.chart, [Colors.red, Colors.lightBlackColor])}
                                    data={chartData.chart}
                                    onChange={onChartChange}
                                    onHide={onHide}
                                    style={{width: '100%'}}
                                />
                            )}
                        </View>
                    </View>
                </>
            ) : showEmpty ? (
                <EmptyTip style={{paddingVertical: text(40)}} text={'暂无数据'} />
            ) : null}
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
    tipTitle: {
        fontWeight: 'bold',
        lineHeight: text(20),
        fontSize: Font.textH2,
        marginBottom: text(4),
    },
});

NetValueTrend.propTypes = {
    poid: PropTypes.string.isRequired,
};

export default NetValueTrend;
