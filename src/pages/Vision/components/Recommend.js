/*
 * @Date: 2021-05-18 12:31:34
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-31 10:32:00
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
import RecommendCard from '../../../components/Article/RecommendCard';
import VideoCard from '../../../components/Article/VideoCard';
const Recommend = () => {
    return (
        <ScrollView>
            <View style={{padding: px(16)}}>
                <RecommendCard style={{marginBottom: px(16)}} />
                <VideoCard />
            </View>
            <BottomDesc />
        </ScrollView>
    );
};

export default Recommend;

const styles = StyleSheet.create({
    recommed_card: {
        borderRadius: px(8),
        backgroundColor: '#fff',
    },
    light_text: {
        color: Colors.lightGrayColor,
        fontSize: px(12),
    },
    recommend_title: {
        fontSize: px(17),
        lineHeight: px(26),
        fontWeight: '700',
    },
});
