/*
 * @Date: 2021-09-24 10:49:47
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-24 14:16:59
 * @Description: 投资策略
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {isIphoneX, px} from '../../utils/appUtil';
import http from '../../services';
import {Colors, Font, Space} from '../../common/commonStyle';

const InvestStrategy = ({route}) => {
    return (
        <ScrollView bounces={false} style={styles.container}>
            <View style={[styles.partBox, {marginTop: 0}]}>
                <Text style={styles.partTitle}>{'策略结构'}</Text>
                <Text style={styles.contentText}>
                    {
                        '本投资组合策略权益仓位(股票型基金、偏股混合型基金、股票指数基金等)范围在70%-100%区间；固定收益类仓位(货币基金、债券型基金、偏债混合型基金、债券指数基金、对冲策略基金等)范围在0%-30%区间。本投资组合属于司南投顾组合多因子策略系列组合。'
                    }
                </Text>
            </View>
            <View style={styles.partBox}>
                <Text style={styles.partTitle}>{'组合配置策略'}</Text>
                <Text style={styles.contentText}>
                    {
                        '本基金权益仓位主要投资于主动管理型基金，偏成长风格，固定收益类仓位主要投资于偏债型基金和债券型基金等产品。南方基金对本投资组合策略的配置将坚持长期资产配置理念，择机进行多风格配置、境内外区域分散，再通过精选优秀基金经理力求获取长期稳健超额收益。'
                    }
                </Text>
            </View>
            <View
                style={[
                    styles.partBox,
                    {marginBottom: isIphoneX() ? Space.marginVertical + 34 : Space.marginVertical},
                ]}>
                <Text style={styles.partTitle}>{'投资策略'}</Text>
                <Text style={styles.contentText}>
                    <Text style={styles.blueCircle}>•&nbsp;</Text>
                    {
                        '运用量化模型分析各类资产风险收益特征，通过综合各国资产收益，把握宏观周期，同时控制权益仓位在规定范围前提下，计算各类细分资产配置比例，作为配置组合起点；结合团队宏观研究、资产研判以及资产配置委员会季度观点等，对量化配置比例进行对应的高低配调整，以此决定大类资产配置比例。'
                    }
                </Text>
                <Text style={styles.contentText}>
                    <Text style={styles.blueCircle}>•&nbsp;</Text>
                    {
                        '在底层基金方面，对全市场基金进行定量分析和定性跟踪研究，精选全市场权益类、固定收益类、绝对收益策略、QDII等投资范围内的公募基金构建投资组合。'
                    }
                </Text>
                <Text style={styles.contentText}>
                    <Text style={styles.blueCircle}>•&nbsp;</Text>
                    {
                        '动态跟踪组合表现与资产配置目标偏离情况，以及底层基金表现，对组合进行动态管理，在目标策略下追求择时、风格轮动、优选基金带来的超额收益。'
                    }
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    partBox: {
        marginTop: px(10),
        padding: Space.padding,
        backgroundColor: '#fff',
    },
    partTitle: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    contentText: {
        marginTop: px(12),
        fontSize: px(13),
        lineHeight: px(22),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    blueCircle: {
        fontSize: px(17),
        lineHeight: px(22),
        color: Colors.brandColor,
    },
});

export default InvestStrategy;
