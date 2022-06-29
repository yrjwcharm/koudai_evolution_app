/*
 * @Date: 2022-06-28 21:47:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-29 17:19:12
 * @Description:基金消息管理
 */
import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors} from '~/common/commonStyle';

import {getSettingData} from './services';

const Index = () => {
    const [data, setData] = useState({});
    const getData = async () => {
        let res = await getSettingData();
        setData(res.result);
    };
    useEffect(() => {
        getData();
    }, []);
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
