/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-01 15:38:27
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

const IncomeDetail = ({navigation, route}) => {
    const {fund_code, page = 0, poid, title = '组合收益明细'} = route.params || {};
    const tabsRef = useRef(['日收益', '累计收益', '净值走势']);
    const scrollTab = useRef();

    useEffect(() => {
        navigation.setOptions({title});
        Platform.OS === 'android' && page !== 0 && scrollTab.current?.goToPage(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <ScrollableTabView
            style={[styles.container]}
            renderTabBar={() => <Tab />}
            initialPage={page}
            ref={scrollTab}
            onChangeTab={(cur) => global.LogTool('changeTab', tabsRef.current[cur.i])}>
            {tabsRef.current.map((tab, index) => {
                if (index === 0) {
                    return <DailyProfit fund_code={fund_code} poid={poid} tabLabel={tab} key={`tab${index}`} />;
                }
                if (index === 1) {
                    return <AccProfit fund_code={fund_code} poid={poid} tabLabel={tab} key={`tab${index}`} />;
                }
                if (index === 2) {
                    return <NetValueTrend fund_code={fund_code} poid={poid} tabLabel={tab} key={`tab${index}`} />;
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
