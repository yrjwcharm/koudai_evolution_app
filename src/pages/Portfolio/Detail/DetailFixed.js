/*
 * @Author: xjh
 * @Date: 2021-01-27 16:21:38
 * @Description:低估值智能定投
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-27 18:36:15
 */

import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../../components/BottomDesc';
import Chart from 'react-native-f2chart';
import {baseChart, histogram, pie} from './ChartOption';
import ChartData from './data.json';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FixedBtn from '../components/FixedBtn';
export default function DetailAccount() {
    const [chartData, setChartData] = useState();
    const imgList = [
        'https://static.licaimofang.com/wp-content/uploads/2021/01/step.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/01/profile.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/01/implementation.png',
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

    useEffect(() => {
        setChartData(ChartData);
    }, []);
    return (
        <>
            <ScrollView style={{marginBottom: 100, flex: 1}}>
                <View style={[styles.container_sty]}>
                    <Text style={{color: '#4E556C', fontSize: text(13), textAlign: 'center'}}>
                        适合大部分投资者的高收益理财产品
                    </Text>
                    <Text style={{paddingTop: text(16), paddingBottom: text(8)}}>
                        <Text style={styles.amount_sty}>7.58%</Text>
                        <Text style={styles.radio_sty}> 近两年年化收益率</Text>
                    </Text>
                    <View style={Style.flexRowCenter}>
                        <View style={styles.label_sty}>
                            <Text style={{color: '#266EFF', fontSize: text(11)}}>优秀固守</Text>
                        </View>
                        <View style={styles.label_sty}>
                            <Text style={{color: '#266EFF', fontSize: text(11)}}>优秀固守</Text>
                        </View>
                    </View>
                </View>
                <View style={{height: 330, backgroundColor: '#fff'}}>
                    <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                        <View style={{marginLeft: text(16), width: text(70), alignSelf: 'baseline'}}>
                            <Text
                                style={[styles.legend_title_sty, {fontSize: text(13), fontFamily: Font.numFontFamily}]}>
                                2020-11-12
                            </Text>
                        </View>
                        <View style={styles.legend_sty}>
                            <Text>
                                <Ionicons name={'square'} color={'#E74949'} size={10} />
                                <Text style={styles.legend_desc_sty}>
                                    低估值智能定投
                                    <Text
                                        style={[
                                            styles.legend_title_sty,
                                            {color: '#E74949', fontFamily: Font.numFontFamily},
                                        ]}>
                                        +15.15%
                                    </Text>
                                </Text>
                            </Text>
                        </View>
                        <View style={styles.legend_sty}>
                            <Text>
                                <Ionicons name={'square'} color={'#C8A77A'} size={10} />
                                <Text style={styles.legend_desc_sty}>
                                    比较基准{' '}
                                    <Text style={[styles.legend_title_sty, {fontFamily: Font.numFontFamily}]}>
                                        8.12%
                                    </Text>
                                </Text>
                            </Text>
                        </View>
                    </View>
                    <Chart initScript={baseChart(chartData)} />
                </View>
                <View style={{paddingHorizontal: Space.padding}}>
                    <View>
                        {imgList.map((_i, _d) => {
                            return <FitImage source={{uri: _i}} resizeMode="contain" style={{marginTop: text(16)}} />;
                        })}
                    </View>
                    <View style={styles.assets_wrap_sty}>
                        <View style={[Style.flexRow, {padding: text(15)}]}>
                            <Text style={styles.title_sty}>
                                资产配置{' '}
                                <Text style={{color: '#4E556C', fontSize: text(13)}}>优选A股基金，跟踪大盘</Text>
                            </Text>
                        </View>
                        <View style={{paddingHorizontal: text(6)}}>
                            <View style={[Style.flexBetween, styles.head_sty]}>
                                <Text style={styles.head_title_sty}>基金名称</Text>
                                <Text style={styles.head_title_sty}>配比</Text>
                            </View>
                            <View style={[Style.flexBetween, styles.content_warp_sty]}>
                                <View>
                                    <Text style={styles.content_title_sty}>鹏华空天军工指数(LOF)A</Text>
                                    <Text style={{color: '#9397A3', fontSize: text(11)}}>(160643)</Text>
                                </View>
                                <Text style={[styles.content_title_sty, {fontFamily: Font.numFontFamily}]}>6.64%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card_sty, {paddingVertical: 0}]}>
                        <View style={Style.flexRow}>
                            <Text style={{flex: 1, paddingVertical: text(20), color: '#545968'}}>资金安全</Text>
                            <AntDesign name={'right'} color={'#555B6C'} size={12} />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <FixedBtn btns={btns} style={{position: 'absolute', bottom: 0}} />
        </>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#1F2432',
    },
    container_sty: {
        // paddingVertical: text(20),
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
        fontSize: text(12),
        marginBottom: text(4),
    },
    legend_desc_sty: {
        fontSize: text(11),
        color: '#545968',
    },
    radio_sty: {
        color: '#858DA5',
        fontSize: text(12),
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
    label_sty: {
        backgroundColor: '#F0F6FD',
        paddingHorizontal: text(6),
        paddingVertical: text(4),
        marginRight: text(10),
        borderRadius: text(3),
    },
    assets_wrap_sty: {
        borderRadius: text(10),
        backgroundColor: '#fff',
        marginTop: text(16),
    },
    title_sty: {
        color: '#1F2432',
        fontSize: text(16),
        fontWeight: 'bold',
    },
    head_sty: {
        backgroundColor: '#F5F6F8',
        padding: text(8),
    },
    head_title_sty: {
        color: '#9095A5',
        fontSize: text(12),
    },
    content_warp_sty: {
        paddingTop: text(13),
        paddingHorizontal: text(9),
        paddingBottom: text(9),
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
    },
    content_title_sty: {
        color: '#4E556C',
        fontSize: text(13),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        padding: Space.padding,
        marginTop: text(12),
    },
});
