/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-25 15:31:55
 * @Description: 总收益明细
 */
import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import DailyProfit from './DailyProfit';
import AccProfit from './AccProfit';
import {Colors} from '../../common/commonStyle';

const TotalIncomeDetail = ({navigation}) => {
    const tabsRef = useRef(['日收益', '累计收益']);

    return (
        <ScrollableTabView
            style={[styles.container]}
            renderTabBar={() => <Tab />}
            initialPage={0}
            onChangeTab={(cur) => global.LogTool('changeTab', tabsRef.current[cur.i])}>
            {tabsRef.current.map((tab, index) => {
                if (index === 0) {
                    return <DailyProfit tabLabel={tab} key={`tab${index}`} />;
                }
                if (index === 1) {
                    return <AccProfit tabLabel={tab} key={`tab${index}`} />;
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

export default TotalIncomeDetail;
