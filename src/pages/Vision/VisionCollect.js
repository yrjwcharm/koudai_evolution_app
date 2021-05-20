/*
 * @Date: 2021-05-18 16:06:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-18 17:45:17
 * @Description:收藏 历史
 */

import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useJump} from '../../components/hooks';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Entypo from 'react-native-vector-icons/Entypo';
import Tabbar from '../../components/TabBar';
import http from '../../services/index.js';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {px} from '../../utils/appUtil';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../common/commonStyle';

const VisionCollect = ({navigation}) => {
    const inset = useSafeAreaInsets();
    const jump = useJump();
    return (
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={['#fff', '#F5F6F8']}
            style={{paddingTop: inset.top, flex: 1}}>
            <TouchableOpacity
                activeOpacity={0.9}
                style={{position: 'absolute', left: px(16), top: inset.top + px(8), zIndex: 10}}
                onPress={() => {
                    navigation.goBack();
                }}>
                <Entypo name="chevron-thin-left" size={px(18)} />
            </TouchableOpacity>
            <ScrollableTabView
                renderTabBar={() => (
                    <Tabbar
                        style={{backgroundColor: 'transparent', marginHorizontal: px(100), borderBottomWidth: 0}}
                        hideUnderLine
                        btnColor={Colors.defaultColor}
                        activeFontSize={px(20)}
                    />
                )}>
                <View tabLabel="收藏">
                    <Text>
                        2021年1月27日 — 使用NODE_ENV 最多的地方是webpack 配置文件，用来判断当前环境是开发 ... "cross-env
                        REACT_APP_ENV=staging node scripts/build.js", ...
                    </Text>
                    <Text>111</Text>
                    <Text>111</Text>
                    <Text>111</Text>
                    <Text>111</Text>
                    <Text>111</Text>
                    <Text>111</Text>
                </View>
                <View tabLabel="赞过" />
                <View tabLabel="历史" />
            </ScrollableTabView>
        </LinearGradient>
    );
};

export default VisionCollect;

const styles = StyleSheet.create({});
