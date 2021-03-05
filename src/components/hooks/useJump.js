/*
 * @Date: 2021-03-01 19:48:43
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-05 16:42:01
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
                navigation[type]({
                    name: 'OpenPdf',
                    params: {url: url.path},
                });
            } else {
                navigation[type]({name: url.path, params: url.params || {}});
            }
        }
    };
}

export default useJump;
