/*
 * @Date: 2021-05-18 15:32:00
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-18 15:36:10
 * @Description:市场动态
 */

import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import http from '../../../services/index.js';
import {Colors, Style, Space} from '../../../common/commonStyle';
import {px, deviceWidth} from '../../../utils/appUtil';
import {useJump} from '../../../components/hooks';
import FastImage from 'react-native-fast-image';
import BottomDesc from '../../../components/BottomDesc.js';
const MarketDynamic = () => {
    return (
        <ScrollView style={{color: Colors.bgColor}}>
            <BottomDesc />
        </ScrollView>
    );
};

export default MarketDynamic;

const styles = StyleSheet.create({});
