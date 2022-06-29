/*
 * @Date: 2022-06-28 21:47:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-29 15:12:04
 * @Description:基金消息中心
 */
import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
// import {getSettingData} from '../FundNoticeManage/services';

const Index = () => {
    const [data, setData] = useState({});
    // const getData = async () => {
    //     let res = await getSettingData();
    //     setData(res.result);
    // };
    return (
        <View>
            <Text>index</Text>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: '#fff',
        padding: px(16),
    },
    tag: {
        backgroundColor: '#E74949',
        borderRadius: px(4),
        paddingVertical: px(3),
        paddingHorizontal: px(6),
        marginLeft: px(12),
    },
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
    },
    content_text: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        marginBottom: px(8),
    },
    lable: {
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(30),
        backgroundColor: '#F1F6FF',
        marginRight: px(8),
        marginBottom: px(8),
    },
    lable_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.btnColor,
    },
    button: {
        paddingVertical: px(4),
        paddingHorizontal: px(10),
        borderRadius: px(103),
    },
    button_text: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.btnColor,
    },
});
