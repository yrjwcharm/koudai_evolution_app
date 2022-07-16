/*
 * @Date: 2022-07-16 11:43:48
 * @Description:计划设置买卖模式
 */
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';

const ProjectSetTrade = () => {
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <Text>index</Text>
            <ScrollView style={{flex: 1}}>
                <Text style={[styles.title, {paddingLeft: px(16), height: px(42)}]}>设置定投计划</Text>
                <View style={styles.trade_con}>
                    <Text style={[styles.title, {textAlign: 'center', alignItems: 'center', height: px(50)}]}>
                        买入模式：智能定投
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProjectSetTrade;

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        fontSize: px(16),
        color: Colors.defaultColor,
        fontWeight: '700',
    },
    trade_con: {
        marginBottom: px(8),
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
    },
});
