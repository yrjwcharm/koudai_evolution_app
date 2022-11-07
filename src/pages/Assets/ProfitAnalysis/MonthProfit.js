/*
 * @Date: 2022/9/30 13:26
 * @Author: yanruifeng
 * @Description:月收益
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, ScrollView, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {deviceWidth, isIphoneX, px} from '../../../utils/appUtil';
import commonStyle from './styles/style';
import dayjs from 'dayjs';
import {compareDate, delMille} from '../../../utils/appUtil';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';
import {getChartData} from './services';
import EmptyData from './components/EmptyData';
import RNEChartsPro from 'react-native-echarts-pro';
import {round} from 'mathjs';
import moment from 'moment';
let timer = null;
const MonthProfit = React.memo(({poid, fund_code, type, unit_type}) => {
    const [xAxisData, setXAxisData] = useState([]);
    const [dataAxis, setDataAxis] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [diff, setDiff] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [dateArr, setDateArr] = useState([]);
    const [currentDay] = useState(dayjs().format('YYYY-MM'));
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM'));
    const [isHasData, setIsHasData] = useState(true);
    const [profit, setProfit] = useState('');
    const myChart = useRef(null);
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState(dayjs().year());
    const barOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        animation: true, //设置动画效果
        animationEasing: 'linear',
        grid: {left: 0, right: 0, bottom: 0, containLabel: true},

        dataZoom: [
            {
                type: 'inside',
                zoomLock: true,
                // startValue: 0,
                // endValue: 0,
                // rangeMode: ['value', 'percent'], //rangeMode: ['value', 'percent']，表示 start 值取绝对数值，end 取百分比。
                throttle: 100, //设置触发视图刷新的频率。单位为毫秒（ms）
            },
        ],
        xAxis: {
            show: false,
            nameLocation: 'end',
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
                interval: 29,
            },
            axisLine: {
                lineStyle: {
                    color: '#BDC2CC',
                    width: 0.5,
                },
            },
            data: [],
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: false, // 不显示坐标轴上的文字
                // margin: 0,
            },
            splitLine: {
                lineStyle: {
                    color: '#E9EAEF',
                    width: 0.5,
                },
                length: 200,
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
                data: [],
            },
        ],
    };
    const add = useCallback(() => {
        setDiff((diff) => diff + 1);
    }, []);

    const subtract = useCallback(() => {
        setDiff((diff) => diff - 1);
    }, []);
    const init = useCallback(
        (selCurDate) => {
            (async () => {
                let dayjs_ = dayjs().add(diff, 'year').startOf('year');
                let arr = [];
                //for循环装载日历数据
                for (let i = 0; i < 12; i++) {
                    let day = dayjs_.add(i, 'month').format('YYYY-MM');
                    let item = {
                        day,

                        profit: '0.00',
                        checked: false,
                    };
                    arr.push(item);
                }
                const res = await getChartData({type, unit_type, unit_value: dayjs_.year(), poid, fund_code});
                if (res.code === '000000') {
                    const {profit_data_list = [], unit_list = [], latest_profit_date = ''} = res?.result ?? {};
                    // //双重for循环判断日历是否超过、小于或等于当前日期
                    if (unit_list.length > 0) {
                        let startYear = unit_list[unit_list.length - 1].value;
                        let endYear = unit_list[0].value;
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = 0; j < profit_data_list.length; j++) {
                                if (compareDate(currentDay, arr[i].day) || currentDay == arr[i].day) {
                                    let unit = profit_data_list[j].unit_key;
                                    if (arr[i].day == unit) {
                                        arr[i].profit = profit_data_list[j].value;
                                    }
                                } else {
                                    delete arr[i].profit;
                                }
                            }
                        }
                        setStartYear(startYear);
                        setEndYear(endYear);
                        let zIndex = arr.findIndex((el) => el.day == dayjs(latest_profit_date).format('YYYY-MM'));
                        // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
                        profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                        arr[zIndex] && (arr[zIndex].checked = true);
                        setDateArr([...arr]);
                        setProfit(profit_data_list[zIndex]?.value);
                        setDate(dayjs_);
                        setSelCurDate(arr[zIndex].day);
                    } else {
                        setIsHasData(false);
                    }
                }
            })();
        },
        [diff, type]
    );
    const getProfitBySelDate = (item) => {
        setSelCurDate(item.day);
        setProfit(item.profit);
    };
    useEffect(() => {
        dateArr.map((el) => {
            el.checked = false;
            if (el.day == selCurDate) {
                el.checked = true;
            }
        });
        setDateArr([...dateArr]);
    }, [selCurDate]);
    useEffect(() => {
        init(selCurDate);
    }, [init]);
    // useEffect(() => {
    //     (async () => {
    //         myChart.current?.showLoading();
    //         let dayjs_ = dayjs().add(diff, 'month').startOf('month');
    //         const res = await getChartData({
    //             type,
    //             unit_type,
    //             unit_value: dayjs_.year(),
    //             poid,
    //             fund_code,
    //             chart_type: 'square',
    //         });
    //         if (res.code === '000000') {
    //             const {profit_data_list = [], unit_list = []} = res.result;
    //             if (profit_data_list.length > 0) {
    //                 let xAxisData = [],
    //                     dataAxis = [];
    //                 let sortProfitDataList = profit_data_list.sort(
    //                     (a, b) => new Date(a.unit_key).getTime() - new Date(b.unit_key).getTime()
    //                 );
    //
    //                 let index = sortProfitDataList.findIndex((el) => el.unit_key == selCurDate);
    //                 sortProfitDataList.map((el) => {
    //                     xAxisData.push(el.unit_key);
    //                     dataAxis.push(el.value);
    //                 });
    //                 let lastDate = sortProfitDataList[sortProfitDataList.length - 1].unit_key;
    //                 let curDay = dayjs().format('YYYY-MM');
    //                 if (lastDate === curDay) {
    //                     for (let i = 0; i < 6; i++) {
    //                         xAxisData.push(
    //                             dayjs(sortProfitDataList[index].unit_key)
    //                                 .add(i + 1, 'month')
    //                                 .format('YYYY-MM')
    //                         );
    //                         dataAxis.push('0.00');
    //                     }
    //                 }
    //                 let [left, mid, right] = [index - 6, index, index + 6];
    //                 let start = ((left + 1) / xAxisData.length) * 100;
    //                 let center = mid;
    //                 let end = ((right + 1) / xAxisData.length) * 100;
    //                 barOption.dataZoom[0].start = start;
    //                 barOption.dataZoom[0].end = end;
    //                 barOption.xAxis.data = xAxisData;
    //                 barOption.series[0].data = dataAxis;
    //                 barOption.series[0].markPoint.itemStyle = {
    //                     normal: {
    //                         color:
    //                             dataAxis[center] > 0
    //                                 ? Colors.red
    //                                 : dataAxis[center] < 0
    //                                 ? Colors.green
    //                                 : Colors.transparent,
    //                         borderColor: Colors.white,
    //                         borderWidth: 1, // 标注边线线宽，单位px，默认为1
    //                     },
    //                 };
    //                 barOption.series[0].markPoint.data[0] = {
    //                     xAxis: xAxisData[center],
    //                     yAxis: dataAxis[center],
    //                 };
    //                 setStartDate(xAxisData[left]);
    //                 setEndDate(xAxisData[right]);
    //                 setXAxisData(xAxisData);
    //                 setDataAxis(dataAxis);
    //                 setProfit(dataAxis[center]);
    //                 myChart.current?.hideLoading();
    //                 myChart.current?.setNewOption(barOption);
    //             }
    //         }
    //     })();
    // }, [type, myChart.current, isBarChart]);
    const selCalendarType = useCallback(() => {
        setIsCalendar(true);
        setIsBarChart(false);
    });
    const selBarChartType = useCallback(() => {
        setIsCalendar(false);
        setIsBarChart(true);
    });
    const renderCalendar = useMemo(
        () =>
            dateArr?.map((el, index) => {
                const month = dayjs(el?.day).month() + 1;
                const {wrapStyle, dayStyle: monthStyle, profitStyle} = getStyles(el, currentDay);
                return (
                    <TouchableOpacity
                        disabled={el.day > currentDay}
                        onPress={() => getProfitBySelDate(el)}
                        key={`${el?.id + '' + index}`}>
                        <View style={[commonStyle.month, wrapStyle]}>
                            <Text style={[commonStyle.monthText, monthStyle]}>{month}</Text>
                            {el?.profit && <Text style={[commonStyle.monthProfit, profitStyle]}>{el?.profit}</Text>}
                        </View>
                    </TouchableOpacity>
                );
            }),
        [dateArr]
    );
    const renderBarChart = useMemo(() => {
        return (
            <RNEChartsPro
                onDataZoom={(result) => {
                    const {start, end} = result?.batch[0];
                    const count = xAxisData?.length;
                    barOption.dataZoom[0].start = start;
                    barOption.dataZoom[0].end = end;
                    let center = (xAxisData.length * (start + (end - start) / 2)) / 100;
                    let index = round(center) - 1;
                    let startIndex = round(count * (start / 100)) - 1;
                    let endIndex = round(count * (end / 100)) - 1;
                    setStartDate(xAxisData[startIndex]);
                    setEndDate(xAxisData[endIndex]);
                    barOption.series[0].markPoint.itemStyle = {
                        normal: {
                            color:
                                dataAxis[index] > 0
                                    ? Colors.red
                                    : dataAxis[index] < 0
                                    ? Colors.green
                                    : Colors.transparent,
                            borderColor: Colors.white,
                            borderWidth: 1, // 标注边线线宽，单位px，默认为1
                        },
                    };
                    barOption.series[0].markPoint.data[0] = {
                        xAxis: xAxisData[index],
                        yAxis: dataAxis[index],
                    };
                    setProfit(dataAxis[index]);
                    let curYear = dayjs(xAxisData[index]).year();
                    let diffYear = dayjs().year() - curYear;
                    setDiff(-diffYear);
                    setSelCurDate(xAxisData[index]);
                    myChart.current.setNewOption(barOption);
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
    }, [isBarChart]);
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <CalendarHeader
                    isCalendar={isCalendar}
                    isBarChart={isBarChart}
                    selCalendarType={selCalendarType}
                    selBarChartType={selBarChartType}
                    date={date.year()}
                    subtract={subtract}
                    add={add}
                    startYear={startYear}
                    endYear={endYear}
                />
                {isHasData ? (
                    <>
                        {isCalendar && <View style={commonStyle.monthFlex}>{renderCalendar}</View>}
                        {isBarChart && (
                            <View style={styles.chartContainer}>
                                <View style={styles.separatorView}>
                                    <Text
                                        style={[
                                            styles.benefit,
                                            {
                                                textAlign: 'center',
                                                color:
                                                    delMille(profit) > 0
                                                        ? Colors.red
                                                        : delMille(profit) < 0
                                                        ? Colors.green
                                                        : Colors.lightGrayColor,
                                            },
                                        ]}>
                                        {profit}
                                    </Text>
                                    <View style={styles.dateView}>
                                        <Text style={styles.date}>{selCurDate}</Text>
                                    </View>
                                </View>
                                <View style={{marginTop: px(15)}}>{renderBarChart}</View>
                                <View style={styles.separator} />
                            </View>
                        )}
                        {isBarChart && (
                            <View style={[Style.flexBetween]}>
                                <Text style={styles.chartDate}>{startDate}</Text>
                                <Text style={styles.chartDate}>{endDate}</Text>
                            </View>
                        )}
                        <RenderList
                            curDate={selCurDate}
                            type={type}
                            poid={poid}
                            fund_code={fund_code}
                            unitType={unit_type}
                        />
                    </>
                ) : (
                    <EmptyData />
                )}
            </ScrollView>
        </View>
    );
});
const CalendarHeader = React.memo(
    ({selCalendarType, selBarChartType, isCalendar, isBarChart, date, subtract, startYear, endYear, add}) => {
        return (
            <View style={Style.flexBetween}>
                <View style={[styles.chartLeft]}>
                    {/*<TouchableOpacity onPress={selCalendarType}>*/}
                    {/*    <View*/}
                    {/*        style={[*/}
                    {/*            Style.flexCenter,*/}
                    {/*            styles.selChartType,*/}
                    {/*            isCalendar && {*/}
                    {/*                backgroundColor: Colors.white,*/}
                    {/*                width: px(60),*/}
                    {/*            },*/}
                    {/*        ]}>*/}
                    {/*        <Text*/}
                    {/*            style={{*/}
                    {/*                color: isCalendar ? Colors.defaultColor : Colors.lightBlackColor,*/}
                    {/*                fontSize: px(12),*/}
                    {/*                fontFamily: Font.pingFangRegular,*/}
                    {/*            }}>*/}
                    {/*            日历图*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity onPress={selBarChartType}>*/}
                    {/*    <View*/}
                    {/*        style={[*/}
                    {/*            Style.flexCenter,*/}
                    {/*            styles.selChartType,*/}
                    {/*            isBarChart && {*/}
                    {/*                backgroundColor: Colors.white,*/}
                    {/*                width: px(60),*/}
                    {/*            },*/}
                    {/*        ]}>*/}
                    {/*        <Text*/}
                    {/*            style={{*/}
                    {/*                color: isBarChart ? Colors.defaultColor : Colors.lightBlackColor,*/}
                    {/*                fontSize: px(12),*/}
                    {/*                fontFamily: Font.pingFangRegular,*/}
                    {/*            }}>*/}
                    {/*            柱状图*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                {!isBarChart && (
                    <View style={styles.selMonth}>
                        {date > startYear && date <= endYear && (
                            <TouchableOpacity onPress={subtract}>
                                <Image source={require('../../../assets/img/icon/prev.png')} />
                            </TouchableOpacity>
                        )}
                        <Text style={styles.MMText}>{date}</Text>
                        {date >= startYear && date < endYear && (
                            <TouchableOpacity onPress={add}>
                                <Image
                                    style={{width: px(13), height: px(13)}}
                                    source={require('../../../assets/img/icon/next.png')}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    }
);
export default MonthProfit;
const styles = StyleSheet.create({
    container: {
        paddingTop: px(16),
        paddingBottom: px(20),
        paddingHorizontal: px(12),
        backgroundColor: Colors.white,
        borderBottomLeftRadius: px(5),
        borderBottomRightRadius: px(5),
        marginBottom: isIphoneX() ? px(58) : px(24),
    },
    chartContainer: {
        position: 'relative',
        width: '100%',
        height: px(300),
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefit: {
        fontSize: px(16),
        fontFamily: Font.numFontFamily,
        color: Colors.green,
    },
    dateView: {
        marginTop: px(4),
        width: px(74),
        height: px(18),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgColor,
        borderRadius: px(20),
    },
    date: {
        fontSize: px(10),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.lightGrayColor,
    },
    separatorView: {
        position: 'absolute',
        top: px(12),
    },
    separator: {
        position: 'absolute',
        height: px(240),
        top: px(52),
        zIndex: -9999,
        borderStyle: 'dashed',
        borderColor: '#9AA0B1',
        borderWidth: 0.5,
        borderRadius: Platform.select({android: 0.5, ios: 0}),
    },
    chartDate: {
        fontSize: px(9),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.lightGrayColor,
    },
    selMonth: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    MMText: {
        fontSize: px(15),
        fontFamily: Font.numFontFamily,
        color: '#3D3D3D',
        marginLeft: px(10),
        marginRight: px(8),
    },
    prevIcon: {
        resizeMode: 'cover',
    },
    chartLeft: {
        width: px(126),
        height: px(27),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#F4F4F4',
        borderRadius: px(6),
        opacity: 0,
    },
    selChartType: {
        borderRadius: px(4),
        height: px(21),
        width: px(60),
        fontFamily: Font.numRegular,
    },
});
