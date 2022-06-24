/*
 * @Date: 2022-06-23 15:13:37
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-06-23 15:23:01
 * @Description: 基金榜单
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import Loading from '~/pages/Portfolio/components/PageLoading';
import {deviceWidth, isIphoneX, px} from '~/utils/appUtil';

const Index = () => {
    return (
        <View style={styles.container}>
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <></>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});

export default Index;
