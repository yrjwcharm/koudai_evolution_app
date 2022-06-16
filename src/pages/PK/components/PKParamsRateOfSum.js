import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {px} from '~/utils/appUtil';

const PKParamsRateOfSum = ({total = 100, value = 0, color = ''}) => {
    return (
        <View style={styles.container}>
            <View style={styles.wrap}>
                <View
                    style={[styles.inner, {width: ((value / total) * 100).toFixed(2) + '%', backgroundColor: color}]}
                />
            </View>
            <View style={{width: px(25)}}>
                <Text style={[styles.text, color ? {color} : {}]}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    wrap: {
        flex: 1,
        height: px(5),
        backgroundColor: '#E9EAEF',
    },
    inner: {
        height: px(5),
        position: 'absolute',
        top: 0,
        left: 0,
    },
    text: {
        fontSize: px(14),
        lineHeight: px(30),
        fontWeight: '500',
        alignSelf: 'flex-end',
    },
});
export default PKParamsRateOfSum;
