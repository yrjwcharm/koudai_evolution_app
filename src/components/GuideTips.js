/*
 * @Date: 2021-06-09 11:37:24
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-30 15:18:08
 * @Description:引导提示tips
 */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {px, deviceWidth} from '../utils/appUtil';
import {useJump} from './hooks';

const GuideTips = ({data, style}) => {
    const jump = useJump();
    return (
        <TouchableOpacity
            style={[styles.con, style]}
            activeOpacity={0.9}
            onPress={() => {
                global.LogTool('guide_click', '底部小黑条', data?.log_id);
                jump(data?.button?.url);
            }}>
            <Text style={[styles.text, {flex: 1}]} numberOfLines={2}>
                {data?.text}
            </Text>
            {data?.button?.text ? (
                <View style={styles.btn}>
                    <Text style={[styles.text]}>{data?.button?.text}</Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
};

export default GuideTips;

const styles = StyleSheet.create({
    con: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 31, 32, 0.85)',
        width: deviceWidth - px(32),
        marginLeft: px(16),
        borderRadius: px(4),
        paddingHorizontal: px(12),
        paddingVertical: px(8),
    },
    text: {color: '#fff', fontSize: px(12), fontWeight: '700', lineHeight: px(17)},
    btn: {
        paddingHorizontal: px(10),
        paddingVertical: px(5),
        backgroundColor: 'rgba(255, 125, 65, 1)',
        borderRadius: px(14),
    },
});
