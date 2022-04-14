/*
 * @Date: 2021-06-09 11:37:24
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-14 17:57:11
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
                data?.log_id && global.LogTool(data?.log_id);
                jump(data?.button?.url);
            }}>
            <Text style={styles.text}>{data.text}</Text>
            {data?.button?.text ? (
                <View style={styles.btn}>
                    <Text style={[styles.text, {lineHeight: px(17)}]}>{data?.button?.text}</Text>
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
        height: px(48),
        width: deviceWidth - px(32),
        marginLeft: px(16),
        borderRadius: px(4),
        paddingHorizontal: px(16),
    },
    text: {color: '#fff', fontSize: px(13), fontWeight: '700'},
    btn: {
        paddingHorizontal: px(10),
        paddingVertical: px(5),

        backgroundColor: 'rgba(255, 125, 65, 1)',
        borderRadius: px(4),
    },
});
