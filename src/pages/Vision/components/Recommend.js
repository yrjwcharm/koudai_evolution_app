/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-22 17:12:19
 * @Description:推荐
 */
import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import http from '../../../services/index.js';
import {px} from '../../../utils/appUtil';
import BottomDesc from '../../../components/BottomDesc.js';
import RecommendCard from '../../../components/Article/RecommendCard';
import RenderCate from './RenderCate';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../../redux/actions/visionData.js';
import _ from 'lodash';
import RenderTitle from './RenderTitle.js';
import {useFocusEffect} from '@react-navigation/native';
const Recommend = (props) => {
    const visionData = useSelector((store) => store.vision).toJS();
    const dispatch = useDispatch();
    const [recommendData, setRecommendData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        init();
    }, [init]);
    useFocusEffect(
        useCallback(() => {
            http.get('/vision/recommend/20210524').then((res) => {
                setRecommendData(res.result.part1);
            });
        }, [])
    );
    const init = useCallback(
        (type) => {
            type == 'refresh' && setRefreshing(true);
            http.get('/vision/recommend/20210524').then((res) => {
                let readList1 = _.reduce(
                    res?.result?.part2,
                    (result, value) => {
                        value.view_status == 1 && result.push(value.id);
                        return result;
                    },
                    []
                );
                let readList2 = [];
                for (var i = 0; i < res?.result?.part3?.length; i++) {
                    if (res?.result?.part3[i]?.list) {
                        for (var j = 0; j < res?.result?.part3[i]?.list.length; j++) {
                            if (res?.result?.part3[i].list[j].view_status == 1) {
                                readList2.push(res?.result?.part3[i].list[j].id);
                            }
                        }
                    }
                }
                dispatch(
                    updateVision({
                        recommend: res.result,
                        readList: _.uniq(visionData.readList.concat(readList1).concat(readList2)),
                    })
                );
                setRefreshing(false);
            });
        },
        [dispatch, visionData]
    );

    return Object.keys(visionData?.recommend).length > 0 ? (
        <ScrollView
            key={1}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
            <View style={{padding: px(16), paddingTop: px(8)}}>
                <RecommendCard style={{marginBottom: px(16)}} data={recommendData} />
                {visionData?.recommend?.part2?.map((item, index) => {
                    return RenderCate(item, {marginBottom: px(12)}, 'recommend');
                })}
                {visionData?.recommend?.part3?.map((item, index) => {
                    return (
                        <View key={index + 'i'}>
                            <RenderTitle
                                _key={index}
                                title={item.title}
                                more_text={item?.has_more ? '更多' : ''}
                                onPress={() => {
                                    global.visionTabChange(1);
                                }}
                            />

                            {item?.list?.map((_article, index) => {
                                return RenderCate(_article, {marginBottom: px(12)}, 'recommend');
                            })}
                        </View>
                    );
                })}
            </View>
            <BottomDesc />
        </ScrollView>
    ) : (
        <ActivityIndicator style={{marginTop: px(40)}} size="large" animating={true} />
    );
};

export default Recommend;
