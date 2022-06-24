/*
 * @Date: 2022-06-23 19:34:31
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-23 22:32:58
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import {Button} from '~/components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
const index = () => {
    const handleUpload = () => {};
    return (
        <ScrollView style={styles.con}>
            <View style={[Style.flexRow, {alignItems: 'flex-start', marginBottom: px(15)}]}>
                <TouchableOpacity style={{height: px(20), marginTop: px(2), width: px(24)}}>
                    <AntDesign name={'checkcircle'} size={px(14)} color={Colors.btnColor} />
                </TouchableOpacity>
                <View>
                    <Text style={{fontSize: px(14), color: Colors.defaultColor}}>广发多因子灵活配置</Text>
                    <Text style={{fontSize: px(11), color: Colors.lightGrayColor, marginTop: px(4)}}>123455</Text>
                </View>
            </View>
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
