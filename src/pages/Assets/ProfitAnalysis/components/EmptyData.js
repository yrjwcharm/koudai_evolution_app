/*
 * @Date: 2022/10/20 00:17
 * @Author: yanruifeng
 * @Description:
 */

import {Image, Text, StyleSheet, View} from 'react-native';
import {deviceWidth, px} from '../../../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import image from '../../../../assets/img/emptyTip/noProfit.png';
import React from 'react';
import {Colors, Font, Style} from '../../../../common/commonStyle';
const shadow = {
    color: '#aaa',
    border: 1,
    radius: 0,
    opacity: 0.01,
    x: 0,
    y: 1,
    style: {
        position: 'relative',
    },
};
const EmptyData = () => {
    return (
        <BoxShadow
            setting={{
                ...shadow,
                width: deviceWidth - px(56),
                height: px(211),
            }}>
            <View style={styles.emptyView}>
                <Image source={image} style={styles.emptyImg} />
                <Text style={styles.emptyText}>暂无数据</Text>
            </View>
        </BoxShadow>
    );
};
export default EmptyData;
const styles = StyleSheet.create({
    emptyView: {
        backgroundColor: Colors.white,
        ...Style.flexCenter,
        height: px(211),
        borderBottomLeftRadius: px(6),
        borderBottomRightRadius: px(6),
    },
    emptyImg: {
        height: px(64),
        width: px(120),
    },
    emptyText: {
        marginTop: px(15),
        fontWeight: '500',
        fontSize: px(12),
        color: Colors.descColor,
    },
});
