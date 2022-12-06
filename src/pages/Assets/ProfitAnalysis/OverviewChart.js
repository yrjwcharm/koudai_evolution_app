/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-23 15:28:14
 */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {Colors, Font, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import CircleLegend from '~/components/CircleLegend';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Chart} from '~/components/Chart';
import {baseAreaChart} from '~/pages/Portfolio/components/ChartOption';
import Empty from '~/components/EmptyTip';
import {getOverviewChartData} from './services';

export const OverviewChart = ({params = {}}) => {
    const [period, setPeriod] = useState(params.period);
    const [chartData, setChartData] = useState({});
    const {chart, label, max_amount, max_ratio, sub_tabs, tag_position} = chartData;
    const [loading, setLoading] = useState(true);
    const [showEmpty, setShowEmpty] = useState(false);
    const legendTitleArr = useRef([]);

    const getColor = (t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.toString().replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.toString().replace(/,/g, '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    };

    /** @name 图表滑动legend变化 */
    const onChartChange = ({items}) => {
        legendTitleArr.current?.forEach((item, index) => {
            const _props = {text: index === 0 ? items[0].title : `${items[index - 1].value}`};
            if (index > 0) {
                _props.style = [styles.legendTitle, {color: getColor(items[index - 1].value)}];
            }
            item?.setNativeProps(_props);
        });
    };

    /** @name 图表滑动结束 */
    const onHide = () => {
        label?.forEach((item, index) => {
            const {val} = item;
            const _props = {text: `${val}`};
            if (index > 0) {
                _props.style = [styles.legendTitle, {color: getColor(val)}];
            }
            legendTitleArr.current[index]?.setNativeProps(_props);
        });
    };

    const init = () => {
        getOverviewChartData({...params, period})
            .then((res) => {
                if (res.code === '000000') {
                    res.result?.chart?.forEach((item) => (item.type = 'a'));
                    setChartData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
                setShowEmpty(true);
            });
    };

    useEffect(() => {
        init();
    }, [period]);

    useEffect(() => {
        label && onHide();
    }, [label]);

    return chartData ? (
        <>
            {/* 根据key区分不同图表 */}
            {label?.length > 0 ? (
                <View style={[Style.flexRowCenter, {marginTop: px(8)}]}>
                    {label.map((item, index, arr) => {
                        const {color, index_list, key: indexKey, name, type, val} = item;
                        const n = index_list?.find?.((i) => i.key === indexKey)?.text || name;
                        return (
                            <View
                                key={name + index}
                                style={[
                                    Style.flexCenter,
                                    index === 1 ? {marginLeft: px(40), marginRight: arr.length === 3 ? px(40) : 0} : {},
                                ]}>
                                <TextInput
                                    defaultValue={`${val}`}
                                    editable={false}
                                    ref={(ref) => (legendTitleArr.current[index] = ref)}
                                    style={[styles.legendTitle, index > 0 ? {color: getColor(val)} : {}]}
                                />
                                <View style={[Style.flexRowCenter, {marginTop: px(4)}]}>
                                    {type ? (
                                        type === 'circle' ? (
                                            <CircleLegend color={color} />
                                        ) : type === 'line' ? (
                                            <View style={[styles.lineLegend, {backgroundColor: color}]} />
                                        ) : null
                                    ) : null}
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        disabled={!(index_list?.length > 0)}
                                        style={Style.flexRow}>
                                        <Text style={styles.smallText}>{n}</Text>
                                        {index_list?.length > 0 && (
                                            <AntDesign
                                                color={Colors.lightBlackColor}
                                                name="caretdown"
                                                size={px(6)}
                                                style={{marginLeft: px(2)}}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            ) : null}
            <View style={{height: px(200)}}>
                {loading ? null : chart?.length > 0 ? (
                    <Chart
                        initScript={baseAreaChart(
                            chart,
                            [Colors.red, Colors.lightBlackColor, 'transparent'],
                            ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                            false,
                            0,
                            deviceWidth - px(32),
                            [10, 20, 10, 18],
                            tag_position,
                            px(200),
                            max_ratio || max_amount
                        )}
                        onChange={onChartChange}
                        onHide={onHide}
                        style={{width: '100%'}}
                    />
                ) : (
                    showEmpty && (
                        <Empty
                            style={{paddingTop: px(40)}}
                            imageStyle={{width: px(150), resizeMode: 'contain'}}
                            type={'part'}
                        />
                    )
                )}
            </View>
            {sub_tabs?.length > 0 ? (
                <View style={[Style.flexRowCenter, {marginTop: px(8)}]}>
                    {sub_tabs.map((tab, i) => {
                        const {name, val} = tab;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={loading || period === val}
                                key={val + i}
                                onPress={() => {
                                    setLoading(true);
                                    setPeriod(val);
                                }}
                                style={[
                                    styles.subTabBox,
                                    {marginLeft: i === 0 ? px(6) : 0},
                                    period === val ? styles.activeTab : {},
                                ]}>
                                <Text
                                    style={[
                                        styles.smallText,
                                        {
                                            color: period === val ? Colors.brandColor : Colors.descColor,
                                            fontWeight: period === val ? Font.weightMedium : '400',
                                        },
                                    ]}>
                                    {name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ) : null}
        </>
    ) : null;
};

export default OverviewChart;

const styles = StyleSheet.create({
    legendTitle: {
        padding: 0,
        fontSize: px(13),
        lineHeight: px(19),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    tipsVal: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    lineLegend: {
        marginRight: px(4),
        width: px(8),
        height: px(2),
    },
    smallText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    subTabBox: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    activeTab: {
        backgroundColor: '#DEE8FF',
    },
});
