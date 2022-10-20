/*
 * @Date: 2022-10-20 17:11:00
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2022-10-20 17:51:29
 * @FilePath: /koudai_evolution_app/src/pages/CreatorCenter/Special/utils/pickerUploadImg.js
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

export const doPickerAndUploadImg = () => {
    return new Promise((resolve, reject) => {
      console.log('launchImageLibrary')
        launchImageLibrary({quality: 1, mediaType: 'photo'}, (response) => {
          console.log('launchImageLibrary response')
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else if (response.assets) {
                console.log(response.assets[0]);
                ImageCropPicker.openCropper({
                    path: response.assets[0],
                    width: px(1125),
                    height: px(600),
                    cropperChooseText: '选择',
                    cropperCancelText: '取消',
                    loadingLabelText: '加载中',
                }).then((image) => {
                    if (image) {
                        console.log(image);
                        const params = {
                            type: image.mime,
                            uri: image.path.slice(1),
                            fileName: image.filename || '123.png',
                        };
                        upload('/common/image/upload', params, [], (res) => {
                            console.log(res);
                            if (res.code === '000000') {
                                Toast.show('上传成功');
                                resolve(res.result.url);
                            }
                        });
                    }
                });
            }
        });
    });
};

export default function pickerUploadImg(cb) {
    const resultCb = () => {
      console.log('resultCb')
        doPickerAndUploadImg().then((url) => cb(url));
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
