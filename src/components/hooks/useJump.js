/*
 * @Date: 2021-03-01 19:48:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-12-23 16:49:16
 * @Description: 自定义跳转钩子
 */
import {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';
import Toast from '../Toast';
import {Modal} from '../Modal';
import * as WeChat from 'react-native-wechat-lib';
function useJump() {
    const navigation = useNavigation();
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
                const {pop} = url;
                Modal.show({
                    cancelCallBack: () => {
                        if (pop?.cancel?.act === 'back') {
                            navigation.goBack();
                        } else if (pop?.cancel?.act === 'jump') {
                            jump(pop?.cancel?.url);
                        }
                    },
                    cancelText: pop?.cancel?.text,
                    confirm: pop?.cancel ? true : false,
                    confirmCallBack: () => {
                        if (pop?.confirm?.act === 'back') {
                            navigation.goBack();
                        } else if (pop?.confirm?.act === 'jump') {
                            jump(pop?.confirm?.url);
                        }
                    },
                    confirmText: pop?.confirm?.text,
                    content: pop?.content,
                    title: pop?.title,
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
