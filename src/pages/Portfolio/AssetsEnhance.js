/*
 * @Date: 2021-01-22 10:51:10
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-22 17:49:57
 * @Description: 资产增强
 */
import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FitImage from 'react-native-fit-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import http from '../../services';
import BottomDesc from '../../components/BottomDesc';
import FixedBtn from './components/FixedBtn';

const AssetsEnhance = (props) => {
    const {upid} = props;
    const navigation = useNavigation();
    const [data, setData] = useState({
        bottom: {
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
        },
        btns: [
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
        ],
    });
    useEffect(() => {
        // http.get('/portfolio/asset_enhance/20210101', {upid}).then((res) => {
        //     setData(res.result);
        //     navigation.setOptions({title: res.result.title});
        // });
    });
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            {Object.keys(data).length > 0 && (
                <ScrollView>
                    <View style={styles.topPart}>
                        <Text style={styles.topTitle}>{'什么是资产增强'}</Text>
                        <Text style={styles.topContent}>
                            {'资产增强是指在全球配置之后，理财魔方为您优选基金，达成最优化选择基金的策略。'}
                        </Text>
                        <FitImage
                            source={{
                                uri: 'https://static.licaimofang.com/wp-content/uploads/2020/12/asset_enhance.png',
                            }}
                            style={styles.img}
                        />
                    </View>
                    <View style={styles.details}>
                        <View style={[styles.detail, {marginTop: 0}]}>
                            <Text style={styles.title}>{'基金稳定性筛选'}</Text>
                            <Text style={styles.content}>
                                {
                                    '在全市场8000多只基金中，筛选出稳定性强的基金，包括风格稳定，基金经理就职稳定，开放申购赎回稳定，投资者结构稳定等'
                                }
                            </Text>
                        </View>
                        <View style={[styles.detail]}>
                            <Text style={styles.title}>{'基金因子风格筛选'}</Text>
                            <Text style={styles.content}>
                                {'在初选池中，并对这些基金做各种风险情景测试，确保基金的收益分布在可控范围内。'}
                            </Text>
                        </View>
                        <View style={[styles.detail]}>
                            <Text style={styles.title}>{'业绩领先基金入选'}</Text>
                            <Text style={styles.content}>{'精选能够稳定打败市场，产生超额收益的基金'}</Text>
                        </View>
                    </View>
                    <BottomDesc data={data.bottom} />
                </ScrollView>
            )}
            {data.btns && <FixedBtn btns={data.btns} />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topPart: {
        paddingVertical: Space.marginVertical,
        paddingHorizontal: Space.marginAlign,
        backgroundColor: '#fff',
    },
    topTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    topContent: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        marginTop: text(4),
    },
    img: {
        marginTop: text(8),
        paddingHorizontal: text(18),
    },
    details: {
        marginHorizontal: Space.marginAlign,
        marginBottom: text(20),
        paddingVertical: Space.marginVertical,
        paddingRight: text(8),
        paddingLeft: text(14),
        backgroundColor: Colors.bgColor,
        borderRadius: Space.borderRadius,
    },
    detail: {
        marginTop: text(14),
    },
    title: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
        fontWeight: '500',
        marginBottom: text(4),
    },
    content: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
    },
});

export default AssetsEnhance;
