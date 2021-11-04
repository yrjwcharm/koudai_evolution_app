/*
 * @Date: 2021-11-04 11:19:55
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-11-04 21:08:27
 * @Description:定制理财计划
 */
import React, {useState, useCallback} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import {Chart} from '../../components/Chart';
import {baseAreaChart} from './components/chartOptions';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import http from '../../services';
import NumText from '../../components/NumText';
import FixedBtn from '../Portfolio/components/FixedBtn';
import {useFocusEffect} from '@react-navigation/core';
import FastImage from 'react-native-fast-image';
let timer_one = null;
let timer_two = null;
const PortfolioPlan = () => {
    const [active, setActive] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [data, setData] = useState(null);

    useFocusEffect(
        useCallback(() => {
            http.get('/questionnaire/chart/20211101?upid=170814&summary_id=312044').then((res) => {
                setData(res?.result);
            });
            return () => {
                timer_one && clearTimeout(timer_one);
                timer_two && clearTimeout(timer_two);
            };
        }, [])
    );
    const onload = () => {
        if (!data) return;
        setChartData(data?.chart?.benchmark_lines);
        timer_one = setTimeout(() => {
            setActive(1);
            setChartData((prev) => {
                return prev.concat(data?.chart?.portfolio_lines);
            });
        }, 3000);
        timer_two = setTimeout(() => {
            setActive(2);
            setChartData((prev) => {
                return prev.concat(data?.chart?.risk_lines);
            });
        }, 5000);
    };
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
                            text={data?.yield_info?.val}
                        />
                        <Text style={styles.radio_sty}>{data?.yield_info?.title}</Text>
                    </View>

                    <View style={[Style.flexCenter, styles.container_sty]}>
                        <Text
                            style={[
                                styles.amount_sty,
                                {fontSize: px(26), lineHeight: px(30), color: Colors.defaultColor},
                            ]}>
                            {data?.drawdown_info?.val}
                        </Text>
                        <Text style={[styles.radio_sty, {marginTop: px(6)}]}>{data?.drawdown_info?.title}</Text>
                    </View>
                </View>
                {data ? (
                    <View
                        style={{
                            height: 240,
                            paddingHorizontal: px(16),
                        }}>
                        <Chart
                            initScript={baseAreaChart(chartData, true, 2, deviceWidth - px(40), 10, {}, 220)}
                            data={chartData}
                            style={{width: '100%'}}
                            onLoadEnd={onload}
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            height: 240,
                        }}
                    />
                )}
                <View style={{paddingHorizontal: px(16)}}>
                    <Text style={styles.card_title}>{data?.tab_info?.title}</Text>
                    <View style={Style.flexBetween}>
                        {data?.tab_info?.items.map((item, index) => {
                            return (
                                <View style={styles.card} key={index}>
                                    <FastImage
                                        source={{uri: item.icon}}
                                        style={{width: px(32), height: px(32), marginBottom: px(6)}}
                                    />
                                    <Text style={styles.card_subtitle}>{item.title}</Text>
                                    <Text style={styles.card_desc}>{item.desc}</Text>
                                    {index <= active ? (
                                        <Icon
                                            name="checkmark-circle"
                                            size={px(18)}
                                            color={Colors.brandColor}
                                            style={styles.check}
                                        />
                                    ) : null}
                                </View>
                            );
                        })}
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
