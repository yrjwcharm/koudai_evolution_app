/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-01 15:34:49
 * @Description:tab公共模块
 *
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, FlatList} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style, Space} from '../../../common/commonStyle';
import {px, deviceWidth} from '../../../utils/appUtil';
import {useJump} from '../../../components/hooks';
import FastImage from 'react-native-fast-image';
import BottomDesc from '../../../components/BottomDesc.js';
import RenderCate from './RenderCate.js';
import EmptyTip from '../../../components/EmptyTip';
const CommonView = ({k}) => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        getData('refresh');
    }, [getData]);
    const getData = useCallback(
        (type, page = 1) => {
            type == 'refresh' && setRefreshing(true);
            http.get(`vision/${k}/articles/20210524`, {page}).then((res) => {
                setRefreshing(false);
                setData((prevData) => {
                    let _data = {...prevData};
                    _data[k] = res.result;
                    return _data;
                });
            });
        },
        [k]
    );
    return (
        <>
            <View style={{paddingTop: px(12), flex: 1}}>
                <FlatList
                    data={data?.[k]?.list}
                    style={{paddingHorizontal: px(16)}}
                    ListEmptyComponent={!refreshing && <EmptyTip text={'暂无数据'} />}
                    renderItem={({item}) => {
                        return RenderCate(item, {marginBottom: px(12)});
                    }}
                    ListFooterComponent={<BottomDesc />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        // getData('loadmore');
                    }}
                    refreshing={refreshing}
                    onRefresh={() => {
                        getData('refresh');
                    }}
                />
            </View>
        </>
    );
};

export default CommonView;

const styles = StyleSheet.create();
