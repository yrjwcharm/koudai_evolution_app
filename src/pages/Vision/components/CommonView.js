/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-09 14:13:06
 * @Description:tab公共模块
 *
 */
import React, {useRef, useEffect, useCallback} from 'react';
import {Text, View, FlatList, ActivityIndicator} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import EmptyTip from '../../../components/EmptyTip';
import RenderCate from './RenderCate.js';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../../redux/actions/visionData.js';
import _ from 'lodash';
const CommonView = React.forwardRef(({k, scene, type}, ref) => {
    const visionData = useSelector((store) => store.vision).toJS();
    const dispatch = useDispatch();
    const key = scene == 'collect' ? type : k;
    useEffect(() => {
        getData();
    }, [getData]);
    const tabRefresh = (_key) => {
        global.LogTool('tabDoubleClick', _key);
        visionData[_key + '1']?.scrollToOffset({offset: 0, animated: false});
        setTimeout(() => {
            getData('', _key);
        }, 200);
    };

    React.useImperativeHandle(ref, () => {
        return {
            tabRefresh,
        };
    });

    const getData = useCallback(
        (_type, _key = key) => {
            _type !== 'loadmore' && dispatch(updateVision({refreshing: true}));
            let page = 1;
            if (_type == 'loadmore') {
                page = visionData?.[_key]?.page ? visionData?.[_key]?.page + 1 : 2;
                http.get(scene == 'collect' ? `/vision/${key}/list/20210524` : `/vision/${_key}/articles/20210524`, {
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
                    _data[_key] = {
                        has_more: res.result.has_more,
                        notice: res.result.notice,
                        list: _data[_key]?.list.concat(res.result.list || []),
                        page,
                    };
                    dispatch(updateVision(_data));
                });
            } else {
                http.get(scene == 'collect' ? `/vision/${key}/list/20210524` : `/vision/${_key}/articles/20210524`, {
                    page,
                }).then((res) => {
                    dispatch(updateVision({refreshing: false}));
                    let _data = {...visionData};
                    let readList = _.reduce(
                        res?.result?.list,
                        (result, value) => {
                            value.view_status == 1 && result.push(value.id);
                            return result;
                        },
                        []
                    );
                    _data.readList = _.uniq(visionData.readList.concat(readList));
                    _data[_key] = res.result;
                    _data[_key].page = page;
                    dispatch(updateVision(_data));
                });
            }
        },
        [key, dispatch, visionData, scene]
    );
    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingBottom: px(18)}]}>
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
                    ref={(dom) => {
                        dom && dispatch(updateVision({[key + '1']: dom}));
                    }}
                    data={visionData?.[key]?.list}
                    style={{paddingHorizontal: px(16), paddingTop: px(10)}}
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
                    keyExtractor={(item, _index) => _index.toString()}
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
});

export default CommonView;
