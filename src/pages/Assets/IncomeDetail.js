/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-23 10:17:14
 * @Description: 组合收益明细
 */
import React, {useEffect, useRef} from 'react';
import {Platform, StyleSheet} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import DailyProfit from './DailyProfit';
import AccProfit from './AccProfit';
import NetValueTrend from './NetValueTrend';
import {Colors} from '../../common/commonStyle';

const comObj = {
    日收益: DailyProfit,
    累计收益: AccProfit,
    七日年化走势: NetValueTrend,
    净值走势: NetValueTrend,
};

const IncomeDetail = ({navigation, route}) => {
    const {fund_code, page = 0, poid, tabs, title = '组合收益明细'} = route.params || {};
    const tabsRef = useRef(tabs || ['日收益', '累计收益', '净值走势']);
    const scrollTab = useRef();

    useEffect(() => {
        navigation.setOptions({title});
        Platform.OS === 'android' && page !== 0 && scrollTab.current?.goToPage(page);
    }, [page]);

    return (
        <ScrollableTabView
            style={[styles.container]}
            renderTabBar={() => <Tab />}
            initialPage={page}
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

export default IncomeDetail;
