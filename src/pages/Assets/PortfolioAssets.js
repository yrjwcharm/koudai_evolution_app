/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: xjh
 * @Date: 2021-02-19 10:33:09
 * @Description:组合持仓页
 * @LastEditors: dx
 * @LastEditTime: 2021-04-08 16:46:06
 */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    Dimensions,
    RefreshControl,
} from 'react-native';
import {Colors, Font, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {baseAreaChart} from '../Portfolio/components/ChartOption';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomDesc from '../../components/BottomDesc';
import {Chart} from '../../components/Chart';
import Notice from '../../components/Notice';
import storage from '../../utils/storage';
import FitImage from 'react-native-fit-image';
import {Modal, BottomModal} from '../../components/Modal';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import CircleLegend from '../../components/CircleLegend';
import FastImage from 'react-native-fast-image';
import EmptyTip from '../../components/EmptyTip';
const deviceWidth = Dimensions.get('window').width;

export default function PortfolioAssets(props) {
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});
    const [card, setCard] = useState({});
    const [chart, setChart] = useState({});
    const [chartData, setChartData] = useState([]);
    const [showEye, setShowEye] = useState(true);
    const [left, setLeft] = useState('0%');
    const [widthD, setWidthD] = useState('0%');
    const [period, setPeriod] = useState('m1');
    const [tip, setTip] = useState({});
    const [tag, setTag] = useState();
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const bottomModal = React.useRef(null);
    const jump = useJump();

    const changeTab = (p) => {
        setPeriod(p);
    };
    const init = useCallback(() => {
        Http.get('/position/detail/20210101', {
            poid: props.route?.params?.poid,
        }).then((res) => {
            setData(res.result);
            setRefreshing(false);
            props.navigation.setOptions({
                title: res.result.title,
            });
            if (res.result?.progress_bar) {
                let _l = '';
                const _left = res.result?.progress_bar?.percent_text;
                if (_left.split('%')[0] < 10) {
                    _l = _left.split('%')[0] - 1 + '%';
                } else {
                    _l = _left.split('%')[0] + '%';
                }
                setLeft(_l);
                setWidthD(res.result.progress_bar.percent_text);
            }
        });
        Http.get('/position/console/20210101', {
            poid: props.route?.params?.poid,
        }).then((res) => {
            setCard(res.result);
        });
    }, [props.route.params]);
    const getChartInfo = () => {
        Http.get('/position/chart/20210101', {
            poid: props.route?.params?.poid,
            period: period,
        }).then((res) => {
            setChartData([]);
            setChart(res.result);
            setChartData(res.result.chart);
            setTag(res.result.tag_position);
        });
    };
    useEffect(() => {
        getChartInfo();
    }, [period]);
    useFocusEffect(
        useCallback(() => {
            init();
            storage.get('portfolioAssets').then((res) => {
                setShowEye(res ? res : 'true');
            });
        }, [init])
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
    const onHide = ({items}) => {
        _textTime.current.setNativeProps({text: chart?.label[0].val});
        _textPortfolio.current.setNativeProps({
            text: chart?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(chart?.label[1].val)}],
        });
        _textBenchmark.current.setNativeProps({
            text: chart?.label[2].val,
            style: [styles.legend_title_sty, {color: getColor(chart?.label[2].val)}],
        });
    };
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.toString().replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.toString().replace(/,/g, '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            storage.save('portfolioAssets', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    }, []);

    const accountJump = (url, type) => {
        Http.get('/position/popup/20210101', {poid: props.route?.params?.poid, action: type}).then((res) => {
            if (res.result) {
                if (res.result?.button_list) {
                    Modal.show({
                        title: res.result?.title || '提示',
                        content: res.result?.content || '确认赎回？',
                        confirm: true,
                        cancelText: res.result?.button_list[0]?.text || '确认赎回',
                        confirmText: res.result?.button_list[1]?.text || '再想一想',
                        cancelCallBack: () => jump(res?.result?.button_list[0]?.url || url),
                        confirmCallBack: () => jump(res?.result?.button_list[1]?.url || url),
                    });
                } else {
                    Modal.show({
                        title: res.result?.title || '提示',
                        content: res.result?.content || '确认赎回？',
                        confirm: true,
                        cancelText: '确认赎回',
                        confirmText: '再想一想',
                        cancelCallBack: () => jump(url),
                    });
                }
            } else {
                jump(url);
            }
        });
    };
    const showTips = (tips) => {
        setTip(tips);
        bottomModal.current.show();
    };
    const renderBtn = () => {
        return (
            <View style={styles.plan_card_sty}>
                <View style={[Style.flexRow, {justifyContent: 'center'}]}>
                    <Html style={styles.plan_title_sty} html={card?.title_info?.content} />
                    {card?.title_info?.popup ? (
                        <TouchableOpacity onPress={() => showTips(card?.title_info?.popup)}>
                            <Image
                                style={{width: text(20), height: text(20), marginTop: text(3)}}
                                source={require('../../assets/img/tip.png')}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
                {card?.desc ? (
                    <View style={{marginTop: px(13)}}>
                        <Html style={styles.plan_desc_sty} html={card?.desc} />
                    </View>
                ) : null}

                {card?.notice ? (
                    <View style={styles.blue_wrap_style}>
                        <Text style={styles.blue_text_style}>{card?.notice}</Text>
                    </View>
                ) : null}
                <View style={[Style.flexRow, {justifyContent: 'space-between', marginTop: text(14)}]}>
                    {card.button_list.map((_button, _index, arr) => {
                        return (
                            <TouchableOpacity
                                key={_index + '_button'}
                                onPress={() => accountJump(_button.url, _button.action)}
                                disabled={_button.avail == 0}
                                activeOpacity={1}
                                style={{
                                    borderColor: '#4E556C',
                                    borderWidth: _index == arr.length - 1 && _button.avail !== 0 ? 0.5 : 0,
                                    borderRadius: text(6),
                                    backgroundColor:
                                        _button.avail !== 0
                                            ? _index == arr.length - 1
                                                ? '#fff'
                                                : '#0051CC'
                                            : '#C7D8F0',
                                    flex: 1,
                                    marginRight: _index < card.button_list.length - 1 ? text(10) : 0,
                                    height: text(40),
                                    justifyContent: 'center',
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: px(14),
                                        color:
                                            _index == arr.length - 1
                                                ? _button.avail == 0
                                                    ? '#fff'
                                                    : '#545968'
                                                : '#fff',
                                    }}>
                                    {_button.text}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };
    const renderChart = () => {
        return (
            <>
                <Text style={[styles.title_sty, {paddingVertical: text(16)}]}>{chart?.title}</Text>
                <View
                    style={{
                        paddingTop: text(16),
                        paddingBottom: text(10),
                        backgroundColor: '#fff',
                        borderRadius: text(10),
                    }}>
                    <View
                        style={{
                            height: 260,
                        }}>
                        {chart?.label && chart?.label?.length > 0 ? (
                            <View style={[Style.flexRow, {justifyContent: 'space-evenly'}]}>
                                <View style={[styles.legend_sty]}>
                                    <TextInput
                                        ref={_textTime}
                                        style={[styles.legend_title_sty, {width: text(100)}]}
                                        defaultValue={chart?.label[0]?.val}
                                        editable={false}
                                    />
                                    <Text style={styles.legend_desc_sty}>{chart?.label[0]?.name}</Text>
                                </View>
                                <View style={styles.legend_sty}>
                                    <TextInput
                                        style={[styles.legend_title_sty, {color: getColor(chart?.label[1]?.val)}]}
                                        ref={_textPortfolio}
                                        defaultValue={chart?.label[1]?.val}
                                        editable={false}
                                    />
                                    <View style={[Style.flexRow, {alignItems: 'center'}]}>
                                        <CircleLegend color={['#FFECEC', '#E74949']} />
                                        <Text style={styles.legend_desc_sty}>{chart?.label[1]?.name}</Text>
                                    </View>
                                </View>
                                <View style={styles.legend_sty}>
                                    <TextInput
                                        style={[styles.legend_title_sty, {color: getColor(chart?.label[2]?.val)}]}
                                        ref={_textBenchmark}
                                        defaultValue={chart?.label[2]?.val}
                                        editable={false}
                                    />
                                    <View style={[Style.flexRow, {alignItems: 'center'}]}>
                                        <CircleLegend color={['#E8EAEF', '#545968']} />
                                        <Text style={styles.legend_desc_sty}>{chart?.label[2]?.name}</Text>
                                        {chart?.tips && (
                                            <TouchableOpacity onPress={() => showTips(chart.tips)}>
                                                <Image
                                                    style={{width: text(16), height: text(16)}}
                                                    source={require('../../assets/img/tip.png')}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ) : null}
                        {chartData.length > 0 ? (
                            <Chart
                                initScript={baseAreaChart(
                                    chart?.chart,
                                    [Colors.red, Colors.lightBlackColor, 'transparent'],
                                    ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                                    true,
                                    2,
                                    deviceWidth - text(40),
                                    10,
                                    tag
                                )}
                                onChange={onChartChange}
                                onHide={onHide}
                                style={{width: '100%'}}
                            />
                        ) : (
                            <EmptyTip
                                style={{paddingTop: px(40)}}
                                imageStyle={{width: px(150), resizeMode: 'contain'}}
                            />
                        )}
                    </View>
                    {chart?.sub_tabs && chart?.chart.length > 0 && (
                        <View style={styles.sub_tabs}>
                            {chart?.sub_tabs?.map((_item, _index, arr) => {
                                return (
                                    <TouchableOpacity
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
                    )}
                </View>
            </>
        );
    };
    const renderFixedPlan = () => {
        return (
            <>
                <TouchableOpacity
                    style={[Style.flexBetween, {marginBottom: text(12), marginTop: text(20)}]}
                    onPress={() => jump(data.asset_deploy?.header.url)}>
                    <Text style={styles.title_sty}>{data.asset_deploy?.header?.title}</Text>
                    <Text style={{color: '#0051CC', fontSize: text(12)}}>{data.asset_deploy?.header?.text}</Text>
                </TouchableOpacity>
                <View style={[styles.fund_card_sty, {paddingBottom: 0}]}>
                    <View style={[Style.flexBetween, {paddingBottom: text(10)}]}>
                        <Text style={styles.fund_title_sty}>{data.asset_deploy?.th?.name}</Text>
                        <Text style={styles.fund_title_sty}>{data.asset_deploy?.th?.ratio}</Text>
                    </View>
                    {data?.asset_deploy?.items.map((_i, _d) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => props.navigation.navigate('FundDetail', {code: _i.code})}
                                style={[Style.flexBetween, styles.fund_item_sty]}
                                key={_d + '_i'}>
                                <View>
                                    <Text style={{color: '#333333'}}>{_i.name}</Text>
                                    <Text style={styles.plan_text_sty}>{_i.code}</Text>
                                </View>
                                <Text
                                    style={{
                                        color: '#333333',
                                        fontSize: text(13),
                                        fontFamily: Font.numFontFamily,
                                    }}>
                                    {_i.percent}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </>
        );
    };
    return (
        <>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init()} />}>
                {data?.processing_info && <Notice content={data?.processing_info} />}
                <View style={styles.assets_card_sty}>
                    {Object.keys(data).length > 0 && (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
                            <View>
                                <View style={[Style.flexRow, {marginBottom: text(15)}]}>
                                    <Text style={styles.profit_text_sty}>
                                        总金额(元){data?.profit_date ? <Text>({data.profit_date})</Text> : null}
                                    </Text>
                                    <TouchableOpacity onPress={toggleEye}>
                                        <Ionicons
                                            name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                            size={16}
                                            color={'rgba(255, 255, 255, 0.8)'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.profit_num_sty, {fontSize: text(24), lineHeight: text(24)}]}>
                                    {showEye === 'true' ? data.amount : '***'}
                                </Text>
                            </View>
                            <View>
                                <View
                                    style={[
                                        Style.flexRow,
                                        {marginBottom: text(15), alignSelf: 'flex-end', alignItems: 'baseline'},
                                    ]}>
                                    <Text style={styles.profit_text_sty}>日收益</Text>
                                    <Text style={[styles.profit_num_sty, {paddingTop: text(10)}]}>
                                        {showEye === 'true' ? data.profit : '***'}
                                    </Text>
                                </View>
                                <View style={[Style.flexRow, {alignItems: 'baseline'}]}>
                                    <Text style={styles.profit_text_sty}>累计收益</Text>
                                    <Text style={[styles.profit_num_sty, {paddingTop: text(10)}]}>
                                        {showEye === 'true' ? data.profit_acc : '***'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {data?.progress_bar && (
                        <>
                            <View style={styles.process_wrap_sty}>
                                <View style={[styles.bubbles_sty, {left: left}]}>
                                    <Text style={styles.bubble_text_sty}>{data?.progress_bar?.percent_text}</Text>
                                    <AntDesign name={'caretdown'} size={14} color={'#FFDC5D'} style={[styles.ab_sty]} />
                                </View>
                            </View>
                            <View style={styles.process_outer}>
                                <View style={[styles.process_inner, {width: widthD}]} />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: text(5),
                                }}>
                                <Text style={{fontSize: text(12), color: '#fff'}}>
                                    {data?.progress_bar?.range_text[0]}
                                </Text>
                                <View style={Style.flexRowCenter}>
                                    <Text style={{fontSize: text(12), color: '#fff'}}>
                                        {data?.progress_bar?.range_text[1]}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => showTips({content: '进度条展示您当前已达到目标收益的百分比'})}>
                                        <Image
                                            style={{width: text(20), height: text(20)}}
                                            source={require('../../assets/img/tip.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.list_card_sty}>
                    {data?.core_buttons?.map((_item, _index) => {
                        return (
                            <TouchableOpacity
                                style={{alignItems: 'center'}}
                                key={_index + '_item0'}
                                onPress={() => jump(_item.url)}>
                                <Image
                                    source={{
                                        uri: _item.icon,
                                    }}
                                    resizeMode="contain"
                                    style={{width: text(24), height: text(24), marginBottom: text(5)}}
                                />
                                <Text style={styles.list_text_sty}>{_item.text}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {/* 广告位 */}
                {data?.ad_info && (
                    <TouchableOpacity onPress={() => jump(data?.ad_info?.url)}>
                        <FitImage
                            source={{
                                uri: data?.ad_info?.img,
                            }}
                            resizeMode="contain"
                            style={{marginBottom: text(10)}}
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.padding_sty}>
                    {Object.keys(card).length > 0 && renderBtn() /* 按钮 */}
                    {/* 反洗钱上传 */}
                    {data?.notice_info && (
                        <View style={[Style.flexRow, styles.upload_card_sty]}>
                            <Text style={{color: '#4E556C', fontSize: Font.textH3, flex: 1, lineHeight: text(18)}}>
                                {data?.notice_info?.content}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => jump(data?.notice_info?.button?.url)}
                                style={styles.upload_btn_sty}>
                                <Text
                                    style={{
                                        color: '#0051CC',
                                        paddingVertical: text(6),
                                        paddingHorizontal: text(14),
                                        fontSize: text(12),
                                    }}>
                                    {data?.notice_info?.button?.text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {Object.keys(chart).length > 0 && renderChart() /* 净值趋势图 */}
                    {/* {renderChart()} */}
                    {data?.asset_deploy && renderFixedPlan() /* 低估值投资计划 */}
                    <View style={[styles.list_card_sty, {margin: 0, marginTop: text(16)}]}>
                        {data?.extend_buttons?.map((_e, _index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{alignItems: 'center'}}
                                    key={_index + '_e'}
                                    onPress={() => jump(_e.url)}>
                                    <Image
                                        source={{
                                            uri: _e.icon,
                                        }}
                                        resizeMode="contain"
                                        style={styles.img_sty}
                                    />
                                    <Text
                                        style={[
                                            styles.list_text_sty,
                                            {color: _index == data?.extend_buttons.length - 1 ? '#BDC2CC' : '#4E556C'},
                                        ]}>
                                        {_e.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <BottomModal ref={bottomModal} title={'提示'}>
                    <View style={{padding: text(16)}}>
                        {tip?.title ? (
                            <Text style={{textAlign: 'center', color: '#121D3A', fontSize: text(16)}}>
                                {tip?.title}
                            </Text>
                        ) : null}
                        <Text style={styles.tip_sty}>{tip?.content}</Text>
                        {tip?.img && (
                            <FastImage
                                source={{
                                    uri: tip?.img,
                                }}
                                style={{width: '100%', height: text(140)}}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </BottomModal>
                <BottomDesc />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    assets_card_sty: {
        backgroundColor: '#0052CD',
        paddingHorizontal: text(20),
        paddingVertical: text(15),
        paddingBottom: text(40),
    },
    profit_text_sty: {
        color: '#FFFFFF',
        opacity: 0.4,
        fontSize: Font.textH3,
        marginRight: text(5),
        lineHeight: text(17),
    },
    profit_num_sty: {
        color: '#fff',
        fontSize: text(17),
        fontFamily: Font.numFontFamily,
        lineHeight: text(17),
    },
    process_outer: {
        backgroundColor: '#F5F6F8',
        width: deviceWidth - text(40),
        height: text(6),
        borderRadius: text(30),
        marginTop: text(40),
    },
    process_inner: {
        backgroundColor: '#FFDC5D',
        height: text(6),
        borderRadius: text(30),
    },
    process_wrap_sty: {
        position: 'relative',
        width: deviceWidth - text(48),
    },
    bubbles_sty: {
        position: 'absolute',
        backgroundColor: '#FFDC5D',
        borderRadius: text(4),
        top: 10,
    },
    bubble_text_sty: {
        paddingVertical: text(3),
        paddingHorizontal: text(2),
        fontSize: Font.textH3,
        fontFamily: Font.numFontFamily,
    },
    ab_sty: {
        top: text(14),
        position: 'absolute',
        left: '0%',
    },
    list_card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        margin: text(16),
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: text(16),
        marginTop: text(-25),
    },
    list_text_sty: {
        color: '#4E556C',
        fontSize: Font.textH3,
    },
    plan_card_sty: {
        backgroundColor: '#fff',
        padding: text(16),
        borderRadius: text(10),
    },
    padding_sty: {
        padding: text(16),
        paddingTop: 0,
    },
    plan_title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: text(9),
    },
    plan_desc_sty: {
        color: '#545968',
        fontSize: Font.textH3,
        lineHeight: text(18),
        textAlign: 'center',
    },
    blue_wrap_style: {
        backgroundColor: '#DFEAFC',
        borderRadius: text(4),
        marginTop: text(14),
    },
    blue_text_style: {
        color: '#0052CD',
        fontSize: Font.textH3,
        textAlign: 'center',
        paddingVertical: text(5),
    },
    legend_sty: {
        // flex: 1,
        alignItems: 'center',
    },
    legend_title_sty: {
        color: '#1F2432',
        // fontWeight: 'bold',
        fontSize: text(16),
        fontFamily: Font.numFontFamily,
        marginBottom: text(4),
        padding: 0,
        width: text(90),
        textAlign: 'center',
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
        paddingHorizontal: text(12),
        paddingVertical: text(6),
        borderRadius: text(20),
        marginRight: text(10),
    },
    title_sty: {
        color: '#1F2432',
        fontSize: Font.textH1,
        fontWeight: 'bold',
    },
    fund_title_sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
    },
    fund_card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: text(14),
    },
    fund_item_sty: {
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingVertical: text(12),
    },
    upload_card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: text(16),
        marginTop: text(12),
    },
    upload_btn_sty: {
        borderWidth: 0.5,
        borderColor: '#0051CC',
        borderRadius: text(20),
        marginLeft: text(10),
    },
    chart_list_sty: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    img_sty: {
        width: text(24),
        height: text(24),
        marginBottom: text(5),
    },
    plan_text_sty: {
        color: '#999999',
        fontSize: text(11),
        marginTop: text(5),
        fontFamily: Font.numFontFamily,
    },
    tip_sty: {
        lineHeight: text(18),
        textAlign: 'center',
        marginTop: text(16),
        color: '#121D3A',
    },
    sub_tabs: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
});
