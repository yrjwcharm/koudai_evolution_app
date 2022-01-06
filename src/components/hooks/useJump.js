/*
 * @Date: 2021-03-01 19:48:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-01-04 15:56:23
 * @Description: 自定义跳转钩子
 */
import {useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Linking} from 'react-native';
import Toast from '../Toast';
import {Modal} from '../Modal';
import http from '../../services';
import {generateOptions} from '../../../App';
import * as WeChat from 'react-native-wechat-lib';
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
                navigation[type]('OpenPdf', {url: url.path});
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
                const {popup} = url;
                if (popup.type === 'add_wechat_guide') {
                    const options = generateOptions(popup);
                    Modal.show(options, 'slide');
                } else {
                    Modal.show({
                        cancelCallBack: () => {
                            if (popup?.cancel?.act === 'back') {
                                navigation.goBack();
                            } else if (popup?.cancel?.act === 'jump') {
                                jump(popup?.cancel?.url);
                            }
                        },
                        cancelText: popup?.cancel?.text,
                        confirm: popup?.cancel ? true : false,
                        confirmCallBack: () => {
                            if (popup?.confirm?.act === 'back') {
                                navigation.goBack();
                            } else if (popup?.confirm?.act === 'jump') {
                                jump(popup?.confirm?.url);
                            }
                        },
                        confirmText: popup?.confirm?.text,
                        content: popup?.content,
                        title: popup?.title,
                    });
                }
                if (popup.log_id) {
                    http.post('/common/layer/click/20210801', {log_id: popup.log_id});
                    global.LogTool('campaignPopup', route.name, popup.log_id);
                }
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
