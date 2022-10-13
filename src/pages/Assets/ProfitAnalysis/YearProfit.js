/*
 * @Date: 2022/9/30 13:27
 * @Author: yanruifeng
 * @Description:年收益
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';
import BarChartComponent from './components/BarChartComponent';
import {getChartData} from './service';
const YearProfit = ({type}) => {
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [chartData, setChart] = useState({});
    const [date, setDate] = useState(dayjs());
    const [dateArr, setDateArr] = useState([]);
    const [currentYear] = useState(dayjs().year());
    const [selCurYear, setSelCurYear] = useState(dayjs().year());
    const mockData = [
        {
            year: '2018',
            profit: '+420.82',
        },
        {
            year: '2019',
            profit: '-32,245.08',
        },
        {
            year: '2020',
            profit: '+420.82',
        },
        {
            year: '2021',
            profit: '-32,245.08',
        },
        {
            year: '2022',
            profit: '+326,420.82',
        },
    ];
    useEffect(() => {
        initData(selCurYear);
    }, []);
    const initData = async (curYear) => {
        let startYear = dayjs().year() - 5;
        let endYear = dayjs().year();
        let arr = [];
        for (let i = startYear; i < endYear; i++) {
            arr.push({
                day: i + 1,
                profit: '0.00',
            });
        }
        const res = await getChartData({type, unit_type: 'year'});
        if (res.code == '000000') {
            const {profit_data_list = []} = res.result ?? {};
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < profit_data_list.length; j++) {
                    if (arr[i].day == profit_data_list[j].unit_key) {
                        arr[i].profit = profit_data_list[j].value;
                    }
                }
            }
        }
        // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
        let index = arr.findIndex((el) => el.day == curYear);
        arr[index] && (arr[index].checked = true);
        setDateArr([...arr]);
    };
    const sortRenderList = useCallback(() => {}, []);
    const getProfitBySelDate = (item) => {
        setSelCurYear(item.day);
        initData(item.day);
    };
    const selCalendarType = () => {
        setIsCalendar(true);
        setIsBarChart(false);
    };
    const selBarChartType = () => {
        setIsCalendar(false);
        setIsBarChart(true);
    };
    const init = useCallback(() => {
        // http.get('/profit/month_ratio/20210101', {fund_code: '', poid: 'X00F000003'}).then((res) => {
        //     setShowEmpty(true);
        //     if (res.code === '000000') {
        //         setChart(res.result);
        //     }
        // });
        let res = {
            code: '000000',
            message: 'success',
            result: {
                label: [
                    {name: '时间', val: '2022'},
                    {name: '我的组合', val: '-0.05%'},
                ],
                chart: [
                    {date: '2018', value: 0.0362, type: '我的组合'},
                    {date: '2019', value: 0.0707, type: '我的组合'},
                    {date: '2020', value: -0.0188, type: '我的组合'},
                    {date: '2021', value: -0.0247, type: '我的组合'},
                    {date: '2022', value: -0.0585, type: '我的组合'},
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
    useEffect(() => {
        init();
    }, []);
    return (
        <View style={styles.container}>
            <View style={[styles.chartLeft, {}]}>
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
            {isCalendar && (
                <View style={styles.yearFlex}>
                    {dateArr.map((el, index) => {
                        const {wrapStyle, dayStyle: yearStyle, profitStyle} = getStyles(el, currentYear);
                        return (
                            <TouchableOpacity key={`${el?.id + '' + index}`} onPress={() => getProfitBySelDate(el)}>
                                <View
                                    style={[
                                        styles.year,
                                        wrapStyle,
                                        {marginHorizontal: (index + 1) % 3 == 2 ? px(4) : 0},
                                    ]}>
                                    <Text style={[styles.yearText, yearStyle]}>{el?.day}</Text>
                                    <Text style={[styles.yearProfit, profitStyle]}>{el?.profit}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
            {isBarChart && <BarChartComponent chartData={chartData} />}
            <RenderList type={type} />
        </View>
    );
};

YearProfit.propTypes = {};

export default YearProfit;
const styles = StyleSheet.create({
    yearFlex: {
        marginTop: px(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    year: {
        marginBottom: px(4),
        width: px(103),
        height: px(46),
        backgroundColor: '#f5f6f8',
        borderRadius: px(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    yearText: {
        fontSize: px(12),
        color: '#121D3A',
    },
    yearProfit: {
        marginTop: px(2),
        fontSize: px(11),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: '#9AA0B1',
    },
    container: {
        paddingTop: px(16),
        paddingBottom: px(20),
        paddingHorizontal: px(12),
        borderBottomLeftRadius: px(5),
        borderBottomRightRadius: px(5),
        backgroundColor: Colors.white,
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
