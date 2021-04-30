/*
 * @Author: xjh
 * @Date: 2021-02-20 17:23:31
 * @Description:马红漫组合
 * @LastEditors: dx
 * @LastEditTime: 2021-04-28 10:10:22
 */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Platform} from 'react-native';
import {px as text, isIphoneX} from '../../../utils/appUtil';
import FitImage from 'react-native-fit-image';
import Image from 'react-native-fast-image';
import {Font, Style, Colors} from '../../../common/commonStyle';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FixedBtn from '../components/FixedBtn';
import {BottomModal} from '../../../components/Modal';
import {useJump} from '../../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import BottomDesc from '../../../components/BottomDesc';
import Notice from '../../../components/Notice';
import RenderChart from '../components/RenderChart';
const deviceWidth = Dimensions.get('window').width;
export default function DetailPolaris({route, navigation}) {
    const [chartData, setChartData] = useState();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('y3');
    const bottomModal = React.useRef(null);
    const [type, setType] = useState(1);
    const [chart, setChart] = useState([]);
    const jump = useJump();
    const tabClick = useRef(true);
    const init = useCallback(() => {
        Http.get('/polaris/portfolio_detail/20210101', {
            poid: route.params.poid,
        })
            .then((res) => {
                setLoading(false);
                navigation.setOptions({
                    title: res.result.title,
                });
                setData(res.result);
                setChart([]);
                setPeriod(res.result?.parts_addition_data?.line.period);
                Http.get('/portfolio/yield_chart/20210101', {
                    upid: route.params.upid,
                    period: res.result?.parts_addition_data?.line.period,
                    type: type,
                    poid: route.params.poid,
                    allocation_id: res.result?.parts_addition_data?.line.allocation_id,
                    benchmark_id: res.result?.parts_addition_data?.line.benchmark_id,
                }).then((resp) => {
                    setChartData(resp.result);
                    setChart(resp.result.yield_info.chart);
                });
            })
            .catch(() => {
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params]);
    const renderLoading = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <Image
                    style={{
                        flex: 1,
                    }}
                    source={require('../../../assets/img/detail/loading.png')}
                    resizeMode={Image.resizeMode.contain}
                />
            </View>
        );
    };

    const changeTab = (p, t) => {
        if (!tabClick.current) {
            return false;
        }
        setPeriod(p);
        setType(t);
        if (p !== period) {
            tabClick.current = false;
            setChart([]);
            Http.get('/portfolio/yield_chart/20210101', {
                upid: route.params.upid,
                period: p,
                type: type,
                poid: route.params.poid,
                allocation_id: data?.parts_addition_data?.line.allocation_id,
                benchmark_id: data?.parts_addition_data?.line.benchmark_id,
            }).then((res) => {
                tabClick.current = true;
                setChartData(res.result);
                setChart(res.result.yield_info.chart);
            });
        }
    };
    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
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
    return loading ? (
        renderLoading()
    ) : (
        <>
            {Object.keys(data).length > 0 && (
                <ScrollView style={{marginBottom: FixedBtn.btnHeight, backgroundColor: Colors.bgColor, flex: 1}}>
                    {data?.processing_info && <Notice content={data?.processing_info} />}
                    {data?.top?.header?.img ? (
                        <FitImage source={{uri: data?.top?.header?.img}} resizeMode="contain" />
                    ) : null}
                    <View style={{padding: text(16), marginTop: data?.top?.header?.img ? text(-70) : 0}}>
                        <View style={[styles.card_sty]}>
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
                        </View>

                        <View
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: text(10),
                                paddingVertical: text(16),
                                marginBottom: text(16),
                            }}>
                            <Text style={[styles.card_title_sty, {paddingBottom: text(16)}]}>
                                {data?.part_line?.title}
                            </Text>

                            <View style={{minHeight: Platform.select({ios: text(240), android: text(248)})}}>
                                <RenderChart
                                    chartData={chartData}
                                    chart={chart}
                                    type={type}
                                    width={deviceWidth - text(40)}
                                />
                            </View>

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
                            {data?.part_line?.line?.desc ? (
                                <Text style={styles.line_desc}>{data?.part_line?.line?.desc}</Text>
                            ) : null}
                        </View>

                        <View style={[styles.card_sty, {paddingHorizontal: 0}]}>
                            <View style={{paddingHorizontal: text(16), marginBottom: text(16)}}>
                                <Text style={[styles.card_title_sty, {paddingHorizontal: 0, paddingBottom: text(10)}]}>
                                    {data?.part_pie?.title}
                                </Text>
                                {data?.part_pie?.desc ? (
                                    <Text style={{color: '#4E556C', fontSize: text(13)}}>{data?.part_pie?.desc}</Text>
                                ) : null}
                            </View>
                            {/* <View style={{height: text(340)}}>
                                <Chart initScript={pieChart(data?.part_pie?.pie?.items, data?.part_pie?.pie?.chart)} />
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
                                {data?.part_pie?.pie.table?.body?.map((_table, _index) => {
                                    const width = _index < data?.part_pie?.pie.table?.body.length - 1 ? 0.5 : 0;
                                    const padding = _index < data?.part_pie?.pie.table?.body.length - 1 ? text(13) : 0;
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                jump({path: 'FundDetail', params: {code: _table.code}});
                                            }}
                                            style={{padding: text(13), paddingBottom: 0}}
                                            key={_table.code}>
                                            <View
                                                style={[
                                                    Style.flexBetween,
                                                    styles.fund_item_sty,
                                                    {
                                                        borderBottomWidth: width,
                                                        paddingBottom: padding,
                                                    },
                                                ]}>
                                                <View style={{width: text(180)}}>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            color: '#333333',
                                                            fontSize: text(13),
                                                        }}>
                                                        {_table.fund_name}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: '#999999',
                                                            fontSize: text(11),
                                                            marginTop: text(5),
                                                            fontFamily: Font.numFontFamily,
                                                        }}>
                                                        {_table.code}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={{
                                                        color: '#333333',
                                                        fontSize: text(13),
                                                        width: text(80),
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
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        {data?.part_texts?.length > 0 && (
                            <View
                                style={[styles.card_sty, {paddingHorizontal: 0, paddingBottom: 0, overflow: 'hidden'}]}>
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
                        )}
                        {/* {showMask && <Mask />} */}
                        <BottomModal ref={bottomModal} title="收益率">
                            <View style={{padding: text(16)}}>
                                <Text style={{lineHeight: text(18)}}>
                                    此列展示组合内成分基金三个月内的收益率，代表了每只成分基金在组合中近三个月的收益率情况
                                </Text>
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
                        <Text
                            style={{
                                color: '#B8C1D3',
                                lineHeight: text(18),
                                fontSize: text(11),
                            }}>
                            {data.tip}
                        </Text>
                    </View>
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
    line_desc: {fontSize: text(12), paddingHorizontal: text(16), lineHeight: text(18), color: Colors.darkGrayColor},
    btn_choose_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(12),
        paddingVertical: text(5),
        borderRadius: text(15),
    },
});
