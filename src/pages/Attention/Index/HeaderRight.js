/*
 * @Date: 2022-06-21 23:13:11
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-30 17:01:40
 * @Description:
 */
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {px} from '~/utils/appUtil';
import {Colors, Style} from '~/common/commonStyle';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
const HeaderRight = () => {
    const navigation = useNavigation();
    return (
        <View style={[Style.flexRow, {marginRight: px(16)}]}>
            <TouchableOpacity
                style={{marginRight: px(19)}}
                onPress={() => navigation.navigate('SearchHome')}
                activeOpacity={0.9}>
                <Feather size={px(20)} name={'search'} color={Colors.defaultColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('OCRHome')} activeOpacity={0.9}>
                <Feather size={px(20)} name={'plus-circle'} color={Colors.defaultColor} />
            </TouchableOpacity>
        </View>
    );
};

export default HeaderRight;

const styles = StyleSheet.create({});
