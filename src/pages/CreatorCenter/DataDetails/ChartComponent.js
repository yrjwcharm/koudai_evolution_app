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
    const [activeTab, setActiveTab] = useState(0);
    const [chartLabel, setChartLabel] = useState(null);
    const [tip, setTip] = useState({});

    const chartLabelDefaultRef = useRef({});
    const bottomModal = useRef();

    useEffect(() => {
        isActive && getData();
    }, [isActive, activeTab]);

    const getData = () => {
        getChartData(options).then((res) => {
            if (res.code === '000000') {
                setData();
                setData(res.result);
                setChartLabel(res.result?.yield_info?.label);
                chartLabelDefaultRef.current = res.result?.yield_info?.label;
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
    const onChartHide = useCallback(() => {
        setChartLabel(chartLabelDefaultRef.current);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.panelWrap}>
                {chartLabel?.length ? (
                    <>
                        <View style={styles.panelItem}>
                            <Text style={[styles.panelItemNumer, {color: '#121D3A'}]}>2022-03-22</Text>
                            <View style={styles.panelItemDesc}>
                                <Text style={styles.panelItemDescText}>时间</Text>
                            </View>
                        </View>
                        <View style={styles.panelItem}>
                            <Text style={[styles.panelItemNumer, {color: '#121D3A'}]}>124,727,804</Text>
                            <View style={styles.panelItemDesc}>
                                <View style={[styles.panelItemLegend, {backgroundColor: '#E74949'}]} />
                                <Text style={styles.panelItemDescText}>单日新增销量</Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        // setTip({});
                                        // bottomModal.current.show();
                                    }}>
                                    <FastImage
                                        source={{
                                            uri:
                                                'http://static.licaimofang.com/wp-content/uploads/2022/10/question.png',
                                        }}
                                        style={styles.panelItemHintIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.panelItem}>
                            <Text style={[styles.panelItemNumer, {color: '#121D3A'}]}>462,628,05</Text>
                            <View style={styles.panelItemDesc}>
                                <View style={[styles.panelItemLegend, {backgroundColor: '#E74949'}]} />
                                <Text style={styles.panelItemDescText}>单日新增赎回</Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        // setTip({});
                                        // bottomModal.current.show();
                                    }}>
                                    <FastImage
                                        source={{
                                            uri:
                                                'http://static.licaimofang.com/wp-content/uploads/2022/10/question.png',
                                        }}
                                        style={styles.panelItemHintIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                ) : null}
            </View>
            <View style={styles.chartWrap}>
                {data?.yield_info?.chart?.length ? (
                    <Chart
                        initScript={baseAreaChart(
                            data.yield_info.chart,
                            [Colors.red, Colors.lightBlackColor, 'transparent'],
                            ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                            true,
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
                {data?.yield_info?.sub_tabs?.length
                    ? [1, 2, 3, 4, 5].map((item, idx) => (
                          <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                  setActiveTab(idx);
                              }}
                              style={[styles.tabItem, {backgroundColor: activeTab === idx ? '#DEE8FF' : '#fff'}]}
                              key={idx}>
                              <Text style={[styles.tabItemText, {color: activeTab === idx ? '#0051CC' : '#545968'}]}>
                                  近1月
                              </Text>
                          </TouchableOpacity>
                      ))
                    : null}
            </View>
            <BottomModal ref={bottomModal} title={tip?.title}>
                <View style={[{padding: px(16)}]}>
                    {tip?.content?.map?.((item, index) => {
                        return (
                            <View key={item + index} style={{marginTop: index === 0 ? 0 : px(16)}}>
                                {item.key ? <Text style={styles.tipTitle}>{item.key}:</Text> : null}
                                <Html style={{lineHeight: px(18), fontSize: px(13)}} html={item.val} />
                            </View>
                        );
                    })}
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
});
