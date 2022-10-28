/*
 * @Date: 2022/10/12 17:57
 * @Author: yanruifeng
 * @Description: 累计收益chart图表
 */
import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {px, px as text} from '../../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../../common/commonStyle';
import {Modal} from '../../../../components/Modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Chart} from '../../../../components/Chart';
import {areaChart} from '../../../Portfolio/components/ChartOption';
import EmptyTip from '../../../../components/EmptyTip';
import http from '../../../../services';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const AccEarningsCom = React.memo(({fund_code = '', intelligent, poid = ''}) => {
    const insets = useSafeAreaInsets();
    const [period, setPeriod] = useState('all');
    const [chartData, setChartData] = useState({});
    const [onlyAll, setOnlyAll] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    // 获取累计收益图数据
    const getChart = useCallback(() => {
        const url = poid ? '/portfolio/profit/acc/20210101' : '/profit/user_acc/20210101';
        http.get(url, {
            fund_code,
            period,
            poid,
            fr: 'profit_tool',
        }).then((res) => {
            setShowEmpty(true);
            if (res.code === '000000') {
                if (res.result.subtabs?.length === 1) {
                    setOnlyAll(true);
                }
                setChartData(res.result);
            }
        });
    }, [period]);
    useEffect(() => {
        getChart();
    }, [getChart]);
    // 获取日收益背景颜色
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.darkGrayColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) === 0) {
            return Colors.darkGrayColor;
        } else {
            return Colors.red;
        }
    }, []);
    return (
        <>
            {chartData.chart ? (
                <View style={[styles.chartContainer, poid ? {minHeight: text(430)} : {}]}>
                    <Text style={[styles.profitAcc, {color: getColor(chartData.profit_acc)}]}>
                        {chartData.profit_acc}
                    </Text>
                    <View style={[Style.flexRow, {justifyContent: 'center', marginTop: text(2)}]}>
                        <Text style={styles.chartTitle}>{chartData.title}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                global.LogTool('click', 'showTips');
                                Modal.show({content: chartData.desc});
                            }}>
                            <AntDesign
                                style={{marginLeft: text(4)}}
                                name={'questioncircleo'}
                                size={11}
                                color={Colors.darkGrayColor}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.chart, {position: 'absolute', top: -px(120), width: '100%'}]}>
                        {Object.keys(chartData).length > 0 && (
                            <Chart
                                initScript={areaChart(
                                    chartData.chart,
                                    [Colors.red],
                                    [Colors.red],
                                    undefined,
                                    text(224),
                                    {value: '累计收益(元)'},
                                    false,
                                    0,
                                    [0, 45, 12, 12]
                                )}
                                updateScript={(data) => `
                                    chart.clear();
                                    chart.source(${JSON.stringify(data)});
                                    chart.area({startOnZero: false})
                                        .position('date*value')
                                        .color(${JSON.stringify([Colors.red])})
                                        .shape('smooth')
                                        .animate({
                                            appear: {
                                            animation: 'groupWaveIn',
                                            duration: 500
                                            }
                                        });
                                    chart.line()
                                        .position('date*value')
                                        .color(${JSON.stringify([Colors.red])})
                                        .shape('smooth')
                                        .animate({
                                            appear: {
                                            animation: 'groupWaveIn',
                                            duration: 500
                                            }
                                        })
                                        .style({
                                            lineWidth: 1.5,
                                        });
                                    chart.render();
                                `}
                                data={chartData.chart}
                            />
                        )}
                    </View>

                    <View style={[Style.flexRowCenter, {paddingTop: text(8)}]}>
                        {chartData?.subtabs?.map((tab, index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={tab.val + index}
                                    onPress={() => {
                                        global.LogTool('click', tab.val);
                                        !onlyAll && setPeriod(tab.val);
                                    }}
                                    style={[
                                        Style.flexCenter,
                                        styles.subtab,
                                        period === tab.val || onlyAll ? styles.active : {},
                                    ]}>
                                    <Text
                                        style={[
                                            styles.tabText,
                                            {
                                                color:
                                                    period === tab.val || onlyAll
                                                        ? Colors.brandColor
                                                        : Colors.lightBlackColor,
                                            },
                                        ]}>
                                        {tab.key}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {intelligent && (
                        <View style={[styles.infoBox, {marginBottom: insets.bottom}]}>
                            <Text style={[styles.bigTitle, {marginBottom: text(4)}]}>
                                {chartData?.why_diff_desc?.title}
                            </Text>
                            <Text style={[styles.descContent]}>{chartData?.why_diff_desc?.desc}</Text>
                        </View>
                    )}
                </View>
            ) : showEmpty ? (
                <EmptyTip
                    img={require('../../../../assets/img/emptyTip/noProfit.png')}
                    style={{paddingTop: text(28), paddingBottom: text(40)}}
                    text={'暂无累计收益数据'}
                    type={'part'}
                />
            ) : null}
        </>
    );
});

AccEarningsCom.propTypes = {
    fund_code: PropTypes.string,
    poid: PropTypes.string,
};

export default AccEarningsCom;
const styles = StyleSheet.create({
    chartContainer: {
        paddingTop: text(14),
        backgroundColor: '#fff',
    },
    subTitle: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    profitAcc: {
        fontSize: text(26),
        lineHeight: text(30),
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
        textAlign: 'center',
    },
    chart: {
        height: text(224),
    },
    subtab: {
        marginHorizontal: text(7),
        paddingVertical: text(6),
        paddingHorizontal: text(12),
        borderRadius: text(16),
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    active: {
        backgroundColor: '#F1F6FF',
        borderColor: '#F1F6FF',
    },
    poHeader: {
        height: text(36),
        paddingLeft: text(12),
        paddingRight: Space.padding,
        backgroundColor: Colors.bgColor,
    },
    poItem: {
        height: text(45),
        paddingLeft: text(12),
        paddingRight: Space.padding,
    },
    tag: {
        paddingHorizontal: text(6),
        paddingVertical: text(2),
        borderRadius: text(2),
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.brandColor,
    },
    bigCell: {
        paddingVertical: text(6),
        paddingHorizontal: text(8),
        textAlign: 'justify',
        flex: 1,
    },
    chartTitle: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.descColor,
    },
    infoBox: {
        marginHorizontal: Space.marginAlign,
        paddingVertical: Space.padding,
        borderColor: Colors.borderColor,
        borderTopWidth: Space.borderWidth,
    },
    bigTitle: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    descContent: {
        fontSize: Font.textH3,
        lineHeight: text(22),
        color: Colors.descColor,
        textAlign: 'justify',
    },
});
