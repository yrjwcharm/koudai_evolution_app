/*
 * @Author: xjh
 * @Date: 2021-01-27 18:33:13
 * @Description:
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-27 18:37:22
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {px as text} from '../../../utils/appUtil';
import Html from '../../../components/RenderHtml';
import Http from '../../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomDesc from '../../../components/BottomDesc';
import Chart from 'react-native-f2chart';
import {baseChart, histogram, pie} from './ChartOption';
import ChartData from './data.json';
import FitImage from 'react-native-fit-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FixedBtn from '../components/FixedBtn';

export default function DetailProvideOrder() {
    return (
        <View>
            <Text>DetailProvideOrder</Text>
        </View>
    );
}
