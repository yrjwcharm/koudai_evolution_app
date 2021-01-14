/*
 * @Date: 2020-11-09 10:27:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 11:51:17
 * @Description: 定义app常用工具类和常量
 */
import {PixelRatio, Platform, Dimensions, PermissionsAndroid} from 'react-native';
const deviceHeight = Dimensions.get('window').height; //设备的高度
const deviceWidth = Dimensions.get('window').width; //设备的宽度
let pixelRatio = PixelRatio.get();
const defaultPixel = 2; //iphone6的像素密度
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
//inPhone11
const ELE_WIDTH = 414;
const ELE_HEIGHT = 896;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2); //获取缩放比例
/**
 * @description: 字体适配
 * @param {*} size
 * @return {*} 适配的字体大小
 */
function px(size) {
    if (pixelRatio >= 3 && Platform.OS == 'ios' && size == 1) {
        return size;
    }
    return Math.round(size * scale);
}

/**
 * 判断是刘海屏
 */
function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
            (deviceHeight === ELE_HEIGHT && deviceWidth === ELE_WIDTH))
    );
}
/**
 * 申请安卓权限
 */
const requestExternalStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        return granted;
    } catch (err) {
        console.error('Failed to request permission ', err);
        return null;
    }
};
//获取安全区域高度
// function getStatusBarHeight() {
//     if (Platform.OS == 'ios') {
//         return new Promise((resolve) => {
//             StatusBarManager.getHeight((statusBarHeight) => {
//                 resolve(statusBarHeight.height);
//             });
//         });
//     } else {
//         return StatusBar.currentHeight;
//     }
// }
export {deviceWidth, deviceHeight, isIphoneX, px, requestExternalStoragePermission};
