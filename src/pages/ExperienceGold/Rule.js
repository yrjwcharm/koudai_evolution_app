/*
 * @Author: xjh
 * @Date: 2021-03-03 15:05:36
 * @Description:体验金规则
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-12 14:05:35
 */
import React, {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import FitImage from 'react-native-fit-image';
import Http from '../../services';
import {px as text} from '../../utils/appUtil.js';
import Header from '../../components/NavBar';
export default function Rule() {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('/freefund/rule/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    return (
        <>
            <Header
                title={data?.title}
                leftIcon="chevron-left"
                style={{backgroundColor: '#D4AC6F'}}
                fontStyle={{color: '#fff'}}
            />
            <ScrollView style={{marginBottom: text(20), marginTop: text(10)}}>
                {Object.keys(data).length > 0 &&
                    data?.image_list?.map((_item, _index) => {
                        return <FitImage key={_item + _index} source={{uri: _item}} resizeMode="contain" />;
                    })}
            </ScrollView>
        </>
    );
}
