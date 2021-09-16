/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: xjh
 * @Date: 2021-02-19 10:33:09
 * @Description:组合持仓页
 * @LastEditors: dx
 * @LastEditTime: 2021-09-15 19:42:38
 */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Dimensions,
    RefreshControl,
    Platform,
} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text, isIphoneX} from '../../utils/appUtil';
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
import GuideTips from '../../components/GuideTips';
const deviceWidth = Dimensions.get('window').width;

export default function PortfolioAssets(props) {
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({});
    const [card, setCard] = useState({});
    const [chart, setChart] = useState({});
    const [chartData, setChartData] = useState([]);
    const [showEye, setShowEye] = useState(true);
    const [left, setLeft] = useState('0%');
    const [onRight, setOnRight] = useState(false);
    const [widthD, setWidthD] = useState('0%');
    const [period, setPeriod] = useState('');
    const [tip, setTip] = useState({});
    const [tag, setTag] = useState();
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const bottomModal = React.useRef(null);
    const scoreModal = React.useRef();
    const jump = useJump();
    const [loading, setLoading] = useState(true);
    const [showEmpty, setShowEmpty] = useState(false);
    const tabClick = useRef(true);

    const changeTab = (p) => {
        if (!tabClick.current) {
            return false;
        }
        setPeriod((prev) => {
            if (prev !== p) {
                tabClick.current = false;
                global.LogTool('assetsDetailChartSwitch', props.route?.params?.poid, p);
            }
            return p;
        });
    };
    const init = useCallback(() => {
        Http.get('/position/detail/20210101', {
            poid: props.route?.params?.poid,
        }).then((res) => {
            if (res.result.period) {
                setPeriod(res.result.period);
            }
            setData(res.result);
            setRefreshing(false);
            props.navigation.setOptions({
                title: res.result.title,
            });
            if (res.result?.progress_bar) {
                let _l = '';
                const _left = res.result?.progress_bar?.percent_text;
                if (_left.split('%')[0] < 10) {
                    _l = _left.split('%')[0] - 1.5 + '%';
                } else if (_left.split('%')[0] > 90) {
                    _l = _left.split('%')[0] - 6.8 + '%';
                    setOnRight(true);
                } else {
                    _l = _left.split('%')[0] + '%';
                }
                setLeft(_l);
                setWidthD(res.result.progress_bar.percent_text);
            }
        });
        Http.get('/position/console/20210101', {
            poid: props.route?.params?.poid,
        })
            .then((res) => {
                setCard(res.result);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [props.route.params]);
    const getChartInfo = () => {
        setChartData([]);
        Http.get('/position/chart/20210101', {
            poid: props.route?.params?.poid,
            period: period,
        }).then((res) => {
            setTag(res.result.tag_position);
            setChartData(res.result.chart);
            setShowEmpty(res.result.chart?.length === 0);
            setChart(res.result);
            tabClick.current = true;
        });
    };
    const renderLoading = () => {
        return (
            <View
                style={{
                    paddingTop: Space.padding,
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <FastImage
                    style={{
                        flex: 1,
                    }}
                    source={require('../../assets/personal/loading.png')}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    };
    useFocusEffect(
        useCallback(() => {
            init();
            storage.get('portfolioAssets').then((res) => {
                setShowEye(res ? res : 'true');
            });
        }, [init])
    );
    useEffect(() => {
        if (period) {
            getChartInfo();
        }
    }, [period]);
    useEffect(() => {
        if (!loading && chartData && chartData.length > 0) {
            onHide();
        }
    }, [chartData, loading]);
    // 图表滑动legend变化
    const onChartChange = useCallback(
        ({items}) => {
            _textTime?.current?.setNativeProps({text: items[0]?.title});
            _textPortfolio?.current?.setNativeProps({
                text: items[0]?.value,
                style: [styles.legend_title_sty, {color: getColor(items[0]?.value)}],
            });
            _textBenchmark?.current?.setNativeProps({
                text: items[1]?.value,
                style: [styles.legend_title_sty, {color: getColor(items[1]?.value)}],
            });
        },
        [getColor]
    );
    // 图表滑动结束
    const onHide = () => {
        _textTime?.current?.setNativeProps({text: chart?.label[0].val});
        _textPortfolio?.current?.setNativeProps({
            text: chart?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(chart?.label[1].val)}],
        });
        _textBenchmark?.current?.setNativeProps({
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
    const showTips = (tips, type) => {
        setTip(tips);
        if (type) {
            bottomModal.current.show();
        } else if (tips?.img) {
            bottomModal.current.show();
        } else {
            scoreModal.current.show();
        }
    };
    const renderBtn = () => {
        return (
            <View style={styles.plan_card_sty}>
                <View style={Style.flexBetween}>
                    <Html style={styles.plan_title_sty} html={card?.title_info?.content} />
                    {card?.title_info?.popup ? (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => showTips(card?.title_info?.popup)}>
                            <FastImage
                                style={{width: text(16), height: text(16)}}
                                source={require('../../assets/img/tip.png')}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
                {card?.desc ? (
                    <View style={{marginVertical: px(12)}}>
                        <Html style={styles.plan_desc_sty} html={card?.desc} />
                    </View>
                ) : null}

                {/* {card?.notice ? (
                    <View style={styles.blue_wrap_style}>
                        <Text style={styles.blue_text_style}>{card?.notice}</Text>
                    </View>
                ) : null} */}
                {card?.notice_info ? (
                    <View style={{marginBottom: text(16)}}>
                        <View style={styles.noticeSty}>
                            <Image
                                source={require('../../assets/personal/noticeArrow.png')}
                                style={styles.noticeArrow}
                            />
                            <Html html={card?.notice_info.content} style={styles.noticeTextSty} />
                        </View>
                    </View>
                ) : null}
                <View style={Style.flexBetween}>
                    {card?.button_list?.map?.((_button, _index, arr) => {
                        return (
                            <TouchableOpacity
                                key={_index + '_button'}
                                onPress={() => {
                                    global.LogTool(_button.action, props.route?.params?.poid);
                                    accountJump(_button.url, _button.action);
                                }}
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
                {card?.tip ? (
                    <View style={{marginTop: text(20)}}>
                        <Text style={styles.cardTips}>{card?.tip}</Text>
                    </View>
                ) : null}
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
                                {chart?.label[2] && (
                                    <View style={styles.legend_sty}>
                                        <TextInput
                                            style={[styles.legend_title_sty, {color: getColor(chart?.label[2]?.val)}]}
                                            ref={_textBenchmark}
                                            defaultValue={chart?.label[2]?.val}
                                            editable={false}
                                        />
                                        <View style={[Style.flexRow, {alignItems: 'center'}]}>
                                            {chart?.label[2]?.name === '底线' ? (
                                                <Text
                                                    style={{
                                                        color: Colors.defaultColor,
                                                        fontSize: Font.textH3,
                                                        fontWeight: Platform.select({android: '700', ios: '600'}),
                                                    }}>
                                                    --
                                                </Text>
                                            ) : (
                                                <CircleLegend color={['#E8EAEF', '#545968']} />
                                            )}
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={Style.flexRow}
                                                onPress={() => showTips(chart.tips, 'chart')}>
                                                <Text style={{...styles.legend_desc_sty, marginLeft: text(4)}}>
                                                    {chart?.label[2]?.name}
                                                </Text>
                                                {chart?.tips && (
                                                    <FastImage
                                                        style={{
                                                            width: text(12),
                                                            height: text(12),
                                                            marginLeft: text(4),
                                                        }}
                                                        source={require('../../assets/img/tip.png')}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
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
                                    tag,
                                    220,
                                    chart.max_ratio
                                )}
                                onChange={onChartChange}
                                onHide={onHide}
                                style={{width: '100%'}}
                            />
                        ) : (
                            showEmpty && (
                                <EmptyTip
                                    style={{paddingTop: px(40)}}
                                    imageStyle={{width: px(150), resizeMode: 'contain'}}
                                    type={'part'}
                                />
                            )
                        )}
                    </View>
                    {chart?.sub_tabs && chart?.chart.length > 0 && (
                        <View style={styles.sub_tabs}>
                            {chart?.sub_tabs?.map((_item, _index, arr) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
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
    return loading ? (
        renderLoading()
    ) : (
        <View style={{backgroundColor: Colors.bgColor}}>
            <ScrollView
                scrollIndicatorInsets={{right: 1}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            init();
                            getChartInfo();
                        }}
                    />
                }>
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
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        jump(data.jump_url_list?.profit || '');
                                    }}
                                    style={[
                                        Style.flexRow,
                                        {marginBottom: text(15), alignSelf: 'flex-end', alignItems: 'baseline'},
                                    ]}>
                                    <Text style={styles.profit_text_sty}>日收益</Text>
                                    <Text style={[styles.profit_num_sty, {paddingTop: text(10)}]}>
                                        {showEye === 'true' ? data.profit : '***'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        jump(data.jump_url_list?.profit_acc || '');
                                    }}
                                    style={[Style.flexRow, {alignItems: 'baseline'}]}>
                                    <Text style={styles.profit_text_sty}>累计收益</Text>
                                    <Text style={[styles.profit_num_sty, {paddingTop: text(10)}]}>
                                        {showEye === 'true' ? data.profit_acc : '***'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {data?.progress_bar && (
                        <>
                            <View style={styles.process_wrap_sty}>
                                <View style={[styles.bubbles_sty, {left: left}]}>
                                    <Text style={styles.bubble_text_sty}>{data?.progress_bar?.percent_text}</Text>
                                    <AntDesign
                                        name={'caretdown'}
                                        size={14}
                                        color={'#FFDC5D'}
                                        style={[styles.ab_sty, onRight ? {right: 0} : {left: 0}]}
                                    />
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
                                        activeOpacity={0.8}
                                        onPress={() => Modal.show({content: '进度条展示您当前已达到目标收益的百分比'})}>
                                        <FastImage
                                            style={{width: text(12), height: text(12), marginLeft: text(4)}}
                                            source={require('../../assets/img/tip.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
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
                    {data?.asset_deploy && renderFixedPlan() /* 低估值投资计划 */}
                    <View style={[styles.list_card_sty, {marginTop: text(16)}]}>
                        {[...(data?.core_buttons || []), ...(data?.extend_buttons || [])].map((_item, _index, arr) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        alignItems: 'center',
                                        width: (deviceWidth - px(16) * 2) / 4,
                                        marginBottom: px(26),
                                    }}
                                    key={_index + '_item0'}
                                    onPress={() => {
                                        global.LogTool('assetsDetailIconsStart', props.route?.params?.poid, _item.id);
                                        if (_item.red_point) {
                                            Http.get('/wechat/report/red_point/20210906');
                                        }
                                        jump(_item.url);
                                    }}>
                                    <View style={{position: 'relative'}}>
                                        <FastImage
                                            source={{
                                                uri: _item.icon,
                                            }}
                                            resizeMode="contain"
                                            style={{width: text(24), height: text(24), marginBottom: text(5)}}
                                        />
                                        {_item.red_point ? <View style={styles.redDot} /> : null}
                                    </View>
                                    <Text
                                        style={[
                                            styles.list_text_sty,
                                            {color: _index === arr.length - 1 ? '#BDC2CC' : '#4E556C'},
                                        ]}>
                                        {_item.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <BottomModal
                    ref={scoreModal}
                    title={tip?.show_point == 1 ? '组合状态评分' : '资产状态'}
                    style={{height: text(400)}}>
                    <View style={{padding: text(16)}}>
                        <>
                            <Text style={styles.tipTitle}>
                                什么是{tip?.show_point == 1 ? '组合状态评分' : '资产状态'}:
                            </Text>
                            <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                组合{tip?.show_point == 1 ? '状态评分' : '资产状态'}
                                代表您的持仓比例与系统给出的最优配置比例的偏离度，偏离度越大，评分越低。
                            </Text>
                            <Text style={styles.tipTitle}>资产状态的含义:</Text>
                            <View style={Style.flexRow}>
                                <View style={{flex: 1, alignItems: 'center', marginRight: text(12)}}>
                                    <Text
                                        style={{
                                            color: Colors.green,
                                            fontSize: text(24),
                                            fontWeight: 'bold',
                                            marginBottom: text(6),
                                        }}>
                                        {tip?.show_point == 1 ? ' 评分 ≥ 90' : '健康'}
                                    </Text>
                                    <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                        您的持仓比例与系统的最优配置比例基本一致。您可以选择追加购买，不需要进行调仓。
                                    </Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'center'}}>
                                    <Text
                                        style={{
                                            color: Colors.yellow,
                                            fontSize: text(24),
                                            fontWeight: 'bold',
                                            marginBottom: text(6),
                                        }}>
                                        {tip?.show_point == 1 ? ' 评分 < 90' : '需调仓'}
                                    </Text>
                                    <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                        您的持仓与系统的最优配置比例配置较大，系统建议您给需调仓的组合进行调仓或追加购买降低偏离值。
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.tipTitle}>什么是系统最优配置:</Text>
                            <Text style={{lineHeight: text(18), fontSize: text(13)}}>
                                理财魔方每天会根据您持有的风险等级、持仓金额及全球各大类资产走势情况等多方面因素进行优化及调整配置比例，自动计算并给出一个当天持有的最佳配置比例。
                            </Text>
                        </>
                    </View>
                </BottomModal>
                <BottomModal ref={bottomModal} title={tip?.title}>
                    <View style={{padding: text(16)}}>
                        {tip?.img ? (
                            <FastImage
                                source={{
                                    uri: tip?.img,
                                }}
                                style={{width: '100%', height: text(140)}}
                                resizeMode="contain"
                            />
                        ) : (
                            chart?.tips?.content?.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.tipTitle}>{item.key}:</Text>
                                        <Text
                                            style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                            {item?.val}
                                        </Text>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </BottomModal>
                <BottomDesc />
            </ScrollView>
            {data?.notice_bar ? (
                <GuideTips
                    data={data?.notice_bar}
                    style={{position: 'absolute', bottom: isIphoneX() ? px(90) : px(56)}}
                />
            ) : null}
        </View>
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
        // left: '0%',
    },
    list_card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: text(20),
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
        marginTop: px(-20),
    },
    padding_sty: {
        padding: text(16),
        paddingTop: 0,
    },
    plan_title_sty: {
        color: Colors.defaultColor,
        fontSize: text(18),
        lineHeight: text(25),
        fontWeight: 'bold',
    },
    plan_desc_sty: {
        color: Colors.descColor,
        fontSize: Font.textH3,
        lineHeight: text(21),
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
        fontFamily: Font.numMedium,
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
    tipTitle: {fontWeight: 'bold', lineHeight: text(20), fontSize: text(14), marginBottom: text(4)},
    cardTips: {
        fontSize: text(9),
        lineHeight: text(13),
        color: '#CBCFD9',
    },
    noticeSty: {
        padding: text(12),
        borderRadius: text(4),
        backgroundColor: '#FFF5E5',
        position: 'relative',
    },
    noticeTextSty: {
        fontSize: Font.textH3,
        lineHeight: text(19),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    noticeArrow: {
        width: text(24),
        height: text(8),
        position: 'absolute',
        bottom: text(-7),
        left: text(36),
    },
    redDot: {
        width: text(8),
        height: text(8),
        borderRadius: text(8),
        backgroundColor: Colors.red,
        position: 'absolute',
        top: text(-4),
        right: text(-4),
    },
});
