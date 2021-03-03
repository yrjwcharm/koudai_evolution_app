/*
 * @Author: xjh
 * @Date: 2021-02-19 10:33:09
 * @Description:组合持仓页
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-02 18:58:28
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Dimensions} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {baseLineChart} from '../Portfolio/components/ChartOption';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChartData from '../Portfolio/Detail/data.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomDesc from '../../components/BottomDesc';
import {Chart} from '../../components/Chart';
import FixedBtn from '../Portfolio/components/FixedBtn';
import Header from '../../components/NavBar';
import Notice from '../../components/Notice';
import storage from '../../utils/storage';
import FitImage from 'react-native-fit-image';
const btnHeight = isIphoneX() ? text(90) : text(66);
const deviceWidth = Dimensions.get('window').width;

export default function PortfolioAssets() {
    const [data, setData] = useState({});
    const [card, setCard] = useState({});
    const [chart, setChart] = useState({});
    const [showEye, setShowEye] = useState(true);
    const [left, setLeft] = useState('0%');
    const [widthD, setWidthD] = useState('0%');
    const [period, setPeriod] = useState('y1');
    const [chartData, setChartData] = useState();
    const [moveRight, setMoveRight] = useState(false);
    var _l;
    const changeTab = (num, period) => {
        setPeriod(period);
        setChartData(num);
    };
    useEffect(() => {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/position/detail/20210101', {
            poid: 'X04F008618',
            account_id: 6,
        }).then((res) => {
            setData(res.result);
            const _left = res.result.progress_bar.percent_text;
            if (_left.split('%')[0] < 10) {
                _l = _left.split('%')[0] - 1 + '%';
            } else {
                _l = _left.split('%')[0] + '%';
            }
            setLeft(_l);
            setWidthD(res.result.progress_bar.percent_text);
        });
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/position/console/20210101', {
            poid: 'X04F008618',
            account_id: 6,
        }).then((res) => {
            setCard(res.result);
        });
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/position/chart/20210101', {
            poid: 'X04F008618',
            account_id: 6,
            period: 'y1',
        }).then((res) => {
            setChart(res.result);
            setChartData(res.result.chart);
        });
    }, []);

    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            setShowEye(!show);
            storage.save('myAssetsEye', show);
        });
    }, []);
    const jumpTo = (url) => {
        // navigation.navigate(url);
    };

    return (
        <>
            {/* {Object.keys(data).length > 0 &&} */}

            <Header
                title={data.title}
                leftIcon="chevron-left"
                style={{backgroundColor: '#0052CD'}}
                fontStyle={{color: '#fff'}}
            />
            {Object.keys(data).length > 0 && data?.processing_info && <Notice content={data.processing_info} />}
            <ScrollView style={{marginBottom: btnHeight}}>
                <View style={styles.assets_card_sty}>
                    {Object.keys(data).length > 0 && (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
                            <View>
                                <View style={[Style.flexRow, {marginBottom: text(15)}]}>
                                    <Text style={styles.profit_text_sty}>总金额(元)</Text>
                                    <TouchableOpacity onPress={toggleEye}>
                                        <Ionicons
                                            name={showEye === true ? 'eye-outline' : 'eye-off-outline'}
                                            size={16}
                                            color={'rgba(255, 255, 255, 0.8)'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.profit_num_sty, {fontSize: text(24)}]}>
                                    {showEye ? data.amount : '***'}
                                </Text>
                            </View>
                            <View>
                                <View style={[Style.flexRow, {marginBottom: text(15), alignSelf: 'flex-end'}]}>
                                    <Text style={styles.profit_text_sty}>日收益</Text>
                                    <Text style={[styles.profit_num_sty, {marginTop: !showEye ? text(5) : 0}]}>
                                        {showEye ? data.profit : '***'}
                                    </Text>
                                </View>
                                <View style={Style.flexRow}>
                                    <Text style={styles.profit_text_sty}>累计收益</Text>
                                    <Text style={[styles.profit_num_sty, {marginTop: !showEye ? text(5) : 0}]}>
                                        {showEye ? data.profit_acc : '***'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {Object.keys(data).length > 0 && data.progress_bar && (
                        <>
                            <View style={styles.process_wrap_sty}>
                                <View style={[styles.bubbles_sty, {left: left}]}>
                                    <Text style={styles.bubble_text_sty}>{data.progress_bar.percent_text}</Text>
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
                                <Text style={{fontSize: text(12), color: '#fff'}}>
                                    {data?.progress_bar?.range_text[1]}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.list_card_sty}>
                    {Object.keys(data).length > 0 &&
                        data.core_buttons.map((_item, _index) => {
                            return (
                                <TouchableOpacity
                                    style={{alignItems: 'center'}}
                                    key={_index + '_item0'}
                                    onPress={jumpTo}>
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
                <View>
                    {Object.keys(data).length > 0 && data.ad_info && (
                        <TouchableOpacity onPress={jumpTo(data.ad_info.url)}>
                            <FitImage
                                source={{
                                    uri: data.ad_info.img,
                                }}
                                resizeMode="contain"
                                style={{marginBottom: text(10)}}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.padding_sty}>
                    {Object.keys(card).length > 0 && (
                        <View style={styles.plan_card_sty}>
                            <Html style={styles.plan_title_sty} html={card.title_info.content} />
                            <Text style={styles.plan_desc_sty}>{card.desc}</Text>
                            {card?.notice ? (
                                <View style={styles.blue_wrap_style}>
                                    <Text style={styles.blue_text_style}>{card.notice}</Text>
                                </View>
                            ) : null}
                            <View style={[Style.flexRow, {justifyContent: 'space-between', marginTop: text(14)}]}>
                                {card.button_list.map((_button, _index) => {
                                    return (
                                        <TouchableOpacity
                                            key={_index + '_button'}
                                            onPress={() => jumpTo(_button.url)}
                                            style={{
                                                borderColor: '#4E556C',
                                                borderWidth: _index == 0 ? 0.5 : 0,
                                                borderRadius: text(6),
                                                backgroundColor:
                                                    _button.avail !== 0 ? '#0051CC' : _index == 0 ? '#eee' : '#C7D8F0',
                                                flex: 1,

                                                marginRight: _index < card.button_list.length - 1 ? text(10) : 0,
                                            }}>
                                            <Text
                                                style={{
                                                    paddingVertical: text(10),
                                                    textAlign: 'center',
                                                    color: _index == 0 ? '#545968' : '#fff',
                                                }}>
                                                {_button.text}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* 净值趋势图 */}
                    {Object.keys(chart).length > 0 && (
                        <>
                            <Text style={styles.title_sty}>{chart.title}</Text>
                            <View
                                style={{
                                    height: 280,
                                    backgroundColor: '#fff',
                                    paddingVertical: text(20),
                                    paddingBottom: text(10),
                                    borderRadius: text(10),
                                }}>
                                <View style={[Style.flexRow]}>
                                    <View style={styles.legend_sty}>
                                        <Text style={styles.legend_title_sty}>{chart.label[0].val}</Text>
                                        <Text style={styles.legend_desc_sty}>{chart.label[0].name}</Text>
                                    </View>
                                    <View style={styles.legend_sty}>
                                        <Text style={[styles.legend_title_sty, {color: '#E74949'}]}>
                                            {chart.label[1].val}
                                        </Text>
                                        <Text>
                                            <MaterialCommunityIcons
                                                name={'record-circle-outline'}
                                                color={'#E74949'}
                                                size={12}
                                            />
                                            <Text style={styles.legend_desc_sty}>{chart.label[1].name}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.legend_sty}>
                                        <Text style={styles.legend_title_sty}>{chart.label[2].val}</Text>
                                        <Text>
                                            <MaterialCommunityIcons
                                                name={'record-circle-outline'}
                                                color={'#545968'}
                                                size={12}
                                            />
                                            <Text style={styles.legend_desc_sty}>{chart.label[2].name}</Text>
                                        </Text>
                                    </View>
                                </View>
                                <Chart initScript={baseLineChart(chartData, [Colors.red], true)} />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        height: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginHorizontal: 20,
                                    }}>
                                    {chart.sub_tabs.map((_item, _index) => {
                                        let num = _index * 10 + 10;
                                        return (
                                            <TouchableOpacity
                                                key={_index + '_item2'}
                                                style={[
                                                    styles.btn_sty,
                                                    {
                                                        backgroundColor: period == _item.period ? '#F1F6FF' : '#fff',
                                                        marginRight: _index != chart.sub_tabs.length - 1 ? text(10) : 0,
                                                    },
                                                ]}
                                                onPress={() => changeTab(num, _item.val)}>
                                                <Text
                                                    style={{
                                                        color: period == _item.period ? '#0051CC' : '#555B6C',
                                                        fontSize: text(12),
                                                    }}>
                                                    {_item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </>
                    )}

                    {Object.keys(data).length > 0 && data?.asset_deploy && (
                        <>
                            <View style={Style.flexBetween}>
                                <Text style={styles.title_sty}>{data.asset_deploy.header.title}</Text>
                                <Text style={{color: '#0051CC', fontSize: text(12)}}>
                                    {data.asset_deploy.header.text}
                                </Text>
                            </View>
                            <View style={styles.fund_card_sty}>
                                <View style={[Style.flexBetween, {paddingBottom: text(10)}]}>
                                    <Text style={styles.fund_title_sty}>{data.asset_deploy.th.name}</Text>
                                    <Text style={styles.fund_title_sty}>{data.asset_deploy.th.ratio}</Text>
                                </View>
                                {data.asset_deploy.items.map((_i, _d) => {
                                    return (
                                        <View style={[Style.flexBetween, styles.fund_item_sty]} key={_d + '_i'}>
                                            <View>
                                                <Text style={{color: '#333333'}}>{_i.name}</Text>
                                                <Text
                                                    style={{
                                                        color: '#999999',
                                                        fontSize: text(11),
                                                        marginTop: text(5),
                                                        fontFamily: Font.numFontFamily,
                                                    }}>
                                                    {_i.code}
                                                </Text>
                                            </View>
                                            <Text
                                                style={{
                                                    color: '#333333',
                                                    fontSize: text(13),
                                                    fontFamily: Font.numFontFamily,
                                                }}>
                                                {_i.percent}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </>
                    )}
                    <View style={[styles.list_card_sty, {margin: 0, marginTop: text(16)}]}>
                        {Object.keys(data).length > 0 &&
                            data.extend_buttons.map((_e, _index) => {
                                return (
                                    <View style={{alignItems: 'center'}} key={_index + '_e'}>
                                        <Image
                                            source={{
                                                uri: _e.icon,
                                            }}
                                            resizeMode="contain"
                                            style={{
                                                width: text(24),
                                                height: text(24),
                                                marginBottom: text(5),
                                            }}
                                        />
                                        <Text style={styles.list_text_sty}>{_e.text}</Text>
                                    </View>
                                );
                            })}
                    </View>
                </View>
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
    },
    profit_num_sty: {
        color: '#fff',
        fontSize: text(17),
        fontFamily: Font.numFontFamily,
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
        marginTop: text(10),
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
        borderRadius: text(12),
    },
    title_sty: {
        color: '#1F2432',
        fontSize: Font.textH1,
        fontWeight: 'bold',
        marginBottom: text(12),
        marginTop: text(20),
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
        paddingVertical: text(5),
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingVertical: text(10),
    },
});
