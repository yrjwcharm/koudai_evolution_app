/*
 * @Date: 2022-06-21 14:16:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-22 10:26:18
 * @Description:关注
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getData} from './service';
import MessageCard from './MessageCard';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import HotFund from './HotFund';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabbar from '~/components/ScrollTabbar';
import HeaderRight from './HeaderRight';
import FollowTable from './FollowTable';
const Attention = ({navigation}) => {
    const [data, setData] = useState();
    const [activeTab, setActiveTab] = useState();
    const _getData = async () => {
        let res = await getData();
        setData(res.result);
        console.log(res.result);
    };
    const onChangeTab = (obj) => {
        setActiveTab(data?.follow?.tabs[obj.i].item_type);
    };
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return <HeaderRight />;
            },
        });
        _getData();
    }, [navigation]);
    return (
        <View style={{flex: 1}}>
            <ScrollView style={styles.con}>
                {/* 消息卡片 */}
                {data?.notice && <MessageCard data={data?.notice} />}
                {/* 热门基金 */}
                {data?.hot_fund && <HotFund data={data?.hot_fund} />}
                {/* 列表 */}
                {data?.follow?.tabs && (
                    <ScrollableTabView renderTabBar={() => <ScrollTabbar />} onChangeTab={onChangeTab}>
                        {data?.follow?.tabs?.map((tab, index) => (
                            <View key={index} tabLabel={tab?.type_text} style={{marginTop: px(6)}}>
                                <FollowTable activeTab={activeTab} />
                            </View>
                        ))}
                    </ScrollableTabView>
                )}
            </ScrollView>
        </View>
    );
};

export default Attention;

const styles = StyleSheet.create({
    con: {
        padding: px(16),
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});
