/*
 * @Date: 2022-06-21 17:54:17
 * @Description: 公募基金首页榜单渲染组件
 */
import React, {useRef} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import CapsuleTabbar from '~/components/CapsuleTabbar';
import Empty from '~/components/EmptyTip';
import ProductCards from '~/components/Portfolios/ProductCards';
import {useJump} from '~/components/hooks';
import RenderCate from '~/pages/Vision/components/RenderCate';
import {deviceWidth, px} from '~/utils/appUtil';

export default ({data = {}, scene, onLayout, pointKey, tabsStyle = {}, HeaderRight}) => {
    const jump = useJump();
    const {items = [], more = '', sub_title = '', tab_list: tabs = [], title = ''} = data;
    const pageRef = useRef(0);

    return Object.keys(data).length > 0 ? (
        <View
            style={styles.container}
            onLayout={(e) => {
                onLayout?.(e.nativeEvent.layout);
            }}>
            {title ? (
                <View style={[styles.rowEnd, {justifyContent: 'space-between'}]}>
                    <View style={styles.rowEnd}>
                        <Text style={styles.title}>{title}</Text>
                        {sub_title ? <Text style={styles.sub_title}>{sub_title}</Text> : null}
                    </View>
                    {HeaderRight && <HeaderRight />}
                    {more?.text ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                if (more.url.params) {
                                    more.url.params.initialPage = pageRef.current;
                                } else {
                                    more.url.params = {initialPage: pageRef.current};
                                }
                                jump(more.url);
                            }}
                            style={Style.flexRow}>
                            <Text style={styles.moreText}>{more.text}</Text>
                            <FontAwesome color={Colors.brandColor} name={'angle-right'} size={16} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            ) : null}
            {scene === 'live' ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveContainer}>
                    <View style={[Style.flexRow, {marginLeft: Space.marginAlign}]}>
                        {items.map((_article) => {
                            return RenderCate(_article, {
                                marginRight: px(12),
                            });
                        })}
                    </View>
                </ScrollView>
            ) : tabs?.length > 0 ? (
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={(value) => {
                        pageRef.current = value.i;
                        pointKey && global.LogTool({ctrl: value.i + 1, event: pointKey});
                        const {items: list, plateid, rank_type, rec_json} = tabs[value.i];
                        if (plateid && rec_json) {
                            global.LogTool({event: 'rec_show', plateid, rec_json});
                        } else {
                            global.LogTool({
                                event: 'top_show',
                                ctrl: rank_type,
                                oid: list.map((item) => item.code).join(','),
                            });
                        }
                    }}
                    prerenderingSiblingsNumber={Infinity}
                    renderTabBar={() => <CapsuleTabbar boxStyle={[styles.tabsContainer, tabsStyle]} tab_list={tabs} />}
                    style={{flex: 1}}>
                    {tabs.map((tab) => {
                        const {items: tabItems = [], plateid, rank_type, rec_json, title: tabTitle} = tab;
                        return (
                            <View key={rank_type} tabLabel={tabTitle}>
                                {tabItems?.length > 0 ? (
                                    tabItems.map((item, index) => (
                                        <ProductCards
                                            data={{
                                                ...item,
                                                LogTool: () => {
                                                    if (plateid && rec_json) {
                                                        global.LogTool({
                                                            event: 'rec_click',
                                                            oid: item.code,
                                                            plateid,
                                                            rec_json,
                                                        });
                                                    } else {
                                                        global.LogTool({
                                                            event: 'top_click',
                                                            ctrl: rank_type,
                                                            oid: item.code,
                                                        });
                                                    }
                                                },
                                            }}
                                            key={index}
                                            style={index === 0 ? {marginTop: px(8)} : {}}
                                        />
                                    ))
                                ) : (
                                    <Empty text={'暂无基金数据'} />
                                )}
                            </View>
                        );
                    })}
                </ScrollableTabView>
            ) : (
                items.map((item, index) => (
                    <ProductCards
                        data={{
                            ...item,
                            LogTool: () => {
                                const {plateid, rec_json} = data;
                                if (plateid && rec_json) {
                                    global.LogTool({event: 'rec_click', oid: item.code, plateid, rec_json});
                                } else {
                                    global.LogTool({
                                        event: 'top_click',
                                        ctrl: title,
                                        oid: item.code,
                                    });
                                }
                            },
                        }}
                        key={index}
                        style={index === 0 ? {marginTop: px(8)} : {}}
                    />
                ))
            )}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        marginTop: Space.marginVertical,
        flex: 1,
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: px(18),
        lineHeight: px(25),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    sub_title: {
        marginBottom: px(2),
        marginLeft: px(8),
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.descColor,
    },
    moreText: {
        marginRight: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
    tabsContainer: {
        marginTop: px(8),
        marginLeft: -Space.marginAlign,
        paddingHorizontal: Space.padding,
        width: deviceWidth,
    },
    liveContainer: {
        marginTop: px(12),
        marginLeft: -Space.marginAlign,
        width: deviceWidth,
    },
});
