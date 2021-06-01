/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-01 14:54:21
 * @Description:推荐
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView, RefreshControl} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style, Space} from '../../../common/commonStyle';
import {px, deviceWidth} from '../../../utils/appUtil';
import {useJump} from '../../../components/hooks';
import FastImage from 'react-native-fast-image';
import BottomDesc from '../../../components/BottomDesc.js';
import RecommendCard from '../../../components/Article/RecommendCard';
import RenderCate from './RenderCate';
const Recommend = () => {
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        init();
    }, []);
    const init = () => {
        setRefreshing(true);
        http.get('/vision/recommend/20210524').then((res) => {
            setRefreshing(false);
            setData(res.result);
        });
    };
    const RenderTitle = (props) => {
        return (
            <View
                style={[
                    Style.flexBetween,
                    {
                        marginBottom: px(12),
                        marginTop: px(4),
                    },
                ]}>
                <Text style={styles.large_title}>{props.title}</Text>
                {props.more_text ? <Text style={Style.more}>{props.more_text}</Text> : null}
            </View>
        );
    };
    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
            <View style={{padding: px(16), paddingTop: px(12)}}>
                <RecommendCard style={{marginBottom: px(16)}} data={data.part1} />
                {data?.part2?.map((item, index) => {
                    return RenderCate(item, {marginBottom: px(12)});
                })}
                {data?.part3?.map((item) => {
                    return (
                        <>
                            <RenderTitle title={item.title} />
                            {item?.list?.map((_article, index) => {
                                return RenderCate(_article, {marginBottom: px(12)});
                            })}
                        </>
                    );
                })}
            </View>
            <BottomDesc />
        </ScrollView>
    );
};

export default Recommend;

const styles = StyleSheet.create({
    recommed_card: {
        borderRadius: px(8),
        backgroundColor: '#fff',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    recommend_title: {
        fontSize: px(17),
        lineHeight: px(26),
        fontWeight: '700',
    },
    large_title: {
        fontWeight: '700',
        fontSize: px(17),
        lineHeight: px(24),
        color: Colors.defaultColor,
    },
});
