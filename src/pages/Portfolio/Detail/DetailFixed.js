/*
 * @Author: xjh
 * @Date: 2021-01-27 16:21:38
 * @Description:低估值智能定投
 * @LastEditors: dx
 * @LastEditTime: 2021-04-16 23:03:12
 */

import React, {useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text, px, deviceWidth} from '../../../utils/appUtil';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../../components/BottomDesc';
import FitImage from 'react-native-fit-image';
import FixedBtn from '../components/FixedBtn';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '../../../components/hooks';
import Notice from '../../../components/Notice';
import RenderChart from '../components/RenderChart';

export default function DetailAccount({route, navigation}) {
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y3');
    const [chartData, setChartData] = useState();
    const [type, setType] = useState(1);
    const [chart, setChart] = useState();
    const jump = useJump();
    const [loading, setLoading] = useState(true);
    const tabClick = useRef(true);
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
                allocation_id: data.allocation_id,
                benchmark_id: data.benchmark_id,
                poid: data.poid,
                period: p,
                type: t,
            }).then((resp) => {
                tabClick.current = true;
                setChartData(resp.result);
                setChart(resp.result.yield_info.chart);
            });
        }
    };

    const init = useCallback(() => {
        Http.get('/portfolio/fix_invest_detail/20210101', {
            upid: route?.params?.upid,
            poid: route?.params?.poid,
            amount: route?.params?.amount,
        })
            .then((res) => {
                setLoading(false);
                navigation.setOptions({
                    title: res.result.title,
                });
                setData(res.result);
                setPeriod(res.result.period);
                Http.get('/portfolio/yield_chart/20210101', {
                    upid: route.params.upid,
                    period: res.result.period,
                    type: type,
                    allocation_id: res.result.allocation_id,
                    benchmark_id: res.result.benchmark_id,
                    poid: route?.params?.poid,
                }).then((resp) => {
                    setChart(resp.result.yield_info.chart);
                    setChartData(resp.result);
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

    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );

    return loading ? (
        renderLoading()
    ) : (
        <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
            {Object.keys(data).length > 0 && (
                <ScrollView>
                    {data?.processing_info && <Notice content={data?.processing_info} />}
                    <View style={[styles.container_sty]}>
                        <Text style={{color: '#4E556C', fontSize: text(13), paddingTop: text(6), textAlign: 'center'}}>
                            {data?.ratio_info?.title}
                        </Text>
                        <Text
                            style={{
                                paddingTop: text(16),
                                paddingBottom: text(8),
                                textAlign: 'center',
                            }}>
                            <Text style={styles.amount_sty}>{data?.ratio_info?.ratio_val}</Text>
                            <Text style={styles.radio_sty}> {data?.ratio_info?.ratio_desc}</Text>
                        </Text>
                        <View style={Style.flexRowCenter}>
                            {data?.ratio_info?.label.map((_label, _index) => {
                                return (
                                    <View style={styles.label_sty} key={_index + 'label'}>
                                        <Text style={{color: '#0051CC', fontSize: text(11)}}>{_label}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <RenderChart chartData={chartData} chart={chart} type={type} />
                    <View
                        style={{
                            flexDirection: 'row',
                            height: px(60),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                        }}>
                        {chartData?.yield_info?.sub_tabs?.map((_item, _index, arr) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[
                                        styles.btn_sty,
                                        {
                                            backgroundColor: period == _item.val ? '#F1F6FF' : '#fff',
                                            borderWidth: period == _item.val ? 0 : 0.5,
                                            marginRight: _index < arr.length - 1 ? text(10) : 0,
                                        },
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

                    <View style={{paddingHorizontal: Space.padding}}>
                        <View>
                            {data?.asset_intros?.map((_i, _d) => {
                                return (
                                    <FitImage
                                        key={_d}
                                        source={{uri: _i}}
                                        resizeMode="contain"
                                        style={{marginTop: text(16)}}
                                    />
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
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[
                                                Style.flexBetween,
                                                styles.content_warp_sty,
                                                {borderBottomWidth: borderBottom},
                                            ]}
                                            onPress={() => navigation.navigate('FundDetail', {code: _a.code})}
                                            key={_index + '_a'}>
                                            <View>
                                                <Text style={styles.content_title_sty}>{_a.name}</Text>
                                                <Text
                                                    style={{color: '#9397A3', fontSize: text(11), marginTop: text(5)}}>
                                                    ({_a.code})
                                                </Text>
                                            </View>
                                            <Text style={[styles.content_title_sty, {fontFamily: Font.numFontFamily}]}>
                                                {_a.percent}
                                            </Text>
                                        </TouchableOpacity>
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
            {Object.keys(data).length > 0 && <FixedBtn btns={data.btns} activeOpacity={1} />}
        </View>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#1F2432',
    },
    container_sty: {
        backgroundColor: '#fff',
        paddingBottom: text(20),
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
        // fontWeight: 'bold',
        fontSize: text(16),
        marginBottom: text(4),
        fontFamily: Font.numFontFamily,
        padding: 0, //处理textInput 在安卓上的兼容问题
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
        paddingHorizontal: text(12),
        paddingVertical: text(5),
        borderRadius: text(15),
        marginRight: text(10),
    },
    // card_sty: {
    //     backgroundColor: '#fff',
    //     borderRadius: text(10),
    //     padding: Space.padding,
    //     marginHorizontal: Space.padding,
    //     marginTop: text(12),
    // },
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
        paddingVertical: text(13),
        paddingHorizontal: text(9),
        borderColor: Colors.borderColor,
    },
    content_title_sty: {
        color: Colors.defaultFontColor,
        fontSize: text(13),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: Space.padding,
        marginTop: text(12),
    },
});
