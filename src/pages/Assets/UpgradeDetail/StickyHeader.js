import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {px} from '~/utils/appUtil';
import FastImage from 'react-native-fast-image';

const a = ['1. 提高收益', '2. 降低风险', '3. 盈利能力', '4. 专属投顾', '5. 资产配置'];

const StickyHeader = ({scrollY, curtainNum}) => {
    return (
        <View style={[styles.container, {top: scrollY}]}>
            {new Array(curtainNum).fill('').map((_, idx) => (
                <View key={idx}>
                    <View style={[styles.item, idx > 0 ? {borderTopColor: '#F4F5F7', borderTopWidth: 1} : {}]}>
                        <View style={styles.itemLeft}>
                            <Text style={styles.itemTitle}>{a[idx]}</Text>
                        </View>
                        <View style={styles.itemRight}>
                            <Text style={styles.rate}>15.36%</Text>
                            <FastImage
                                source={{
                                    uri:
                                        'http://static.licaimofang.com/wp-content/uploads/2022/07/91657595187_.pic_.png',
                                }}
                                style={styles.panelIcon}
                            />
                            <Text style={styles.rate}>15.36%</Text>
                        </View>
                    </View>
                </View>
            ))}
            <View
                style={{
                    backgroundColor: '#ddd',
                    opacity: 0.8,
                    height: 0.5,
                    width: '100%',
                }}
            />
        </View>
    );
};

export default StickyHeader;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        zIndex: 1,
    },
    item: {
        backgroundColor: '#fff',
        height: px(44),
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: px(14),
        lineHeight: px(20),
        color: '#121d3a',
    },
    panelIcon: {
        width: px(28),
        height: px(13),
        marginHorizontal: px(8),
    },
    rate: {
        fontSize: px(16),
        lineHeight: px(22),
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
