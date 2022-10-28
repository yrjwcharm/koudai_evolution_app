/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-10 10:13:20
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors, Font} from '~/common/commonStyle';
import {Chart} from '~/components/Chart';
import {BottomModal} from '~/components/Modal';
import {baseAreaChart} from '~/pages/Portfolio/components/ChartOption';
import {px} from '~/utils/appUtil';
import {getChartData} from './services';
import Html from '~/components/RenderHtml';
import {cloneDeep} from 'lodash';

const ChartComponent = ({isActive, options}) => {
    const [data, setData] = useState();
    const [activeTab, setActiveTab] = useState(options.period);
    const [chartLabel, setChartLabel] = useState(null);
    const [tip, setTip] = useState({});

    const bottomModal = useRef();

    useEffect(() => {
        isActive && getData();
    }, [isActive, activeTab]);

    const getData = () => {
        getChartData({...options.params, period: activeTab}).then((res) => {
            if (res.code === '000000') {
                setData();
                setData(res.result);
                setChartLabel(res.result?.summary);
            }
        });
    };

    const onChartChange = useCallback((obj) => {
        const {items} = obj;

        const filterText = (text = '') => {
            return +text.slice(0, -1);
        };
        setChartLabel((prev) => {
            const next = cloneDeep(prev);
            next[0].val = items[0].title;
            next[1].val = items[0].value || '0%';
            next[2].val = items[1].value || '0%';
            next[1].color = filterText(items[0].value) > 0 ? '#E74949' : '#4BA471';
            next[2].color = filterText(items[1].value) > 0 ? '#E74949' : '#4BA471';
            return next;
        });
    }, []);
    const onChartHide = useCallback(() => {}, []);

    return (
        <View style={styles.container}>
            <View style={styles.panelWrap}>
                {chartLabel?.length ? (
                    <>
                        {chartLabel?.[0] ? (
                            <View style={styles.panelItem}>
                                <Text style={[styles.panelItemNumer, {color: '#121D3A'}]}>{chartLabel?.[0]?.val}</Text>
                                <View style={styles.panelItemDesc}>
                                    <Text style={styles.panelItemDescText}>{chartLabel?.[0]?.key}</Text>
                                </View>
                            </View>
                        ) : null}
                        {chartLabel?.[1] ? (
                            <View style={styles.panelItem}>
                                <Text style={[styles.panelItemNumer, {color: '#121D3A'}]}>{chartLabel?.[1]?.val}</Text>
                                <View style={styles.panelItemDesc}>
                                    <View style={[styles.panelItemLegend, {backgroundColor: '#E74949'}]} />
                                    <Text style={styles.panelItemDescText}>{chartLabel?.[1]?.key}</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setTip(chartLabel?.[1].tip);
                                            bottomModal.current.show();
                                        }}>
                                        <FastImage
                                            source={{
                                                uri:
                                                    'https://static.licaimofang.com/wp-content/uploads/2022/10/question.png',
                                            }}
                                            style={styles.panelItemHintIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                        {chartLabel?.[2] ? (
                            <View style={styles.panelItem}>
                                <Text style={[styles.panelItemNumer, {color: '#121D3A'}]}>{chartLabel?.[2]?.val}</Text>
                                <View style={styles.panelItemDesc}>
                                    <View style={[styles.panelItemLegend, {backgroundColor: '#E74949'}]} />
                                    <Text style={styles.panelItemDescText}>{chartLabel?.[2]?.key}</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setTip(chartLabel?.[2].tip);
                                            bottomModal.current.show();
                                        }}>
                                        <FastImage
                                            source={{
                                                uri:
                                                    'https://static.licaimofang.com/wp-content/uploads/2022/10/question.png',
                                            }}
                                            style={styles.panelItemHintIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                    </>
                ) : null}
            </View>
            <View style={styles.chartWrap}>
                {data?.chart?.length ? (
                    <Chart
                        initScript={baseAreaChart(
                            data.chart,
                            [Colors.red, Colors.lightBlackColor, 'transparent'],
                            ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                            false,
                            2,
                            px(318),
                            [10, 10, 10, 15],
                            null,
                            px(170),
                            null,
                            true
                        )}
                        onChange={onChartChange}
                        onHide={onChartHide}
                        style={{width: '100%'}}
                    />
                ) : null}
            </View>
            <View style={styles.tabsWrap}>
                {data?.chart_tabs?.length
                    ? data?.chart_tabs.map((item, idx) => (
                          <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                  setActiveTab(item.val);
                              }}
                              style={[styles.tabItem, {backgroundColor: activeTab === item.val ? '#DEE8FF' : '#fff'}]}
                              key={idx}>
                              <Text
                                  style={[styles.tabItemText, {color: activeTab === item.val ? '#0051CC' : '#545968'}]}>
                                  {item.key}
                              </Text>
                          </TouchableOpacity>
                      ))
                    : null}
            </View>
            <BottomModal ref={bottomModal} title={tip?.title}>
                <View style={[{padding: px(16)}]}>
                    <View>
                        {tip?.content?.key ? <Text style={styles.tipTitle}>{tip?.content.key}:</Text> : null}
                        <Html style={{lineHeight: px(18), fontSize: px(13)}} html={tip?.content?.val} />
                    </View>
                </View>
            </BottomModal>
        </View>
    );
};

export default ChartComponent;

const styles = StyleSheet.create({
    container: {},
    panelWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingHorizontal: px(5),
        height: px(43),
    },
    panelItem: {
        alignItems: 'center',
    },
    panelItemNumer: {
        fontSize: px(13),
        lineHeight: px(15),
        fontFamily: Font.numFontFamily,
    },
    panelItemDesc: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(3),
    },
    panelItemDescText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
    },
    panelItemLegend: {
        width: px(8),
        height: px(2),
        marginRight: px(4),
    },
    panelItemHintIcon: {
        width: px(14),
        height: px(14),
        marginLeft: px(2),
    },
    chartWrap: {
        height: px(170),
        backgroundColor: '#fff',
    },
    tabsWrap: {
        paddingBottom: px(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: px(45),
        backgroundColor: '#fff',
        paddingHorizontal: px(6),
    },
    tabItem: {
        borderRadius: px(20),
        paddingHorizontal: px(12),
        paddingVertical: px(6),
    },
    tabItemText: {
        fontSize: px(11),
        lineHeight: px(15),
    },
    tipTitle: {
        fontWeight: 'bold',
        lineHeight: px(20),
        fontSize: Font.textH2,
        marginBottom: px(4),
    },
});
