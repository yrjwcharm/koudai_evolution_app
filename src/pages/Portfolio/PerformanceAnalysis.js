/*
 * @Date: 2021-04-26 14:10:24
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-16 15:06:00
 * @Description: 业绩解析
 */
import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, deviceWidth} from '../../utils/appUtil';
import http from '../../services';
import {Chart} from '../../components/Chart';
import Html from '../../components/RenderHtml';
import FixedBtn from './components/FixedBtn';
import Dot from './components/Dot';
import Empty from '../../components/EmptyTip';
import {dodgeColumn} from './components/ChartOption';

const Table = ({data}) => {
    return (
        <View style={[Style.flexRow, {marginTop: text(20)}]}>
            <View style={styles.column}>
                <View style={[Style.flexCenter, styles.cell]}>
                    <Text style={[styles.cellText, styles.thText]}>{data?.th[0] + ' '}</Text>
                </View>
                {data?.tr_list?.map((item, index) => {
                    return (
                        <View
                            key={`column1${index}`}
                            style={[
                                Style.flexCenter,
                                styles.cell,
                                {backgroundColor: index % 2 === 0 ? '#fff' : Colors.bgColor},
                            ]}>
                            <Text style={styles.cellText}>{item[0]}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={[styles.column, {flex: 1}, styles.tabelShadow]}>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    colors={['rgba(253, 164, 164, 0.48)', 'rgba(255, 230, 228, 0.48)']}
                    style={[Style.flexRowCenter, styles.cell, {paddingTop: Space.padding}]}>
                    <Dot bgColor={'rgba(250, 54, 65, 0.15)'} color={Colors.red} />
                    <Text style={[styles.cellText, styles.thText, {marginLeft: text(4)}]}>{data?.th[1]}</Text>
                </LinearGradient>
                {data?.tr_list?.map((item, index, arr) => {
                    return (
                        <View
                            key={`column2${index}`}
                            style={[
                                Style.flexCenter,
                                styles.cell,
                                {
                                    backgroundColor: index % 2 === 0 ? '#fff' : 'rgba(255, 230, 228, 0.3)',
                                    paddingBottom: index === arr.length - 1 ? Space.padding : text(12),
                                },
                            ]}>
                            <Html style={{...styles.cellText, ...styles.numText}} html={item[1]} />
                        </View>
                    );
                })}
            </View>
            <View style={styles.column}>
                <View style={[Style.flexRowCenter, styles.cell]}>
                    <Dot bgColor={'rgba(84, 89, 104, 0.2)'} color={Colors.lightBlackColor} />
                    <Text style={[styles.cellText, styles.thText, {marginLeft: text(4)}]}>{data?.th[2]}</Text>
                </View>
                {data?.tr_list?.map((item, index) => {
                    return (
                        <View
                            key={`column3${index}`}
                            style={[
                                Style.flexCenter,
                                styles.cell,
                                {backgroundColor: index % 2 === 0 ? '#fff' : Colors.bgColor},
                            ]}>
                            <Html style={{...styles.cellText, ...styles.numText}} html={item[2]} />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
const baseAreaChart = (
    data,
    colors = [
        '#E1645C',
        '#5687EB',
        '#ECB351',
        '#CC8FDD',
        '#E4C084',
        '#5DC162',
        '#DE79AE',
        '#967DF2',
        '#62B4C7',
        '#B8D27E',
        '#F18D60',
        '#5E71E8',
        '#EBDD69',
    ],
    areaColors = [Colors.red, Colors.lightBlackColor],
    percent = true,
    tofixed = 2,
    max = null
) => `
(function(){
    chart = new F2.Chart({
        id: 'chart',
        pixelRatio: window.devicePixelRatio,
        width: ${deviceWidth},
        height: ${text(160)},
        appendPadding: [15, 61, 5, 5],
    });
    chart.source(${JSON.stringify(data)});
    chart.scale('date', {
        type: 'timeCat',
        tickCount: 3,
        range: [0, 1]
    });
    chart.scale('value', {
        tickCount: 5,
        max: ${JSON.stringify(max)},
        formatter: (value) => {
            return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
        }
    });
    chart.axis('date', {
        label: function label(text, index, total) {
            const textCfg = {};
            if (index === 0) {
                textCfg.textAlign = 'left';
            } else if (index === total - 1 ) {
                textCfg.textAlign = 'right';
            }
            textCfg.fontFamily = 'DINAlternate-Bold';
            return textCfg;
        }
    });
    chart.axis('value', {
        label: function label(text) {
            const cfg = {};
            cfg.text = Math.abs(parseFloat(text)) < 1 && Math.abs(parseFloat(text)) > 0 ? parseFloat(text).toFixed(2) + "%" : parseFloat(text) + "%";
            cfg.fontFamily = 'DINAlternate-Bold';
            return cfg;
        }
    });
    chart.legend(false);
    chart.tooltip(false);
    chart.area({startOnZero: false})
        .position('date*value')
        .shape('smooth')
        .color('type', ${JSON.stringify(areaColors)})
        .animate({
            appear: {
                animation: 'groupWaveIn',
                duration: 500
            }
        });
    chart.line()
        .position('date*value')
        .shape('smooth')
        .color('type', ${JSON.stringify(colors)})
        .animate({
            appear: {
                animation: 'groupWaveIn',
                duration: 500
            }
        })
        .style({
            lineWidth: 1
        });
    chart.render();
})();
`;
const area = (source, percent = true, tofixed = 2) => `
(function(){
  chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    height: ${text(160)},
    width: ${deviceWidth},
    appendPadding: [5, 61, 15, 5]
  });
  
  chart.source(${JSON.stringify(source)}, {
    date: {
      range: [ 0, 1 ],
      type: 'timeCat',
      tickCount: 3,
    },
    value: {
      tickCount: 5,
      formatter: (value) => {
        return ${percent ? '(value * 100).toFixed(' + tofixed + ') + "%"' : 'value.toFixed(' + tofixed + ')'};
      }
    }
  });
  chart.tooltip({
    showCrosshairs: false,
    custom: true, // 自定义 tooltip 内容框
    showTooltipMarker: false,
  });
  chart.axis('date', false);
  chart.axis('value', {
    label: function label(text) {
        const cfg = {};
        cfg.text = Math.abs(parseFloat(text)) < 1 && Math.abs(parseFloat(text)) > 0 ? parseFloat(text).toFixed(2) + "%" : parseFloat(text) + "%";
        cfg.fontFamily = 'DINAlternate-Bold';
        return cfg;
    }
  });
chart.legend(false);
  chart.line()
    .position('date*value')
    .color('type', ${JSON.stringify([Colors.red, Colors.lightBlackColor, Colors.defaultColor])})
    .shape('smooth')
    .style('type', {
        lineWidth: 1,
        lineDash(val) {
            if (val === '最大回撤线') return [5, 5, 5];
            else return [];
        }
    });
  chart.area()
    .position('date*value')
    .color('type', ${JSON.stringify([Colors.red, Colors.lightBlackColor, 'transparent'])})
    .shape('smooth');
  chart.render();
})();
`;

const PerformanceAnalysis = ({navigation, route}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [showEmpty, setShowEmpty] = useState(false);
    const [tabs, setTabs] = useState({});
    const [page, setPage] = useState(route.params?.page || 0);
    const offsetTopRef = useRef({});
    const scrollRef = useRef(null);

    const onScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        if (y >= offsetTopRef.current[1]?.y && y < offsetTopRef.current[2]?.y) {
            setPage(1);
        } else if (y >= offsetTopRef.current[2]?.y) {
            setPage(2);
        } else {
            setPage(0);
        }
    };

    useFocusEffect(
        useCallback(() => {
            http.get('/portfolio/yield_parse/20210426', {
                upid: route.params?.upid,
            })
                .then((res) => {
                    if (res.code === '000000') {
                        setData(res.result || {});
                        setTabs(res.result?.tabs || {});
                        setShowEmpty(res.result ? false : true);
                    } else {
                        setShowEmpty(true);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setShowEmpty(true);
                });
        }, [route])
    );

    return loading ? (
        <View style={[Style.flexCenter, {flex: 1, backgroundColor: '#fff', borderColor: '#fff', borderWidth: 0.5}]}>
            <ActivityIndicator color={Colors.brandColor} />
        </View>
    ) : (
        <View style={styles.container}>
            <View style={[Style.flexRow, {height: text(44)}]}>
                {Object.values(tabs).map((tab, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() =>
                                scrollRef.current?.scrollTo({
                                    x: 0,
                                    y: offsetTopRef.current[index]?.y + 1,
                                    animated: true,
                                })
                            }
                            activeOpacity={1}
                            key={tab}
                            style={[Style.flexCenter, styles.tabItem]}>
                            <Text style={[styles.tabText, page === index ? styles.active : {}]}>{tab}</Text>
                            {page === index && <View style={styles.underline} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={{borderTopWidth: Space.borderWidth, borderColor: Colors.borderColor, marginTop: text(1)}} />
            <ScrollView
                onScroll={onScroll}
                ref={scrollRef}
                scrollEventThrottle={1}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {Object.keys(tabs).map((item, index) => {
                    return (
                        <View
                            onLayout={(e) => (offsetTopRef.current[index] = e.nativeEvent.layout)}
                            key={data[item]?.title}>
                            <View style={styles.partBox}>
                                <View style={Style.flexRow}>
                                    <Text style={styles.partTitle}>{data[item]?.title}</Text>
                                    <Text style={styles.titleTag}>{data[item]?.tag}</Text>
                                </View>
                                {data[item]?.desc?.map((d, i) => {
                                    return (
                                        <Text key={d} style={[styles.desc, i === 0 ? {marginTop: text(12)} : {}]}>
                                            {d}
                                        </Text>
                                    );
                                })}
                                {data[item]?.table && <Table data={data[item]?.table} />}
                                {index === 0 && (
                                    <View style={{minHeight: text(320)}}>
                                        <View style={[Style.flexRow, {height: text(160)}]}>
                                            {data[item]?.drawback_chart ? (
                                                <>
                                                    <Chart
                                                        initScript={baseAreaChart(
                                                            data[item]?.yield_chart,
                                                            [Colors.red, Colors.lightBlackColor],
                                                            ['l(90) 0:#E74949 1:#fff', 'transparent']
                                                        )}
                                                        data={data[item]?.yield_chart}
                                                    />
                                                    <Text style={styles.chartTitle}>{'收益'}</Text>
                                                </>
                                            ) : (
                                                <Empty
                                                    img={require('../../assets/img/emptyTip/noProfit.png')}
                                                    style={{paddingVertical: text(40)}}
                                                    text={'暂无收益数据'}
                                                    type={'part'}
                                                />
                                            )}
                                        </View>
                                        <View style={[Style.flexRow, {height: text(160)}]}>
                                            {data[item]?.drawback_chart ? (
                                                <>
                                                    <Chart
                                                        initScript={area(data[item]?.drawback_chart)}
                                                        data={data[item]?.drawback_chart}
                                                    />
                                                    <Text style={styles.chartTitle}>{'回撤'}</Text>
                                                </>
                                            ) : (
                                                <Empty
                                                    img={require('../../assets/img/emptyTip/noProfit.png')}
                                                    style={{paddingVertical: text(40)}}
                                                    text={'暂无回撤数据'}
                                                    type={'part'}
                                                />
                                            )}
                                        </View>
                                        <View style={[Style.flexRow, {flexWrap: 'wrap', marginTop: text(4)}]}>
                                            {data[item]?.label?.map((label, idx, arr) => {
                                                return (
                                                    <View key={label + idx} style={[Style.flexRowCenter, {flex: 1}]}>
                                                        {idx !== arr.length - 1 ? (
                                                            <View
                                                                style={{
                                                                    width: text(8),
                                                                    height: text(8),
                                                                    backgroundColor: label.color,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Text
                                                                style={{
                                                                    color: label.color,
                                                                    fontSize: Font.textH3,
                                                                }}>
                                                                ---
                                                            </Text>
                                                        )}
                                                        <Text
                                                            style={{
                                                                ...styles.columnText,
                                                                color: Colors.defaultColor,
                                                                marginLeft: text(4),
                                                            }}>
                                                            {label.key}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                )}
                                {index === 2 &&
                                    (data[item]?.chart ? (
                                        <>
                                            <Text
                                                style={[
                                                    styles.cellText,
                                                    styles.thText,
                                                    {
                                                        textAlign: 'center',
                                                        marginTop: Space.marginVertical,
                                                    },
                                                ]}>
                                                {data[item]?.sub_title}
                                            </Text>
                                            <View
                                                style={[
                                                    Style.flexRowCenter,
                                                    {paddingTop: text(8), paddingBottom: Space.padding},
                                                ]}>
                                                <View style={Style.flexCenter}>
                                                    <Text style={[styles.profit, {color: Colors.red}]}>
                                                        {data[item]?.chart.label[0]?.val}
                                                    </Text>
                                                    <View style={[Style.flexRow, {marginTop: text(8)}]}>
                                                        <Dot bgColor={'rgba(250, 54, 65, 0.15)'} color={Colors.red} />
                                                        <Text style={[styles.cellText, {marginLeft: text(4)}]}>
                                                            {data[item]?.chart.label[0]?.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.vs}>{'VS'}</Text>
                                                <View style={Style.flexCenter}>
                                                    <Text style={styles.profit}>{data[item]?.chart.label[1]?.val}</Text>
                                                    <View style={[Style.flexRow, {marginTop: text(8)}]}>
                                                        <Dot
                                                            bgColor={'rgba(84, 89, 104, 0.2)'}
                                                            color={Colors.lightBlackColor}
                                                        />
                                                        <Text style={[styles.cellText, {marginLeft: text(4)}]}>
                                                            {data[item]?.chart.label[1]?.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{minHeight: text(180)}}>
                                                <Chart
                                                    initScript={dodgeColumn(
                                                        data[item]?.chart.data,
                                                        [Colors.red, Colors.lightBlackColor],
                                                        deviceWidth - text(32),
                                                        [10, 5, 45, 0],
                                                        20,
                                                        0.5,
                                                        true,
                                                        false
                                                    )}
                                                />
                                            </View>
                                        </>
                                    ) : (
                                        <Empty
                                            img={require('../../assets/img/emptyTip/noProfit.png')}
                                            style={{paddingVertical: text(40)}}
                                            text={'暂无累计收益数据'}
                                            type={'part'}
                                        />
                                    ))}
                                {data[item]?.tip ? (
                                    <View style={styles.conclusionBox}>
                                        <Image
                                            source={require('../../assets/img/detail/quot.png')}
                                            style={styles.quot}
                                        />
                                        <View style={{flex: 1}}>
                                            <Html style={styles.conclusion} html={data[item]?.tip} />
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                            <View style={styles.gap} />
                        </View>
                    );
                })}
                <View style={styles.partBox}>
                    <View style={Style.flexRow}>
                        <Text style={styles.partTitle}>{data.long_portfolio?.title}</Text>
                    </View>
                    {data.long_portfolio?.desc?.map((d, i) => {
                        return (
                            <Text key={d} style={[styles.desc, i === 0 ? {marginTop: text(12)} : {}]}>
                                {d}
                            </Text>
                        );
                    })}
                    <View style={styles.longPortfolioDesc}>
                        <Image source={{uri: data.long_portfolio?.image}} style={styles.image} />
                        {data.long_portfolio?.text?.map((t, i) => {
                            return (
                                <View
                                    key={t}
                                    style={{marginTop: i === 0 ? 0 : text(4), marginHorizontal: Space.marginAlign}}>
                                    <Html html={t} style={styles.conclusion} />
                                </View>
                            );
                        })}
                    </View>
                </View>
                {/* <View style={{height: text(427)}} /> */}
                {showEmpty && <Empty text={'暂无数据'} />}
            </ScrollView>
            {data?.button && <FixedBtn btns={data.button} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabItem: {
        flex: 1,
        height: '100%',
        position: 'relative',
    },
    tabText: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: 'rgba(16, 26, 48, 0.65)',
        paddingTop: text(12),
    },
    active: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.brandColor,
        fontWeight: '600',
    },
    underline: {
        marginTop: text(5),
        borderRadius: text(2),
        width: text(16),
        height: text(2),
        backgroundColor: Colors.brandColor,
    },
    partBox: {
        paddingVertical: text(20),
        paddingHorizontal: Space.padding,
    },
    partTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        marginLeft: text(2),
        marginRight: text(8),
    },
    titleTag: {
        paddingVertical: text(1),
        paddingHorizontal: text(5),
        borderRadius: text(2),
        backgroundColor: '#EB7121',
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#fff',
        fontWeight: '500',
    },
    conclusionBox: {
        marginTop: text(20),
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        flexDirection: 'row',
        backgroundColor: '#F0F6FD',
    },
    quot: {
        width: text(16),
        height: text(14),
        marginRight: text(8),
    },
    conclusion: {
        fontSize: text(13),
        lineHeight: text(20),
        color: Colors.defaultColor,
        textAlign: 'justify',
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightBlackColor,
        marginTop: text(8),
    },
    column: {
        minWidth: text(98),
        backgroundColor: Colors.bgColor,
    },
    cell: {
        padding: text(12),
    },
    cellText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
    thText: {
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    numText: {
        fontSize: Font.textH2,
        fontFamily: Font.numFontFamily,
    },
    tabelShadow: {
        borderRadius: text(4),
        overflow: 'hidden',
        shadowColor: '#FFE6E4',
        shadowOffset: {h: 10, w: 10},
        shadowRadius: 10,
        shadowOpacity: 1,
    },
    chartTitle: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.descColor,
        width: Font.textSm,
        marginLeft: text(12),
    },
    profit: {
        fontSize: text(24),
        lineHeight: text(28),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    vs: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        paddingHorizontal: text(42),
    },
    longPortfolioDesc: {
        marginVertical: text(20),
        paddingBottom: text(20),
        borderRadius: Space.borderRadius,
        backgroundColor: '#F0F6FD',
    },
    image: {
        marginTop: text(-12),
        width: deviceWidth - 2 * Space.marginAlign,
        height: text(119),
    },
    gap: {
        height: text(10),
        backgroundColor: Colors.bgColor,
    },
    columnText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
        textAlign: 'center',
    },
});

export default PerformanceAnalysis;
