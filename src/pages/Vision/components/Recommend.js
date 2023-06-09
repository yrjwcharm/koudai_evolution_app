/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-30 14:31:38
 * @Description:推荐
 */
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
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
const Recommend = React.forwardRef((props, ref) => {
    const [recommendData, setRecommendData] = useState({});
    const visionData = useSelector((store) => store.vision).toJS();
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
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
    const tabRefresh = () => {
        global.LogTool('tabDoubleClick', 'recommend');
        scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
        setTimeout(() => {
            init('refresh');
        }, 200);
    };
    React.useImperativeHandle(ref, () => {
        return {
            tabRefresh,
        };
    });
    const init = useCallback(
        (type) => {
            type == 'refresh' && setRefreshing(true);
            if (type == 'refresh') {
                http.get('/vision/recommend/20210524').then((res) => {
                    setRecommendData(res.result.part1);
                });
            }
            http.get('/vision/recommend/20210524').then((res) => {
                dispatch(
                    updateVision({
                        recommend: res.result,
                    })
                );
                setRefreshing(false);
            });
        },
        [dispatch]
    );
    return Object.keys(recommendData).length > 0 ? (
        <ScrollView
            ref={scrollRef}
            key={1}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
            <View style={{padding: px(16), paddingTop: px(6)}}>
                <RecommendCard
                    style={{marginBottom: px(16)}}
                    data={recommendData}
                    onPress={() => {
                        global.LogTool('visionRecArticle', recommendData.id);
                    }}
                />
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
});

export default Recommend;
