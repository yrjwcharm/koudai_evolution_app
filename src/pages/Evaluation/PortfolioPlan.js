/*
 * @Date: 2021-11-04 11:19:55
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-04 12:21:12
 * @Description:定制理财计划
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, Style, Font} from '../../common/commonStyle';
import {px, isIphoneX, deviceWidth} from '../../utils/appUtil';
import Header from '../../components/NavBar';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import http from '../../services';
import LinearGradient from 'react-native-linear-gradient';
import {Chart, chartOptions} from '../../components/Chart';
import NumText from '../../components/NumText';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import {BoxShadow} from 'react-native-shadow';
import {Modal} from '../../components/Modal';

const PortfolioPlan = () => {
    return (
        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={[Style.flexRow, {alignItems: 'flex-end', height: px(94)}]}>
                <View style={[Style.flexCenter, styles.container_sty]}>
                    <NumText
                        style={{
                            ...styles.amount_sty,
                            fontSize: px(34),
                        }}
                        text={'12%'}
                    />
                    <Text style={styles.radio_sty}>年华</Text>
                </View>

                <View style={[Style.flexCenter, styles.container_sty]}>
                    <Text
                        style={[styles.amount_sty, {fontSize: px(26), lineHeight: px(30), color: Colors.defaultColor}]}>
                        -12.1%
                    </Text>
                    <Text style={[styles.radio_sty, {marginTop: px(6)}]}>嘿嘿</Text>
                </View>
            </View>
            <View style={{paddingHorizontal: px(16)}}>
                <Text style={styles.card_title}>智能工具</Text>
                <View style={Style.flexBetween}>
                    <View style={styles.card}>
                        <Text style={styles.card_subtitle}>底线预估</Text>
                        <Text style={styles.card_desc}>底线预估底线预估</Text>
                    </View>
                    <View style={styles.card}>
                        <Text>底线预估</Text>
                        <Text>底线预估底线预估</Text>
                    </View>
                    <View style={styles.card}>
                        <Text>底线预估</Text>
                        <Text>底线预估底线预估</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default PortfolioPlan;

const styles = StyleSheet.create({
    container_sty: {
        justifyContent: 'flex-end',
        paddingBottom: px(20),
        backgroundColor: '#fff',
        flex: 1,
        height: '100%',
    },
    amount_sty: {
        color: Colors.red,
        fontSize: px(34),
        lineHeight: px(40),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
    },
    radio_sty: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: px(17),
        textAlign: 'center',
        marginTop: px(4),
    },
    card_title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: Colors.defaultColor,
        marginBottom: px(12),
    },
    card: {
        width: px(102),
        borderRadius: px(8),
        borderColor: '#DDDDDD',
        borderWidth: px(0.5),
        paddingHorizontal: px(12),
        paddingVertical: px(16),
        alignItems: 'center',
    },
    card_subtitle: {
        fontSize: px(14),
        lineHeight: px(20),
        marginBottom: px(8),
    },
    card_desc: {
        fontSize: px(12),
        lineHeight: px(17),
        textAlign: 'center',
    },
});
