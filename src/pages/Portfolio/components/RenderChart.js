/*
 * @Author: xjh
 * @Date: 2021-03-17 17:35:25
 * @Description:详情页图表
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-29 19:38:06
 */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {baseAreaChart} from './ChartOption';
import {px, px as text} from '../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {Chart} from '../../../components/Chart';
import CircleLegend from '../../../components/CircleLegend';
export default function RenderChart(props) {
    const {chartData, chart, type, style} = props;
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            _textTime.current.setNativeProps({text: items[0]?.title});
            if (type == 2) {
                let range = items[0].origin.value;
                let _value = (range[0] * 100).toFixed(2) + '%' + '~' + (range[0] * 100).toFixed(2) + '%';
                _textPortfolio.current.setNativeProps({
                    text: _value,
                    style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
                });
            } else {
                _textPortfolio.current.setNativeProps({
                    text: items[0]?.value,
                    style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
                });
            }
            _textBenchmark.current.setNativeProps({
                text: items[1]?.value,
                style: [styles.legend_title_sty, {color: getColor(items[1]?.value)}],
            });
        },
        [getColor, type]
    );
    // 图表滑动结束
    const onHide = ({items}) => {
        const _data = chartData?.yield_info;
        _textTime.current.setNativeProps({text: _data?.label[0].val});
        _textPortfolio.current.setNativeProps({
            text: _data?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label[1].val)}],
        });

        _textBenchmark.current.setNativeProps({
            text: _data?.label[2].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label[2].val)}],
        });
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
    return (
        <View style={{height: 280, backgroundColor: '#fff', ...style}}>
            <View style={[Style.flexRow, {justifyContent: 'space-around'}]}>
                <View style={styles.legend_sty}>
                    <TextInput
                        ref={_textTime}
                        style={styles.legend_title_sty}
                        defaultValue={chartData?.yield_info?.label && chartData?.yield_info?.label[0]?.val}
                        editable={false}
                    />

                    <Text style={styles.legend_desc_sty}>
                        {chartData?.yield_info?.label && chartData?.yield_info?.label[0]?.key}
                    </Text>
                </View>
                <View style={styles.legend_sty}>
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
                        <Text style={styles.legend_desc_sty}>
                            {chartData?.yield_info?.label && chartData?.yield_info?.label[1]?.key}
                        </Text>
                    </View>
                </View>

                <View style={styles.legend_sty}>
                    <TextInput
                        style={[styles.legend_title_sty, {color: getColor(chartData?.yield_info?.label[2]?.val)}]}
                        ref={_textBenchmark}
                        defaultValue={chartData?.yield_info?.label[2]?.val}
                        editable={false}
                    />
                    <View style={[Style.flexRow, {alignItems: 'center'}]}>
                        <CircleLegend color={['#E8EAEF', '#545968']} />
                        <Text style={styles.legend_desc_sty}>{chartData?.yield_info?.label[2]?.key}</Text>
                    </View>
                </View>
            </View>
            <Chart
                initScript={baseAreaChart(
                    chart,
                    [Colors.red, Colors.lightBlackColor, 'transparent'],
                    ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                    true
                )}
                onChange={onChartChange}
                data={chart}
                onHide={onHide}
                style={{width: '100%'}}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    legend_sty: {
        // flex: 1,
        alignItems: 'center',
    },
    legend_title_sty: {
        color: '#1F2432',
        // fontWeight: 'bold',
        fontSize: text(16),
        fontFamily: Font.numFontFamily,
        marginBottom: text(4),
        padding: 0, //处理textInput 在安卓上的兼容问题
    },
    legend_desc_sty: {
        fontSize: text(11),
        color: '#545968',
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
});
