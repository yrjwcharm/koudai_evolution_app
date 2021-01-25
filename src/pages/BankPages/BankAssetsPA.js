/*
 * @Author: xjh
 * @Date: 2021-01-25 11:26:41
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-25 11:36:30
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/NavBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import Accordion from 'react-native-collapsible/Accordion';
import BottomDesc from '../../components/BottomDesc';

export default function BankAssetsPA() {
    const [data, setData] = useState({});
    const [activeSections, setActiveSections] = useState([0]);
    const updateSections = (activeSections) => setActiveSections(activeSections);
    const rightPress = () => {
        props.navigation.navigate(data.part4.url);
    };
    const bottom = {
        image: 'https://static.licaimofang.com/wp-content/uploads/2020/12/endorce_CMBC.png',
        desc: [
            {
                title: '基金销售服务由玄元保险提供',
            },
            {
                title: '基金销售资格证号:000000803',
                btn: {
                    text: '详情',
                    url: '/article_detail/79',
                },
            },
            {
                title: '市场有风险，投资需谨慎',
            },
        ],
    };
    useEffect(() => {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/doc/wallet/holding/20210101').then((res) => {
            setData(res.result);
        });
    }, []);

    return (
        <SafeAreaView edges={['bottom']}>
            <Header
                title={'会存A'}
                leftIcon="chevron-left"
                rightText={'交易记录'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
                fontStyle={{color: '#fff'}}
                style={{backgroundColor: '#0052CD'}}
            />
            {Object.keys(data).length > 0 && (
                <ScrollView>
                    <View style={styles.bg_sty}></View>
                    <View style={Style.containerPadding}>
                        <View style={[styles.card_sty, Style.flexCenter]}>
                            <Text style={Style.descSty}>总金额(元){data.part1.date}</Text>
                            <Text style={styles.amount_sty}>{data.part1.amount}</Text>
                            <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.top_text_sty}>日收益</Text>
                                    <Text style={styles.bottom_num_sty}>{data.part1.profit}</Text>
                                </View>
                                <View style={{flex: 1, textAlign: 'center'}}>
                                    <Text style={styles.top_text_sty}>累计受益</Text>
                                    <Text style={styles.bottom_num_sty}>{data.part1.profit_acc}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <BottomDesc data={bottom} style={{paddingBottom: 100}} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#fff',
    },
    bg_sty: {
        backgroundColor: '#0052CD',
        height: text(120),
        width: '100%',
    },
    card_sty: {
        backgroundColor: '#fff',
        paddingVertical: text(25),
        marginTop: text(-130),
        borderRadius: text(10),
        paddingHorizontal: text(16),
    },
    amount_sty: {
        color: '#1F2432',
        fontSize: text(36),
        fontFamily: Font.numFontFamily,
        paddingTop: text(5),
    },
    top_text_sty: {
        fontSize: text(12),
        color: '#9095A5',
        textAlign: 'center',
    },
    bottom_num_sty: {
        color: '#1F2432',
        fontSize: text(18),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
        marginTop: text(8),
    },
});
