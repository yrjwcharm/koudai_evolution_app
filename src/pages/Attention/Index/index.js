/*
 * @Date: 2022-06-21 14:16:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-24 18:19:51
 * @Description:关注
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getData, getFollowList} from './service';
import MessageCard from './MessageCard';
import {debounce, px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';
import HotFund from './HotFund';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import HeaderRight from './HeaderRight';
import FollowTable from './FollowTable';
import Feather from 'react-native-vector-icons/Feather';
const Attention = ({navigation}) => {
    const [data, setData] = useState();
    const [followData, setFollowData] = useState();
    const [activeTab, setActiveTab] = useState(1);
    const _getData = async () => {
        let res = await getData();
        setData(res.result);
    };
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return <HeaderRight />;
            },
        });
        _getData();
    }, [navigation]);
    const onChangeTab = (obj) => {
        setActiveTab(data?.follow?.tabs[obj.i].item_type);
    };
    const getFollowData = async (params) => {
        let res = await getFollowList(params);
        setFollowData(res.result);
    };
    useEffect(() => {
        getFollowData({item_type: activeTab});
    }, [activeTab]);
    return (
        <View style={{flex: 1}}>
            <ScrollView style={styles.con}>
                <View style={{paddingHorizontal: px(16)}}>
                    {/* 消息卡片 */}
                    {data?.notice && <MessageCard data={data?.notice} />}
                    {/* 热门基金 */}
                    {data?.hot_fund && <HotFund data={data?.hot_fund} />}
                </View>
                {/* 列表 */}
                {data?.follow?.tabs && (
                    <View style={{backgroundColor: '#fff'}}>
                        <ScrollableTabView
                            prerenderingSiblingsNumber={3}
                            renderTabBar={() => <ScrollTabbar boxStyle={{paddingLeft: px(8)}} />}
                            // contentProps={{height: scrollableTabViewHeight[activeTab] || 100}}

                            onChangeTab={onChangeTab}>
                            {data?.follow?.tabs?.map((tab, index) => (
                                <View key={index} tabLabel={tab?.type_text}>
                                    {/* 分割线 */}
                                    <View style={{height: 0.5, backgroundColor: '#E9EAEF'}} />
                                    <FollowTable data={followData} activeTab={activeTab} />
                                    <View style={Style.flexRow}>
                                        {tab?.button_list?.map((btn, dex) => (
                                            <TouchableOpacity
                                                key={dex}
                                                activeOpacity={0.9}
                                                style={[
                                                    Style.flexRow,
                                                    {flex: 1, paddingVertical: px(14), justifyContent: 'center'},
                                                ]}>
                                                <Feather
                                                    size={px(16)}
                                                    name={btn.icon == 'FollowAddFund' ? 'plus-circle' : 'list'}
                                                    color={Colors.btnColor}
                                                />
                                                <View style={{width: px(6)}} />
                                                <Text style={{color: Colors.btnColor}}>{btn.text}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </ScrollableTabView>
                    </View>
                )}
            </ScrollView>
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
