import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const ToBeUpgradedList = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>当前待升级基金</Text>
                <Text style={styles.label}>持仓金额/日收益</Text>
            </View>
            {[1, 2, 3, 4, 5].map((item, idx) => (
                <View key={idx} style={styles.item}>
                    <View style={styles.itemLeft}>
                        <Text style={styles.itemTitle}>嘉实沪港深精选股票</Text>
                        <View style={styles.itemDesc}>
                            <Text style={styles.itemCode}>000466</Text>
                            <View style={styles.itemTag}>
                                <Text style={styles.itemTagText}>大盘股</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.itemAmount}>23,912.48</Text>
                        <Text style={styles.itemProfit}>+51.03</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default ToBeUpgradedList;

const styles = StyleSheet.create({
    container: {
        marginTop: px(12),
        padding: px(16),
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: px(13),
    },
    label: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
    },
    item: {
        borderTopColor: '#F4F4F7',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: px(13),
    },
    itemTitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121d3a',
    },
    itemDesc: {
        marginTop: px(6),
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemCode: {
        fontSize: px(11),
        lineHeight: px(15),
        color: '#9AA0B1',
    },
    itemTag: {
        marginLeft: px(8),
        borderRadius: px(3),
        borderWidth: 1,
        borderColor: '#BDC2CC',
        paddingHorizontal: px(4),
        paddingVertical: px(2),
    },
    itemTagText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#545968',
    },
    itemAmount: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
        fontFamily: Font.numFontFamily,
    },
    itemProfit: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#E74949',
        fontFamily: Font.numFontFamily,
        marginTop: px(2),
        textAlign: 'right',
    },
});
