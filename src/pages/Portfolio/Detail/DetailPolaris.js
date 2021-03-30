/*
 * @Author: xjh
 * @Date: 2021-02-20 17:23:31
 * @Description:马红漫组合
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-30 12:07:32
 */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import Header from '../../../components/NavBar';
import {px as text, isIphoneX} from '../../../utils/appUtil';
import FitImage from 'react-native-fit-image';
import {Font, Style, Colors} from '../../../common/commonStyle';
import {Chart} from '../../../components/Chart';
import {pieChart} from './ChartOption';
import {baseAreaChart} from '../components/ChartOption';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FixedBtn from '../components/FixedBtn';
import ListHeader from '../components/ListHeader';
import Html from '../../../components/RenderHtml';
import {BottomModal} from '../../../components/Modal';
import {useJump} from '../../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import BottomDesc from '../../../components/BottomDesc';
import Notice from '../../../components/Notice';
import RenderChart from '../components/RenderChart';
export default function DetailPolaris({route, navigation}) {
    const [chartData, setChartData] = useState();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y1');
    const bottomModal = React.useRef(null);
    const [showMask, setShowMask] = useState(false);
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const [type, setType] = useState(1);
    const jump = useJump();
    const init = useCallback(() => {
        Http.get('/polaris/portfolio_detail/20210101', {
            poid: route.params.poid,
        }).then((res) => {
            navigation.setOptions({
                title: res.result.title,
            });
            setData(res.result);
            Http.get('/portfolio/yield_chart/20210101', {
                upid: route.params.upid,
                period: period,
                type: type,
                allocation_id: res.result.parts_addition_data.line.allocation_id,
                benchmark_id: res.result.parts_addition_data.line.benchmark_id,
            }).then((res) => {
                setChart(res.result.yield_info.chart);
                setChartData(res.result);
            });
        });
    }, [route.params, period, type]);

    const changeTab = (period, type) => {
        setPeriod(period);
        setType(type);
    };
    // const jumpTo = (url) => {
    //     navigation.navigate({name: url.path, params});
    // };
    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );
    return (
        <>
            {Object.keys(data).length > 0 && (
                <ScrollView style={{marginBottom: FixedBtn.btnHeight, backgroundColor: Colors.bgColor, flex: 1}}>
                    {data?.processing_info && <Notice content={data?.processing_info} />}
                    <FitImage source={{uri: data?.top?.header?.img}} resizeMode="contain" />
                    <View style={{padding: text(16), marginTop: text(-70)}}>
                        <View style={styles.card_sty}>
                            <Text style={{fontSize: text(16), textAlign: 'center', fontWeight: 'bold'}}>
                                {data?.top?.title}
                            </Text>
                            <View style={[Style.flexRowCenter, {marginTop: text(10)}]}>
                                {data?.top?.tags?.map((_tag, _index) => {
                                    return (
                                        <View style={styles.label_wrap_sty} key={_index + '_tag'}>
                                            <Text style={styles.label_sty}>{_tag.text}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <Text style={styles.num_sty}>{data?.top?.ratio_text}</Text>
                            <Text style={styles.desc_sty}>{data?.top?.desc}</Text>
                            <TouchableOpacity style={styles.btn_sty} onPress={() => jump(data?.top?.btn?.url)}>
                                <Text style={styles.btn_text_sty}>{data?.top?.btn?.text}</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                height: 300,
                                backgroundColor: '#fff',
                                marginTop: text(12),
                                borderRadius: text(10),
                                paddingVertical: text(16),
                            }}>
                            <Text style={[styles.card_title_sty, {paddingBottom: text(16)}]}>
                                {data?.part_line?.title}
                            </Text>
                            <RenderChart
                                chartData={chartData}
                                chart={chart}
                                type={type}
                                style={{marginTop: text(20)}}
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
                                            activeOpacity={1}
                                            style={[
                                                styles.btn_choose_sty,
                                                {
                                                    backgroundColor:
                                                        period == _item.val && type == _item.type ? '#F1F6FF' : '#fff',
                                                    borderWidth: period == _item.val && type == _item.type ? 0 : 0.5,
                                                },
                                            ]}
                                            key={_index}
                                            onPress={() => changeTab(_item.val, _item.type)}>
                                            <Text
                                                style={{
                                                    color:
                                                        period == _item.val && type == _item.type
                                                            ? '#0051CC'
                                                            : '#555B6C',
                                                    fontSize: text(12),
                                                }}>
                                                {_item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={[styles.card_sty, {marginTop: text(16), paddingHorizontal: 0}]}>
                            <View style={{paddingHorizontal: text(16), marginBottom: text(16)}}>
                                <Text style={[styles.card_title_sty, {paddingHorizontal: 0, paddingBottom: text(10)}]}>
                                    {data?.part_pie?.title}
                                </Text>
                                <Text style={{color: '#4E556C', fontSize: text(13)}}>{data?.part_pie?.desc}</Text>
                            </View>
                            {/* <View style={{height: 340}}>
                                <Chart initScript={pie(data?.part_pie?.pie?.items, data?.part_pie?.pie?.chart)} />
                            </View> */}

                            <View style={styles.fund_card_sty}>
                                <View
                                    style={[
                                        Style.flexBetween,
                                        {
                                            backgroundColor: '#FAFAFA',
                                            padding: text(13),
                                        },
                                    ]}>
                                    <Text style={[styles.fund_title_sty, {flex: 1}]}>
                                        {data?.part_pie?.pie?.table?.header?.fund_name}
                                    </Text>
                                    <Text style={styles.fund_title_sty}>
                                        {data?.part_pie?.pie?.table?.header?.hold_ratio_text}
                                    </Text>
                                    <TouchableOpacity onPress={() => bottomModal.current.show()} activeOpacity={1}>
                                        <Text style={[styles.fund_title_sty, {textAlign: 'right'}]}>
                                            {data?.part_pie?.pie?.table?.header?.ratio_text}
                                            <AntDesign name={'questioncircleo'} size={12} color={'#BCBCBC'} />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {data?.part_pie?.pie.table?.body.map((_table, _index) => {
                                    const width = _index < data?.part_pie?.pie.table?.body.length - 1 ? 0.5 : 0;
                                    const padding = _index < data?.part_pie?.pie.table?.body.length - 1 ? text(13) : 0;
                                    return (
                                        <View style={{padding: text(13), paddingBottom: 0}} key={_table.id}>
                                            <View
                                                style={[
                                                    Style.flexBetween,
                                                    styles.fund_item_sty,
                                                    {
                                                        borderBottomWidth: width,
                                                        paddingBottom: padding,
                                                    },
                                                ]}>
                                                <View>
                                                    <Text
                                                        style={{color: '#333333', width: text(140)}}
                                                        numberOfLines={1}>
                                                        {_table.fund_name}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#999999',
                                                            fontSize: text(11),
                                                            marginTop: text(5),
                                                            fontFamily: Font.numFontFamily,
                                                        }}>
                                                        {_table.tag}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        color: '#333333',
                                                        fontSize: text(13),
                                                        fontFamily: Font.numFontFamily,
                                                    }}>
                                                    {_table.hold_ratio}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: getColor(_table.ratio_text),
                                                        fontSize: text(13),
                                                        fontFamily: Font.numFontFamily,
                                                        textAlign: 'right',
                                                    }}>
                                                    {_table.ratio_text}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={[styles.card_sty, {paddingHorizontal: 0, paddingBottom: 0, overflow: 'hidden'}]}>
                            <Text style={[styles.card_title_sty, {paddingBottom: text(10)}]}>
                                {data?.part_texts[0]?.title}
                            </Text>
                            <FitImage
                                source={{
                                    uri: data?.part_texts[0]?.img,
                                }}
                                resizeMode="contain"
                            />
                        </View>
                        {/* {showMask && <Mask />} */}
                        <BottomModal ref={bottomModal} confirmText={'确认'}>
                            <View style={{padding: text(16)}}>
                                <Text style={{lineHeight: text(18)}}>{data?.parts_addition_data?.pie?.tip?.desc}</Text>
                            </View>
                        </BottomModal>
                        <View style={[styles.card_sty, {paddingVertical: 0}]}>
                            {data?.gather_info?.map((_info, _idx) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[
                                            Style.flexRow,
                                            {
                                                borderBottomWidth: _idx < data.gather_info.length - 1 ? 0.5 : 0,
                                                borderColor: Colors.borderColor,
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
                    </View>
                    <Text
                        style={{
                            color: '#B8C1D3',
                            paddingHorizontal: text(16),
                            lineHeight: text(18),
                            fontSize: text(11),
                            marginTop: text(12),
                        }}>
                        {data.tip}
                    </Text>
                    <BottomDesc style={{marginTop: text(80)}} />
                </ScrollView>
            )}

            {data?.fixed_bottom && <FixedBtn btns={data?.fixed_bottom} style={{position: 'absolute', bottom: 0}} />}
        </>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        paddingHorizontal: text(14),
        paddingVertical: text(20),
        marginBottom: text(16),
    },
    label_wrap_sty: {
        backgroundColor: '#FEF0F0',
        borderRadius: text(2),
        flexDirection: 'row',
        marginRight: text(10),
    },
    label_sty: {
        color: '#DA4B4D',
        fontSize: text(13),
        padding: text(5),
    },
    num_sty: {
        color: '#E74949',
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
        fontSize: text(32),
        textAlign: 'center',
        marginTop: text(12),
    },
    desc_sty: {
        color: '#9AA1B2',
        textAlign: 'center',
        fontSize: text(12),
    },
    btn_text_sty: {
        color: '#fff',
        textAlign: 'center',
        paddingVertical: text(14),
        fontSize: text(15),
    },
    btn_sty: {
        backgroundColor: '#E74949',
        borderRadius: text(6),
        marginTop: text(18),
    },
    legend_sty: {
        flex: 1,
        alignItems: 'center',
    },
    legend_title_sty: {
        color: '#1F2432',
        // fontWeight: 'bold',
        fontSize: text(16),
        fontFamily: Font.numFontFamily,
        marginBottom: text(4),
        padding: 0, //处理textInput 在安卓上的兼容问题
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
    btn_press_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(8),
        paddingVertical: text(5),
        borderRadius: text(12),
    },
    card_title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        paddingHorizontal: text(16),
        paddingBottom: text(16),
        fontWeight: 'bold',
    },
    fund_title_sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
        width: text(60),
    },
    fund_card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
    },
    fund_item_sty: {
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingBottom: text(13),
    },
    line_desc_sty: {
        paddingHorizontal: text(16),
        marginTop: text(10),
        paddingBottom: text(20),
        fontSize: text(12),
        color: '#9AA1B2',
        lineHeight: text(18),
    },
    btn_choose_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(12),
        paddingVertical: text(5),
        borderRadius: text(15),
    },
});
