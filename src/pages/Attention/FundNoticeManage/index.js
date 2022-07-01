/*
 * @Date: 2022-06-28 21:47:04
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-29 23:45:15
 * @Description:基金消息管理
 */
import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '~/utils/appUtil';
import {Colors} from '~/common/commonStyle';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {getSettingData} from './services';
import Item from './Item';
import ScrollTabbar from '~/components/ScrollTabbar';

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
        <ScrollView style={{backgroundColor: Colors.bgColor}}>
            <View style={{marginBottom: px(20)}}>
                {data?.channel_list?.map((item) => (
                    <Item data={item} key={item.channel_id} />
                ))}
            </View>
            {data?.event_list?.length ? (
                <ScrollableTabView renderTabBar={() => <ScrollTabbar />}>
                    {data?.event_list.map((item) => (
                        <View tabLabel={item.name}>
                            {item?.list.map((_list) => (
                                <Item data={_list} key={_list.channel_id} />
                            ))}
                        </View>
                    ))}
                </ScrollableTabView>
            ) : null}
        </ScrollView>
    );
};

export default Index;

const styles = StyleSheet.create({});
