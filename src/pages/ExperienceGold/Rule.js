/*
 * @Author: xjh
 * @Date: 2021-03-03 15:05:36
 * @Description:体验金规则
 * @LastEditors: dx
 * @LastEditTime: 2021-03-09 11:41:08
 */
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import FitImage from 'react-native-fit-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import Http from '../../services';
import {px as text} from '../../utils/appUtil.js';
export default function Rule() {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('/freefund/rule/20210101').then((res) => {
            setData(res.result.image_list);
        });
    }, []);
    return (
        <SafeAreaView style={{paddingTop: text(8)}} edges={['bottom']}>
            <ScrollView>
                {Object.keys(data).length > 0 &&
                    data.map((_item, _index) => {
                        return <FitImage key={_item + _index} source={{uri: _item}} resizeMode="contain" />;
                    })}
            </ScrollView>
        </SafeAreaView>
    );
}
