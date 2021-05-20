/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-18 17:51:57
 * @Description:推荐
 */
import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style, Space} from '../../../common/commonStyle';
import {px, deviceWidth} from '../../../utils/appUtil';
import {useJump} from '../../../components/hooks';
import FastImage from 'react-native-fast-image';
import BottomDesc from '../../../components/BottomDesc.js';
const Recommend = () => {
    return (
        <ScrollView>
            <BottomDesc />
        </ScrollView>
    );
};

export default Recommend;

const styles = StyleSheet.create({});
