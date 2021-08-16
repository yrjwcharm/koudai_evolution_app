/*
 * @Author: xjh
 * @Date: 2021-01-26 14:21:25
 * @Description:长短期详情页
 * @LastEditors: yhc
 * @LastEditdate: 2021-03-01 17:21:42
 */
import React, {useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text, px} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import {histogram, pieChart} from './ChartOption';
import ListHeader from '../components/ListHeader';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FixedBtn from '../components/FixedBtn';
import {useFocusEffect} from '@react-navigation/native';
import {useJump} from '../../../components/hooks';
import Notice from '../../../components/Notice';
import RenderChart from '../components/RenderChart';
let risk_chart_min = '';
export default function DetailAccount({route, navigation}) {
    const jump = useJump();
    const [chartData, setChartData] = useState();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState();
    const [chart, setChart] = useState([]);
    const [type, setType] = useState(1);
    const [loading, setLoading] = useState(true);
    const tabClick = useRef(true);
    const changeTab = (p, t) => {
        if (!tabClick.current) {
            return false;
        }
        setPeriod(p);
        setType(t);
        if (p !== period) {
            global.LogTool('portfolioDetailChartSwitch', p);
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
    const rightPress = useCallback(() => {
        global.LogTool('portfolioDetailInstruction');
        navigation.navigate('ProductIntro', {upid: route?.params?.upid});
    }, [navigation, route]);
    const init = useCallback(() => {
        Http.get('/portfolio/detail/20210101', {
            upid: route?.params?.upid,
            fr: route.params?.fr,
            amount: route?.params?.amount,
        })
            .then((res) => {
                setLoading(false);
                if (res.code === '000000') {
                    setData(res.result);
                    risk_chart_min = Math.min.apply(
                        null,
                        res.result.risk_info?.chart.map(function (o) {
                            return o.val;
                        })
                    );
                    navigation.setOptions({
                        title: res.result.title,
                        headerRight: () => {
                            return (
                                <TouchableOpacity onPress={rightPress} activeOpacity={1}>
                                    <Text style={styles.right_sty}>{'产品说明书'}</Text>
                                </TouchableOpacity>
                            );
                        },
                    });
                    setPeriod(res.result.period);
                    setChart([]);
                    Http.get('/portfolio/yield_chart/20210101', {
                        allocation_id: res.result.allocation_id,
                        benchmark_id: res.result.benchmark_id,
                        poid: res.result.poid,
                        period: res.result.period,
                        type: 1,
                    }).then((resp) => {
                        setChartData(resp.result);
                        setChart(resp.result.yield_info.chart);
                    });
                }
            })
            .catch(() => {
                setLoading(false);
            });
    }, [navigation, rightPress, route.params]);
    const renderLoading = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 0.5,
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
            setType(1);
            init();
        }, [init])
    );

    return loading ? (
        renderLoading()
    ) : (
        <>
            {Object.keys(data).length > 0 ? (
                <ScrollView nestedScrollEnabled={true} style={{flex: 1, backgroundColor: Colors.bgColor}}>
                    {data?.processing_info && <Notice content={data?.processing_info} />}
                    <View style={[Style.flexRow, {alignItems: 'flex-end', height: text(94)}]}>
                        <View style={[Style.flexCenter, styles.container_sty]}>
                            <Text style={styles.amount_sty}>{data.ratio_info.ratio_val}</Text>
                            <Text style={styles.radio_sty}>{data.ratio_info.ratio_desc}</Text>
                        </View>
                        {data.line_drawback && data.low_line === 1 && (
                            <View style={[Style.flexCenter, styles.container_sty]}>
                                <Text
                                    style={[
                                        styles.amount_sty,
                                        {fontSize: text(26), lineHeight: text(30), color: Colors.defaultColor},
                                    ]}>
                                    {data.line_drawback.ratio_val}
                                </Text>
                                <Text style={[styles.radio_sty, {marginTop: text(6)}]}>
                                    {data.line_drawback.ratio_desc}
                                </Text>
                            </View>
                        )}
                    </View>
                    {data.low_line === 1 && (
                        <View style={{backgroundColor: '#fff'}}>
                            <View style={[Style.flexRowCenter, styles.tags]}>
                                {data.tags?.map((tag, index) => {
                                    return (
                                        <View key={tag} style={styles.tag}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                    <RenderChart lowLine={data.low_line} chartData={chartData} chart={chart} type={type} />

                    <View
                        style={{
                            flexDirection: 'row',
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#fff',
                            paddingHorizontal: text(20),
                        }}>
                        {chartData?.yield_info?.sub_tabs?.map((_item, _index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[
                                        styles.btn_sty,
                                        {
                                            backgroundColor: period == _item.val ? '#F1F6FF' : '#fff',
                                            borderWidth: period == _item.val ? 0 : 0.5,
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
                    {chartData?.yield_info?.remark && (data.low_line !== 1 || type !== 1) && (
                        <View
                            style={{
                                paddingBottom: text(20),
                                paddingHorizontal: Space.padding,
                                backgroundColor: '#fff',
                            }}>
                            <Text style={{marginTop: text(10), marginBottom: text(5)}}>
                                <MaterialCommunityIcons
                                    name={'circle-medium'}
                                    color={chartData?.yield_info?.remark?.color || '#4BA471'}
                                    size={15}
                                />
                                <Text style={{fontSize: text(12)}}>{chartData?.yield_info?.remark?.title} </Text>
                                <Text
                                    style={{
                                        color: chartData?.yield_info?.remark?.color || '#4BA471',
                                        fontSize: text(15),
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {chartData?.yield_info?.remark?.ratio}
                                </Text>
                            </Text>
                            {chartData?.yield_info?.remark?.content && (
                                <Html
                                    html={chartData?.yield_info?.remark?.content}
                                    style={{
                                        fontSize: Font.textSm,
                                        lineHeight: text(18),
                                        color: Colors.descColor,
                                        textAlign: 'justify',
                                    }}
                                />
                            )}
                            {data.low_line === 1 && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        global.LogTool('portfolioDetailFeatureStart', 'bottomline', 0);
                                        data.line_info?.button?.avail && jump(data.line_info?.button?.url);
                                    }}
                                    style={[
                                        Style.flexRowCenter,
                                        {
                                            borderColor: Colors.borderColor,
                                            borderTopWidth: Space.borderWidth,
                                            paddingTop: Space.padding,
                                            marginTop: Space.marginVertical,
                                            marginBottom: text(-4),
                                        },
                                    ]}>
                                    <Text
                                        style={{fontSize: Font.textH3, lineHeight: text(17), color: Colors.brandColor}}>
                                        {data.line_info?.button?.text}
                                    </Text>
                                    <FontAwesome
                                        name={'angle-right'}
                                        size={18}
                                        color={Colors.brandColor}
                                        style={{marginLeft: text(4)}}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* 底线 */}
                    {data.low_line === 1 && type === 1 && (
                        <View style={styles.line_con}>
                            <View style={styles.lowLineBox}>
                                <Text
                                    style={[
                                        {
                                            fontSize: Font.textH3,
                                            lineHeight: text(17),
                                            color: Colors.defaultColor,
                                            fontWeight: '500',
                                        },
                                        {paddingTop: text(12), paddingBottom: text(4)},
                                    ]}>
                                    {data.line_info?.line_desc?.title}
                                </Text>
                                <Html
                                    style={{
                                        fontSize: Font.textH3,
                                        lineHeight: text(19),
                                        color: Colors.descColor,
                                        textAlign: 'justify',
                                    }}
                                    html={data.line_info?.line_desc?.desc}
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    global.LogTool('portfolioDetailFeatureStart', 'bottomline', 0);
                                    data.line_info?.button?.avail && jump(data.line_info?.button?.url);
                                }}
                                style={styles.line_btn}>
                                {data.line_info?.tip ? (
                                    <View style={styles.line_flag}>
                                        <Text style={{color: '#fff', fontSize: px(11)}}>{data.line_info?.tip}</Text>
                                    </View>
                                ) : null}
                                <Text style={{fontSize: Font.textH3, lineHeight: text(17), color: Colors.brandColor}}>
                                    {data.line_info?.button?.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* 全球配置 */}
                    {data?.asset_deploy ? (
                        <View style={styles.card_sty}>
                            <ListHeader
                                data={data?.asset_deploy?.header}
                                color={Colors.brandColor}
                                ctrl={'global'}
                                oid={1}
                            />
                            <View style={{height: text(140)}}>
                                <Chart initScript={pieChart(data?.asset_deploy?.items, data?.asset_deploy?.chart)} />
                            </View>
                        </View>
                    ) : null}
                    {/* 组合策略 */}
                    {data?.asset_strategy ? (
                        <View style={styles.card_sty}>
                            <ListHeader data={data?.asset_strategy?.header} hide={true} />
                            {data?.asset_strategy?.items.map((item, index) => {
                                return (
                                    <View key={item.title + index} style={{marginTop: Space.marginVertical}}>
                                        <View style={[Style.flexRow, {marginBottom: text(2)}]}>
                                            <Image
                                                source={{uri: item.icon}}
                                                style={{width: text(18), height: text(18), marginRight: text(4)}}
                                            />
                                            <Text style={styles.row_title_sty}>{item.title}</Text>
                                        </View>
                                        <Text style={styles.adjust_desc_syl}>{item.content}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    ) : null}
                    {/* 智能调仓 */}
                    {data?.adjust_info ? (
                        <View style={styles.card_sty}>
                            <ListHeader data={data?.adjust_info.header} ctrl={'smartAdjustment'} oid={2} />
                            <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                                {data?.adjust_info.items.map((_i, _d) => {
                                    return (
                                        <View
                                            key={_d}
                                            style={{
                                                width: '50%',
                                                paddingTop: text(16),
                                                paddingRight: _d == 0 || _d == 2 ? text(20) : 0,
                                            }}>
                                            <View style={[Style.flexRow, {marginBottom: text(2)}]}>
                                                <Image
                                                    source={{uri: _i.icon}}
                                                    style={{height: text(15), width: text(15), marginRight: text(4)}}
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
                    ) : null}
                    {/* 资产增强 */}
                    {data?.asset_enhance ? (
                        <View style={styles.card_sty}>
                            <ListHeader data={data?.asset_enhance?.header} ctrl={'assets'} oid={3} />
                            <FitImage
                                source={{uri: data?.asset_enhance?.img}}
                                resizeMode="contain"
                                style={{marginTop: text(16)}}
                            />
                        </View>
                    ) : null}
                    {/* 风险控制 */}
                    {data?.risk_info ? (
                        <View style={styles.card_sty}>
                            <ListHeader data={data?.risk_info?.header} ctrl={'riskControl'} oid={4} />
                            <View style={{position: 'relative', paddingBottom: px(16)}}>
                                <View style={[Style.flexRow, {marginTop: text(13), paddingLeft: text(30)}]}>
                                    <View style={{flex: 1, position: 'relative'}}>
                                        <Text style={styles.row_title_sty}>{data?.risk_info?.sub_tab[0]?.title}</Text>
                                        <Text style={styles.row_desc_sty}>{data?.risk_info?.sub_tab[0]?.val}</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.row_title_sty}>{data?.risk_info?.sub_tab[1]?.title}</Text>
                                        <Text style={styles.row_desc_sty}>{data?.risk_info?.sub_tab[1]?.val}</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.row_title_sty}>{data?.risk_info?.sub_tab[2]?.title}</Text>
                                        <Text style={styles.row_desc_sty}>{data?.risk_info?.sub_tab[2]?.val}</Text>
                                    </View>
                                </View>
                                <View style={{height: text(168)}}>
                                    <Chart
                                        initScript={histogram(
                                            data?.risk_info.chart,
                                            risk_chart_min > data?.risk_info?.label[2]?.ratio
                                                ? data?.risk_info?.label[2]?.ratio
                                                : null,
                                            data?.risk_info?.label[2]?.ratio,
                                            text(160)
                                        )}
                                        style={{marginTop: text(-6), zIndex: 9}}
                                    />
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        paddingHorizontal: px(6),
                                    }}>
                                    <View style={[{flex: 1, fontSize: text(12)}, Style.flexRow]}>
                                        <Ionicons name={'square'} color={'#E74949'} size={10} />
                                        <Text> {data.risk_info?.label[0]?.key}</Text>
                                    </View>
                                    <View style={[{flex: 1, fontSize: text(12)}, Style.flexRow]}>
                                        <Ionicons name={'square'} color={'#545968'} size={10} />
                                        <Text> {data?.risk_info?.label[1]?.key}</Text>
                                    </View>
                                    <View
                                        style={{
                                            fontSize: text(12),
                                            marginBottom: px(-16),
                                        }}>
                                        <Text style={{fontSize: text(12)}}>--- {data?.risk_info?.label[2]?.key}</Text>
                                        <Text
                                            style={{
                                                fontSize: text(10),
                                            }}>
                                            {'       '}
                                            {data?.risk_info?.label[2]?.val}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : null}

                    <View style={[styles.card_sty, {paddingVertical: 0}]}>
                        {data?.gather_info.map((_info, _idx) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[
                                        Style.flexRow,
                                        {
                                            borderBottomWidth: _idx < data?.gather_info.length - 1 ? 0.5 : 0,
                                            borderColor: '#DDDDDD',
                                        },
                                    ]}
                                    key={_idx + 'info'}
                                    onPress={() => {
                                        global.LogTool('portfolioDetailFeatureStart', 'bottommenu', _idx);
                                        jump(_info.url);
                                    }}>
                                    <Text style={{flex: 1, paddingVertical: text(20)}}>{_info.title}</Text>
                                    <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                </TouchableOpacity>
                            );
                        })}
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
            ) : null}
            {data?.btns && <FixedBtn btns={data.btns} />}
        </>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        color: '#1F2432',
        width: text(90),
        marginRight: text(-10),
    },
    container_sty: {
        justifyContent: 'flex-end',
        paddingBottom: text(20),
        backgroundColor: '#fff',
        flex: 1,
        height: '100%',
    },
    amount_sty: {
        color: Colors.red,
        fontSize: text(34),
        lineHeight: text(40),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    legend_sty: {
        // flex: 1,
        alignItems: 'center',
    },
    legend_title_sty: {
        color: '#1F2432',
        // fontWeight: 'bold',
        fontSize: text(16),
        fontFamily: Font.numMedium,
        marginBottom: text(4),
        padding: 0, //处理textInput 在安卓上的兼容问题
    },
    legend_desc_sty: {
        fontSize: text(11),
        color: '#545968',
    },
    radio_sty: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: text(17),
        textAlign: 'center',
        marginTop: text(4),
    },
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(12),
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
        fontSize: text(10),
        textAlign: 'center',
        marginTop: text(3),
        fontFamily: Font.numFontFamily,
    },
    zan_sty: {
        width: text(24),
        height: text(24),
        position: 'absolute',
        bottom: 0,
    },
    lowLineBox: {
        marginTop: text(6),
        marginBottom: Space.marginVertical,
        paddingHorizontal: Space.padding,
        paddingBottom: text(14),
        borderRadius: Space.borderRadius,
        backgroundColor: '#F1F7FF',
    },
    tags: {
        marginHorizontal: Space.marginAlign,
        marginBottom: Space.marginVertical,
        paddingBottom: text(20),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tag: {
        marginHorizontal: text(4),
        paddingVertical: text(2),
        paddingHorizontal: text(10),
        borderRadius: text(4),
        backgroundColor: '#F0F6FD',
    },
    tagText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.brandColor,
    },
    line_btn: {
        paddingVertical: px(8),
        borderColor: Colors.brandColor,
        borderWidth: 1,
        borderRadius: px(18),
        paddingHorizontal: px(24),
        marginBottom: px(16),
    },
    line_con: {
        paddingHorizontal: Space.padding,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
    },
    line_flag: {
        paddingVertical: px(3),
        paddingHorizontal: px(6),
        backgroundColor: Colors.red,
        borderRadius: px(8),
        borderBottomLeftRadius: 0,
        position: 'absolute',
        right: -px(30),
        top: -px(8),
    },
});
