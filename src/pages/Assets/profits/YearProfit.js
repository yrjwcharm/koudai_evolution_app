/*
 * @Date: 2022/9/30 13:27
 * @Author: yanruifeng
 * @Description:年收益
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import {getStyles} from './styles/getStyle';
import RenderList from './components/RenderList';
const width = Dimensions.get('window').width;
const YearProfit = () => {
    const [date, setDate] = useState(dayjs());
    const [dateArr, setDateArr] = useState([]);
    const [currentYear] = useState(dayjs().year());
    const [selCurYear, setSelCurYear] = useState(dayjs().year());
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
        let startYear = dayjs().year() - 5;
        let endYear = dayjs().year();
        let arr = [];
        for (let i = startYear; i < endYear; i++) {
            arr.push({
                day: i + 1,
                profit: '0.00',
            });
        }
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < mockData.length; j++) {
                if (arr[i].day == mockData[j].year) {
                    arr[i].profit = mockData[j].profit;
                }
            }
        }
        //找到选中的日期与当前日期匹配时的索引,默认给予选中绿色状态
        let index = arr.findIndex((el) => el.day == selCurYear);
        arr[index] && (arr[index].checked = true);
        setDateArr([...arr]);
    }, []);
    const sortRenderList = useCallback(() => {}, []);

    return (
        <View style={styles.container}>
            <View style={[styles.chartLeft]}>
                <View style={[Style.flexCenter, styles.selChartType, {backgroundColor: Colors.white, width: px(60)}]}>
                    <Text style={{color: Colors.defaultColor, fontSize: px(12)}}>日历图</Text>
                </View>
                <View style={[Style.flexCenter, styles.selChartType]}>
                    <Text style={{color: Colors.lightBlackColor, fontSize: px(12)}}>柱状图</Text>
                </View>
            </View>
            <View style={styles.yearFlex}>
                {dateArr.map((el, index) => {
                    const {wrapStyle, dayStyle: yearStyle, profitStyle} = getStyles(el, currentYear);
                    return (
                        <View style={[styles.year, wrapStyle, {marginHorizontal: (index + 1) % 3 == 2 ? px(4) : 0}]}>
                            <Text style={[styles.yearText, yearStyle]}>{el?.day}</Text>
                            <Text style={[styles.yearProfit, profitStyle]}>{el?.profit}</Text>
                        </View>
                    );
                })}
            </View>
            <RenderList data={profitData} onPress={sortRenderList} date={selCurYear} />
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
        flex: 1,
        paddingTop: px(16),
        paddingHorizontal: px(12),
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
