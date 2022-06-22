/*
 * @Date: 2022-06-21 17:54:17
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-22 12:05:50
 * @Description: 公募基金首页榜单渲染组件
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import ProductCards from '~/components/Portfolios/ProductCards';
import {useJump} from '~/components/hooks';
import {deviceWidth, px} from '~/utils/appUtil';

export default ({data = {}}) => {
    const jump = useJump();
    const {items = [], more = '', sub_title = '', tabs = [], title = ''} = data;
    const [activeTab, setTab] = useState();

    useEffect(() => {
        if (tabs.length > 0) {
            setTab(tabs[0].key);
        }
    }, [tabs]);

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
            {tabs?.length > 0 && (
                <ScrollView
                    bounces={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}>
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={activeTab === tab.key}
                            key={tab.key}
                            onPress={() => setTab(tab.key)}
                            style={[
                                styles.tabBox,
                                // index === tabs.length - 1 ? {marginRight: 2 * Space.marginAlign} : {},
                                activeTab === tab.key ? {backgroundColor: '#DEE8FF'} : {},
                            ]}>
                            <Text style={[styles.tabText, activeTab === tab.key ? styles.activeText : {}]}>
                                {tab.value}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            {items.map((item, index) => (
                <ProductCards data={item} key={index} style={index === 0 ? {marginTop: px(8)} : {}} />
            ))}
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
    tabBox: {
        marginRight: px(12),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(20),
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.defaultColor,
    },
    activeText: {
        color: Colors.brandColor,
        fontWeight: Font.weightMedium,
    },
});
