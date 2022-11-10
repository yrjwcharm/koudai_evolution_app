/*
 * @Date: 2022/10/2 23:16
 * @Author: yanruifeng
 * @Description: 日历
 */

import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Image, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Font, Style} from '../../../../common/commonStyle';
import {debounce, px} from '../../../../utils/appUtil';

const ChartHeader = React.memo(
    ({
        selCalendarType,
        selBarChartType,
        isCalendar,
        isBarChart,
        subMonth,
        addMonth,
        date,
        minDate,
        maxDate,
        filterDate,
    }) => {
        return (
            <>
                <View style={Style.flexBetween}>
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
                    <View style={styles.selMonth}>
                        {filterDate.format('YYYY-MM') !== minDate && (
                            <TouchableOpacity onPress={subMonth}>
                                <Image
                                    style={{width: px(13), height: px(13)}}
                                    source={require('../../../../assets/img/icon/prev.png')}
                                />
                            </TouchableOpacity>
                        )}
                        <Text style={styles.MMText}>{date}</Text>
                        {filterDate.format('YYYY-MM') !== maxDate && (
                            <TouchableOpacity onPress={addMonth}>
                                <Image
                                    style={{width: px(13), height: px(13)}}
                                    source={require('../../../../assets/img/icon/next.png')}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </>
        );
    }
);

ChartHeader.propTypes = {
    selCalendarType: PropTypes.func,
    selBarChartType: PropTypes.func,
    isCalendar: PropTypes.bool,
    isBarChart: PropTypes.bool,
    subMonth: PropTypes.func,
    addMonth: PropTypes.func,
    date: PropTypes.string,
};
export default ChartHeader;
const styles = StyleSheet.create({
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
        width: px(60),
        fontFamily: Font.numRegular,
    },
});
