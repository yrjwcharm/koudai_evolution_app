/*
 * @Author: xjh
 * @Date: 2021-03-03 15:05:36
 * @Description:体验金规则
 * @LastEditors: dx
 * @LastEditTime: 2021-03-29 16:45:44
 */
import React, {useState, useEffect} from 'react';
import {ScrollView, StatusBar, View} from 'react-native';
import FitImage from 'react-native-fit-image';
import Http from '../../services';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import Header from '../../components/NavBar';
export default function Rule() {
    const [data, setData] = useState({});
    useEffect(() => {
        Http.get('/freefund/rule/20210101').then((res) => {
            if (res.code === '000000') {
                StatusBar.setBarStyle('light-content');
                setData(res.result);
            }
        });
        return () => StatusBar.setBarStyle('dark-content');
    }, []);
    return (
        <>
            <Header
                title={data?.title}
                leftIcon="chevron-left"
                style={{backgroundColor: '#D4AC6F'}}
                fontStyle={{color: '#fff'}}
            />
            <ScrollView style={{flex: 1}}>
                {Object.keys(data).length > 0 &&
                    data?.image_list?.map((_item, _index, arr) => {
                        return (
                            <View
                                style={[
                                    _index === arr.length - 1 ? {marginBottom: isIphoneX() ? 54 : 20} : {},
                                    _index === 0 ? {marginTop: 20} : {},
                                ]}>
                                <FitImage key={_item + _index} source={{uri: _item}} resizeMode="contain" />
                            </View>
                        );
                    })}
            </ScrollView>
        </>
    );
}
