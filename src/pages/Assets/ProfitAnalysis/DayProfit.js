/*
 * @Date: 2022/9/30 13:25
 * @Author: yanruifeng
 * @Description: 日收益
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {deviceWidth, isIphoneX, px as text, px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {compareDate, delMille} from '../../../utils/appUtil';
import RenderList from './components/RenderList';
import {getStyles} from './styles/getStyle';
import ChartHeader from './components/ChartHeader';
import {getChartData} from './services';
import EmptyData from './components/EmptyData';
import RNEChartsPro from 'react-native-echarts-pro';
import {round} from 'mathjs';
let timer = null;
const DayProfit = React.memo(({poid, fund_code, type, unit_type}) => {
    const xAxisData = useRef([
        '2022-09-22',
        '2022-09-23',
        '2022-09-24',
        '2022-09-25',
        '2022-09-26',
        '2022-09-27',
        '2022-09-28',
        '2022-09-29',
        '2022-09-30',
        '2022-10-01',
        '2022-10-02',
        '2022-10-03',
        '2022-10-04',
        '2022-10-05',
        '2022-10-06',
        '2022-10-07',
        '2022-10-08',
        '2022-10-09',
        '2022-10-10',
        '2022-10-11',
        '2022-10-12',
        '2022-10-13',
        '2022-10-14',
        '2022-10-15',
        '2022-10-16',
        '2022-10-17',
        '2022-10-18',
        '2022-10-19',
        '2022-10-20',
        '2022-10-21',
        '2022-10-22',
        '2022-10-23',
        '2022-10-24',
        '2022-10-25',
        '2022-10-26',
        '2022-10-27',
        '2022-10-28',
        '2022-10-29',
        '2022-10-30',
        '2022-10-31',
        '2022-11-01',
    ]);
    const dataAxis = useRef([
        -10.0,
        10.0,
        12.2,
        10,
        10,
        -18,
        -16,
        -10.0,
        10.0,
        18.2,
        10,
        10,
        10.0,
        -20.8,
        -110,
        -17.6,
        10,
        15,
        -15,
        125,
        -28,
        -26,
        -10.0,
        10.0,
        28.2,
        10,
    ]);
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [diff, setDiff] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [currentDay] = useState(dayjs().format('YYYY-MM-DD'));
    const week = useRef(['日', '一', '二', '三', '四', '五', '六']);
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [dateArr, setDateArr] = useState([]);
    const [isNext, setIsNext] = useState(false);
    const [isPrev, setIsPrev] = useState(true);
    const [isHasData, setIsHasData] = useState(true);
    const myChart = useRef();
    const [proift, setProfit] = useState('');
    const [latestProfitDay, setLatestProfitDay] = useState('');

    /**
     * 初始化日历日期
     */
    const init = useCallback(
        (selCurDate) => {
            (async () => {
                let dayjs_ = dayjs().add(diff, 'month').startOf('month');
                let dayNums = dayjs_.daysInMonth();
                let weekDay = dayjs_.startOf('month').day();
                let startTrim = weekDay % 7;
                let arr = [];
                //for循环装载日历数据
                for (let i = 0; i < dayNums; i++) {
                    let day = dayjs_.add(i, 'day').format('YYYY-MM-DD');
                    let item = {
                        day,
                        profit: '0.00',
                        checked: false,
                    };
                    arr.push(item);
                }
                //获取当月最后一天是星期几
                let lastWeekDay = dayjs_.add(dayNums - 1, 'day').day();
                // let lastDate = dayjs_.add(dayNums - 1, 'day').format('YYYY-MM-DD');
                let endTrim = 6 - lastWeekDay;
                //当月日期开始
                if (startTrim != 7) {
                    for (let i = 0; i < startTrim; i++) {
                        arr.unshift({
                            checked: false,
                            profit: '0.00',
                            style: {
                                opacity: 0,
                            },
                            isDisabled: true,
                            day: dayjs_.subtract(i + 1, 'day').format('YYYY-MM-DD'),
                        });
                    }
                }
                //当月日期结束
                for (let i = 0; i < endTrim; i++) {
                    arr.push({
                        day: dayjs_.add(dayNums + i, 'day').format('YYYY-MM-DD'),
                        checked: false,
                        style: {
                            opacity: 0,
                        },
                        profit: '0.00',
                    });
                }
                const res = await getChartData({
                    type,
                    unit_type,
                    unit_value: dayjs_.format('YYYY-MM'),
                    poid,
                    fund_code,
                });
                //双重for循环判断日历是否超过、小于或等于当前日期
                if (res.code === '000000') {
                    const {profit_data_list = [], unit_list = []} = res?.result ?? {};
                    if (profit_data_list.length > 0) {
                        let minDate = unit_list[unit_list.length - 1].value;
                        let maxDate = unit_list[0].value;
                        let cur = dayjs_.format('YYYY-MM');
                        let max = dayjs(maxDate).format('YYYY-MM');
                        let min = dayjs(minDate).format('YYYY-MM');
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = 0; j < profit_data_list.length; j++) {
                                //小于当前日期的情况
                                if (compareDate(currentDay, arr[i].day) || currentDay == arr[i].day) {
                                    if (arr[i].day == profit_data_list[j].unit_key) {
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

                        // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
                        let zIndex = arr.findIndex((el) => el.day == profit_data_list[index].unit_key);
                        if (cur > max || cur < min) return;
                        cur == max && setIsNext(false);
                        cur == min && setIsPrev(false);
                        if (cur > min && cur < max) {
                            setIsPrev(true);
                            setIsNext(true);
                        }
                        setLatestProfitDay(profit_data_list[index]?.unit_key);
                        setProfit(profit_data_list[index]?.value);
                        setDate(dayjs_);
                        profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                        arr[zIndex] && (arr[zIndex].checked = true);
                        setDateArr([...arr]);
                        setSelCurDate(arr[zIndex].day);
                    } else {
                        setIsHasData(false);
                    }
                }
            })();
        },
        [diff, type]
    );
    useEffect(() => {
        init(selCurDate);
    }, [init]);
    /**
     * 向上递增一个月
     */
    const addMonth = async () => {
        setDiff((diff) => diff + 1);
    };
    /**
     * 向下递减一个月
     */
    const subMonth = async () => {
        setDiff((diff) => diff - 1);
    };
    /**
     * 通过选中日期获取收益数据
     */
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
    const selCalendarType = useCallback(() => {
        setIsCalendar(true);
        setIsBarChart(false);
    }, []);
    const selBarChartType = useCallback(() => {
        setIsCalendar(false);
        setIsBarChart(true);
    }, []);
    useEffect(() => {
        if (isBarChart && latestProfitDay) {
            // const startDate = dayjs(latestProfitDay).add(-12, 'month').format('YYYY-MM-DD'); // 起始时间（当前年1号的00:00:00点）
            // const endDate = dayjs(latestProfitDay).add(15, 'day').format('YYYY-MM-DD');
            // let diffDay = dayjs(endDate).diff(startDate, 'day');
            // let dates = [];
            // for (let i = 0; i <= diffDay; i++) {
            //     let day = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
            //     dates.push(day);
            // }
            // myChart.current.setNewOption(barOption);
        }
    }, [isBarChart, latestProfitDay]);
    const renderWeek = useMemo(
        () =>
            week.current?.map((el, index) => {
                return (
                    <Text style={styles.week} key={el + '' + index}>
                        {el}
                    </Text>
                );
            }),
        []
    );
    const renderCalendar = useMemo(
        () =>
            dateArr?.map((el, index) => {
                const date = dayjs(el?.day).date();
                const {wrapStyle, dayStyle, profitStyle} = getStyles(el, currentDay);
                return (
                    <TouchableOpacity
                        disabled={el.day >= currentDay || el?.isDisabled}
                        onPress={() => getProfitBySelDate(el)}
                        key={`${el + '' + index}`}>
                        <View style={[styles.dateItem, {...el?.style}, wrapStyle]}>
                            <Text style={[styles.day, dayStyle]}>{el.day == currentDay ? '今' : date}</Text>
                            {el.day !== currentDay && el?.profit && (
                                <Text
                                    style={[
                                        styles.profit,
                                        profitStyle,
                                        {fontSize: el.profit >= 10000 ? px(8) : px(10)},
                                    ]}>
                                    {el?.profit}
                                </Text>
                            )}
                            {el.day == currentDay && (el?.profit > 0 || el?.profit < 0) && (
                                <Text
                                    style={[
                                        styles.profit,
                                        profitStyle,
                                        {fontSize: el.profit >= 10000 ? px(8) : px(10)},
                                    ]}>
                                    {el?.profit}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            }),
        [dateArr]
    );
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
                startValue: xAxisData.current.length - 31,
                endValue: xAxisData.current.length - 1,
                // rangeMode: ['value', 'percent'], //rangeMode: ['value', 'percent']，表示 start 值取绝对数值，end 取百分比。
                animation: true, //设置动画效果
                // throttle: 100, //设置触发视图刷新的频率。单位为毫秒（ms）
            },
        ],
        xAxis: {
            boundaryGap: false,
            type: 'category',
            axisTick: {
                show: false, // 不显示坐标轴刻度线
                alignWithLabel: true,
            },
            axisLabel: {
                show: true, // 不显示坐标轴上的文字
                color: Colors.lightGrayColor,
                fontFamily: Font.numMedium,
                fontWeight: '500',
                fontSize: 9,
                margin: 8,
                align: 'right',
                interval: 29,
            },
            axisLine: {
                lineStyle: {
                    color: '#BDC2CC',
                    width: 0.5,
                },
            },
            data: xAxisData.current,
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
                barGap: 0,
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
                    data: [
                        {
                            xAxis: selCurDate,
                            yAxis: '12.0',
                            // yAxis: dataAxis[selCurDate],
                        },
                    ],
                },
                data: dataAxis.current,
            },
        ],
    };
    const renderBarChart = useMemo(() => {
        return (
            <RNEChartsPro
                onDataZoom={(result) => {
                    Platform.OS == 'android' && DeviceEventEmitter.emit('sendChartTrigger', true);
                    const {start, end} = result?.batch[0];
                    console.log(start, end);
                    const count = xAxisData.current?.length;
                    let startLocation = round((start / 100) * count);
                    let endLocation = round((end / 100) * count);
                    console.log(startLocation, endLocation);
                    let centerLocation = startLocation + 15;
                    setSelCurDate(xAxisData.current[centerLocation]);
                    myChart.current.setNewOption({
                        series: [
                            {
                                ...barOption,
                                markPoint: {
                                    itemStyle: {
                                        normal: {
                                            color: dataAxis.current[centerLocation] > 0 ? Colors.red : Colors.green,
                                            borderColor: Colors.white,
                                            borderWidth: 1, // 标注边线线宽，单位px，默认为1
                                        },
                                    },
                                    data: [
                                        {
                                            xAxis: xAxisData.current[centerLocation],
                                            yAxis: dataAxis.current[centerLocation],
                                        },
                                    ],
                                },
                            },
                        ],
                    });
                }}
                legendSelectChanged={(result) => {}}
                onPress={(result) => {}}
                ref={myChart}
                width={deviceWidth - px(64)}
                height={px(350)}
                onMousemove={() => {}}
                onFinished={() => {
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
            {isHasData ? (
                <View style={styles.container}>
                    {/*chart类型*/}
                    <ChartHeader
                        selCalendarType={selCalendarType}
                        selBarChartType={selBarChartType}
                        isCalendar={isCalendar}
                        isBarChart={isBarChart}
                        subMonth={subMonth}
                        addMonth={addMonth}
                        isPrev={isPrev}
                        isNext={isNext}
                        date={date.month() + 1 + '月'}
                    />
                    {/*日历*/}
                    {isCalendar && (
                        <View style={{marginTop: px(12)}}>
                            <View style={styles.weekFlex}>{renderWeek}</View>
                            <View style={styles.dateWrap}>{renderCalendar}</View>
                        </View>
                    )}
                    {isBarChart && (
                        <View style={styles.chartContainer}>
                            <View style={styles.separatorView}>
                                <Text
                                    style={[
                                        styles.benefit,
                                        {textAlign: 'center', color: delMille(proift) > 0 ? Colors.red : Colors.green},
                                    ]}>
                                    {proift}
                                </Text>
                                <View style={styles.dateView}>
                                    <Text style={styles.date}>{selCurDate}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: px(12)}}>{renderBarChart}</View>
                            <View style={styles.separator} />
                        </View>
                    )}
                    <RenderList
                        curDate={selCurDate}
                        type={type}
                        poid={poid}
                        fund_code={fund_code}
                        unitType={unit_type}
                    />
                </View>
            ) : (
                <EmptyData />
            )}
        </>
    );
});
export default DayProfit;
const styles = StyleSheet.create({
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
    chartContainer: {
        position: 'relative',
        width: '100%',
        height: px(350),
        alignItems: 'center',
        justifyContent: 'center',
    },
    separatorView: {
        position: 'absolute',
        top: px(12),
    },
    separator: {
        position: 'absolute',
        height: px(282),
        top: px(55),
        zIndex: -9999,
        borderStyle: 'dashed',
        borderColor: '#9AA0B1',
        borderWidth: 0.5,
        borderRadius: Platform.select({android: 0.5, ios: 0}),
    },
    container: {
        paddingTop: px(16),
        paddingBottom: px(20),
        paddingHorizontal: px(12),
        backgroundColor: Colors.white,
        borderBottomLeftRadius: px(5),
        borderBottomRightRadius: px(5),
        marginBottom: isIphoneX() ? px(58) : px(24),
    },
    dateWrap: {
        marginTop: px(8),
        ...Style.flexBetween,
        flexWrap: 'wrap',
    },
    dateItem: {
        width: Dimensions.get('window').width / 8.5,
        height: px(44),
        // justifyContent: 'center',
        // alignItems: 'center',
        marginBottom: px(2),
        ...Style.flexCenter,
        borderRadius: px(4),
        backgroundColor: Colors.inputBg,
    },
    day: {
        fontSize: px(13),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.defaultColor,
    },
    profit: {
        fontSize: px(10),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.lightGrayColor,
    },
    chartHeader: {},
    weekFlex: {
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    week: {
        fontSize: Font.textH3,
        color: Colors.lightGrayColor,
    },
});
