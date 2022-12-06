/*
 * @Date: 2022/12/2 15:15
 * @Author: yanruifeng
 * @Description:
 */
import {Colors, Font} from '../../../common/commonStyle';
import RNEChartsPro from 'react-native-echarts-pro';
import dayjs from 'dayjs';
import {deviceWidth, px} from '../../../utils/appUtil';
import React, {useRef} from 'react';

const Example = () => {
    const myChart = useRef();
    const barOption = {
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'shadow',
        //     },
        // },
        grid: {left: 0, right: 0, bottom: 0, containLabel: true},
        animation: true, //设置动画效果
        animationEasing: 'linear',
        dataZoom: [
            {
                type: 'inside',
                zoomLock: true, //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
                throttle: 100, //设置触发视图刷新的频率。单位为毫秒（ms）
            },
        ],
        xAxis: {
            nameLocation: 'end',
            show: false,
            inside: true, //刻度内置
            boundaryGap: true,
            type: 'category',
            axisTick: {
                show: false, // 不显示坐标轴刻度线
                alignWithLabel: true,
            },
            axisLabel: {
                // rotate: 70,
                boundaryGap: false,
                show: true, // 不显示坐标轴上的文字
                color: Colors.lightGrayColor,
                fontFamily: Font.numMedium,
                fontWeight: '500',
                fontSize: 9,
                align: 'left',
                margin: 8,
                showMaxLabel: true,
            },
            axisLine: {
                lineStyle: {
                    color: '#BDC2CC',
                    width: 0.5,
                },
            },
            data: ['2011-01-02', '2011-01-03'],
        },
        yAxis: {
            // scale: true,
            boundaryGap: false,
            type: 'value',
            // position: 'left',
            // min: minVal, // 坐标轴刻度最小值。
            // max: maxVal, // 坐标轴刻度最大值。
            splitNumber: 5, // 坐标轴的分割段数，是一个预估值，实际显示会根据数据稍作调整。
            // interval: interval, // 强制设置坐标轴分割间隔。
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
                // margin: 0,
            },
            splitLine: {
                lineStyle: {
                    color: '#E9EAEF',
                    width: 0.5,
                },
                show: true,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                length: 5,
            },
        },
        series: [
            {
                large: true,
                largeThreshold: 1000,
                type: 'bar',
                barWidth: 6,
                // barGap: '8%',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            //根据数值大小设置相关颜色
                            if (params.value > 0) {
                                return '#E74949';
                            } else {
                                return '#4BA471';
                            }
                        },
                    },
                },
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 8,
                    label: {
                        show: false,
                    },
                    itemStyle: {
                        normal: {
                            color: Colors.red,
                            borderColor: Colors.white,
                            borderWidth: 1, // 标注边线线宽，单位px，默认为1
                        },
                    },
                    data: [],
                },
                data: [200, 300],
            },
        ],
    };
    return (
        <RNEChartsPro
            onDataZoom={(result, option) => {
                const {startValue} = option.dataZoom[0];
            }}
            legendSelectChanged={(result) => {}}
            onPress={(result) => {}}
            ref={myChart}
            width={deviceWidth - px(58)}
            height={px(300)}
            onMousemove={() => {}}
            onFinished={() => {}}
            onRendered={() => {}}
            option={barOption}
        />
    );
};
export default Example;
