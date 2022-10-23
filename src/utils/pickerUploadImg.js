/*
 * @Date: 2022-10-20 17:11:00
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-23 11:59:38
 * @FilePath: /koudai_evolution_app/src/utils/pickerUploadImg.js
 * @Description:
 */

import ImageCropPicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {isIphoneX, px, requestAuth} from '~/utils/appUtil';
import upload from '~/services/upload';
import Toast from '~/components/Toast';
import {Modal} from '~/components/Modal';
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
import {PERMISSIONS, openSettings} from 'react-native-permissions';

const blockCal = () => {
    Modal.show({
        title: '权限申请',
        content: '权限没打开,请前往手机的“设置”选项中,允许该权限',
        confirm: true,
        confirmText: '前往',
        confirmCallBack: () => {
            openSettings().catch(() => console.warn('cannot open settings'));
        },
    });
};

export const doPickerAndUploadImg = (cb) => {
    console.log('launchImageLibrary');
    launchImageLibrary({quality: 1, mediaType: 'photo'}, (response) => {
        console.log('launchImageLibrary response', response);
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else if (response.assets) {
            console.log('do openCropper:', response.assets[0]);
            setTimeout(() => {
                ImageCropPicker.openCropper({
                    path: response.assets[0],
                    width: px(1125),
                    height: px(600),
                    cropperChooseText: '选择',
                    cropperCancelText: '取消',
                    loadingLabelText: '加载中',
                    cropperToolbarTitle: '使用双指缩放',
                    // writeTempFile: false,
                }).then((image) => {
                    console.log('ImageCropPicker.openCropper:', image);
                    if (image) {
                        const params = {
                            type: image.mime,
                            uri: image.path.slice(1),
                            fileName: image.filename || '123.png',
                        };
                        let loading = Toast.showLoading();
                        upload(
                            '/common/image/upload',
                            params,
                            [],
                            (res) => {
                                if (res.code === '000000') {
                                    Toast.hide(loading);
                                    Toast.show('上传成功');
                                    cb({
                                        url: res.result.url,
                                        uri: image.path,
                                    });
                                }
                            },
                            () => {
                                Toast.hide(loading);
                            }
                        );
                    }
                });
            }, 200);
        }
    });
};

let isOpen = false;

export default function pickerUploadImg(cb) {
    if (isOpen) return;
    isOpen = true;
    setTimeout(() => {
        isOpen = false;
    }, 500);

    const resultCb = () => {
        console.log('resultCb');
        doPickerAndUploadImg(cb);
    };
    try {
        if (Platform.OS == 'android') {
            requestAuth(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, resultCb, blockCal);
        } else {
            requestAuth(PERMISSIONS.IOS.PHOTO_LIBRARY, resultCb, blockCal);
        }
    } catch (err) {
        console.warn(err);
    }
}
