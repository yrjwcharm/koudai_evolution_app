/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-01 17:22:38
 * @Description:tab公共模块
 *
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';

import RenderCate from './RenderCate.js';
const CommonView = ({k}) => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        getData();
    }, [getData]);
    const getData = useCallback(
        (type) => {
            type !== 'loadmore' && setRefreshing(true);
            let page = 1;
            if (type == 'loadmore') {
                setData((prev) => {
                    page = prev?.[k]?.page ? prev?.[k]?.page + 1 : 2;
                    http.get(`vision/${k}/articles/20210524`, {page}).then((res) => {
                        setRefreshing(false);
                        setData((prevData) => {
                            let _data = {...prevData};
                            _data[k] = {
                                has_more: res.result.has_more,
                                notice: res.result.notice,
                                list: _data[k]?.list.concat(res.result.list || []),
                                page,
                            };
                            return _data;
                        });
                    });
                    return prev;
                });
            } else {
                http.get(`vision/${k}/articles/20210524`, {page}).then((res) => {
                    setRefreshing(false);
                    setData((prevData) => {
                        let _data = {...prevData};
                        _data[k] = res.result;
                        _data[k].page = page;
                        return _data;
                    });
                });
            }
        },
        [k]
    );
    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingVertical: px(6)}]}>
                {data?.[k]?.has_more ? (
                    <>
                        <ActivityIndicator size="small" animating={true} />
                        <Text style={{color: Colors.darkGrayColor, marginLeft: px(4)}}>正在加载...</Text>
                    </>
                ) : (
                    <Text style={{color: Colors.darkGrayColor, marginTop: px(4)}}>我们是有底线的...</Text>
                )}
            </View>
        );
    };
    return (
        <>
            <View style={{paddingTop: px(12), flex: 1}}>
                <FlatList
                    data={data?.[k]?.list}
                    style={{paddingHorizontal: px(16)}}
                    ListHeaderComponent={
                        data?.[k]?.notice ? (
                            <Text style={{fontSize: px(12), color: Colors.lightGrayColor, marginBottom: px(16)}}>
                                {data?.[k]?.notice}
                            </Text>
                        ) : null
                    }
                    ListFooterComponent={!refreshing && data?.[k]?.list?.length > 0 && ListFooterComponent}
                    renderItem={({item}) => {
                        return RenderCate(item, {marginBottom: px(12)});
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        // console.log(data?.[k]?.has_more);
                        data?.[k]?.has_more && getData('loadmore');
                    }}
                    refreshing={refreshing}
                    onRefresh={getData}
                />
            </View>
        </>
    );
};

export default CommonView;

const styles = StyleSheet.create();
