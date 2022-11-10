/*
 * @Date: 2022/9/30 13:25
 * @Author: yanruifeng
 * @Description: 日收益
 */
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
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
const DayProfit = React.memo(({poid, fund_code, type, unit_type}) => {
    const [xAxisData, setXAxisData] = useState([]);
    const [dataAxis, setDataAxis] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [diff, setDiff] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [currentDay] = useState(dayjs().format('YYYY-MM-DD'));
    const week = useRef(['日', '一', '二', '三', '四', '五', '六']);
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [dateArr, setDateArr] = useState([]);
    const [isHasData, setIsHasData] = useState(true);
    const myChart = useRef();
    const [profit, setProfit] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [minDate, setMindDate] = useState('');
    const [unitList, setUnitList] = useState([]);
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
                zoomLock: true,
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
                interval: 29,
                showMaxLabel: true,
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
                data: [],
            },
        ],
    };
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
                    const {profit_data_list = [], unit_list = [], latest_profit_date = ''} = res?.result ?? {};
                    if (unit_list.length > 0) {
                        let min = unit_list[unit_list.length - 1].value;
                        let max = unit_list[0].value;
                        setMaxDate(max);
                        setMindDate(min);
                        setUnitList(unit_list);
                        let cur = dayjs_.format('YYYY-MM');
                        if (cur > max || cur < min) return;
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
                        let zIndex = arr.findIndex((el) => el.day == latest_profit_date);
                        setDate(dayjs_);
                        profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                        arr[zIndex] && (arr[zIndex].checked = true);
                        setDateArr([...arr]);
                        setSelCurDate(arr[zIndex]?.day);
                        // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
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
    const addMonth = () => {
        setDiff((diff) => diff + 1);
    };
    /**
     * 向下递减一个月
     */
    const subMonth = () => {
        setDiff((diff) => diff - 1);
    };
    /**
     * 通过选中日期获取收益数据
     */
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
    const selCalendarType = useCallback(() => {
        setIsCalendar(true);
        setIsBarChart(false);
    }, []);
    const selBarChartType = useCallback(() => {
        setIsCalendar(false);
        setIsBarChart(true);
    }, []);
    useEffect(() => {
        (async () => {
            if (isBarChart) {
                // myChart.current?.showLoading();
                // let dayjs_ = dayjs().add(diff, 'month').startOf('month');
                const res = await getChartData({
                    type,
                    unit_type,
                    unit_value: dayjs().format('YYYY-MM'),
                    poid,
                    fund_code,
                    chart_type: 'square',
                });
                if (res.code === '000000') {
                    const {profit_data_list = []} = res.result;
                    let xAxisData = [],
                        dataAxis = [];
                    if (profit_data_list.length > 0) {
                        let sortProfitDataList = profit_data_list.sort(
                            (a, b) => new Date(a.unit_key).getTime() - new Date(b.unit_key).getTime()
                        );
                        let startDate = sortProfitDataList[0].unit_key;
                        let lastDate = sortProfitDataList[sortProfitDataList.length - 1].unit_key;
                        for (let i = 0; i < 15; i++) {
                            sortProfitDataList.unshift({
                                unit_key: dayjs(startDate)
                                    .add(-(i + 1), 'day')
                                    .format('YYYY-MM-DD'),
                                value: '0.00',
                            });
                            sortProfitDataList.push({
                                unit_key: dayjs(lastDate)
                                    .add(i + 1, 'day')
                                    .format('YYYY-MM-DD'),
                                value: '0.00',
                            });
                        }
                        sortProfitDataList.map((el) => {
                            xAxisData.push(el.unit_key);
                            dataAxis.push(el.value);
                        });
                        let index = sortProfitDataList.findIndex((el) => el.unit_key == selCurDate);
                        let [left, mid, right] = [index - 15, index, index + 15];
                        let center = mid;
                        barOption.dataZoom[0].startValue = left;
                        barOption.dataZoom[0].endValue = right;
                        barOption.xAxis.data = xAxisData;
                        barOption.series[0].data = dataAxis;
                        barOption.series[0].markPoint.itemStyle = {
                            normal: {
                                color:
                                    dataAxis[center] > 0
                                        ? Colors.red
                                        : dataAxis[center] < 0
                                        ? Colors.green
                                        : Colors.transparent,
                                borderColor: Colors.white,
                                borderWidth: 1, // 标注边线线宽，单位px，默认为1
                            },
                        };
                        barOption.series[0].markPoint.data[0] = {
                            xAxis: xAxisData[center],
                            yAxis: dataAxis[center],
                        };
                        setStartDate(xAxisData[left]);
                        setEndDate(xAxisData[right]);
                        setXAxisData(xAxisData);
                        setDataAxis(dataAxis);
                        setProfit(dataAxis[center]);
                        // myChart.current?.hideLoading();
                        myChart.current?.setNewOption(barOption);
                    }
                }
            }
        })();
    }, [type, isBarChart, selCurDate]);
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
                let todayProfit = el.day == currentDay && el.profit;
                return (
                    <TouchableOpacity
                        disabled={el.day > currentDay || el?.isDisabled || delMille(todayProfit) == 0}
                        onPress={() => getProfitBySelDate(el)}
                        key={`${el + '' + index}`}>
                        <View style={[styles.dateItem, {...el?.style}, wrapStyle]}>
                            <Text style={[styles.day, dayStyle]}>{el.day == currentDay ? '今' : date}</Text>
                            {el.day !== currentDay && el?.profit && (
                                <Text
                                    style={[
                                        styles.profit,
                                        profitStyle,
                                        {
                                            fontSize:
                                                delMille(el.profit) >= 10000 || delMille(el.profit) <= -1000
                                                    ? px(8)
                                                    : px(10),
                                        },
                                    ]}>
                                    {el?.profit}
                                </Text>
                            )}
                            {el.day == currentDay && (delMille(el?.profit) > 0 || delMille(el?.profit) < 0) && (
                                <Text
                                    style={[
                                        styles.profit,
                                        profitStyle,
                                        {
                                            fontSize:
                                                delMille(el.profit) >= 10000 || delMille(el.profit) <= -10000
                                                    ? px(8)
                                                    : px(10),
                                        },
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
    const renderBarChart = useCallback(
        (xAxisData, dataAxis) => {
            return (
                <RNEChartsPro
                    onDataZoom={(result, option) => {
                        const {startValue, endValue} = option.dataZoom[0];
                        let center = startValue + 15;
                        barOption.dataZoom[0].startValue = startValue;
                        barOption.dataZoom[0].endValue = endValue;
                        setStartDate(xAxisData[startValue]);
                        setEndDate(xAxisData[endValue]);
                        barOption.series[0].markPoint.itemStyle = {
                            normal: {
                                color:
                                    dataAxis[center] > 0
                                        ? Colors.red
                                        : dataAxis[center] < 0
                                        ? Colors.green
                                        : Colors.transparent,
                                borderColor: Colors.white,
                                borderWidth: 1, // 标注边线线宽，单位px，默认为1
                            },
                        };
                        barOption.series[0].markPoint.data[0] = {
                            xAxis: xAxisData[center],
                            yAxis: dataAxis[center],
                        };
                        let curMonth = dayjs(xAxisData[center]).month();
                        let diffMonth = dayjs().month() - curMonth;
                        setDiff(-diffMonth);
                        setProfit(dataAxis[center]);
                        setSelCurDate(xAxisData[center]);
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
        },
        [isBarChart]
    );
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ChartHeader
                    selCalendarType={selCalendarType}
                    selBarChartType={selBarChartType}
                    isCalendar={isCalendar}
                    isBarChart={isBarChart}
                    subMonth={subMonth}
                    addMonth={addMonth}
                    maxDate={maxDate}
                    minDate={minDate}
                    filterDate={date}
                    date={date.month() + 1 + `月`}
                />
                {isHasData ? (
                    <>
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
                                <View style={{marginTop: px(15), overflow: 'hidden'}}>
                                    {renderBarChart(xAxisData, dataAxis)}
                                </View>
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
export default DayProfit;
const styles = StyleSheet.create({
    chartDate: {
        fontSize: px(9),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.lightGrayColor,
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
    chartContainer: {
        position: 'relative',
        width: '100%',
        height: px(300),
        alignItems: 'center',
        justifyContent: 'center',
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
