/*
 * @Date: 2022/9/30 13:25
 * @Author: yanruifeng
 * @Description: 日收益
 */
import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Colors, Font, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';

const DayProfit = () => {
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
                    <Image
                        style={{width: px(13), height: px(13)}}
                        source={require('../../../assets/img/icon/next.png')}
                    />
                </View>
            </View>
        </View>
    );
};

export default DayProfit;
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
});
