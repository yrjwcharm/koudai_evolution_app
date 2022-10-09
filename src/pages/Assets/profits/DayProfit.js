/*
 * @Date: 2022/9/30 13:25
 * @Author: yanruifeng
 * @Description: 日收益
 */
import React, {useCallback, useRef, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {compareDate} from '../../../utils/common';
import RenderList from './components/RenderList';
import * as _ from '../../../utils/appUtil';
import {getStyles} from './styles/getStyle';

const DayProfit = () => {
    const [diff, setDiff] = useState(0);
    const [date, setDate] = useState(dayjs());
    const [currentDay] = useState(dayjs().format('YYYY-MM-DD'));
    const week = useRef(['日', '一', '二', '三', '四', '五', '六']);
    const [selCurDate, setSelCurDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [dateArr, setDateArr] = useState([]);
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
        // let differ = dayjs(item.day).month() + 1 - (date.month() + 1);
    };
    const sortRenderList = useCallback(() => {}, []);
    return (
        <View style={styles.container}>
            {/*日历图｜柱状图*/}
            <View style={Style.flexBetween}>
                <View style={[styles.chartLeft]}>
                    <View
                        style={[Style.flexCenter, styles.selChartType, {backgroundColor: Colors.white, width: px(60)}]}>
                        <Text style={{color: Colors.defaultColor, fontSize: px(12)}}>日历图</Text>
                    </View>
                    <View style={[Style.flexCenter, styles.selChartType]}>
                        <Text style={{color: Colors.lightBlackColor, fontSize: px(12)}}>柱状图</Text>
                    </View>
                </View>
                <View style={styles.selMonth}>
                    <TouchableOpacity onPress={subMonth}>
                        <Image
                            style={{width: px(13), height: px(13)}}
                            source={require('../../../assets/img/icon/prev.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.MMText}>{date.month() + 1}月</Text>
                    <TouchableOpacity onPress={addMonth}>
                        <Image
                            style={{width: px(13), height: px(13)}}
                            source={require('../../../assets/img/icon/next.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/*日历*/}
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
                            <TouchableOpacity onPress={() => getProfitBySelDate(el)}>
                                <View style={[styles.dateItem, wrapStyle, {...el?.style}]} key={el + '' + index}>
                                    <Text style={[styles.day, dayStyle]}>{date}</Text>
                                    {el?.profit && <Text style={[styles.profit, profitStyle]}>{el?.profit}</Text>}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            {/*收益数据-根据实际情形选择map渲染*/}
            <RenderList data={profitData} onPress={sortRenderList} date={selCurDate} />
        </View>
    );
};
export default DayProfit;
const styles = StyleSheet.create({
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
    nextIcon: {
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
