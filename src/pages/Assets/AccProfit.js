/*
 * @Date: 2021-01-27 16:57:57
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-11 10:44:19
 * @Description: 累计收益
 */
import React, {useState, useEffect, useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import {Modal} from '../../components/Modal';
import {Chart} from '../../components/Chart';
import {areaChart} from '../Portfolio/components/ChartOption';
import EmptyTip from '../../components/EmptyTip';
const AccProfit = ({intelligent, poid}) => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [list, setList] = useState([]);
    const [period, setPeriod] = useState('this_year');
    const [chartData, setChartData] = useState({});
    const [activeSections, setActiveSections] = useState([0]);
    const [onlyAll, setOnlyAll] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    const init = useCallback(() => {
        if (!poid) {
            http.get('/profit/user_portfolios/20210101').then((res) => {
                if (res.code === '000000') {
                    setList(res.result.list || []);
                }
                setRefreshing(false);
            });
        }
    }, [poid]);
    // 获取累计收益图数据
    const getChart = useCallback(() => {
        const url = poid ? '/portfolio/profit/acc/20210101' : '/profit/user_acc/20210101';
        http.get(url, {
            period,
            poid,
        }).then((res) => {
            setShowEmpty(true);
            if (res.code === '000000') {
                if (res.result.subtabs?.length === 1) {
                    setOnlyAll(true);
                }
                setChartData(res.result);
            }
        });
    }, [period, poid]);
    // 下拉刷新回调
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        init();
        getChart();
    }, [init, getChart]);
    // 渲染收益更新说明头部
    const renderHeader = useCallback((section, index, isActive) => {
        return (
            <View style={[Style.flexBetween, {padding: Space.padding}]}>
                <Text style={styles.title}>{'收益更新说明'}</Text>
                <FontAwesome color={Colors.descColor} size={20} name={isActive ? 'angle-up' : 'angle-down'} />
            </View>
        );
    }, []);
    // 渲染收益更新表格
    const renderTable = useCallback(() => {
        return (
            <View style={[styles.tableWrap]}>
                <View style={[Style.flexRow, {backgroundColor: Colors.bgColor}]}>
                    <View style={[styles.borderRight, {flex: 1}]}>
                        <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'基金种类'}</Text>
                    </View>
                    <View style={[styles.borderRight, {flex: 1.5}]}>
                        <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'更新时间'}</Text>
                    </View>
                    <View style={[styles.borderRight, {flex: 1.76}]}>
                        <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'说明'}</Text>
                    </View>
                </View>
                <View style={Style.flexRow}>
                    <View style={{flex: 2.5}}>
                        <View style={Style.flexRow}>
                            <View style={[styles.borderRight, {flex: 1}]}>
                                <Text style={styles.tableCell}>{'普通基金'}</Text>
                            </View>
                            <View style={[styles.borderRight, {flex: 1.5}]}>
                                <Text style={styles.tableCell}>{'1个交易日（T+1）'}</Text>
                            </View>
                        </View>
                        <View style={[Style.flexRow, {backgroundColor: Colors.bgColor, height: text(41)}]}>
                            <View style={[styles.borderRight, {flex: 1}]}>
                                <Text style={styles.tableCell}>{'QDII基金'}</Text>
                            </View>
                            <View style={[styles.borderRight, {flex: 1.5}]}>
                                <Text style={styles.tableCell}>{'2个交易日（T+2）'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1.76}}>
                        <Text style={[styles.tableCell, styles.bigCell]}>
                            {'因基金净值更新时间不同，收益更新时，日收益、累计收益会产生变动'}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }, []);
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

    useEffect(() => {
        init();
        getChart();
    }, [init, getChart]);
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            scrollEventThrottle={1000}
            style={[styles.container, {transform: [{translateY: text(-1.5)}]}]}>
            <View style={styles.updateDesc}>
                <Accordion
                    activeSections={activeSections}
                    expandMultiple
                    onChange={(indexes) => setActiveSections(indexes)}
                    renderContent={renderTable}
                    renderHeader={renderHeader}
                    sections={[1]}
                    touchableComponent={TouchableOpacity}
                    touchableProps={{activeOpacity: 1}}
                />
            </View>

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
                    <View style={[styles.chart]}>
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
                                    0
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

                    <View style={[Style.flexRowCenter, {paddingTop: text(8), paddingBottom: text(20)}]}>
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
                    img={require('../../assets/img/emptyTip/noProfit.png')}
                    style={{paddingTop: text(28), paddingBottom: text(40)}}
                    text={'暂无累计收益数据'}
                    type={'part'}
                />
            ) : null}

            {list.length > 0 && chartData?.header?.length > 0 && (
                <View style={[styles.poHeader, Style.flexBetween]}>
                    {chartData?.header?.map((item, index) => (
                        <Text key={index} style={[styles.subTitle, {color: Colors.darkGrayColor}]}>
                            {item}
                        </Text>
                    ))}
                </View>
            )}
            {list.map((item, index) => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            styles.poItem,
                            Style.flexBetween,
                            {backgroundColor: index % 2 === 1 ? Colors.bgColor : '#fff'},
                        ]}
                        key={item + index}
                        onPress={() => {
                            // global.LogTool('click', 'portfolio', item.poid);
                            // jump(item.url);
                        }}>
                        <View style={Style.flexRow}>
                            <Text style={[styles.title, {fontWeight: '400', marginRight: text(4)}]}>{item.name}</Text>
                            {/* <FontAwesome color={Colors.darkGrayColor} size={20} name={'angle-right'} /> */}
                            {item.tag ? (
                                <View style={{borderRadius: text(2), backgroundColor: '#EFF5FF', marginLeft: text(8)}}>
                                    <Text style={styles.tag}>{item.tag}</Text>
                                </View>
                            ) : null}
                        </View>
                        <Text style={[styles.title, {fontWeight: '600', color: getColor(item.profit_acc)}]}>
                            {parseFloat(item.profit_acc?.replace(/,/g, '')) > 0
                                ? `+${item.profit_acc}`
                                : item.profit_acc}
                        </Text>
                    </TouchableOpacity>
                );
            })}
            <View style={{marginBottom: insets.bottom}} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    updateDesc: {
        marginVertical: text(12),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    tableWrap: {
        marginBottom: text(20),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        overflow: 'hidden',
    },
    borderRight: {
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tableCell: {
        paddingVertical: text(12),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
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

AccProfit.propTypes = {
    poid: PropTypes.string,
};
AccProfit.defaultProps = {
    poid: '',
};

export default AccProfit;
