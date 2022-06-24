/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: xjh
 * @Date: 2021-02-19 10:33:09
 * @Description:组合持仓页
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-24 22:28:19
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
    StatusBar,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {baseAreaChart} from '../Portfolio/components/ChartOption';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomDesc from '../../components/BottomDesc';
import {Chart} from '../../components/Chart';
import Notice from '../../components/Notice';
import storage from '../../utils/storage';
import {Modal, BottomModal, PageModal} from '../../components/Modal';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import CircleLegend from '../../components/CircleLegend';
import FastImage from 'react-native-fast-image';
import EmptyTip from '../../components/EmptyTip';
import GuideTips from '../../components/GuideTips';
import {throttle} from 'lodash';
import {Button} from '../../components/Button';
import HTML from '../../components/RenderHtml';
import ReasonListDialog from './components/ReasonListDialog.js';
import LinearGradient from 'react-native-linear-gradient';
const deviceWidth = Dimensions.get('window').width;

const RatioColor = [
    '#E1645C',
    '#6694F3',
    '#F8A840',
    '#CC8FDD',
    '#5DC162',
    '#C7AC6B',
    '#62C4C7',
    '#E97FAD',
    '#C2E07F',
    '#B1B4C5',
    '#E78B61',
    '#8683C9',
    '#EBDD69',
];

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
    const signModal = React.useRef(null);
    const jump = useJump();
    const [reasonListDialogPropsAndVisible, setReasonListDialogPropsAndVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEmpty, setShowEmpty] = useState(false);
    const [signData, setSignData] = useState(null);
    const [fundDetail, setFundDetail] = useState(null);
    const [fundDetailLoading, setFundDetailLoading] = useState(false);
    const changeTab = throttle((p) => {
        global.LogTool('assetsDetailChartSwitch', props.route?.params?.poid, p);
        setPeriod(p);
    }, 300);
    const init = useCallback(() => {
        http.get('/position/detail/20210101', {
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
            if (res.result.need_ds) {
                // 基金明细
                setFundDetailLoading(true);
                http.get('/portfolio/funds/user_holding/20210101', {
                    poid: props?.route.params?.poid || 'X00F000003',
                }).then((result) => {
                    if (result.code === '000000') {
                        setFundDetail(result.result || {});
                    }
                    setFundDetailLoading(false);
                });
            }
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
        http.get('/position/console/20210101', {
            poid: props.route?.params?.poid,
        })
            .then((res) => {
                setCard(res.result);
                setLoading(false);
                getSignData();
            })
            .catch(() => {
                setLoading(false);
            });
    }, [props.route.params]);
    //获取签约数据
    const getSignData = () => {
        http.get('adviser/need_sign/pop/20220422', {poid: props.route.params.poid}).then((res) => {
            setSignData(res.result?.sign);
            if (res?.result?.auto_pop) {
                bottomModal?.current?.show();
            }
        });
    };
    const getChartInfo = () => {
        setChartData([]);
        http.get('/position/chart/20210101', {
            poid: props.route?.params?.poid,
            period: period,
        }).then((res) => {
            setTag(res.result.tag_position);
            setShowEmpty(res.result.chart?.length === 0);
            setChart(res.result);
            setChartData(res.result.chart || []);
        });
    };
    useFocusEffect(
        useCallback(() => {
            init();
            storage.get('portfolioAssets').then((res) => {
                setShowEye(res ? res : 'true');
            });
        }, [init])
    );
    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                StatusBar.setBarStyle('light-content');
            }, 0);
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );
    useEffect(() => {
        if (period) {
            getChartInfo();
        }
    }, [period]);
    useEffect(() => {
        if (!loading && chartData?.length > 0) {
            onHide();
        }
    }, [chartData, loading]);

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
        http.get('/position/popup/20210101', {poid: props.route?.params?.poid, action: type}).then((res) => {
            if (res.result) {
                global.LogTool('RedemptionDetainmentWindows');
                if (res.result?.button_list) {
                    Modal.show({
                        title: res.result?.title || '提示',
                        content: res.result?.content || '确认赎回？',
                        confirm: true,
                        cancelText: res.result?.button_list[0]?.text || '确认赎回',
                        confirmText: res.result?.button_list[1]?.text || '再想一想',
                        cancelCallBack: () => {
                            global.LogTool('RedemptionDetainmentWindows_No');
                            jump(res?.result?.button_list[0]?.url || url);
                        },
                        confirmCallBack: () => {
                            global.LogTool('RedemptionDetainmentWindows_Yes');
                            jump(res?.result?.button_list[1]?.url || url);
                        },
                    });
                } else {
                    Modal.show({
                        title: res.result?.title || '提示',
                        content: res.result?.content || '确认赎回？',
                        confirm: true,
                        cancelText: '确认赎回',
                        confirmText: '再想一想',
                        confirmCallBack: () => {
                            global.LogTool('RedemptionDetainmentWindows_No');
                        },
                        cancelCallBack: () => {
                            global.LogTool('RedemptionDetainmentWindows_Yes');
                            jump(url);
                        },
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
    //签约
    const handleCancleSign = () => {
        return new Promise((resolve) => {
            if (signData?.cancel?.content) {
                Modal.show({
                    title: signData.cancel.title,
                    content: signData.cancel.content,
                    confirm: true,
                    cancelText: '再想一想',
                    confirmText: '确认',
                    intensifyCancel: true,
                    confirmCallBack: () => {
                        setReasonListDialogPropsAndVisible({resolve, signModal});
                    },
                    cancelCallBack: () => {
                        resolve(false);
                    },
                });
            } else {
                signModal.current.hide();
                resolve(true);
            }
        });
    };
    const renderGroupBulletin = (_data) => {
        let content = _data.content?.slice?.(0, 45);
        return (
            <LinearGradient
                colors={['#FFF9F0', '#FFF2DC']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.groupBulletin}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.groupBulletinTop}
                    onPress={() => {
                        jump(_data.jumpUrl);
                    }}>
                    <Image source={{uri: _data.icon}} style={{width: px(42), height: px(42)}} />
                    <Text style={styles.groupBulletinTitle}>{_data.title}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        jump(_data.jumpUrl);
                    }}
                    style={styles.groupBulletinBottom}>
                    <Text style={styles.groupBulletinBottomContent}>
                        {content}
                        {content.length > 44 ? '...' : ''}
                    </Text>
                    <TouchableOpacity
                        style={styles.groupBulletinBtnTextWrapper}
                        onPress={() => {
                            jump(_data.jumpUrl);
                        }}>
                        <Text style={styles.groupBulletinBtnText}>{_data.jumpUrl?.text || '查看'}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </LinearGradient>
        );
    };
    const renderBtn = () => {
        return (
            <>
                <View
                    style={[
                        styles.plan_card_sty,
                        card.group_bulletin && {borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
                    ]}>
                    <View style={{padding: text(16)}}>
                        <View style={Style.flexBetween}>
                            <View style={card.is_plan ? Style.flexRow : [Style.flexBetween, {width: '100%'}]}>
                                <View style={[{marginRight: text(8)}, Style.flexRow]}>
                                    {card?.title_info?.icon ? (
                                        <Image
                                            source={{uri: card?.title_info?.icon}}
                                            style={{width: px(20), height: px(20), marginRight: text(6)}}
                                        />
                                    ) : null}
                                    <Html style={styles.plan_title_sty} html={card?.title_info?.content} />
                                </View>
                                {card?.title_info?.popup ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => showTips(card?.title_info?.popup)}>
                                        <FastImage
                                            style={{width: text(16), height: text(16)}}
                                            source={require('../../assets/img/tip.png')}
                                        />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                            {card.is_plan && card.update_button ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => jump(card.update_button.url)}
                                    style={[
                                        Style.flexCenter,
                                        styles.updateBtn,
                                        {borderColor: card.update_button.color},
                                    ]}>
                                    <Text style={[styles.updateText, {color: card.update_button.color}]}>
                                        {card.update_button.text}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                        {card.is_plan && card.score_update_time ? (
                            <Text style={styles.updateTime}>{card.score_update_time}</Text>
                        ) : null}
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
                            <View style={{marginBottom: text(24)}}>
                                <View style={styles.noticeSty}>
                                    <Image
                                        source={require('../../assets/personal/noticeArrow.png')}
                                        style={[
                                            styles.noticeArrow,
                                            card.notice_info.arrow_position === 'middle'
                                                ? styles.center
                                                : card.notice_info.arrow_position === 'right'
                                                ? styles.right
                                                : {},
                                        ]}
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
                                            borderColor: Colors.descColor,
                                            borderWidth:
                                                _index == arr.length - 1 && _button.avail !== 0 ? Space.borderWidth : 0,
                                            borderRadius: text(6),
                                            backgroundColor:
                                                _button.avail !== 0
                                                    ? _index == arr.length - 1
                                                        ? '#fff'
                                                        : '#0051CC'
                                                    : '#C7D8F0',
                                            flex: 1,
                                            marginRight: _index < card?.button_list?.length - 1 ? text(10) : 0,
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
                                        {_button.tips ? (
                                            <View style={styles.superscriptBox}>
                                                <Text style={styles.superscript}>{_button.tips}</Text>
                                            </View>
                                        ) : null}
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
                    {/* 蒙层 */}
                    {data.need_ds ? (
                        <ImageBackground
                            resizeMode="cover"
                            source={{uri: card.ds_info.bg}}
                            style={[styles.mark, {justifyContent: 'flex-end'}]}
                            imageStyle={{borderRadius: px(6)}}>
                            {card.ds_info.button ? (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        jump(card.ds_info.button.url);
                                    }}
                                    style={styles.markBtn}>
                                    <Text style={styles.markBtnText}>{card.ds_info.button.text}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </ImageBackground>
                    ) : null}
                </View>
                {card.group_bulletin && renderGroupBulletin(card.group_bulletin)}
            </>
        );
    };
    const renderChart = () => {
        return (
            <>
                <Text style={[styles.title_sty, {paddingVertical: text(16)}]}>{chart?.title}</Text>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: text(10),
                    }}>
                    <View style={{paddingTop: text(16), paddingBottom: text(10)}}>
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
                                                style={[
                                                    styles.legend_title_sty,
                                                    {color: getColor(chart?.label[2]?.val)},
                                                ]}
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
                                                <View style={Style.flexRow}>
                                                    <Text style={{...styles.legend_desc_sty, marginLeft: text(4)}}>
                                                        {chart?.label[2]?.name}
                                                    </Text>
                                                    {chart?.tips && (
                                                        <TouchableOpacity
                                                            activeOpacity={0.8}
                                                            onPress={() => showTips(chart.tips, 'chart')}>
                                                            <FastImage
                                                                style={{
                                                                    width: text(12),
                                                                    height: text(12),
                                                                    marginLeft: text(4),
                                                                }}
                                                                source={require('../../assets/img/tip.png')}
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ) : null}
                            {chartData?.length > 0 ? (
                                <Chart
                                    initScript={baseAreaChart(
                                        chartData,
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
                        {chart?.sub_tabs && chart?.chart?.length > 0 && (
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
                    {/* 蒙层 */}
                    {data.need_ds ? (
                        <ImageBackground
                            resizeMode="cover"
                            source={{uri: card.ds_info.bg}}
                            style={[styles.mark, {borderRadius: text(10)}]}
                            imageStyle={{borderRadius: px(10)}}>
                            <Text style={styles.dsInfoContent}>{card.ds_info.content}</Text>
                        </ImageBackground>
                    ) : null}
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

    const renderFundDetail = () => {
        return (
            <View style={fundDetailStyles.subContainer}>
                {/* title */}
                <Text style={[styles.title_sty, {paddingTop: text(16)}]}>{fundDetail?.title}</Text>
                {/* loading */}
                {fundDetailLoading ? (
                    <ActivityIndicator color={Colors.brandColor} style={{width: '100%', height: text(42)}} />
                ) : (
                    <>
                        {/* list */}
                        {fundDetail?.list?.length ? (
                            fundDetail?.list?.map((item, index) => {
                                return (
                                    <View key={`type${index}`} style={{marginBottom: text(8)}}>
                                        <View style={[fundDetailStyles.titleContainer, Style.flexRow]}>
                                            <View
                                                style={[
                                                    fundDetailStyles.circle,
                                                    {backgroundColor: item.color || RatioColor[index]},
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    fundDetailStyles.name,
                                                    {color: item.color || RatioColor[index], fontWeight: '500'},
                                                ]}>
                                                {item.name}
                                            </Text>
                                            <Text
                                                style={[
                                                    fundDetailStyles.numStyle,
                                                    {color: item.color || RatioColor[index]},
                                                ]}>
                                                {item.percent < 0.01 ? '<0.01' : item.percent}%
                                            </Text>
                                        </View>
                                        {item?.funds?.map((fund, i, arr) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        global.LogTool('click', 'fund', item.code);
                                                        props.navigation.navigate('FundDetail', {code: fund.code});
                                                    }}
                                                    style={[
                                                        fundDetailStyles.fundContainer,
                                                        i === arr.length - 1 ? {marginBottom: 0} : {},
                                                    ]}
                                                    key={`${item.type}${fund.code}${i}`}>
                                                    <View style={[fundDetailStyles.fundTitle, Style.flexBetween]}>
                                                        <View style={Style.flexRow}>
                                                            <Text style={[fundDetailStyles.name]}>{fund.name}</Text>
                                                        </View>
                                                        {fund.button ? (
                                                            <TouchableOpacity
                                                                activeOpacity={0.8}
                                                                onPress={() => {
                                                                    jump(fund.button.url);
                                                                }}
                                                                style={fundDetailStyles.redeemBtn}>
                                                                <Text style={fundDetailStyles.redeemBtnText}>
                                                                    {fund.button.text}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ) : null}
                                                    </View>
                                                    <View style={Style.flexRow}>
                                                        <View style={{flex: 1}}>
                                                            <View style={[Style.flexRow, {marginBottom: text(12)}]}>
                                                                <Text
                                                                    style={[
                                                                        fundDetailStyles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'占比'}
                                                                </Text>
                                                                <Text style={[fundDetailStyles.numStyle]}>
                                                                    {fund.percent < 0.01 ? '<0.01' : fund.percent}%
                                                                </Text>
                                                            </View>
                                                            <View style={Style.flexRow}>
                                                                <Text
                                                                    style={[
                                                                        fundDetailStyles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'份额(份)'}
                                                                </Text>
                                                                <Text style={[fundDetailStyles.numStyle]}>
                                                                    {fund.share}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <View style={[Style.flexRow, {marginBottom: text(12)}]}>
                                                                <Text
                                                                    style={[
                                                                        fundDetailStyles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'累计收益(元)'}
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        fundDetailStyles.numStyle,
                                                                        {color: getColor(fund.profit_acc)},
                                                                    ]}>
                                                                    {fund.profit_acc}
                                                                </Text>
                                                            </View>
                                                            <View style={Style.flexRow}>
                                                                <Text
                                                                    style={[
                                                                        fundDetailStyles.subTitle,
                                                                        {color: Colors.darkGrayColor},
                                                                    ]}>
                                                                    {'金额(元)'}
                                                                </Text>
                                                                <Text style={[fundDetailStyles.numStyle]}>
                                                                    {fund.amount}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                );
                            })
                        ) : (
                            <EmptyTip text={'暂无持有中基金'} />
                        )}
                    </>
                )}
            </View>
        );
    };

    return loading ? (
        renderLoading()
    ) : (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <ScrollView
                style={{flex: 1}}
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
                {data?.processing_list && (
                    <Notice
                        content={data?.processing_list}
                        onPress={(index) => {
                            let signIndex = data?.processing_list.findIndex((_item) =>
                                ['Sign', 'PortfolioTransfer'].includes(_item.action)
                            );
                            if (signIndex === index && signData?.content) {
                                //签约弹窗
                                signModal?.current?.show();
                            }
                        }}
                    />
                )}
                <View style={[styles.assets_card_sty, data.scene === 'adviser' ? {paddingBottom: px(24)} : {}]}>
                    {Object.keys(data).length > 0 && (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
                            <View>
                                <View style={[Style.flexRow, {marginBottom: text(15)}]}>
                                    <Text style={styles.profit_text_sty}>
                                        总金额(元){data?.profit_date ? <Text>({data.profit_date})</Text> : null}
                                    </Text>
                                    <TouchableOpacity activeOpacity={0.8} onPress={toggleEye}>
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
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => Modal.show({content: '进度条展示您当前已达到目标收益的百分比'})}
                                    style={Style.flexRowCenter}>
                                    <Text style={{fontSize: text(12), color: '#fff'}}>
                                        {data?.progress_bar?.range_text[1]}
                                    </Text>
                                    <View>
                                        <FastImage
                                            style={{width: text(12), height: text(12), marginLeft: text(4)}}
                                            source={require('../../assets/img/tip.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.padding_sty}>
                    {Object.keys(card || {}).length > 0 && data.scene !== 'adviser' && renderBtn() /* 按钮 */}
                    {data?.ad_info ? (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                global.LogTool('ppage_banner', data.title);
                                jump(data?.ad_info?.url);
                            }}>
                            <FastImage
                                source={{
                                    uri: data?.ad_info?.cover,
                                }}
                                style={styles.ad_info}
                            />
                        </TouchableOpacity>
                    ) : null}
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
                    {renderChart()}
                    {/* 基金明细 */}
                    {data.need_ds && renderFundDetail()}
                    {data?.asset_deploy && renderFixedPlan() /* 低估值投资计划 */}
                    <View style={[styles.list_card_sty, {marginTop: text(16)}]}>
                        {[...(data?.core_buttons || []), ...(data?.extend_buttons || [])].map((_item, _index, arr) => {
                            return _index % 4 == 0 && _index === arr.length - 1 ? null : (
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
                                            http.get('/wechat/report/red_point/20210906');
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
                {card?.is_plan ? (
                    <BottomModal ref={scoreModal} title={'资产健康分'} style={{height: text(400)}}>
                        <View style={{padding: text(16)}}>
                            <>
                                <Text style={styles.tipTitle}>什么是{'资产健康分'}:</Text>
                                <Text style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                    {'资产健康分'}
                                    代表您的持仓大类资产比例与系统给出的最优计划比例的偏离度，偏离度越大，评分越低。
                                </Text>
                                <Text style={styles.tipTitle}>资产健康分的含义:</Text>
                                <View style={Style.flexRow}>
                                    <View style={{flex: 1, alignItems: 'center', marginRight: text(12)}}>
                                        <Text
                                            style={{
                                                color: Colors.green,
                                                fontSize: text(24),
                                                fontWeight: 'bold',
                                                marginBottom: text(6),
                                            }}>
                                            {' 评分 ≥ 90'}
                                        </Text>
                                        <Text
                                            style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                            您的持仓大类资产比例与系统的最优计划比例基本一致。您可以选择追加购买，不需要进行优化计划。
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
                                            {' 评分 < 90'}
                                        </Text>
                                        <Text
                                            style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
                                            您的持仓大类资产比例与系统的最优计划比例偏离较大，系统建议您进行优化计划或进行追加购买降低偏离度。
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.tipTitle}>什么是系统最优计划:</Text>
                                <Text style={{lineHeight: text(18), fontSize: text(13)}}>
                                    理财魔方每天会根据您持有的风险等级、持仓金额及全球各大类资产走势情况等多方面因素进行优化，自动计算并给出一个当天持有的最佳大类资产比例。
                                </Text>
                            </>
                        </View>
                    </BottomModal>
                ) : (
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
                                        <Text
                                            style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
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
                                        <Text
                                            style={{lineHeight: text(18), fontSize: text(13), marginBottom: text(16)}}>
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
                )}

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
                <BottomDesc fix_img={data?.advisor_footer_img} />
            </ScrollView>
            <PageModal
                beforeClose={handleCancleSign}
                style={{height: px(530)}}
                ref={signModal}
                title={signData?.title}
                onClose={() => {}}>
                <View style={{flex: 1, paddingBottom: isIphoneX() ? 34 : px(12)}}>
                    {signData?.title_tip && <Notice content={{content: signData?.title_tip}} />}
                    <ScrollView
                        bounces={false}
                        style={{
                            padding: px(16),
                        }}>
                        <HTML
                            html={signData?.content}
                            style={{fontSize: px(13), color: Colors.defaultColor, lineHeight: px(20)}}
                        />
                        {signData?.desc
                            ? signData.desc?.map((item, index) => (
                                  <View key={index}>
                                      <Text style={{fontSize: px(16), fontWeight: '700', marginVertical: px(12)}}>
                                          {item?.title}
                                      </Text>
                                      <View style={styles.sign_scrollview}>
                                          <HTML html={item?.content} style={{fontSize: px(13), lineHeight: px(20)}} />
                                      </View>
                                  </View>
                              ))
                            : null}
                        <View style={{height: px(30)}} />
                    </ScrollView>
                    {signData?.cancel ? (
                        <View style={[Style.flexBetween, {marginHorizontal: px(16), paddingTop: px(8)}]}>
                            <Button
                                type={'minor'}
                                style={{
                                    flex: 1,
                                    marginRight: px(12),
                                }}
                                onPress={handleCancleSign}
                                title={signData?.cancel?.cancel?.text}
                            />
                            <Button
                                style={{
                                    flex: 1,
                                }}
                                onPress={() => {
                                    signModal.current.hide();
                                    jump(signData?.cancel?.confirm?.url);
                                }}
                                title={signData?.cancel?.confirm?.text}
                            />
                        </View>
                    ) : null}
                </View>
            </PageModal>
            {data?.notice_bar ? (
                <GuideTips
                    data={data?.notice_bar}
                    style={{position: 'absolute', bottom: isIphoneX() ? px(90) : px(56)}}
                />
            ) : null}
            {data?.trade_buttons ? (
                <View style={[Style.flexRow, styles.fixedBtns]}>
                    {data.trade_buttons.map?.((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={item + index}
                                style={[
                                    Style.flexCenter,
                                    styles.bottomBtn,
                                    index === 0
                                        ? {marginLeft: 0, backgroundColor: '#fff', borderColor: Colors.descColor}
                                        : {},
                                    item.avail
                                        ? {}
                                        : index === 0
                                        ? {borderColor: '#c2d5f0'}
                                        : {backgroundColor: '#c2d5f0'},
                                ]}
                                onPress={() => {
                                    global.LogTool(item.action, props.route?.params?.poid);
                                    item.avail && accountJump(item.url, item.action);
                                }}>
                                <Text
                                    style={{
                                        fontSize: px(15),
                                        color: index === 0 ? (item.avail ? Colors.descColor : '#c2d5f0') : '#fff',
                                    }}>
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ) : null}
            {reasonListDialogPropsAndVisible && (
                <ReasonListDialog
                    close={() => {
                        setReasonListDialogPropsAndVisible(null);
                    }}
                    {...reasonListDialogPropsAndVisible}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    topRightBtn: {
        flex: 1,
        width: text(24),
        marginRight: text(14),
    },
    editImg: {
        width: text(24),
        height: text(24),
    },
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
    ad_info: {
        height: px(60),
        borderRadius: 8,
        marginTop: px(12),
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
    center: {
        left: text(143.5),
    },
    right: {
        left: text(251),
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
    fixedBtns: {
        paddingVertical: text(8),
        paddingHorizontal: Space.padding,
        paddingBottom: isIphoneX() ? 34 + text(8) : text(8),
        backgroundColor: '#fff',
    },
    bottomBtn: {
        flex: 1,
        height: px(44),
        marginLeft: px(12),
        borderWidth: Space.borderWidth,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.brandColor,
        borderColor: Colors.brandColor,
    },
    updateBtn: {
        borderRadius: px(4),
        borderWidth: Space.borderWidth,
        width: px(56),
        height: px(24),
    },
    updateText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
    },
    updateTime: {
        marginTop: px(2),
        fontSize: Font.textSm,
        lineHeight: px(21),
        color: Colors.lightGrayColor,
    },
    light_text: {fontSize: px(13), lineHeight: px(17)},
    superscriptBox: {
        paddingVertical: text(1),
        paddingHorizontal: text(5),
        borderRadius: text(9),
        borderBottomLeftRadius: text(0.5),
        backgroundColor: Colors.red,
        position: 'absolute',
        bottom: text(31),
        right: 0,
    },
    superscript: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    sign_scrollview: {
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        padding: px(16),
    },
    groupBulletin: {
        paddingTop: px(6),
        paddingRight: px(16),
        paddingBottom: px(12),
        paddingLeft: px(8),
        borderBottomLeftRadius: px(8),
        borderBottomRightRadius: px(8),
    },
    groupBulletinTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    groupBulletinTitle: {
        fontWeight: '500',
        color: '#121D3a',
        lineHeight: px(18),
        fontSize: px(13),
        marginLeft: px(8),
        marginTop: px(6),
        flex: 1,
    },
    groupBulletinBottom: {
        marginTop: px(6),
        paddingLeft: px(8),
    },
    groupBulletinBottomContent: {
        fontSize: px(12),
        color: '#545968',
        lineHeight: px(17),
    },
    groupBulletinBtnTextWrapper: {
        borderBottomColor: '#0051cc',
        borderBottomWidth: 1,
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    groupBulletinBtnText: {
        fontSize: px(12),
        color: '#0051cc',
    },
    mark: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: text(10),
        paddingBottom: px(16),
    },
    markBtn: {
        width: px(140),
        paddingVertical: px(10),
        borderRadius: px(6),
        backgroundColor: '#0051CC',
    },
    markBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
        textAlign: 'center',
    },
    dsInfoContent: {
        paddingHorizontal: px(28),
        fontSize: px(13),
        lineHeight: px(21),
        color: '#121D3A',
    },
});

const fundDetailStyles = StyleSheet.create({
    subContainer: {
        // paddingHorizontal: Space.padding,
    },
    titleContainer: {
        paddingVertical: text(14),
    },
    circle: {
        width: text(10),
        height: text(10),
        borderRadius: text(6),
        marginRight: text(8),
    },
    name: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    numStyle: {
        fontSize: text(13),
        lineHeight: text(16),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        marginLeft: text(4),
    },
    fundContainer: {
        marginBottom: text(12),
        paddingTop: text(14),
        paddingBottom: text(18),
        paddingHorizontal: text(14),
        borderRadius: text(4),
        backgroundColor: '#fff',
    },
    fundTitle: {
        marginBottom: text(14),
    },
    subTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.brandColor,
    },
    historyHolding: {
        padding: Space.padding,
        marginVertical: text(28),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    redeemBtn: {
        borderWidth: 1,
        borderColor: '#0051CC',
        borderRadius: px(12),
        paddingVertical: px(3),
        paddingHorizontal: px(8),
    },
    redeemBtnText: {
        fontSize: px(12),
        lineHeight: px(18),
        color: '#0051CC',
    },
});
