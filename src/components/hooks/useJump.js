/*
 * @Date: 2021-03-01 19:48:43
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-17 16:45:41
 * @Description: 自定义跳转钩子
 */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';
import Toast from '../Toast';
function useJump() {
    const navigation = useNavigation();
    return (url, type = 'navigate') => {
        if (url) {
            if (url.type === 2) {
                Linking.canOpenURL(url.path)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show('您的设备不支持打开网址');
                        }
                        return Linking.openURL(url.path);
                    })
                    .catch((err) => Toast.show(err));
            } else if (url.type === 3) {
                navigation[type]('OpenPdf', {url: url.path});
            } else {
                navigation[type](url.path, url.params || {});
            }
        }
    };
}

export default useJump;
