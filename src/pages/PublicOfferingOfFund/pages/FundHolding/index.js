/*
 * @Date: 2022-08-10 10:56:46
 * @Description: 基金持仓
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {Chart} from '~/components/Chart';
import Empty from '~/components/EmptyTip';
import HTML from '~/components/RenderHtml';
import NumText from '~/components/NumText';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {isIphoneX, px} from '~/utils/appUtil';
import {getPageData} from './services';

const pieChart = (data) => `
(function(){
  const chart = new F2.Chart({
    id: 'chart',
    pixelRatio: window.devicePixelRatio,
    padding: [0, 'auto' ],
  });
  chart.source(${JSON.stringify(data)},{
    ratio: {
      formatter: function formatter(val) {
        return (val * 100).toFixed(2)+ '%';
      }
    }
  });
  chart.tooltip(false);
  chart.legend(false);
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.65,
    radius: 0.75
  });
  chart.axis(false);
  chart.interval().position('1*ratio').color('color', (color) => color).adjust('stack').style({
    lineWidth: 0.5,
    stroke: '#fff',
    lineJoin: 'round',
    lineCap: 'round'
  }).animate({
    appear: {
      duration: 600,
      easing: 'bounceOut'
    }
  });
  chart.pieLabel({
    activeShape: false,
    lineStyle:{
        opacity:0
    },
    anchorStyle:{
        opacity:0
    }
  });
  chart.render();
})()
`;

const Index = ({navigation, route}) => {
    const {fund_code} = route.params || {};
    const [data, setData] = useState({});
    const {asset_group, stock_group} = data;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPageData({fund_code})
            .then((res) => {
                if (res.code === '000000') {
                    const {title = '基金持仓'} = res.result;
                    navigation.setOptions({title});
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <Loading />
            ) : Object.keys(data).length > 0 ? (
                <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                    {asset_group ? (
                        <View style={styles.topPart}>
                            <View style={[Style.flexBetween, {paddingHorizontal: Space.padding}]}>
                                <Text style={styles.title}>{asset_group.title}</Text>
                                <Text style={styles.subTitle}>{asset_group.fresh_time}</Text>
                            </View>
                            <View style={[Style.flexRow, {minHeight: px(150)}]}>
                                <View style={{flex: 5}}>
                                    <Chart initScript={pieChart(asset_group.items)} />
                                </View>
                                <View style={{flex: 4, paddingVertical: px(20)}}>
                                    {asset_group.items?.map?.((item, index) => {
                                        const {color, name, percent} = item;
                                        return (
                                            <View
                                                key={name + index}
                                                style={[Style.flexRow, {marginTop: index === 0 ? 0 : px(12)}]}>
                                                <View style={[Style.flexRow, {flex: 1}]}>
                                                    <View style={[styles.dot, {backgroundColor: color}]} />
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[styles.subTitle, {color: Colors.descColor}]}>
                                                        {name}
                                                    </Text>
                                                </View>
                                                <Text style={styles.percent}>{percent}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    ) : null}
                    {stock_group ? (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.bottomPart}>
                                <View style={Style.flexBetween}>
                                    <Text style={styles.title}>{stock_group.title}</Text>
                                    <Text style={styles.subTitle}>{stock_group.fresh_time}</Text>
                                </View>
                                <View style={[Style.flexRow, styles.tableHeader]}>
                                    {Object.values(stock_group.header || {}).map((h, i) => {
                                        return (
                                            <Text
                                                key={h + i}
                                                style={[
                                                    styles.tableText,
                                                    i === 0 ? {width: px(154)} : {flex: 1, textAlign: 'right'},
                                                ]}>
                                                {h}
                                            </Text>
                                        );
                                    })}
                                </View>
                                {stock_group.items?.map?.((row, i) => {
                                    const {inc, name, ratio} = row;
                                    return (
                                        <View
                                            key={name + i}
                                            style={[Style.flexRow, {marginTop: i === 0 ? 0 : Space.marginVertical}]}>
                                            <View style={{width: px(154)}}>
                                                <HTML
                                                    html={name}
                                                    numberOfLines={1}
                                                    style={{...styles.tableText, color: Colors.defaultColor}}
                                                />
                                            </View>
                                            <NumText
                                                style={{...styles.tableText, ...styles.numText}}
                                                text={inc}
                                                type={inc === '--' ? 2 : 1}
                                            />
                                            <Text style={[styles.tableText, styles.numText]}>{ratio}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </>
                    ) : null}
                </ScrollView>
            ) : (
                <Empty />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topPart: {
        paddingTop: Space.padding,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightGrayColor,
    },
    dot: {
        marginRight: px(12),
        borderRadius: px(12),
        width: px(6),
        height: px(6),
    },
    percent: {
        flex: 1,
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
        fontFamily: Font.numFontFamily,
    },
    divider: {
        height: px(10),
        backgroundColor: Colors.bgColor,
    },
    bottomPart: {
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 : Space.padding,
    },
    tableHeader: {
        marginTop: px(12),
        paddingVertical: Space.padding,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tableText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    numText: {
        flex: 1,
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        textAlign: 'right',
    },
});

export default Index;
