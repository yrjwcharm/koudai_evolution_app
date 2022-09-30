/*
 * @Date: 2022/9/30 13:27
 * @Author: yanruifeng
 * @Description:年收益
 */
import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import dayjs from 'dayjs';
import commonStyle from './css/style';
const YearProfit = (props) => {
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
            <View style={commonStyle.monthFlex}>
                {mockData.map((item, index) => {
                    const {year, profit} = item;
                    let curYear = dayjs().year();
                    let newProfit = profit?.replace(/[,]/g, '');
                    let color = newProfit > 0 ? Colors.red : newProfit < 0 ? Colors.green : '#9AA0B1';
                    return (
                        <View
                            style={[
                                commonStyle.month,
                                {
                                    width: px(103),
                                    backgroundColor:
                                        year == curYear
                                            ? Colors.red
                                            : newProfit > 0
                                            ? '#FFE7EA'
                                            : newProfit < 0
                                            ? '#DEF6E6'
                                            : index + 1 > curYear
                                            ? 'transparent'
                                            : '#f5f6f8',
                                },
                            ]}>
                            <Text
                                style={[
                                    commonStyle.monthText,
                                    {color: year == curYear ? Colors.white : Colors.defaultColor},
                                ]}>
                                {year}
                            </Text>
                            {index + 1 <= curYear && (
                                <Text
                                    style={[
                                        commonStyle.monthProfit,
                                        {color: year == curYear ? Colors.white : `${color}`},
                                    ]}>
                                    {profit ?? ''}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

YearProfit.propTypes = {};

export default YearProfit;
const styles = StyleSheet.create({
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
