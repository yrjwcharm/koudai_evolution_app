/*
 * @Date: 2021-06-01 19:39:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-02 14:19:09
 * @Description:专辑列表
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, FlatList, ActivityIndicator, View, TouchableOpacity} from 'react-native';
import http from '../../services';
import {px} from '../../utils/appUtil';
import {Colors, Style, Font} from '../../common/commonStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Praise from '../../components/Praise';
import {useJump} from '../../components/hooks';
const AlbumList = ({navigation, route}) => {
    const [list, setList] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const jump = useJump();
    const [refreshing, setRefreshing] = useState(false);
    const getData = useCallback(
        (type) => {
            type == 'refresh' && setRefreshing(true);
            http.get('/vision/album/articles/20210524', {page, album_id: route?.params?.album_id}).then((res) => {
                setRefreshing(false);
                setHasMore(res.result.has_more);
                navigation.setOptions({title: res.result.title});
                if (type === 'loadmore') {
                    setList((prevList) => [...prevList, ...(res.result.list || [])]);
                } else {
                    setList(res.result.list || []);
                }
            });
        },
        [navigation, route, page]
    );
    useEffect(() => {
        if (page === 1) {
            getData('refresh', true);
        } else {
            getData('loadmore');
        }
    }, [getData, page]);
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
    const renderItem = ({item}) => {
        return item?.is_latest ? (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.con}
                onPress={() => {
                    jump(item?.url);
                }}>
                <View style={[Style.flexRow, {flex: 1}]}>
                    <View>
                        <Text
                            numberOfLines={2}
                            style={[styles.title, {fontSize: px(15), lineHeight: px(24), height: px(48)}]}>
                            {item?.title}
                        </Text>
                        <View style={[Style.flexRowCenter, styles.play]}>
                            <Icon name="md-play-circle-outline" size={px(16)} color="#fff" />
                            <Text style={styles.play_text}>播放</Text>
                        </View>
                    </View>
                    {item?.cover ? (
                        <View style={styles.cover_con}>
                            <FastImage source={{uri: item?.cover}} style={styles.cover} />
                            <View style={[styles.media_duration, Style.flexRow]}>
                                <Icon name="md-play-circle-outline" size={px(16)} color="#fff" />

                                <Text style={styles.gray_text}>{item?.media_duration}</Text>
                            </View>
                        </View>
                    ) : null}
                </View>
                <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                    <Text style={styles.light_text}>{item?.view_num}人已收听</Text>

                    <Praise
                        type={'article'}
                        comment={{
                            favor_status: item?.favor_status,
                            favor_num: parseInt(item?.favor_num),
                            id: item?.id,
                        }}
                    />
                </View>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.con}
                onPress={() => {
                    jump(item?.url);
                }}>
                <Text numberOfLines={2} style={[styles.title]}>
                    {item?.title}
                </Text>
                <View style={[Style.flexBetween, {marginTop: px(8)}]}>
                    <Text style={styles.light_text}>{item?.view_num}人已收听</Text>
                    <View style={[Style.flexBetween, {width: px(100)}]}>
                        <View style={Style.flexRow}>
                            <Icon name="md-play-circle-outline" size={px(16)} color={Colors.lightBlackColor} />
                            <Text style={[styles.gray_text, {color: Colors.lightBlackColor}]}>
                                {item?.media_duration}
                            </Text>
                        </View>
                        <Praise
                            type={'article'}
                            comment={{
                                favor_status: item?.favor_status,
                                favor_num: parseInt(item?.favor_num),
                                id: item?.id,
                            }}
                        />
                    </View>
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
                ) : (
                    <Text style={{color: Colors.darkGrayColor, marginTop: px(4)}}>我们是有底线的...</Text>
                )}
            </View>
        );
    };
    return (
        <FlatList
            data={list}
            style={{paddingHorizontal: px(16), backgroundColor: '#fff'}}
            ListFooterComponent={!refreshing && list?.length > 0 && ListFooterComponent}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            refreshing={refreshing}
            onRefresh={getData}
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
        fontWeight: '700',
        color: Colors.defaultColor,
        fontSize: px(14),
        lineHeight: px(20),
        height: px(40),
    },
    play: {
        backgroundColor: Colors.btnColor,
        borderRadius: px(16),
        width: px(88),
        height: px(33),
        marginTop: px(24),
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
        top: 46,
        zIndex: 100,
        paddingHorizontal: px(10),
        paddingVertical: px(4),
        position: 'absolute',
        borderRadius: px(6),
        opacity: 0.8,
        left: px(20),
        backgroundColor: '#000000',
    },
    play_text: {fontSize: px(13), color: '#fff', marginLeft: px(2), fontWeight: '600'},
    light_text: {color: Colors.lightGrayColor, fontSize: px(12)},
    gray_text: {
        fontSize: px(12),
        color: '#fff',
        fontFamily: Font.numMedium,
        marginLeft: px(3),
    },
});
