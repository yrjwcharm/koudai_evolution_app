/*
 * @Date: 2022-06-24 10:37:18
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-24 14:25:25
 * @Description:导入持仓
 */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Font} from '~/common/commonStyle';

const index = () => {
    return (
        <View>
            <TouchableOpacity style={styles.card} />
        </View>
    );
};

export default index;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingHorizontal: px(16),
        paddingVertical: px(12),
        marginBottom: px(12),
    },
    title: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        marginRight: px(2),
    },
    code: {
        fontSize: px(11),
        color: Colors.lightGrayColor,
    },
    label_title: {
        color: '#858DA3',
        fontSize: px(12),
        lineHeight: px(17),
        marginBottom: px(2),
    },
    label_desc: {
        lineHeight: px(20),
        fontSize: px(14),
        fontFamily: Font.numFontFamily,
    },
});
