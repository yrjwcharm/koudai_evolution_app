import {save} from '@react-native-community/cameraroll';
import {Platform} from 'react-native';
import Toast from '~/components/Toast';
import RNFS from 'react-native-fs';
import {openSettings, PERMISSIONS} from 'react-native-permissions';
import {requestAuth} from './appUtil';
import {Modal} from '~/components/Modal';

/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-25 16:26:33
 */
const saveBase64Img = (b64, successCallback, errorCallback) => {
    if (!b64) {
        Toast.show('保存失败');
        return false;
    }
    switch (Platform.OS) {
        case 'ios':
            save(b64, {type: 'photo'})
                .then((res) => {
                    Toast.show('保存成功');
                    successCallback?.(res);
                })
                .catch((error) => {
                    Toast.show('保存失败');
                    errorCallback?.(error);
                });
            break;
        case 'android':
            requestAuth(
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                () => {
                    const path = RNFS.CachesDirectoryPath + '/qr-code.png';
                    const aB64 = b64.split(',')[1];
                    RNFS.writeFile(path, aB64, 'base64')
                        .then(() => {
                            return save(path, {type: 'photo'});
                        })
                        .then((res) => {
                            Toast.show('保存成功');
                            successCallback?.(res);
                        })
                        .catch((error) => {
                            Toast.show('保存失败');
                            errorCallback?.(error);
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
};

export default saveBase64Img;
