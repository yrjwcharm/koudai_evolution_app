/*
 * @Date: 2022-06-13 11:23:55
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-13 12:16:10
 * @Description:
 */
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {px} from '../../../../utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Style} from '../../../../common/commonStyle';
const SearchTag = ({title, style, onPress, onDelete}) => {
    return (
        <TouchableOpacity style={[styles.tag, Style.flexRow, style]} activeOpacity={0.9} onPress={() => onPress(title)}>
            <Text style={{color: '#545968', fontSize: px(12), lineHeight: px(17)}}>{title}</Text>
            <TouchableOpacity
                style={{marginLeft: px(4)}}
                onPress={() => {
                    onDelete(title);
                }}>
                <AntDesign name={'close'} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default SearchTag;

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: px(12),
        paddingVertical: px(6),
        borderRadius: px(30),
        backgroundColor: '#F5F6F8',
        marginBottom: px(6),
        marginRight: px(12),
    },
});
