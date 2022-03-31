/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2022-02-16 15:14:36
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-03-31 15:48:25
 * @Description:直播列表
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import http from '../../services';
import RenderCate from './components/RenderCate';
import {deviceWidth, px} from '../../utils/appUtil';
import {Colors} from '../../common/commonStyle';
import RenderTitle from './components/RenderTitle';
import LiveCard from '../../components/Article/LiveCard';

const LiveList = () => {
    const [data, setData] = useState();
    const [playBackList, setPlayBackList] = useState();
    const [hasMore, setHasMore] = useState(true);
    const [showMoreLoading, setShowMoreLoading] = useState(false);
    const [page, setPage] = useState(1);
    const init = useCallback(() => {
        http.get('/live/index/202202015').then((res) => {
            setData(res.result);
        });
    }, []);
    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            setShowMoreLoading(true);
            http.get('/live/get_lived_list/202202015', {page}).then((res) => {
                setShowMoreLoading(false);
                setHasMore(res.result.has_more);
                if (page == 1) {
                    setPlayBackList(res.result.items);
                } else {
                    setPlayBackList((prevList) => [...prevList, ...(res.result.items || [])]);
                }
            });
        }, [page])
    );
    const _onScroll = (evt) => {
        if (!hasMore || showMoreLoading) return;
        const event = evt.nativeEvent;
        // 如果拖拽值超过底部50，且当前的scrollview高度大于屏幕高度，则加载更多
        const _num = event.contentSize.height - event.layoutMeasurement.height - event.contentOffset.y;
        if (event.contentSize.height > event.layoutMeasurement.height && _num <= 0) {
            setPage((pre) => {
                return pre + 1;
            });
        }
    };
    return (
        <ScrollView style={styles.con} scrollEventThrottle={200} onScroll={_onScroll}>
            {data?.part1?.items?.map((_article, index) => (
                <LiveCard
                    data={_article}
                    scene="largeLiveCard"
                    style={{marginBottom: px(12), width: '100%'}}
                    coverStyle={{height: px(190)}}
                    key={index}
                />
            ))}
            {data?.part2 ? (
                <>
                    <RenderTitle title={data?.part2?.title} sub_title={data?.part2?.sub_title} />
                    {data?.part2?.items?.length == 1 ? (
                        // 单场直播
                        <LiveCard data={data?.part2?.items[0]} style={{marginBottom: px(12), width: '100%'}} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {data?.part2?.items?.map((_article, index) => {
                                return RenderCate(_article, {
                                    marginBottom: px(12),
                                    marginRight: px(12),
                                });
                            })}
                        </ScrollView>
                    )}
                </>
            ) : null}
            {data?.part3 ? (
                <>
                    <RenderTitle title={data?.part3?.title} sub_title={data?.part3?.sub_title} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                        {playBackList?.map((_article, index) => (
                            <LiveCard
                                data={_article}
                                scene="smLiveCard"
                                style={{marginBottom: px(12), width: (deviceWidth - px(45)) / 2}}
                                coverStyle={{height: px(91)}}
                                key={index}
                            />
                        ))}
                    </View>
                </>
            ) : null}
            {playBackList?.length > 10 ? (
                <Text style={{textAlign: 'center'}}>{hasMore ? '努力加载中' : '我们是有底线的...'}</Text>
            ) : null}
        </ScrollView>
    );
};

export default LiveList;

const styles = StyleSheet.create({
    con: {flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16), borderColor: '#fff', borderWidth: 0.1},
});
