/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-08 14:36:34
 * @Description:推荐
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import http from '../../../services/index.js';
import {Colors} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import BottomDesc from '../../../components/BottomDesc.js';
import RecommendCard from '../../../components/Article/RecommendCard';
import RenderCate from './RenderCate';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../../redux/actions/visionData.js';
import _ from 'lodash';
import RenderTitle from './RenderTitle.js';
const Recommend = (props) => {
    const visionData = useSelector((store) => store.vision).toJS();
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const init = () => {
        setRefreshing(true);
        http.get('/vision/recommend/20210524').then((res) => {
            let readList = _.reduce(
                res?.result?.list,
                (result, value) => {
                    value.view_status == 1 && result.push(value.id);
                    return result;
                },
                []
            );
            dispatch(updateVision({readList: _.uniq(visionData.readList.concat(readList))}));
            setRefreshing(false);
            setData(res.result);
        });
    };

    return Object.keys(data).length > 0 ? (
        <ScrollView
            key={1}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
            <View style={{padding: px(16), paddingTop: 0}}>
                <RecommendCard style={{marginBottom: px(16)}} data={data.part1} />
                {data?.part2?.map((item, index) => {
                    return RenderCate(item, {marginBottom: px(12)}, 'recommend');
                })}
                {data?.part3?.map((item, index) => {
                    return (
                        <View key={index + 'i'}>
                            <RenderTitle
                                _key={index}
                                title={item.title}
                                more_text={'更多'}
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
