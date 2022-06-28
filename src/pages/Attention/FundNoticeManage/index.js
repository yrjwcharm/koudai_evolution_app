/*
 * @Date: 2022-06-28 21:47:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-28 22:15:39
 * @Description:基金消息管理
 */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors} from '~/common/commonStyle';

const Index = () => {
    return (
        <View>
            <Text>index</Text>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    title: {
        fontSize: px(14),
        lineHeight: px(20),
        color: Colors.defaultColor,
        marginBottom: px(2),
        fontWeight: '700',
    },
    desc: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
        lineHeight: px(17),
    },
    icon_img: {
        width: px(24),
        height: px(24),
        marginRight: px(8),
    },
});
