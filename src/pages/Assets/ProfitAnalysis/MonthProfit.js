/*
 * @Date: 2022/9/30 13:26
 * @Author: yanruifeng
 * @Description:月收益
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
let timer = null;
const MonthProfit = React.memo(({poid, fund_code, type, unit_type}) => {
    const [xAxisData, setXAxisData] = useState([]);
    const [dataAxis, setDataAxis] = useState([]);
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [diff, setDiff] = useState(0);
    const [isNext, setIsNext] = useState(false);
    const [isPrev, setIsPrev] = useState(true);
    const [date, setDate] = useState(dayjs());
    const [dateArr, setDateArr] = useState([]);
    const [currentDay] = useState(dayjs().format('YYYY-MM'));
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM'));
    const [isHasData, setIsHasData] = useState(true);
    const [profit, setProfit] = useState('');
    const myChart = useRef(null);
    const [isFinished, setIsFinished] = useState(false);
    const barOption = {
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'shadow',
        //     },
        // },
        grid: {left: 0, right: 0, bottom: 0, containLabel: true},

        dataZoom: [
            {
                type: 'inside',
                zoomLock: true,
                // startValue: 0,
                // endValue: 0,
                // rangeMode: ['value', 'percent'], //rangeMode: ['value', 'percent']，表示 start 值取绝对数值，end 取百分比。
                animation: true, //设置动画效果
                // throttle: 100, //设置触发视图刷新的频率。单位为毫秒（ms）
            },
        ],
        xAxis: {
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
            boundaryGap: false,
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
                    const {profit_data_list = [], unit_list = []} = res?.result ?? {};
                    // //双重for循环判断日历是否超过、小于或等于当前日期
                    if (profit_data_list.length > 0) {
                        let min = unit_list[unit_list.length - 1].value;
                        let max = unit_list[0].value;
                        let cur = dayjs_.year();
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
                        let index = profit_data_list.findIndex(
                            (el) => delMille(el.value) >= 0 || delMille(el.value) <= 0
                        );
                        let zIndex = arr.findIndex((el) => el.day == profit_data_list[index].unit_key);
                        // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
                        if (cur > max || cur < min) return;
                        cur == max && setIsNext(false);
                        cur == min && setIsPrev(false);
                        if (cur > min && cur < max) {
                            setIsPrev(true);
                            setIsNext(true);
                        }
                        profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                        arr[zIndex] && (arr[zIndex].checked = true);
                        setDateArr([...arr]);
                        setProfit(profit_data_list[index]?.value);
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
        dateArr.map((el) => {
            el.checked = false;
            if (el.day == item.day) {
                el.checked = true;
            }
        });
        setDateArr([...dateArr]);
    };
    useEffect(() => {
        init(selCurDate);
    }, [init]);
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
                    if (isFinished) {
                        Platform.OS === 'android' && DeviceEventEmitter.emit('sendChartTrigger', true);
                        const {start, end} = result?.batch[0];
                        const count = xAxisData?.length;
                        barOption.dataZoom[0].start = start;
                        barOption.dataZoom[0].end = end;
                        let center = (xAxisData.length * (start + (end - start) / 2)) / 100;
                        let index = round(center) - 1;
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
                        setSelCurDate(xAxisData[index]);
                        setProfit(dataAxis[index]);
                        // dateArr.map((el) => {
                        //     el.checked = false;
                        //     if (el.day == xAxisData[index]) {
                        //         el.checked = true;
                        //     }
                        // });
                        // setDateArr([...dateArr]);
                        myChart.current.setNewOption(barOption);
                    }
                }}
                legendSelectChanged={(result) => {}}
                onPress={(result) => {}}
                ref={myChart}
                width={deviceWidth - px(58)}
                height={px(350)}
                onMousemove={() => {}}
                onFinished={() => {
                    setIsFinished(true);
                    if (timer == null) {
                        timer = setTimeout(() => {
                            DeviceEventEmitter.emit('sendChartTrigger', false);
                            timer && clearTimeout(timer);
                        }, 1500);
                    }
                }}
                onRendered={() => {}}
                option={barOption}
            />
        );
    }, [isBarChart]);
    return (
        <>
            <View style={styles.container}>
                <CalendarHeader
                    isCalendar={isCalendar}
                    isBarChart={isBarChart}
                    selCalendarType={selCalendarType}
                    selBarChartType={selBarChartType}
                    date={date.year()}
                    subtract={subtract}
                    add={add}
                    isNext={isNext}
                    isPrev={isPrev}
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
                                <View style={{marginTop: px(13)}}>{renderBarChart}</View>
                                <View style={styles.separator} />
                            </View>
                        )}
                    </>
                ) : (
                    <EmptyData />
                )}
                <RenderList curDate={selCurDate} type={type} poid={poid} fund_code={fund_code} unitType={unit_type} />
            </View>
            )
        </>
    );
});
const CalendarHeader = React.memo(
    ({selCalendarType, selBarChartType, isCalendar, isBarChart, date, subtract, isNext, isPrev, add}) => {
        return (
            <View style={Style.flexBetween}>
                <View style={[styles.chartLeft]}>
                    <TouchableOpacity onPress={selCalendarType}>
                        <View
                            style={[
                                Style.flexCenter,
                                styles.selChartType,
                                isCalendar && {
                                    backgroundColor: Colors.white,
                                    width: px(60),
                                },
                            ]}>
                            <Text
                                style={{
                                    color: isCalendar ? Colors.defaultColor : Colors.lightBlackColor,
                                    fontSize: px(12),
                                    fontFamily: Font.pingFangRegular,
                                }}>
                                日历图
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selBarChartType}>
                        <View
                            style={[
                                Style.flexCenter,
                                styles.selChartType,
                                isBarChart && {
                                    backgroundColor: Colors.white,
                                    width: px(60),
                                },
                            ]}>
                            <Text
                                style={{
                                    color: isBarChart ? Colors.defaultColor : Colors.lightBlackColor,
                                    fontSize: px(12),
                                    fontFamily: Font.pingFangRegular,
                                }}>
                                柱状图
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.selMonth}>
                    {isPrev && (
                        <TouchableOpacity onPress={subtract}>
                            <Image source={require('../../../assets/img/icon/prev.png')} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.MMText}>{date}</Text>
                    {isNext && (
                        <TouchableOpacity onPress={add}>
                            <Image
                                style={{width: px(13), height: px(13)}}
                                source={require('../../../assets/img/icon/next.png')}
                            />
                        </TouchableOpacity>
                    )}
                </View>
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
    chartHeader: {},
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
        opacity: 1,
    },
    selChartType: {
        borderRadius: px(4),
        height: px(21),
        width: px(60),
        fontFamily: Font.numRegular,
    },
});
