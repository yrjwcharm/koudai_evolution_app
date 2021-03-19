/*
 * @Date: 2021-03-19 10:11:28
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-19 10:50:21
 * @Description: 关于理财魔方
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, StatusBar, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import FitImage from 'react-native-fit-image';
import Feather from 'react-native-vector-icons/Feather';
import http from '../../services';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Style} from '../../common/commonStyle';
import {ShareModal} from '../../components/Modal';

const AboutLCMF = ({navigation}) => {
    const [current, setCurrent] = useState(0);
    const shareModal = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerBackImage: () => {
                return <Feather name="chevron-left" size={30} color={'#fff'} />;
            },
            headerRight: () => (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => shareModal.show()}>
                        <Text style={styles.btnText}>分享</Text>
                    </TouchableOpacity>
                </>
            ),
            headerStyle: {
                backgroundColor: Colors.brandColor,
                shadowOffset: {
                    height: 0,
                },
                elevation: 0,
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: text(18),
            },
            // title: res.result.title || '资金安全',
        });
        StatusBar.setBarStyle('light-content');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={[Style.flexRow, styles.topBar]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setCurrent(0)}
                    style={[Style.flexCenter, {flex: 1, height: '100%', position: 'relative'}]}>
                    <Text style={[styles.topBarText, current === 0 ? styles.active : {}]}>{'关于魔方'}</Text>
                    {current === 0 && <View style={styles.activeLine} />}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setCurrent(1)}
                    style={[Style.flexCenter, {flex: 1, height: '100%', position: 'relative'}]}>
                    <Text style={[styles.topBarText, current === 1 ? styles.active : {}]}>{'团队介绍'}</Text>
                    {current === 1 && <View style={styles.activeLine} />}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setCurrent(2)}
                    style={[Style.flexCenter, {flex: 1, height: '100%', position: 'relative'}]}>
                    <Text style={[styles.topBarText, current === 2 ? styles.active : {}]}>{'企业实力'}</Text>
                    {current === 2 && <View style={styles.activeLine} />}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setCurrent(3)}
                    style={[Style.flexCenter, {flex: 1, height: '100%', position: 'relative'}]}>
                    <Text style={[styles.topBarText, current === 3 ? styles.active : {}]}>{'媒体报道'}</Text>
                    {current === 3 && <View style={styles.activeLine} />}
                </TouchableOpacity>
            </View>
            <ShareModal ref={shareModal} shareContent={{}} title={'关于理财魔方'} />
            <ScrollView style={{flex: 1}}>
                <></>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topRightBtn: {
        flex: 1,
        width: text(36),
        marginRight: text(8),
    },
    btnText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#fff',
    },
    topBar: {
        height: text(44),
        backgroundColor: Colors.brandColor,
    },
    topBarText: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: 'rgba(255, 255, 255, 0.5)',
    },
    active: {
        fontSize: text(15),
        lineHeight: text(21),
        color: '#fff',
        fontWeight: '600',
    },
    activeLine: {
        width: text(16),
        height: text(2),
        borderRadius: text(2),
        marginTop: text(1),
        backgroundColor: '#fff',
    },
});

export default AboutLCMF;
