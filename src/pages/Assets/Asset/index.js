/*
 * @Date: 2022-07-11 11:41:32
 * @Description:我的资产新版
 */
import {View, RefreshControl, Animated, ActivityIndicator} from 'react-native';
import React, {useCallback, useState, useRef} from 'react';
import AssetHeaderCard from './AssetHeaderCard';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import RationalCard from './RationalCard';
import HoldList from './HoldList';
import {useFocusEffect} from '@react-navigation/native';
import {getHolding, getInfo, getNotice, getReadMes} from './service';
import BottomMenus from './BottomMenus';
import BottomDesc from '~/components/BottomDesc';
import {useSelector} from 'react-redux';
import Header from './Header';
import {useShowGesture} from '~/components/hooks';
import GesturePassword from '~/pages/Settings/GesturePassword';
import LoginMask from '~/components/LoginMask';
import YellowNotice from './YellowNotice';
import AdInfo from './AdInfo';
const Index = ({navigation}) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [data, setData] = useState(null);
    const [notice, setNotice] = useState(null);
    const [holding, setHolding] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const is_login = useSelector((store) => store.userInfo)?.toJS().is_login;
    const [headHeight, setHeaderHeight] = useState(0);
    const [newMes, setNewmessage] = useState(0);
    const showGesture = useShowGesture();
    const getData = async () => {
        let res = await getInfo();
        setRefreshing(false);
        setData(res.result);
    };
    const getHoldingData = async () => {
        let res = await getHolding();
        setHolding(res.result);
    };
    // 小黄条
    const getNoticeData = async () => {
        let res = await getNotice();
        setNotice(res.result);
    };
    const readInterface = async () => {
        let res = await getReadMes();
        setNewmessage(res.result.all);
    };
    const init = (refresh) => {
        refresh && setRefreshing(true);
        getData();
        getHoldingData();
        is_login && getNoticeData();
        is_login && readInterface();
    };
    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [is_login])
    );
    return !showGesture ? (
        <>
            <Header newMes={newMes} />
            {!is_login && <LoginMask />}
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
                        {
                            useNativeDriver: true,
                        }
                    ) // 使用原生动画驱动
                }
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init(true)} />}>
                <View
                    onLayout={(e) => {
                        let {height} = e.nativeEvent.layout;
                        // console.log(e.nativeEvent.layout);
                        console.log(height);
                        setHeaderHeight(height); // 给头部高度赋值
                    }}>
                    {/* 系统通知 */}
                    {notice?.system_list?.length > 0 ? <YellowNotice data={notice?.system_list} /> : null}
                    {/* 资产卡片 */}
                    <AssetHeaderCard summary={holding?.summary} tradeMes={notice?.trade} />
                    {/* 理性等级和投顾 */}
                    <RationalCard im_info={data?.im_info} rational_info={data?.rational_info} />
                    {/* 运营位 */}
                    {data?.ad_info && <AdInfo ad_info={data?.ad_info} />}
                </View>
                {/* 持仓列表 */}
                {holding?.products ? (
                    <>
                        <HoldList
                            products={holding?.products}
                            scrollY={scrollY}
                            stickyHeaderY={headHeight}
                            reload={getHoldingData}
                        />
                        {/* 底部列表 */}
                        <BottomMenus data={data?.bottom_menus} />
                        <BottomDesc />
                    </>
                ) : (
                    <View style={{height: px(300)}}>
                        <ActivityIndicator style={{marginTop: px(30)}} color={Colors.btnColor} />
                    </View>
                )}
            </Animated.ScrollView>
        </>
    ) : (
        // 手势密码
        <GesturePassword option={'verify'} />
    );
};
export default Index;
