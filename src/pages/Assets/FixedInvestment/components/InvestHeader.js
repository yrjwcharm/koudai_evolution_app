/*
 * @Date: 2022/10/11 13:58
 * @Author: yanruifeng
 * @Description: 定投header
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {deviceWidth, px} from '../../../../utils/appUtil';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {BoxShadow} from 'react-native-shadow';
import sort from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
import sortDown from '~/assets/img/attention/sortDown.png';
import {Colors, Font} from '../../../../common/commonStyle';
const shadow = {
    color: '#aaa',
    border: 6,
    radius: 1,
    opacity: 0.102,
    x: 0,
    y: 1,
    style: {
        position: 'relative',
        left: px(16),
    },
};
const InvestHeader = ({headList, times, sum, sortByIssue, sortBySum}) => {
    const icon1 = times == 'asc' ? sortUp : times == 'desc' ? sortDown : sort;
    const icon2 = sum == 'asc' ? sortUp : sum == 'desc' ? sortDown : sort;

    return (
        <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(37)}}>
            <View style={styles.sortChoiceView}>
                <View style={styles.sortChoiceWrap}>
                    <Text style={styles.sortText}>{headList[0]?.text}</Text>
                    <TouchableOpacity onPress={sortByIssue}>
                        <View style={styles.investIssue}>
                            <Text style={styles.sortText}>{headList[1]?.text}</Text>

                            <Image source={icon1} style={styles.sortIcon} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sortBySum}>
                        <View style={styles.totalSort}>
                            <Text style={styles.sortText}>{headList[2]?.text}</Text>
                            <Image source={icon2} style={styles.sortIcon} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </BoxShadow>
    );
};

InvestHeader.propTypes = {
    headList: PropTypes.array,
    times: PropTypes.string,
    sum: PropTypes.string,
};

export default InvestHeader;
const styles = StyleSheet.create({
    sortIcon: {
        width: px(12),
        height: px(12),
    },
    sortText: {
        fontSize: px(11),
        marginRight: px(2),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
    totalSort: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortChoiceView: {
        backgroundColor: '#fff',
        paddingHorizontal: px(12),
        // marginHorizontal: px(16),
        borderRadius: px(6),
        height: px(37),
        justifyContent: 'center',
    },
    investIssue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortChoiceWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
