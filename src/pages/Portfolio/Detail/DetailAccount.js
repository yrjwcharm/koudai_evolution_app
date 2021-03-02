/*
 * @Author: xjh
 * @Date: 2021-01-26 14:21:25
 * @Description:长短期详情页
 * @LastEditors: xjh
 * @LastEditdate: 2021-03-01 17:21:42
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text, isIphoneX} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/NavBar';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import {baseChart, histogram, pie} from './ChartOption';
import {baseAreaChart} from '../components/ChartOption';
import ChartData from './data.json';
import ListHeader from '../components/ListHeader';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FixedBtn from '../components/FixedBtn';
export default function DetailAccount(props) {
    const [chartData, setChartData] = useState();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState();
    const rightPress = () => {
        props.navigation.navigate('ProductIntro');
    };
    const year = [
        {title: '近1年', period: 'y1'},
        {title: '近3年', period: 'y3'},
        {title: '近5年', period: 'y5'},
        {title: '近10年', period: 'y10'},
        {title: '未来10年', period: 'y100'},
    ];

    const changeTab = (num, period) => {
        setPeriod(period);
    };
    const jumpPage = (url) => {
        if (!url) {
            return;
        }
        props.navigation.navigate(url);
    };
    useEffect(() => {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/portfolio/detail/20210101', {
            upid: 1,
        }).then((res) => {
            setData(res.result);
            setPeriod(res.result.period);
        });
        setChartData([
            {
                date: '2021-01-29',
                type: '本基金',
                value: 0.0054,
            },
            {
                date: '2021-01-29',
                type: '同类平均',
                value: 0.0037,
            },
            {
                date: '2021-02-01',
                type: '本基金',
                value: 0.0154,
            },
            {
                date: '2021-02-01',
                type: '同类平均',
                value: 0.0132,
            },
            {
                date: '2021-02-02',
                type: '本基金',
                value: 0.007,
            },
            {
                date: '2021-02-02',
                type: '同类平均',
                value: 0.0037,
            },
            {
                date: '2021-02-03',
                type: '本基金',
                value: -0.0004,
            },
            {
                date: '2021-02-03',
                type: '同类平均',
                value: -0.0022,
            },
            {
                date: '2021-02-04',
                type: '本基金',
                value: -0.0079,
            },
            {
                date: '2021-02-04',
                type: '同类平均',
                value: -0.0132,
            },
            {
                date: '2021-02-05',
                type: '本基金',
                value: -0.0165,
            },
            {
                date: '2021-02-05',
                type: '同类平均',
                value: -0.0169,
            },
            {
                date: '2021-02-08',
                type: '本基金',
                value: -0.0107,
            },
            {
                date: '2021-02-08',
                type: '同类平均',
                value: -0.0096,
            },
            {
                date: '2021-02-09',
                type: '本基金',
                value: 0.0001,
            },
            {
                date: '2021-02-09',
                type: '同类平均',
                value: -0.0013,
            },
            {
                date: '2021-02-10',
                type: '本基金',
                value: 0.0008,
            },
            {
                date: '2021-02-10',
                type: '同类平均',
                value: -0.0006,
            },
            {
                date: '2021-02-18',
                type: '本基金',
                value: -0.0278,
            },
            {
                date: '2021-02-18',
                type: '同类平均',
                value: -0.0312,
            },
            {
                date: '2021-02-19',
                type: '本基金',
                value: -0.0313,
            },
            {
                date: '2021-02-19',
                type: '同类平均',
                value: -0.033,
            },
            {
                date: '2021-02-22',
                type: '本基金',
                value: -0.0216,
            },
            {
                date: '2021-02-22',
                type: '同类平均',
                value: -0.0222,
            },
            {
                date: '2021-02-23',
                type: '本基金',
                value: -0.0125,
            },
            {
                date: '2021-02-23',
                type: '同类平均',
                value: -0.0162,
            },
            {
                date: '2021-02-24',
                type: '本基金',
                value: -0.0144,
            },
            {
                date: '2021-02-24',
                type: '同类平均',
                value: -0.0178,
            },
            {
                date: '2021-02-25',
                type: '本基金',
                value: -0.0251,
            },
            {
                date: '2021-02-25',
                type: '同类平均',
                value: -0.0301,
            },
            {
                date: '2021-02-26',
                type: '本基金',
                value: -0.0378,
            },
            {
                date: '2021-02-26',
                type: '同类平均',
                value: -0.0426,
            },
        ]);
    }, [period]);

    return (
        <>
            {Object.keys(data).length > 0 ? (
                <Header
                    title={data.title}
                    leftIcon="chevron-left"
                    rightText={data.product_intro.title}
                    rightPress={() => rightPress(data.product_intro.url)}
                    rightTextStyle={styles.right_sty}
                />
            ) : null}
            {Object.keys(data).length > 0 ? (
                <ScrollView style={{marginBottom: FixedBtn.btnHeight}}>
                    <View style={[styles.container_sty]}>
                        <Text style={styles.amount_sty}>{data.ratio_info.ratio_val}</Text>
                        <Text style={styles.radio_sty}>{data.ratio_info.ratio_desc}</Text>
                    </View>
                    <View style={{height: 280, backgroundColor: '#fff'}}>
                        <View style={[Style.flexRow]}>
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
                                    <Text style={styles.legend_desc_sty}>短期账户</Text>
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
                                    <Text style={styles.legend_desc_sty}>比较基准</Text>
                                </Text>
                            </View>
                        </View>
                        <Chart
                            initScript={baseAreaChart(
                                chartData,
                                ['l(90) 0:#E74949 1:#fff', Colors.lightBlackColor],
                                true
                            )}
                            data={chartData}
                        />
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
                        <Text style={{paddingHorizontal: text(16), marginTop: text(10), paddingBottom: text(20)}}>
                            <MaterialCommunityIcons name={'circle-medium'} color={'#4BA471'} size={15} />
                            <Text style={{fontSize: text(12)}}>短期账户历史最大回撤 </Text>
                            <Text
                                style={{
                                    color: '#4BA471',
                                    fontSize: text(15),
                                    fontWeight: 'bold',
                                    fontFamily: Font.numFontFamily,
                                }}>
                                -2.03%
                            </Text>
                        </Text>
                    </View>
                    {/* 全球配置 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.asset_deploy.header} color={'#0051CC'} />
                        <View style={{height: 220}}>
                            <Chart initScript={pie(data.asset_deploy.items, data.asset_deploy.chart)} />
                        </View>
                    </View>
                    {/* 智能调仓 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.adjust_info.header} />
                        <View style={[Style.flexRow, {flexWrap: 'wrap'}]}>
                            {data.adjust_info.items.map((_i, _d) => {
                                return (
                                    <View
                                        style={{
                                            width: '50%',
                                            paddingTop: text(16),
                                            paddingRight: _d == 0 || _d == 2 ? text(20) : 0,
                                        }}>
                                        <View style={Style.flexRow}>
                                            <Image
                                                source={{uri: _i.icon}}
                                                style={{height: text(15), width: text(15)}}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.row_title_sty}>{_i.title}</Text>
                                        </View>
                                        <Text style={styles.adjust_desc_syl}>{_i.content}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    {/* 资产增强 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.asset_enhance.header} />
                        <FitImage
                            source={{uri: data.asset_enhance.img}}
                            resizeMode="contain"
                            style={{marginTop: text(16)}}
                        />
                    </View>
                    {/* 风险控制 */}
                    <View style={styles.card_sty}>
                        <ListHeader data={data.risk_info.header} />
                        <View style={{height: 300, position: 'relative'}}>
                            <View style={[Style.flexRow, {marginTop: text(13), marginLeft: text(30)}]}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.row_title_sty}>{data.risk_info.chart.data[0].key}</Text>
                                    <Text style={styles.row_desc_sty}>{data.risk_info.chart.data[0].val}</Text>
                                    {/* <Image
                                        source={require('../../../assets/img/detail/zan.png')}
                                        style={styles.zan_sty}
                                    /> */}
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.row_title_sty}>{data.risk_info.chart.data[1].key}</Text>
                                    <Text style={styles.row_desc_sty}>{data.risk_info.chart.data[1].val}</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.row_title_sty}>{data.risk_info.chart.data[2].key}</Text>
                                    <Text style={styles.row_desc_sty}>{data.risk_info.chart.data[2].val}</Text>
                                </View>
                            </View>
                            {/* <Text style={{borderColor: '#ddd', borderWidth: 0.5}}></Text> */}
                            <Chart
                                initScript={histogram(data.risk_info.chart.data)}
                                style={{marginTop: text(-20), zIndex: 9}}
                            />

                            <View style={{flexDirection: 'row', marginLeft: text(30)}}>
                                <View style={[{flex: 1, fontSize: text(12)}, Style.flexRow]}>
                                    <Ionicons name={'square'} color={'#E74949'} size={10} />
                                    <Text> {data.risk_info.chart.label.y[0].key}</Text>
                                </View>
                                <View style={[{flex: 1, fontSize: text(12)}, Style.flexRow]}>
                                    <Ionicons name={'square'} color={'#545968'} size={10} />
                                    <Text> {data.risk_info.chart.label.y[1].key}</Text>
                                </View>
                                <View style={{width: text(100), fontSize: text(12), flexShrink: 0}}>
                                    <Text style={{fontSize: text(12)}}>---{data.risk_info.chart.label.x[0].key}</Text>
                                    <Text
                                        style={{
                                            fontSize: text(10),
                                        }}>
                                        {data.risk_info.chart.label.x[0].val}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card_sty, {paddingVertical: 0}]}>
                        {data.gather_info.map((_info, _idx) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        Style.flexRow,
                                        {
                                            borderBottomWidth: _idx < data.gather_info.length - 1 ? 0.5 : 0,
                                            borderColor: '#DDDDDD',
                                        },
                                    ]}
                                    key={_idx + 'info'}
                                    onPress={() => jumpPage(_info.url)}>
                                    <Text style={{flex: 1, paddingVertical: text(20)}}>{_info.title}</Text>
                                    <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            ) : null}
            <FixedBtn btns={data.btns} style={{position: 'absolute', bottom: 0}} />
        </>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#1F2432',
    },
    container_sty: {
        paddingHorizontal: text(16),
        paddingVertical: text(20),
        backgroundColor: '#fff',
    },
    amount_sty: {
        color: '#E74949',
        fontSize: text(34),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
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
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: Space.padding,
        marginHorizontal: Space.padding,
        marginTop: text(12),
    },
    adjust_desc_syl: {
        color: '#9397A3',
        fontSize: Font.textH3,
        lineHeight: text(18),
    },
    row_title_sty: {
        color: '#1F2432',
        fontSize: text(13),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row_desc_sty: {
        color: '#868DA3',
        fontSize: text(11),
        textAlign: 'center',
        marginTop: text(3),
        fontFamily: Font.numFontFamily,
    },
    zan_sty: {
        width: text(24),
        height: text(24),
        // position: 'absolute',
        // left: '10%',
        // top: 10,
        // zIndex: 999,
    },
});
