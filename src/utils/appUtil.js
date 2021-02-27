/*
 * @Date: 2020-11-09 10:27:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-25 14:56:00
 * @Description: 定义app常用工具类和常量
 */
import {PixelRatio, Platform, Dimensions, PermissionsAndroid} from 'react-native';
import {check, RESULTS, request, openSettings} from 'react-native-permissions';
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
 * 判断权限申请
 */
const requestExternalStoragePermission = async (permission, grantedCallback, blockCallBack) => {
    if (Platform.OS == 'ios') {
        check(permission)
            .then((result) => {
                console.log(result);
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        request(permission).then((res) => {
                            console.log(res);
                        });
                        console.log('The permission has not been requested / is denied but requestable');
                        break;
                    case RESULTS.LIMITED:
                        console.log('The permission is limited: some actions are possible');
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        grantedCallback();
                        break;
                    case RESULTS.BLOCKED:
                        blockCallBack
                            ? blockCallBack()
                            : openSettings().catch(() => console.warn('cannot open settings'));
                        console.log('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch((error) => {
                // …
            });
    } else {
        try {
            let granted = await PermissionsAndroid.check(permission);
            console.log(granted);
            if (!granted) {
                const res = await PermissionsAndroid.request(permission);
                if (res !== 'granted') {
                    blockCallBack ? blockCallBack() : openSettings().catch(() => console.warn('cannot open settings'));
                } else {
                    console.log('The permission is granted');
                    grantedCallback();
                }
            } else {
                console.log('The permission is granted');
                grantedCallback();
            }
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    }
};
/**
 * @description: 格式化数字 每三位增加逗号
 * @param {*} formaNum
 * @return {*} 格式化后的字符串
 */
const formaNum = (num) => {
    var num = (num || 0).toString(),
        result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
};
//手机号脱敏处理
const handlePhone = (mobile) => {
    return mobile ? mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2') : '';
};
//处理tag 颜色
//3: 购买（红色） 4:赎回（绿色）6:调仓（蓝色） 7:分红（红色）
const tagColor = (type) => {
    if (type == 4) {
        return {
            text_color: '#4BA471',
            bg_color: '#EDF7EC',
        };
    } else if (type == 6) {
        return {
            text_color: '#0051CC',
            bg_color: '#EFF5FF',
        };
    } else {
        return {
            text_color: '#E74949',
            bg_color: '#FFF2F2',
        };
    }
};
// -1 交易失败（红色）1:确认中（橙色）6:交易成功(绿色) 7:撤单中(橙色) 9:已撤单（灰色）
const getTradeColor = (type) => {
    var color = '';
    switch (type) {
        case -1:
            color = '#E74949';
            break;
        case 1:
            color = '#EB7121';
            break;
        case 6:
            color = '#4BA471';
            break;
        case 7:
            color = '#EB7121';
            break;
        default:
            color = '#9095A5';
            break;
    }
    return color;
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
export {
    deviceWidth,
    deviceHeight,
    isIphoneX,
    px,
    requestExternalStoragePermission,
    formaNum,
    handlePhone,
    tagColor,
    getTradeColor,
};
