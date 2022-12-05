/*
 * @Date: 2022/9/30 13:27
 * @Author: yanruifeng
 * @Description:年收益
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, StyleSheet, ScrollView, Text, TouchableOpacity, View, Image} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px, delMille, deviceWidth, isEmpty} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';
import {getChartData} from './services';
import EmptyData from './components/EmptyData';
import RNEChartsPro from 'react-native-echarts-pro';
const YearProfit = ({poid, fund_code, type, unit_type, slideFn}) => {
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
    const [selCurYear, setSelCurYear] = useState('');
    const [isHasData, setIsHasData] = useState(true);
    const [diff, setDiff] = useState(0);
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [date, setDate] = useState(dayjs());
    const [unitList, setUnitList] = useState([]);
    const [period, setPeriod] = useState('');
    const [sortProfitList, setSortProfitList] = useState([]);
    const [profitDay, setProfitDay] = useState('');
    const barOption = {
        grid: {left: 0, right: 0, bottom: 0, containLabel: true},
        animation: true, //设置动画效果
        animationEasing: 'linear',
        dataZoom: [
            {
                type: 'inside',
                zoomLock: true, //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
                throttle: 100, //设置触发视图刷新的频率。单位为毫秒（ms）
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
            scale: true,
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
                large: true,
                largeThreshold: 1000,
                type: 'bar',
                barWidth: 6,
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
    useEffect(() => {
        let didCancel = false;
        (async () => {
            let dayjs_ = dayjs().add(diff, 'year');
            const res = await getChartData({
                type,
                unit_type,
                fund_code,
                poid,
                unit_value: dayjs_.year(),
            });
            if (res.code === '000000') {
                if (!didCancel) {
                    const {profit_data_list = [], unit_list = [], latest_profit_date = ''} = res?.result ?? {};

                    if (unit_list.length > 0) {
                        const [, max] = unit_list[0].value.split('-');
                        const [min] = unit_list[unit_list.length - 1].value.split('-');
                        setStartYear(min);
                        setEndYear(max);
                        setUnitList(unit_list);
                        setDate(dayjs_);
                        let cur = dayjs_.year();
                        if (cur > max || cur < min) return;
                        let period = '';
                        for (let item of unit_list) {
                            const [start, end] = item.value.split('-');
                            if (dayjs_.year() >= start && dayjs_.year() <= end) {
                                period = item.text;
                                break;
                            }
                        }
                        setPeriod(period);
                        let arr = profit_data_list
                            .sort((a, b) => new Date(a.unit_key).getTime() - new Date(b.unit_key).getTime())
                            .map((el) => {
                                return {
                                    day: parseFloat(el.unit_key),
                                    profit: delMille(el.value),
                                };
                            });
                        let zIndex = arr.findIndex((el) => el.day == latest_profit_date);
                        profit_data_list.length > 0 ? setIsHasData(true) : setIsHasData(false);
                        arr[arr.length - 1] && (arr[arr.length - 1].checked = true);
                        setDateArr([...arr]);
                        setSelCurYear(arr[zIndex]?.day);
                        setProfit(arr[zIndex]?.profit);
                    } else {
                        setIsHasData(false);
                    }
                }
            }
        })();
        return () => (didCancel = true);
    }, [type, diff]);
    const getProfitBySelDate = (item) => {
        setSelCurYear(item.day);
        setProfitDay(item.day);
        setProfit(item.profit);
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
        setProfitDay('');
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
                        <View style={[styles.year, wrapStyle, {marginRight: index % 3 == 2 ? px(0) : px(4)}]}>
                            <Text style={[styles.yearText, yearStyle]}>{el?.day}</Text>
                            <Text style={[styles.yearProfit, profitStyle]}>{el?.profit}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }),
        [dateArr]
    );
    const subStract = () => {
        setProfitDay('');
        setSelCurYear('');
        changeDiff(true);
    };
    const add = () => {
        setProfitDay('');
        setSelCurYear('');
        changeDiff(false);
    };
    const changeDiff = (isDecrease) => {
        new Promise((resolve) => {
            setDiff((diff) => {
                isDecrease ? resolve(diff - 5) : resolve(diff + 5);
                return isDecrease ? diff - 5 : diff + 5;
            });
        }).then((differ) => {
            let curDate = dayjs().year();
            let realDate = isDecrease ? startYear : endYear;
            let diff = realDate - curDate;
            isDecrease ? differ <= diff && setDiff(diff) : differ >= diff && setDiff(diff);
        });
    };
    const renderBarChart = useCallback(
        (xAxisData) => {
            return (
                <RNEChartsPro
                    onDataZoom={(result, option) => {
                        slideFn(false);
                        const {startValue} = option.dataZoom[0];
                        let center = startValue + 5;
                        let curYear = xAxisData[center];
                        let diffYear = dayjs().year() - curYear;
                        setDiff(-diffYear);
                        setProfitDay(xAxisData[center]);
                    }}
                    onFinished={() => {
                        slideFn(true);
                    }}
                    legendSelectChanged={(result) => {}}
                    onPress={(result) => {}}
                    ref={myChart}
                    width={deviceWidth - px(58)}
                    height={px(300)}
                    option={barOption}
                />
            );
        },
        [isBarChart]
    );
    useEffect(() => {
        (async () => {
            if (isBarChart) {
                // myChart.current?.showLoading();
                const res = await getChartData({
                    type,
                    unit_type,
                    unit_value: dayjs().year(),
                    poid,
                    fund_code,
                    chart_type: 'square',
                });
                if (res?.code === '000000') {
                    const {profit_data_list = [], latest_profit_date = ''} = res?.result;
                    if (profit_data_list.length > 0) {
                        let sortProfitDataList = profit_data_list.sort(
                            (a, b) => new Date(a.unit_key).getTime() - new Date(b.unit_key).getTime()
                        );
                        let startYear = sortProfitDataList[0].unit_key;
                        let lastYear = sortProfitDataList[sortProfitDataList.length - 1].unit_key;
                        for (let i = 0; i < 5; i++) {
                            sortProfitDataList.unshift({
                                unit_key: startYear - (i + 1),
                                value: '0.00',
                            });
                            sortProfitDataList.push({
                                unit_key: parseInt(lastYear) + (i + 1),
                                value: '0.00',
                            });
                        }
                        setSortProfitList(sortProfitDataList);
                        // myChart.current?.hideLoading();
                    }
                }
            }
        })();
    }, [type, isBarChart, diff]);
    useEffect(() => {
        if (isBarChart && selCurYear && sortProfitList.length > 0) {
            const [xAxisData, dataAxis] = [[], []];
            sortProfitList?.map((el) => {
                xAxisData.push(el.unit_key);
                dataAxis.push(delMille(el.value));
            });
            // let flowData = sortProfitList?.map((el) => delMille(el.value));
            // const maxVal = Number(Math.max(...flowData));
            // // // 获取坐标轴刻度最小值
            // const minVal = Number(Math.min(...flowData));
            let index = sortProfitList?.findIndex((el) => el.unit_key == (profitDay || selCurYear));
            let [left, center, right] = [index - 5, index, index + 5];
            barOption.dataZoom[0].startValue = left;
            barOption.dataZoom[0].endValue = right;
            barOption.xAxis.data = xAxisData;
            barOption.series[0].data = dataAxis;
            barOption.series[0].markPoint.itemStyle = {
                normal: {
                    color: dataAxis[center] > 0 ? Colors.red : dataAxis[center] < 0 ? Colors.green : Colors.transparent,
                    borderColor: Colors.white,
                    borderWidth: 1, // 标注边线线宽，单位px，默认为1
                },
            };
            barOption.series[0].markPoint.data[0] = {
                xAxis: xAxisData[center],
                yAxis: dataAxis[center],
            };
            // barOption.yAxis.min = Math.floor(minVal);
            // barOption.yAxis.max = Math.ceil(maxVal);
            setStartDate(xAxisData[left]);
            setEndDate(xAxisData[right]);
            profitDay && setSelCurYear(xAxisData[center]);
            profitDay && setProfit(dataAxis[center]);
            setXAxisData(xAxisData);
            setDataAxis(dataAxis);
            myChart.current?.setNewOption(barOption, {
                notMerge: false,
                lazyUpdate: true,
                silent: false,
            });
        }
    }, [isBarChart, sortProfitList, profitDay, selCurYear]);
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    {unitList.length > 0 && (
                        <View style={Style.flexRow}>
                            {date.year() > startYear && (
                                <TouchableOpacity onPress={subStract}>
                                    <Image
                                        style={{width: px(13), height: px(13)}}
                                        source={require('../../../assets/img/icon/prev.png')}
                                    />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.yearDateText}>{period}</Text>
                            {date.year() < endYear && (
                                <TouchableOpacity onPress={add}>
                                    <Image
                                        style={{width: px(13), height: px(13)}}
                                        source={require('../../../assets/img/icon/next.png')}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
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
                                    <View style={{marginTop: px(15)}}>{renderBarChart(xAxisData)}</View>
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
            </ScrollView>
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
    yearDateText: {
        fontSize: px(15),
        fontFamily: Font.numFontFamily,
        color: '#3D3D3D',
        marginLeft: px(10),
        marginRight: px(8),
    },
    year: {
        marginBottom: px(4),
        width: px(103),
        height: px(46),
        marginRight: px(4),
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
        height: px(300),
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
        height: px(240),
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
        width: px(60),
        fontFamily: Font.numRegular,
    },
});
