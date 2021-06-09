/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-08 14:35:37
 * @Description:tab公共模块
 *
 */
import React, {useRef, useEffect, useCallback, useLayoutEffect} from 'react';
import {Text, View, FlatList, ActivityIndicator} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import EmptyTip from '../../../components/EmptyTip';
import RenderCate from './RenderCate.js';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../../redux/actions/visionData.js';
import _ from 'lodash';
const CommonView = ({k, scene, type}) => {
    const visionData = useSelector((store) => store.vision).toJS();
    const flatListRef = useRef(null);
    const dispatch = useDispatch();
    const key = scene == 'collect' ? type : k;
    const url = scene == 'collect' ? `/vision/${key}/list/20210524` : `/vision/${key}/articles/20210524`;
    useEffect(() => {
        getData();
    }, [getData]);
    useLayoutEffect(() => {
        dispatch(updateVision({flatListRef}));
    }, [dispatch]);
    const getData = useCallback(
        (_type) => {
            _type !== 'loadmore' && dispatch(updateVision({refreshing: true}));
            let page = 1;
            if (_type == 'loadmore') {
                page = visionData?.[key]?.page ? visionData?.[key]?.page + 1 : 2;
                http.get(url, {
                    page,
                }).then((res) => {
                    let _data = {...visionData};
                    let readList = _.reduce(
                        res?.result?.list,
                        (result, value) => {
                            value.view_status == 1 && result.push(value.id);
                            return result;
                        },
                        []
                    );
                    _data.readList = _.uniq(_data.readList.concat(readList));
                    _data[key] = {
                        has_more: res.result.has_more,
                        notice: res.result.notice,
                        list: _data[key]?.list.concat(res.result.list || []),
                        page,
                    };
                    dispatch(updateVision(_data));
                });
            } else {
                http.get(url, {
                    page,
                }).then((res) => {
                    let _data = {...visionData, refreshing: false};
                    let readList = _.reduce(
                        res?.result?.list,
                        (result, value) => {
                            value.view_status == 1 && result.push(value.id);
                            return result;
                        },
                        []
                    );
                    _data.readList = _.uniq(visionData.readList.concat(readList));
                    _data[key] = res.result;
                    _data[key].page = page;
                    dispatch(updateVision(_data));
                });
            }
        },
        [key, url, dispatch, visionData]
    );
    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingVertical: px(6)}]}>
                {visionData?.[key]?.has_more ? (
                    <>
                        <ActivityIndicator size="small" animating={true} />
                        <Text style={{color: Colors.darkGrayColor, marginLeft: px(4)}}>正在加载...</Text>
                    </>
                ) : visionData?.[key]?.list?.length >= 10 ? (
                    <Text style={{color: Colors.darkGrayColor, marginTop: px(4)}}>我们是有底线的...</Text>
                ) : null}
            </View>
        );
    };
    return (
        <>
            <View style={{flex: 1}}>
                <FlatList
                    data={visionData?.[key]?.list}
                    ref={flatListRef}
                    style={{paddingHorizontal: px(16)}}
                    ListHeaderComponent={
                        visionData?.[k]?.notice ? (
                            <Text style={{fontSize: px(12), color: Colors.lightGrayColor, marginBottom: px(16)}}>
                                {visionData?.[k]?.notice}
                            </Text>
                        ) : null
                    }
                    ListEmptyComponent={!visionData.refreshing && <EmptyTip />}
                    ListFooterComponent={
                        !visionData.refreshing && visionData?.[key]?.list?.length > 0 && ListFooterComponent
                    }
                    renderItem={({item}) => {
                        return RenderCate(item, {marginBottom: px(12)}, scene);
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        visionData?.[key]?.has_more && getData('loadmore');
                    }}
                    refreshing={visionData.refreshing}
                    onRefresh={getData}
                />
            </View>
        </>
    );
};

export default CommonView;
