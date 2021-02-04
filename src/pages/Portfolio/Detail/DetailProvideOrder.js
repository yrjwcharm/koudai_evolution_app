// /*
//  * @Author: xjh
//  * @Date: 2021-01-27 18:33:13
//  * @Description:养老详情页
//  * @LastEditors: xjh
//  * @LastEditTime: 2021-01-27 18:37:22
//  */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px, px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../../components/BottomDesc';
import Chart from 'react-native-f2chart';
import {baseChart, histogram, pie} from './ChartOption';
import ChartData from './data.json';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FixedBtn from '../components/FixedBtn';
import Header from '../../../components/NavBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ListHeader from '../components/ListHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Table from '../components/Table';
export default function DetailProvideOrder() {
    const [chartData, setChartData] = useState();
    const [period, setPeriod] = useState('y1');
    const [map, setMap] = useState({});
    const [choose, setChoose] = useState(1);
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
    const pieData = [
        {
            code: 11202,
            name: '股票市场',
            ratio: 0.7252,
            percent: '72.52%',
        },
        {
            code: 12101,
            name: '债券市场',
            ratio: 0.18159999999999998,
            percent: '18.16%',
        },
        {
            code: 14001,
            name: '商品市场',
            ratio: 0.0713,
            percent: '7.13%',
        },
        {
            code: 13101,
            name: '货币市场',
            ratio: 0.0219,
            percent: '2.19%',
        },
    ];
    const btns = [
        {
            title: '咨询',
            icon: 'https://static.licaimofang.com/wp-content/uploads/2020/12/zixun.png',
            url: '',
            subs: [
                {
                    icon: 'https://static.licaimofang.com/wp-content/uploads/2020/04/xing_zhuang_@2x1.png',
                    title: '电话咨询专家',
                    desc: '与专家电话，问题解答更明白',
                    recommend: 0,
                    btn: {
                        title: '拨打电话',
                    },
                    type: 'tel',
                    sno: '4000808208',
                },
                {
                    icon: 'https://static.licaimofang.com/wp-content/uploads/2020/04/xing_zhuang_@2x2.png',
                    title: '在线咨询',
                    desc: '专家在线解决问题，10秒内回复',
                    recommend: 0,
                    btn: {
                        title: '立即咨询',
                    },
                    type: 'im',
                },
            ],
        },
        {
            title: '立即购买',
            icon: '',
            url: '/trade/ym_trade_state?state=buy&id=7&risk=4&amount=2000',
            desc: '已有1377380人加入',
        },
    ];
    const list = [
        {title: '重点大学', id: 0},
        {title: '艺术大学', id: 1},
        {title: '海外留学', id: 2},
    ];
    const table = {
        head: ['子女教育计划', '子女教育计划', '子女教育计划'],
        body: [
            ['某教育基金', '某教育基金', '某教育基金'],
            ['某教育基金', '某教育基金', '<span style="textAlign:center;">每月缴纳</br>18-22岁领取</span>'],
            ['某教育基金', '某教育基金', '某教育基金'],
            ['某教育基金', '某教育基金', '某教育基金'],
        ],
    };
    const rightPress = () => {};
    const changeTab = (num, period) => {
        setPeriod(period);
        setChartData(num);
    };
    const chooseBtn = () => {};
    useEffect(() => {
        setChartData(ChartData);
        let obj = {};
        pieData.map((item) => {
            obj[item.name] = item.ratio;
        });
        setMap(obj);
    }, [map]);
    return (
        <SafeAreaView edges={['bottom']} style={{flex: 1}}>
            <ScrollView>
                <Header
                    title={'子女教育计划'}
                    leftIcon="chevron-left"
                    rightText={'重新规划'}
                    rightPress={rightPress}
                    rightTextStyle={styles.right_sty}
                />
                <View style={styles.container_sty}>
                    <View>
                        <View style={Style.flexRow}>
                            <Text style={{color: '#9AA1B2'}}>目标金额(元) </Text>
                            <View style={{borderRadius: text(4), backgroundColor: '#F1F6FF'}}>
                                <Text style={styles.age_text_sty}>60岁退休</Text>
                            </View>
                        </View>
                        <Text style={styles.fund_input_sty}>98655.99</Text>
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
                                <Text style={styles.tip_sty}>总投入金额100,000.00元，目标收总投入金额100,000.00元</Text>
                            </LinearGradient>
                            <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                <Text style={{color: '#545968', flex: 1}}>首次投入金额(元)</Text>
                                <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                    <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                    <Text style={styles.count_num_sty}>1,000,000</Text>
                                    <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                </View>
                            </View>
                            <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                <Text style={{color: '#545968', flex: 1}}>首次投入金额(元)</Text>
                                <View style={[Style.flexRow, {flex: 1, justifyContent: 'flex-end'}]}>
                                    <Ionicons name={'add-circle'} size={25} color={'#0051CC'} />
                                    <Text style={styles.count_num_sty}>1,000,000</Text>
                                    <Ionicons name={'remove-circle'} size={25} color={'#0051CC'} />
                                </View>
                            </View>
                            <View style={[Style.flexBetween, styles.count_wrap_sty]}>
                                <Text style={{color: '#545968'}}>投入年限</Text>
                                <TouchableOpacity style={Style.flexRow}>
                                    <Text style={{color: '#545968'}}>14年</Text>
                                    <AntDesign name={'down'} color={'#8D96AF'} size={12} />
                                </TouchableOpacity>
                            </View>
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
                        <Table data={table} />
                        <TouchableOpacity style={{marginLeft: text(16), flexDirection: 'row', alignItems: 'baseline'}}>
                            <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                            <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                浮动收益是什么？
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* 饼图 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={head} style={{paddingHorizontal: text(16)}} color={'#0051CC'} />
                        <View style={{height: 200}}>
                            <Chart initScript={pie(pieData, map)} />
                        </View>
                    </View>
                    <View style={[styles.card_sty, {paddingHorizontal: text(16)}]}>
                        <ListHeader data={head} style={{paddingHorizontal: text(16)}} />
                        <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: text(20)}}>
                            <Image
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/icon_qthtz@2x.png',
                                }}
                                resizeMode="contain"
                                style={{width: text(69), height: text(69), marginRight: text(10)}}
                            />
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                <Text style={{color: '#111111'}}>周期目标策略</Text>
                                <Text
                                    style={{
                                        color: '#9AA1B2',
                                        fontSize: text(12),
                                        marginTop: text(8),
                                        lineHeight: text(16),
                                    }}>
                                    在前期我们将为您配置更多的风险性产品，博在前期我们将为您配置更多的博在前期我们将为您配置更多的风险性产品
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                marginTop: text(20),
                                borderBottomWidth: 0.5,
                                borderColor: Colors.borderColor,
                                paddingBottom: text(16),
                            }}>
                            <Image
                                source={{
                                    uri: 'https://static.licaimofang.com/wp-content/uploads/2021/01/icon_qthtz@2x.png',
                                }}
                                resizeMode="contain"
                                style={{width: text(69), height: text(69), marginRight: text(10)}}
                            />
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                <Text style={{color: '#111111'}}>周期目标策略</Text>
                                <Text
                                    style={{
                                        color: '#9AA1B2',
                                        fontSize: text(12),
                                        marginTop: text(8),
                                        lineHeight: text(16),
                                    }}>
                                    在前期我们将为您配置更多的风险性产品，博在前期我们将为您配置更多的博在前期我们将为您配置更多的风险性产品
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'baseline',
                                marginTop: text(16),
                            }}>
                            <AntDesign name={'exclamationcircleo'} color={'#0051CC'} size={15} />
                            <Text style={{fontSize: text(12), color: '#0051CC', marginLeft: text(5)}}>
                                我想了解更详细的投资策略
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.card_sty, {paddingVertical: 0, paddingHorizontal: text(16)}]}>
                        <View style={Style.flexRow}>
                            <Text style={{flex: 1, paddingVertical: text(20)}}>资金安全</Text>
                            <AntDesign name={'right'} color={'#555B6C'} size={12} />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <FixedBtn btns={btns} style={{position: 'absolute', bottom: 0}} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
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
