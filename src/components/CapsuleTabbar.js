/*
 * @Date: 2022-06-29 10:54:42
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-18 15:18:21
 * @Description: 胶囊ScrollTabbar
 */
import React from 'react';
import {ScrollView, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Colors, Font, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {useJump} from './hooks';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Index = (props) => {
    const {activeTab = 0, boxStyle = {}, goToPage, renderTab, tabs = [], unActiveStyle, tab_list} = props;
    const jump = useJump();
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false} style={boxStyle}>
                {tabs.map((name, page) => {
                    const isTabActive = activeTab === page;
                    if (renderTab) {
                        return renderTab(name, page, isTabActive, goToPage);
                    }
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={isTabActive}
                            key={name}
                            onPress={() => goToPage(page)}
                            style={[
                                styles.tabBox,
                                // index === tabs.length - 1 ? {marginRight: 2 * Space.marginAlign} : {},
                                isTabActive ? {backgroundColor: '#DEE8FF'} : unActiveStyle,
                            ]}>
                            <Text style={[styles.tabText, isTabActive ? styles.activeText : {}]}>{name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            {tab_list?.[activeTab]?.more ? (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        jump(tab_list?.[activeTab]?.more.url);
                    }}
                    style={[Style.flexRow, {marginTop: px(8)}]}>
                    <Text style={styles.moreText}>{tab_list?.[activeTab]?.more.text}</Text>
                    <FontAwesome color={Colors.brandColor} name={'angle-right'} size={16} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
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
    moreText: {
        marginRight: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
});

export default Index;
