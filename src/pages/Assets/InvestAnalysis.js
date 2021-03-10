/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-10 20:23:49
 * @Description: 投资分析
 */
import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import AccProfit from './AccProfit';
import NetValueTrend from './NetValueTrend';
import MonthRatio from './MonthRatio';
import {Colors, Font, Space, Style} from '../../common/commonStyle';

const InvestAnalysis = ({navigation, route}) => {
    const tabsRef = useRef(['累计收益', '净值走势', '月度收益率']);

    return (
        <ScrollableTabView style={[styles.container]} renderTabBar={() => <Tab />} initialPage={0}>
            {tabsRef.current.map((tab, index) => {
                if (index === 0) {
                    return <AccProfit poid={route.params?.poid || 'X00F000003'} tabLabel={tab} key={`tab${index}`} />;
                }
                if (index === 1) {
                    return (
                        <NetValueTrend poid={route.params?.poid || 'X00F000003'} tabLabel={tab} key={`tab${index}`} />
                    );
                }
                if (index === 2) {
                    return <MonthRatio poid={route.params?.poid || 'X00F000003'} tabLabel={tab} key={`tab${index}`} />;
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

export default InvestAnalysis;
