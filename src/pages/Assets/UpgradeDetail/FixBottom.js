import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {isIphoneX, px} from '~/utils/appUtil';

const FixBottom = () => {
    return (
        <>
            <View
                style={{
                    backgroundColor: '#ddd',
                    opacity: 0.1,
                    height: 1,
                }}
            />
            <View style={[styles.fixBottom, {paddingBottom: isIphoneX() ? 34 : px(8)}]}>
                <TouchableOpacity activeOpacity={0.8} style={styles.btnLeft}>
                    <Text style={styles.btnLeftText}>持有不变</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.btnRight}>
                    <Text style={styles.btnRightText}>一键升级</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default FixBottom;

const styles = StyleSheet.create({
    fixBottom: {
        paddingVertical: px(10),
        paddingHorizontal: px(15),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnLeft: {
        width: px(124),
        height: px(44),
        borderRadius: px(6),
        borderWidth: 1,
        borderColor: '#545968',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLeftText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#545968',
    },
    btnRight: {
        width: px(208),
        height: px(44),
        borderRadius: px(6),
        backgroundColor: '#0051CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRightText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#fff',
    },
});
