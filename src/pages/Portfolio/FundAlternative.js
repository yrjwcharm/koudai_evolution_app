/*
 * @Date: 2021-09-24 14:15:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-24 14:51:56
 * @Description: 基金备选库
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {isIphoneX, px} from '../../utils/appUtil';
import http from '../../services';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Html from '../../components/RenderHtml';

const FundAlternative = ({route}) => {
    const [data, setData] = useState({
        table: {
            th: ['基金代码', '基金名称', '基金类型'],
            tr_list: [
                ['000171', '易方达裕丰回报债券', '债券型'],
                ['000527', '南方新优享灵活配置混合A', '混合型'],
                ['001410', '信达澳银新能源产业股票', '股票型'],
                ['002624', '广发优企精选混合A', '混合型'],
                ['002701', '东方红汇阳债券A', '债券型'],
                ['002803', '东方红沪港深组合', '混合型'],
                ['003474', '南方天天利货币A', '货币型'],
                ['004585', '鹏扬汇利债券A', '债券型'],
                ['110003', '易方达上证50指数A', '指数型'],
                ['160422', '华安创业板50ETF联接A', '指数型'],
                ['160916', '大成优选混合（LOF）', '混合型'],
                ['161005', '富国天惠成长混合A', '混合型'],
                ['163407', '兴全沪深300指数（LOF)A', '指数型'],
                ['166005', '中欧价值发现混合A', '混合型'],
                ['485111', '工银瑞信双利债券A', '债券型'],
                ['166006', '中欧行业成长混合（LOF)A', '混合型'],
                ['519066', '汇添富蓝筹稳健混合', '混合型'],
            ],
        },
    });

    return (
        <ScrollView bounces={false} style={styles.container}>
            <Text style={styles.textSty}>
                {
                    '该投顾组合的持仓基金将从以下备选基金中进行筛选，基金备选库仅供参考。投顾管理人将不定期对基金备选库进行更新。'
                }
            </Text>
            <View style={[styles.buyTableWrap, {marginBottom: isIphoneX() ? px(20) + 34 : px(20)}]}>
                <View style={styles.buyTableHead}>
                    <View style={styles.buyTableCell}>
                        <Text style={[styles.buyTableItem, styles.boldSty]}>{data?.table?.th[0]}</Text>
                    </View>
                    <View style={[styles.buyTableCell, {flex: 2}]}>
                        <Text style={[styles.buyTableItem, styles.boldSty]}>{data?.table?.th[1]}</Text>
                    </View>
                    <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                        <Text style={[styles.buyTableItem, styles.boldSty]}>{data?.table?.th[2]}</Text>
                    </View>
                </View>
                {data?.table?.tr_list?.map((item, index) => {
                    return (
                        <View
                            style={[styles.buyTableBody, {backgroundColor: index % 2 === 1 ? '#F7F8FA' : '#fff'}]}
                            key={item + index}>
                            <View style={styles.buyTableCell}>
                                <Html html={item[0]} style={styles.buyTableItem} />
                            </View>
                            <View style={[styles.buyTableCell, {flex: 2}]}>
                                <Html html={item[1]} style={styles.buyTableItem} />
                            </View>
                            <View style={[styles.buyTableCell, {borderRightWidth: 0}]}>
                                <Html html={item[2]} style={styles.buyTableItem} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: Space.padding,
    },
    textSty: {
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.descColor,
    },
    buyTableWrap: {
        marginVertical: Space.marginVertical,
        borderColor: Colors.borderColor,
        borderWidth: Space.borderWidth,
        borderRadius: px(6),
        overflow: 'hidden',
    },
    buyTableHead: {
        flexDirection: 'row',
        backgroundColor: '#F7F8FA',
        height: px(43),
    },
    buyTableBody: {
        flexDirection: 'row',
        height: px(40),
    },
    buyTableCell: {
        paddingHorizontal: px(6),
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        flex: 1,
        height: '100%',
        ...Style.flexRowCenter,
    },
    buyTableItem: {
        flex: 1,
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
    boldSty: {
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
});

export default FundAlternative;
