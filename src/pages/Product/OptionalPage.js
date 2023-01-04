/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-11-03 11:15:18
 */
import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {useJump} from '~/components/hooks';
import ScrollableTabBar from '~/components/ScrollableTabBar';
import Toast from '~/components/Toast';
import {px} from '~/utils/appUtil';
import FollowTable from '../Attention/Index/FollowTable';
import HotFund from '../Attention/Index/HotFund';
import {followAdd} from '../Attention/Index/service';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {Colors, Style} from '~/common/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import LoadingTips from '~/components/LoadingTips';

const OptionalPage = ({
    scrollViewRef,
    refreshing,
    getFollowTabs,
    followTabs,
    optionalTabRef,
    getFollowData,
    followData,
}) => {
    const onChangeOptionalTab = (cur) => {
        const tabs = followTabs?.follow?.tabs;
        global.LogTool({event: tabs[cur.i].event_id});
        let item_type = tabs[cur.i]?.item_type;
        getFollowData({
            item_type,
        });
    };

    //一键关注
    const onFollow = async (params) => {
        let res = await followAdd(params);
        if (res.code == '000000') {
            getFollowTabs();
        }
        Toast.show(res.message);
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getFollowTabs(0)} />}
            style={{flex: 1}}>
            <View style={{paddingHorizontal: px(16), marginTop: px(8)}}>
                {followTabs?.follow?.tabs ? (
                    <ScrollableTabView
                        prerenderingSiblingsNumber={followTabs?.follow?.tabs?.length}
                        locked={true}
                        initialPage={followTabs?.follow?.init_selected}
                        renderTabBar={() => <ScrollableTabBar />}
                        onChangeTab={onChangeOptionalTab}
                        ref={optionalTabRef}>
                        {followTabs?.follow?.tabs?.map?.((tab, index) => {
                            const curTabs = followTabs?.follow?.tabs?.[optionalTabRef.current?.state?.currentPage];
                            return (
                                <View
                                    key={index + tab?.type_text}
                                    tabLabel={tab?.type_text}
                                    style={{marginTop: px(12)}}>
                                    {tab.item_type === 6 ? (
                                        <SpecialList data={followData} tabButton={curTabs?.button_list} />
                                    ) : (
                                        <FollowTable
                                            data={followData}
                                            activeTab={curTabs?.item_type || 0}
                                            handleSort={getFollowData}
                                            tabButton={curTabs?.button_list}
                                            notStickyHeader={true}
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </ScrollableTabView>
                ) : followTabs?.hot_fund ? (
                    <HotFund data={followTabs?.hot_fund || {}} onFollow={onFollow} />
                ) : null}
            </View>
        </ScrollView>
    );
};

export default OptionalPage;

const styles = StyleSheet.create({
    specialItem: {
        backgroundColor: '#fff',
        marginBottom: px(12),
        borderRadius: px(6),
        padding: px(12),
    },
    specialItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    specialItemText: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
        fontWeight: 'bold',
    },
    specialContent: {
        flexDirection: 'row',
        marginTop: px(6),
    },
    specialContentText: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#545968',
        flex: 1,
    },
});

const SpecialList = ({data, tabButton}) => {
    const jump = useJump();
    return data || tabButton ? (
        <View>
            {data?.items?.map?.((item, idx) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        global.LogTool({
                            event: 'optionalDetail',
                            oid: item?.url?.params?.params?.subject_id,
                            ctrl: '专题',
                        });
                        jump(item.url);
                    }}
                    key={idx}
                    style={styles.specialItem}>
                    <View style={styles.specialItemHeader}>
                        <Text style={styles.specialItemText}>{item.name}</Text>
                        <FontAwesome name={'angle-right'} size={18} color={'#545968'} />
                    </View>
                    <View style={styles.specialContent}>
                        <FastImage
                            source={{uri: item.desc_icon}}
                            style={{width: px(8), height: px(8), marginTop: px(3), marginRight: px(4)}}
                        />
                        <Text style={styles.specialContentText} numberOfLines={1}>
                            {item.desc}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
            {tabButton ? (
                <View style={[Style.flexRow, {backgroundColor: '#fff', borderRadius: px(6)}]}>
                    {tabButton?.map((btn, dex) => (
                        <TouchableOpacity
                            key={dex}
                            activeOpacity={0.9}
                            onPress={() => {
                                if (!data?.items?.[0] && btn.icon == 'EditSortFund') return;
                                global.LogTool({event: btn.event_id});
                                jump(btn.url);
                            }}
                            style={[Style.flexRow, {flex: 1, paddingVertical: px(14), justifyContent: 'center'}]}>
                            {btn.icon == 'FollowAddFund' ? (
                                <Feather size={px(16)} name={'plus-circle'} color={Colors.btnColor} />
                            ) : (
                                <FastImage
                                    style={{width: px(16), height: px(16)}}
                                    source={{
                                        uri: data?.items?.[0]
                                            ? 'https://static.licaimofang.com/wp-content/uploads/2022/10/edit-sort.png'
                                            : 'https://static.licaimofang.com/wp-content/uploads/2022/11/edit-sort-gray.png',
                                    }}
                                />
                            )}
                            <View style={{width: px(6)}} />
                            <Text
                                style={{
                                    color:
                                        !data?.items?.[0] && btn.icon == 'EditSortFund'
                                            ? Colors.lightGrayColor
                                            : Colors.btnColor,
                                    fontSize: px(12),
                                    lineHeight: px(17),
                                }}>
                                {btn.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : null}
        </View>
    ) : (
        <View style={{...Style.flexCenter, height: px(200)}}>
            <LoadingTips color="#ddd" />
        </View>
    );
};
