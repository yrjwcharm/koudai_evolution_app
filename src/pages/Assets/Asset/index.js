/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import AssetHeaderCard from './AssetHeaderCard';
import {Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import RationalCard from './RationalCard';
import HoldList from './HoldList';
const Index = () => {
    return (
        <ScrollView>
            {/* 资产卡片 */}
            <AssetHeaderCard />
            {/* 理性等级和投顾 */}
            <RationalCard />
            {/* 持仓列表 */}
            <HoldList />
        </ScrollView>
    );
};
export default Index;
const styles = StyleSheet.create({});
