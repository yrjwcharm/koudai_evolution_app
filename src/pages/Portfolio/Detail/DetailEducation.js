/*
 * @Author: xjh
 * @Date: 2021-01-27 18:32:53
 * @Description:子女教育详情页
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-04 17:20:45
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px, px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import {baseChart, histogram, pie} from './ChartOption';
import ChartData from './data.json';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FixedBtn from '../components/FixedBtn';
import Header from '../../../components/NavBar';
import LinearGradient from 'react-native-linear-gradient';
import ListHeader from '../components/ListHeader';
import Picker from 'react-native-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Table from '../components/Table';
import DynamicAdjustment from '../DynamicAdjustment';
export default function DetailEducation(props) {
    const [data, setData] = useState({});
    const [chartData, setChartData] = useState();
    const [period, setPeriod] = useState('y1');
    const [map, setMap] = useState({});
    const [choose, setChoose] = useState(1);
    const [age, setAge] = useState('');
    const year = [
        {title: '近1年', period: 'y1'},
        {title: '近3年', period: 'y3'},
        {title: '近5年', period: 'y5'},
        {title: '近10年', period: 'y10'},
        {title: '未来10年', period: 'y100'},
    ];
    const head = {
        title: '子女教育计划是怎么帮我投资的？',
        text: '',
    };
    const list = [
        {title: '重点大学', id: 0},
        {title: '艺术大学', id: 1},
        {title: '海外留学', id: 2},
    ];
    const rightPress = () => {};
    const changeTab = (num, period) => {
        setPeriod(period);
        setChartData(num);
    };
    const chooseBtn = () => {};
    const getPieData = useCallback(() => {
        // const mapData = {};
        // data.asset_deploy.items.map((item) => {
        //     mapData[item.name] = item.percent;
        // });
        // setMap(mapData);
    }, []);
    useEffect(() => {
        Http.get('/portfolio/purpose_invest_detail/20210101', {
            upid: props.route?.params?.upid,
        }).then((res) => {
            setData(res.result);
            setAge(res.result.plan_info.personal_info.age);
        });
        setChartData(ChartData);
        // getPieData();
    }, [props.route]);
    const selectAge = () => {
        Picker.init({
            pickerTitleText: '时间选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            selectedValue: [age],
            pickerBg: [255, 255, 255, 1],
            pickerData: [1, 2, 3, 4],
            pickerFontColor: [33, 33, 33, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                setAge(pickedValue[0]);
            },
        });
        Picker.show();
    };
    return (
        <>
            {Object.keys(data).length > 0 && (
                <View style={{flex: 1}}>
                    <Header
                        title={'子女教育计划'}
                        leftIcon="chevron-left"
                        rightText={data.top_button.title}
                        rightPress={rightPress}
                        rightTextStyle={styles.right_sty}
                    />
                    <ScrollView style={{flex: 1}}>
                        <View style={styles.container_sty}>
                            <View style={[Style.flexBetween, styles.select_wrap_sty]}>
                                <Text style={styles.select_text_sty}>
                                    {data.plan_info.personal_info.title}
                                    <Text>({data.plan_info.personal_info.tip})</Text>
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
                                        {borderColor: choose == list[0].id ? '#DC4949' : '#E2E4EA'},
                                    ]}
                                    onPress={chooseBtn(list[0].id)}>
                                    <Image
                                        source={
                                            choose == list[0].id
                                                ? require('../../../assets/img/detail/icon_ed_0_ac.png')
                                                : require('../../../assets/img/detail/icon_ed_0.png')
                                        }
                                        style={{width: text(24), height: text(24)}}
                                    />
                                    <Text style={{color: choose == list[0].id ? '#DC4949' : '#545968'}}>
                                        {list[0].title}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        Style.flexRowCenter,
                                        styles.select_btn_sty,
                                        {borderColor: choose == list[1].id ? '#DC4949' : '#E2E4EA'},
                                    ]}
                                    onPress={chooseBtn(list[1].id)}>
                                    <Image
                                        source={
                                            choose == list[1].id
                                                ? require('../../../assets/img/detail/icon_ed_1_ac.png')
                                                : require('../../../assets/img/detail/icon_ed_1.png')
                                        }
                                        style={{width: text(24), height: text(24)}}
                                    />
                                    <Text style={{color: choose == list[1].id ? '#DC4949' : '#545968'}}>
                                        {list[1].title}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        Style.flexRowCenter,
                                        styles.select_btn_sty,
                                        {marginRight: 0, borderColor: choose == list[2].id ? '#DC4949' : '#E2E4EA'},
                                    ]}
                                    onPress={chooseBtn(list[2].id)}>
                                    <Image
                                        source={
                                            choose == list[2].id
                                                ? require('../../../assets/img/detail/icon_ed_2_ac.png')
                                                : require('../../../assets/img/detail/icon_ed_2.png')
                                        }
                                        style={{width: text(24), height: text(24)}}
                                    />
                                    <Text style={{color: choose == list[2].id ? '#DC4949' : '#545968'}}>
                                        {list[2].title}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.fund_wrap_sty}>
                                <Text style={{color: '#9AA1B2'}}>{data.plan_info.goal_info.title}</Text>
                                <Text style={styles.fund_input_sty}>{data.plan_info.goal_info.amount}</Text>
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
                                        <Text style={styles.tip_sty}>
                                            总投入金额100,000.00元，目标收总投入金额100,000.00元
                                        </Text>
                                    </LinearGradient>
                                    {data.plan_info.goal_info.items.map((_i, _v) => {
                                        return (
                                            <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                                <Text style={{color: '#545968', flex: 1}}>{_i.key}</Text>
                                                <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                                    <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                                    <Text style={styles.count_num_sty}>{_i.interval}</Text>
                                                    <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                        <View style={styles.content_sty}>
                            <View style={styles.card_sty}>
                                <Text style={styles.title_sty}>子女教育计划VS某教育金</Text>
                                <View style={[Style.flexRow, {marginTop: text(16)}]}>
                                    <View style={styles.legend_sty}>
                                        <Text style={styles.legend_title_sty}>2020-11</Text>
                                        <Text style={styles.legend_desc_sty}>时间</Text>
                                    </View>
                                    <View style={styles.legend_sty}>
                                        <Text style={[styles.legend_title_sty, {color: '#E74949'}]}>15.15%</Text>
                                        <Text>
                                            <MaterialCommunityIcons
                                                name={'record-circle-outline'}
                                                color={'#E74949'}
                                                size={12}
                                            />
                                            <Text style={styles.legend_desc_sty}> 短期账户</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.legend_sty}>
                                        <Text style={styles.legend_title_sty}>8.12%</Text>
                                        <Text>
                                            <MaterialCommunityIcons
                                                name={'record-circle-outline'}
                                                color={'#545968'}
                                                size={12}
                                            />
                                            <Text style={styles.legend_desc_sty}> 比较基准</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View style={{height: 300}}>
                                    <Chart initScript={baseChart(chartData)} style={{width: '100%'}} />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        height: 50,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginHorizontal: 20,
                                    }}>
                                    {year.map((_item, _index) => {
                                        let num = _index * 10 + 10;
                                        return (
                                            <TouchableOpacity
                                                style={[
                                                    styles.btn_sty,
                                                    {backgroundColor: period == _item.period ? '#F1F6FF' : '#fff'},
                                                ]}
                                                onPress={() => changeTab(num, _item.period)}>
                                                <Text
                                                    style={{
                                                        color: period == _item.period ? '#0051CC' : '#555B6C',
                                                        fontSize: text(12),
                                                    }}>
                                                    {_item.title}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                {/* 表格 */}
                                <Table data={data.asset_compare.table} />
                                <TouchableOpacity
                                    style={{marginLeft: text(16), flexDirection: 'row', alignItems: 'baseline'}}>
                                    <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                                    <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                        {data.asset_compare.tip_info.title}
                                    </Text>
                                </TouchableOpacity>
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
                                <ListHeader data={data.asset_strategy.header} style={{paddingHorizontal: text(16)}} />
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
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'baseline',
                                        marginTop: text(16),
                                    }}>
                                    <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                                    <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                        {data.asset_strategy.tip_info.title}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.card_sty, {paddingVertical: 0, paddingHorizontal: text(16)}]}>
                                {data.gather_info.map((_q, _w) => {
                                    return (
                                        <View
                                            style={[
                                                Style.flexRow,
                                                {borderTopWidth: _w == 0 ? 0 : 0.5, borderColor: '#ddd'},
                                            ]}>
                                            <Text style={{flex: 1, paddingVertical: text(20)}}>{_q.title}</Text>
                                            <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>
                    <FixedBtn btns={data.btns} />
                </View>
            )}
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
    fund_wrap_sty: {
        marginTop: text(24),
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
        paddingBottom: FixedBtn.btnHeight,
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
});
