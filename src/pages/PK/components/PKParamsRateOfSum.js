import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Font} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const PKParamsRateOfSum = ({total = 100, value = 0, color = '#545968', style}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.wrap}>
                <View
                    style={[styles.inner, {width: ((value / total) * 100).toFixed(2) + '%', backgroundColor: color}]}
                />
            </View>
            <Text style={[styles.text, color ? {color} : {}]}>{value}</Text>
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
        marginLeft: px(6),
        fontFamily: Font.numFontFamily,
    },
});
export default PKParamsRateOfSum;
