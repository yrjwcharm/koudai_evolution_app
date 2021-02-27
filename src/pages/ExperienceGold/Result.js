/*
 * @Author: xjh
 * @Date: 2021-02-25 15:17:26
 * @Description:体验金结果页
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-25 16:18:51
 */
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';

import {Colors, Space, Font, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from '../../components/Button';
import Http from '../../services';
export default function Result() {
    const [data, setData] = useState({});
    useEffect(() => {
        setData({
            is_success: true,
            title: '提现申请已提交',
            content:
                '失败原因：需要成功购买金额≥10000元失败原因：需要成功购买金额≥10000元失败原因：需要成功购买金额≥10000元',
        });
    }, []);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.top_sty}>
                {data.is_success == true ? (
                    <Ionicons name={'checkmark-circle'} color={'#4BA471'} size={50} style={{paddingBottom: text(17)}} />
                ) : (
                    <Ionicons
                        name={'md-close-circle-sharp'}
                        color={'#DC4949'}
                        size={50}
                        style={{paddingBottom: text(17)}}
                    />
                )}
                <Text style={[styles.title_sty, {color: data.is_success ? '#4BA471' : '#DC4949'}]}>{data.title}</Text>
                <Html html={data.content} style={styles.content_sty} />
                <View
                    style={{
                        backgroundColor: '#F5F6F8',
                        padding: text(16),
                        marginVertical: text(16),
                        borderRadius: text(4),
                        marginTop: text(30),
                    }}>
                    <View style={{position: 'relative'}}>
                        <Text style={{lineHeight: text(18), color: '#4E556C'}}>
                            点击立即分享，好友注册后也可领取2000点击立即分享，好友注册后也可领取2000点击立即分享，好友注册后也可领取2000
                        </Text>
                        <AntDesign
                            name={'caretdown'}
                            size={20}
                            color={'#F5F6F8'}
                            style={{position: 'absolute', right: '20%', bottom: text(-28)}}
                        />
                    </View>
                </View>
                {data.is_success == true && (
                    <View style={[Style.flexRow, {marginTop: text(15)}]}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                borderRadius: text(10),
                                borderColor: '#545968',
                                borderWidth: 0.5,
                                marginRight: text(10),
                            }}>
                            <Text style={[styles.btn_sty, {color: '#545968'}]}>查看我的资产</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1, borderRadius: text(10), backgroundColor: '#0051CC'}}>
                            <Text style={[styles.btn_sty, {color: '#fff'}]}>立即分享</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {data.is_success == false && (
                <View style={styles.card_sty}>
                    <View>
                        <View style={Style.flexRow}>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    color: Colors.defaultColor,
                                    fontSize: text(15),
                                    fontWeight: 'bold',
                                }}>
                                长期增值计划
                            </Text>
                            <Text style={{color: '#555B6C', fontSize: text(13), marginLeft: text(6)}}>
                                科学定制 | 稳健理性多赚钱
                            </Text>
                        </View>
                        <Text style={styles.ratio_sty}>6.87%~11.58% </Text>
                        <Text style={{color: '#9AA1B2', fontSize: text(12)}}>预期年化收益率</Text>
                    </View>
                    <AntDesign name={'right'} size={12} color={'#9095A5'} />
                </View>
            )}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: text(16),
    },
    top_sty: {
        paddingTop: text(35),
        paddingBottom: text(28),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title_sty: {
        fontSize: Font.textH1,
        marginBottom: text(12),
    },
    content_sty: {
        color: '#4E556C',
        fontSize: text(13),
        lineHeight: text(18),
    },
    btn_sty: {
        textAlign: 'center',
        paddingVertical: text(14),
    },
    card_sty: {
        backgroundColor: '#fff',
        borderRadius: text(10),
        ...Space.boxShadow('#E0E2E7', 0, text(2), 1, text(12)),
        padding: text(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratio_sty: {
        color: '#E74949',
        fontFamily: Font.numFontFamily,
        fontSize: text(22),
        paddingTop: text(12),
        paddingBottom: text(4),
    },
});
