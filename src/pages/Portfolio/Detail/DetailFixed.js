/*
 * @Author: xjh
 * @Date: 2021-01-27 16:21:38
 * @Description:低估值智能定投
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-18 14:01:56
 */

import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {baseAreaChart} from '../components/ChartOption';
import FixedBtn from '../components/FixedBtn';
import Header from '../../../components/NavBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '../../../components/hooks';
export default function DetailAccount({route}) {
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y1');
    const [chartData, setChartData] = useState();
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const [type, setType] = useState(1);
    const jump = useJump();
    const changeTab = (period, type) => {
        setPeriod(period);
        setType(type);
    };

    const init = useCallback(() => {
        Http.get('/portfolio/fix_invest_detail/20210101', {
            upid: route?.params?.upid,
            poid: route?.params?.poid,
        }).then((res) => {
            setData(res.result);
            Http.get('/portfolio/yield_chart/20210101', {
                upid: route.params.upid,
                period: period,
                type: type,
                allocation_id: res.result.allocation_id,
                benchmark_id: res.result.benchmark_id,
                poid: route?.params?.poid,
            }).then((res) => {
                setChartData(res.result);
            });
        });
    }, [route.params, period]);

    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            _textTime.current.setNativeProps({text: items[0]?.title});
            if (type == 2) {
                let range = items[0].origin.value;
                let _value = (range[0] * 100).toFixed(2) + '%' + '~' + (range[0] * 100).toFixed(2) + '%';
                _textPortfolio.current.setNativeProps({
                    text: _value,
                    style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
                });
            } else {
                _textPortfolio.current.setNativeProps({
                    text: items[0]?.value,
                    style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
                });
            }
        },
        [getColor]
    );
    // 图表滑动结束
    const onHide = ({items}) => {
        const _data = chartData?.yield_info;
        _textTime.current.setNativeProps({text: _data?.label[0].val});
        _textPortfolio.current.setNativeProps({
            text: _data?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label[1].val)}],
        });
        _textBenchmark.current.setNativeProps({
            text: _data?.label[2].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label[2].val)}],
        });
    };
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);
    return (
        <>
            {Object.keys(data).length > 0 ? <Header title={data?.title} leftIcon="chevron-left" /> : null}
            {Object.keys(data).length > 0 && (
                <ScrollView style={{marginBottom: 100, flex: 1}}>
                    <View style={[styles.container_sty]}>
                        <Text style={{color: '#4E556C', fontSize: text(13), textAlign: 'center'}}>
                            {data?.ratio_info?.title}
                        </Text>
                        <Text style={{paddingTop: text(16), paddingBottom: text(8)}}>
                            <Text style={styles.amount_sty}>{data?.ratio_info?.ratio_val}</Text>
                            <Text style={styles.radio_sty}> {data?.ratio_info?.ratio_desc}</Text>
                        </Text>
                        <View style={Style.flexRowCenter}>
                            {data?.ratio_info?.label.map((_label, _index) => {
                                return (
                                    <View style={styles.label_sty} key={_index + 'label'}>
                                        <Text style={{color: '#266EFF', fontSize: text(11)}}>{_label}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={{height: 320, backgroundColor: '#fff'}}>
                        <View style={[Style.flexRow, {marginTop: text(22)}]}>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    ref={_textTime}
                                    style={styles.legend_title_sty}
                                    defaultValue={chartData?.yield_info?.label[0]?.val}
                                    editable={false}
                                />
                                <Text style={styles.legend_desc_sty}>{chartData?.yield_info?.label[0]?.key}</Text>
                            </View>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    style={[
                                        styles.legend_title_sty,
                                        {color: getColor(chartData?.yield_info?.label[1]?.val)},
                                    ]}
                                    ref={_textPortfolio}
                                    defaultValue={chartData?.yield_info?.label[1]?.val}
                                    editable={false}
                                />
                                <Text>
                                    <MaterialCommunityIcons
                                        name={'record-circle-outline'}
                                        color={'#E74949'}
                                        size={12}
                                    />
                                    <Text style={styles.legend_desc_sty}>{chartData?.yield_info?.label[1]?.key}</Text>
                                </Text>
                            </View>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    style={[
                                        styles.legend_title_sty,
                                        {color: getColor(chartData?.yield_info?.label[2]?.val)},
                                    ]}
                                    ref={_textBenchmark}
                                    defaultValue={chartData?.yield_info?.label[2]?.val}
                                    editable={false}
                                />
                                <Text>
                                    <MaterialCommunityIcons
                                        name={'record-circle-outline'}
                                        color={'#545968'}
                                        size={12}
                                    />
                                    <Text style={styles.legend_desc_sty}>{chartData?.yield_info?.label[2]?.key}</Text>
                                </Text>
                            </View>
                        </View>
                        <Chart
                            initScript={baseAreaChart(
                                chartData?.yield_info?.chart,
                                [Colors.red, Colors.lightBlackColor, 'transparent'],
                                ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                                true
                            )}
                            onChange={onChartChange}
                            data={chartData?.yield_info?.chart}
                            onHide={onHide}
                            style={{width: '100%'}}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                height: 50,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginHorizontal: 20,
                            }}>
                            {chartData?.yield_info?.sub_tabs?.map((_item, _index) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.btn_sty,
                                            {
                                                backgroundColor:
                                                    period == _item.val && type == _item.type ? '#F1F6FF' : '#fff',
                                            },
                                        ]}
                                        key={_index}
                                        onPress={() => changeTab(_item.val, _item.type)}>
                                        <Text
                                            style={{
                                                color:
                                                    period == _item.val && type == _item.type ? '#0051CC' : '#555B6C',
                                                fontSize: text(12),
                                            }}>
                                            {_item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={{paddingHorizontal: Space.padding}}>
                        <View>
                            {data?.asset_intros?.map((_i, _d) => {
                                return (
                                    <FitImage source={{uri: _i}} resizeMode="contain" style={{marginTop: text(16)}} />
                                );
                            })}
                        </View>
                        <View style={styles.assets_wrap_sty}>
                            <View style={[Style.flexRow, {padding: text(15)}]}>
                                <Text style={styles.title_sty}>
                                    {data.asset_deploy.header.title}
                                    <Text style={{color: '#4E556C', fontSize: text(13)}}>
                                        {data.asset_deploy.header.tip}
                                    </Text>
                                </Text>
                            </View>
                            <View style={{paddingHorizontal: text(6)}}>
                                <View style={[Style.flexBetween, styles.head_sty]}>
                                    <Text style={styles.head_title_sty}>{data.asset_deploy.th.name}</Text>
                                    <Text style={styles.head_title_sty}>{data.asset_deploy.th.ratio}</Text>
                                </View>
                                {data.asset_deploy.items.map((_a, _index) => {
                                    const borderBottom = _index < data.asset_deploy.items.length - 1 ? 0.5 : 0;
                                    return (
                                        <View
                                            style={[
                                                Style.flexBetween,
                                                styles.content_warp_sty,
                                                {borderBottomWidth: borderBottom},
                                            ]}
                                            key={_index + '_a'}>
                                            <View>
                                                <Text style={styles.content_title_sty}>{_a.name}</Text>
                                                <Text style={{color: '#9397A3', fontSize: text(11)}}>({_a.code})</Text>
                                            </View>
                                            <Text style={[styles.content_title_sty, {fontFamily: Font.numFontFamily}]}>
                                                {_a.percent}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={[styles.card_sty, {paddingVertical: 0}]}>
                            {data?.gather_info?.map((_g, _index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[
                                            Style.flexRow,
                                            {
                                                borderBottomWidth: _index < data.gather_info.length - 1 ? 0.5 : 0,
                                                borderColor: Colors.borderColor,
                                            },
                                        ]}
                                        key={_index + '_g'}
                                        onPress={() => jump(_g.url)}>
                                        <Text style={{flex: 1, paddingVertical: text(20), color: '#545968'}}>
                                            {_g.title}
                                        </Text>
                                        <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <BottomDesc />
                </ScrollView>
            )}
            {Object.keys(data).length > 0 && (
                <FixedBtn btns={data.btns} style={{position: 'absolute', bottom: 0}} activeOpacity={1} />
            )}
        </>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#1F2432',
    },
    container_sty: {
        // paddingVertical: text(20),
        backgroundColor: '#fff',
    },
    amount_sty: {
        color: '#E74949',
        fontSize: text(34),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    legend_sty: {
        flex: 1,
        alignItems: 'center',
    },
    legend_title_sty: {
        color: '#1F2432',
        fontWeight: 'bold',
        fontSize: text(16),
        marginBottom: text(4),
        fontFamily: Font.numFontFamily,
    },
    legend_desc_sty: {
        fontSize: text(11),
        color: '#545968',
    },
    radio_sty: {
        color: '#858DA5',
        fontSize: text(12),
    },
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(8),
        paddingVertical: text(5),
        borderRadius: text(12),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: Space.padding,
        marginHorizontal: Space.padding,
        marginTop: text(12),
    },
    label_sty: {
        backgroundColor: '#F0F6FD',
        paddingHorizontal: text(6),
        paddingVertical: text(4),
        marginRight: text(10),
        borderRadius: text(3),
    },
    assets_wrap_sty: {
        borderRadius: text(10),
        backgroundColor: '#fff',
        marginTop: text(16),
    },
    title_sty: {
        color: '#1F2432',
        fontSize: text(16),
        fontWeight: 'bold',
    },
    head_sty: {
        backgroundColor: '#F5F6F8',
        padding: text(8),
    },
    head_title_sty: {
        color: '#9095A5',
        fontSize: text(12),
    },
    content_warp_sty: {
        paddingTop: text(13),
        paddingHorizontal: text(9),
        paddingBottom: text(9),
        borderColor: Colors.borderColor,
    },
    content_title_sty: {
        color: '#4E556C',
        fontSize: text(13),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: Space.padding,
        marginTop: text(12),
    },
});
