/*
 * @Author: xjh
 * @Date: 2021-02-20 17:23:31
 * @Description:马红漫组合
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-04 17:50:42
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Header from '../../../components/NavBar';
import {px as text, isIphoneX} from '../../../utils/appUtil';
import FitImage from 'react-native-fit-image';
import {Font, Style, Colors} from '../../../common/commonStyle';
import {Chart} from '../../../components/Chart';
import {baseChart, histogram, pie} from './ChartOption';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ChartData from './data.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FixedBtn from '../components/FixedBtn';
import ListHeader from '../components/ListHeader';
export default function DetailPolaris() {
    const [chartData, setChartData] = useState();
    const [data, setData] = useState({});
    const [period, setPeriod] = useState('y1');
    useEffect(() => {
        Http.get('http://kapi-web.ll.mofanglicai.com.cn:10080/polaris/strategy/20210101', {
            upid: 1,
        }).then((res) => {
            setData(res.result);
        });
        setChartData(ChartData);
    }, []);

    const year = [
        {title: '近1年', period: 'y1'},
        {title: '近3年', period: 'y3'},
        {title: '近5年', period: 'y5'},
        {title: '近10年', period: 'y10'},
        {title: '未来10年', period: 'y100'},
    ];
    const changeTab = (num, period) => {
        setPeriod(period);
        setChartData(num);
    };
    return (
        <>
            <Header title={'科技大势组合'} leftIcon="chevron-left" />

            {Object.keys(data).length > 0 && (
                <ScrollView style={{marginBottom: FixedBtn.btnHeight}}>
                    <FitImage
                        source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2020/12/14.jpg'}}
                        resizeMode="contain"
                    />
                    <View style={{padding: text(16)}}>
                        <View style={styles.card_sty}>
                            <Text style={{fontSize: text(16), textAlign: 'center', fontWeight: 'bold'}}>
                                科技大势组合
                            </Text>
                            <View style={[Style.flexRowCenter, {marginTop: text(10)}]}>
                                <View style={styles.label_wrap_sty}>
                                    <Text style={styles.label_sty}>经济复苏</Text>
                                </View>
                                <View style={styles.label_wrap_sty}>
                                    <Text style={styles.label_sty}>经济复苏</Text>
                                </View>
                            </View>
                            <Text style={styles.num_sty}>31.93%</Text>
                            <Text style={styles.desc_sty}>成立以来收益</Text>
                            <TouchableOpacity style={styles.btn_sty}>
                                <Text style={styles.btn_text_sty}>1000元起购</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                height: 400,
                                backgroundColor: '#fff',
                                paddingTop: text(20),
                                borderRadius: text(10),
                            }}>
                            <Text style={styles.card_title_sty}>业绩表现</Text>
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
                            {/* <Chart initScript={baseChart(chartData)} /> */}
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
                                                styles.btn_press_sty,
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
                            <Text
                                style={{
                                    paddingHorizontal: text(16),
                                    marginTop: text(10),
                                    paddingBottom: text(20),
                                    fontSize: text(12),
                                    color: '#9AA1B2',
                                }}>
                                策略组合的过往业绩并不预示其未来表现,
                            </Text>
                        </View>
                        <View style={[styles.card_sty, {marginTop: text(16), paddingHorizontal: 0}]}>
                            <View style={{paddingHorizontal: text(16)}}>
                                <Text style={[styles.card_title_sty, {paddingHorizontal: 0, paddingBottom: text(10)}]}>
                                    配置比例
                                </Text>
                                <Text style={{color: '#4E556C', fontSize: text(13)}}>
                                    精选市场发展空间充足的低估值行业股票基金
                                </Text>
                            </View>
                            <View style={{height: 220}}>
                                {/* <Chart initScript={pie(data.asset_deploy.items, data.asset_deploy.chart)} /> */}
                            </View>
                            <View style={styles.fund_card_sty}>
                                <View
                                    style={[
                                        Style.flexBetween,
                                        {
                                            backgroundColor: '#FAFAFA',
                                            padding: text(13),
                                        },
                                    ]}>
                                    <Text style={[styles.fund_title_sty, {flex: 1}]}>基金名称</Text>
                                    <Text style={styles.fund_title_sty}>基金配比</Text>
                                    <Text style={[styles.fund_title_sty, {textAlign: 'right'}]}>
                                        收益率
                                        <AntDesign name={'questioncircleo'} size={12} color={'#BCBCBC'} />
                                    </Text>
                                </View>
                                <View style={{padding: text(13)}}>
                                    <View style={[Style.flexBetween, styles.fund_item_sty]}>
                                        <View>
                                            <Text style={{color: '#333333'}} numberOfLines={1}>
                                                工银瑞信新材料新能源行业
                                            </Text>
                                            <Text
                                                style={{
                                                    color: '#999999',
                                                    fontSize: text(11),
                                                    marginTop: text(5),
                                                    fontFamily: Font.numFontFamily,
                                                }}>
                                                001232
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                color: '#333333',
                                                fontSize: text(13),
                                                fontFamily: Font.numFontFamily,
                                            }}>
                                            80.90%
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#CE4040',
                                                fontSize: text(13),
                                                fontFamily: Font.numFontFamily,
                                                textAlign: 'right',
                                            }}>
                                            80.90%
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card_sty, {paddingHorizontal: 0, paddingBottom: 0, overflow: 'hidden'}]}>
                            <Text style={[styles.card_title_sty, {paddingBottom: text(10)}]}>组合描述</Text>
                            <FitImage
                                source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2020/12/12.png '}}
                                resizeMode="contain"
                            />
                        </View>
                        {/* <View style={[styles.card_sty, {paddingVertical: 0}]}>
                            {data.gather_info.map((_info, _idx) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            Style.flexRow,
                                            {
                                                borderBottomWidth: _idx < data.gather_info.length - 1 ? 0.5 : 0,
                                                borderColor: Colors.borderColor,
                                            },
                                        ]}
                                        key={_idx + 'info'}
                                        onPress={() => jumpPage(_info.url)}>
                                        <Text style={{flex: 1, paddingVertical: text(20)}}>{_info.title}</Text>
                                        <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View> */}
                    </View>
                </ScrollView>
            )}
            <FixedBtn btns={data.btns} style={{position: 'absolute', bottom: 0}} />
        </>
    );
}
const styles = StyleSheet.create({
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        paddingHorizontal: text(14),
        paddingVertical: text(20),
        marginBottom: text(16),
    },
    label_wrap_sty: {
        backgroundColor: '#FEF0F0',
        borderRadius: text(2),
        flexDirection: 'row',
        marginRight: text(10),
    },
    label_sty: {
        color: '#DA4B4D',
        fontSize: text(13),
        padding: text(5),
    },
    num_sty: {
        color: '#E74949',
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
        fontSize: text(32),
        textAlign: 'center',
        marginTop: text(12),
    },
    desc_sty: {
        color: '#9AA1B2',
        textAlign: 'center',
    },
    btn_text_sty: {
        color: '#fff',
        textAlign: 'center',
        paddingVertical: text(12),
    },
    btn_sty: {
        backgroundColor: '#E74949',
        borderRadius: text(10),
        marginTop: text(18),
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
    btn_press_sty: {
        borderWidth: 0.5,
        borderColor: '#E2E4EA',
        paddingHorizontal: text(8),
        paddingVertical: text(5),
        borderRadius: text(12),
    },
    card_title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        paddingHorizontal: text(16),
        paddingBottom: text(16),
        fontWeight: 'bold',
    },
    fund_title_sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
        width: text(60),
    },
    fund_card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
    },
    fund_item_sty: {
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingBottom: text(13),
    },
});
