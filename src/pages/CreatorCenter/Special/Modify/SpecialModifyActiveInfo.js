/*
 * @Date: 2022-10-09 14:06:05
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 17:55:39
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/Modify/SpecialModifyActiveInfo.js
 * @Description: 修改专题 - 活动信息
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    Pressable,
    PermissionsAndroid,
    DeviceEventEmitter,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import NavBar from '~/components/NavBar';
import {isIphoneX, px, requestAuth} from '~/utils/appUtil';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '~/components/Toast';
import {Modal, BottomModal, SelectModal} from '~/components/Modal';
import {Style, Colors, Space} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import {getStashSpeical, saveStashSpeical} from '../services';

import pickerUploadImg from '~/utils/pickerUploadImg';

const typeArr = ['选择现有图片', '从相册选择'];

export default function SpecialModifyBaseInfo({navigation, route}) {
    const jump = useJump();
    const [bgSource, setBgSource] = useState();

    const [showPickerModal, setPickerModal] = useState(false);
    const [link, setLink] = useState('');

    const showSelectImg = () => {
        setPickerModal(true);
    };

    const handleSaveActiveInfo = () => {
        if (!bgSource || bgSource.length === 0) {
            Toast.show('未选择背景图片');
            return;
        }

        // TODO: save active info
        navigation.goBack();
    };
    const handleBack = () => {
        if (bgSource || link) {
            Modal.show({
                title: '已编辑内容是否要保存草稿？下次可继续编辑。',
                cancelText: '不保存草稿',
                confirmText: '保存草稿',
                backCloseCallbackExecute: true,
                cancelCallBack: () => {
                    navigation.goBack();
                },
                confirmCallBack: () => {
                    // TODO: save stack

                    navigation.goBack();
                },
            });
        } else {
            navigation.goBack();
        }
    };

    const handleChooseOld = () => {
        jump({
            path: 'SpecialModifyBgImage',
            params: {
                onSure: (uri) => {
                    setBgSource(uri);
                },
                selectedUri: 'https://static.licaimofang.com/wp-content/uploads/2022/10/brand-3.png',
            },
        });
    };

    const handlePickAlumn = () => {
        pickerUploadImg((url) => {
            setBgSource(url);
        });
    };

    useEffect(() => {
        getStashSpeical().then((res) => {
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

            <SelectModal
                entityList={typeArr}
                callback={(i) => {
                    if (i == 0) {
                        handleChooseOld();
                    } else {
                        handlePickAlumn();
                    }
                }}
                show={showPickerModal}
                closeModal={(show) => {
                    setPickerModal(show);
                }}
            />
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
