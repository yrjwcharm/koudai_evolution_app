/*
 * @Author: xjh
 * @Date: 2021-01-26 14:21:25
 * @Description:长短期详情页
 * @LastEditors: Please set LastEditors
 * @LastEditdate: 2021-03-01 17:21:42
 */
import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, DeviceEventEmitter} from 'react-native';
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
import RenderChart from '../components/RenderChart';
import NumText from '../../../components/NumText';
import Praise from '../../../components/Praise';
import {throttle} from 'lodash';
import {BottomModal} from '../../../components/Modal';
import {withErrorBoundary} from 'react-native-error-helper';
import GuideTips from '../../../components/GuideTips';

function DetailAccount({route, navigation}) {
    const jump = useJump();
    const [chartData, setChartData] = useState();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState();
    const [chart, setChart] = useState([]);
    const [type, setType] = useState(1);
    const [loading, setLoading] = useState(true);
    const [riskChartMin, setRiskChartMin] = useState(0);
    const bottomModal = React.useRef(null);
    const [tipsDataOfBottomModal, setTipsDataOfBottomModal] = useState({});
    const [commentData, setCommentData] = useState({});
    const changeTab = useCallback(
        throttle((p, t) => {
            setPeriod((prev) => {
                if (p !== prev) {
                    global.LogTool('portfolioDetailChartSwitch', p);
                    setChart([]);
                    Http.get('/portfolio/yield_chart/20210101', {
                        allocation_id: data.allocation_id,
                        benchmark_id: data.benchmark_id,
                        poid: data.poid,
                        period: p,
                        type: t,
                        fr: route.params?.fr,
                        risk_level: route?.params?.risk_level,
                    }).then((resp) => {
                        setChartData(resp.result);
                        setChart(resp.result.yield_info.chart);
                    });
                }
                return p;
            });
            setType(t);
        }, 500),
        [data]
    );
    const init = useCallback(() => {
        if (route.params.scene === 'adviser') {
            Http.get('/adviser/detail/20210923', {poid: route.params.poid})
                .then((res) => {
                    if (res.code === '000000') {
                        navigation.setOptions({title: res.result.title});
                        setData(res.result);
                    }
                    setPeriod(res.result.period);
                    setChart([]);
                    Http.get('/portfolio/yield_chart/20210101', {
                        allocation_id: res.result.allocation_id,
                        benchmark_id: res.result.benchmark_id,
                        poid: res.result.poid,
                        period: res.result.period,
                        type: 1,
                        fr: route.params?.fr,
                        risk_level: route?.params?.risk_level,
                    }).then((resp) => {
                        if (resp.code === '000000') {
                            setChartData(resp.result);
                            setChart(resp.result.yield_info.chart || []);
                        }
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            Http.get('/portfolio/detail/20210101', {
                upid: route?.params?.upid,
                fr: route.params?.fr,
                amount: route?.params?.amount,
                risk_level: route?.params?.risk_level,
            })
                .then((res) => {
                    setLoading(false);
                    if (res.code === '000000') {
                        if (res.result.account_id) {
                            Http.get('/community/comment/top/20220101', {account_id: res.result.account_id}).then(
                                (resp) => {
                                    if (resp.code === '000000') {
                                        setCommentData(resp.result);
                                    }
                                }
                            );
                        }
                        setRiskChartMin(
                            Math.min.apply(
                                res.result?.risk_info?.label && res.result?.risk_info?.label[2]
                                    ? res.result.risk_info?.label[2].ratio
                                    : 0,
                                res.result.risk_info?.chart.map(function (o) {
                                    return o.val;
                                })
                            )
                        );
                        setData(res.result);
                        navigation.setOptions({
                            title: res.result.title,
                            headerRight: () => {
                                return res.result?.top_right_button ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            global.LogTool('top_right_button');
                                            jump(
                                                res.result?.top_right_button?.url,
                                                res.result?.top_right_button?.jump_type
                                            );
                                        }}
                                        activeOpacity={1}>
                                        <Text style={styles.right_sty}>{res.result?.top_right_button?.text}</Text>
                                    </TouchableOpacity>
                                ) : null;
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
                            fr: route.params?.fr,
                            risk_level: route?.params?.risk_level,
                        }).then((resp) => {
                            setChartData(resp.result);
                            setChart(resp.result.yield_info.chart);
                        });
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
            const listener = DeviceEventEmitter.addListener('attentionRefresh', init);
            return () => {
                listener.remove();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
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
                <ScrollView
                    bounces={false}
                    nestedScrollEnabled={true}
                    style={{flex: 1, backgroundColor: Colors.bgColor}}>
                    {data.secondary_title ? (
                        <View style={{backgroundColor: '#fff', paddingBottom: px(4)}}>
                            <Text style={styles.secondaryTitle}>{data.secondary_title}</Text>
                        </View>
                    ) : null}
                    <View style={{paddingTop: px(12), flexDirection: 'row', backgroundColor: '#fff'}}>
                        <View style={[Style.flexCenter, styles.container_sty]}>
                            <NumText
                                style={{
                                    ...styles.amount_sty,
                                    fontSize: data.ratio_info?.type == 1 ? px(34) : px(26),
                                    lineHeight: text(30),
                                }}
                                text={data.ratio_info.ratio_val}
                                type={data.ratio_info?.type}
                            />
                            <View style={Style.flexRowCenter}>
                                <Html html={data?.ratio_info?.ratio_desc} style={styles.radio_sty} />
                                {data?.ratio_info?.tips ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setTipsDataOfBottomModal(data?.ratio_info?.tips);
                                            bottomModal.current.show();
                                        }}
                                        style={{...styles.radio_sty, marginLeft: px(4)}}>
                                        <Image
                                            style={{width: text(12), height: text(12)}}
                                            source={require('../../../assets/img/tip.png')}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                        {data.line_drawback && (
                            <View style={[Style.flexCenter, styles.container_sty]}>
                                <Text
                                    style={[
                                        styles.amount_sty,
                                        {fontSize: text(26), lineHeight: text(30), color: Colors.defaultColor},
                                    ]}>
                                    {data.line_drawback.ratio_val}
                                </Text>
                                <View style={Style.flexRowCenter}>
                                    <Html style={styles.radio_sty} html={data?.line_drawback?.ratio_desc} />
                                    {data?.line_drawback?.tips ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setTipsDataOfBottomModal(data?.line_drawback?.tips);
                                                bottomModal.current.show();
                                            }}
                                            style={{...styles.radio_sty, marginLeft: px(4)}}>
                                            <Image
                                                resizeMode="contain"
                                                style={{width: text(12), height: text(12)}}
                                                source={require('../../../assets/img/tip.png')}
                                            />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                {data?.line_drawback?.ratio_text ? (
                                    <Text style={[styles.radio_sty, {fontSize: px(11)}]}>
                                        {data?.line_drawback?.ratio_text}
                                    </Text>
                                ) : null}
                            </View>
                        )}
                        {data.rise_info && (
                            <View style={[Style.flexCenter, styles.container_sty]}>
                                <NumText
                                    style={{
                                        ...styles.amount_sty,
                                        fontSize: text(26),
                                        lineHeight: text(30),
                                    }}
                                    text={data.rise_info.ratio_val}
                                />
                                <Text style={[styles.radio_sty, {marginTop: text(6)}]}>
                                    {data.rise_info.ratio_desc}
                                </Text>
                            </View>
                        )}
                    </View>
                    {data.tags ? (
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
                    ) : null}
                    <RenderChart
                        lowLine={data.low_line}
                        chartData={chartData}
                        chart={chart}
                        type={type}
                        chartProps={{
                            tag_position: {
                                splitTag: chart.find((item) => +item.update === 1),
                            },
                            ownColor: true,
                            snap: true,
                        }}
                    />
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
                    {chartData?.yield_info?.remark && type !== 1 && (
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
                            {data.line_info ? (
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
                            ) : null}
                        </View>
                    )}
                    {/* 底线 */}
                    {type === 1 && (
                        <View style={styles.line_con}>
                            {data.line_info ? (
                                <>
                                    {data.line_info?.line_desc?.title ? (
                                        <View style={styles.lowLineBox}>
                                            {data.line_info?.line_desc?.title ? (
                                                <Text style={styles.line_desc_title}>
                                                    {data.line_info?.line_desc?.title}
                                                </Text>
                                            ) : null}
                                            {data.line_info?.line_desc?.desc ? (
                                                <Html
                                                    style={{
                                                        fontSize: Font.textH3,
                                                        lineHeight: text(19),
                                                        color: Colors.descColor,
                                                        textAlign: 'justify',
                                                    }}
                                                    html={data.line_info?.line_desc?.desc}
                                                />
                                            ) : null}
                                        </View>
                                    ) : null}
                                    <View>
                                        <Html html={data.line_info?.line_desc?.tip} />
                                    </View>
                                    {data.line_info?.button ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                global.LogTool('portfolioDetailFeatureStart', 'bottomline', 0);
                                                data.line_info?.button?.avail && jump(data.line_info?.button?.url);
                                            }}
                                            style={styles.line_btn}>
                                            {data.line_info?.tip ? (
                                                <View style={styles.line_flag}>
                                                    <Text style={{color: '#fff', fontSize: px(11)}}>
                                                        {data.line_info?.tip}
                                                    </Text>
                                                </View>
                                            ) : null}
                                            <Text
                                                style={{
                                                    fontSize: Font.textH3,
                                                    lineHeight: text(17),
                                                    color: Colors.brandColor,
                                                }}>
                                                {data.line_info?.button?.text}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </>
                            ) : null}
                            {data.line_desc ? (
                                <View style={styles.line_tip}>
                                    <Text style={styles.line_tip_text}>{data.line_desc.desc}</Text>
                                </View>
                            ) : null}
                        </View>
                    )}
                    {/* 产品介绍 */}
                    {data?.portfolio_intro ? (
                        <TouchableOpacity
                            style={styles.card_sty}
                            activeOpacity={0.9}
                            onPress={() => {
                                jump(data?.portfolio_intro?.url);
                            }}>
                            <Html html={data?.portfolio_intro?.text} />
                        </TouchableOpacity>
                    ) : null}
                    {/* 全球配置 */}
                    {data?.asset_deploy ? (
                        <View style={styles.card_sty}>
                            <ListHeader
                                data={data?.asset_deploy?.header}
                                color={route.params.scene === 'adviser' ? Colors.descColor : Colors.brandColor}
                                ctrl={'global'}
                                oid={1}
                            />
                            <View style={{height: Platform.select({android: text(150), ios: text(140)})}}>
                                <Chart
                                    initScript={pieChart(
                                        data?.asset_deploy?.items,
                                        data?.asset_deploy?.chart,
                                        route.params.scene === 'adviser' ? '资产配置' : '',
                                        Platform.select({android: text(150), ios: text(140)}),
                                        data?.asset_deploy?.items?.map?.((item) => item.color)
                                    )}
                                />
                            </View>
                            {data.asset_deploy.item_tip ? (
                                <Text
                                    style={{
                                        fontSize: Font.textH3,
                                        lineHeight: px(19),
                                        color: Colors.lightGrayColor,
                                        marginTop: Space.marginVertical,
                                    }}>
                                    {data.asset_deploy.item_tip}
                                </Text>
                            ) : null}
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
                    {data?.estimate ? (
                        <View style={styles.card_sty}>
                            <ListHeader data={data?.estimate?.header} ctrl={'estimate'} oid={5} hide />
                            <FitImage
                                resizeMode="contain"
                                source={{uri: data?.estimate?.img}}
                                style={{marginVertical: text(12)}}
                            />
                            <Text style={styles.estimateDesc}>{data?.estimate?.desc}</Text>
                        </View>
                    ) : null}
                    {/* 风险控制 */}
                    {data?.risk_info ? (
                        <View style={styles.card_sty}>
                            <ListHeader data={data?.risk_info?.header} ctrl={'riskControl'} oid={4} />
                            <View style={{position: 'relative'}}>
                                <View style={[Style.flexRow, {marginTop: text(13), paddingLeft: text(30)}]}>
                                    {data?.risk_info?.sub_tab?.map((item, index) => (
                                        <View style={{flex: 1}} key={index}>
                                            <Text style={styles.row_title_sty}>{item?.title}</Text>
                                            <Text style={styles.row_desc_sty}>{item?.val}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={{height: text(168)}}>
                                    <Chart
                                        initScript={histogram(
                                            data?.risk_info.chart,
                                            (Math.floor(riskChartMin / 3) - 1) * 3,
                                            data?.risk_info?.label && data?.risk_info?.label[2]
                                                ? data?.risk_info?.label[2]?.ratio
                                                : undefined,
                                            text(160)
                                        )}
                                        style={{marginTop: text(-6), zIndex: 9}}
                                    />
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: px(6),
                                    }}>
                                    <View style={[{fontSize: text(12)}, Style.flexRow]}>
                                        <Ionicons name={'square'} color={'#E74949'} size={10} />
                                        <Text> {data.risk_info?.label[0]?.key}</Text>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                fontSize: text(12),
                                            },
                                            Style.flexRow,
                                        ]}>
                                        <Ionicons name={'square'} color={'#545968'} size={10} />
                                        <Text> {data?.risk_info?.label[1]?.key}</Text>
                                    </View>
                                </View>
                                {data?.risk_info?.label?.[2] ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: px(6),
                                            marginTop: px(16),
                                        }}>
                                        <Text>--- {data?.risk_info?.label[2]?.key}</Text>
                                        <Text>
                                            {'       '}
                                            {data?.risk_info?.label[2]?.val}
                                        </Text>
                                    </View>
                                ) : null}
                                {data?.risk_info?.chart_tips && (
                                    <View style={{paddingTop: text(14)}}>
                                        <Html html={data?.risk_info?.chart_tips} />
                                    </View>
                                )}
                            </View>
                        </View>
                    ) : null}
                    {/* 用户评论 */}
                    {Object.keys(commentData || {}).length > 0 ? (
                        <View style={styles.card_sty}>
                            <ListHeader color={Colors.brandColor} data={commentData.header} ctrl={'comment'} oid={6} />
                            {commentData.items?.map?.((item, index) => {
                                return (
                                    <View
                                        style={[
                                            styles.commentItem,
                                            index === 0 ? {paddingTop: 0, borderTopWidth: 0} : {},
                                        ]}
                                        key={item + index}>
                                        <View style={[Style.flexBetween, {alignItems: 'flex-start'}]}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Image
                                                    source={{
                                                        uri: item.avatar,
                                                    }}
                                                    style={styles.avatar}
                                                />
                                                <View>
                                                    <Text style={styles.nickname}>{item.name}</Text>
                                                    <Text style={styles.commentDate}>{item.time}</Text>
                                                </View>
                                            </View>
                                            <Praise comment={item} type="product" />
                                        </View>
                                        <Text numberOfLines={4} style={styles.commentContent}>
                                            {item.content}
                                        </Text>
                                    </View>
                                );
                            })}
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
                                    <View style={Style.flexRow}>
                                        {_info.desc ? (
                                            <Text style={{color: Colors.lightGrayColor, marginRight: px(8)}}>
                                                {_info.desc}
                                            </Text>
                                        ) : null}
                                        <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{marginTop: Space.marginVertical, paddingHorizontal: Space.padding}}>
                        <Text style={styles.bottomTip}>
                            {data?.advisor_tip?.text}
                            {data?.advisor_tip?.agreements
                                ? data?.advisor_tip?.agreements?.map((item, index) => {
                                      return (
                                          <Text
                                              key={index}
                                              style={{color: Colors.btnColor}}
                                              onPress={() => {
                                                  jump(item.url);
                                              }}>
                                              {item?.title}
                                          </Text>
                                      );
                                  })
                                : null}
                        </Text>
                    </View>
                    <BottomDesc style={{marginTop: text(80)}} fix_img={data?.advisor_footer_img} />
                </ScrollView>
            ) : null}
            {data?.guide_tip ? (
                <GuideTips data={data?.guide_tip} style={{position: 'absolute', bottom: px(120)}} />
            ) : null}
            {data?.btns && <FixedBtn btns={data.btns} />}
            <BottomModal ref={bottomModal} title={tipsDataOfBottomModal?.title}>
                <View style={[{padding: text(16)}]}>
                    {tipsDataOfBottomModal?.content?.map?.((item, index) => {
                        return (
                            <View key={item + index} style={{marginTop: index === 0 ? 0 : text(16)}}>
                                {item.key ? <Text style={styles.tipTitle}>{item.key}:</Text> : null}
                                <Html style={{lineHeight: text(18), fontSize: text(13)}} html={item.val} />
                            </View>
                        );
                    })}
                </View>
            </BottomModal>
        </>
    );
}
const SafeCenter = withErrorBoundary({
    renderBoundary: ({error}) => {
        return <Text>catch error: {error.message}</Text>;
    },
})(DetailAccount);
export default SafeCenter;
const styles = StyleSheet.create({
    right_sty: {
        color: '#1F2432',
        width: text(90),
        marginRight: text(-10),
    },
    container_sty: {
        justifyContent: 'flex-start',
        paddingBottom: text(20),
        backgroundColor: '#fff',
        flex: 1,
        height: '100%',
    },
    secondaryTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.lightGrayColor,
        textAlign: 'center',
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
        paddingBottom: px(20),
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
    bottomTip: {
        fontSize: Font.textSm,
        lineHeight: text(18),
        color: '#B8C1D3',
    },
    line_tip: {
        marginTop: text(6),
        marginBottom: Space.marginVertical,
        padding: text(12),
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    line_tip_text: {
        fontSize: Font.textH3,
        lineHeight: text(19),
        color: Colors.descColor,
    },
    estimateDesc: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
    line_desc_title: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
        fontWeight: '500',
        paddingTop: text(12),
        paddingBottom: text(4),
    },
    tipTitle: {
        fontWeight: 'bold',
        lineHeight: text(20),
        fontSize: text(14),
        marginBottom: text(4),
    },
    commentItem: {
        marginTop: Space.marginVertical,
        paddingTop: Space.padding,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    avatar: {
        marginRight: text(12),
        borderRadius: text(100),
        width: text(32),
        height: text(32),
    },
    nickname: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
    },
    commentDate: {
        marginTop: text(1),
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.lightGrayColor,
    },
    commentContent: {
        marginTop: text(8),
        fontSize: text(13),
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
});
