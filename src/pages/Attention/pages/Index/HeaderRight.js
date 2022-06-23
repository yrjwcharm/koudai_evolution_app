/*
 * @Date: 2022-06-21 23:13:11
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-21 23:13:43
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
const HeaderRight = () => {
    return (
        <View style={[Style.flexRow, {marginRight: px(16)}]}>
            <TouchableOpacity style={{marginRight: px(19)}}>
                <Feather size={px(22)} name={'search'} color={Colors.defaultColor} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Feather size={px(22)} name={'plus-circle'} color={Colors.defaultColor} />
            </TouchableOpacity>
        </View>
    );
};

export default HeaderRight;

const styles = StyleSheet.create({});
