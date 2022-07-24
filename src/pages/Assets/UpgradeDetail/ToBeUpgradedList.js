import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Font} from '~/common/commonStyle';
import HTML from '~/components/RenderHtml';
import {px} from '~/utils/appUtil';

const ToBeUpgradedList = ({data = {}}) => {
    const {header, list} = data;
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {header?.map((item, index) => {
                    return (
                        <Text key={item + index} style={styles.label}>
                            {item}
                        </Text>
                    );
                })}
            </View>
            {list?.map((item, idx) => (
                <View key={idx} style={styles.item}>
                    <View style={styles.itemLeft}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <View style={styles.itemDesc}>
                            <Text style={styles.itemCode}>{item.code}</Text>
                            {item.tags?.map((tag, i) => {
                                return (
                                    <View key={tag + i} style={styles.itemTag}>
                                        <Text style={styles.itemTagText}>{tag}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.itemAmount}>{item.amount}</Text>
                        <View style={{marginTop: px(2)}}>
                            <HTML html={item.profit} style={styles.itemProfit} />
                        </View>
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
