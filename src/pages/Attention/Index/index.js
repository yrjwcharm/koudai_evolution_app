/*
 * @Date: 2022-06-21 14:16:13
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-30 17:54:37
 * @Description:关注
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {followAdd, getData, getFollowList} from './service';
import MessageCard from './MessageCard';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import HotFund from './HotFund';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import HeaderRight from './HeaderRight';
import FollowTable from './FollowTable';
import Toast from '../../../components/Toast';
import NavBar from '~/components/NavBar';
import StickyHeader from '~/components/Sticky';
import {useFocusEffect} from '@react-navigation/native';
const Attention = ({navigation}) => {
    const [data, setData] = useState();
    const [followData, setFollowData] = useState();
    const [activeTab, setActiveTab] = useState(1);
    const [headHeight, setHeaderHeight] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;
    const _getData = async () => {
        let res = await getData();
        setData(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            _getData();
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            getFollowData({item_type: activeTab});
        }, [activeTab])
    );
    const onChangeTab = (obj) => {
        setActiveTab(data?.follow?.tabs[obj.i].item_type);
    };
    const getFollowData = async (params) => {
        let res = await getFollowList(params);
        setFollowData(res.result);
    };
    //一键关注
    const onFollow = async (params) => {
        let res = await followAdd(params);
        if (res.code == '000000') {
            _getData();
        }
        Toast.show(res.message);
    };

    return (
        <View style={{flex: 1}}>
            <NavBar renderRight={<HeaderRight />} title="关注" />
            <Animated.ScrollView
                style={styles.con}
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: {contentOffset: {y: scrollY}}, // 记录滑动距离
                            },
                        ],
                        {useNativeDriver: true}
                    ) // 使用原生动画驱动
                }
                scrollEventThrottle={1}>
                <View
                    style={{paddingHorizontal: px(16)}}
                    onLayout={(e) => {
                        let {height} = e.nativeEvent.layout;
                        setHeaderHeight(height); // 给头部高度赋值
                    }}>
                    {/* 消息卡片 */}
                    {data?.notice && <MessageCard data={data?.notice} />}
                    {/* 热门基金 */}
                    {data?.hot_fund && <HotFund data={data?.hot_fund} onFollow={onFollow} />}
                </View>
                {/* 列表 */}
                {/* <StickyHeader
                    stickyHeaderY={headHeight} // 把头部高度传入
                    stickyScrollY={scrollY} // 把滑动距离传入
                > */}
                {data?.follow?.tabs && (
                    <View style={{backgroundColor: '#fff'}}>
                        <ScrollableTabView
                            prerenderingSiblingsNumber={3}
                            renderTabBar={() => <ScrollTabbar boxStyle={{paddingLeft: px(8)}} />}
                            onChangeTab={onChangeTab}>
                            {data?.follow?.tabs?.map((tab, index) => (
                                <View key={index} tabLabel={tab?.type_text}>
                                    {/* 分割线 */}
                                    <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />
                                    <FollowTable
                                        data={followData}
                                        activeTab={activeTab}
                                        handleSort={getFollowData}
                                        tabButton={tab?.button_list}
                                    />
                                </View>
                            ))}
                        </ScrollableTabView>
                    </View>
                )}
                {/* </StickyHeader> */}
            </Animated.ScrollView>
        </View>
    );
};

export default Attention;

const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    followCon: {},
});
