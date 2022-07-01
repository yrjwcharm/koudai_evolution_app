/*
 * @Date: 2022-06-21 17:54:17
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-30 10:04:00
 * @Description: 公募基金首页榜单渲染组件
 */
import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import CapsuleTabbar from '~/components/CapsuleTabbar';
import ProductCards from '~/components/Portfolios/ProductCards';
import {useJump} from '~/components/hooks';
import RenderCate from '~/pages/Vision/components/RenderCate';
import {deviceWidth, px} from '~/utils/appUtil';

export default ({data = {}, scene}) => {
    const jump = useJump();
    const {items = [], more = '', sub_title = '', tab_list: tabs = [], title = ''} = data;

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            {title ? (
                <View style={[styles.rowEnd, {justifyContent: 'space-between'}]}>
                    <View style={styles.rowEnd}>
                        <Text style={styles.title}>{title}</Text>
                        {sub_title ? <Text style={styles.sub_title}>{sub_title}</Text> : null}
                    </View>
                    {more?.text ? (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => jump(more.url)} style={Style.flexRow}>
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
                    // onChangeTab={(value) => console.log(value)}
                    prerenderingSiblingsNumber={Infinity}
                    renderTabBar={() => <CapsuleTabbar boxStyle={styles.tabsContainer} />}>
                    {tabs.map((tab) => {
                        const {items: tabItems = [], rank_type, title: tabTitle} = tab;
                        return (
                            <View key={rank_type} tabLabel={tabTitle}>
                                {tabItems.map((item, index) => (
                                    <ProductCards
                                        data={item}
                                        key={index}
                                        style={index === 0 ? {marginTop: px(8)} : {}}
                                    />
                                ))}
                            </View>
                        );
                    })}
                </ScrollableTabView>
            ) : (
                items.map((item, index) => (
                    <ProductCards data={item} key={index} style={index === 0 ? {marginTop: px(8)} : {}} />
                ))
            )}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        marginTop: Space.marginVertical,
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
