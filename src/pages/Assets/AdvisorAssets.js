/*
 * @Date: 2021-09-24 16:25:09
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-24 17:43:38
 * @Description: 投顾组合总资产页
 */
import React, {useCallback, useState} from 'react';
import {Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {px, isIphoneX} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {useJump} from '../../components/hooks';
import storage from '../../utils/storage';

const AdvisorAssets = () => {
    const jump = useJump();
    const [showEye, setShowEye] = useState('true');

    const toggleEye = () => {
        setShowEye((show) => {
            storage.save('advisorAssets', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    };

    useFocusEffect(
        useCallback(() => {
            storage.get('advisorAssets').then((res) => {
                setShowEye(res ? res : 'true');
            });
            setTimeout(() => {
                StatusBar.setBarStyle('light-content');
            }, 0);
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{flex: 1}}>
                <View style={styles.assetsCard}>
                    <View style={Style.flexBetween}>
                        <View>
                            <View style={[Style.flexRow, {marginBottom: Space.marginVertical}]}>
                                <Text style={[styles.profitText, {marginRight: px(2)}]}>总金额(元){'（08-25）'}</Text>
                                <TouchableOpacity activeOpacity={0.8} onPress={toggleEye}>
                                    <Ionicons
                                        name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                        size={16}
                                        color={'rgba(255, 255, 255, 0.8)'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.profitNum, {fontSize: px(24), lineHeight: px(29)}]}>
                                {showEye === 'true' ? '815,305.00' : '***'}
                            </Text>
                        </View>
                        <View>
                            <View
                                style={[
                                    Style.flexRow,
                                    {marginBottom: Space.marginVertical, justifyContent: 'flex-end'},
                                ]}>
                                <Text style={styles.profitText}>日收益</Text>
                                <Text style={styles.profitNum}>{showEye === 'true' ? '642.32' : '***'}</Text>
                            </View>
                            <View style={[Style.flexRow, {justifyContent: 'flex-end'}]}>
                                <Text style={styles.profitText}>累计收益</Text>
                                <Text style={styles.profitNum}>{showEye === 'true' ? '315,350.00' : '***'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    assetsCard: {
        paddingVertical: Space.padding,
        paddingHorizontal: px(20),
        paddingBottom: px(24),
        backgroundColor: Colors.brandColor,
    },
    profitText: {
        marginRight: px(8),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: '#fff',
        opacity: 0.4,
    },
    profitNum: {
        fontSize: px(17),
        lineHeight: px(21),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
});

export default AdvisorAssets;
