/*
 * @Date: 2021-11-04 11:19:55
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-04 15:26:37
 * @Description:定制理财计划
 */
import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import {Chart} from '../../components/Chart';
import {baseAreaChart} from './components/chartOptions';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import http from '../../services';
import NumText from '../../components/NumText';
import FixedBtn from '../Portfolio/components/FixedBtn';

const PortfolioPlan = () => {
    const [active, setActive] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [data, setData] = useState(null);
    useEffect(() => {
        http.get('/questionnaire/chart/20211101?upid=170814&summary_id=312044').then((res) => {
            setChartData(res?.result?.charts);
            setData(res?.result);
        });
    }, []);
    return (
        <>
            <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={[Style.flexRow, {alignItems: 'flex-end', height: px(94)}]}>
                    <View style={[Style.flexCenter, styles.container_sty]}>
                        <NumText
                            style={{
                                ...styles.amount_sty,
                                fontSize: px(34),
                            }}
                            text={'12%'}
                        />
                        <Text style={styles.radio_sty}>年华</Text>
                    </View>

                    <View style={[Style.flexCenter, styles.container_sty]}>
                        <Text
                            style={[
                                styles.amount_sty,
                                {fontSize: px(26), lineHeight: px(30), color: Colors.defaultColor},
                            ]}>
                            -12.1%
                        </Text>
                        <Text style={[styles.radio_sty, {marginTop: px(6)}]}>嘿嘿</Text>
                    </View>
                </View>
                <View
                    style={{
                        height: 260,
                    }}>
                    <Chart
                        initScript={baseAreaChart(
                            chartData,
                            [Colors.red, Colors.lightBlackColor, 'transparent'],
                            ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                            true,
                            2,
                            deviceWidth - px(40),
                            10,
                            null,
                            220
                        )}
                        style={{width: '100%'}}
                    />
                </View>
                <View style={{paddingHorizontal: px(16)}}>
                    <Text style={styles.card_title}>智能工具</Text>
                    <View style={Style.flexBetween}>
                        <View style={styles.card}>
                            <Text style={styles.card_subtitle}>底线预估</Text>
                            <Text style={styles.card_desc}>底线预估底线预估</Text>
                            <Icon
                                name="checkmark-circle"
                                size={px(18)}
                                color={Colors.brandColor}
                                style={styles.check}
                            />
                        </View>
                        <View style={styles.card}>
                            <Text>底线预估</Text>
                            <Text>底线预估底线预估</Text>
                        </View>
                        <View style={styles.card}>
                            <Text>底线预估</Text>
                            <Text>底线预估底线预估</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {data?.button_list && <FixedBtn btns={data.button_list} />}
        </>
    );
};

export default PortfolioPlan;

const styles = StyleSheet.create({
    container_sty: {
        justifyContent: 'flex-end',
        paddingBottom: px(20),
        backgroundColor: '#fff',
        flex: 1,
        height: '100%',
    },
    amount_sty: {
        color: Colors.red,
        fontSize: px(34),
        lineHeight: px(40),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    radio_sty: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: px(17),
        textAlign: 'center',
        marginTop: px(4),
    },
    card_title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: Colors.defaultColor,
        marginBottom: px(12),
    },
    card: {
        height: px(134),
        width: px(102),
        borderRadius: px(8),
        borderColor: '#DDDDDD',
        borderWidth: px(0.5),
        paddingHorizontal: px(12),
        paddingVertical: px(16),
        alignItems: 'center',
    },
    card_subtitle: {
        fontSize: px(14),
        lineHeight: px(20),
        marginBottom: px(8),
    },
    card_desc: {
        fontSize: px(12),
        lineHeight: px(17),
        textAlign: 'center',
    },
    check: {position: 'absolute', right: px(-6), bottom: px(-6)},
});
