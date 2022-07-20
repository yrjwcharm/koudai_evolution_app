/*
 * @Date: 2022-06-29 10:54:42
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-18 15:18:21
 * @Description: 胶囊ScrollTabbar
 */
import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Colors, Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const Index = (props) => {
    const {activeTab = 0, boxStyle = {}, goToPage, renderTab, tabs = [], unActiveStyle} = props;
    return (
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
});

export default Index;
