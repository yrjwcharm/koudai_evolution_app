/*
 * @Date: 2022/10/11 13:58
 * @Author: yanruifeng
 * @Description: 定投header
 */

import React from 'react';
import PropTypes from 'prop-types';
import {deviceWidth, px} from '../../../../utils/appUtil';
import {Image, Text, View, StyleSheet} from 'react-native';
import {BoxShadow} from 'react-native-shadow';
import sortImg from '~/assets/img/attention/sort.png';
import sortUp from '~/assets/img/attention/sortUp.png';
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
const InvestHeader = ({headList}) => {
    return (
        <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(37)}}>
            <View style={styles.sortChoiceView}>
                <View style={styles.sortChoiceWrap}>
                    <Text style={styles.sortText}>{headList[0]?.text}</Text>
                    <View style={styles.investIssure}>
                        <Text style={styles.sortText}>{headList[1]?.text}</Text>

                        <Image source={require('../assets/asc.png')} />
                    </View>
                    <View style={styles.totalSort}>
                        <Text style={styles.sortText}>{headList[2]?.text}</Text>
                        <Image source={require('../assets/asc.png')} />
                    </View>
                </View>
            </View>
        </BoxShadow>
    );
};

InvestHeader.propTypes = {};

export default InvestHeader;
const styles = StyleSheet.create({
    sortText: {
        fontSize: px(11),
        marginRight: px(2),
        fontFamily: Font.numRegular,
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
    investIssure: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortChoiceWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
