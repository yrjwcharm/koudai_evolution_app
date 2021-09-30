/*
 * @Author: xjh
 * @Date: 2021-03-17 17:35:25
 * @Description:详情页图表
 * @LastEditors: dx
 * @LastEditTime: 2021-09-29 16:51:39
 */
import React, {useCallback, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import {baseAreaChart} from './ChartOption';
import {px as text, px} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {Chart} from '../../../components/Chart';
import CircleLegend from '../../../components/CircleLegend';
import {BottomModal} from '../../../components/Modal';
export default function RenderChart(props) {
    const {
        chartData = {},
        chart = [],
        type,
        style,
        width,
        height,
        tootipScope = true,
        showFutureArea = true,
        lowLine = 0,
    } = props;
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const bottomModal = React.useRef(null);
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            _textTime.current?.setNativeProps({text: items[0]?.title});
            if (type == 2 && showFutureArea) {
                let range = items[0]?.origin?.value;
                let _value = '';
                if (range && range.length > 0) {
                    let scope = '';
                    if (tootipScope) {
                        scope = '~' + (range[1] * 100).toFixed(2) + '%';
                    }
                    _value = (range[0] * 100).toFixed(2) + '%' + scope;
                }
                _textPortfolio.current?.setNativeProps({
                    text: _value,
                    style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
                });
            } else {
                _textPortfolio.current?.setNativeProps({
                    text: items[0]?.value,
                    style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
                });
            }
            _textBenchmark.current?.setNativeProps({
                text: items[1]?.value,
                style: [
                    styles.legend_title_sty,
                    {color: lowLine === 1 ? Colors.defaultColor : getColor(items[1]?.value)},
                ],
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getColor, tootipScope, type]
    );
    // 图表滑动结束
    const onHide = useCallback(() => {
        const _data = chartData?.yield_info;
        _textTime.current?.setNativeProps({text: _data?.label && _data?.label[0].val});
        _textPortfolio.current?.setNativeProps({
            text: _data?.label && _data?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label && _data?.label[1].val)}],
        });

        _textBenchmark.current?.setNativeProps({
            text: _data?.label && _data?.label[2].val,
            style: [
                styles.legend_title_sty,
                {color: lowLine === 1 ? Colors.defaultColor : getColor(_data?.label && _data?.label[2].val)},
            ],
        });
    }, [chartData, getColor, lowLine]);
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
    useEffect(() => {
        if (chartData?.yield_info && chart?.length > 0) {
            onHide();
        }
    }, [chart, chartData, onHide]);
    return chartData ? (
        <View style={{height: 260, backgroundColor: '#fff', ...style}}>
            <View style={[Style.flexRow, {justifyContent: 'space-around'}]}>
                <View style={[styles.legend_sty]}>
                    {/* {lowLine === 1 && type !== 2 ? (
                        <Text style={styles.chartTitle}>{chartData?.yield_info?.title}</Text>
                    ) : (
                        <>
                        </>
                    )} */}
                    <TextInput
                        ref={_textTime}
                        style={[styles.legend_title_sty, {width: text(100)}]}
                        defaultValue={chartData?.yield_info?.label && chartData?.yield_info?.label[0]?.val}
                        editable={false}
                    />
                    <Text style={styles.legend_desc_sty}>
                        {chartData?.yield_info?.label && chartData?.yield_info?.label[0]?.key}
                    </Text>
                </View>
                {chartData?.yield_info?.label && chartData?.yield_info?.label[1] ? (
                    <View style={[styles.legend_sty]}>
                        <TextInput
                            style={[
                                styles.legend_title_sty,
                                {color: getColor(chartData?.yield_info?.label && chartData?.yield_info?.label[1]?.val)},
                            ]}
                            ref={_textPortfolio}
                            defaultValue={chartData?.yield_info?.label && chartData?.yield_info?.label[1]?.val}
                            editable={false}
                        />
                        <View style={[Style.flexRow, {alignItems: 'center'}]}>
                            <CircleLegend color={['#FFECEC', '#E74949']} />
                            <Text style={[styles.legend_desc_sty, {marginLeft: text(4)}]}>
                                {chartData?.yield_info?.label && chartData?.yield_info?.label[1]?.key}
                            </Text>
                        </View>
                    </View>
                ) : null}
                {chartData?.yield_info?.label && chartData?.yield_info?.label[2] ? (
                    <View style={[styles.legend_sty, lowLine === 1 && type !== 2 ? {minWidth: px(100)} : {}]}>
                        <TextInput
                            style={[
                                styles.legend_title_sty,
                                {
                                    color:
                                        lowLine === 1
                                            ? Colors.defaultColor
                                            : getColor(chartData?.yield_info?.label[2]?.val),
                                },
                            ]}
                            ref={_textBenchmark}
                            defaultValue={chartData?.yield_info?.label[2]?.val}
                            editable={false}
                        />
                        <View
                            style={[
                                Style.flexRow,
                                {alignItems: 'center', marginRight: chartData?.yield_info?.tips ? px(16) : 0},
                            ]}>
                            {lowLine === 1 && type !== 2 ? (
                                <Text style={{color: Colors.defaultColor, fontSize: Font.textH3}}>--</Text>
                            ) : (
                                <CircleLegend color={['#E8EAEF', '#545968']} />
                            )}
                            <Text style={[styles.legend_desc_sty, {marginLeft: text(4)}]}>
                                {chartData?.yield_info?.label[2]?.key}
                            </Text>
                            {chartData?.yield_info?.tips ? (
                                <TouchableOpacity
                                    style={{position: 'absolute', right: text(-16)}}
                                    onPress={() => bottomModal.current.show()}>
                                    <Image
                                        style={{width: text(12), height: text(12)}}
                                        source={require('../../../assets/img/tip.png')}
                                    />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                ) : null}
            </View>
            {chart?.length > 0 && (
                <Chart
                    initScript={baseAreaChart(
                        chart,
                        [Colors.red, Colors.lightBlackColor, 'transparent'],
                        ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                        true,
                        2,
                        width,
                        props.appendPadding || [10, 10, 10, 15],
                        null,
                        height,
                        chartData?.yield_info?.max_ratio,
                        type == 2 && !showFutureArea ? false : true
                    )}
                    onChange={onChartChange}
                    data={chart}
                    onHide={onHide}
                    style={{width: '100%'}}
                />
            )}
            {chartData?.yield_info?.tips ? (
                <BottomModal ref={bottomModal} title={chartData?.yield_info?.tips?.title}>
                    <View style={[{padding: text(16)}]}>
                        {chartData?.yield_info?.tips?.content?.map?.((item, index) => {
                            return (
                                <View key={item + index} style={{marginTop: index === 0 ? 0 : text(16)}}>
                                    <Text style={styles.tipTitle}>{item.key}:</Text>
                                    <Text style={{lineHeight: text(18), fontSize: text(13)}}>{item.val}</Text>
                                </View>
                            );
                        })}
                    </View>
                </BottomModal>
            ) : null}
        </View>
    ) : null;
}
const styles = StyleSheet.create({
    legend_sty: {
        // flex: 1,
        // justifyContent: 'space-between',
        alignItems: 'center',
    },
    legend_title_sty: {
        color: '#1F2432',
        fontSize: text(16),
        fontFamily: Font.numMedium,
        marginBottom: text(4),
        padding: 0, //处理textInput 在安卓上的兼容问题
        textAlign: 'center',
    },
    legend_desc_sty: {
        fontSize: text(11),
        color: Colors.descColor,
    },
    radio_sty: {
        color: '#9AA1B2',
        fontSize: text(12),
        textAlign: 'center',
        marginTop: text(4),
    },
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(8),
        paddingVertical: text(5),
        borderRadius: text(15),
    },
    age_text_sty: {
        color: '#6B9AE3',
        paddingHorizontal: text(3),
        fontSize: text(11),
        paddingVertical: text(2),
    },
    tipTitle: {fontWeight: 'bold', lineHeight: text(20), fontSize: text(14), marginBottom: text(4)},
    chartTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
        fontWeight: '600',
    },
});
