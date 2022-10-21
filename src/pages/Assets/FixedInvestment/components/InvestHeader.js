/*
 * @Date: 2022/10/11 13:58
 * @Author: yanruifeng
 * @Description: 定投header
 */

import React from 'react';
import PropTypes from 'prop-types';
import {deviceWidth, isEmpty, px} from '../../../../utils/appUtil';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {BoxShadow} from 'react-native-shadow';
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
const InvestHeader = React.memo(({headList, handleSort, style}) => {
    const [left, center, right] = headList;
    const icon1 = isEmpty(center?.sort_type)
        ? require('../assets/sort.png')
        : center?.sort_type == 'desc'
        ? require('../assets/desc.png')
        : require('../assets/asc.png');
    const icon2 = isEmpty(right?.sort_type)
        ? require('../assets/sort.png')
        : right?.sort_type == 'desc'
        ? require('../assets/desc.png')
        : require('../assets/asc.png');

    return (
        <View style={style}>
            <BoxShadow setting={{...shadow, width: deviceWidth - px(32), height: px(37)}}>
                <View style={styles.sortChoiceView}>
                    <View style={styles.sortChoiceWrap}>
                        <Text style={styles.sortText}>{left?.text}</Text>
                        <TouchableOpacity onPress={() => handleSort(center)}>
                            <View style={styles.investIssue}>
                                <Text style={styles.sortText}>{center?.text}</Text>

                                <Image source={icon1} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSort(right)}>
                            <View style={styles.totalSort}>
                                <Text style={styles.sortText}>{right?.text}</Text>
                                <Image source={icon2} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </BoxShadow>
        </View>
    );
});

InvestHeader.propTypes = {
    headList: PropTypes.array,
};

export default InvestHeader;
const styles = StyleSheet.create({
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
