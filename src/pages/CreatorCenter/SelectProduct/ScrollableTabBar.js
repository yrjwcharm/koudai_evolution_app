/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 11:41:27
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {px} from '~/utils/appUtil';

const ScrollableTabBar = ({tabs, activeTab, goToPage}) => {
    return (
        <View style={styles.container}>
            {tabs.map((item, idx) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        goToPage(idx);
                    }}
                    style={[styles.tabItem, {marginLeft: idx > 0 ? px(24) : 0}]}>
                    <Text
                        style={[
                            {
                                color: activeTab === idx ? '#121D3A' : '#545968',
                                fontSize: activeTab === idx ? px(14) : px(12),
                                lineHeight: activeTab === idx ? px(20) : px(17),
                            },
                        ]}>
                        {item}
                    </Text>
                    <View style={[styles.underLine, {opacity: activeTab === idx ? 1 : 0}]} />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ScrollableTabBar;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        paddingVertical: px(8),
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
    },
    underLine: {
        marginTop: px(2),
        backgroundColor: '#121D3A',
        width: px(13),
        height: px(2),
    },
});
