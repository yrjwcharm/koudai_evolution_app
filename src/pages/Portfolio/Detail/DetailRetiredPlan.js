// /*
//  * @Author: xjh
//  * @Date: 2021-01-27 18:33:13
//  * @Description:养老详情页
//  * @LastEditors: xjh
//  * @LastEditTime: 2021-01-27 18:37:22
//  */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text, formaNum, deviceWidth} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {pieChart} from './ChartOption';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FixedBtn from '../components/FixedBtn';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import LinearGradient from 'react-native-linear-gradient';
import ListHeader from '../components/ListHeader';
import Table from '../components/Table';
import {useFocusEffect} from '@react-navigation/native';
import Picker from 'react-native-picker';
import Mask from '../../../components/Mask';
import {BottomModal} from '../../../components/Modal';
import {useJump} from '../../../components/hooks';
import RenderChart from '../components/RenderChart';
import Notice from '../../../components/Notice';

export default function DetailRetiredPlan({navigation, route}) {
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y3');
    const [chartData, setChartData] = useState({});
    const [countFr, setCountFr] = useState(0); //首投金额
    const [countM, setCountM] = useState(0); //定投金额
    const [goalAmount, setGoalAmount] = useState(0);
    const [showMask, setShowMask] = useState(false);
    const [current, setCurrent] = useState('');
    const [popup, setPopup] = useState({});
    const bottomModal = React.useRef(null);
    const [type, setType] = useState(1);
    const [remark, setRemark] = useState('');
    const [chart, setChart] = useState([]);
    const allocationIdRef = useRef('');
    const poidRef = useRef('');
    const [subTabs, setSubTabs] = useState([]);
    const jump = useJump();

    const changeTab = (p, t) => {
        setPeriod(p);
        setType(t);
        if (t === 2) {
            const params = {
                initial_amount: countFr,
                per_amount: countM,
                allocation_id: allocationIdRef.current,
                goal_amount: data.plan_info.goal_info.amount,
                year: current,
                type: t,
                upid: route.params.upid,
            };
            changeNotice(params);
        }
    };
    // 计算金额
    const countCalc = (interval, action, t) => {
        const _interval = Number(interval);
        if (t == 'begin') {
            setCountFr((prev) => {
                let next = prev;
                if (action === 'increase') {
                    next = prev + _interval;
                } else {
                    next = prev - _interval;
                }
                if (next < 0 || next > 10000000) {
                    next = prev;
                }
                const params = {
                    initial_amount: next,
                    per_amount: countM,
                    allocation_id: allocationIdRef.current,
                    year: current,
                    type,
                    goal_amount: data.plan_info.goal_info.amount,
                    upid: route.params.upid,
                };
                changeNotice(params);
                return next;
            });
        } else {
            setCountM((prev) => {
                let next = prev;
                if (action === 'increase') {
                    next = prev + _interval;
                } else {
                    next = prev - _interval;
                }
                if (next < 2000 || next > 10000000) {
                    next = prev;
                }
                const params = {
                    initial_amount: countFr,
                    per_amount: next,
                    allocation_id: allocationIdRef.current,
                    year: current,
                    type,
                    goal_amount: data.plan_info.goal_info.amount,
                    upid: route.params.upid,
                };
                changeNotice(params);
                return next;
            });
        }
        changeNotice();
    };
    const changeNotice = useCallback((params) => {
        Http.get('/portfolio/future/yield_chart/20210101', params).then((res) => {
            if (res.code === '000000') {
                setRemark(res.result.remark);
                setGoalAmount(res.result.goal_amount);
                setSubTabs(res.result.sub_tabs);
                if (params.type == 2) {
                    setChart(res.result.chart);
                }
            }
        });
    }, []);
    const init = useCallback(() => {
        Http.get('/portfolio/purpose_invest_detail/20210101', {
            upid: route.params.upid,
            amount: route?.params?.amount,
        }).then((res) => {
            setCurrent(res.result?.plan_info?.goal_info?.items[2]?.val);
            allocationIdRef.current = res.result.allocation_id;
            poidRef.current = res.result?.poid;
            setGoalAmount(res.result?.plan_info?.goal_info?.amount);
            setData(res.result);
            res.result?.plan_info?.goal_info?.items.forEach((item, index) => {
                if (item.type == 'begin') {
                    setCountFr(Number(item.val));
                } else if (item.type == 'auto') {
                    setCountM(Number(item.val));
                } else if (item.type == 'duration') {
                    setCurrent(item.val);
                }
            });
            setRemark(res.result.plan_info?.goal_info?.remark);
        });
    }, [route.params]);
    const getChartInfo = useCallback(() => {
        Http.get('/portfolio/yield_chart/20210101', {
            upid: route.params.upid,
            period: period,
            type: type,
            poid: poidRef.current,
        }).then((res) => {
            setChartData(res.result);
            setChart(res.result?.yield_info?.chart);
            setSubTabs(res.result.yield_info?.sub_tabs);
        });
    }, [period, type, route]);
    // 打开日期选择 视图
    const _showDatePicker = () => {
        setShowMask(true);
        Picker.init({
            pickerTitleText: '投入年限',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerBg: [255, 255, 255, 1],
            pickerData: _createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            pickerToolBarBg: [249, 250, 252, 1],
            pickerRowHeight: 36,
            pickerConfirmBtnColor: [0, 82, 205, 1],
            pickerCancelBtnColor: [128, 137, 155, 1],
            selectedValue: [current],
            wheelFlex: [1, 1],
            onPickerConfirm: (pickedValue) => {
                setShowMask(false);
                setCurrent(pickedValue[0]);
                const params = {
                    initial_amount: countFr,
                    per_amount: countM,
                    allocation_id: allocationIdRef.current,
                    year: pickedValue[0],
                    type,
                    goal_amount: data.plan_info.goal_info.amount,
                    upid: route.params.upid,
                };
                changeNotice(params);
            },
            onPickerCancel: () => {
                setShowMask(false);
            },
        });
        Picker.show();
    };
    const _createDateData = () => {
        let _dep = [];
        for (let i = 1; i <= 60; i++) {
            _dep.push(i);
        }
        return _dep;
    };
    const showTips = (tip) => {
        setPopup(tip);
        bottomModal.current.show();
    };
    useEffect(() => {
        if (data?.top_button) {
            navigation.setOptions({
                title: data.title,
                headerRight: () => {
                    return (
                        <TouchableOpacity onPress={() => jump(data?.top_button?.url)} activeOpacity={1}>
                            <Text style={styles.right_sty}>{data?.top_button?.title}</Text>
                        </TouchableOpacity>
                    );
                },
            });
        }
    }, [data, jump, navigation]);
    useEffect(() => {
        if (data.poid && type === 1) {
            getChartInfo();
        }
    }, [data, getChartInfo, period, type]);
    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            {Object.keys(data).length > 0 ? (
                <ScrollView style={{flex: 1}}>
                    {data?.processing_info && <Notice content={data?.processing_info} />}
                    <View style={[styles.container_sty]}>
                        <View>
                            <View style={Style.flexRow}>
                                <Text style={{color: '#9AA1B2'}}>{data?.plan_info?.goal_info?.title}</Text>
                                <View style={{borderRadius: text(4), backgroundColor: '#F1F6FF', marginLeft: text(8)}}>
                                    <Text style={styles.age_text_sty}>{data?.plan_info?.goal_info?.tip}</Text>
                                </View>
                            </View>
                            <Text style={styles.fund_input_sty}>{formaNum(goalAmount)}</Text>
                            <View style={{position: 'relative', marginTop: text(5)}}>
                                <FontAwesome
                                    name={'caret-up'}
                                    color={'#E9EAED'}
                                    size={30}
                                    style={{left: text(25), top: text(-18), position: 'absolute'}}
                                />
                                <LinearGradient
                                    start={{x: 0, y: 0.25}}
                                    end={{x: 0.8, y: 0.8}}
                                    colors={['#E9EAED', '#F5F6F8']}
                                    style={{borderRadius: text(25), marginBottom: text(7)}}>
                                    <Text style={styles.tip_sty}>{remark}</Text>
                                </LinearGradient>
                                {data?.plan_info?.goal_info?.items.map((_item, _index) => {
                                    return (
                                        <View key={_index}>
                                            {(_item.type == 'auto' || _item.type == 'begin') && (
                                                <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                                    <Text style={{color: '#545968', flex: 1}}>{_item.key}</Text>
                                                    <View
                                                        style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                                        <TouchableOpacity
                                                            activeOpacity={1}
                                                            onPress={() =>
                                                                countCalc(_item.interval, 'decrease', _item.type)
                                                            }>
                                                            <Ionicons
                                                                name={'remove-circle'}
                                                                size={25}
                                                                color={'#0051CC'}
                                                            />
                                                        </TouchableOpacity>

                                                        <Text style={styles.count_num_sty}>
                                                            {_item.type == 'begin'
                                                                ? formaNum(countFr)
                                                                : formaNum(countM)}
                                                        </Text>
                                                        <TouchableOpacity
                                                            activeOpacity={1}
                                                            onPress={() =>
                                                                countCalc(_item.interval, 'increase', _item.type)
                                                            }>
                                                            <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                            {_item.type == 'duration' && (
                                                <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                                    <Text style={{color: '#545968'}}>{_item.key}</Text>
                                                    <TouchableOpacity
                                                        style={[Style.flexRow, {paddingVertical: text(5)}]}
                                                        onPress={_showDatePicker}
                                                        activeOpacity={1}>
                                                        <Text style={{color: '#545968'}}>{current}年</Text>
                                                        <AntDesign name={'down'} color={'#8D96AF'} size={12} />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                    <View style={styles.content_sty}>
                        <View style={styles.card_sty}>
                            <Text style={styles.title_sty}>{chartData?.title}</Text>
                            <RenderChart
                                chartData={chartData}
                                period={period}
                                chart={chart}
                                tootipScope={false}
                                type={type}
                                style={{marginTop: text(20)}}
                                width={deviceWidth - text(40)}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    height: 50,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginHorizontal: Space.marginAlign,
                                }}>
                                {subTabs?.map((_item, _index) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[
                                                styles.btn_sty,
                                                {
                                                    backgroundColor:
                                                        period == _item.val && type == _item.type ? '#F1F6FF' : '#fff',
                                                    borderWidth: period == _item.val && type == _item.type ? 0 : 0.5,
                                                },
                                            ]}
                                            key={_index + '_sub'}
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

                            {/* 表格 */}
                            <Table data={data.asset_compare.table} />
                            {data?.asset_compare?.tip_info?.title && (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{marginLeft: text(16), flexDirection: 'row', alignItems: 'baseline'}}
                                    onPress={() => showTips(data?.asset_compare?.tip_info?.popup)}>
                                    <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                                    <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                        {data?.asset_compare?.tip_info?.title}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {/* 饼图 */}
                        <View style={styles.card_sty}>
                            <ListHeader
                                data={data.asset_deploy.header}
                                style={{paddingHorizontal: text(16)}}
                                color={'#0051CC'}
                            />
                            <View style={{height: text(140)}}>
                                <Chart initScript={pieChart(data.asset_deploy.items, data.asset_deploy.chart)} />
                            </View>
                        </View>
                        <View style={[styles.card_sty, {paddingHorizontal: text(16)}]}>
                            <ListHeader data={data.asset_strategy.header} hide={true} />
                            {data.asset_strategy.items.map((_s, _d, arr) => {
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            // marginTop: text(20),
                                            marginTop: _d !== 0 ? text(36) : text(20),
                                        }}
                                        key={_d + '_s'}>
                                        <Image
                                            source={{
                                                uri: _s.icon,
                                            }}
                                            resizeMode="contain"
                                            style={{width: text(69), height: text(69), marginRight: text(10)}}
                                        />
                                        <View
                                            style={{
                                                flex: 1,
                                            }}>
                                            <Text style={{color: '#111111'}}>{_s.title}</Text>
                                            <Text
                                                style={{
                                                    color: '#9AA1B2',
                                                    fontSize: text(12),
                                                    marginTop: text(8),
                                                    lineHeight: text(16),
                                                }}>
                                                {_s.content}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                            {data?.asset_strategy?.tip_info?.title && (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'baseline',
                                        marginTop: text(16),
                                    }}
                                    onPress={() => showTips(data?.asset_strategy?.tip_info?.popup)}>
                                    <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                                    <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                        {data?.asset_strategy?.tip_info?.title}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View
                            style={[
                                styles.card_sty,
                                {paddingVertical: 0, paddingHorizontal: text(16), marginBottom: 0},
                            ]}>
                            {data.gather_info.map((_q, _w) => {
                                return (
                                    <TouchableOpacity
                                        key={_w + '_q'}
                                        activeOpacity={1}
                                        style={[
                                            Style.flexRow,
                                            {
                                                borderTopWidth: _w == 0 ? 0 : 0.5,
                                                borderColor: '#ddd',
                                            },
                                        ]}
                                        onPress={() => jump(_q.url)}>
                                        <Text style={{flex: 1, paddingVertical: text(20)}}>{_q.title}</Text>
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
                        }}>
                        {data.tip}
                    </Text>
                    <BottomDesc style={{marginTop: text(80)}} />
                </ScrollView>
            ) : null}
            {showMask && (
                <Mask
                    onClick={() => {
                        setShowMask(false);
                        Picker.hide();
                    }}
                />
            )}
            <BottomModal ref={bottomModal} confirmText={'确认'} title={popup?.title}>
                <View style={{padding: text(16)}}>{popup?.content ? <Html html={popup.content} /> : null}</View>
            </BottomModal>
            {data?.btns && <FixedBtn btns={data?.btns} />}
        </View>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        color: '#1F2432',
        marginRight: text(16),
    },
    container_sty: {
        backgroundColor: '#fff',
        padding: Space.padding,
        paddingBottom: 0,
    },
    select_text_sty: {
        // flex: 1,
        color: '#545968',
    },
    select_wrap_sty: {
        borderBottomWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingBottom: text(16),
    },
    age_num_sty: {
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
    },
    select_btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        borderRadius: text(15),
        paddingVertical: text(4),
        flex: 1,
        marginRight: text(8),
    },
    fund_input_sty: {
        fontSize: text(34),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        marginVertical: text(8),
    },
    tip_sty: {
        height: text(36),
        lineHeight: text(36),
        color: '#545968',
        fontSize: text(12),
        marginHorizontal: text(16),
        flexWrap: 'wrap',
    },
    count_wrap_sty: {
        paddingVertical: text(19),
        borderTopWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    count_num_sty: {
        color: '#292D39',
        fontSize: text(20),
        fontFamily: Font.numFontFamily,
        minWidth: text(130),
        textAlign: 'center',
    },
    content_sty: {
        margin: Space.marginAlign,
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        paddingVertical: Space.padding,
        marginBottom: text(16),
    },
    title_sty: {
        color: '#111111',
        fontSize: Font.textH1,
        fontWeight: 'bold',
        paddingHorizontal: text(16),
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
    btn_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(10),
        paddingVertical: text(5),
        borderRadius: text(15),
        marginRight: text(4),
    },
    age_text_sty: {
        color: '#0051CC',
        paddingHorizontal: text(3),
        fontSize: text(11),
        paddingVertical: text(2),
    },
});
