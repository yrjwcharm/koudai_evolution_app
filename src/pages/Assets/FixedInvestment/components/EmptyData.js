/*
 * @Date: 2022/10/22 19:38
 * @Author: yanruifeng
 * @Description:
 */
import {Image, Text, StyleSheet, View} from 'react-native';
import {deviceWidth, px} from '../../../../utils/appUtil';
import {BoxShadow} from 'react-native-shadow';
import image from '../../../../assets/img/emptyTip/empty.png';
import React from 'react';
import {Colors, Font, Style} from '../../../../common/commonStyle';
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
const EmptyData = () => {
    return (
        <View style={{marginTop: px(12)}}>
            <BoxShadow
                setting={{
                    ...shadow,
                    width: deviceWidth - px(32),
                    height: px(211),
                }}>
                <View style={styles.emptyView}>
                    <Image source={image} style={styles.emptyImg} />
                    <Text style={styles.emptyText}>暂无数据</Text>
                </View>
            </BoxShadow>
        </View>
    );
};
const styles = StyleSheet.create({
    emptyView: {
        backgroundColor: Colors.white,
        ...Style.flexCenter,
        height: px(211),
        borderRadius: px(6),
    },
    emptyImg: {
        height: px(96),
        width: px(120),
    },
    emptyText: {
        marginTop: px(15),
        fontSize: px(13),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightGrayColor,
    },
});
export default EmptyData;
