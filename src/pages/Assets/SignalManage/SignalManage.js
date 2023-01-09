/*
 * @Date: 2023-01-09 14:51:44
 * @Description:
 */
import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import Tab from './Tab';
import {useFocusEffect} from '@react-navigation/native';
import {getSignalInfo} from './service';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {px} from '~/utils/appUtil';

const SignalManage = () => {
    const [data, setData] = useState({});
    const [current, setCurrent] = useState(0);
    const scrollTab = useRef();
    const getData = async () => {
        let res = await getSignalInfo();
        setData(res.result);
    };

    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );
    return (
        <View>
            <Tab
                tabs={data.tab_list}
                onPress={(i) => {
                    scrollTab.current.goToPage(i);
                }}
            />
            <ScrollableTabView
                initialPage={0}
                onChangeTab={({i}) => setCurrent(i)}
                renderTabBar={false}
                ref={scrollTab}
                style={{flex: 1, marginTop: px(12)}}
            />
        </View>
    );
};

export default SignalManage;

const styles = StyleSheet.create({});
