/*
 * @Date: 2021-12-20 10:44:07
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-01-04 17:30:55
 * @Description: 保存图片到手机
 */
import {Platform} from 'react-native';
import {openSettings, PERMISSIONS} from 'react-native-permissions';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
import {requestAuth} from './appUtil';
import {Modal} from '../components/Modal';
import Toast from '../components/Toast';

/**
 * @param {string} url 图片url
 * @param {string} name 图片名称
 * @param {function} successCallback 成功回调
 * @param {function} errorCallback 错误回调
 * @returns void
 */
const saveImg = (url, successCallback = () => {}, errorCallback = () => {}) => {
    if (!url) {
        Toast.show('保存失败');
        return false;
    } else {
        const name = url.split('/').pop();
        if (Platform.OS === 'ios') {
            CameraRoll.save(url, {type: 'photo'})
                .then((res) => {
                    Toast.show('保存成功');
                    successCallback(res);
                })
                .catch((error) => {
                    Toast.show('保存失败');
                    errorCallback(error);
                });
        } else {
            requestAuth(
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                () => {
                    const storeLocation = RNFS.PicturesDirectoryPath;
                    const pathName = Date.now() + name;
                    const downloadPath = `${storeLocation}/${pathName}`;
                    RNFS.downloadFile({fromUrl: url, toFile: downloadPath})
                        .promise.then((ret) => {
                            if (ret && ret.statusCode === 200) {
                                CameraRoll.save(`file://${downloadPath}`, {type: 'photo'})
                                    .then((res) => {
                                        Toast.show('保存成功');
                                        successCallback(res);
                                    })
                                    .catch((error) => {
                                        Toast.show('保存失败');
                                        errorCallback(error);
                                    });
                            }
                        })
                        .catch((error) => {
                            Toast.show('保存失败');
                            errorCallback(error);
                        });
                },
                () => {
                    Modal.show({
                        title: '权限申请',
                        content: '存储权限没打开,请前往手机的“设置”选项中,允许该权限',
                        confirm: true,
                        confirmText: '前往',
                        confirmCallBack: () => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        },
                    });
                }
            );
        }
    }
};

export default saveImg;
