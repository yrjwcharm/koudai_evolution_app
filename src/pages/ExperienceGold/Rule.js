/*
 * @Author: xjh
 * @Date: 2021-03-03 15:05:36
 * @Description:体验金规则
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-03 15:57:44
 */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import FitImage from 'react-native-fit-image';
import Http from '../../services';
import {px as text} from '../../utils/appUtil.js';
export default function Rule() {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/freefund/rule/20210101').then((res) => {
            setData(res.result.image_list);
        });
    }, []);
    return (
        <View>
            {Object.keys(data).length > 0 &&
                data.map((_item, _index) => {
                    return <FitImage source={{uri: _item}} resizeMode="contain" />;
                })}
        </View>
    );
}
