/*
 * @Date: 2022-10-11 13:04:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-11-07 15:07:09
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Create/SpecialSubmitCheck.js
 * @Description: 提交审核成功页面
 */
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useJump} from '~/components/hooks';
import {useFocusEffect} from '@react-navigation/native';
import LoadingTips from '~/components/LoadingTips';
import {getSpeicalResult} from './services';

export default function SpecialSubmitCheck({navigation, route}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const jump = useJump();
    const handleBack = () => {
        if (data?.button?.url) {
            jump(data?.button?.url);
        } else {
            navigation.goBack();
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            getSpeicalResult(route.params || {})
                .then((res) => {
                    if (res.code === '000000') {
                        setData(res.result);
                    }
                })
                .finally((_) => {
                    setLoading(false);
                });
        }, [route?.params])
    );

    if (loading) {
        return (
            <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
                <NavBar title={''} leftIcon="chevron-left" leftPress={handleBack} />
                <View style={{width: '100%', height: px(200)}}>
                    <LoadingTips />
                </View>
            </SafeAreaView>
        );
    }

    return data ? (
        <SafeAreaView edges={['bottom']} style={styles.pageWrap}>
            <NavBar title={data?.title} leftIcon="chevron-left" leftPress={handleBack} />
            <View style={styles.content}>
                <FastImage style={styles.success_image} source={{uri: data.desc_icon}} />
                <Text style={styles.success_title}>{data.desc}</Text>
                <Text style={{...styles.success_desc, ...{marginTop: px(8)}}} numberOfLines={0}>
                    {data.hit}
                </Text>
                {/* <Text style={styles.success_desc}>审核结果将第一时间以消息方式通知您</Text>
                <Text style={styles.success_desc}>如有疑问，可联系客服：1342345345</Text> */}
                <TouchableOpacity onPress={handleBack} style={styles.success_btn}>
                    <Text style={styles.success_btntext}>{data.button.text}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    ) : null;
}

const styles = StyleSheet.create({
    pageWrap: {
        backgroundColor: '#F5F6F8',
        position: 'relative',
        flex: 1,
    },
    content: {
        paddingTop: px(12),
        paddingHorizontal: px(16),
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
        textAlign: 'center',
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
