/*
 * @Date: 2021-03-01 19:48:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-30 11:15:08
 * @Description: 自定义跳转钩子
 */
import React, {useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {DeviceEventEmitter, Linking, Platform} from 'react-native';
import Toast from '../Toast';
import {Modal} from '../Modal';
import http from '../../services';
import {generateOptions} from './useStateChange';
import {PopupContent} from '../../pages/PE/ObjectChoose';
import * as WeChat from 'react-native-wechat-lib';
import {recordInit, signFile, signInit, signPreview, startRecord} from '../../pages/PE/PEBridge';

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
                                    : '您的设备不支持打开网址'
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
                if (Object.keys(popup).length === 0) {
                    return false;
                }
                if (popup.type === 'add_wechat_guide') {
                    const options = generateOptions(popup);
                    Modal.show(options, 'slide');
                } else if (popup.type === 'choose_object' || popup.type === 'sign_password') {
                    Modal.show(
                        {
                            children: (
                                <PopupContent
                                    data={popup}
                                    refresh={() => {
                                        Modal.close(null);
                                        DeviceEventEmitter.emit('refresh');
                                    }}
                                />
                            ),
                            isTouchMaskToClose: popup.touch_close,
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
                                jump(popup.cancel?.url);
                            }
                        },
                        cancelText: popup.cancel?.text,
                        confirm: popup.cancel ? true : false,
                        confirmCallBack: () => {
                            if (popup.confirm?.action === 'back') {
                                navigation.goBack();
                            } else if (popup.confirm?.action === 'jump') {
                                jump(popup.confirm?.url);
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
                http.get(url.path, url.params).then((res) => {
                    if (res.code === '000000') {
                        const {
                            app_id,
                            btn_text,
                            bucket_name,
                            file_id,
                            object_key,
                            questions,
                            serial_number,
                            title,
                            user_no,
                        } = res.result;
                        if (app_id && file_id && user_no) {
                            signInit(app_id, true, (mes) => {
                                console.log(mes);
                            });
                            setTimeout(() => {
                                Toast.hide(toast);
                                signFile(file_id, user_no);
                            }, 200);
                        } else if (app_id && questions && serial_number) {
                            //init安卓有回掉 ios没有
                            recordInit(app_id, true, (mes) => {
                                if (mes == 'success') {
                                    Toast.hide(toast);
                                    startRecord(serial_number, '', questions);
                                }
                            });
                            if (Platform.OS == 'ios') {
                                setTimeout(() => {
                                    Toast.hide(toast);
                                    startRecord(serial_number, '', questions);
                                }, 200);
                            }
                        } else if (bucket_name && object_key) {
                            signInit(app_id, true, (mes) => {
                                console.log(mes);
                            });
                            setTimeout(() => {
                                Toast.hide(toast);
                                signPreview(bucket_name, object_key, title, btn_text);
                            }, 200);
                        } else {
                            Toast.hide(toast);
                        }
                    } else {
                        Toast.hide(toast);
                        Toast.show(res.message);
                    }
                });
            } else {
                navigation[type](url.path, url.params || {});
            }
            setTimeout(() => {
                flagRef.current = true;
            }, 500);
        }
    };
}

export default useJump;
