/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-08-11 16:52:38
 * @Description: 智能组合收益明细
 */
import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import DailyProfit from './DailyProfit';
import AccProfit from './AccProfit';
import {Colors} from '../../common/commonStyle';

const IntelligentIncomeDetail = ({navigation, route}) => {
    const tabsRef = useRef(['日收益', '累计收益']);

    useEffect(() => {
        navigation.setOptions({title: route.params?.title || '组合收益明细'});
    }, [navigation, route]);

    return (
        <ScrollableTabView
            style={[styles.container]}
            renderTabBar={() => <Tab />}
            initialPage={route?.params?.page || 0}
            onChangeTab={(cur) => global.LogTool('changeTab', tabsRef.current[cur.i])}>
            {tabsRef.current.map((tab, index) => {
                if (index === 0) {
                    return <DailyProfit poid={route.params?.poid || ''} tabLabel={tab} key={`tab${index}`} />;
                }
                if (index === 1) {
                    return <AccProfit intelligent poid={route.params?.poid || ''} tabLabel={tab} key={`tab${index}`} />;
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

export default IntelligentIncomeDetail;
