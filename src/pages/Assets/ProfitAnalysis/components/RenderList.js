/*
 * @Date: 2022/10/1 16:22
 * @Author: yanruifeng
 * @Description:列表渲染封装
 */

import React from 'react';
import PropTypes from 'prop-types';
import {delMille} from '../../../../utils/common';
import {Colors, Font, Style} from '../../../../common/commonStyle';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px} from '../../../../utils/appUtil';

const RenderList = ({data, date, onPress}) => {
    return (
        <>
            <View style={styles.profitHeader}>
                <View style={styles.profitHeaderLeft}>
                    <Text style={styles.profitLabel}>收益明细</Text>
                    <Text style={styles.profitDate}>({date})</Text>
                </View>
                <TouchableOpacity onPress={onPress}>
                    <View style={styles.profitHeaderRight}>
                        <Text style={styles.moneyText}>金额(元)</Text>
                        <Image source={require('../../../../assets/img/icon/sort.png')} />
                    </View>
                </TouchableOpacity>
            </View>
            {data?.map((item, index) => {
                let color =
                    delMille(item.profit) > 0
                        ? Colors.red
                        : delMille(item.profit) < 0
                        ? Colors.green
                        : Colors.lightGrayColor;
                const type = item.type == 1 ? '私募' : item.type == 2 ? '组合' : item.type == 3 ? '计划' : '基金';
                return (
                    <View style={styles.listRow} key={item + '' + index}>
                        <View style={styles.typeView}>
                            <View style={styles.typeWrap}>
                                <Text style={styles.type}>{type}</Text>
                            </View>
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                        <Text style={[styles.detail, {color: `${color}`}]}>{item.profit}</Text>
                    </View>
                );
            })}
        </>
    );
};

RenderList.propTypes = {
    data: PropTypes.array,
};

export default RenderList;
const styles = StyleSheet.create({
    profitHeader: {
        marginTop: px(24),
        ...Style.flexBetween,
    },
    profitHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profitHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profitLabel: {
        fontSize: px(13),
        fontFamily: Font.pingFangMedium,
        color: Colors.defaultColor,
    },
    profitDate: {
        marginLeft: px(4),
        fontSize: Font.textH3,
        fontFamily: Font.pingFangRegular,
        color: Colors.lightGrayColor,
    },
    moneyText: {
        marginRight: px(4),
        fontFamily: Font.pingFangRegular,
        color: Colors.defaultColor,
        fontSize: px(12),
    },
    listRow: {
        marginTop: px(12),
        ...Style.flexBetween,
    },
    typeView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeWrap: {
        width: px(28),
        height: px(18),
        borderRadius: px(2),
        borderStyle: 'solid',
        borderWidth: StyleSheet.hairlineWidth,
        ...Style.flexCenter,
        borderColor: '#BDC2CC',
    },
    type: {
        fontSize: px(10),
        fontFamily: Font.pingFangRegular,
        color: Colors.lightBlackColor,
    },
    title: {
        marginLeft: px(6),
        fontSize: Font.textH3,
        fontFamily: Font.pingFangRegular,
        color: Colors.defaultColor,
    },
    detail: {
        fontSize: px(13),
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
});
