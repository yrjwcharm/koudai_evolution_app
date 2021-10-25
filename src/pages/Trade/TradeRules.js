/*
 * @Author: dx
 * @Date: 2021-01-18 19:31:01
 * @LastEditTime: 2021-09-27 13:53:42
 * @LastEditors: dx
 * @Description: 交易须知
 * @FilePath: /koudai_evolution_app/src/pages/Detail/TradeRules.js
 */
import React, {Component, useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View, Text, ScrollView} from 'react-native';
import Image from 'react-native-fast-image';
import {useHeaderHeight} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import http from '../../services';
import {px as text, deviceHeight, deviceWidth, px} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Html from '../../components/RenderHtml';
import BottomDesc from '../../components/BottomDesc';

const Part1 = () => {
    const headerHeight = useHeaderHeight();
    const route = useRoute();
    const [data, setData] = useState({});
    useEffect(() => {
        const {upid, poid, allocation_id, risk, scene} = route.params || {};
        if (scene === 'adviser') {
            http.get('/adviser/tran/rules/20210923', {poid, type: 'buy_rule'}).then((res) => {
                if (res.code === '000000') {
                    setData(res.result.data || {});
                }
            });
        } else {
            http.get('/portfolio/mustknow/20210101', {
                upid,
                type: 'trade_rate',
                poid,
                allocation_id,
                risk,
            }).then((res) => {
                if (res.code == '000000') {
                    setData(res.result.data || {});
                }
            });
        }
    }, [route]);
    return Object.keys(data).length > 0 ? (
        <View>
            {route.params.scene === 'adviser' ? (
                <>
                    <Text style={[styles.title, {paddingVertical: Space.padding}]}>{data.confirm_time?.title}</Text>
                    <View style={{paddingHorizontal: Space.padding, backgroundColor: '#fff'}}>
                        <Image
                            resizeMode={Image.resizeMode.contain}
                            source={require('../../assets/img/line.png')}
                            style={[styles.line]}
                        />
                        <View style={[styles.buyComfirmTime, {marginBottom: px(4), borderBottomWidth: 0}]}>
                            {data.confirm_time?.steps?.map?.((step, idx, arr) => {
                                return (
                                    <View
                                        key={`confirm_step${idx}`}
                                        style={{
                                            flex: 1,
                                            alignItems:
                                                idx === 0
                                                    ? 'flex-start'
                                                    : idx === arr.length - 1
                                                    ? 'flex-end'
                                                    : 'center',
                                        }}>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.key}</Text>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.value}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Text style={styles.buyNotice}>
                            <Text style={styles.blueCircle}>•&nbsp;</Text>
                            <Text style={[styles.buyNoticeText]}>
                                {
                                    'T日：交易日，15:00(含)之前为T日，15:00之后为T+1日。周末和法定节假日属于非交易日，以支付成功时间为准。\n'
                                }
                            </Text>
                            <Text style={styles.blueCircle}>•&nbsp;</Text>
                            <Text style={[styles.buyNoticeText]}>
                                {'以上时间点仅供参考，具体时间以各基金公司实际确认为准。'}
                            </Text>
                        </Text>
                    </View>
                    <Text style={[styles.title, {marginTop: text(10), paddingTop: Space.padding}]}>
                        {data.rate?.title}
                    </Text>
                    <View style={[styles.feeDescBox, {paddingTop: 0}]}>
                        <Text style={[styles.feeDesc, {color: Colors.descColor}]}>{data.rate?.tip}</Text>
                    </View>
                    <Text style={[styles.title, {marginTop: text(10), paddingTop: Space.padding}]}>
                        {data.service_rate?.title}
                    </Text>
                    <View style={[styles.feeDescBox, {paddingTop: 0}]}>
                        <Text style={[styles.feeDesc, {color: Colors.descColor}]}>{data.service_rate?.tip}</Text>
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.title}>赎回费率</Text>
                    <View style={[styles.feeHeadTitle, Style.flexBetween]}>
                        <Text style={[styles.feeHeadTitleText]}>{data.th && data.th[0]}</Text>
                        <Text style={[styles.feeHeadTitleText]}>{data.th && data.th[1]}</Text>
                    </View>
                    {data.tr_list?.map?.((item, index, arr) => {
                        return (
                            <View
                                key={`fee${index}`}
                                style={[
                                    styles.feeTableItem,
                                    Style.flexBetween,
                                    {
                                        backgroundColor: index % 2 === 0 ? '#fff' : Colors.bgColor,
                                        borderBottomWidth: index === arr?.length - 1 ? Space.borderWidth : 0,
                                    },
                                ]}>
                                <Text style={[styles.feeTableLeftText]}>{item[0]}</Text>
                                <Text style={[styles.feeTableRightText]}>{item[1]}</Text>
                            </View>
                        );
                    })}
                    <View style={[styles.feeDescBox]}>
                        <View style={{marginBottom: text(12)}}>
                            <Html
                                style={styles.feeDesc}
                                html={
                                    '基金卖出时一般按照先进先出规则, 部分基金卖出按照后进后出规则. 基金卖出手续费与持有期限相关. 实际费用收取请以基金公司确认为准.'
                                }
                            />
                        </View>
                        <View style={{marginBottom: text(20)}}>
                            <Html
                                style={styles.feeDesc}
                                html={
                                    '赎回计算公式：\n赎回总额=赎回数量xT日基金单位净值\n赎回费用=赎回总额x赎回费率\n赎回到账金额=赎回总额-赎回费用'
                                }
                            />
                        </View>
                        <Html
                            style={{...styles.feeDesc, lineHeight: text(20)}}
                            html={'基金费率等信息以基金公司最新披露的基金信息为准'}
                        />
                    </View>
                    <Text style={[styles.title, {marginTop: text(10), paddingTop: Space.padding}]}>调仓费率</Text>
                    <View style={[styles.feeDescBox, {paddingTop: 0}]}>
                        <Text style={[styles.feeDesc, {color: Colors.descColor}]}>{data?.adjust_content}</Text>
                    </View>
                    {data?.manage ? (
                        <>
                            <Text style={[styles.title, {marginTop: text(10), paddingTop: Space.padding}]}>
                                {data?.manage?.title}
                            </Text>
                            <View style={[styles.feeDescBox, {paddingTop: 0}]}>
                                <Html
                                    html={data?.manage?.content}
                                    style={{...styles.feeDesc, color: Colors.descColor}}
                                />
                            </View>
                        </>
                    ) : null}
                </>
            )}
        </View>
    ) : (
        <ActivityIndicator
            color={Colors.brandColor}
            style={{width: deviceWidth, height: deviceHeight - headerHeight - text(42)}}
        />
    );
};

const Part2 = () => {
    const headerHeight = useHeaderHeight();
    const route = useRoute();
    const [data, setData] = useState({});
    useEffect(() => {
        const {upid, poid, allocation_id, scene} = route.params || {};
        if (scene === 'adviser') {
            http.get('/adviser/tran/rules/20210923', {poid, type: 'redeem_rule'}).then((res) => {
                if (res.code === '000000') {
                    setData(res.result.data || {});
                }
            });
        } else {
            http.get('/portfolio/mustknow/20210101', {
                upid,
                type: 'confirm_time',
                poid,
                allocation_id,
            }).then((res) => {
                if (res.code == '000000') {
                    setData(res.result.data);
                }
            });
        }
    }, [route]);
    return Object.keys(data).length > 0 ? (
        <View>
            {route.params.scene === 'adviser' ? (
                <>
                    <Text style={[styles.title, {paddingVertical: Space.padding}]}>{data.confirm_time?.title}</Text>
                    <View style={{paddingHorizontal: Space.padding, backgroundColor: '#fff'}}>
                        <Image
                            resizeMode={Image.resizeMode.contain}
                            source={require('../../assets/img/line.png')}
                            style={[styles.line]}
                        />
                        <View style={[styles.buyComfirmTime, {marginBottom: px(4), borderBottomWidth: 0}]}>
                            {data.confirm_time?.steps?.map?.((step, idx, arr) => {
                                return (
                                    <View
                                        key={`confirm_step${idx}`}
                                        style={{
                                            flex: 1,
                                            alignItems:
                                                idx === 0
                                                    ? 'flex-start'
                                                    : idx === arr.length - 1
                                                    ? 'flex-end'
                                                    : 'center',
                                        }}>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.key}</Text>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.value}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Text style={styles.buyNotice}>
                            <Text style={styles.blueCircle}>•&nbsp;</Text>
                            <Text style={[styles.buyNoticeText]}>
                                {
                                    'T日：交易日，15:00(含)之前为T日，15:00之后为T+1日。周末和法定节假日属于非交易日，以支付成功时间为准。\n'
                                }
                            </Text>
                            <Text style={styles.blueCircle}>•&nbsp;</Text>
                            <Text style={[styles.buyNoticeText]}>
                                {'以上时间点仅供参考，具体时间以各基金公司实际确认为准。'}
                            </Text>
                        </Text>
                    </View>
                    <Text style={[styles.title, {marginTop: text(10), paddingTop: Space.padding}]}>
                        {data.rate?.title}
                    </Text>
                    <View style={[styles.feeHeadTitle, Style.flexBetween]}>
                        <Text style={[styles.feeHeadTitleText]}>{data.rate?.table?.th && data.rate?.table?.th[0]}</Text>
                        <Text style={[styles.feeHeadTitleText]}>{data.rate?.table?.th && data.rate?.table?.th[1]}</Text>
                    </View>
                    {data.rate?.table?.tr_list?.map?.((item, index, arr) => {
                        return (
                            <View
                                key={`fee${index}`}
                                style={[
                                    styles.feeTableItem,
                                    Style.flexBetween,
                                    {
                                        backgroundColor: index % 2 === 0 ? '#fff' : Colors.bgColor,
                                        borderBottomWidth: index === arr?.length - 1 ? Space.borderWidth : 0,
                                    },
                                ]}>
                                <Text style={[styles.feeTableLeftText]}>{item[0]}</Text>
                                <Text style={[styles.feeTableRightText]}>{item[1]}</Text>
                            </View>
                        );
                    })}
                    <View style={[styles.feeDescBox]}>
                        <Html style={styles.feeDesc} html={data.rate?.table?.adjust_content} />
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.productInfoWrap}>
                        <Text style={styles.productInfoTitle}>{data[0]?.title}</Text>
                        <Image
                            resizeMode={Image.resizeMode.contain}
                            source={require('../../assets/img/line.png')}
                            style={[styles.line]}
                        />
                        <View style={styles.buyComfirmTime}>
                            {data[0]?.steps?.map?.((step, idx, arr) => {
                                return (
                                    <View
                                        key={`confirm_step${idx}`}
                                        style={{
                                            flex: 1,
                                            alignItems:
                                                idx === 0
                                                    ? 'flex-start'
                                                    : idx === arr.length - 1
                                                    ? 'flex-end'
                                                    : 'center',
                                        }}>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.key}</Text>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.value}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Text style={styles.buyNotice}>
                            <Text style={styles.blueCircle}>•&nbsp;</Text>
                            <Text style={[styles.buyNoticeText]}>
                                {
                                    'T日：交易日15:00前购买/赎回则当日为T日，15:00后购买/赎回则下一个交易日为T日，购买/赎回净值均按T日基金单位净值确认。周末和法定节假日不属于交易日。'
                                }
                            </Text>
                        </Text>
                        <View style={styles.buyTableWrap}>
                            <View style={styles.buyTableHead}>
                                <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                    <Text style={[styles.buyTableItem, styles.fontColor]}>{data[0]?.table?.th[0]}</Text>
                                </View>
                                <View style={[styles.buyTableCell]}>
                                    <Text style={[styles.buyTableItem, styles.fontColor]}>{data[0]?.table?.th[1]}</Text>
                                </View>
                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                    <Text style={[styles.buyTableItem, styles.fontColor]}>{data[0]?.table?.th[2]}</Text>
                                </View>
                            </View>
                            {data[0]?.table?.tr_list?.map((item, index) => {
                                return (
                                    <View
                                        style={[
                                            styles.buyTableBody,
                                            {backgroundColor: index % 2 === 1 ? Colors.bgColor : '#fff'},
                                        ]}
                                        key={`confirm_row${index}`}>
                                        <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                            <Html html={item[0]} style={styles.buyTableItem} />
                                        </View>
                                        <View style={[styles.buyTableCell]}>
                                            <Html html={item[1]} style={styles.buyTableItem} />
                                        </View>
                                        <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                            <Html html={item[2]} style={styles.buyTableItem} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={[styles.productInfoWrap]}>
                        <Text style={styles.productInfoTitle}>{data[1]?.title}</Text>
                        <Image
                            resizeMode={Image.resizeMode.contain}
                            source={require('../../assets/img/line.png')}
                            style={[styles.line]}
                        />
                        <View style={[styles.buyComfirmTime, {borderBottomWidth: 0, marginBottom: 0}]}>
                            {data[1]?.steps?.map((step, idx, arr) => {
                                return (
                                    <View
                                        key={`confirm_step${idx}`}
                                        style={{
                                            flex: 1,
                                            alignItems:
                                                idx === 0
                                                    ? 'flex-start'
                                                    : idx === arr.length - 1
                                                    ? 'flex-end'
                                                    : 'center',
                                        }}>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.key}</Text>
                                        <Text style={[styles.buyComfirmTimeText]}>{step.value}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        {/* <Text style={styles.buyNotice}>
                                <Text style={styles.blueCircle}>• </Text>
                                <Text style={[styles.buyNoticeText]}>{''}</Text>
                            </Text> */}
                        <View style={[styles.buyTableWrap]}>
                            <View style={styles.buyTableHead}>
                                <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                    <Text style={[styles.buyTableItem, styles.fontColor]}>{data[1]?.table?.th[0]}</Text>
                                </View>
                                <View style={[styles.buyTableCell]}>
                                    <Text style={[styles.buyTableItem, styles.fontColor]}>{data[1]?.table?.th[1]}</Text>
                                </View>
                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                    <Text style={[styles.buyTableItem, styles.fontColor]}>{data[1]?.table?.th[2]}</Text>
                                </View>
                            </View>
                            {data[1]?.table?.tr_list?.map((item, index) => {
                                return (
                                    <View
                                        style={[
                                            styles.buyTableBody,
                                            {backgroundColor: index % 2 === 1 ? Colors.bgColor : '#fff'},
                                        ]}
                                        key={`confirm_row${index}`}>
                                        <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                            <Html html={item[0]} style={styles.buyTableItem} />
                                        </View>
                                        <View style={[styles.buyTableCell]}>
                                            <Html html={item[1]} style={styles.buyTableItem} />
                                        </View>
                                        <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                            <Html html={item[2]} style={styles.buyTableItem} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={[styles.productInfoWrap, {marginBottom: 0}]}>
                        <Text style={styles.productInfoTitle}>{'调仓 确认时间'}</Text>
                        <Text style={[styles.buyNotice, {paddingTop: 0}]}>
                            <Text style={styles.blueCircle}>•&nbsp;</Text>
                            <Text style={[styles.buyNoticeText]}>
                                {
                                    '调仓确认时间是由赎回时间+购买时间组成，调仓赎回的资金是分别到账的，每到账一笔，都会按比例购买需要调入的基金。一般情况将在T+2日完成调仓，如遇QDII基金赎回，这部分资金将在T+7日完成调仓。'
                                }
                            </Text>
                        </Text>
                    </View>
                </>
            )}
        </View>
    ) : (
        <ActivityIndicator
            color={Colors.brandColor}
            style={{width: deviceWidth, height: deviceHeight - headerHeight - text(42)}}
        />
    );
};

const Part3 = () => {
    const headerHeight = useHeaderHeight();
    const route = useRoute();
    const [data, setData] = useState({});
    useEffect(() => {
        const {upid, poid, allocation_id} = route.params || {};
        http.get('/portfolio/mustknow/20210101', {
            upid,
            type: 'trade_amount',
            poid,
            allocation_id,
        }).then((res) => {
            if (res.code == '000000') {
                setData(res.result.data);
            }
        });
    }, [route]);
    return Object.keys(data).length > 0 ? (
        <View>
            <View style={styles.productInfoWrap}>
                <Text style={styles.productInfoTitle}>{data[0]?.title}</Text>
                <View style={styles.buyNotice}>
                    <Html style={{...styles.buyComfirmTimeText, color: Colors.darkGrayColor}} html={data[0]?.content} />
                </View>
                <View style={styles.buyTableWrap}>
                    <View style={styles.buyTableHead}>
                        <View style={[styles.buyTableCell]}>
                            <Text style={[styles.buyTableItem, styles.fontColor]}>{data[0]?.table?.th[0]}</Text>
                        </View>
                        <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                            <Text style={[styles.buyTableItem, styles.fontColor]}>{data[0]?.table?.th[1]}</Text>
                        </View>
                    </View>
                    {data[0]?.table?.tr_list?.map((item, index) => {
                        return (
                            <View
                                style={[
                                    styles.buyTableBody,
                                    {backgroundColor: (index + 1) % 2 == 0 ? Colors.bgColor : '#fff'},
                                ]}
                                key={index + 'baaa'}>
                                <View style={[styles.buyTableCell]}>
                                    <Html html={item[0]} style={styles.buyTableItem} />
                                </View>
                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                    <Html html={item[1]} style={styles.buyTableItem} />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
            <View style={[styles.productInfoWrap, {marginBottom: 0}]}>
                <Text style={styles.productInfoTitle}>{data[1]?.title}</Text>
                <View style={styles.buyNotice}>
                    <Html style={{...styles.buyComfirmTimeText, color: Colors.darkGrayColor}} html={data[1]?.content} />
                </View>
                <View style={styles.buyTableWrap}>
                    <View style={styles.buyTableHead}>
                        <View style={[styles.buyTableCell, {flex: 1.5}]}>
                            <Text style={[styles.buyTableItem, styles.fontColor]}>{data[1]?.table?.th[0]}</Text>
                        </View>
                        <View style={[styles.buyTableCell]}>
                            <Text style={[styles.buyTableItem, styles.fontColor]}>{data[1]?.table?.th[1]}</Text>
                        </View>
                        <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                            <Text style={[styles.buyTableItem, styles.fontColor]}>{data[1]?.table?.th[2]}</Text>
                        </View>
                    </View>
                    {data[1]?.table?.tr_list?.map((item, index) => {
                        return (
                            <View
                                key={index + 'c'}
                                style={[
                                    styles.buyTableBody,
                                    {backgroundColor: (index + 1) % 2 == 0 ? Colors.bgColor : '#fff'},
                                ]}>
                                <View style={[styles.buyTableCell, {flex: 1.5}]}>
                                    <Html html={item[0]} style={styles.buyTableItem} />
                                </View>
                                <View style={[styles.buyTableCell]}>
                                    <Html html={item[1]} style={styles.buyTableItem} />
                                </View>
                                <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                    <Html html={item[2]} style={styles.buyTableItem} />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    ) : (
        <ActivityIndicator
            color={Colors.brandColor}
            style={{width: deviceWidth, height: deviceHeight - headerHeight - text(42)}}
        />
    );
};

const Part4 = () => {
    const headerHeight = useHeaderHeight();
    const route = useRoute();
    const [data, setData] = useState([]);
    useEffect(() => {
        const {upid, poid, allocation_id} = route.params || {};
        http.get('/portfolio/mustknow/20210101', {
            upid,
            type: 'bank_limit',
            poid,
            allocation_id,
        }).then((res) => {
            if (res.code == '000000') {
                setData(res.result.data);
            }
        });
    }, [route]);
    return (
        <View style={{backgroundColor: '#fff'}}>
            {data.map((item, index) => {
                return (
                    <View style={styles.banklistWrap} key={index + 'l'}>
                        <Image source={{uri: item.icon}} style={{width: text(28), height: text(28)}} />
                        <View style={styles.banklistItem}>
                            <Text style={{textAlign: 'left', color: Colors.descColor}}>{item.name}</Text>
                            <Text style={{textAlign: 'right', flex: 1, color: Colors.descColor}}>{item.tip}</Text>
                        </View>
                    </View>
                );
            })}
            {data?.length === 0 && (
                <ActivityIndicator
                    color={Colors.brandColor}
                    style={{width: deviceWidth, height: deviceHeight - headerHeight - text(42)}}
                />
            )}
        </View>
    );
};

class TradeRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curIndex: 0,
            head:
                props.route.params.scene === 'adviser'
                    ? [
                          {
                              title: '购买规则',
                          },
                          {
                              title: '赎回规则',
                          },
                      ]
                    : [
                          {
                              title: '交易费率',
                          },
                          {
                              title: '确认时间',
                          },
                          {
                              title: '交易金额',
                          },
                          {
                              title: '银行卡限额',
                          },
                      ],
        };
    }
    componentDidMount() {}
    ChangeTab = (i) => {
        this.setState({
            curIndex: i,
        });
    };
    render() {
        const {head} = this.state;
        return (
            <ScrollableTabView
                style={[styles.container]}
                renderTabBar={() => <Tab />}
                initialPage={0}
                onChangeTab={(obj) => this.ChangeTab(obj.i)}>
                {head.map((item, index) => {
                    return (
                        <ScrollView
                            bounces={false}
                            style={{transform: [{translateY: text(-1.5)}]}}
                            tabLabel={item.title}
                            key={index + 'head'}>
                            <View style={{paddingTop: 2}}>
                                {index === 0 && <Part1 />}
                                {index === 1 && <Part2 />}
                                {index === 2 && <Part3 />}
                                {index === 3 && <Part4 />}
                                <BottomDesc />
                            </View>
                        </ScrollView>
                    );
                })}
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    underLine: {
        backgroundColor: Colors.brandColor,
        height: text(2),
        width: text(16),
        left: text(38),
        marginBottom: text(6),
        borderRadius: text(2),
    },
    TradeRuleHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    TradeRuleText: {
        fontSize: Font.textH2,
        paddingHorizontal: text(10),
        flex: 1,
        color: Colors.brandColor,
        fontWeight: 'bold',
        paddingVertical: text(10),
    },
    line: {
        height: text(8),
        marginTop: text(4),
        marginBottom: text(12),
    },
    productInfoWrap: {
        backgroundColor: '#fff',
        paddingHorizontal: text(16),
        marginBottom: text(10),
    },
    productAdjustWrap: {
        paddingBottom: text(20),
        marginTop: text(10),
    },
    productInfoTitle: {
        paddingVertical: text(12),
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontWeight: 'bold',
    },
    productInfoDesc: {
        color: Colors.darkGrayColor,
        fontSize: text(13),
        lineHeight: text(20),
        paddingVertical: text(14),
    },
    productlist: {
        borderTopWidth: text(1),
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        paddingVertical: text(14),
    },
    productInfoNotice: {
        backgroundColor: Colors.bgColor,
        color: Colors.darkGrayColor,
        paddingVertical: text(12),
        paddingHorizontal: text(10),
        marginTop: text(10),
    },
    blueCircle: {
        fontSize: text(18),
        lineHeight: text(22),
        color: Colors.brandColor,
    },
    buyComfirmTime: {
        marginBottom: Space.marginVertical,
        paddingBottom: Space.padding,
        borderColor: Colors.borderColor,
        borderBottomWidth: Space.borderWidth,
        flexDirection: 'row',
    },
    buyComfirmTimeText: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.brandColor,
        textAlign: 'justify',
    },
    buyNotice: {
        paddingBottom: Space.padding,
        // textAlign: 'justify',
    },
    buyNoticeText: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.darkGrayColor,
    },
    buyTableCell: {
        paddingHorizontal: text(6),
        flex: 1,
        height: '100%',
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyTableItem: {
        flex: 1,
        textAlign: 'center',
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
    },
    buyTableWrap: {
        borderColor: Colors.borderColor,
        borderWidth: Space.borderWidth,
        borderRadius: text(6),
        overflow: 'hidden',
        marginVertical: text(20),
        marginTop: 0,
    },
    buyTableHead: {
        flexDirection: 'row',
        backgroundColor: Colors.bgColor,
        height: text(43),
    },
    buyTableBody: {
        flexDirection: 'row',
        height: text(40),
    },
    paddingBottom: {
        marginBottom: text(40),
    },
    fontColor: {
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    banklistItem: {
        flexDirection: 'row',
        paddingHorizontal: text(14),
        flex: 1,
    },
    banklistWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingVertical: text(4),
        height: text(50),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        borderStyle: 'solid',
        backgroundColor: '#fff',
        paddingLeft: text(20),
    },
    title: {
        paddingHorizontal: Space.marginAlign,
        paddingVertical: text(12),
        backgroundColor: '#fff',
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    feeHeadTitle: {
        height: text(36),
        backgroundColor: Colors.bgColor,
        flexDirection: 'row',
        paddingHorizontal: Space.marginAlign,
    },
    feeHeadTitleText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
    },
    feeTableItem: {
        height: text(45),
        paddingHorizontal: Space.marginAlign,
        flexDirection: 'row',
        borderColor: Colors.borderColor,
        borderStyle: 'solid',
    },
    feeTableLeftText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    feeTableRightText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: '#FF7D41',
        // fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
    },
    feeDescBox: {
        paddingHorizontal: Space.marginAlign,
        paddingTop: text(12),
        paddingBottom: Space.padding,
        backgroundColor: '#fff',
    },
    feeDesc: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.darkGrayColor,
        textAlign: 'justify',
    },
});

export default TradeRules;
