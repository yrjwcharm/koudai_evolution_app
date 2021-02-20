/*
 * @Author: xjh
 * @Date: 2021-02-19 10:33:09
 * @Description:组合持仓页
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-19 17:31:15
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Dimensions} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {baseChart, histogram, pie} from '../../pages/Portfolio/Detail/ChartOption';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChartData from '../../pages/Portfolio/Detail/data.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomDesc from '../../components/BottomDesc';
import {Chart} from '../../components/Chart';
import FixedBtn from '../../pages/Portfolio/components/FixedBtn';
import Header from '../../components/NavBar';
import Notice from '../../components/Notice';
import storage from '../../utils/storage';
const deviceWidth = Dimensions.get('window').width;

export default function ChildrenHome() {
    const [data, setData] = useState();
    const [showEye, setShowEye] = useState('true');
    const [left, setLeft] = useState('100%');
    const [widthD, setWidthD] = useState('100%');
    const [period, setPeriod] = useState('y1');
    const [chartData, setChartData] = useState();
    const [moveRight, setMoveRight] = useState(false);
    useEffect(() => {
        // if(deviceWidth-30){
        // }
        setChartData(ChartData);
    }, []);
    const year = [
        {title: '近1月', period: 'y1'},
        {title: '近3月', period: 'y3'},
        {title: '近6月', period: 'y6'},
        {title: '近1年', period: 'y10'},
    ];
    const onLayout = useCallback((e) => {
        const layWidth = e.nativeEvent.layout.width;
        const widthAll = deviceWidth - 60;
        const l = left.split('%')[0] - 5 + '%';
        console.log(l, 'left');
        setLeft(l);
    }, []);
    const changeTab = (num, period) => {
        setPeriod(period);
        setChartData(num);
    };
    useEffect(() => {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/position/detail/20210101', {
            uid: 1111,
            poid: '324324',
        }).then((res) => {
            console.log(res);
        });
    }, []);
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            setShowEye(show === 'true' ? 'false' : 'true');
            storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
        });
    }, []);
    return (
        <View>
            <Header
                title={'持仓页'}
                leftIcon="chevron-left"
                style={{backgroundColor: '#0052CD'}}
                fontStyle={{color: '#fff'}}
            />
            <Notice content={'您已设置定投计划，2021-01-22将您已设置定投计划'} />
            <ScrollView style={{marginBottom: FixedBtn.btnHeight}}>
                <View style={styles.assets_card_sty}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <View style={[Style.flexRow, {marginBottom: text(15)}]}>
                                <Text style={styles.profit_text_sty}>总金额(元)</Text>
                                <TouchableOpacity onPress={toggleEye}>
                                    <Ionicons
                                        name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                        size={16}
                                        color={'rgba(255, 255, 255, 0.8)'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.profit_num_sty, {fontSize: text(24)}]}>4,364,000.70</Text>
                        </View>
                        <View>
                            <View style={[Style.flexRow, {marginBottom: text(15), alignSelf: 'flex-end'}]}>
                                <Text style={styles.profit_text_sty}>日收益</Text>
                                <Text style={styles.profit_num_sty}>-220.00</Text>
                            </View>
                            <View style={Style.flexRow}>
                                <Text style={styles.profit_text_sty}>累计收益</Text>
                                <Text style={styles.profit_num_sty}>-220.00</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.process_wrap_sty}>
                        <View style={[styles.bubbles_sty, {left: left}]} onLayout={(e) => onLayout(e)}>
                            <Text style={styles.bubble_text_sty}>100%</Text>
                            <AntDesign name={'caretdown'} size={14} color={'#FFDC5D'} style={[styles.ab_sty]} />
                        </View>
                    </View>
                    <View style={styles.process_outer}>
                        <View style={[styles.process_inner, {width: widthD}]}></View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: text(5)}}>
                        <Text style={{fontSize: text(12), color: '#fff'}}>0%</Text>
                        <Text style={{fontSize: text(12), color: '#fff'}}>目标20%</Text>
                    </View>
                </View>
                <View style={styles.list_card_sty}>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/member.png'}}
                            resizeMode="contain"
                            style={{width: text(24), height: text(24), marginBottom: text(5)}}
                        />
                        <Text style={styles.list_text_sty}>持有基金</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/member.png'}}
                            resizeMode="contain"
                            style={{width: text(24), height: text(24), marginBottom: text(5)}}
                        />
                        <Text style={styles.list_text_sty}>持有基金</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/member.png'}}
                            resizeMode="contain"
                            style={{width: text(24), height: text(24), marginBottom: text(5)}}
                        />
                        <Text style={styles.list_text_sty}>持有基金</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/member.png'}}
                            resizeMode="contain"
                            style={{width: text(24), height: text(24), marginBottom: text(5)}}
                        />
                        <Text style={styles.list_text_sty}>持有基金</Text>
                    </View>
                </View>
                <View style={styles.padding_sty}>
                    <View style={styles.plan_card_sty}>
                        <Text style={styles.plan_title_sty}>最新计划(2020-07-22)</Text>
                        <Text style={styles.plan_desc_sty}>
                            您当前的配置和主线有些偏离，建议您尽可跟您当前的配置和主线有些偏离，建议您尽可跟
                        </Text>
                        <View style={styles.blue_wrap_style}>
                            <Text style={styles.blue_text_style}>85.4%的用户已经跟随调仓，一键操作</Text>
                        </View>
                        <View style={[Style.flexRow, {justifyContent: 'space-between'}]}>
                            <TouchableOpacity
                                style={{
                                    borderColor: '#4E556C',
                                    borderWidth: 0.5,
                                    borderRadius: text(6),
                                    flex: 1,
                                    marginRight: text(10),
                                }}>
                                <Text style={{paddingVertical: text(10), textAlign: 'center'}}>赎回</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#C7D8F0',
                                    borderRadius: text(6),
                                    flex: 1,
                                    marginRight: text(10),
                                }}>
                                <Text
                                    style={{
                                        paddingVertical: text(10),
                                        color: '#fff',
                                        textAlign: 'center',
                                    }}>
                                    调仓
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor: '#0051CC', borderRadius: text(6), flex: 1}}>
                                <Text style={{paddingVertical: text(10), textAlign: 'center', color: '#fff'}}>
                                    追加购买
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 净值趋势图 */}
                    <Text style={styles.title_sty}>净值趋势图</Text>
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
                        <Chart initScript={baseChart(chartData)} />
                        <View
                            style={{
                                flexDirection: 'row',
                                height: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 20,
                            }}>
                            {year.map((_item, _index) => {
                                let num = _index * 10 + 10;
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.btn_sty,
                                            {
                                                backgroundColor: period == _item.period ? '#F1F6FF' : '#fff',
                                                marginRight: _index != year.length - 1 && text(10),
                                            },
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
                    </View>
                    <View style={Style.flexBetween}>
                        <Text style={styles.title_sty}>最新投资计划(2020-09-08)</Text>
                        <Text style={{color: '#0051CC', fontSize: text(12)}}>查看往期</Text>
                    </View>
                    <View style={styles.fund_card_sty}>
                        <View style={[Style.flexBetween, {paddingBottom: text(10)}]}>
                            <Text style={styles.fund_title_sty}>基金名称</Text>
                            <Text style={styles.fund_title_sty}>基金配比</Text>
                        </View>
                        <View style={[Style.flexBetween, styles.fund_item_sty]}>
                            <View>
                                <Text style={{color: '#333333'}}>工银瑞信新材料新能源行业</Text>
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
                            <Text style={{color: '#333333', fontSize: text(13), fontFamily: Font.numFontFamily}}>
                                80.90%
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.list_card_sty, {margin: 0, marginTop: text(16)}]}>
                        <View style={{alignItems: 'center'}}>
                            <Image
                                source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/touzi.png'}}
                                resizeMode="contain"
                                style={{width: text(24), height: text(24), marginBottom: text(5)}}
                            />
                            <Text style={styles.list_text_sty}>持有基金</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Image
                                source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/member.png'}}
                                resizeMode="contain"
                                style={{width: text(24), height: text(24), marginBottom: text(5)}}
                            />
                            <Text style={styles.list_text_sty}>持有基金</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Image
                                source={{uri: 'https://static.licaimofang.com/wp-content/uploads/2021/02/member.png'}}
                                resizeMode="contain"
                                style={{width: text(24), height: text(24), marginBottom: text(5)}}
                            />
                            <Text style={styles.list_text_sty}>持有基金</Text>
                        </View>
                    </View>
                </View>
                {/* <BottomDesc /> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    assets_card_sty: {
        backgroundColor: '#0052CD',
        paddingHorizontal: text(16),
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
        width: deviceWidth - 30,
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
        left: '40%',
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
    },
    blue_wrap_style: {
        backgroundColor: '#DFEAFC',
        borderRadius: text(4),
        marginVertical: text(14),
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
