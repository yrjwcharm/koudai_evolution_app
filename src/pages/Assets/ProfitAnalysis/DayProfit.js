/*
 * @Date: 2022/9/30 13:25
 * @Author: yanruifeng
 * @Description: 日收益
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Dimensions, TextInput, Platform} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px as text, px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {compareDate} from '../../../utils/common';
import RenderList from './components/RenderList';
import * as _ from '../../../utils/appUtil';
import {getStyles} from './styles/getStyle';
import ChartHeader from './components/ChartHeader';
import BarChartComponent from './components/BarChartComponent';
import {getProfitDetail} from './service';
let UUID = require('uuidjs');
let uuid = UUID.generate();
const DayProfit = ({type}) => {
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [chartData, setChart] = useState({});
    const [diff, setDiff] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [currentDay] = useState(dayjs().format('YYYY-MM-DD'));
    const week = useRef(['日', '一', '二', '三', '四', '五', '六']);
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [dateArr, setDateArr] = useState([]);

    const init = useCallback(() => {
        let res = {
            code: '000000',
            message: 'success',
            result: {
                label: [
                    {name: '时间', val: '2022-09-20'},
                    {name: '我的组合', val: '0.02%'},
                ],
                chart: [
                    // {date: '2022-05', value: 0.0362, type: '我的组合'},
                    // {date: '2022-06', value: 0.0707, type: '我的组合'},
                    // {date: '2022-07', value: -0.0188, type: '我的组合'},
                    // {date: '2022-08', value: -0.0247, type: '我的组合'},
                    {date: '2022-09-01', value: -0.0585, type: '我的组合'},
                    {date: '2022-10-01', value: 0.02, type: '我的组合'},
                ],
                tips: {
                    title: '比较基准',
                    content: [
                        {key: '比较基准', val: '上证指数'},
                        {
                            key: '什么是比较基准',
                            val:
                                '全天候组合中股票类资产的比较基准是上证指数 , 债券类资产的比较基准是中证全债 , 根据配置不同比例的两类资产来作为比较基准',
                        },
                    ],
                },
            },
            traceId: '171cb96d48067057171cb96d480432d0',
        };
        setChart(res.result);
    }, []);
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
        {
            date: '2022-10-03',
            profit: '-25.23',
        },
        {
            date: '2022-10-04',
            profit: '-25.23',
        },
        {
            date: '2022-10-05',
            profit: '+25.23',
        },
        {
            date: '2022-10-06',
            profit: '+25.23',
        },
        {
            date: '2022-10-07',
            profit: '-25.23',
        },
        {
            date: '2022-10-08',
            profit: '-25.23',
        },
        {
            date: '2022-10-09',
            profit: '+25.23',
        },
        {
            date: '2022-10-10',
            profit: '-25.23',
        },
        // {
        //     date: '2022-10-08',
        //     profit: '-25.23',
        // },
    ]);
    /**
     * 初始化日历日期
     */
    const initData = (selCurDate) => {
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
                id: uuid,
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
                    id: uuid,
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
                id: uuid,
                day: dayjs_.add(dayNums + i, 'day').format('YYYY-MM-DD'),
                checked: false,
                style: {
                    opacity: 0,
                },
                profit: '0.00',
            });
        }
        //双重for循环判断日历是否超过、小于或等于当前日期
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < mockData.length; j++) {
                //小于当前日期的情况
                if (compareDate(currentDay, arr[i].day) || currentDay == arr[i].day) {
                    if (arr[i].day == mockData[j].date) {
                        arr[i].profit = mockData[j].profit;
                    }
                } else {
                    delete arr[i].profit;
                }
            }
        }
        //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
        let index = arr.findIndex((el) => el.day == selCurDate);
        arr[index] && (arr[index].checked = true);
        setDateArr([...arr]);
        setDate(dayjs_);
    };
    React.useEffect(() => {
        initData(selCurDate);
    }, [diff]);
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
        initData(item.day);
    };
    const selCalendarType = useCallback(() => {
        setIsCalendar(true);
        setIsBarChart(false);
    });
    const selBarChartType = useCallback(() => {
        setIsCalendar(false);
        setIsBarChart(true);
    });

    useEffect(() => {
        init();
    }, [init]);
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
            {/*收益数据-根据实际情形选择map渲染*/}
            <RenderList type={type} />
        </View>
    );
};
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
