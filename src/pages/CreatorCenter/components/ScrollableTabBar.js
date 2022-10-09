/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-09 14:50:46
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {px} from '~/utils/appUtil';

const ScrollableTabBar = (props) => {
    return (
        <View style={[styles.container, props.style || {}]}>
            {props.tabs.map((item, idx) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.tabItem}
                    key={idx}
                    onPress={() => {
                        props.goToPage(idx);
                    }}>
                    <Text style={[props.activeTab === idx ? styles.tabTextActive : styles.tabTextDefault]}>{item}</Text>
                    <View style={[styles.underLine, {opacity: props.activeTab === idx ? 1 : 0}]} />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ScrollableTabBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tabItem: {
        alignItems: 'center',
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
