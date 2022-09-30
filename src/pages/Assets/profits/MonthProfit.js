/*
 * @Date: 2022/9/30 13:26
 * @Author: yanruifeng
 * @Description:月收益
 */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import commonStyle from './css/style';
import dayjs from 'dayjs';
const MonthProfit = () => {
    const mockData = [
        {
            month: '1月',
            profit: '0.00',
        },
        {
            month: '2月',
            profit: '0.00',
        },
        {
            month: '3月',
            profit: '-4,299.36',
        },
        {
            month: '4月',
            profit: '-32,245.08',
        },
        {
            month: '5月',
            profit: '+420.82',
        },
        {
            month: '6月',
            profit: '-2,245.08',
        },
        {
            month: '7月',
            profit: '+9420.82',
        },
        {
            month: '8月',
            profit: '+57,420.82',
        },
        {
            month: '9月',
            profit: '+57,420.82',
        },
        {
            month: '10月',
        },
        {
            month: '11月',
        },
        {
            month: '12月',
        },
    ];
    return (
        <View style={styles.container}>
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
                    <Image
                        style={{width: px(13), height: px(13)}}
                        source={require('../../../assets/img/icon/prev.png')}
                    />
                    <Text style={styles.MMText}>7月</Text>
                </View>
            </View>
            <View style={commonStyle.monthFlex}>
                {mockData.map((item, index) => {
                    const {month, profit} = item;
                    let curMonth = dayjs().month() + 1;
                    let newProfit = profit?.replace(/[,]/g, '');
                    let color = newProfit > 0 ? Colors.red : newProfit < 0 ? Colors.green : '#9AA0B1';
                    return (
                        <View
                            style={[
                                commonStyle.month,
                                {
                                    backgroundColor:
                                        index + 1 == curMonth
                                            ? Colors.red
                                            : newProfit > 0
                                            ? '#FFE7EA'
                                            : newProfit < 0
                                            ? '#DEF6E6'
                                            : index + 1 > curMonth
                                            ? 'transparent'
                                            : '#f5f6f8',
                                },
                            ]}>
                            <Text
                                style={[
                                    commonStyle.monthText,
                                    {color: index + 1 == curMonth ? Colors.white : Colors.defaultColor},
                                ]}>
                                {month}
                            </Text>
                            {index + 1 <= curMonth && (
                                <Text
                                    style={[
                                        commonStyle.monthProfit,
                                        {color: index + 1 == curMonth ? Colors.white : `${color}`},
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
