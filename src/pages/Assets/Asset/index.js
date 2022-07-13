/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {StyleSheet, Text, View, ScrollView, Animated} from 'react-native';
import React, {useCallback, useState, useRef} from 'react';
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
    const scrollY = useRef(new Animated.Value(0)).current;
    const [data, setData] = useState(null);
    const [holding, setHolding] = useState(null);
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.() || {};
    const [headHeight, setHeaderHeight] = useState(0);
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
            {/* <View style={[Style.flexBetween, styles.table_header]}>
                <Text style={[styles.light_text, {width: px(120)}]}>总金额</Text>
                <Text style={styles.light_text}>日收益</Text>
                <Text style={styles.light_text}>累计收益</Text>
            </View> */}
            <Animated.ScrollView
                style={{backgroundColor: Colors.bgColor, flex: 1}}
                scrollEventThrottle={1}
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                            },
                        ],
                        {useNativeDriver: true}
                    ) // 使用原生动画驱动
                }>
                <View
                    onLayout={(e) => {
                        let {height} = e.nativeEvent.layout;
                        console.log(height);
                        setHeaderHeight(height); // 给头部高度赋值
                    }}>
                    {/* 资产卡片 */}
                    <AssetHeaderCard />
                    {/* 理性等级和投顾 */}
                    <RationalCard im_info={data?.im_info} rational_info={data?.rational_info} />
                </View>
                {/* 持仓列表 */}
                <HoldList products={holding?.products} scrollY={scrollY} stickyHeaderY={headHeight} />
                {/* 底部列表 */}
                <BottomMenus data={data?.bottom_menus} />
                <BottomDesc />
            </Animated.ScrollView>
        </>
    );
};
export default Index;
const styles = StyleSheet.create({
    table_header: {
        borderTopLeftRadius: px(6),
        borderTopRightRadius: px(6),
        backgroundColor: '#fff',
        height: px(40),
        paddingHorizontal: px(16),
        position: 'absolute',
        top: 80,
        zIndex: 100,
    },
});
