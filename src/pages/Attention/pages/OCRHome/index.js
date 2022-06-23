/*
 * @Date: 2022-06-23 19:34:31
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-23 19:45:50
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {Colors} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {Button} from '~/components/Button';

const index = () => {
    const handleUpload = () => {};
    return (
        <ScrollView style={styles.con}>
            <Text>index</Text>
            <Button onPress={handleUpload} />
        </ScrollView>
    );
};

export default index;

const styles = StyleSheet.create({
    con: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        padding: px(16),
    },
    title: {
        fontSize: px(16),
        marginBottom: px(6),
        color: Colors.defaultColor,
        fontWeight: '700',
    },
    title_desc: {
        color: Colors.lightBlackColor,
        lineHeight: px(18),
        fontSize: px(12),
    },
});
