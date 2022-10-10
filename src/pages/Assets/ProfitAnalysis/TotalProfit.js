/*
 * @Date: 2022/9/30 13:28
 * @Author: yanruifeng
 * @Description:
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, TextInput, TouchableOpacity, StyleSheet, View} from 'react-native';
import {getChartData} from './service';
import {useRoute} from '@react-navigation/native';
import RootSibling from 'react-native-root-siblings';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceWidth, isIphoneX, px} from '../../../utils/appUtil';
import {Chart} from '../../../components/Chart';
import {baseAreaChart} from '../../Portfolio/components/ChartOption';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Empty from '~/components/EmptyTip';
import CircleLegend from '../../../components/CircleLegend';
import RenderList from './components/RenderList';
import dayjs from 'dayjs';
const TotalProfit = (props) => {
    const [data, setData] = useState([]);
    const [selCurYear, setSelCurYear] = useState(dayjs().year());
    const [mockData] = useState([
        {
            date: '2022-08-07',
            profit: '+20.94',
        },
        {
            date: '2022-08-12',
            profit: '-245.08',
        },
        {
            date: '2022-08-23',
            profit: '+3,420',
        },
        {
            date: '2022-08-01',
            profit: '+20.94',
        },
        {
            date: '2022-09-08',
            profit: '-245.08',
        },
        {
            date: '2022-09-11',
            profit: '+3,420',
        },
        {
            date: '2022-09-12',
            profit: '+57,420',
        },
        {
            date: '2022-09-14',
            profit: '+420.94',
        },
        {
            date: '2022-09-18',
            profit: '+8.94',
        },
        {
            date: '2022-09-19',
            profit: '-2,245',
        },
        {
            date: '2022-09-20',
            profit: '-75.23',
        },
        {
            date: '2022-10-01',
            profit: '+75.23',
        },
        {
            date: '2022-10-02',
            profit: '-25.23',
        },
        // {
        //     date: '2022-10-08',
        //     profit: '-25.23',
        // },
    ]);
    const [profitData] = useState([
        {
            type: 1,
            title: '黑天鹅FOF1号',
            profit: '82,325.59',
        },
        {
            type: 2,
            title: '智能｜全天候组合等级6',
            profit: '+7,632.04',
        },
        {
            type: 3,
            title: '低估值定投计划',
            profit: '-1,552.27',
        },
        {
            type: 4,
            title: '平安策略先锋混合',
            profit: '-62.54',
        },
    ]);
    const [tab] = useState([
        {
            key: 'acc_profit',
            title: '累计收益',
            period: 'y1',
            params: {
                poid: 'X00F000003',
            },
        },
    ]);
    const sortRenderList = useCallback(() => {}, []);
    /** @name 渲染图表 */
    const RenderChart = ({data = {}}) => {
        const route = useRoute();
        const {key, params, period: initPeriod} = data;
        const [period, setPeriod] = useState(initPeriod);
        const [chartData, setChartData] = useState({});
        const {chart, label, max_amount, max_ratio, sub_tabs, tag_position} = chartData;
        const [loading, setLoading] = useState(true);
        const [showEmpty, setShowEmpty] = useState(false);
        const legendTitleArr = useRef([]);
        const rootRef = useRef();
        const currentIndex = useRef('');
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

        /** @name 渲染指数下拉选择框 */
        const showChooseIndex = (e, index_list, indexKey) => {
            // console.log(e.nativeEvent);
            const {locationX, locationY, pageX, pageY} = e.nativeEvent;
            rootRef.current = new RootSibling(
                (
                    <>
                        <View onTouchStart={() => rootRef.current.destroy()} style={styles.rootMask} />
                        <View
                            style={[
                                styles.keyChooseCon,
                                {
                                    top: pageY - locationY + px(16),
                                    left: pageX - locationX - px(8),
                                },
                            ]}>
                            {index_list?.map?.((_index, i) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        key={_index.key + i}
                                        onPress={() => {
                                            rootRef.current.destroy();
                                            setLoading(true);
                                            currentIndex.current = _index.key;
                                            init();
                                        }}
                                        style={[
                                            styles.indexBox,
                                            {
                                                borderTopWidth: i === 0 ? 0 : Space.borderWidth,
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.smallText,
                                                _index.key === indexKey
                                                    ? {
                                                          color: Colors.brandColor,
                                                          fontWeight: Font.weightMedium,
                                                      }
                                                    : {},
                                            ]}>
                                            {_index.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )
            );
        };

        const init = async () => {
            //模拟mock数据
            let res = {
                code: '000000',
                message: 'success',
                result: {
                    chart: [
                        {date: '2021-10-10', type: '累计收益', value: 0, tag: 0},
                        {date: '2021-10-11', type: '累计收益', value: -13.78, tag: 0},
                        {date: '2021-10-12', type: '累计收益', value: -80.95, tag: 0},
                        {date: '2021-10-13', type: '累计收益', value: -28.75, tag: 0},
                        {date: '2021-10-14', type: '累计收益', value: -4.91, tag: 0},
                        {date: '2021-10-15', type: '累计收益', value: 30.72, tag: 0},
                        {date: '2021-10-16', type: '累计收益', value: 30.72, tag: 0},
                        {date: '2021-10-17', type: '累计收益', value: 30.72, tag: 0},
                        {date: '2021-10-18', type: '累计收益', value: 41.28, tag: 0},
                        {date: '2021-10-19', type: '累计收益', value: 80.14, tag: 0},
                        {date: '2021-10-20', type: '累计收益', value: 87.19, tag: 0},
                        {date: '2021-10-21', type: '累计收益', value: 71.68, tag: 0},
                        {date: '2021-10-22', type: '累计收益', value: 81.51, tag: 0},
                        {date: '2021-10-23', type: '累计收益', value: 81.51, tag: 0},
                        {date: '2021-10-24', type: '累计收益', value: 81.51, tag: 0},
                        {date: '2021-10-25', type: '累计收益', value: 116.83, tag: 0},
                        {date: '2021-10-26', type: '累计收益', value: 111.39, tag: 0},
                        {date: '2021-10-27', type: '累计收益', value: 85.48, tag: 0},
                        {date: '2021-10-28', type: '累计收益', value: 68.11, tag: 0},
                        {date: '2021-10-29', type: '累计收益', value: 108.02, tag: 0},
                        {date: '2021-10-30', type: '累计收益', value: 108.02, tag: 0},
                        {date: '2021-10-31', type: '累计收益', value: 108.02, tag: 0},
                        {date: '2021-11-01', type: '累计收益', value: 128.17, tag: 0},
                        {date: '2021-11-02', type: '累计收益', value: -2496.76, tag: 0},
                        {date: '2021-11-03', type: '累计收益', value: -4887.32, tag: 0},
                        {date: '2021-11-04', type: '累计收益', value: -2134.82, tag: 0},
                        {date: '2021-11-05', type: '累计收益', value: -3922.36, tag: 0},
                        {date: '2021-11-06', type: '累计收益', value: -3922.36, tag: 0},
                        {date: '2021-11-07', type: '累计收益', value: -3921.42, tag: 0},
                        {date: '2021-11-08', type: '累计收益', value: -2154.53, tag: 0},
                        {date: '2021-11-09', type: '累计收益', value: -1558.81, tag: 0},
                        {date: '2021-11-10', type: '累计收益', value: -2777.82, tag: 0},
                        {date: '2021-11-11', type: '累计收益', value: -2156.5, tag: 0},
                        {date: '2021-11-12', type: '累计收益', value: -1841.47, tag: 0},
                        {date: '2021-11-13', type: '累计收益', value: -1841.47, tag: 0},
                        {date: '2021-11-14', type: '累计收益', value: -1840.52, tag: 0},
                        {date: '2021-11-15', type: '累计收益', value: -3397.81, tag: 0},
                        {date: '2021-11-16', type: '累计收益', value: -4118.55, tag: 0},
                        {date: '2021-11-17', type: '累计收益', value: -2391.16, tag: 0},
                        {date: '2021-11-18', type: '累计收益', value: -2965.07, tag: 0},
                        {date: '2021-11-19', type: '累计收益', value: -1046.98, tag: 0},
                        {date: '2021-11-20', type: '累计收益', value: -1046.98, tag: 0},
                        {date: '2021-11-21', type: '累计收益', value: -1046.02, tag: 0},
                        {date: '2021-11-22', type: '累计收益', value: 1811.87, tag: 0},
                        {date: '2021-11-23', type: '累计收益', value: 774.11, tag: 0},
                        {date: '2021-11-24', type: '累计收益', value: 221.82, tag: 0},
                        {date: '2021-11-25', type: '累计收益', value: -1044.76, tag: 0},
                        {date: '2021-11-26', type: '累计收益', value: -1169.61, tag: 0},
                        {date: '2021-11-27', type: '累计收益', value: -1169.61, tag: 0},
                        {date: '2021-11-28', type: '累计收益', value: -1168.67, tag: 0},
                        {date: '2021-11-29', type: '累计收益', value: 4.19, tag: 0},
                        {date: '2021-11-30', type: '累计收益', value: -169.83, tag: 0},
                        {date: '2021-12-01', type: '累计收益', value: -1086.99, tag: 0},
                        {date: '2021-12-02', type: '累计收益', value: -1750.24, tag: 0},
                        {date: '2021-12-03', type: '累计收益', value: -935.56, tag: 0},
                        {date: '2021-12-04', type: '累计收益', value: -935.56, tag: 0},
                        {date: '2021-12-05', type: '累计收益', value: -935.56, tag: 0},
                        {date: '2021-12-06', type: '累计收益', value: -2243.48, tag: 0},
                        {date: '2021-12-07', type: '累计收益', value: -2854.69, tag: 0},
                        {date: '2021-12-08', type: '累计收益', value: 284.35, tag: 0},
                        {date: '2021-12-09', type: '累计收益', value: 1254.7, tag: 0},
                        {date: '2021-12-10', type: '累计收益', value: 2153.85, tag: 0},
                        {date: '2021-12-11', type: '累计收益', value: 2153.85, tag: 0},
                        {date: '2021-12-12', type: '累计收益', value: 2153.85, tag: 0},
                        {date: '2021-12-13', type: '累计收益', value: 3142.82, tag: 0},
                        {date: '2021-12-14', type: '累计收益', value: 3125.29, tag: 0},
                        {date: '2021-12-15', type: '累计收益', value: 3102.47, tag: 0},
                        {date: '2021-12-16', type: '累计收益', value: 3111.22, tag: 0},
                        {date: '2021-12-17', type: '累计收益', value: 3046.5, tag: 0},
                        {date: '2021-12-18', type: '累计收益', value: 3046.5, tag: 0},
                        {date: '2021-12-19', type: '累计收益', value: 3046.5, tag: 0},
                        {date: '2021-12-20', type: '累计收益', value: 2962.88, tag: 0},
                        {date: '2021-12-21', type: '累计收益', value: 3009.43, tag: 0},
                        {date: '2021-12-22', type: '累计收益', value: 3049.52, tag: 0},
                        {date: '2021-12-23', type: '累计收益', value: 3078.49, tag: 0},
                        {date: '2021-12-24', type: '累计收益', value: 3050, tag: 0},
                        {date: '2021-12-25', type: '累计收益', value: 3050, tag: 0},
                        {date: '2021-12-26', type: '累计收益', value: 3050, tag: 0},
                        {date: '2021-12-27', type: '累计收益', value: 3051.88, tag: 0},
                        {date: '2021-12-28', type: '累计收益', value: 3069.3, tag: 0},
                        {date: '2021-12-29', type: '累计收益', value: 3039.45, tag: 0},
                        {date: '2021-12-30', type: '累计收益', value: 3081.8, tag: 0},
                        {date: '2021-12-31', type: '累计收益', value: 3104.88, tag: 0},
                        {date: '2022-01-01', type: '累计收益', value: 3104.88, tag: 0},
                        {date: '2022-01-02', type: '累计收益', value: 3104.88, tag: 0},
                        {date: '2022-01-03', type: '累计收益', value: 3104.88, tag: 0},
                        {date: '2022-01-04', type: '累计收益', value: 3060.99, tag: 0},
                        {date: '2022-01-05', type: '累计收益', value: 2948.34, tag: 0},
                        {date: '2022-01-06', type: '累计收益', value: 2928.17, tag: 0},
                        {date: '2022-01-07', type: '累计收益', value: 2874.76, tag: 0},
                        {date: '2022-01-08', type: '累计收益', value: 2874.76, tag: 0},
                        {date: '2022-01-09', type: '累计收益', value: 2874.76, tag: 0},
                        {date: '2022-01-10', type: '累计收益', value: 2889.3, tag: 0},
                        {date: '2022-01-11', type: '累计收益', value: 2851.64, tag: 0},
                        {date: '2022-01-12', type: '累计收益', value: 2919.17, tag: 0},
                        {date: '2022-01-13', type: '累计收益', value: 2846.34, tag: 0},
                        {date: '2022-01-14', type: '累计收益', value: 2864.18, tag: 0},
                        {date: '2022-01-15', type: '累计收益', value: 2864.18, tag: 0},
                        {date: '2022-01-16', type: '累计收益', value: 2864.18, tag: 0},
                        {date: '2022-01-17', type: '累计收益', value: 2914.39, tag: 0},
                        {date: '2022-01-18', type: '累计收益', value: 2893.52, tag: 0},
                        {date: '2022-01-19', type: '累计收益', value: 2842.67, tag: 0},
                        {date: '2022-01-20', type: '累计收益', value: 2817.81, tag: 0},
                        {date: '2022-01-21', type: '累计收益', value: 2759.53, tag: 0},
                        {date: '2022-01-22', type: '累计收益', value: 2759.53, tag: 0},
                        {date: '2022-01-23', type: '累计收益', value: 2759.53, tag: 0},
                        {date: '2022-01-24', type: '累计收益', value: 2761.68, tag: 0},
                        {date: '2022-01-25', type: '累计收益', value: 2664.87, tag: 0},
                        {date: '2022-01-26', type: '累计收益', value: 2676.63, tag: 0},
                        {date: '2022-01-27', type: '累计收益', value: 2592.11, tag: 0},
                        {date: '2022-01-28', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-01-29', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-01-30', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-01-31', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-02-01', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-02-02', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-02-03', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-02-04', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-02-05', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-02-06', type: '累计收益', value: 2588.71, tag: 0},
                        {date: '2022-02-07', type: '累计收益', value: 2633.23, tag: 0},
                        {date: '2022-02-08', type: '累计收益', value: 2582.67, tag: 0},
                        {date: '2022-02-09', type: '累计收益', value: 2658.46, tag: 0},
                        {date: '2022-02-10', type: '累计收益', value: 2624.8, tag: 0},
                        {date: '2022-02-11', type: '累计收益', value: 2552.4, tag: 0},
                        {date: '2022-02-12', type: '累计收益', value: 2552.4, tag: 0},
                        {date: '2022-02-13', type: '累计收益', value: 2552.4, tag: 0},
                        {date: '2022-02-14', type: '累计收益', value: 2517.87, tag: 0},
                        {date: '2022-02-15', type: '累计收益', value: 2596.24, tag: 0},
                        {date: '2022-02-16', type: '累计收益', value: 2602.94, tag: 0},
                        {date: '2022-02-17', type: '累计收益', value: 2609.87, tag: 0},
                        {date: '2022-02-18', type: '累计收益', value: 2589.62, tag: 0},
                        {date: '2022-02-19', type: '累计收益', value: 2589.62, tag: 0},
                        {date: '2022-02-20', type: '累计收益', value: 2589.62, tag: 0},
                        {date: '2022-02-21', type: '累计收益', value: 2573.15, tag: 0},
                        {date: '2022-02-22', type: '累计收益', value: 2521.4, tag: 0},
                        {date: '2022-02-23', type: '累计收益', value: 2569.42, tag: 0},
                        {date: '2022-02-24', type: '累计收益', value: 2517.81, tag: 0},
                        {date: '2022-02-25', type: '累计收益', value: 2569.61, tag: 0},
                        {date: '2022-02-26', type: '累计收益', value: 2569.61, tag: 0},
                        {date: '2022-02-27', type: '累计收益', value: 2569.61, tag: 0},
                        {date: '2022-02-28', type: '累计收益', value: 2591.76, tag: 0},
                        {date: '2022-03-01', type: '累计收益', value: 2598.45, tag: 0},
                        {date: '2022-03-02', type: '累计收益', value: 2563.19, tag: 0},
                        {date: '2022-03-03', type: '累计收益', value: 2503.59, tag: 0},
                        {date: '2022-03-04', type: '累计收益', value: 2444.93, tag: 0},
                        {date: '2022-03-05', type: '累计收益', value: 2444.93, tag: 0},
                        {date: '2022-03-06', type: '累计收益', value: 2444.93, tag: 0},
                        {date: '2022-03-07', type: '累计收益', value: 2326.84, tag: 0},
                        {date: '2022-03-08', type: '累计收益', value: 2244.04, tag: 0},
                        {date: '2022-03-09', type: '累计收益', value: 2246.08, tag: 0},
                        {date: '2022-03-10', type: '累计收益', value: 2294.4, tag: 0},
                        {date: '2022-03-11', type: '累计收益', value: 2267.04, tag: 0},
                        {date: '2022-03-12', type: '累计收益', value: 2267.04, tag: 0},
                        {date: '2022-03-13', type: '累计收益', value: 2267.04, tag: 0},
                        {date: '2022-03-14', type: '累计收益', value: 2074.39, tag: 0},
                        {date: '2022-03-15', type: '累计收益', value: 1920.11, tag: 0},
                        {date: '2022-03-16', type: '累计收益', value: 2182.33, tag: 0},
                        {date: '2022-03-17', type: '累计收益', value: 2288.14, tag: 0},
                        {date: '2022-03-18', type: '累计收益', value: 2300.4, tag: 0},
                        {date: '2022-03-19', type: '累计收益', value: 2300.4, tag: 0},
                        {date: '2022-03-20', type: '累计收益', value: 2300.4, tag: 0},
                        {date: '2022-03-21', type: '累计收益', value: 2304.68, tag: 0},
                        {date: '2022-03-22', type: '累计收益', value: 2308.82, tag: 0},
                        {date: '2022-03-23', type: '累计收益', value: 2327.04, tag: 0},
                        {date: '2022-03-24', type: '累计收益', value: 2316, tag: 0},
                        {date: '2022-03-25', type: '累计收益', value: 2210.67, tag: 0},
                        {date: '2022-03-26', type: '累计收益', value: 2210.67, tag: 0},
                        {date: '2022-03-27', type: '累计收益', value: 2210.67, tag: 0},
                        {date: '2022-03-28', type: '累计收益', value: 2175.91, tag: 0},
                        {date: '2022-03-29', type: '累计收益', value: 2176.58, tag: 0},
                        {date: '2022-03-30', type: '累计收益', value: 2245.42, tag: 0},
                        {date: '2022-03-31', type: '累计收益', value: 2139.95, tag: 0},
                        {date: '2022-04-01', type: '累计收益', value: 2179.9, tag: 0},
                        {date: '2022-04-02', type: '累计收益', value: 2179.9, tag: 0},
                        {date: '2022-04-03', type: '累计收益', value: 2179.9, tag: 0},
                        {date: '2022-04-04', type: '累计收益', value: 2179.9, tag: 0},
                        {date: '2022-04-05', type: '累计收益', value: 2179.9, tag: 0},
                        {date: '2022-04-06', type: '累计收益', value: 2098.4, tag: 0},
                        {date: '2022-04-07', type: '累计收益', value: 2018.26, tag: 0},
                        {date: '2022-04-08', type: '累计收益', value: 2007.39, tag: 0},
                        {date: '2022-04-09', type: '累计收益', value: 2007.39, tag: 0},
                        {date: '2022-04-10', type: '累计收益', value: 2007.39, tag: 0},
                        {date: '2022-04-11', type: '累计收益', value: 1730.16, tag: 0},
                        {date: '2022-04-12', type: '累计收益', value: 1825.33, tag: 0},
                        {date: '2022-04-13', type: '累计收益', value: 1785.07, tag: 0},
                        {date: '2022-04-14', type: '累计收益', value: 1813.13, tag: 0},
                        {date: '2022-04-15', type: '累计收益', value: 1812.77, tag: 0},
                        {date: '2022-04-16', type: '累计收益', value: 1812.77, tag: 0},
                        {date: '2022-04-17', type: '累计收益', value: 1812.77, tag: 0},
                        {date: '2022-04-18', type: '累计收益', value: 1873.98, tag: 0},
                        {date: '2022-04-19', type: '累计收益', value: 1826.29, tag: 0},
                        {date: '2022-04-20', type: '累计收益', value: 1690.69, tag: 0},
                        {date: '2022-04-21', type: '累计收益', value: 1506.77, tag: 0},
                        {date: '2022-04-22', type: '累计收益', value: 1488.35, tag: 0},
                        {date: '2022-04-23', type: '累计收益', value: 1488.35, tag: 0},
                        {date: '2022-04-24', type: '累计收益', value: 1488.35, tag: 0},
                        {date: '2022-04-25', type: '累计收益', value: 1188.81, tag: 0},
                        {date: '2022-04-26', type: '累计收益', value: 1130.48, tag: 0},
                        {date: '2022-04-27', type: '累计收益', value: 1388.22, tag: 0},
                        {date: '2022-04-28', type: '累计收益', value: 1494.81, tag: 0},
                        {date: '2022-04-29', type: '累计收益', value: 1691.06, tag: 0},
                        {date: '2022-04-30', type: '累计收益', value: 1691.06, tag: 0},
                        {date: '2022-05-01', type: '累计收益', value: 1691.06, tag: 0},
                        {date: '2022-05-02', type: '累计收益', value: 1691.06, tag: 0},
                        {date: '2022-05-03', type: '累计收益', value: 1691.06, tag: 0},
                        {date: '2022-05-04', type: '累计收益', value: 1691.06, tag: 0},
                        {date: '2022-05-05', type: '累计收益', value: 1643.48, tag: 0},
                        {date: '2022-05-06', type: '累计收益', value: 1491.55, tag: 0},
                        {date: '2022-05-07', type: '累计收益', value: 1491.55, tag: 0},
                        {date: '2022-05-08', type: '累计收益', value: 1491.55, tag: 0},
                        {date: '2022-05-09', type: '累计收益', value: 1445.39, tag: 0},
                        {date: '2022-05-10', type: '累计收益', value: 1535.33, tag: 0},
                        {date: '2022-05-11', type: '累计收益', value: 1643.02, tag: 0},
                        {date: '2022-05-12', type: '累计收益', value: 1599.43, tag: 0},
                        {date: '2022-05-13', type: '累计收益', value: 1714.02, tag: 0},
                        {date: '2022-05-14', type: '累计收益', value: 1714.02, tag: 0},
                        {date: '2022-05-15', type: '累计收益', value: 1714.02, tag: 0},
                        {date: '2022-05-16', type: '累计收益', value: 1658.22, tag: 0},
                        {date: '2022-05-17', type: '累计收益', value: 1834.94, tag: 0},
                        {date: '2022-05-18', type: '累计收益', value: 1773.53, tag: 0},
                        {date: '2022-05-19', type: '累计收益', value: 1828.47, tag: 0},
                        {date: '2022-05-20', type: '累计收益', value: 1921.91, tag: 0},
                        {date: '2022-05-21', type: '累计收益', value: 1921.91, tag: 0},
                        {date: '2022-05-22', type: '累计收益', value: 1921.91, tag: 0},
                        {date: '2022-05-23', type: '累计收益', value: 1887.14, tag: 0},
                        {date: '2022-05-24', type: '累计收益', value: 1671.08, tag: 0},
                        {date: '2022-05-25', type: '累计收益', value: 1724.88, tag: 0},
                        {date: '2022-05-26', type: '累计收益', value: 1780.16, tag: 0},
                        {date: '2022-05-27', type: '累计收益', value: 1857.28, tag: 0},
                        {date: '2022-05-28', type: '累计收益', value: 1857.28, tag: 0},
                        {date: '2022-05-29', type: '累计收益', value: 1857.28, tag: 0},
                        {date: '2022-05-30', type: '累计收益', value: 1938.27, tag: 0},
                        {date: '2022-05-31', type: '累计收益', value: 2047.13, tag: 0},
                        {date: '2022-06-01', type: '累计收益', value: 2029.12, tag: 0},
                        {date: '2022-06-02', type: '累计收益', value: 2154.39, tag: 0},
                        {date: '2022-06-03', type: '累计收益', value: 2154.39, tag: 0},
                        {date: '2022-06-04', type: '累计收益', value: 2154.39, tag: 0},
                        {date: '2022-06-05', type: '累计收益', value: 2154.39, tag: 0},
                        {date: '2022-06-06', type: '累计收益', value: 2340.65, tag: 0},
                        {date: '2022-06-07', type: '累计收益', value: 2353, tag: 0},
                        {date: '2022-06-08', type: '累计收益', value: 2427.86, tag: 0},
                        {date: '2022-06-09', type: '累计收益', value: 2297.31, tag: 0},
                        {date: '2022-06-10', type: '累计收益', value: 2411.82, tag: 0},
                        {date: '2022-06-11', type: '累计收益', value: 2411.82, tag: 0},
                        {date: '2022-06-12', type: '累计收益', value: 2411.82, tag: 0},
                        {date: '2022-06-13', type: '累计收益', value: 2325.94, tag: 0},
                        {date: '2022-06-14', type: '累计收益', value: 2322.9, tag: 0},
                        {date: '2022-06-15', type: '累计收益', value: 2332.47, tag: 0},
                        {date: '2022-06-16', type: '累计收益', value: 2285.01, tag: 0},
                        {date: '2022-06-17', type: '累计收益', value: 2428.11, tag: 0},
                        {date: '2022-06-18', type: '累计收益', value: 2428.11, tag: 0},
                        {date: '2022-06-19', type: '累计收益', value: 2428.11, tag: 0},
                        {date: '2022-06-20', type: '累计收益', value: 2506.31, tag: 0},
                        {date: '2022-06-21', type: '累计收益', value: 2504.76, tag: 0},
                        {date: '2022-06-22', type: '累计收益', value: 2461.84, tag: 0},
                        {date: '2022-06-23', type: '累计收益', value: 2642.08, tag: 0},
                        {date: '2022-06-24', type: '累计收益', value: 2809.94, tag: 0},
                        {date: '2022-06-25', type: '累计收益', value: 2809.94, tag: 0},
                        {date: '2022-06-26', type: '累计收益', value: 2809.94, tag: 0},
                        {date: '2022-06-27', type: '累计收益', value: 2874.56, tag: 0},
                        {date: '2022-06-28', type: '累计收益', value: 2907.44, tag: 0},
                        {date: '2022-06-29', type: '累计收益', value: 2695.77, tag: 0},
                        {date: '2022-06-30', type: '累计收益', value: 2795.34, tag: 0},
                        {date: '2022-07-01', type: '累计收益', value: 2749.08, tag: 0},
                        {date: '2022-07-02', type: '累计收益', value: 2749.08, tag: 0},
                        {date: '2022-07-03', type: '累计收益', value: 2749.08, tag: 0},
                        {date: '2022-07-04', type: '累计收益', value: 2832.2, tag: 0},
                        {date: '2022-07-05', type: '累计收益', value: 2842.64, tag: 0},
                        {date: '2022-07-06', type: '累计收益', value: 2793.25, tag: 0},
                        {date: '2022-07-07', type: '累计收益', value: 2921.81, tag: 0},
                        {date: '2022-07-08', type: '累计收益', value: 2828.73, tag: 0},
                        {date: '2022-07-09', type: '累计收益', value: 2828.73, tag: 0},
                        {date: '2022-07-10', type: '累计收益', value: 2828.73, tag: 0},
                        {date: '2022-07-11', type: '累计收益', value: 2653.75, tag: 0},
                        {date: '2022-07-12', type: '累计收益', value: 2525.59, tag: 0},
                        {date: '2022-07-13', type: '累计收益', value: 2543.44, tag: 0},
                        {date: '2022-07-14', type: '累计收益', value: 2662.98, tag: 0},
                        {date: '2022-07-15', type: '累计收益', value: 2626.26, tag: 0},
                        {date: '2022-07-16', type: '累计收益', value: 2626.26, tag: 0},
                        {date: '2022-07-17', type: '累计收益', value: 2626.26, tag: 0},
                        {date: '2022-07-18', type: '累计收益', value: 2678.75, tag: 0},
                        {date: '2022-07-19', type: '累计收益', value: 2645.37, tag: 0},
                        {date: '2022-07-20', type: '累计收益', value: 2720.25, tag: 0},
                        {date: '2022-07-21', type: '累计收益', value: 2656.4, tag: 0},
                        {date: '2022-07-22', type: '累计收益', value: 2623.86, tag: 0},
                        {date: '2022-07-23', type: '累计收益', value: 2623.86, tag: 0},
                        {date: '2022-07-24', type: '累计收益', value: 2623.86, tag: 0},
                        {date: '2022-07-25', type: '累计收益', value: 2533.83, tag: 0},
                        {date: '2022-07-26', type: '累计收益', value: 2591.2, tag: 0},
                        {date: '2022-07-27', type: '累计收益', value: 2669.32, tag: 0},
                        {date: '2022-07-28', type: '累计收益', value: 2632.03, tag: 0},
                        {date: '2022-07-29', type: '累计收益', value: 2582.31, tag: 0},
                        {date: '2022-07-30', type: '累计收益', value: 2582.31, tag: 0},
                        {date: '2022-07-31', type: '累计收益', value: 2582.31, tag: 0},
                        {date: '2022-08-01', type: '累计收益', value: 2657.09, tag: 0},
                        {date: '2022-08-02', type: '累计收益', value: 2522.94, tag: 0},
                        {date: '2022-08-03', type: '累计收益', value: 2478.82, tag: 0},
                        {date: '2022-08-04', type: '累计收益', value: 2529.04, tag: 0},
                        {date: '2022-08-05', type: '累计收益', value: 2574.36, tag: 0},
                        {date: '2022-08-06', type: '累计收益', value: 2574.36, tag: 0},
                        {date: '2022-08-07', type: '累计收益', value: 2574.36, tag: 0},
                        {date: '2022-08-08', type: '累计收益', value: 2611.16, tag: 0},
                        {date: '2022-08-09', type: '累计收益', value: 2650.1, tag: 0},
                        {date: '2022-08-10', type: '累计收益', value: 2615.49, tag: 0},
                        {date: '2022-08-11', type: '累计收益', value: 2703.2, tag: 0},
                        {date: '2022-08-12', type: '累计收益', value: 2681.34, tag: 0},
                        {date: '2022-08-13', type: '累计收益', value: 2681.34, tag: 0},
                        {date: '2022-08-14', type: '累计收益', value: 2681.34, tag: 0},
                        {date: '2022-08-15', type: '累计收益', value: 2778.92, tag: 0},
                        {date: '2022-08-16', type: '累计收益', value: 2793.69, tag: 0},
                        {date: '2022-08-17', type: '累计收益', value: 2796.51, tag: 0},
                        {date: '2022-08-18', type: '累计收益', value: 2808.08, tag: 0},
                        {date: '2022-08-19', type: '累计收益', value: 2657.97, tag: 0},
                        {date: '2022-08-20', type: '累计收益', value: 2657.97, tag: 0},
                        {date: '2022-08-21', type: '累计收益', value: 2657.97, tag: 0},
                        {date: '2022-08-22', type: '累计收益', value: 2729.47, tag: 0},
                        {date: '2022-08-23', type: '累计收益', value: 2756.47, tag: 0},
                        {date: '2022-08-24', type: '累计收益', value: 2567.46, tag: 0},
                        {date: '2022-08-25', type: '累计收益', value: 2604.19, tag: 0},
                        {date: '2022-08-26', type: '累计收益', value: 2542.36, tag: 0},
                        {date: '2022-08-27', type: '累计收益', value: 2542.36, tag: 0},
                        {date: '2022-08-28', type: '累计收益', value: 2542.36, tag: 0},
                        {date: '2022-08-29', type: '累计收益', value: 2536.41, tag: 0},
                        {date: '2022-08-30', type: '累计收益', value: 2487.12, tag: 0},
                        {date: '2022-08-31', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-01', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-02', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-03', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-04', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-05', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-06', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-07', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-08', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-09', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-10', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-11', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-12', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-13', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-14', type: '累计收益', value: 2344.33, tag: 0},
                        {date: '2022-09-15', type: '累计收益', value: 2149.27, tag: 0},
                        {date: '2022-09-16', type: '累计收益', value: 2039.28, tag: 0},
                        {date: '2022-09-17', type: '累计收益', value: 2039.28, tag: 0},
                        {date: '2022-09-18', type: '累计收益', value: 2039.28, tag: 0},
                        {date: '2022-09-19', type: '累计收益', value: 2030.01, tag: 0},
                        {date: '2022-09-20', type: '累计收益', value: 2099.3, tag: 0},
                        {date: '2022-09-21', type: '累计收益', value: 2058.83, tag: 0},
                        {date: '2022-09-22', type: '累计收益', value: 2050.14, tag: 0},
                        {date: '2022-09-23', type: '累计收益', value: 2004.9, tag: 0},
                        {date: '2022-09-24', type: '累计收益', value: 2004.9, tag: 0},
                        {date: '2022-09-25', type: '累计收益', value: 2004.9, tag: 0},
                        {date: '2022-09-26', type: '累计收益', value: 2019.68, tag: 0},
                    ],
                    label: [
                        {name: '时间', val: '2022-09-26'},
                        {name: '累计收益', val: '2019.68', type: 'line', color: '#E74949'},
                    ],
                    sub_tabs: [
                        {name: '近一月', val: 'm1'},
                        {name: '近三月', val: 'm3'},
                        {name: '近六月', val: 'm6'},
                        {name: '近一年', val: 'y1'},
                    ],
                    title: '累计收益',
                },
            };
            setChartData(res.result);
            setLoading(false);
            setShowEmpty(true);
        };

        useEffect(() => {
            init();
        }, [key, params, period]);

        return (
            <>
                {label?.length > 0 ? (
                    <View style={[Style.flexRowCenter, {marginTop: px(8)}]}>
                        {label.map((item, index, arr) => {
                            const {color, index_list, key: indexKey, name, tips, type, val} = item;
                            const n = index_list?.find?.((i) => i.key === indexKey)?.text || name;
                            return (
                                <View
                                    key={name + index}
                                    style={[
                                        Style.flexCenter,
                                        index === 1
                                            ? {marginLeft: px(40), marginRight: arr.length === 3 ? px(40) : 0}
                                            : {},
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
                                            onPress={(e) => showChooseIndex(e, index_list, indexKey)}
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
                                key === 'amount_change'
                                    ? ['transparent']
                                    : [Colors.red, Colors.lightBlackColor, 'transparent'],
                                key === 'amount_change'
                                    ? ['red']
                                    : ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                                ['nav', 'roe7d'].includes(key),
                                ['nav', 'roe7d'].includes(key) ? 2 : 0,
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
        );
    };
    return (
        <View style={styles.container}>
            <RenderChart data={tab} />
            <View
                style={{
                    paddingHorizontal: px(12),
                }}>
                <RenderList data={profitData} onPress={sortRenderList} date={selCurYear} />
            </View>
        </View>
    );
};

TotalProfit.propTypes = {};

export default TotalProfit;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingBottom: px(22),
        borderBottomRightRadius: px(5),
        borderBottomLeftRadius: px(5),
    },
    topLine: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    topPart: {
        marginTop: px(12),
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        paddingBottom: 0,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bigTitle: {
        fontSize: Font.textH2,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    linkText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
    tipsVal: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    labelBox: {
        marginLeft: px(8),
        paddingVertical: px(2),
        paddingHorizontal: px(4),
        borderRadius: px(2),
        borderWidth: Space.borderWidth,
        borderColor: '#BDC2CC',
    },
    tagText: {
        fontSize: px(9),
        lineHeight: px(13),
        color: Colors.descColor,
    },
    smallText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    bigNumText: {
        fontSize: px(22),
        lineHeight: px(27),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    numText: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    profitBox: {
        marginTop: px(12),
        paddingTop: px(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    profitText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    tradeMsgBox: {
        marginTop: px(12),
        paddingVertical: px(8),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    expandBox: {
        marginBottom: Space.marginVertical,
        paddingVertical: px(12),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        width: '100%',
    },
    angle: {
        position: 'relative',
        top: px(3),
        width: px(6),
        height: px(6),
        backgroundColor: Colors.bgColor,
        transform: [{rotate: '45deg'}],
    },
    menuBox: {
        marginTop: px(12),
        marginBottom: 0,
        marginHorizontal: 0,
    },
    menuIcon: {
        marginBottom: px(6),
        width: px(28),
        height: px(28),
    },
    divider: {
        marginVertical: px(12),
        borderTopWidth: Space.borderWidth,
        borderTopColor: Colors.borderColor,
    },
    consoleSub: {
        marginTop: Space.marginVertical,
        paddingVertical: px(8),
        paddingHorizontal: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
    },
    typeIcon: {
        width: px(32),
        height: px(16),
    },
    consoleSubText: {
        marginHorizontal: px(8),
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        flex: 1,
    },
    consoleSubBtn: {
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        height: px(24),
    },
    upgradeBg: {
        position: 'absolute',
        top: px(2),
        right: px(56),
        width: px(40),
        height: px(36),
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 60,
    },
    signalModeIcon: {
        position: 'absolute',
        top: -px(32),
        right: 0,
        width: px(34),
        height: px(24),
    },
    groupBulletIn: {
        marginTop: Space.marginVertical,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        borderTopWidth: px(2),
        borderColor: Colors.brandColor,
        backgroundColor: '#fff',
    },
    leftQuota: {
        width: px(20),
        height: px(20),
        position: 'absolute',
        top: px(-10),
        left: 0,
    },
    partBox: {
        marginTop: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    videoBox: {
        paddingTop: px(8),
        paddingHorizontal: Space.marginAlign,
        paddingBottom: Space.padding,
        height: px(200),
    },
    serviceInfo: {
        marginTop: Space.marginVertical,
        paddingVertical: px(14),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    serviceIcon: {
        marginRight: px(8),
        width: px(44),
        height: px(44),
    },
    bottomList: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    bottomBtns: {
        paddingTop: px(12),
        paddingBottom: isIphoneX() ? 34 : px(12),
        backgroundColor: '#fff',
    },
    bottomBtnText: {
        fontSize: px(15),
        lineHeight: px(21),
        fontWeight: Font.weightMedium,
    },
    fixedBtn: {
        borderTopLeftRadius: Space.borderRadius,
        borderBottomLeftRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
    },
    buyBtn: {
        marginRight: px(12),
        borderTopRightRadius: Space.borderRadius,
        borderBottomRightRadius: Space.borderRadius,
        flex: 1,
        height: px(44),
    },
    chartTabs: {
        backgroundColor: '#fff',
        marginLeft: px(8),
    },
    legendTitle: {
        padding: 0,
        fontSize: px(13),
        lineHeight: px(19),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        width: '100%',
        textAlign: 'center',
    },
    lineLegend: {
        marginRight: px(4),
        width: px(8),
        height: px(2),
    },
    subTabBox: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
    },
    activeTab: {
        backgroundColor: '#DEE8FF',
    },
    tabelHeader: {
        marginTop: px(8),
        borderTopLeftRadius: Space.borderRadius,
        borderTopRightRadius: Space.borderRadius,
        height: px(37),
        backgroundColor: Colors.bgColor,
    },
    tabelRow: {
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        height: px(44),
    },
    toolNameBox: {
        paddingVertical: px(1),
        paddingRight: px(8),
        paddingLeft: px(1),
        borderRadius: px(20),
        backgroundColor: Colors.bgColor,
    },
    toolIcon: {
        marginRight: px(4),
        width: px(18),
        height: px(18),
    },
    toolNum: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    toolBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(10),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
    rootMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    keyChooseCon: {
        paddingHorizontal: px(4),
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        position: 'absolute',
        zIndex: 2,
    },
    indexBox: {
        paddingVertical: px(8),
        paddingHorizontal: px(4),
        borderColor: Colors.borderColor,
        alignItems: 'center',
    },
    publishAt: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
        fontFamily: Font.numRegular,
    },
    modeTitle: {
        paddingVertical: px(12),
        paddingHorizontal: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    signalWrapper: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: px(32),
    },
    indicatorWrapper: {
        flex: 4,
        borderLeftWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    indicatorVal: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    circle: {
        marginRight: px(8),
        borderRadius: px(10),
        width: px(10),
        height: px(10),
    },
    dsFundBox: {
        marginTop: px(12),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    redeemBtn: {
        paddingVertical: px(2),
        paddingHorizontal: px(6),
        borderRadius: px(12),
        borderWidth: Space.borderWidth,
        borderColor: Colors.brandColor,
    },
});
