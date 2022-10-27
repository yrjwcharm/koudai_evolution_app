/*
 * @Date: 2022-10-09 14:06:05
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-27 18:10:02
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyActiveInfo.js
 * @Description: 修改专题 - 活动信息（未启用）
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar';
import {px} from '~/utils/appUtil';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal} from '~/components/Modal';
import {Style} from '~/common/commonStyle';

import {getStashSpeical} from './services';

import pickerUploadImg from '~/utils/pickerUploadImg';
import {useFocusEffect} from '@react-navigation/native';

export default function SpecialModifyActiveInfo({navigation, route}) {
    const subject_id = route?.params?.subject_id || 1022;
    const [bgSource, setBgSource] = useState();

    const [link, setLink] = useState('');

    const canGoBack = useRef(false);

    useFocusEffect(
        useCallback(() => {
            let listener = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                if (canGoBack.current) {
                    navigation.dispatch(e.data.action);
                    return;
                }
                handleBack();
            });
            return () => listener?.();
        }, [])
    );

    const showSelectImg = () => {
        pickerUploadImg(({url}) => {
            setBgSource(url);
        });
    };

    const handleSaveActiveInfo = () => {
        if (!bgSource || bgSource.length === 0) {
            Toast.show('未选择背景图片');
            return;
        }
        // saveStashSpeical

        // TODO: save active info
        canGoBack.current = true;
        navigation.goBack();
    };
    const handleBack = () => {
        if (bgSource || link) {
            Modal.show({
                content: '已编辑内容是否要保存草稿？下次可继续编辑。',
                cancelText: '不保存草稿',
                confirmText: '保存草稿',
                confirm: true,
                backCloseCallbackExecute: true,
                cancelCallBack: () => {
                    canGoBack.current = true;
                    navigation.goBack();
                },
                confirmCallBack: () => {
                    // TODO: save stack
                    canGoBack.current = true;
                    navigation.goBack();
                },
            });
        } else {
            canGoBack.current = true;
            navigation.goBack();
        }
    };

    useEffect(() => {
        getStashSpeical({subject_id}).then((res) => {
            setLink('');
            setBgSource('');
        });
    }, []);

    let uploadImgSection;
    if (bgSource) {
        // 背景图片是否已选择
        uploadImgSection = (
            <TouchableOpacity style={[styles.uload_btn, Style.flexCenter]} activeOpacity={0.9} onPress={showSelectImg}>
                <ImageBackground source={{uri: bgSource}} style={[styles.bg_image]}>
                    <FastImage
                        source={require('~/components/IM/app/source/image/camera.png')}
                        style={[styles.upload_centerCamera]}
                    />
                </ImageBackground>
            </TouchableOpacity>
        );
    } else {
        uploadImgSection = (
            <TouchableOpacity
                style={[styles.uload_btn, styles.upload_init, Style.flexCenter]}
                activeOpacity={0.9}
                onPress={showSelectImg}>
                <FastImage source={require('~/assets/img/special/add-fill.png')} style={[styles.upload_centerAdd]} />
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView edges={['bottom']}>
            <NavBar
                title={'修改活动信息'}
                leftIcon="chevron-left"
                rightText={'保存'}
                rightPress={handleSaveActiveInfo}
                leftPress={handleBack}
                rightTextStyle={styles.right_sty}
            />
            <ScrollView style={styles.pageWrap}>
                <View style={Style.flexRow}>
                    <Text style={styles.upload_label}>上传活动背景图片</Text>
                    <Text style={styles.upload_label_desc}>（选填，尺寸要求：1029*180px）</Text>
                </View>
                <View style={[styles.space1, styles.upload_imageWrap]}>{uploadImgSection}</View>
                <View style={[styles.space2, styles.inputWrap]}>
                    <TextInput
                        style={styles.title}
                        onChangeText={setLink}
                        placeholder="请填写活动链接(选填）"
                        value={link}
                        clearButtonMode="while-editing"
                    />
                    <View style={[styles.line, styles.space1]} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    right_sty: {
        marginRight: px(14),
        color: '#121D3A',
    },
    pageWrap: {
        backgroundColor: '#fff',
        paddingLeft: px(16),
        paddingRight: px(16),
        paddingTop: px(12),
        minHeight: '100%',
    },
    space1: {
        marginTop: px(12),
    },
    space2: {
        marginTop: px(20),
    },
    line: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#BDC2CC',
    },
    upload_label: {
        fontSize: px(16),
        color: '#121D3A',
    },
    upload_label_desc: {
        fontSize: px(12),
        color: '#545968',
    },
    upload_imageWrap: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    uload_btn: {
        display: 'flex',
        position: 'relative',
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        opacity: 1,
        width: '100%',
        height: px(200),
    },
    upload_init: {
        width: px(125),
        height: px(125),
    },
    upload_centerAdd: {
        height: 24,
        width: 24,
    },
    upload_centerCamera: {
        width: 40,
        height: 40,
    },

    bg_image: {
        width: '100%',
        minHeight: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: px(13),
        color: '#121D3A',
    },
});
