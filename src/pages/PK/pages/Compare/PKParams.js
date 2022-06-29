import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {px} from '~/utils/appUtil';

const PKParams = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>PK</Text>
                <Text style={styles.rightBtn}>权重设置 &gt;</Text>
            </View>
            <View style={styles.content} />
        </View>
    );
};

export default PKParams;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: px(8),
        paddingHorizontal: px(16),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 1,
    },
    title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121D3a',
    },
    rightBtn: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#0051cc',
    },
    content: {
        flexDirection: 'row',
    },
});
