/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-10 17:54:32
 * @Description: 组合收益明细
 */
import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import DailyProfit from './DailyProfit';
import AccProfit from './AccProfit';
import NetValueTrend from './NetValueTrend';
import {Colors, Font, Space, Style} from '../../common/commonStyle';

const IncomeDetail = ({navigation, route}) => {
    const tabsRef = useRef(['日收益', '累计收益', '净值走势']);

    useEffect(() => {
        navigation.setOptions({title: route.params?.title || '组合收益明细'});
    }, [navigation, route]);

    return (
        <ScrollableTabView style={[styles.container]} renderTabBar={() => <Tab />} initialPage={0}>
            {tabsRef.current.map((tab, index) => {
                if (index === 0) {
                    return <DailyProfit poid={route.params?.poid || 'X00F000003'} tabLabel={tab} key={`tab${index}`} />;
                }
                if (index === 1) {
                    return <AccProfit poid={route.params?.poid || 'X00F000003'} tabLabel={tab} key={`tab${index}`} />;
                }
                if (index === 2) {
                    return (
                        <NetValueTrend poid={route.params?.poid || 'X00F000003'} tabLabel={tab} key={`tab${index}`} />
                    );
                }
            })}
        </ScrollableTabView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});

export default IncomeDetail;
