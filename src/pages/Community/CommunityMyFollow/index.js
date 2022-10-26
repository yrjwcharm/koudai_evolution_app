/*
 * @Date: 2022-10-18 10:50:00
 * @Description: 我的关注/我的粉丝
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import EmptyTip from '~/components/EmptyTip';
import {useJump} from '~/components/hooks';
import HTML from '~/components/RenderHtml';
import TabBar from '~/components/TabBar';
import Toast from '~/components/Toast';
import withPageLoading from '~/components/withPageLoading';
import {px} from '~/utils/appUtil';
import {getData} from './services';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {debounce, clone} from 'lodash';

const List = withPageLoading(
    ({setLoading, user_type}) => {
        const jump = useJump();
        const [refreshing, setRefreshing] = useState(true);
        const [data, setData] = useState([]);
        const [page, setPage] = useState(1);
        const [hasMore, setHasMore] = useState(true);
        const [total, setTotal] = useState(0);

        const init = () => {
            getData({page, user_type})
                .then((res) => {
                    if (res.code === '000000') {
                        const {has_more, list, total_count} = res.result;
                        setData((prev) => {
                            if (page === 1) {
                                return list;
                            } else {
                                return prev.concat(list);
                            }
                        });
                        setHasMore(has_more);
                        setTotal(total_count);
                    }
                })
                .finally(() => {
                    setRefreshing(false);
                    setLoading(false);
                });
        };

        /** @name 关注/取消关注 */
        const onFollow = useCallback(
            debounce(
                ({index, isFollowed, item_id, item_type}) => {
                    (isFollowed ? followCancel : followAdd)({item_id, item_type}).then((res) => {
                        res.message && Toast.show(res.message);
                        if (res.code === '000000') {
                            setData((prev) => {
                                const next = clone(prev);
                                next[index].status = isFollowed ? 2 : 1;
                                return next;
                            });
                            setTotal((prev) => (isFollowed ? prev - 1 : prev + 1));
                        }
                    });
                },
                500,
                {leading: true, trailing: false}
            ),
            []
        );

        /** @name 上拉加载 */
        const onEndReached = ({distanceFromEnd}) => {
            if (distanceFromEnd < 0) {
                return false;
            }
            if (hasMore) {
                setPage((p) => p + 1);
            }
        };

        /** @name 渲染头部 */
        const renderHeader = () => {
            return (
                <Text style={[styles.desc, {marginTop: Space.marginVertical}]}>
                    共{total}个{user_type === 1 ? '粉丝' : '关注'}
                </Text>
            );
        };

        const renderItem = ({item, index}) => {
            const {avatar, count_str, item_id, item_type, name, status, url} = item;
            const isFollowed = status === 1;
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={item_id}
                    onPress={() => jump(url)}
                    style={[Style.flexBetween, styles.recommendItem]}>
                    <View style={Style.flexRow}>
                        <Image
                            source={{
                                uri: avatar,
                            }}
                            style={styles.authorAvatar}
                        />
                        <View style={{maxWidth: px(180)}}>
                            <Text numberOfLines={1} style={styles.subTitle}>
                                {name}
                            </Text>
                            <View style={{marginTop: px(2)}}>
                                <HTML numberOfLines={1} html={count_str} style={styles.smText} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onFollow({index, isFollowed, item_id, item_type})}
                        style={[
                            styles.followBtn,
                            {
                                borderColor: isFollowed ? Colors.placeholderColor : Colors.brandColor,
                            },
                        ]}>
                        <Text
                            style={[
                                styles.desc,
                                {
                                    color: isFollowed ? Colors.placeholderColor : Colors.brandColor,
                                },
                            ]}>
                            {isFollowed ? '已关注' : user_type === 1 ? '回关' : '+关注'}
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        };

        /** @name 渲染底部 */
        const renderFooter = () => {
            return data?.length > 0 ? (
                <Text style={[styles.desc, {paddingVertical: Space.padding, textAlign: 'center'}]}>
                    {hasMore ? '正在加载...' : '我们是有底线的...'}
                </Text>
            ) : null;
        };

        useEffect(() => {
            init();
        }, [page]);

        return (
            <FlatList
                data={data}
                initialNumToRender={20}
                keyExtractor={({item_id, name}, index) => `${name}${item_id}${index}`}
                ListEmptyComponent={() => <EmptyTip text={`暂无${user_type === 1 ? '粉丝' : '关注'}`} />}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderHeader}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.99}
                onRefresh={() => (page > 1 ? setPage(1) : init())}
                renderItem={renderItem}
                refreshing={refreshing}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1, paddingHorizontal: Space.padding}}
            />
        );
    },
    {style: {borderTopWidth: 0}}
);

const Index = ({navigation, route}) => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        navigation.setOptions({title: `我的${active === 0 ? '关注' : '粉丝'}`});
    }, [active]);

    return (
        <ScrollableTabView
            onChangeTab={({i}) => setActive(i)}
            renderTabBar={() => (
                <TabBar
                    activeFontSize={Font.textH2}
                    btnColor={Colors.defaultColor}
                    inActiveColor={Colors.descColor}
                    inActiveFontSize={Font.textH3}
                    style={{borderBottomWidth: 0}}
                />
            )}
            style={styles.container}>
            <View style={{flex: 1}} tabLabel="关注">
                <List user_type={2} />
            </View>
            <View style={{flex: 1}} tabLabel="粉丝">
                <List user_type={1} />
            </View>
        </ScrollableTabView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    subTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    smText: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.descColor,
    },
    desc: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    recommendItem: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    authorAvatar: {
        marginRight: px(6),
        borderRadius: px(32),
        width: px(32),
        height: px(32),
    },
    followBtn: {
        paddingVertical: px(3),
        paddingHorizontal: px(14),
        borderRadius: px(30),
        borderWidth: Space.borderWidth,
    },
});

export default Index;
