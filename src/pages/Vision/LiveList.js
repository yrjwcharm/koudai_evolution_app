/*
 * @Date: 2022-02-16 15:14:36
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-17 17:21:41
 * @Description:直播列表
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import http from '../../services';
import {useJump} from '../../components/hooks';
import RenderCate from './components/RenderCate';
import {deviceWidth, px} from '../../utils/appUtil';
import {Colors} from '../../common/commonStyle';
import RenderTitle from './components/RenderTitle';
import LiveCard from '../../components/Article/LiveCard';

const LiveList = () => {
    const [data, setData] = useState();
    const [playBackList, setPlayBackList] = useState();
    const jump = useJump();
    const init = useCallback(() => {
        http.get('http://127.0.0.1:4523/mock2/587315/11748061').then((res) => {
            setData(res.result);
        });
    }, []);
    useEffect(() => {
        init();
    }, [init]);
    const _onScroll = (evt) => {
        const event = evt.nativeEvent;

        // 如果拖拽值超过底部50，且当前的scrollview高度大于屏幕高度，则加载更多
        const _num = event.contentSize.height - event.layoutMeasurement.height - event.contentOffset.y;

        if (event.contentSize.height > event.layoutMeasurement.height && _num < -50) {
            console.log('上拉，加载更多评论');
        }
    };
    return (
        <ScrollView
            style={{flex: 1, backgroundColor: Colors.bgColor, paddingHorizontal: px(16)}}
            scrollEventThrottle={200}
            onScroll={_onScroll}>
            {data?.part1?.items?.map((_article, index) => (
                <LiveCard
                    data={_article}
                    scene="largeLiveCard"
                    style={{marginBottom: px(12), width: '100%'}}
                    coverStyle={{height: px(190)}}
                    key={index}
                />
            ))}
            {data?.part3 ? (
                <>
                    <RenderTitle title={data?.part2?.title} sub_title={data?.part2?.sub_title} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {data?.part2?.items?.map((_article, index) => {
                            return RenderCate(_article, {
                                marginBottom: px(12),
                                marginRight: px(12),
                            });
                        })}
                    </ScrollView>
                </>
            ) : null}
            {data?.part3 ? (
                <>
                    <RenderTitle title={data?.part3?.title} sub_title={data?.part3?.sub_title} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                        {data?.part3?.items?.map((_article, index) => (
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
        </ScrollView>
    );
};

export default LiveList;

const styles = StyleSheet.create({});
