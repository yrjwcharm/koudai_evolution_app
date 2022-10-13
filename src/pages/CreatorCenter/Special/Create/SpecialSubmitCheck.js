/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-13 09:58:07
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/SpecialSubmitCheck.js
 * @Description: 提交审核成功页面
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import NavBar from '~/components/NavBar';
import {Colors, Style} from '~/common/commonStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {deviceHeight, deviceWidth, isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {useJump} from '~/components/hooks';
import {FixedButton} from '~/components/Button';

export default function SpecialSubmitCheck({navigation, route}) {
    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar title={'提交审核成功'} leftIcon="chevron-left" leftPress={handleBack} />
            <View style={styles.content}>
                <FastImage style={styles.success_image} source={require('~/assets/img/special/success.png')} />
                <Text style={styles.success_title}>您已成功提交审核！</Text>
                <Text style={{...styles.success_desc, ...{marginTop: px(8)}}}>
                    预计在2个小时内完成审核，请您关注消息通知
                </Text>
                <Text style={styles.success_desc}>审核结果将第一时间以消息方式通知您</Text>
                <Text style={styles.success_desc}>如有疑问，可联系客服：1342345345</Text>
                <TouchableOpacity onPress={handleBack} style={styles.success_btn}>
                    <Text style={styles.success_btntext}>知道了</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#F5F6F8',
        position: 'relative',
        height: deviceHeight,
    },
    content: {
        paddingTop: px(12),
        flex: 1,
        backgroundColor: '#F5F6F8',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    success_image: {
        marginTop: px(60),
        width: px(56),
        height: px(56),
    },
    success_title: {
        marginTop: px(12),
        color: '#4BA471',
        fontSize: px(16),
    },
    success_desc: {
        color: '#545968',
        fontSize: px(12),
        lineHeight: px(17),
    },
    success_btn: {
        marginTop: px(40),
        width: deviceWidth - 60,
        height: px(44),
        backgroundColor: '#0051CC',
        borderRadius: px(6),
        ...Style.flexCenter,
    },
    success_btntext: {
        color: '#fff',
        fontSize: px(18),
    },
});
