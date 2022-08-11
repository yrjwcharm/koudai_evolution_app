/*
 * @Date: 2021-03-01 19:48:43
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-11 15:46:41
 * @Description: 自定义跳转钩子
 */
import React, {useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {DeviceEventEmitter, Linking, Platform} from 'react-native';
import {checkMultiple, openSettings, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Toast from '../Toast';
import {Modal} from '../Modal';
import http from '../../services';
import {generateOptions} from './useStateChange';
import {PopupContent} from '../../pages/PE/ObjectChoose';
import * as WeChat from 'react-native-wechat-lib';
import {recordInit, signFile, signInit, signOrder, signPreview, startRecord} from '../../pages/PE/PEBridge';
import Clipboard from '@react-native-community/clipboard';
// 权限提示弹窗
const blockCal = (action) => {
    Modal.show({
        title: '权限申请',
        content: `${action === 'camera' ? '相机' : '录音'}权限没打开,请前往手机的“设置”选项中,允许该权限`,
        confirm: true,
        confirmText: '前往',
        confirmCallBack: () => {
            openSettings().catch(() => console.warn('无法打开设置'));
        },
    });
};

function useJump() {
    const navigation = useNavigation();
    const route = useRoute();
    const flagRef = useRef(true);
    return function jump(url, type = 'navigate') {
        if (url && flagRef.current) {
            flagRef.current = false;
            if (url.type === 2) {
                Linking.canOpenURL(url.path)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show(
                                url.path?.indexOf?.('tel:') > -1
                                    ? `您的设备不支持该功能，请手动拨打 ${url.path?.split?.('tel:')[1]}`
                                    : '您的设备不支持打开该功能'
                            );
                        }
                        return Linking.openURL(url.path);
                    })
                    .catch((err) => Toast.show(err));
            } else if (url.type === 3) {
                navigation[type]('OpenPdf', {url: url.path, ...(url.params || {})});
            } else if (url.type == 5) {
                WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.launchMiniProgram({
                            userName: url?.params?.app_id,
                            miniProgramType: 0,
                            path: url.path,
                        });
                    } else {
                        Toast.show('请安装微信');
                    }
                });
            } else if (url.type === 6) {
                // 弹出弹窗
                const {popup = {}} = url;
                if (popup?.clipboard) {
                    Clipboard.setString(popup?.clipboard);
                }
                if (Object.keys(popup).length === 0) {
                    return false;
                }
                if (popup.type === 'add_wechat_guide') {
                    const options = generateOptions(popup);
                    Modal.show(options, 'slide');
                } else if (popup.type === 'choose_object' || popup.type === 'sign_password') {
                    Modal.show(
                        {
                            backButtonClose: popup.back_close,
                            children: (
                                <PopupContent
                                    data={popup}
                                    refresh={() => {
                                        Modal.close(null);
                                        DeviceEventEmitter.emit('sign_password_refresh');
                                    }}
                                />
                            ),
                            isTouchMaskToClose: popup.touch_close,
                            showClose: popup.show_close,
                            title: popup.title,
                        },
                        'slide'
                    );
                } else {
                    Modal.show({
                        backButtonClose: popup.back_close,
                        cancelCallBack: () => {
                            if (popup.cancel?.action === 'back') {
                                navigation.goBack();
                            } else if (popup.cancel?.action === 'jump') {
                                jump(popup.cancel?.url, type);
                            }
                        },
                        cancelText: popup.cancel?.text,
                        confirm: popup.cancel ? true : false,
                        confirmCallBack: () => {
                            if (popup.confirm?.action === 'back') {
                                navigation.goBack();
                            } else if (popup.confirm?.action === 'jump') {
                                jump(popup.confirm?.url, type);
                            }
                        },
                        confirmText: popup.confirm?.text,
                        content: popup.content,
                        isTouchMaskToClose: popup.touch_close,
                        title: popup.title,
                    });
                }
                if (popup.log_id) {
                    http.post('/common/layer/click/20210801', {log_id: popup.log_id});
                    global.LogTool('campaignPopup', route.name, popup.log_id);
                }
            } else if (url.type === 7) {
                const toast = Toast.showLoading();
                http.get(url.path, url.params)
                    .then(async (res) => {
                        if (res.code === '000000') {
                            const {
                                app_id,
                                btn_text,
                                bucket_name,
                                file_id,
                                object_key,
                                order_no,
                                order_status,
                                questions,
                                serial_number,
                                title,
                                user_no,
                                isDebug = false,
                            } = res.result;
                            if (app_id && file_id && user_no) {
                                signInit(app_id, isDebug, (mes) => {
                                    console.log(mes);
                                });
                                setTimeout(() => {
                                    Toast.hide(toast);
                                    signFile(file_id, user_no);
                                }, 500);
                            } else if (order_no && order_status) {
                                signInit(app_id, isDebug, (mes) => {
                                    console.log(mes);
                                });
                                setTimeout(() => {
                                    Toast.hide(toast);
                                    global.order_id = order_no;
                                    signOrder(order_no, order_status);
                                }, 500);
                            } else if (app_id && questions && serial_number) {
                                //init安卓有回掉 ios没有
                                const grantedCallback = () => {
                                    recordInit(app_id, isDebug, (mes) => {
                                        if (mes == 'success') {
                                            Toast.hide(toast);
                                            startRecord(serial_number, '', questions);
                                        }
                                    });
                                    if (Platform.OS == 'ios') {
                                        setTimeout(() => {
                                            Toast.hide(toast);
                                            startRecord(serial_number, '', questions);
                                        }, 500);
                                    }
                                };
                                const permissions = Platform.select({
                                    android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO],
                                    ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
                                });
                                const statuses = await checkMultiple(permissions);
                                const arr = Object.entries(statuses);
                                let flag = false;
                                for (let i = 0; i < arr.length; i++) {
                                    switch (arr[i][1]) {
                                        case RESULTS.UNAVAILABLE:
                                            console.log(
                                                'This feature is not available (on this device / in this context)'
                                            );
                                            Toast.hide(toast);
                                            flag = true;
                                            break;
                                        case RESULTS.DENIED:
                                            console.log('The permission is DENIED');
                                            const status = await request(arr[i][0]);
                                            if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
                                                Toast.hide(toast);
                                                flag = true;
                                                blockCal(/CAMERA/.test(arr[i][0]) ? 'camera' : 'audio');
                                            } else {
                                                i === arr.length - 1 && grantedCallback();
                                            }
                                            break;
                                        case RESULTS.LIMITED:
                                            console.log('The permission is limited: some actions are possible');
                                            i === arr.length - 1 && grantedCallback();
                                            break;
                                        case RESULTS.GRANTED:
                                            console.log('The permission is granted');
                                            i === arr.length - 1 && grantedCallback();
                                            break;
                                        case RESULTS.BLOCKED:
                                            console.log('The permission is BLOCKED');
                                            Toast.hide(toast);
                                            flag = true;
                                            blockCal(/CAMERA/.test(arr[i][0]) ? 'camera' : 'audio');
                                            break;
                                        default:
                                            console.log('The permission is default');
                                            Toast.hide(toast);
                                            flag = true;
                                            break;
                                    }
                                    if (flag) {
                                        break;
                                    }
                                }
                            } else if (bucket_name && object_key) {
                                signInit(app_id, isDebug, (mes) => {
                                    console.log(mes);
                                });
                                setTimeout(() => {
                                    Toast.hide(toast);
                                    signPreview(bucket_name, object_key, title, btn_text);
                                    setTimeout(() => {
                                        DeviceEventEmitter.emit('record_preview_refresh');
                                    }, 500);
                                }, 500);
                            } else {
                                Toast.hide(toast);
                            }
                        } else {
                            Toast.hide(toast);
                            Toast.show(res.message);
                        }
                    })
                    .catch(() => {
                        Toast.hide(toast);
                    });
            } else {
                url.toast && Toast.show(url.toast);
                setTimeout(() => {
                    navigation[type](url.path, url.params || {});
                }, 10);
            }
            setTimeout(() => {
                flagRef.current = true;
            }, 500);
        }
    };
}

export default useJump;
