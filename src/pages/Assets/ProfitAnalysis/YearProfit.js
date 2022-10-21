/*
 * @Date: 2022/9/30 13:27
 * @Author: yanruifeng
 * @Description:年收益
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px, delMille} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';
import BarChartComponent from './components/BarChartComponent';
import {getChartData} from './services';
import {useDispatch, useSelector} from 'react-redux';
import EmptyData from './components/EmptyData';
const YearProfit = (callback) => {
    const dispatch = useDispatch();
    const type = useSelector((state) => state.profitDetail.type);
    const unitType = useSelector((state) => state.profitDetail.unitType);
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const [chartData, setChart] = useState({});
    const [dateArr, setDateArr] = useState([]);
    const [currentYear] = useState(dayjs().year());
    const [selCurYear, setSelCurYear] = useState(dayjs().year());
    const [isHasData, setIsHasData] = useState(true);
    const init = useCallback(
        (curYear) => {
            (async () => {
                let startYear = dayjs().year() - 5;
                let endYear = dayjs().year();
                let arr = [];
                for (let i = startYear; i < endYear; i++) {
                    arr.push({
                        day: i + 1,
                        profit: '0.00',
                    });
                }
                const res = await getChartData({type, unit_type: unitType});
                if (res.code === '000000') {
                    const {profit_data_list = []} = res?.result ?? {};
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < profit_data_list.length; j++) {
                            if (arr[i].day == profit_data_list[j].unit_key) {
                                arr[i].profit = profit_data_list[j].value;
                            }
                        }
                    }
                    let barCharData = arr.map((el) => {
                        return {date: el.day + '年', value: parseFloat(el.profit)};
                    });
                    setChart({
                        label: [
                            {name: '时间', val: profit_data_list[0]?.unit_key},
                            {name: '收益', val: profit_data_list[0]?.value},
                        ],
                        chart: barCharData,
                    });
                    let index;
                    // //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
                    if (curYear == dayjs().year()) {
                        dispatch({type: 'updateUnitKey', payload: profit_data_list[0]?.unit_key});
                        index = arr.findIndex((el) => el.day == profit_data_list[0]?.unit_key);
                    } else {
                        index = arr.findIndex((el) => el.day == curYear);
                        dispatch({type: 'updateUnitKey', payload: curYear});
                    }
                    profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                    arr[index] && (arr[index].checked = true);
                    setDateArr([...arr]);
                }
            })();
        },
        [type, unitType]
    );
    useEffect(() => {
        init(selCurYear);
    }, [init]);
    const getProfitBySelDate = (item) => {
        setSelCurYear(item.day);
        init(item.day);
    };
    const selCalendarType = () => {
        setIsCalendar(true);
        setIsBarChart(false);
    };
    const selBarChartType = () => {
        setIsCalendar(false);
        setIsBarChart(true);
    };
    const renderCalendar = useMemo(
        () =>
            dateArr.map((el, index) => {
                const {wrapStyle, dayStyle: yearStyle, profitStyle} = getStyles(el, currentYear);
                return (
                    <TouchableOpacity key={`${el?.id + '' + index}`} onPress={() => getProfitBySelDate(el)}>
                        <View style={[styles.year, wrapStyle, {marginHorizontal: (index + 1) % 3 == 2 ? px(4) : 0}]}>
                            <Text style={[styles.yearText, yearStyle]}>{el?.day}</Text>
                            <Text style={[styles.yearProfit, profitStyle]}>{el?.profit}</Text>
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
                    {isCalendar && <View style={styles.yearFlex}>{renderCalendar}</View>}
                    {isBarChart && <BarChartComponent chartData={chartData} />}
                    <RenderList />
                </View>
            ) : (
                <EmptyData />
            )}
        </>
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
        backgroundColor: Colors.white,
        borderBottomLeftRadius: px(5),
        borderBottomRightRadius: px(5),
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
