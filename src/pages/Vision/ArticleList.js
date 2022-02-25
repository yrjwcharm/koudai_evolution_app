/*
 * @Date: 2022-02-16 15:14:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-25 14:04:38
 * @Description:更多文章列表
 */
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import http from '../../services';
import RenderCate from './components/RenderCate';
import {deviceWidth, px} from '../../utils/appUtil';
import {Colors, Style} from '../../common/commonStyle';
import _ from 'lodash';
const ArticleList = ({navigation, route}) => {
    const [data, setData] = useState();
    const [hasMore, setHasMore] = useState(false);
    const [refreshing, setRefreshing] = useState(true);
    const isloadMore = useRef(false);
    const [page, setPage] = useState(1);
    const init = useCallback(
        (status) => {
            if (status == 'loadmore') {
                isloadMore.current = true;
            }
            http.get('/vision/articles/20220215', {page, cate_id: route?.params?.id}).then((res) => {
                navigation.setOptions({title: res.result.title});
                setRefreshing(false);
                isloadMore.current = false;
                setHasMore(res.result.has_more);
                if (status === 'loadmore') {
                    setData((prevList) => [...prevList, ...(res.result.list || [])]);
                } else if (status === 'refresh') {
                    setData(res.result.list || []);
                }
            });
        },
        [page, navigation, route]
    );

    useEffect(() => {
        init(page == 1 ? 'refresh' : 'loadmore');
    }, [init, page]);
    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingBottom: px(18)}]}>
                {hasMore ? (
                    <>
                        <ActivityIndicator size="small" animating={true} />
                        <Text style={{color: Colors.darkGrayColor, marginLeft: px(4)}}>正在加载...</Text>
                    </>
                ) : data?.length >= 10 ? (
                    <Text style={{color: Colors.darkGrayColor, marginTop: px(4)}}>我们是有底线的...</Text>
                ) : null}
            </View>
        );
    };
    return (
        <View style={{flex: 1, borderWidth: 0.1, borderColor: '#fff'}}>
            <FlatList
                data={data}
                style={{paddingTop: px(10), paddingHorizontal: px(16)}}
                ListFooterComponent={data?.length > 0 && ListFooterComponent}
                renderItem={({item}) => {
                    return RenderCate(item, {marginBottom: px(12)});
                }}
                keyExtractor={(item, _index) => _index.toString()}
                onEndReachedThreshold={0.1}
                onEndReached={_.debounce(() => {
                    !isloadMore.current &&
                        hasMore &&
                        setPage((pre) => {
                            return pre + 1;
                        });
                }, 500)}
                refreshing={refreshing}
                onRefresh={() => {
                    // console.log(alert(refreshing));
                    setPage(1);
                    if (page == 1) init();
                }}
            />
        </View>
    );
};

export default ArticleList;

const styles = StyleSheet.create({});
