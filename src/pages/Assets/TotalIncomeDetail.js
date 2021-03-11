/*
 * @Date: 2021-01-26 11:42:16
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-10 19:38:06
 * @Description: 总收益明细
 */
import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Tab from '../../components/TabBar';
import DailyProfit from './DailyProfit';
import AccProfit from './AccProfit';
import {Colors, Font, Space, Style} from '../../common/commonStyle';

const TotalIncomeDetail = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const tabsRef = useRef(['日收益', '累计收益']);

    return (
        <ScrollableTabView style={[styles.container]} renderTabBar={() => <Tab />} initialPage={0}>
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
