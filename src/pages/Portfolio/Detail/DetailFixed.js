/*
 * @Author: xjh
 * @Date: 2021-01-27 16:21:38
 * @Description:低估值智能定投
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-25 14:44:33
 */

import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../../components/BottomDesc';
import {Chart} from '../../../components/Chart';
import {baseChart, histogram, pie} from './ChartOption';
import ChartData from './data.json';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FixedBtn from '../components/FixedBtn';
import Header from '../../../components/NavBar';
export default function DetailAccount() {
    const [data, setData] = useState({});
    const [chartData, setChartData] = useState();
    const imgList = [
        'https://static.licaimofang.com/wp-content/uploads/2021/01/step.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/01/profile.png',
        'https://static.licaimofang.com/wp-content/uploads/2021/01/implementation.png',
    ];
    useEffect(() => {
        Http.get('/portfolio/fix_invest_detail/20210101').then((res) => {
            setData(res.result);
        });
        setChartData(ChartData);
    }, []);
    const jumpTo = () => {};
    return (
        <>
            {Object.keys(data).length > 0 ? <Header title={data.title} leftIcon="chevron-left" /> : null}
            {Object.keys(data).length > 0 && (
                <ScrollView style={{marginBottom: 100, flex: 1}}>
                    <View style={[styles.container_sty]}>
                        <Text style={{color: '#4E556C', fontSize: text(13), textAlign: 'center'}}>
                            {data.ratio_info.title}
                        </Text>
                        <Text style={{paddingTop: text(16), paddingBottom: text(8)}}>
                            <Text style={styles.amount_sty}>{data.ratio_info.ratio_val}</Text>
                            <Text style={styles.radio_sty}> {data.ratio_info.ratio_desc}</Text>
                        </Text>
                        <View style={Style.flexRowCenter}>
                            {data.ratio_info.label.map((_label, _index) => {
                                return (
                                    <View style={styles.label_sty} key={_index + 'label'}>
                                        <Text style={{color: '#266EFF', fontSize: text(11)}}>{_label}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={{height: 330, backgroundColor: '#fff'}}>
                        <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                            <View style={{marginLeft: text(16), width: text(70), alignSelf: 'baseline'}}>
                                <Text
                                    style={[
                                        styles.legend_title_sty,
                                        {fontSize: text(13), fontFamily: Font.numFontFamily},
                                    ]}>
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
                                return (
                                    <FitImage source={{uri: _i}} resizeMode="contain" style={{marginTop: text(16)}} />
                                );
                            })}
                        </View>
                        <View style={styles.assets_wrap_sty}>
                            <View style={[Style.flexRow, {padding: text(15)}]}>
                                <Text style={styles.title_sty}>
                                    {data.asset_deploy.header.title}
                                    <Text style={{color: '#4E556C', fontSize: text(13)}}>
                                        {data.asset_deploy.header.tip}
                                    </Text>
                                </Text>
                            </View>
                            <View style={{paddingHorizontal: text(6)}}>
                                <View style={[Style.flexBetween, styles.head_sty]}>
                                    <Text style={styles.head_title_sty}>{data.asset_deploy.th.name}</Text>
                                    <Text style={styles.head_title_sty}>{data.asset_deploy.th.ratio}</Text>
                                </View>
                                {data.asset_deploy.items.map((_a, _index) => {
                                    const borderBottom = _index < data.asset_deploy.items.length - 1 ? 0.5 : 0;
                                    return (
                                        <View
                                            style={[
                                                Style.flexBetween,
                                                styles.content_warp_sty,
                                                {borderBottomWidth: borderBottom},
                                            ]}
                                            key={_index + '_a'}>
                                            <View>
                                                <Text style={styles.content_title_sty}>{_a.name}</Text>
                                                <Text style={{color: '#9397A3', fontSize: text(11)}}>({_a.code})</Text>
                                            </View>
                                            <Text style={[styles.content_title_sty, {fontFamily: Font.numFontFamily}]}>
                                                {_a.percent}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={[styles.card_sty, {paddingVertical: 0}]}>
                            {data.gather_info.map((_g, _index) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            Style.flexRow,
                                            {
                                                borderBottomWidth: _index < data.gather_info.length - 1 ? 0.5 : 0,
                                                borderColor: Colors.borderColor,
                                            },
                                        ]}
                                        key={_index + '_g'}
                                        onPress={jumpTo}>
                                        <Text style={{flex: 1, paddingVertical: text(20), color: '#545968'}}>
                                            {_g.title}
                                        </Text>
                                        <AntDesign name={'right'} color={'#555B6C'} size={12} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>
            )}
            {Object.keys(data).length > 0 && (
                <FixedBtn btns={data.btns} style={{position: 'absolute', bottom: 0}} activeOpacity={1} />
            )}
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
