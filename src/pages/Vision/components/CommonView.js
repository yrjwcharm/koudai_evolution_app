/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-01 19:35:55
 * @Description:tab公共模块
 *
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import EmptyTip from '../../../components/EmptyTip';
import RenderCate from './RenderCate.js';
const CommonView = ({k, scene, type}) => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const key = scene == 'collect' ? type : k;
    const url = scene == 'collect' ? `/vision/${key}/list/20210524` : `/vision/${key}/articles/20210524`;
    useEffect(() => {
        getData();
    }, [getData]);
    const getData = useCallback(
        (_type) => {
            _type !== 'loadmore' && setRefreshing(true);
            let page = 1;

            if (_type == 'loadmore') {
                setData((prev) => {
                    page = prev?.[k]?.page ? prev?.[k]?.page + 1 : 2;
                    http.get(url, {
                        page,
                    }).then((res) => {
                        setRefreshing(false);
                        setData((prevData) => {
                            let _data = {...prevData};
                            _data[key] = {
                                has_more: res.result.has_more,
                                notice: res.result.notice,
                                list: _data[key]?.list.concat(res.result.list || []),
                                page,
                            };
                            return _data;
                        });
                    });
                    return prev;
                });
            } else {
                http.get(url, {
                    page,
                }).then((res) => {
                    setRefreshing(false);
                    setData((prevData) => {
                        let _data = {...prevData};
                        _data[key] = res.result;
                        _data[key].page = page;
                        return _data;
                    });
                });
            }
        },
        [k, key, url]
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
                    data={data?.[key]?.list}
                    style={{paddingHorizontal: px(16)}}
                    ListHeaderComponent={
                        data?.[k]?.notice ? (
                            <Text style={{fontSize: px(12), color: Colors.lightGrayColor, marginBottom: px(16)}}>
                                {data?.[k]?.notice}
                            </Text>
                        ) : null
                    }
                    ListEmptyComponent={!refreshing && <EmptyTip />}
                    ListFooterComponent={!refreshing && data?.[k]?.list?.length > 0 && ListFooterComponent}
                    renderItem={({item}) => {
                        return RenderCate(item, {marginBottom: px(12)}, scene);
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
