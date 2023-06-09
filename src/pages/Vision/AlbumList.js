/*
 * @Date: 2021-06-01 19:39:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-23 19:07:31
 * @Description:专辑列表
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, FlatList, ActivityIndicator, View, TouchableOpacity} from 'react-native';
import http from '../../services';
import {px} from '../../utils/appUtil';
import {Colors, Style, Font} from '../../common/commonStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {useJump} from '../../components/hooks';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../redux/actions/visionData';
import _ from 'lodash';
import {BoxShadow} from 'react-native-shadow';
const shadow = {
    color: '#0051CC',
    border: 10,
    radius: px(16),
    opacity: 0.2,
    x: 9,
    y: 3,
    width: px(70),
    height: px(33),
    style: {
        marginTop: px(24),
        marginBottom: px(6),
    },
};
const AlbumList = ({navigation, route}) => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const visionData = useSelector((store) => store.vision).toJS();
    const dispatch = useDispatch();
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);
    const getData = useCallback(
        (type, _page) => {
            http.get('/vision/album/articles/20210524', {page: _page || page, album_id: route?.params?.album_id}).then(
                (res) => {
                    setRefreshing(false);
                    navigation.setOptions({title: res.result.title});
                    let readList = _.reduce(
                        res?.result?.list,
                        (result, value) => {
                            value.view_status == 1 && result.push(value.id);
                            return result;
                        },
                        []
                    );
                    if (type === 'loadmore') {
                        dispatch(
                            updateVision({
                                albumList: visionData.albumList.concat(res.result.list || []),
                                albumListendList: _.uniq(visionData?.albumListendList.concat(readList)),
                            })
                        );
                    } else {
                        dispatch(
                            updateVision({
                                albumList: res.result.list || [],
                                albumListendList: readList,
                            })
                        );
                    }
                    setHasMore(res.result.has_more);
                }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigation, route, page]
    );

    // 上拉加载
    const onEndReached = useCallback(
        ({distanceFromEnd}) => {
            if (distanceFromEnd < 0) {
                return false;
            }
            if (hasMore) {
                setPage((p) => p + 1);
            }
        },
        [hasMore]
    );
    const renderItem = ({item, index}) => {
        return item?.is_latest ? (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.con}
                onPress={() => {
                    jump(item?.url);
                }}>
                <View style={[Style.flexRow, {flex: 1}]}>
                    <View style={{flex: 1}}>
                        <Text
                            numberOfLines={2}
                            style={[
                                styles.title,
                                {
                                    fontSize: px(15),
                                    lineHeight: px(24),
                                    height: px(48),
                                },
                            ]}>
                            {item?.title}
                        </Text>

                        <BoxShadow setting={shadow}>
                            <View style={[Style.flexRowCenter, styles.play]}>
                                <Icon name="md-play-circle-outline" size={px(16)} color="#fff" />
                                <Text style={styles.play_text}>播放</Text>
                            </View>
                        </BoxShadow>
                    </View>
                    {item?.cover ? (
                        <View style={styles.cover_con}>
                            <FastImage source={{uri: item?.cover}} style={styles.cover} />
                            <View style={[styles.media_duration, Style.flexRow]}>
                                <FastImage
                                    source={require('../../assets/img/vision/play.png')}
                                    style={{width: px(14), height: px(14)}}
                                />
                                <Text style={styles.duration_text}>{item?.media_duration}</Text>
                            </View>
                        </View>
                    ) : null}
                </View>
                <View style={[Style.flexRow, {marginTop: px(8)}]}>
                    {item?.tag_list?.map((_item, _index) => {
                        return (
                            <Text key={_index} style={[styles.light_text]} numberOfLines={1}>
                                {_item}
                            </Text>
                        );
                    })}
                </View>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.con}
                onPress={() => {
                    jump(item?.url);
                }}>
                <Text
                    numberOfLines={2}
                    style={[
                        styles.title,
                        {
                            color: visionData?.albumListendList?.includes(item.id)
                                ? Colors.lightBlackColor
                                : Colors.defaultColor,
                        },
                    ]}>
                    {item?.title}
                </Text>

                <View style={[Style.flexRow, {marginTop: px(8)}]}>
                    {item?.tag_list?.map((_item, _index) => {
                        return (
                            <Text key={_index} style={[styles.light_text]} numberOfLines={1}>
                                {_item}
                            </Text>
                        );
                    })}
                </View>
            </TouchableOpacity>
        );
    };
    const ListFooterComponent = () => {
        return (
            <View style={[Style.flexRowCenter, {paddingVertical: px(6)}]}>
                {hasMore ? (
                    <>
                        <ActivityIndicator size="small" animating={true} />
                        <Text style={{color: Colors.darkGrayColor, marginLeft: px(4)}}>正在加载...</Text>
                    </>
                ) : visionData.albumList?.length >= 10 ? (
                    <Text style={{color: Colors.darkGrayColor, marginTop: px(4)}}>我们是有底线的...</Text>
                ) : null}
            </View>
        );
    };
    useEffect(() => {
        if (page === 1) {
            getData('refresh');
        } else {
            getData('loadmore');
        }
    }, [getData, page]);
    return (
        <FlatList
            data={visionData.albumList}
            refreshing={refreshing}
            style={{paddingHorizontal: px(16), backgroundColor: '#fff'}}
            ListFooterComponent={!refreshing && visionData.albumList?.length > 0 && ListFooterComponent}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
            onRefresh={() => {
                if (page == 1) {
                    getData('refresh', 1);
                } else {
                    setPage(1);
                }
            }}
        />
    );
};

export default AlbumList;

const styles = StyleSheet.create({
    con: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.lineColor,
        paddingTop: px(16),
        paddingBottom: px(12),
    },
    title: {
        fontSize: px(14),
        lineHeight: px(20),
        height: px(40),
    },
    play: {
        backgroundColor: Colors.btnColor,
        borderRadius: px(16),
        width: px(88),
        height: px(33),
    },
    cover_con: {
        marginLeft: px(13),
    },
    cover: {
        height: px(106),
        width: px(106),
        borderRadius: px(6),
    },
    media_duration: {
        bottom: px(7),
        right: px(7),
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: px(2),
        paddingHorizontal: px(4),
        paddingVertical: px(4),
        position: 'absolute',
    },
    duration_text: {
        fontSize: px(12),
        color: '#fff',
        fontFamily: Font.numMedium,
        marginLeft: px(3),
    },
    play_text: {fontSize: px(13), color: '#fff', marginLeft: px(2), fontWeight: '600'},
    light_text: {color: Colors.lightGrayColor, fontSize: px(12), marginRight: px(4)},
    gray_text: {
        fontSize: px(12),
        color: '#fff',
        fontFamily: Font.numMedium,
        marginLeft: px(3),
    },
});
