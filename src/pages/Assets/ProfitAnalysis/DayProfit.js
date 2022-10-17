/*
 * @Date: 2022/9/30 13:25
 * @Author: yanruifeng
 * @Description: 日收益
 */
import React, {lazy, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px as text, px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {compareDate, delMille} from '../../../utils/appUtil';
import RenderList from './components/RenderList';
import {getStyles} from './styles/getStyle';
import ChartHeader from './components/ChartHeader';
import BarChartComponent from './components/BarChartComponent';
import {getChartData} from './services';
const DayProfit = React.memo(({type}) => {
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [chartData, setChart] = useState({});
    const [diff, setDiff] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [currentDay] = useState(dayjs().format('YYYY-MM-DD'));
    const week = useRef(['日', '一', '二', '三', '四', '五', '六']);
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [dateArr, setDateArr] = useState([]);
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
                // let maxDateArr = [];
                if (res.code === '000000') {
                    const {profit_data_list = []} = res.result ?? {};
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
                    let index = profit_data_list.findIndex((el) => delMille(el.value) > 0 || delMille(el.value) < 0);
                    let barCharData = profit_data_list
                        .map((el) => {
                            return {date: el.unit_key, value: parseFloat(el.value)};
                        })
                        .sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime() ? 1 : -1));
                    setChart({
                        label: [
                            {name: '时间', val: profit_data_list[index]?.unit_key},
                            {name: '收益', val: profit_data_list[index]?.value},
                        ],
                        chart: barCharData,
                    });

                    // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
                    let zIndex = arr.findIndex((el) => el.day == selCurDate);
                    arr[zIndex] && (arr[zIndex].checked = true);
                    setDateArr([...arr]);
                    setDate(dayjs_);
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
        init(item.day);
    };
    const selCalendarType = useCallback(() => {
        setIsCalendar(true);
        setIsBarChart(false);
    });
    const selBarChartType = useCallback(() => {
        setIsCalendar(false);
        setIsBarChart(true);
    });
    return (
        <View style={styles.container}>
            {/*chart类型*/}
            <ChartHeader
                selCalendarType={selCalendarType}
                selBarChartType={selBarChartType}
                isCalendar={isCalendar}
                isBarChart={isBarChart}
                subMonth={subMonth}
                addMonth={addMonth}
                date={date.month() + 1 + '月'}
            />
            {/*日历*/}
            {isCalendar && (
                <View style={{marginTop: px(12)}}>
                    <View style={styles.weekFlex}>
                        {week.current?.map((el, index) => {
                            return (
                                <Text style={styles.week} key={el + '' + index}>
                                    {el}
                                </Text>
                            );
                        })}
                    </View>
                    <View style={styles.dateWrap}>
                        {dateArr?.map((el, index) => {
                            const date = dayjs(el?.day).date();
                            const {wrapStyle, dayStyle, profitStyle} = getStyles(el, currentDay);
                            return (
                                <TouchableOpacity onPress={() => getProfitBySelDate(el)} key={`${el?.id + '' + index}`}>
                                    <View style={[styles.dateItem, wrapStyle, {...el?.style}]}>
                                        <Text style={[styles.day, dayStyle]}>{date}</Text>
                                        {el?.profit && <Text style={[styles.profit, profitStyle]}>{el?.profit}</Text>}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
            {isBarChart && <BarChartComponent chartData={chartData} />}
            <RenderList />
        </View>
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
    },
    dateWrap: {
        marginTop: px(8),
        ...Style.flexBetween,
        flexWrap: 'wrap',
    },
    dateItem: {
        width: Dimensions.get('window').width / 8.5,
        height: px(44),
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
