/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 14:50:46
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {px} from '~/utils/appUtil';

const ScrollableTabBar = (props) => {
    return (
        <ScrollView
            bounces={false}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={6}
            contentContainerStyle={styles.container}
            style={[props.style || {}]}>
            {props.tabs.map((item, idx) => (
                <TouchableOpacity
                    activeOpacity={props?.disabledTabs?.includes?.(idx) ? 0.5 : 0.8}
                    style={[styles.tabItem, {opacity: props?.disabledTabs?.includes?.(idx) ? 0.5 : 1}]}
                    key={idx}
                    onPress={() => {
                        props.goToPage(idx);
                    }}
                    disabled={props?.disabledTabs?.includes?.(idx)}>
                    <Text style={[props.activeTab === idx ? styles.tabTextActive : styles.tabTextDefault]}>{item}</Text>
                    <View style={[styles.underLine, {opacity: props.activeTab === idx ? 1 : 0}]} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default ScrollableTabBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: px(15),
    },
    tabItem: {
        alignItems: 'center',
        marginRight: px(16),
    },
    tabTextDefault: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
        fontWeight: 'bold',
    },
    tabTextActive: {
        fontSize: px(14),
        fontWeight: 'bold',
        color: '#121D3A',
        lineHeight: px(20),
    },
    underLine: {
        width: px(20),
        height: 2,
        borderRadius: 1,
        backgroundColor: '#121d3a',
        marginTop: 3,
    },
});
