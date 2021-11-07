/*
 * @Date: 2021-11-04 11:19:55
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-06 17:16:59
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
import {useFocusEffect} from '@react-navigation/core';
import FastImage from 'react-native-fast-image';
import { FixedButton } from '../../components/Button';
import { useJump } from '../../components/hooks';
let timer_one = null;
const PortfolioPlan = ({navigation,route}) => {
    const [chartData, setChartData] = useState([]);
    const [data, setData] = useState(null);
    const [loading,setLoading]=useState(false)
    const jump= useJump()
    useFocusEffect(
        useCallback(() => {
            http.get('/questionnaire/chart/20211101',{upid:route?.params?.upid,summary_id:route?.params?.summary_id}).then((res) => {
                setData(res?.result);
                navigation.setOptions({title: res.result?.title});
            });

            return () => {
                timer_one && clearTimeout(timer_one);
            };
        }, [navigation])
    );
    const onload = () => {
        if (!data) return;
        setLoading(true)
        setChartData(data?.chart?.portfolio_lines);
        timer_one = setTimeout(() => {
            setChartData((prev) => {
                return prev.concat(data?.chart?.risk_lines);
            });
        }, 2000);
       
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
                    <Animatable.View
                    animation='fadeIn'
                        style={{
                            height: 240,
                            paddingHorizontal: px(16),
                        }}>
                        <Chart
                            initScript={baseAreaChart(chartData, true, 2, deviceWidth - px(40), 10, data?.tag_position?.risk_line, 220)}
                            data={chartData}
                            style={{width: '100%'}}
                            onLoadEnd={onload}
                        />
                    </Animatable.View>
                ) : (
                    <View
                        style={{
                            height: 240,
                        }}
                    />
                )}
                {
                    loading&&
                <Animatable.View animation='fadeInUp' style={{paddingHorizontal: px(16)}}>
                    <Text style={styles.card_title}>{data?.tab_info?.title}</Text>
                    <View style={Style.flexBetween}>
                        {data?.tab_info?.items.map((item, index) => {
                            return (
                                <View style={styles.card} key={index}>
                                    <FastImage
                                        source={{uri: item.icon_selected}}
                                        style={{width: px(32), height: px(32), marginBottom: px(6)}}
                                    />
                                    <Text style={styles.card_subtitle}>{item.title}</Text>
                                    <Text style={styles.card_desc}>{item.desc}</Text>
                                        <Icon
                                            name="checkmark-circle"
                                            size={px(18)}
                                            color={Colors.brandColor}
                                            style={styles.check}
                                        />
                                </View>
                            );
                        })}
                    </View>
                </Animatable.View>
                }
            </ScrollView>
            {data?.button&&loading && <FixedButton title={data?.button?.title} onPress={()=>{
                jump(data?.button?.url,'replace')
            }}/>}
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
        borderColor: Colors.brandColor,
        borderWidth: px(0.5),
        paddingHorizontal: px(12),
        paddingVertical: px(16),
        alignItems: 'center',
    },
    card_subtitle: {
        fontSize: px(14),
        lineHeight: px(20),
        marginBottom: px(8),
        fontWeight:'700',
        color:Colors.brandColor,
    },
    card_desc: {
        fontSize: px(12),
        lineHeight: px(17),
        textAlign: 'center',
        color:Colors.brandColor,
    },
    check: {position: 'absolute', right: px(-6), bottom: px(-6)},
});
