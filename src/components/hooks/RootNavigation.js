/*
 * @Date: 2022-04-27 22:55:38
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-27 23:15:15
 * @Description:没有navigation属性的时候
 */
import * as React from 'react';
import {Linking} from 'react-native';
import Toast from '../Toast';
export const navigationRef = React.createRef();

export function navigate(url, type = 'navigate') {
    if (!navigationRef.current) return;
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
        navigationRef.current[type]('OpenPdf', {url: url.path});
    } else {
        navigationRef.current[type](url.path, url.params || {});
    }
}

// add other navigation functions that you need and export them
