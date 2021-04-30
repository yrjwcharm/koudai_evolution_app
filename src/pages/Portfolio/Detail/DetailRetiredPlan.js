// /*
//  * @Author: xjh
//  * @Date: 2021-01-27 18:33:13
//  * @Description:养老详情页
//  * @LastEditors: xjh
//  * @LastEditTime: 2021-01-27 18:37:22
//  */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text, formaNum, deviceWidth, onlyNumber} from '../../../utils/appUtil';
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
import {BottomModal, InputModal} from '../../../components/Modal';
import {useJump} from '../../../components/hooks';
import RenderChart from '../components/RenderChart';
import Notice from '../../../components/Notice';
import Toast from '../../../components/Toast';
import _ from 'lodash';

export default function DetailRetiredPlan({navigation, route}) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
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
    const [modalProps, setModalProps] = useState({});
    const [iptVal, setIptVal] = useState('');
    const inputModal = useRef(null);
    const inputRef = useRef(null);
    const iptValRef = useRef('');
    const [tableData, setTableData] = useState({});
    const jump = useJump();
    const tabClick = useRef(true);
    const [btns, setBtns] = useState([]);

    const changeTab = (p, t) => {
        if (!tabClick.current) {
            return false;
        }
        setPeriod((prev) => {
            if (prev !== p) {
                tabClick.current = false;
            }
            return p;
        });
        setType(t);
    };
    // 计算金额
    const countCalc = (item, action) => {
        const _interval = Number(item.interval);
        const t = item.type;
        if (t === 'begin') {
            setCountFr((prev) => {
                let next = prev;
                if (action === 'increase') {
                    next = prev + _interval;
                    if (next < item.min) {
                        next = item.min;
                        Toast.show(`组合最低起投金额为${formaNum(item.min, 'nozero')}`);
                    } else if (next > item.max) {
                        next = item.max;
                        Toast.show('金额需小于1亿');
                    }
                } else {
                    next = prev - _interval;
                    if (next < item.min) {
                        next = 0;
                    }
                }
                return next;
            });
        } else if (t === 'auto') {
            setCountM((prev) => {
                let next = prev;
                if (action === 'increase') {
                    next = prev + _interval;
                    if (next < item.min) {
                        next = item.min;
                        Toast.show(`组合最低起投金额为${formaNum(item.min, 'nozero')}`);
                    } else if (next > item.max) {
                        next = item.max;
                        Toast.show('金额需小于1亿');
                    }
                } else {
                    next = prev - _interval;
                    if (next < item.min) {
                        next = 0;
                    }
                }
                return next;
            });
        }
    };
    const changeNotice = useCallback((params) => {
        Http.get('/portfolio/future/yield_amount/20210101', params).then((res) => {
            if (res.code === '000000') {
                setRemark(res.result.remark);
                setGoalAmount(res.result.goal_amount);
                setSubTabs(res.result.sub_tabs);
                if (params.type === 2) {
                    setPeriod(res.result.period);
                }
            }
        });
    }, []);
    const init = useCallback(() => {
        Http.get('/portfolio/purpose_invest_detail/20210101', {
            upid: route.params.upid,
            amount: route?.params?.amount,
        })
            .then((res) => {
                setLoading(false);
                if (res.code === '000000') {
                    allocationIdRef.current = res.result.allocation_id;
                    poidRef.current = res.result?.poid;
                    setPeriod(res.result.period);
                    setType(res.result.period.indexOf('f') !== -1 ? 2 : 1);
                    setGoalAmount(res.result?.plan_info?.goal_info?.amount);
                    res.result?.plan_info?.goal_info?.items.forEach((item, index) => {
                        if (item.type == 'begin') {
                            setCountFr(Number(item.val));
                        } else if (item.type == 'auto') {
                            setCountM(Number(item.val));
                        } else if (item.type == 'duration') {
                            setCurrent(item.val);
                        }
                    });
                    setTableData(res.result.asset_compare?.table);
                    setBtns(res.result.btns || []);
                    setData(res.result);
                }
            })
            .catch(() => {
                setLoading(false);
            });
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
    const getChartInfo = useCallback(() => {
        setChart([]);
        Http.get('/portfolio/yield_chart/20210101', {
            upid: route.params.upid,
            period: period,
            type: type,
            poid: poidRef.current,
        }).then((res) => {
            tabClick.current = true;
            if (res.code === '000000') {
                setChartData(res.result);
                setChart(res.result?.yield_info?.chart);
                setTableData((prev) => {
                    const next = _.cloneDeep(prev);
                    next.tr_list[0][1] = res.result.yield_info.label[1].val;
                    if (res.result.yield_info.label[2]) {
                        next.tr_list[0][2] = res.result.yield_info.label[2].val;
                    }
                    return next;
                });
            }
        });
    }, [period, type, route.params]);
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
            pickerTextEllipsisLen: 100,
            selectedValue: [current],
            wheelFlex: [1, 1],
            onPickerConfirm: (pickedValue) => {
                setShowMask(false);
                setCurrent(pickedValue[0]);
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
    const showInputModal = (item, val) => {
        setIptVal(`${val}`);
        setModalProps({
            confirmClick: () => confirmClick(item),
            placeholder: `请输入${item.key}`,
            title: item.key,
        });
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 200);
    };
    const confirmClick = (item) => {
        inputModal.current.hide();
        if (iptValRef.current < item.min) {
            if (iptValRef.current > 0) {
                item.type === 'begin' ? setCountFr(item.min) : setCountM(item.min);
                Toast.show(`组合最低起投金额为${formaNum(item.min)}`);
            } else {
                item.type === 'begin' ? setCountFr(0) : setCountM(0);
            }
        } else if (iptValRef.current > item.max) {
            item.type === 'begin' ? setCountFr(item.max) : setCountM(item.max);
            Toast.show('金额需小于1亿');
        } else {
            item.type === 'begin'
                ? setCountFr(parseFloat(iptValRef.current))
                : setCountM(parseFloat(iptValRef.current));
        }
    };
    useEffect(() => {
        if (Object.keys(modalProps).length > 0) {
            inputModal.current.show();
        }
    }, [modalProps]);
    useEffect(() => {
        iptValRef.current = iptVal;
    }, [iptVal]);
    useEffect(() => {
        if (data?.title) {
            navigation.setOptions({
                title: data.title,
                headerRight: () => {
                    return data?.top_button ? (
                        <TouchableOpacity onPress={() => jump(data?.top_button?.url, 'replace')} activeOpacity={1}>
                            <Text style={styles.right_sty}>{data?.top_button?.title}</Text>
                        </TouchableOpacity>
                    ) : null;
                },
            });
        }
    }, [data, jump, navigation]);
    useEffect(() => {
        if (data.poid) {
            getChartInfo();
        }
    }, [data, getChartInfo, type]);
    useEffect(() => {
        if (data.poid) {
            const params = {
                initial_amount: countFr,
                per_amount: countM,
                allocation_id: allocationIdRef.current,
                year: current,
                type,
                goal_amount: data.plan_info.goal_info.amount,
                upid: route.params.upid,
            };
            changeNotice(params);
        }
    }, [current, changeNotice, countFr, countM, data, route.params, type]);
    useEffect(() => {
        setBtns((prev) => {
            if (prev[1] && prev[1]?.url?.params?.amount) {
                const next = _.cloneDeep(prev);
                if (parseFloat(countFr) !== 0) {
                    next[1].url.params.amount = parseFloat(countFr);
                } else if (parseFloat(countM) !== 0) {
                    next[1].url.params.amount = parseFloat(countM);
                } else {
                    next[1].url.params.amount = '';
                }
                return next;
            } else {
                return prev;
            }
        });
    }, [countFr, countM]);
    useFocusEffect(
        useCallback(() => {
            init();
        }, [init])
    );
    return loading ? (
        renderLoading()
    ) : (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <InputModal {...modalProps} ref={inputModal}>
                <View style={[Style.flexRow, styles.inputContainer]}>
                    <Text style={styles.unit}>¥</Text>
                    <TextInput
                        clearButtonMode={'never'}
                        keyboardType={'decimal-pad'}
                        onChangeText={(value) => setIptVal(onlyNumber(value))}
                        ref={inputRef}
                        style={[styles.inputStyle]}
                        value={iptVal}
                    />
                    {`${iptVal}`.length === 0 && <Text style={styles.placeholder}>{modalProps?.placeholder}</Text>}
                    {`${iptVal}`.length > 0 && (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIptVal('')}>
                            <AntDesign name={'closecircle'} color={'#CDCDCD'} size={text(16)} />
                        </TouchableOpacity>
                    )}
                </View>
            </InputModal>
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
                                    style={{
                                        borderRadius: text(25),
                                        marginBottom: text(7),
                                        paddingVertical: text(8),
                                        paddingHorizontal: Space.padding,
                                    }}>
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
                                                            onPress={() => countCalc(_item, 'decrease')}>
                                                            <Ionicons
                                                                name={'remove-circle'}
                                                                size={25}
                                                                color={'#0051CC'}
                                                            />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            activeOpacity={0.8}
                                                            onPress={() =>
                                                                showInputModal(
                                                                    _item,
                                                                    _item.type == 'begin' ? countFr : countM
                                                                )
                                                            }>
                                                            <Text style={styles.count_num_sty}>
                                                                {_item.type == 'begin'
                                                                    ? formaNum(countFr)
                                                                    : formaNum(countM)}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            activeOpacity={1}
                                                            onPress={() => countCalc(_item, 'increase')}>
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
                            <View style={{minHeight: text(300)}}>
                                {true && (
                                    <>
                                        <RenderChart
                                            chartData={chartData}
                                            period={period}
                                            chart={chart}
                                            showFutureArea={false}
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
                                                                    period == _item.val && type == _item.type
                                                                        ? '#F1F6FF'
                                                                        : '#fff',
                                                                borderWidth:
                                                                    period == _item.val && type == _item.type ? 0 : 0.5,
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
                                    </>
                                )}
                            </View>

                            {/* 表格 */}
                            <Table data={tableData} />
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
            {btns && <FixedBtn btns={btns} />}
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
        lineHeight: text(20),
        color: Colors.descColor,
        fontSize: Font.textH3,
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
    inputContainer: {
        marginVertical: text(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        position: 'relative',
    },
    unit: {
        fontSize: text(26),
        fontFamily: Font.numFontFamily,
    },
    inputStyle: {
        flex: 1,
        fontSize: text(35),
        lineHeight: text(42),
        height: text(42),
        marginLeft: text(14),
        padding: 0,
        fontFamily: Font.numMedium,
    },
    placeholder: {
        position: 'absolute',
        left: text(30),
        top: text(3.5),
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.placeholderColor,
    },
});
