/*
 * @Date: 2022/9/30 13:26
 * @Author: yanruifeng
 * @Description:月收益
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import commonStyle from './styles/style';
import dayjs from 'dayjs';
import {compareDate, delMille} from '../../../utils/common';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';
import BarChartComponent from './components/BarChartComponent';
import {getChartData} from './services';
const MonthProfit = ({type}) => {
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [chartData, setChart] = useState({});
    const [diff, setDiff] = useState(0);
    const [isAdd, setIsAdd] = useState(false);
    const [date, setDate] = useState(dayjs());
    const [dateArr, setDateArr] = useState([]);
    const [currentDay] = useState(dayjs().format('YYYY-MM'));
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM'));
    const add = useCallback(() => {
        setDiff((diff) => diff + 1);
    }, []);
    useEffect(() => {
        date.year() == dayjs().year() && setIsAdd(false);
    }, [date]);
    const subtract = useCallback(() => {
        setIsAdd(true);
        setDiff((diff) => diff - 1);
    }, []);
    const initData = async (selCurDate) => {
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
        const res = await getChartData({type, unit_type: 'month', unit_value: dayjs_.year()});
        if (res.code === '000000') {
            const {profit_data_list = []} = res.result ?? {};
            let index = profit_data_list.findIndex((el) => delMille(el.value) > 0 || delMille(el.value) < 0);
            let barCharData = profit_data_list
                .map((el) => {
                    return {date: dayjs(el.unit_key).month() + 1 + '月', value: parseFloat(el.value)};
                })
                .sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime() ? 1 : -1));
            setChart({
                label: [
                    {name: '时间', val: profit_data_list[index]?.unit_key},
                    {name: '收益', val: profit_data_list[index]?.value},
                ],
                chart: barCharData,
            });
            // //双重for循环判断日历是否超过、小于或等于当前日期
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
            // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
            let zIndex = arr.findIndex((el) => el.day == selCurDate);
            arr[zIndex] && (arr[zIndex].checked = true);
            setDateArr([...arr]);
            setDate(dayjs_);
        }
    };
    const getProfitBySelDate = (item) => {
        setSelCurDate(item.day);
        initData(item.day);
    };
    useEffect(() => {
        initData(selCurDate);
    }, [diff]);
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
            <CalendarHeader
                isCalendar={isCalendar}
                isBarChart={isBarChart}
                selCalendarType={selCalendarType}
                selBarChartType={selBarChartType}
                date={date.year()}
                subtract={subtract}
                add={add}
                isAdd={isAdd}
            />
            {isCalendar && (
                <View style={commonStyle.monthFlex}>
                    {dateArr?.map((el, index) => {
                        const month = dayjs(el?.day).month() + 1;
                        const {wrapStyle, dayStyle: monthStyle, profitStyle} = getStyles(el, currentDay);
                        return (
                            <TouchableOpacity onPress={() => getProfitBySelDate(el)} key={`${el?.id + '' + index}`}>
                                <View style={[commonStyle.month, wrapStyle]}>
                                    <Text style={[commonStyle.monthText, monthStyle]}>{month}</Text>
                                    {el?.profit && (
                                        <Text style={[commonStyle.monthProfit, profitStyle]}>{el?.profit}</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
            {isBarChart && <BarChartComponent chartData={chartData} />}
            {/*收益数据-根据实际情形选择map渲染*/}
            <RenderList type={type} />
        </View>
    );
};
const CalendarHeader = ({selCalendarType, selBarChartType, isCalendar, isBarChart, date, subtract, isAdd, add}) => {
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
                <TouchableOpacity onPress={subtract}>
                    <Image source={require('../../../assets/img/icon/prev.png')} />
                </TouchableOpacity>
                <Text style={styles.MMText}>{date}</Text>
                {isAdd && (
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
};
export default MonthProfit;
const styles = StyleSheet.create({
    container: {
        paddingTop: px(16),
        paddingBottom: px(20),
        paddingHorizontal: px(12),
        backgroundColor: Colors.white,
        borderBottomLeftRadius: px(5),
        borderBottomRightRadius: px(5),
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
        fontFamily: Font.numRegular,
    },
});
