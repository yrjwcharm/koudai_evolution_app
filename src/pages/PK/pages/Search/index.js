/*
 * @Date: 2022-06-10 18:41:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-10 18:47:47
 * @Description:搜索
 */
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icons from 'react-native-vector-icons/EvilIcons';
import {Style} from '../../../../common/commonStyle';
import {px} from '../../../../utils/appUtil';
const Index = () => {
    return (
        <View style={Style.flexRow}>
            <View>
                <Icons name={'search'} color={'#545968'} size={px(18)} />
                <TextInput placeholder="搜基金代码/名称" />
            </View>
            <TouchableOpacity>
                <Text>搜索</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({});
