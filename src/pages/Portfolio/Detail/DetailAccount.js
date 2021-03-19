/*
 * @Author: xjh
 * @Date: 2021-01-26 14:21:25
 * @Description:长短期详情页
 * @LastEditors: dx
 * @LastEditdate: 2021-03-01 17:21:42
 */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/NavBar';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import {histogram, pie} from './ChartOption';
import {baseAreaChart} from '../components/ChartOption';
import ListHeader from '../components/ListHeader';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FixedBtn from '../components/FixedBtn';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '../../../components/hooks';

export default function DetailAccount({route, navigation}) {
    const jump = useJump();
    const [chartData, setChartData] = useState();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y5');
    const [summary, setSummary] = useState([]);
    const [labelInfo, setLabelInfo] = useState([]);
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const [type, setType] = useState(1);
    const changeTab = (p, type) => {
        setPeriod(p);
        setType(type);
    };
    const jumpPage = (url, params) => {
        if (!url) {
            return;
        }
        navigation.navigate(url, params);
    };
    const init = useCallback(() => {
        Http.get('/portfolio/detail/20210101', {
            upid: route?.params?.upid,
        }).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                Http.get('/portfolio/yield_chart/20210101', {
                    allocation_id: res.result.allocation_id,
                    benchmark_id: res.result.benchmark_id,
                    period: period,
                    type: 1,
                }).then((resp) => {
                    setLabelInfo(resp.result.yield_info.label);
                    setChartData(resp.result.yield_info);
                    setSummary(resp.result.yield_info.label);
                });
            }
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
                _textBenchmark.current.setNativeProps({
                    text: items[1]?.value,
                    style: [styles.legend_title_sty, {color: getColor(items[1]?.value)}],
                });
            }
        },
        [getColor, type]
    );
    // 图表滑动结束
    const onHide = useCallback(
        ({items}) => {
            _textTime.current.setNativeProps({text: labelInfo[0].val});
            _textPortfolio.current.setNativeProps({
                text: labelInfo[1].val,
                style: [styles.legend_title_sty, {color: getColor(labelInfo[1].val)}],
            });
            _textBenchmark.current.setNativeProps({
                text: labelInfo[2].val,
                style: [styles.legend_title_sty, {color: getColor(labelInfo[2].val)}],
            });
        },
        [getColor, labelInfo]
    );
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
            {Object.keys(data).length > 0 ? (
                <Header
                    title={data.title}
                    leftIcon="chevron-left"
                    rightText={'产品说明书'}
                    titleStyle={{marginRight: text(-20)}}
                    rightPress={() => jumpPage('ProductIntro', {upid: route?.params?.upid})}
                    rightTextStyle={styles.right_sty}
                />
            ) : null}
            {Object.keys(data).length > 0 ? (
                <ScrollView style={{flex: 1}}>
                    <View style={[styles.container_sty]}>
                        <Text style={styles.amount_sty}>{data.ratio_info.ratio_val}</Text>
                        <Text style={styles.radio_sty}>{data.ratio_info.ratio_desc}</Text>
                    </View>
                    <View style={{height: 380, backgroundColor: '#fff'}}>
                        <View style={[Style.flexRow]}>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    ref={_textTime}
                                    style={styles.legend_title_sty}
                                    defaultValue={summary[0]?.val}
                                    editable={false}
                                />
                                <Text style={styles.legend_desc_sty}>{summary[0]?.key}</Text>
                            </View>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    style={[styles.legend_title_sty, {color: getColor(summary[1]?.val)}]}
                                    ref={_textPortfolio}
                                    defaultValue={summary[1]?.val}
                                    editable={false}
                                />
                                <Text>
                                    <MaterialCommunityIcons
                                        name={'record-circle-outline'}
                                        color={'#E74949'}
                                        size={12}
                                    />
                                    <Text style={styles.legend_desc_sty}>{summary[1]?.key}</Text>
                                </Text>
                            </View>
                            <View style={styles.legend_sty}>
                                <TextInput
                                    style={[styles.legend_title_sty, {color: getColor(summary[2]?.val)}]}
                                    ref={_textBenchmark}
                                    defaultValue={summary[2]?.val}
                                    editable={false}
                                />
                                <Text>
                                    <MaterialCommunityIcons
                                        name={'record-circle-outline'}
                                        color={'#545968'}
                                        size={12}
                                    />
                                    <Text style={styles.legend_desc_sty}>{summary[2]?.key}</Text>
                                </Text>
                            </View>
                        </View>
                        <Chart
                            initScript={baseAreaChart(
                                chartData?.chart,
                                [Colors.red, Colors.lightBlackColor, 'transparent'],
                                ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                                true
                            )}
                            onChange={onChartChange}
                            data={chartData?.chart}
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
                            {chartData?.sub_tabs?.map((_item, _index) => {
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
                        <View style={{paddingBottom: text(20), paddingHorizontal: text(16)}}>
                            <Text style={{marginTop: text(10), marginBottom: text(5)}}>
                                <MaterialCommunityIcons name={'circle-medium'} color={'#4BA471'} size={15} />
                                <Text style={{fontSize: text(12)}}>{chartData?.remark?.title} </Text>
                                <Text
                                    style={{
                                        color: '#4BA471',
                                        fontSize: text(15),
                                        fontWeight: 'bold',
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {chartData?.remark?.ratio}
                                </Text>
                            </Text>
                            {chartData?.remark?.content && (
                                <Html
                                    html={chartData?.remark?.content}
                                    style={{fontSize: text(12), lineHeight: text(18)}}
                                />
                            )}
                        </View>
                    </View>
                    {/* 全球配置 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.asset_deploy.header} color={'#0051CC'} />
                        <View style={{height: 220}}>
                            <Chart initScript={pie(data.asset_deploy.items, data.asset_deploy.chart)} />
                        </View>
                    </View>
                    {/* 智能调仓 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.adjust_info.header} />
                        <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                            {data.adjust_info.items.map((_i, _d) => {
                                return (
                                    <View
                                        key={_d}
                                        style={{
                                            width: '50%',
                                            paddingTop: text(16),
                                            paddingRight: _d == 0 || _d == 2 ? text(20) : 0,
                                        }}>
                                        <View style={Style.flexRow}>
                                            <Image
                                                source={{uri: _i.icon}}
                                                style={{height: text(15), width: text(15)}}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.row_title_sty}>{_i.title}</Text>
                                        </View>
                                        <Text style={styles.adjust_desc_syl}>{_i.content}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    {/* 资产增强 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.asset_enhance.header} />
                        <FitImage
                            source={{uri: data.asset_enhance.img}}
                            resizeMode="contain"
                            style={{marginTop: text(16)}}
                        />
                    </View>
                    {/* 风险控制 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.risk_info.header} />
                        <View style={{height: 300, position: 'relative'}}>
                            <View style={[Style.flexRow, {marginTop: text(13), marginLeft: text(30)}]}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.row_title_sty}>{data.risk_info.chart.data[0].key}</Text>
                                    <Text style={styles.row_desc_sty}>{data.risk_info.chart.data[0].val}</Text>
                                    {/* <Image
                                        source={require('../../../assets/img/detail/zan.png')}
                                        style={styles.zan_sty}
                                    /> */}
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.row_title_sty}>{data.risk_info.chart.data[1].key}</Text>
                                    <Text style={styles.row_desc_sty}>{data.risk_info.chart.data[1].val}</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.row_title_sty}>{data.risk_info.chart.data[2].key}</Text>
                                    <Text style={styles.row_desc_sty}>{data.risk_info.chart.data[2].val}</Text>
                                </View>
                            </View>
                            {/* <Text style={{borderColor: '#ddd', borderWidth: 0.5}}></Text> */}
                            <Chart
                                initScript={histogram(data.risk_info.chart.data)}
                                style={{marginTop: text(-20), zIndex: 9}}
                            />

                            <View style={{flexDirection: 'row', marginLeft: text(30)}}>
                                <View style={[{flex: 1, fontSize: text(12)}, Style.flexRow]}>
                                    <Ionicons name={'square'} color={'#E74949'} size={10} />
                                    <Text> {data.risk_info.chart.label.y[0].key}</Text>
                                </View>
                                <View style={[{flex: 1, fontSize: text(12)}, Style.flexRow]}>
                                    <Ionicons name={'square'} color={'#545968'} size={10} />
                                    <Text> {data.risk_info.chart.label.y[1].key}</Text>
                                </View>
                                <View style={{width: text(100), fontSize: text(12), flexShrink: 0}}>
                                    <Text style={{fontSize: text(12)}}>---{data.risk_info.chart.label.x[0].key}</Text>
                                    <Text
                                        style={{
                                            fontSize: text(10),
                                        }}>
                                        {data.risk_info.chart.label.x[0].val}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card_sty, {paddingVertical: 0}]}>
                        {data.gather_info.map((_info, _idx) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        Style.flexRow,
                                        {
                                            borderBottomWidth: _idx < data.gather_info.length - 1 ? 0.5 : 0,
                                            borderColor: '#DDDDDD',
                                        },
                                    ]}
                                    key={_idx + 'info'}
                                    onPress={() => jump(_info.url)}>
                                    <Text style={{flex: 1, paddingVertical: text(20)}}>{_info.title}</Text>
                                    <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <BottomDesc />
                </ScrollView>
            ) : null}
            {data?.btns && <FixedBtn btns={data.btns} />}
        </>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        color: '#1F2432',
        width: text(70),
    },
    container_sty: {
        paddingHorizontal: text(16),
        paddingVertical: text(20),
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
        fontFamily: Font.numFontFamily,
        marginBottom: text(4),
    },
    legend_desc_sty: {
        fontSize: text(11),
        color: '#545968',
    },
    radio_sty: {
        color: '#9AA1B2',
        fontSize: text(12),
        textAlign: 'center',
        marginTop: text(4),
    },
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(8),
        paddingVertical: text(5),
        borderRadius: text(15),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: Space.padding,
        marginHorizontal: Space.padding,
        marginTop: text(12),
    },
    adjust_desc_syl: {
        color: '#9397A3',
        fontSize: Font.textH3,
        lineHeight: text(18),
    },
    row_title_sty: {
        color: '#1F2432',
        fontSize: text(13),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row_desc_sty: {
        color: '#868DA3',
        fontSize: text(11),
        textAlign: 'center',
        marginTop: text(3),
        fontFamily: Font.numFontFamily,
    },
    zan_sty: {
        width: text(24),
        height: text(24),
    },
});
