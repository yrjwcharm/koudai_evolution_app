// /*
//  * @Author: xjh
//  * @Date: 2021-01-27 18:33:13
//  * @Description:养老详情页
//  * @LastEditors: xjh
//  * @LastEditTime: 2021-01-27 18:37:22
//  */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px, px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {pie} from './ChartOption';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FixedBtn from '../components/FixedBtn';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import Header from '../../../components/NavBar';
import LinearGradient from 'react-native-linear-gradient';
import ListHeader from '../components/ListHeader';
import {baseAreaChart} from '../components/ChartOption';
import Table from '../components/Table';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import Picker from 'react-native-picker';
import Mask from '../../../components/Mask';
import {BottomModal} from '../../../components/Modal';
import {useJump} from '../../../components/hooks';
export default function DetailRetiredPlan({navigation, route}) {
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y1');
    const [chartData, setChartData] = useState();
    const _textTime = useRef(null);
    const _textPortfolio = useRef(null);
    const _textBenchmark = useRef(null);
    const [countFr, setCountFr] = useState();
    const [countM, setCountM] = useState();
    const [showMask, setShowMask] = useState(false);
    const [current, setCurrent] = useState();
    const [popup, setPopup] = useState();
    const bottomModal = React.useRef(null);
    const [age, setAge] = useState('');
    const [choose, setChoose] = useState(1);
    const [type, setType] = useState(1);
    const jump = useJump();

    const rightPress = () => {
        navigation.navigate('Evaluation');
    };
    const changeTab = (period, type) => {
        setPeriod(period);
        setType(type);
    };
    // 选择大学
    const chooseBtn = () => {};
    const selectAge = () => {
        Picker.init({
            pickerTitleText: '年龄选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [age],
            pickerBg: [255, 255, 255, 1],
            pickerData: _createDateData(),
            pickerFontColor: [33, 33, 33, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                setAge(pickedValue[0]);
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
    // 计算金额
    const countCalc = (interval, action, type) => {
        const _interval = Number(interval);
        if (type == 'begin') {
            if (countFr <= 2000 || countFr >= 1000000) {
                return;
            }
            if (action == 'increase') {
                setCountFr(countFr + _interval);
            } else {
                setCountFr(countFr - _interval);
            }
        } else {
            if (countM <= 2000 || countM >= 1000000) {
                return;
            }
            if (action == 'increase') {
                setCountM(countM + _interval);
            } else {
                setCountM(countM - _interval);
            }
        }
    };
    const init = useCallback(() => {
        Http.get('/portfolio/purpose_invest_detail/20210101', {
            upid: route.params.upid,
        }).then((res) => {
            setData(res.result);
            setAge(res.result.plan_info.personal_info.age);
            setCountFr(Number(res.result?.plan_info?.goal_info?.items[0]?.val));
            setCountM(Number(res.result?.plan_info?.goal_info?.items[1]?.val));
            setCurrent(res.result?.plan_info?.goal_info?.items[2]?.val);
            Http.get('/portfolio/yield_chart/20210101', {
                upid: route.params.upid,
                period: period,
                type: type,
            }).then((res) => {
                setChartData(res.result);
            });
        });
    }, [route.params, period]);
    useFocusEffect(
        useCallback(() => {
            init();
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
        const _data = chartData?.yield_info;
        _textTime.current.setNativeProps({text: _data?.label[0].val});
        _textPortfolio.current.setNativeProps({
            text: _data?.label[1].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label[1].val)}],
        });
        _textBenchmark.current.setNativeProps({
            text: _data?.label[2].val,
            style: [styles.legend_title_sty, {color: getColor(_data?.label[2].val)}],
        });
    };
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);

    const showTips = (tip) => {
        setPopup(tip);
        bottomModal.current.show();
    };
    return (
        <>
            {Object.keys(data).length > 0 ? (
                <View style={{flex: 1}}>
                    <Header
                        title={data?.title}
                        leftIcon="chevron-left"
                        rightText={'重新测评'}
                        rightPress={rightPress}
                        rightTextStyle={styles.right_sty}
                    />
                    <ScrollView style={{marginBottom: FixedBtn.btnHeight}}>
                        <View style={styles.container_sty}>
                            <View style={[Style.flexBetween, styles.select_wrap_sty]}>
                                <Text style={styles.select_text_sty}>
                                    {data.plan_info.personal_info.title}
                                    <Text>({data?.plan_info?.personal_info?.tip})</Text>
                                </Text>
                                <TouchableOpacity style={Style.flexRow} onPress={selectAge}>
                                    <Text>
                                        <Text style={styles.age_num_sty}>{age}</Text>岁
                                    </Text>
                                    <AntDesign name={'down'} size={12} color={'#545968'} />
                                </TouchableOpacity>
                            </View>
                            <View style={[Style.flexRow, {marginTop: text(7)}]}>
                                <TouchableOpacity
                                    style={[
                                        Style.flexRowCenter,
                                        styles.select_btn_sty,
                                        {
                                            borderColor:
                                                choose == data?.plan_info?.schoolList[0]?.id ? '#DC4949' : '#E2E4EA',
                                        },
                                    ]}
                                    onPress={chooseBtn(data?.plan_info?.schoolList[0]?.id)}>
                                    <Image
                                        source={
                                            choose == data?.plan_info?.schoolList[0]?.id
                                                ? require('../../../assets/img/detail/icon_ed_0_ac.png')
                                                : require('../../../assets/img/detail/icon_ed_0.png')
                                        }
                                        style={{width: text(24), height: text(24)}}
                                    />
                                    <Text
                                        style={{
                                            color: choose == data?.plan_info?.schoolList[0]?.id ? '#DC4949' : '#545968',
                                        }}>
                                        {data?.plan_info?.schoolList[0]?.name}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        Style.flexRowCenter,
                                        styles.select_btn_sty,
                                        {
                                            borderColor:
                                                choose == data?.plan_info?.schoolList[1]?.id ? '#DC4949' : '#E2E4EA',
                                        },
                                    ]}
                                    onPress={chooseBtn(data?.plan_info?.schoolList[1]?.id)}>
                                    <Image
                                        source={
                                            choose == data?.plan_info.schoolList[1]?.id
                                                ? require('../../../assets/img/detail/icon_ed_1_ac.png')
                                                : require('../../../assets/img/detail/icon_ed_1.png')
                                        }
                                        style={{width: text(24), height: text(24)}}
                                    />
                                    <Text
                                        style={{
                                            color: choose == data?.plan_info?.schoolList[1]?.id ? '#DC4949' : '#545968',
                                        }}>
                                        {data?.plan_info?.schoolList[1]?.name}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        Style.flexRowCenter,
                                        styles.select_btn_sty,
                                        {
                                            marginRight: 0,
                                            borderColor:
                                                choose == data?.plan_info?.schoolList[2]?.id ? '#DC4949' : '#E2E4EA',
                                        },
                                    ]}
                                    onPress={chooseBtn(data?.plan_info?.schoolList[2]?.id)}>
                                    <Image
                                        source={
                                            choose == data?.plan_info?.schoolList[2]?.id
                                                ? require('../../../assets/img/detail/icon_ed_2_ac.png')
                                                : require('../../../assets/img/detail/icon_ed_2.png')
                                        }
                                        style={{width: text(24), height: text(24)}}
                                    />
                                    <Text
                                        style={{
                                            color: choose == data?.plan_info?.schoolList[2]?.id ? '#DC4949' : '#545968',
                                        }}>
                                        {data?.plan_info?.schoolList[2]?.name}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <View style={[Style.flexRow, {marginTop: text(24)}]}>
                                    <Text style={{color: '#9AA1B2'}}>{data?.plan_info?.goal_info?.title}</Text>
                                </View>
                                <Text style={styles.fund_input_sty}>{data?.plan_info?.goal_info?.amount}</Text>
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
                                        <Text style={styles.tip_sty}>{data?.plan_info?.goal_info?.remark}</Text>
                                    </LinearGradient>
                                    <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                        <Text style={{color: '#545968', flex: 1}}>
                                            {data?.plan_info?.goal_info?.items[0]?.key}
                                        </Text>
                                        <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    countCalc(
                                                        data?.plan_info?.goal_info?.items[0].interval,
                                                        'decrease',
                                                        data?.plan_info?.goal_info?.items[0].type
                                                    )
                                                }>
                                                <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                            </TouchableOpacity>
                                            <Text style={styles.count_num_sty}>{countFr}</Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    countCalc(
                                                        data?.plan_info?.goal_info?.items[0].interval,
                                                        'increase',
                                                        data?.plan_info?.goal_info?.items[0].type
                                                    )
                                                }>
                                                <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                        <Text style={{color: '#545968', flex: 1}}>
                                            {data?.plan_info?.goal_info?.items[1]?.key}
                                        </Text>
                                        <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    countCalc(
                                                        data?.plan_info?.goal_info?.items[1].interval,
                                                        'decrease',
                                                        data?.plan_info?.goal_info?.items[1].type
                                                    )
                                                }>
                                                <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                            </TouchableOpacity>
                                            <Text style={styles.count_num_sty}>{countM}</Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    countCalc(
                                                        data?.plan_info?.goal_info?.items[1].interval,
                                                        'increase',
                                                        data?.plan_info?.goal_info?.items[1].type
                                                    )
                                                }>
                                                <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.content_sty}>
                            <View style={styles.card_sty}>
                                <Text style={styles.title_sty}>{chartData?.title}</Text>
                                <View style={{height: 300, backgroundColor: '#fff', marginTop: text(20)}}>
                                    <View style={[Style.flexRow]}>
                                        <View style={styles.legend_sty}>
                                            <TextInput
                                                ref={_textTime}
                                                style={styles.legend_title_sty}
                                                defaultValue={chartData?.yield_info?.label[0]?.val}
                                                editable={false}
                                            />
                                            <Text style={styles.legend_desc_sty}>
                                                {chartData?.yield_info?.label[0]?.key}
                                            </Text>
                                        </View>
                                        <View style={styles.legend_sty}>
                                            <TextInput
                                                style={[
                                                    styles.legend_title_sty,
                                                    {color: getColor(chartData?.yield_info?.label[1]?.val)},
                                                ]}
                                                ref={_textPortfolio}
                                                defaultValue={chartData?.yield_info?.label[1]?.val}
                                                editable={false}
                                            />
                                            <Text>
                                                <MaterialCommunityIcons
                                                    name={'record-circle-outline'}
                                                    color={'#E74949'}
                                                    size={12}
                                                />
                                                <Text style={styles.legend_desc_sty}>
                                                    {chartData?.yield_info?.label[1]?.key}
                                                </Text>
                                            </Text>
                                        </View>
                                        <View style={styles.legend_sty}>
                                            <TextInput
                                                style={[
                                                    styles.legend_title_sty,
                                                    {color: getColor(chartData?.yield_info?.label[2]?.val)},
                                                ]}
                                                ref={_textBenchmark}
                                                defaultValue={chartData?.yield_info?.label[2]?.val}
                                                editable={false}
                                            />
                                            <Text>
                                                <MaterialCommunityIcons
                                                    name={'record-circle-outline'}
                                                    color={'#545968'}
                                                    size={12}
                                                />
                                                <Text style={styles.legend_desc_sty}>
                                                    {chartData?.yield_info?.label[2]?.key}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <Chart
                                        initScript={baseAreaChart(
                                            chartData?.yield_info?.chart,
                                            [Colors.red, Colors.lightBlackColor, 'transparent'],
                                            ['l(90) 0:#E74949 1:#fff', 'transparent', '#50D88A'],
                                            true
                                        )}
                                        onChange={onChartChange}
                                        data={chartData?.yield_info?.chart}
                                        onHide={onHide}
                                        style={{width: '100%'}}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            height: 50,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginHorizontal: 20,
                                        }}>
                                        {chartData?.yield_info?.sub_tabs?.map((_item, _index) => {
                                            return (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.btn_sty,
                                                        {
                                                            backgroundColor:
                                                                period == _item.val && type == _item.type
                                                                    ? '#F1F6FF'
                                                                    : '#fff',
                                                        },
                                                    ]}
                                                    key={_index}
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
                                </View>

                                {/* 表格 */}
                                <Table data={data.asset_compare.table} />
                                {data?.asset_compare?.tip_info?.title && (
                                    <TouchableOpacity
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
                                <View style={{height: 200}}>
                                    <Chart initScript={pie(data.asset_deploy.items, data.asset_deploy.chart)} />
                                </View>
                            </View>
                            <View style={[styles.card_sty, {paddingHorizontal: text(16)}]}>
                                <ListHeader data={data.asset_strategy.header} />
                                {data.asset_strategy.items.map((_s, _d) => {
                                    return (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                marginTop: text(20),
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
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'baseline',
                                            marginTop: text(16),
                                        }}>
                                        <AntDesign
                                            name={'exclamationcircleo'}
                                            color={'#0051CC'}
                                            size={15}
                                            onPress={() => showTips(data?.asset_strategy?.tip_info?.popup)}
                                        />
                                        <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                            {data?.asset_strategy?.tip_info?.title}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={[styles.card_sty, {paddingVertical: 0, paddingHorizontal: text(16)}]}>
                                {data.gather_info.map((_q, _w) => {
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                Style.flexRow,
                                                {borderTopWidth: _w == 0 ? 0 : 0.5, borderColor: '#ddd'},
                                            ]}
                                            onPress={() => jump(_q.url)}>
                                            <Text style={{flex: 1, paddingVertical: text(20)}}>{_q.title}</Text>
                                            <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        <BottomDesc />
                    </ScrollView>
                    {showMask && <Mask />}

                    {popup?.content && (
                        <BottomModal ref={bottomModal} confirmText={'确认'} title={popup?.title}>
                            <View style={{padding: text(16)}}>
                                <Html html={popup?.content} />
                            </View>
                        </BottomModal>
                    )}
                    <FixedBtn btns={data?.btns} style={{position: 'absolute', bottom: 0}} />
                </View>
            ) : null}
        </>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        color: '#1F2432',
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
        height: text(36),
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
        borderRadius: text(15),
    },
    age_text_sty: {
        color: '#6B9AE3',
        paddingHorizontal: text(3),
        fontSize: text(11),
        paddingVertical: text(2),
    },
});
