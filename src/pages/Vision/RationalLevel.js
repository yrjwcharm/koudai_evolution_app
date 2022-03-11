/*
 * @Date: 2022-03-11 14:51:29
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-03-11 18:16:13
 * @Description: 理性等级
 */
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services';
import {px} from '../../utils/appUtil';

export default ({navigation}) => {
    return (
        <ScrollView bounces={false} style={styles.container}>
            <View style={styles.topInfo}>
                <Text style={styles.infoText}>{'新手必须：为什么理性等级和您赚钱的能力密切相关？'}</Text>
            </View>
            <View style={{paddingHorizontal: Space.padding}}>
                <LinearGradient
                    colors={['#3E4166', '#14102A']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.levelCon}>
                    <Image source={require('../../assets/img/vision/levelBg.png')} style={styles.levelBg} />
                    <View style={[Style.flexRow, {marginTop: px(13)}]}>
                        <Image source={require('../../assets/img/vision/level.png')} style={styles.levelIcon} />
                        <Text style={styles.levelText}>{'理性等级'}</Text>
                        <Text style={styles.levelNum}>{'6'}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.levelTips}>{'升至7级，收益率可提升7.8%'}</Text>
                    </View>
                    <View style={styles.levelValCon}>
                        <Text style={styles.levelVal}>{'7,264'}</Text>
                        <View>
                            <Text style={{...styles.infoText, color: '#FFEBCB'}}>{'+300'}</Text>
                            <Text style={styles.linkText}>
                                {'理性值'}
                                <Icon color={'#FFEBCB'} name="right" size={10} />
                            </Text>
                        </View>
                    </View>
                    <View style={styles.barCon}>
                        <LinearGradient
                            colors={['#FFF4E3', '#FFFFFF']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[styles.activeBar, {width: '63%'}]}
                        />
                        <View style={[styles.lightCon, {width: '63%'}]}>
                            <Image source={require('../../assets/img/vision/light.png')} style={styles.light} />
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topInfo: {
        paddingVertical: px(9),
        paddingHorizontal: Space.padding,
        backgroundColor: '#FFF5E5',
    },
    infoText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#EB7121',
    },
    levelCon: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        minHeight: px(140),
    },
    levelBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px(140),
        height: px(80),
    },
    levelIcon: {
        marginRight: px(5),
        width: px(16),
        height: px(16),
    },
    levelText: {
        fontSize: Font.textH1,
        lineHeight: px(16),
        color: '#FFECCF',
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    levelNum: {
        marginLeft: px(2),
        fontSize: px(24),
        lineHeight: px(24),
        color: '#FFECCF',
        fontFamily: Font.numFontFamily,
    },
    divider: {
        marginHorizontal: px(8),
        backgroundColor: 'rgba(255, 224, 170, 0.2)',
        width: px(1),
        height: px(13),
    },
    levelTips: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FFECCF',
    },
    levelValCon: {
        marginTop: px(12),
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    levelVal: {
        fontSize: px(36),
        lineHeight: px(42),
        color: '#FFECCF',
        fontFamily: Font.numFontFamily,
    },
    linkText: {
        marginTop: px(11),
        marginBottom: px(5),
        marginLeft: px(4),
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#FFECCF',
    },
    barCon: {
        marginTop: px(2),
        borderRadius: px(3),
        width: '100%',
        height: px(3),
        backgroundColor: '#383547',
    },
    activeBar: {
        height: '100%',
        borderRadius: px(3),
    },
    lightCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: px(3),
        overflow: 'visible',
    },
    light: {
        position: 'absolute',
        top: px(-8),
        right: px(-8),
        width: px(19),
        height: px(19),
    },
});
