/*
 * @Date: 2021-09-02 14:24:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-14 11:55:31
 * @Description:关于理财魔方
 */
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil.js';
import {useJump} from '../../components/hooks';
import {baseURL} from '../../services/config';
import {useSelector} from 'react-redux';
import Storage from '../../utils/storage';
import http from '../../services';

const AboutApp = () => {
    const jump = useJump();
    const [data, setData] = useState({});
    const userInfo = useSelector((store) => store.userInfo);
    const [showCircle, setShowCircle] = useState(false);
    useFocusEffect(
        useCallback(() => {
            http.get('/mapi/about/lcmf/20210906').then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            });
            Storage.get('version' + userInfo.toJS().latest_version + 'about_page').then((res) => {
                if (!res && global.ver < userInfo.toJS().latest_version) {
                    setShowCircle(true);
                }
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            <View style={[Style.flexCenter, {paddingTop: text(50)}]}>
                <Image source={require('../../assets/img/logo-1024.png')} style={styles.logo} />
            </View>
            <Text style={styles.appName}>{data?.app_info?.name}</Text>
            <Text style={styles.version}>{data?.app_info?.ver}</Text>
            <View style={styles.partBox}>
                {data?.items?.map?.((item, i) => {
                    return (
                        <View key={item.text} style={[i === 0 ? {} : styles.borderTop]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[Style.flexBetween, {height: text(56)}]}
                                onPress={() => {
                                    jump(item.url);
                                    if (item.type === 'update' && showCircle) {
                                        setShowCircle(false);
                                        Storage.save('version' + userInfo.toJS().latest_version + 'about_page', true);
                                    }
                                }}>
                                <Text style={styles.title}>{item.text}</Text>
                                <View style={Style.flexRow}>
                                    {item.desc ? (
                                        <Text
                                            style={[
                                                styles.title,
                                                {
                                                    marginRight: text(8),
                                                    color: Colors.lightGrayColor,
                                                },
                                            ]}>
                                            {item.desc}
                                        </Text>
                                    ) : null}
                                    {item.type === 'update' && showCircle ? <View style={styles.redDot} /> : null}
                                    {item.url ? (
                                        <Icon name={'angle-right'} size={20} color={Colors.lightGrayColor} />
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
            <Text style={styles.protocols}>
                {data?.agreement?.map?.((item, index) => {
                    return (
                        <Text
                            key={item.id}
                            onPress={() =>
                                jump({
                                    path: 'Agreement',
                                    type: 1,
                                    params: {
                                        id: item.id,
                                    },
                                })
                            }>
                            {index !== 0 ? '\n' : ''}
                            {item.name}
                        </Text>
                    );
                })}
            </Text>
            <Text style={[styles.copyright, {marginBottom: isIphoneX() ? text(20) + 34 : text(20)}]}>
                {data?.app_info?.copyright}
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    logo: {
        width: text(63),
        height: text(63),
        borderRadius: text(17),
    },
    appName: {
        fontSize: text(22),
        lineHeight: text(31),
        color: Colors.defaultColor,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: text(12),
    },
    version: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.lightBlackColor,
        textAlign: 'center',
        marginTop: text(2),
    },
    partBox: {
        marginTop: text(40),
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.lightBlackColor,
    },
    redDot: {
        width: text(8),
        height: text(8),
        marginRight: text(8),
        borderRadius: text(8),
        backgroundColor: Colors.red,
    },
    protocols: {
        fontSize: Font.textSm,
        lineHeight: text(22),
        color: Colors.brandColor,
        textAlign: 'center',
        marginTop: text(80),
    },
    copyright: {
        fontSize: Font.textSm,
        lineHeight: text(20),
        color: Colors.lightGrayColor,
        textAlign: 'center',
        marginTop: text(16),
    },
});

export default AboutApp;
