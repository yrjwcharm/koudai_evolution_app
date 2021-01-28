/*
 * @Date: 2021-01-27 18:11:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-27 19:52:01
 * @Description: 持有基金
 */
import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const HoldingFund = ({navigation}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [list, setList] = useState([]);

    const init = useCallback(
        (first) => {
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/user_holding/20210101').then(
                (res) => {
                    setRefreshing(false);
                    first && navigation.setOptions({title: res.result.title || '持有基金'});
                    first && setTabs(res.result.tabs);
                    setList(res.result.list);
                }
            );
        },
        [navigation]
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: (props) => (
                <>
                    <TouchableOpacity style={[styles.topRightBtn, Style.flexCenter]}>
                        <Text>基金查询</Text>
                    </TouchableOpacity>
                </>
            ),
        });
        init(true);
    }, [init, navigation]);
    return (
        tabs.length > 0 && (
            <ScrollableTabView style={[styles.container]} renderTabBar={() => <Tab />} initialPage={0}>
                {tabs.map((tab, index) => {
                    return (
                        <ScrollView
                            key={`tab${index}`}
                            tabLabel={tab}
                            style={[{transform: [{translateY: text(-1.5)}]}]}>
                            <></>
                        </ScrollView>
                    );
                })}
            </ScrollableTabView>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topRightBtn: {
        flex: 1,
        width: text(72),
        marginRight: text(8),
    },
});

export default HoldingFund;
