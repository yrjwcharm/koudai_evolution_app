/*
 * @Date: 2022/9/30 13:27
 * @Author: yanruifeng
 * @Description:年收益
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px, delMille, compareDate, deviceWidth} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';
import BarChartComponent from './components/BarChartComponent';
import {getChartData} from './services';
import {useDispatch, useSelector} from 'react-redux';
import EmptyData from './components/EmptyData';
import RNEChartsPro from 'react-native-echarts-pro';
import {round} from 'mathjs';
const YearProfit = ({poid, fund_code, type, unit_type}) => {
    const [xAxisData, setXAxisData] = useState([]);
    const [dataAxis, setDataAxis] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCalendar, setIsCalendar] = useState(true);
    const [isBarChart, setIsBarChart] = useState(false);
    const myChart = useRef();
    const [profit, setProfit] = useState('');
    const [dateArr, setDateArr] = useState([]);
    const [currentYear] = useState(dayjs().year());
    const [selCurYear, setSelCurYear] = useState(dayjs().year());
    const [isHasData, setIsHasData] = useState(true);
    const barOption = {
        grid: {left: 0, right: 0, bottom: 0, containLabel: true},

        dataZoom: [
            {
                type: 'inside',
                zoomLock: true,
                animation: true, //设置动画效果
            },
        ],
        xAxis: {
            show: false,
            nameLocation: 'end',
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
                length: 200,
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
    const init = useCallback(
        (curYear) => {
            (async () => {
                let startYear = dayjs().year() - 5;
                let endYear = dayjs().year();
                let arr = [];
                const res = await getChartData({type, unit_type});
                if (res.code === '000000') {
                    const {profit_data_list = [], unit_list = []} = res?.result ?? {};
                    let zIndex;
                    if (profit_data_list.length > 0) {
                        if (profit_data_list <= 5) {
                            arr = profit_data_list.map((el) => {
                                return {
                                    day: el.unit_key,
                                    profit: el.value,
                                };
                            });
                            zIndex = arr.findIndex((el) => delMille(el.profit) > 0 || delMille(el.profit) < 0);
                        } else {
                            for (let i = startYear; i < endYear; i++) {
                                arr.push({
                                    day: i + 1,
                                    profit: '0.00',
                                });
                            }
                            for (let i = 0; i < arr.length; i++) {
                                for (let j = 0; j < profit_data_list.length; j++) {
                                    if (arr[i].day == profit_data_list[j].unit_key) {
                                        arr[i].profit = profit_data_list[j].value;
                                    }
                                }
                            }
                            let index = profit_data_list.findIndex(
                                (el) => delMille(el.value) >= 0 || delMille(el.value) <= 0
                            );
                            zIndex = arr.findIndex((el) => el.day == profit_data_list[index].unit_key);
                        }

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
        setProfit();
    };
    useEffect(() => {
        dateArr.map((el) => {
            el.checked = false;
            if (el.day == selCurYear) {
                el.checked = true;
            }
        });
        setDateArr([...dateArr]);
    }, [selCurYear]);
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
                    <TouchableOpacity
                        disabled={el.day > currentYear}
                        key={`${el + '' + index}`}
                        onPress={() => getProfitBySelDate(el)}>
                        <View style={[styles.year, wrapStyle]}>
                            <Text style={[styles.yearText, yearStyle]}>{el?.day}</Text>
                            <Text style={[styles.yearProfit, profitStyle]}>{el?.profit}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }),
        [dateArr]
    );
    const renderBarChart = useMemo(() => {
        return (
            <RNEChartsPro
                onDataZoom={(result) => {
                    const {start, end} = result?.batch[0];
                    const count = xAxisData?.length;
                    barOption.dataZoom[0].start = start;
                    barOption.dataZoom[0].end = end;
                    let center = (xAxisData.length * (start + (end - start) / 2)) / 100;
                    let index = round(center) - 1;
                    let startIndex = round(count * (start / 100)) - 1;
                    let endIndex = round(count * (end / 100)) - 1;
                    setStartDate(xAxisData[startIndex]);
                    setEndDate(xAxisData[endIndex]);
                    barOption.series[0].markPoint.itemStyle = {
                        normal: {
                            color:
                                dataAxis[index] > 0
                                    ? Colors.red
                                    : dataAxis[index] < 0
                                    ? Colors.green
                                    : Colors.transparent,
                            borderColor: Colors.white,
                            borderWidth: 1, // 标注边线线宽，单位px，默认为1
                        },
                    };
                    barOption.series[0].markPoint.data[0] = {
                        xAxis: xAxisData[index],
                        yAxis: dataAxis[index],
                    };
                    setProfit(dataAxis[index]);
                    setSelCurYear(xAxisData[index]);
                    myChart.current.setNewOption(barOption);
                }}
                legendSelectChanged={(result) => {}}
                onPress={(result) => {}}
                ref={myChart}
                width={deviceWidth - px(58)}
                height={px(350)}
                onMousemove={() => {}}
                onFinished={() => {}}
                onRendered={() => {}}
                option={barOption}
            />
        );
    }, [isBarChart]);
    return (
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
            <>
                {isHasData ? (
                    <>
                        {isCalendar && <View style={styles.yearFlex}>{renderCalendar}</View>}
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
                                        <Text style={styles.date}>{selCurYear}</Text>
                                    </View>
                                </View>
                                <View style={{marginTop: px(13)}}>{renderBarChart}</View>
                                <View style={styles.separator} />
                            </View>
                        )}
                        {isBarChart && (
                            <View style={[Style.flexBetween, {marginTop: px(6)}]}>
                                <Text style={styles.chartDate}>{startDate}</Text>
                                <Text style={styles.chartDate}>{endDate}</Text>
                            </View>
                        )}
                        <RenderList
                            curDate={selCurYear}
                            type={type}
                            poid={poid}
                            fund_code={fund_code}
                            unitType={unit_type}
                        />
                    </>
                ) : (
                    <EmptyData />
                )}
            </>
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
        justifyContent: 'space-between',
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
    chartContainer: {
        position: 'relative',
        width: '100%',
        height: px(350),
        alignItems: 'center',
        justifyContent: 'center',
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
    separatorView: {
        position: 'absolute',
        top: px(12),
    },
    separator: {
        position: 'absolute',
        height: px(290),
        top: px(52),
        zIndex: -9999,
        borderStyle: 'dashed',
        borderColor: '#9AA0B1',
        borderWidth: 0.5,
        borderRadius: Platform.select({android: 0.5, ios: 0}),
    },
    chartDate: {
        fontSize: px(9),
        fontFamily: Font.numMedium,
        fontWeight: '500',
        color: Colors.lightGrayColor,
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
