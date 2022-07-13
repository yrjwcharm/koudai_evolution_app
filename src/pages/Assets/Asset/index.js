/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useCallback, useState} from 'react';
import AssetHeaderCard from './AssetHeaderCard';
import {Colors, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import RationalCard from './RationalCard';
import HoldList from './HoldList';
import {useFocusEffect} from '@react-navigation/native';
import {getHolding, getInfo} from './service';
import {Button} from '~/components/Button';
import BottomMenus from './BottomMenus';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import Header from './Header';
const Index = ({navigation}) => {
    const [data, setData] = useState(null);
    const [holding, setHolding] = useState(null);
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.() || {};
    const getData = async () => {
        let res = await getInfo();
        setData(res.result);
    };
    const getHoldingData = async () => {
        let res = await getHolding();
        setHolding(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            getData();
            getHoldingData();
        }, [])
    );
    return (
        <>
            <Header />
            <ScrollView style={{backgroundColor: Colors.bgColor}}>
                {/* 资产卡片 */}
                <AssetHeaderCard />
                {/* 理性等级和投顾 */}
                <RationalCard im_info={data?.im_info} rational_info={data?.rational_info} />
                {/* 持仓列表 */}
                <HoldList products={holding?.products} />
                {/* 底部列表 */}
                <BottomMenus data={data?.bottom_menus} />
                <BottomDesc />
            </ScrollView>
        </>
    );
};
export default Index;
const styles = StyleSheet.create({});
