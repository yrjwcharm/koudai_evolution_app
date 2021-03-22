/*
 * @Author: xjh
 * @Date: 2021-02-20 11:43:41
 * @Description:交易通知和活动通知
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-22 21:13:24
 */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Header from '../../components/NavBar';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FitImage from 'react-native-fit-image';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import _ from 'lodash';
var _type;
export default function MessageNotice({navigation, route}) {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [title, setTitle] = useState('');
    const jump = useJump();
    useFocusEffect(
        useCallback(() => {
            if (page === 1) {
                init('refresh', true);
            } else {
                init('loadmore');
            }
        }, [page, init])
    );
    const init = useCallback(
        (status, first) => {
            Http.get('/mapi/message/list/20210101', {
                type: route.params.type,
                page,
            }).then((res) => {
                if (res.code === '000000') {
                    setRefreshing(false);
                    setHasMore(res.result.has_more);
                    first && setTitle(res.result.title);
                    _type = res.result.message_type;
                    if (status === 'refresh') {
                        setList(res.result.messages);
                    } else if (status === 'loadmore') {
                        setList((prevList) => [...prevList, ...res.result.messages]);
                    }
                }
            });
        },
        [route, page]
    );

    // 下拉刷新
    const onRefresh = useCallback(() => {
        setPage(1);
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
                    <Text style={{textAlign: 'center', marginTop: text(12)}}>
                        {hasMore ? '正在加载...' : '暂无更多了'}
                    </Text>
                )}
            </>
        );
    }, [hasMore, list]);
    // 已读接口
    const readInterface = (id, type, url, read, index) => {
        // is_read==0没读
        if (!url) {
            if (read) {
                return;
            }
            let _params;
            if (type) {
                _params = {type: _type};
            } else {
                _params = {id};
            }
            Http.get('/message/read/20210101', {..._params}).then((res) => {
                if (res.code === '000000') {
                    if (type == 'all') {
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
                    }
                }
            });
        } else {
            jump(url);
        }
    };
    // 渲染列表项
    const renderItem = ({item, index}) => {
        return (
            <View>
                {item.content_type == 0 && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.card_sty}
                        onPress={() => readInterface(item.id, '', item.jump_url, item.is_read, index)}>
                        <View style={Style.flexBetween}>
                            <Text style={[styles.title_sty, item.is_read == 1 ? {color: '#9AA1B2'} : {}]}>
                                {item.title}
                            </Text>
                            <Text style={[styles.time_Sty, item.is_read == 1 ? {color: '#9AA1B2'} : {}]}>
                                {item.post_time}
                            </Text>
                        </View>
                        <View style={[Style.flexBetween, {marginTop: text(12)}]}>
                            <Text style={[styles.content_sty, item.is_read == 1 ? {color: '#9AA1B2'} : {}]}>
                                {item.content}
                            </Text>
                            <AntDesign name={'right'} size={12} color={'#8F95A7'} />
                        </View>
                    </TouchableOpacity>
                )}
                {item.content_type == 1 && (
                    <TouchableOpacity
                        style={[styles.card_sty, {paddingBottom: 0}]}
                        onPress={() => readInterface(item.id, '', item.jump_url, item.is_read, index)}>
                        <View
                            style={{
                                borderTopLeftRadius: text(10),
                                borderTopRightRadius: text(10),
                                overflow: 'hidden',
                            }}>
                            <FitImage
                                source={{uri: item.img_url}}
                                resizeMode="contain"
                                style={{borderTopLeftRadius: text(10), borderTopRightRadius: text(10)}}
                            />
                        </View>
                        <View style={styles.content_wrap_sty}>
                            <View style={styles.content_ac_sty}>
                                <Text
                                    style={[
                                        {flex: 1, fontSize: text(16), fontWeight: 'bold'},
                                        {color: item.is_read == 1 ? '#9AA1B2' : ''},
                                    ]}>
                                    {item.title}
                                </Text>
                                <AntDesign name={'right'} color={'#8F95A7'} />
                            </View>
                            <Text
                                style={{
                                    fontSize: Font.textH3,
                                    color: item.is_read == 1 ? '#9AA1B2' : '#9AA1B2',
                                }}>
                                {item.post_time}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <>
            <Header
                title={title}
                leftIcon="chevron-left"
                rightText={Object.keys(list).length > 0 ? '全部已读' : ''}
                rightPress={() => readInterface('', 'all')}
                rightTextStyle={styles.right_sty}
            />
            <FlatList
                data={list}
                initialNumToRender={10}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={renderFooter}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={renderItem}
                style={{marginBottom: isIphoneX() ? 34 : Space.marginVertical, backgroundColor: Colors.bgColor}}
                extraData={list}
            />
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card_sty: {
        backgroundColor: '#fff',
        padding: text(16),
        borderRadius: text(10),
        marginTop: text(16),
        marginHorizontal: text(16),
    },
    title_sty: {
        color: '#000000',
        fontSize: Font.textH1,
        fontFamily: Font.numFontFamily,
    },
    time_Sty: {
        color: '#9AA1B2',
        fontSize: Font.textH3,
    },
    content_sty: {
        color: '#545968',
        lineHeight: text(18),
        marginRight: text(10),
    },
    content_wrap_sty: {
        margin: text(16),
    },
    content_ac_sty: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: text(10),
    },
});
