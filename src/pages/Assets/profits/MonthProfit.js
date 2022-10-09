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
import {subtract} from 'mathjs';
import {compareDate, delMille} from '../../../utils/common';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';

const MonthProfit = () => {
    const [diff, setDiff] = useState(0);
    const [isAdd, setIsAdd] = useState(false);
    const [date, setDate] = useState(dayjs());
    const [dateArr, setDateArr] = useState([]);
    const [currentDay] = useState(dayjs().format('YYYY-MM'));
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM'));
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
    const mockData = [
        {
            date: '2022-01',
            profit: '+20.94',
        },
        {
            date: '2022-02',
            profit: '+20.94',
        },
        {
            date: '2022-03',
            profit: '+20.94',
        },
        {
            date: '2022-04',
            profit: '+20.94',
        },
        {
            date: '2022-05',
            profit: '-245.08',
        },
        {
            date: '2022-06',
            profit: '+3,420',
        },
        {
            date: '2022-07',
            profit: '+20.94',
        },
        {
            date: '2022-08',
            profit: '-245.08',
        },
        {
            date: '2022-09',
            profit: '+3,420',
        },
        {
            date: '2022-10',
            profit: '+57,420',
        },
        {
            date: '2022-11',
        },
        {
            date: '2022-12',
        },
    ];

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
    const initData = (selCurDate) => {
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
        // //双重for循环判断日历是否超过、小于或等于当前日期
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < mockData.length; j++) {
                if (compareDate(currentDay, arr[i].day) || currentDay == arr[i].day) {
                    if (arr[i].day == mockData[j].date) {
                        arr[i].profit = mockData[j].profit;
                    }
                } else {
                    delete arr[i].profit;
                }
            }
        }
        // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
        let index = arr.findIndex((el) => el.day == selCurDate);
        arr[index] && (arr[index].checked = true);
        setDateArr([...arr]);
        setDate(dayjs_);
    };
    const getProfitBySelDate = (item) => {
        setSelCurDate(item.day);
        initData(item.day);
    };
    useEffect(() => {
        initData(selCurDate);
    }, [diff]);
    const sortRenderList = useCallback(() => {});
    return (
        <View style={styles.container}>
            <CalendarHeader time={date.year()} subtract={subtract} add={add} isAdd={isAdd} />
            <View style={commonStyle.monthFlex}>
                {dateArr?.map((el, index) => {
                    const month = dayjs(el?.day).month() + 1;
                    const {wrapStyle, dayStyle: monthStyle, profitStyle} = getStyles(el, currentDay);
                    return (
                        <TouchableOpacity onPress={() => getProfitBySelDate(el)}>
                            <View style={[commonStyle.month, wrapStyle]}>
                                <Text style={[commonStyle.monthText, monthStyle]}>{month}</Text>
                                {el?.profit && <Text style={[commonStyle.monthProfit, profitStyle]}>{el?.profit}</Text>}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {/*收益数据-根据实际情形选择map渲染*/}
            <RenderList data={profitData} onPress={sortRenderList} date={selCurDate} />
        </View>
    );
};
const CalendarHeader = ({time, subtract, isAdd, add}) => {
    return (
        <View style={Style.flexBetween}>
            <View style={[styles.chartLeft]}>
                <View style={[Style.flexCenter, styles.selChartType, {backgroundColor: Colors.white, width: px(60)}]}>
                    <Text style={{color: Colors.defaultColor, fontSize: px(12)}}>日历图</Text>
                </View>
                <View style={[Style.flexCenter, styles.selChartType]}>
                    <Text style={{color: Colors.lightBlackColor, fontSize: px(12)}}>柱状图</Text>
                </View>
            </View>
            <View style={styles.selMonth}>
                <TouchableOpacity onPress={subtract}>
                    <Image source={require('../../../assets/img/icon/prev.png')} />
                </TouchableOpacity>
                <Text style={styles.MMText}>{time}</Text>
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
        flex: 1,
        paddingTop: px(16),
        paddingHorizontal: px(12),
        backgroundColor: Colors.white,
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
