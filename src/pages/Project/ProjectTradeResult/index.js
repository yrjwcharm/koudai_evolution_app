/*
 * @Date: 2022-07-22 18:34:55
 * @Description:计划确认页
 */
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors} from '~/common/commonStyle';

const Index = () => {
    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView>
                <Text>111</Text>
            </ScrollView>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    status: {
        fontSize: px(16),
        color: '#4BA471',
        textAlign: 'center',
    },
    key: {
        fontSize: px(12),
        color: Colors.lightGrayColor,
    },
    value: {
        fontSize: px(13),
    },
    list_con: {
        backgroundColor: Colors.bgColor,
        borderRadius: px(4),
        paddingHorizontal: px(12),
        paddingTop: px(11),
        paddingBottom: px(16),
    },
});
