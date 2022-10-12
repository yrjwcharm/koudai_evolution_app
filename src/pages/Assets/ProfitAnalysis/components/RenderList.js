/*
 * @Date: 2022/10/1 16:22
 * @Author: yanruifeng
 * @Description:列表渲染封装
 */

import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {delMille} from '../../../../utils/common';
import {Colors, Font, Style} from '../../../../common/commonStyle';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {px as text, px} from '../../../../utils/appUtil';
import {getProfitDetail} from '../service';

const RenderList = ({type}) => {
    const [headerList, setHeaderList] = useState([]);
    const [profitList, setProfitList] = useState([]);
    useEffect(() => {
        const getProfitDetailData = async () => {
            const res = await getProfitDetail({type});
            if (res.code == '000000') {
                setHeaderList(res.result?.head_list);
                setProfitList(res.result?.data_list);
            }
        };
        getProfitDetailData();
    }, [type]);
    const sortRenderList = useCallback(() => {}, []);
    return (
        <>
            <View style={styles.profitHeader}>
                <View style={styles.profitHeaderLeft}>
                    <Text style={styles.profitLabel}>{headerList[0]?.text.substring(0, 4)}</Text>
                    <Text style={styles.profitDate}>{headerList[0]?.text.substring(4)}</Text>
                </View>
                <TouchableOpacity onPress={sortRenderList}>
                    <View style={styles.profitHeaderRight}>
                        <Text style={styles.moneyText}>{headerList[1]?.text}</Text>
                        <Image source={require('../../../../assets/img/icon/sort.png')} />
                    </View>
                </TouchableOpacity>
            </View>
            {profitList.map((item, index) => {
                let color =
                    delMille(item.profit) > 0
                        ? Colors.red
                        : delMille(item.profit) < 0
                        ? Colors.green
                        : Colors.lightGrayColor;
                return (
                    <View style={styles.listRow} key={item + '' + index}>
                        <View style={styles.typeView}>
                            <View style={styles.typeWrap}>
                                <Text style={[styles.type, {fontSize: item.type?.length > 2 ? px(6) : px(10)}]}>
                                    {item.type}
                                </Text>
                            </View>
                            <Text style={styles.title}>{item.text}</Text>
                            {item.tag ? (
                                <View style={{borderRadius: text(2), backgroundColor: '#EFF5FF', marginLeft: text(6)}}>
                                    <Text style={styles.tag}>{item.tag}</Text>
                                </View>
                            ) : null}
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
    tag: {
        paddingHorizontal: text(6),
        paddingVertical: text(2),
        borderRadius: text(2),
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.brandColor,
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
