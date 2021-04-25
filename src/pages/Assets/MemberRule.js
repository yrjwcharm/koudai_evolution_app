/*
 * @Author: xjh
 * @Date: 2021-03-03 15:05:36
 * @Description:会员中心理性值规则
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-20 16:18:54
 */
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import FitImage from 'react-native-fit-image';
import Http from '../../services';
import {px as text} from '../../utils/appUtil.js';
export default function MemberRule() {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('/mc/privilege_rule_detail/20210101').then((res) => {
            setData(res.result.items);
        });
    }, []);
    return (
        <ScrollView style={{marginBottom: text(20)}}>
            {Object.keys(data).length > 0 &&
                data.map((_item, _index) => {
                    return <FitImage key={_item + _index} source={{uri: _item}} resizeMode="contain" />;
                })}
        </ScrollView>
    );
}
