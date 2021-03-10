// /*
//  * @Author: xjh
//  * @Date: 2021-01-27 18:33:13
//  * @Description:养老详情页
//  * @LastEditors: xjh
//  * @LastEditTime: 2021-01-27 18:37:22
//  */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px, px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {baseChart, histogram, pie} from './ChartOption';
import ChartData from './data.json';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FixedBtn from '../components/FixedBtn';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import Header from '../../../components/NavBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ListHeader from '../components/ListHeader';
import {baseAreaChart} from '../components/ChartOption';
import Table from '../components/Table';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
export default function DetailRetiredPlan({navigation, route}) {
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y1');
    const [map, setMap] = useState({});
    const [choose, setChoose] = useState(1);
    const [summary, setSummary] = useState([]);
    const [labelInfo, setLabelInfo] = useState([]);
    const [chartData, setChartData] = useState();
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    var _type = 1;
    const head = {
        title: '子女教育计划是怎么帮我投资的？',
        text: '',
    };

    const rightPress = () => {
        navigation.navigate('Evaluation');
    };
    const changeTab = (period, type) => {
        setPeriod(period);
        _type = type;
        getChartInfo();
    };
    const chooseBtn = () => {};
    const init = useCallback(() => {
        Http.get('/portfolio/purpose_invest_detail/20210101', {
            upid: route.params.upid,
        }).then((res) => {
            setData(res.result);
            getChartInfo();
        });
    }, [route.params, getChartInfo]);
    const getChartInfo = useCallback(() => {
        if (Object.keys(data).length > 0) {
            Http.get('/portfolio/yield_chart/20210101', {
                allocation_id: data.allocation_id,
                benchmark_id: data.benchmark_id,
                period: period,
                type: _type,
            }).then((res) => {
                setLabelInfo(res.result.yield_info.label);
                setChartData(res.result.yield_info);
                setSummary(res.result.yield_info.label);
            });
        }
    }, [period, data]);
    useFocusEffect(
        useCallback(() => {
            init();
            getChartInfo();
        }, [getChartInfo, init])
    );
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            _textTime.current.setNativeProps({text: items[0]?.title});
            _textPortfolio.current.setNativeProps({
                text: items[0]?.value,
                style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
            });
            _textBenchmark.current.setNativeProps({
                text: items[1]?.value,
                style: [styles.legend_title_sty, {color: getColor(items[1]?.value)}],
            });
        },
        [getColor]
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
        [labelInfo, getColor]
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
                <View style={{flex: 1}}>
                    <Header
                        title={'子女教育计划'}
                        leftIcon="chevron-left"
                        rightText={data.top_button.title}
                        rightPress={rightPress}
                        rightTextStyle={styles.right_sty}
                    />
                    <ScrollView style={{marginBottom: FixedBtn.btnHeight}}>
                        <View style={styles.container_sty}>
                            <View>
                                <View style={Style.flexRow}>
                                    <Text style={{color: '#9AA1B2'}}>{data.plan_info.goal_info.title}</Text>
                                    <View style={{borderRadius: text(4), backgroundColor: '#F1F6FF'}}>
                                        <Text style={styles.age_text_sty}>{data?.plan_info?.goal_info?.tip}</Text>
                                    </View>
                                </View>
                                <Text style={styles.fund_input_sty}>{data?.plan_info?.goal_info?.amount}</Text>
                                <View style={{position: 'relative', marginTop: text(5)}}>
                                    <FontAwesome
                                        name={'caret-up'}
                                        color={'#E9EAED'}
                                        size={30}
                                        style={{left: text(25), top: text(-18), position: 'absolute'}}
                                    />
                                    <LinearGradient
                                        start={{x: 0, y: 0.25}}
                                        end={{x: 0.8, y: 0.8}}
                                        colors={['#E9EAED', '#F5F6F8']}
                                        style={{borderRadius: text(25), marginBottom: text(7)}}>
                                        <Text style={styles.tip_sty}>{data?.plan_info?.goal_info?.remark}</Text>
                                    </LinearGradient>
                                    <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                        <Text style={{color: '#545968', flex: 1}}>
                                            {data?.plan_info?.goal_info?.items[0]?.key}
                                        </Text>
                                        <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                            <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                            <Text style={styles.count_num_sty}>
                                                {data?.plan_info?.goal_info?.items[0]?.val}
                                            </Text>
                                            <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                        </View>
                                    </View>
                                    <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                        <Text style={{color: '#545968', flex: 1}}>
                                            {data?.plan_info?.goal_info?.items[1]?.key}
                                        </Text>
                                        <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                            <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                            <Text style={styles.count_num_sty}>
                                                {data?.plan_info?.goal_info?.items[1]?.val}
                                            </Text>
                                            <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                        </View>
                                    </View>
                                    <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                        <Text style={{color: '#545968'}}>
                                            {data?.plan_info?.goal_info?.items[2]?.key}
                                        </Text>
                                        <TouchableOpacity style={Style.flexRow}>
                                            <Text style={{color: '#545968'}}>
                                                {data?.plan_info?.goal_info?.items[2]?.val}年
                                            </Text>
                                            <AntDesign name={'down'} color={'#8D96AF'} size={12} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.content_sty}>
                            <View style={styles.card_sty}>
                                <Text style={styles.title_sty}>子女教育计划VS某教育金</Text>
                                <View style={{height: 300, backgroundColor: '#fff', marginTop: text(20)}}>
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
                                                        {backgroundColor: period == _item.val ? '#F1F6FF' : '#fff'},
                                                    ]}
                                                    key={_index}
                                                    onPress={() => changeTab(_item.val, _item.type)}>
                                                    <Text
                                                        style={{
                                                            color: period == _item.val ? '#0051CC' : '#555B6C',
                                                            fontSize: text(12),
                                                        }}>
                                                        {_item.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* 表格 */}
                                <Table data={data.asset_compare.table} />
                                <TouchableOpacity
                                    style={{marginLeft: text(16), flexDirection: 'row', alignItems: 'baseline'}}>
                                    <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                                    <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                        {data.asset_compare.tip_info.title}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {/* 饼图 */}
                            <View style={styles.card_sty}>
                                <ListHeader
                                    data={data.asset_deploy.header}
                                    style={{paddingHorizontal: text(16)}}
                                    color={'#0051CC'}
                                />
                                <View style={{height: 200}}>
                                    <Chart initScript={pie(data.asset_deploy.items, data.asset_deploy.chart)} />
                                </View>
                            </View>
                            <View style={[styles.card_sty, {paddingHorizontal: text(16)}]}>
                                <ListHeader data={data.asset_strategy.header} style={{paddingHorizontal: text(16)}} />
                                {data.asset_strategy.items.map((_s, _d) => {
                                    return (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                marginTop: text(20),
                                            }}
                                            key={_d + '_s'}>
                                            <Image
                                                source={{
                                                    uri: _s.icon,
                                                }}
                                                resizeMode="contain"
                                                style={{width: text(69), height: text(69), marginRight: text(10)}}
                                            />
                                            <View
                                                style={{
                                                    flex: 1,
                                                }}>
                                                <Text style={{color: '#111111'}}>{_s.title}</Text>
                                                <Text
                                                    style={{
                                                        color: '#9AA1B2',
                                                        fontSize: text(12),
                                                        marginTop: text(8),
                                                        lineHeight: text(16),
                                                    }}>
                                                    {_s.content}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'baseline',
                                        marginTop: text(16),
                                    }}>
                                    <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                                    <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                        {data.asset_strategy.tip_info.title}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.card_sty, {paddingVertical: 0, paddingHorizontal: text(16)}]}>
                                {data.gather_info.map((_q, _w) => {
                                    return (
                                        <View
                                            style={[
                                                Style.flexRow,
                                                {borderTopWidth: _w == 0 ? 0 : 0.5, borderColor: '#ddd'},
                                            ]}>
                                            <Text style={{flex: 1, paddingVertical: text(20)}}>{_q.title}</Text>
                                            <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>
                    <FixedBtn btns={data?.btns} style={{position: 'absolute', bottom: 0}} />
                </View>
            ) : null}
        </>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        color: '#1F2432',
    },
    container_sty: {
        backgroundColor: '#fff',
        padding: Space.padding,
        paddingBottom: 0,
    },
    select_text_sty: {
        // flex: 1,
        color: '#545968',
    },
    select_wrap_sty: {
        borderBottomWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingBottom: text(16),
    },
    age_num_sty: {
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
    },
    select_btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        borderRadius: text(15),
        paddingVertical: text(4),
        flex: 1,
        marginRight: text(8),
    },
    fund_input_sty: {
        height: text(36),
        fontSize: text(34),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        marginVertical: text(8),
    },
    tip_sty: {
        height: text(36),
        lineHeight: text(36),
        color: '#545968',
        fontSize: text(12),
        marginHorizontal: text(16),
        flexWrap: 'wrap',
    },
    count_wrap_sty: {
        paddingVertical: text(19),
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    count_num_sty: {
        color: '#292D39',
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
        minWidth: text(130),
        textAlign: 'center',
    },
    content_sty: {
        margin: Space.marginAlign,
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        paddingVertical: Space.padding,
        marginBottom: text(16),
    },
    title_sty: {
        color: '#111111',
        fontSize: Font.textH1,
        fontWeight: 'bold',
        paddingHorizontal: text(16),
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
    age_text_sty: {
        color: '#6B9AE3',
        paddingHorizontal: text(3),
        fontSize: text(11),
        paddingVertical: text(2),
    },
});
