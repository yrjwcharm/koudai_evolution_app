/*
 * @Date: 2021-01-29 17:11:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-29 19:23:53
 * @Description:交易记录
 */
import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableHighlight, Platform} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../../components/TabBar.js';
import http from '../../services/index.js';
import EmptyTip from '../../components/EmptyTip';
const TradeRecord = (props) => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [tabActive, setActiveTab] = useState(0);
    const getData = useCallback(() => {
        setLoading(true);
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/mapi/order/records/20210101', {
            page: page,
        }).then((data) => {
            setData(data.result);
            setLoading(false);
        });
    }, [page]);
    useEffect(() => {
        getData();
    }, [getData]);
    const _onPress = () => {
        setPage(2);
    };
    const renderItem = ({item, index, separators}) => {
        console.log(separators);
        return (
            <TouchableHighlight
                onPress={() => this._onPress(item)}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}>
                <View style={{backgroundColor: 'white'}}>
                    <Text>{item.title}</Text>
                </View>
            </TouchableHighlight>
        );
    };

    const renderContent = () => {
        return (
            <FlatList
                ItemSeparatorComponent={
                    Platform.OS !== 'android' &&
                    (({highlighted}) => <View style={[styles.separator, highlighted && {marginLeft: 0}]} />)
                }
                data={[{title: 'Title Text', key: 'item1'}]}
                ListEmptyComponent={<EmptyTip text="暂无交易记录" />}
                renderItem={renderItem}
                refreshing={loading}
                onRefresh={() => {
                    setPage(0);
                }}
            />
        );
    };
    return (
        <View style={{flex: 1, paddingTop: 1}}>
            <ScrollableTabView
                onChangeTab={(obj) => {
                    setActiveTab(obj.i);
                }}
                renderTabBar={() => <TabBar />}
                initialPage={0}>
                <View tabLabel="全部" style={{flex: 1}}>
                    {renderContent()}
                </View>
                <View tabLabel="定投" style={{flex: 1}} />
                <View tabLabel="购1" style={{flex: 1}} />
                <View tabLabel="定2" style={{flex: 1}} />
                <View tabLabel="购3" style={{flex: 1}} />
                <View tabLabel="定4" style={{flex: 1}} />
            </ScrollableTabView>
        </View>
    );
};

export default TradeRecord;

const styles = StyleSheet.create({});
