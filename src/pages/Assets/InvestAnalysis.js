/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-23 10:16:55
 * @Description: 投资分析
 */
import React, {useEffect, useRef} from 'react';
import {Platform, StyleSheet} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import AccProfit from './AccProfit';
import NetValueTrend from './NetValueTrend';
import MonthRatio from './MonthRatio';
import {Colors} from '../../common/commonStyle';

const comObj = {
    累计收益: AccProfit,
    净值走势: NetValueTrend,
    七日年化走势: NetValueTrend,
    月度收益率: MonthRatio,
};

const InvestAnalysis = ({navigation, route}) => {
    const {fund_code, poid, tabs, type = 0} = route.params || {};
    const tabsRef = useRef(tabs || ['累计收益', '净值走势', '月度收益率']);
    const scrollTab = useRef();

    useEffect(() => {
        Platform.OS === 'android' && type !== 0 && scrollTab.current?.goToPage(type);
    }, [type]);

    return (
        <ScrollableTabView
            style={[styles.container]}
            renderTabBar={() => <Tab />}
            initialPage={type}
            ref={scrollTab}
            onChangeTab={(cur) => global.LogTool('changeTab', tabsRef.current[cur.i])}>
            {tabsRef.current.map((tab, index) => {
                const Com = comObj[tab];
                return <Com fund_code={fund_code} poid={poid} tabLabel={tab} key={`tab${index}`} />;
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
