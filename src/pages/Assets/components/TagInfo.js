/*
 * @Date: 2022-09-25 10:57:59
 * @Description: 持仓卡片的小tag标签 如 需调仓
 */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';

const TagInfo = ({data, style}) => {
    return (
        <View style={[styles.tag, {backgroundColor: data?.color || '#E74949'}, style]}>
            <Text style={{fontSize: px(10), lineHeight: px(14), color: '#fff'}}>{data?.text}</Text>
        </View>
    );
};

export default TagInfo;

const styles = StyleSheet.create({
    tag: {paddingHorizontal: px(5), paddingVertical: px(2), borderRadius: px(2), marginLeft: px(6)},
});
