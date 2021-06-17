/*
 * @Author: xjh
 * @Date: 2021-02-20 11:43:41
 * @Description:交易通知和活动通知
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-17 16:29:55
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, isIphoneX, px, deviceWidth} from '../../utils/appUtil';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import {useJump} from '../../components/hooks';
import Empty from '../../components/EmptyTip';
import _ from 'lodash';
export default function MessageNotice({navigation, route}) {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState();
    const jump = useJump();
    const [showEmpty, setShowEmpty] = useState(false);

    useEffect(() => {
        if (page === 1) {
            init('refresh', true);
        } else {
            init('loadmore');
        }
    }, [page, init]);
    useEffect(() => {
        if (title) {
            navigation.setOptions({
                title,
                headerRight: () => {
                    return list?.length > 0 ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Style.flexCenter, styles.topRightBtn]}
                            onPress={() => readInterface('', 'all')}>
                            <Text style={styles.right_sty}>{'全部已读'}</Text>
                        </TouchableOpacity>
                    ) : null;
                },
            });
        }
    }, [list, navigation, readInterface, title]);

    const init = useCallback(
        (status, first) => {
            Http.get('/mapi/message/list/20210101', {
                type: route.params.type,
                page,
            }).then((res) => {
                setShowEmpty(true);
                if (res.code === '000000') {
                    setRefreshing(false);
                    setHasMore(res.result.has_more);
                    setType(res.result.message_type);
                    first && setTitle(res.result.title);
                    if (status === 'refresh') {
                        if (!res.result.messages) {
                            setList([]);
                        } else {
                            setList(res.result.messages);
                        }
                    } else if (status === 'loadmore') {
                        setList((prevList) => prevList.concat(res.result.messages));
                    }
                }
            });
        },
        [route, page]
    );

    // 下拉刷新
    const onRefresh = useCallback(() => {
        if (page === 1) {
            init('refresh', true);
        } else {
            setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
    // 渲染底部
    const renderFooter = useCallback(() => {
        return (
            <>
                {list.length > 0 && (
                    <Text
                        style={{
                            textAlign: 'center',
                            marginTop: text(12),
                            fontSize: Font.textH3,
                            color: Colors.darkGrayColor,
                            paddingBottom: isIphoneX() ? 34 : px(16),
                        }}>
                        {hasMore ? '正在加载...' : list.length >= 10 ? '我们是有底线的...' : ''}
                    </Text>
                )}
            </>
        );
    }, [hasMore, list]);
    // 已读接口
    const readInterface = useCallback(
        (id, _type, url, read, index) => {
            // is_read==0没读

            if (read) {
                jump(url);
                return;
            }
            let _params;
            if (_type) {
                _params = {type};
            } else {
                _params = {id};
            }
            Http.get('/message/read/20210101', _params).then((res) => {
                if (res.code === '000000') {
                    if (_type == 'all') {
                        setList((prev) => {
                            const _listAll = _.cloneDeep(prev);
                            _listAll.forEach((item) => {
                                item.is_read = 1;
                            });
                            return _listAll;
                        });
                    } else {
                        setList((prev) => {
                            const _list = _.cloneDeep(prev);
                            _list[index].is_read = 1;
                            return _list;
                        });
                        setTimeout(() => {
                            jump(url);
                        });
                    }
                }
            });
        },
        [jump, type]
    );
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <View>
                {item?.content_type == 0 && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.card_sty}
                        onPress={() => readInterface(item.id, '', item.jump_url, item?.is_read, index)}>
                        <View style={Style.flexBetween}>
                            <Text
                                style={[styles.title_sty, item?.is_read == 1 ? {color: '#9AA1B2'} : {}]}
                                numberOfLines={2}>
                                {item.title}
                            </Text>
                            <Text
                                style={[
                                    styles.time_Sty,
                                    item?.is_read == 1 ? {color: '#9AA1B2'} : {},
                                    {alignSelf: 'flex-start'},
                                ]}>
                                {item.post_time}
                            </Text>
                        </View>
                        <View style={[Style.flexBetween, {marginTop: text(12)}]}>
                            <Text
                                numberOfLines={6}
                                style={[styles.content_sty, item?.is_read == 1 ? {color: '#9AA1B2'} : {}]}>
                                {item.content}
                            </Text>
                            {item.jump_url ? <AntDesign name={'right'} size={12} color={'#8F95A7'} /> : null}
                        </View>
                    </TouchableOpacity>
                )}
                {item?.content_type == 1 && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.card_sty, {padding: 0}]}
                        onPress={() => readInterface(item.id, '', item.jump_url, item?.is_read, index)}>
                        <View
                            style={{
                                borderTopLeftRadius: text(10),
                                borderTopRightRadius: text(10),
                                overflow: 'hidden',
                            }}>
                            <FastImage source={{uri: item.img_url}} style={styles.cover_img} />
                        </View>
                        <View style={styles.content_wrap_sty}>
                            <View style={{flex: 1}}>
                                <Text
                                    numberOfLines={2}
                                    style={[
                                        styles.card_title,
                                        {color: item?.is_read == 1 ? '#9AA1B2' : Colors.defaultColor},
                                    ]}>
                                    {item.title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: Font.textH3,
                                        color: item?.is_read == 1 ? '#9AA1B2' : '#9AA1B2',
                                    }}>
                                    {item.post_time}
                                </Text>
                            </View>
                            {item.jump_url ? <AntDesign name={'right'} size={12} color={'#8F95A7'} /> : null}
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <FlatList
            data={list}
            initialNumToRender={10}
            ListEmptyComponent={showEmpty ? <Empty text={'暂无数据'} /> : null}
            keyExtractor={(item, index) => item + index}
            ListFooterComponent={renderFooter}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={renderItem}
            style={{backgroundColor: Colors.bgColor}}
            extraData={list}
        />
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topRightBtn: {
        flex: 1,
        width: text(64),
        marginRight: text(14),
    },
    right_sty: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    card_sty: {
        backgroundColor: '#fff',
        padding: text(16),
        borderRadius: text(10),
        marginTop: text(16),
        marginHorizontal: text(16),
    },
    title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontFamily: Font.numFontFamily,
        flex: 1,
        marginRight: text(12),
    },
    time_Sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
        marginTop: text(4),
    },
    content_sty: {
        color: '#545968',
        lineHeight: text(18),
        flex: 1,
        textAlign: 'justify',
        marginRight: px(16),
    },
    content_wrap_sty: {
        margin: text(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cover_img: {
        borderTopLeftRadius: text(10),
        borderTopRightRadius: text(10),
        height: text(144),
        width: deviceWidth - text(32),
    },
    card_title: {
        flex: 1,
        fontSize: text(16),
        fontWeight: 'bold',
        lineHeight: text(22),
        marginBottom: text(10),
    },
});
