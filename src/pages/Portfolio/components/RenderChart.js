/*
 * @Author: xjh
 * @Date: 2021-03-17 17:35:25
 * @Description:详情页图表
 * @LastEditors: dx
 * @LastEditTime: 2021-04-16 17:29:05
 */
import React, {useCallback, useRef} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import {baseAreaChart} from './ChartOption';
import {px as text} from '../../../utils/appUtil';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {Chart} from '../../../components/Chart';
import CircleLegend from '../../../components/CircleLegend';
import {BottomModal} from '../../../components/Modal';
import Html from '../../../components/RenderHtml';
export default function RenderChart(props) {
    const {chartData, chart, type, style, width, height, tootipScope = true} = props;
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const bottomModal = React.useRef(null);
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            _textTime.current.setNativeProps({text: items[0]?.title});
            if (type == 2) {
                let range = items[0]?.origin?.value;
                let _value = '';
                if (range && range.length > 0) {
                    let scope = '';
                    if (tootipScope) {
                        scope = '~' + (range[1] * 100).toFixed(2) + '%';
                    }
                    _value = (range[0] * 100).toFixed(2) + '%' + scope;
                }
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
        [getColor, tootipScope, type]
    );
    // 图表滑动结束
    const onHide = ({items}) => {
        const _data = chartData?.yield_info;
        _textTime.current.setNativeProps({text: _data?.label && _data?.label[0].val});
        _textPortfolio.current.setNativeProps({
            text: _data?.label && _data?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label && _data?.label[1].val)}],
        });

        _textBenchmark.current.setNativeProps({
            text: _data?.label && _data?.label[2].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label && _data?.label[2].val)}],
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
        <View style={{height: 260, backgroundColor: '#fff', ...style}}>
            <View style={[Style.flexRow, {justifyContent: 'space-around', paddingLeft: 10}]}>
                <View style={styles.legend_sty}>
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
                        {chartData?.yield_info?.tips && (
                            <TouchableOpacity onPress={() => bottomModal.current.show()}>
                                <Image
                                    style={{width: text(16), height: text(16)}}
                                    source={require('../../../assets/img/tip.png')}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
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
                        props.appendPadding || 10,
                        null,
                        height,
                        chartData?.yield_info?.max_ratio
                    )}
                    onChange={onChartChange}
                    data={chart}
                    onHide={onHide}
                    style={{width: '100%'}}
                />
            )}
            <BottomModal ref={bottomModal} title={chartData?.yield_info?.tips?.title}>
                <View style={[{padding: text(16)}]}>
                    <Text style={styles.tipTitle}>{chartData?.yield_info?.tips?.content[0]?.key}:</Text>
                    <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                        {chartData?.yield_info?.tips?.content[0]?.val}
                    </Text>
                    <Text style={styles.tipTitle}>{chartData?.yield_info?.tips?.content[1]?.key}:</Text>
                    <Text style={{lineHeight: text(18), fontSize: text(13)}}>
                        {chartData?.yield_info?.tips?.content[1]?.val}
                    </Text>
                </View>
            </BottomModal>
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
        fontFamily: Font.numMedium,
        marginBottom: text(4),
        padding: 0, //处理textInput 在安卓上的兼容问题
        // width: text(90),
        textAlign: 'center',
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
    tipTitle: {fontWeight: 'bold', lineHeight: text(20), fontSize: text(14), marginBottom: text(4)},
});
