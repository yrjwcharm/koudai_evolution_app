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
    const type = useSelector((state) => state.profitDetail.type);
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
                const res = await getChartData({type, unit_type: 'year'});
                if (res.code === '000000') {
                    const {profit_data_list = []} = res?.result ?? {};
                    if (profit_data_list.length > 0) {
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = 0; j < profit_data_list.length; j++) {
                                if (arr[i].day == profit_data_list[j].unit_key) {
                                    arr[i].profit = profit_data_list[j].value;
                                }
                            }
                        }
                        let index = profit_data_list.findIndex(
                            (el) => delMille(el.value) > 0 || delMille(el.value) < 0
                        );
                        let zIndex = arr.findIndex((el) => el.day == profit_data_list[index].unit_key);
                        let barCharData = arr.map((el) => {
                            return {date: el.day + '年', value: parseFloat(el.profit)};
                        });
                        setChart({
                            label: [
                                {name: '时间', val: profit_data_list[index]?.unit_key},
                                {name: '收益', val: profit_data_list[index]?.value},
                            ],
                            chart: barCharData,
                        });
                        profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                        arr[zIndex] && (arr[zIndex].checked = true);
                        setDateArr([...arr]);
                        setSelCurYear(arr[zIndex].day);
                    } else {
                        setIsHasData(false);
                    }
                }
            })();
        },
        [type]
    );
    useEffect(() => {
        init(selCurYear);
    }, [init]);
    const getProfitBySelDate = (item) => {
        setSelCurYear(item.day);
        dateArr.map((el) => {
            el.checked = false;
            if (el.day == item.day) {
                el.checked = true;
            }
        });
        setDateArr([...dateArr]);
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
    const executeChangeDate = useCallback((data) => {
        setSelCurYear(data);
    }, []);
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
                    {isBarChart && <BarChartComponent chartData={chartData} changeDate={executeChangeDate} />}
                    <RenderList curDate={selCurYear} />
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
