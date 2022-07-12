/*
 * @Date: 2022-07-12 14:25:26
 * @Description:持仓卡片
 */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
const ListTitle = () => {
    return (
        <View style={Style.flexRow}>
            <View style={styles.title_tag} />
            <View>
                <Text style={styles.bold_text}>产品</Text>
                {''} {''}
                <Text style={{fontSize: px(18)}}>|</Text>
                {''} {''}
                <Text style={styles.light_text}>包含公募、投顾组合、私募等产品</Text>
            </View>
        </View>
    );
};
const HoldList = () => {
    return (
        <View>
            <ListTitle />
            <View style={{marginHorizontal: px(16)}}>
                <Text>111</Text>
            </View>
        </View>
    );
};

export default HoldList;

const styles = StyleSheet.create({
    bold_text: {fontSize: px(18), lineHeight: px(25), color: Colors.defaultColor, fontWeight: '500'},
    light_text: {
        fontSize: px(12),
        lineHeight: px(17),
        color: Colors.lightBlackColor,
    },
    title_tag: {
        width: px(3),
        height: px(12),
        backgroundColor: Colors.defaultColor,
        marginRight: px(13),
    },
});
