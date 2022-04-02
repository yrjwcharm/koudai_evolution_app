/*
 * @Date: 2020-11-09 10:27:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-02 10:41:36
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
const requestAuth = async (permission, grantedCallback, blockCallBack) => {
    if (Platform.OS == 'ios') {
        check(permission)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        request(permission).then((res) => {
                            if (res == 'blocked') {
                                blockCallBack
                                    ? blockCallBack()
                                    : openSettings().catch(() => console.warn('cannot open settings'));
                            } else {
                                grantedCallback();
                            }
                        });
                        console.log('The permission has not been requested / is denied but requestable');
                        break;
                    case RESULTS.LIMITED:
                        console.log('The permission is limited: some actions are possible');
                        grantedCallback();
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
const formaNum = (num, type = '') => {
    const arr = !isNaN(num * 1) ? (num * 1).toFixed(2).split('.') : [];
    if (arr[0]) {
        const lessThanZero = arr[0].indexOf('-') !== -1;
        num = lessThanZero ? arr[0].slice(1) : arr[0];
        let result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        result = lessThanZero ? `-${result}` : result;
        // if (arr[1] === '00') {
        //     return result;
        // } else if (arr[1] && arr[1][1] === '0') {
        //     return `${result}.${arr[1][0]}`;
        // } else {
        //     return `${result}.${arr[1]}`;
        // }
        if (type) {
            return result;
        }
        return `${result}.${arr[1]}`;
    } else {
        return num;
    }
};
//手机号脱敏处理
const handlePhone = (mobile) => {
    return mobile ? mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2') : '';
};
//处理tag 颜色
//3: 购买（红色） 4:赎回（绿色）6或10:调仓（蓝色） 7:分红（红色）
const tagColor = (type) => {
    if (type == 4) {
        return {
            text_color: '#4BA471',
            bg_color: '#EDF7EC',
        };
    } else if (type == 6 || type == 10) {
        return {
            text_color: '#0051CC',
            bg_color: '#EFF5FF',
        };
    } else if (type == 100) {
        return {
            text_color: '#FF7D41',
            bg_color: '#FFF5E5',
        };
    } else {
        return {
            text_color: '#E74949',
            bg_color: '#FFF2F2',
        };
    }
};
// -1 交易失败（红色）1:确认中（橙色）6:交易成功(绿色) 7:撤单中(灰色) 9:已撤单（灰色）
const getTradeColor = (type) => {
    var color = '';
    switch (type) {
        case -1:
            color = '#E74949';
            break;
        case 0:
        case 1:
            color = '#EB7121';
            break;
        case 6:
            color = '#4BA471';
            break;
        default:
            color = '#9095A5';
            break;
    }
    return color;
};
const parseAmount = (value) => {
    if (value.length > 4) {
        return value / 10000 + '万';
    }
    return value;
};
//输入正整数
const inputInt = (value) => {
    return value ? value.replace(/[^\d]/g, '') : '';
};
/**
 * @description: 金额输入框
 * @param {value} 需要转化的字符串
 * @param {integer} 是否是正整数 默认两位小数
 * @return {*}
 */
const onlyNumber = (value, integer = false) => {
    if (value && typeof value == 'string') {
        //先把非数字的都替换掉，除了数字和.
        value = value.replace(/[^\d\.]/g, '');
        //前两位不能是0加数字
        value = value.replace(/^0\d[0-9]*/g, '');
        if (integer) {
            value = value.replace(/\.\d*/g, '');
        } else {
            //必须保证第一个为数字而不是.
            value = value.replace(/^\./g, '');
            //保证.只出现一次，而不能出现两次以上
            value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
            //若是第一位是负号，则容许添加
            value = value.replace(/(\d+)\.(\d\d).*$/, '$1.$2');
        }

        return value;
    } else {
        return '';
    }
};
//防抖(立即执行)

const debounce = (fn, delay = 500, isImmediate = true) => {
    let timer = null;
    let flag = true;
    if (isImmediate === true) {
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (flag === true) {
                fn.apply(this, arguments);
                flag = false;
            }
            timer = setTimeout(() => {
                flag = true;
                timer = null;
            }, delay);
        };
    } else {
        return function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments);
                timer = null;
            }, delay);
        };
    }
};
const parseQuery = function (query) {
    var reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
    var obj = {};
    while (reg.exec(query)) {
        obj[RegExp.$1] = RegExp.$2;
    }
    return obj;
};
function once(fn) {
    return function () {
        if (fn) {
            fn.apply(this, arguments);
            fn = null;
        }
    };
}

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
    requestAuth,
    formaNum,
    handlePhone,
    tagColor,
    getTradeColor,
    parseAmount,
    inputInt,
    onlyNumber,
    debounce,
    parseQuery,
    once,
};
