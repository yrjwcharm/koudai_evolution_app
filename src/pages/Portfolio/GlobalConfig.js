/*
 * @Date: 2021-01-23 10:29:49
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-09 16:22:37
 * @Description: 全球配置
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import http from '../../services';
import {px as text} from '../../utils/appUtil';
import {Style, Colors, Space, Font} from '../../common/commonStyle';
import {Chart} from '../../components/Chart';
import {basicPieChart} from './components/ChartOption';
import BottomDesc from '../../components/BottomDesc';
import FixedBtn from './components/FixedBtn';
import Loading from './components/PageLoading';

const RatioColor = [
    '#E1645C',
    '#6694F3',
    '#F8A840',
    '#CC8FDD',
    '#5DC162',
    '#C7AC6B',
    '#62C4C7',
    '#E97FAD',
    '#C2E07F',
    '#B1B4C5',
    '#E78B61',
    '#8683C9',
    '#EBDD69',
];

const GlobalConfig = ({navigation, route}) => {
    const [data, setData] = useState({});

    useEffect(() => {
        http.get('/portfolio/asset_deploy_detail/20211101', {
            upid: route.params?.upid,
        }).then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '全球配置'});
                setData({
                    ...res.result,
                    chart: res.result.deploy_list?.map((item) => ({
                        a: '1',
                        name: item.name,
                        percent: (item.ratio * 100).toFixed(2) * 1,
                        color: item.color,
                    })),
                });
            }
        });
    }, [navigation, route]);

    return (
        <>
            {Object.keys(data).length > 0 ? (
                <ScrollView bounces={false} style={styles.container} scrollIndicatorInsets={{right: 1}}>
                    <View style={styles.topPart}>
                        {data?.chart?.length > 0 && (
                            <View style={{height: text(170)}}>
                                <Chart
                                    initScript={basicPieChart(
                                        data?.chart,
                                        data?.chart?.map((item) => item.color),
                                        text(170)
                                    )}
                                    data={data?.chart}
                                />
                            </View>
                        )}
                        <View
                            style={[
                                Style.flexRow,
                                {flexWrap: 'wrap', paddingLeft: Space.padding, marginBottom: text(8)},
                            ]}>
                            {data?.chart?.map?.((item, index) => {
                                return (
                                    <View
                                        style={[Style.flexRow, {width: '50%', marginBottom: text(8)}]}
                                        key={item + index}>
                                        <View
                                            style={[styles.circle, {backgroundColor: item.color || RatioColor[index]}]}
                                        />
                                        <Text style={styles.legendName}>{item.name}</Text>
                                        <Text style={styles.legendVal}>{(item.percent * 1).toFixed(2)}%</Text>
                                    </View>
                                );
                            })}
                        </View>
                        {data?.deploy_title && data?.deploy_content ? (
                            <View style={styles.introContainer}>
                                <Text style={styles.intro_content}>
                                    {data?.deploy_title}
                                    {data?.deploy_content}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                    {data?.deploy_list?.map?.((item, index) => {
                        return (
                            <View key={item + index} style={styles.assetBox}>
                                <View style={Style.flexBetween}>
                                    <View style={Style.flexRow}>
                                        <View
                                            style={[styles.circle, {backgroundColor: item.color || RatioColor[index]}]}
                                        />
                                        <Text style={styles.assetName}>{item.name}</Text>
                                    </View>
                                    <Text style={styles.ratioSty}>
                                        <Text style={{fontFamily: Font.numFontFamily}}>
                                            {(item.ratio * 100).toFixed(2)}
                                        </Text>
                                        %
                                    </Text>
                                </View>
                                <View style={styles.divider} />
                                <Text style={[styles.intro_content, {fontSize: Font.textH3}]}>
                                    {item.title}
                                    {item.content}
                                </Text>
                            </View>
                        );
                    })}
                    <BottomDesc />
                </ScrollView>
            ) : (
                <Loading />
            )}
            {Object.keys(data).length > 0 && data.btns && <FixedBtn btns={data.btns} />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        paddingHorizontal: Space.marginAlign,
        paddingBottom: Space.marginVertical,
        backgroundColor: '#fff',
    },
    legendName: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
        width: text(86),
    },
    legendVal: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
        fontFamily: Font.numFontFamily,
    },
    introContainer: {
        marginTop: text(6),
        padding: text(12),
        paddingBottom: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    intro_content: {
        fontSize: text(13),
        lineHeight: text(19),
        color: Colors.descColor,
    },
    circle: {
        width: text(10),
        height: text(10),
        borderRadius: text(5),
        marginRight: text(8),
    },
    assetBox: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    assetName: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    ratioSty: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    divider: {
        marginVertical: text(12),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
});

export default GlobalConfig;
