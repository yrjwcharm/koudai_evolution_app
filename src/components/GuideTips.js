/*
 * @Date: 2021-06-09 11:37:24
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-10 18:10:28
 * @Description:引导提示tips
 */
import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import {px, deviceWidth} from '../utils/appUtil';
import {useJump} from './hooks';
import http from '~/services';

const GuideTips = ({data, style}) => {
    const jump = useJump();
    const [show, setShow] = useState(true);

    const onClose = () => {
        http.post('/asset/notice/close/20220915', {id: data?.log_id});
        setShow(false);
    };

    return show ? (
        <TouchableOpacity
            style={[styles.con, style]}
            activeOpacity={0.9}
            onPress={() => {
                data?.log_id && global.LogTool('guide_click', '底部小黑条', data.log_id);
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
            <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.closeBtn}>
                <Image source={require('~/assets/personal/tipClose.png')} style={{width: '100%', height: '100%'}} />
            </TouchableOpacity>
        </TouchableOpacity>
    ) : (
        false
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
    closeBtn: {
        position: 'absolute',
        top: -px(7),
        left: -px(7),
        width: px(14),
        height: px(14),
        zIndex: 1,
    },
});
