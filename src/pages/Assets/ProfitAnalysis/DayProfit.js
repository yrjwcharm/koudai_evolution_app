/*
 * @Date: 2022/9/30 13:25
 * @Author: yanruifeng
 * @Description: 日收益
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {deviceWidth, isIphoneX, px as text, px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {compareDate, delMille} from '../../../utils/appUtil';
import RenderList from './components/RenderList';
import {getStyles} from './styles/getStyle';
import ChartHeader from './components/ChartHeader';
import BarChartComponent from './components/BarChartComponent';
import {getChartData} from './services';
import {useDispatch, useSelector} from 'react-redux';
import EmptyData from './components/EmptyData';
import RNEChartsPro from 'react-native-echarts-pro';
const DayProfit = React.memo(() => {
    const dispatch = useDispatch();
    const type = useSelector((state) => state.profitDetail.type);
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [chartData, setChart] = useState({});
    const [diff, setDiff] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [currentDay] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [startDate, setStartDate] = useState(dayjs().add(-15, 'day').format('YYYY-MM'));
    const week = useRef(['日', '一', '二', '三', '四', '五', '六']);
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [dateArr, setDateArr] = useState([]);
    const [isNext, setIsNext] = useState(false);
    const [isPrev, setIsPrev] = useState(true);
    const [xAxisData, setXAxisData] = useState([]);
    const [yAxisData, setYAxisData] = useState([]);
    const [maxDate, setMaxDate] = useState('');
    const [isHasData, setIsHasData] = useState(true);
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
                const res = await getChartData({type, unit_type: 'day', unit_value: dayjs_.format('YYYY-MM')});
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
                            (el) => delMille(el.value) > 0 || delMille(el.value) < 0
                        );
                        // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
                        let zIndex = arr.findIndex((el) => el.day == profit_data_list[index].unit_key);
                        let xAxisData = arr.map((el) => el.day);
                        let yAxisData = arr.map((el) => el.profit);
                        if (cur > max || cur < min) return;
                        cur == max && setIsNext(false);
                        cur == min && setIsPrev(false);
                        if (cur > min && cur < max) {
                            setIsPrev(true);
                            setIsNext(true);
                        }
                        setDate(dayjs_);
                        profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                        arr[zIndex] && (arr[zIndex].checked = true);
                        setDateArr([...arr]);
                        setSelCurDate(arr[zIndex].day);
                        setXAxisData(xAxisData);
                        setYAxisData(yAxisData);
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
    });
    const selBarChartType = useCallback(() => {
        setIsCalendar(false);
        setIsBarChart(true);
    });
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
                    <TouchableOpacity onPress={() => getProfitBySelDate(el)} key={`${el?.id + '' + index}`}>
                        <View style={[styles.dateItem, {...el?.style}, wrapStyle]}>
                            <Text style={[styles.day, dayStyle]}>{el.day == currentDay ? '今' : date}</Text>
                            {el.day !== currentDay && el?.profit && (
                                <Text style={[styles.profit, profitStyle]}>{el?.profit}</Text>
                            )}
                            {el.day == currentDay && (el?.profit > 0 || el?.profit < 0) && (
                                <Text style={[styles.profit, profitStyle]}>{el?.profit}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            }),
        [dateArr]
    );
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
                        <View style={{position: 'relative', right: px(28)}}>
                            <RNEChartsPro
                                width={deviceWidth}
                                height={px(220)}
                                option={{
                                    dataZoom: [
                                        {
                                            type: 'inside', // 内置于坐标系中
                                            // start: 0,
                                            // end: 30,
                                            // endValue: 30, //x轴少于31个数据，则显示全部，超过31个数据则显示前31个。
                                            // startValue: 0, // 从头开始。
                                            // endValue: 30, // 最多六个
                                            xAxisIndex: [0],
                                            // start: 94,
                                            // end: 100,
                                            // handleSize: 8,

                                            zoomOnMouseWheel: false, // 关闭滚轮缩放
                                            moveOnMouseWheel: false, // 开启滚轮平移
                                            moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
                                        },
                                    ],
                                    // title: {
                                    //     text: '产品一周销量情况',
                                    // },
                                    tooltip: {
                                        formatter: '{b}<br>{a}：{c}',
                                        // formatter:'{c}%'
                                    },
                                    toolbox: {
                                        show: false,
                                    },
                                    xAxis: [
                                        {
                                            type: 'category',
                                            nameLocation: 'right',
                                            nameGap: 30,

                                            data: xAxisData,
                                            axisLabel: {
                                                interval: xAxisData.length - 2,
                                                // rotate: 45,
                                                textStyle: {
                                                    color: Colors.lightGrayColor, //坐标值得具体的颜色
                                                    fontSize: px(9),
                                                    fontFamily: Font.numMedium,
                                                    fontWeight: 500,
                                                },
                                            },

                                            // axisTick: {
                                            //     length: 6,
                                            //     lineStyle: {
                                            //         type: 'dashed',
                                            //         // ...
                                            //     },
                                            // },
                                            axisTick: {
                                                show: false,
                                            },
                                            axisLine: {
                                                lineStyle: {
                                                    color: '#BDC2CC',
                                                    width: 1, //这里是为了突出显示加上的
                                                },
                                            },
                                        },
                                    ],
                                    yAxis: [
                                        {
                                            type: 'value',
                                            show: true,
                                            axisLine: {
                                                show: false, // 不显示坐标轴刻度线
                                            },
                                            axisTick: {
                                                //y轴刻度线
                                                show: false,
                                            },
                                            max: 90,
                                            min: -90,
                                            splitLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: ['#E9EAEF'],
                                                    width: 1,
                                                    type: 'solid',
                                                },
                                            },
                                            axisLabel: {
                                                show: false, // 不显示坐标轴上的文字
                                            },
                                        },
                                    ],
                                    series: [
                                        {
                                            name: 'Evaporation',
                                            type: 'bar',
                                            barWidth: '40%',
                                            barCategoryGap: '50%',
                                            // label: {
                                            //     show: true,
                                            //     position: 'top',
                                            // },
                                            itemStyle: {
                                                normal: {
                                                    color: function (params) {
                                                        //根据数值大小设置相关颜色
                                                        if (params.value > 0) {
                                                            return 'red';
                                                        } else {
                                                            return 'green';
                                                        }
                                                    },
                                                },
                                            },
                                            data: yAxisData,
                                        },
                                    ],
                                }}
                            />
                        </View>
                    )}
                    <RenderList curDate={selCurDate} />
                </View>
            ) : (
                <EmptyData />
            )}
        </>
    );
});
export default DayProfit;
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
