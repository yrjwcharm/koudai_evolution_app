/*
 * @Date: 2020-11-09 10:27:46
 * @Description: 定义app常用工具类和常量
 */
import {Alert, PixelRatio, Platform, Dimensions, PermissionsAndroid} from 'react-native';
import {check, RESULTS, request, openSettings, PERMISSIONS} from 'react-native-permissions';
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
    const rationale = {
        title: '获取权限提示',
        //相册或者相机
        message:
            permission.indexOf('STORAGE') > -1
                ? '理财魔方申请获取读取设备上的照片及文件权限。允许后，将可以查看和选择相册里的图片，图片将用于上传身份证件、社区评论发帖、头像更换、图片识别、客户服务业务场景。您可以在设置页面取消相册授权。'
                : '理财魔方申请获取拍摄照片和录制视频权限，允许后，将用于拍摄功能，拍摄图片可用于上传身份证件、社区评论发帖、头像更换、客户服务业务场景。您可以在设置页面取消摄像头权限。',
        buttonPositive: '知道了',
    };
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
                const res = await PermissionsAndroid.request(permission, rationale);
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
        value = value.replace(/[^\d.]/g, '');
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
/**
 * 判断字符串文本是否为空 包括(undefined,null,'')
 * @param str
 * @returns {boolean}
 */
function isEmpty(str) {
    if ((str ?? '') === '') {
        return true;
    }
    return false;
}
export const delMille = (num) => {
    //去除千分位中的‘，’
    if ((num ?? '') !== '') {
        let numS = num;
        numS = numS.toString();
        numS = numS.replace(/,/gi, '');
        return numS;
    } else {
        return num;
    }
};
function compareDate(date1, date2) {
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if (oDate1.getTime() >= oDate2.getTime()) {
        return true;
    } else {
        return false;
    }
}
// 如果time1大于time2 返回true 否则 返回false
function compareTime(time1, time2) {
    if (time_to_sec(time1) - time_to_sec(time2) > 0) {
        return true;
    }
    return false;
}
//将时分秒转为时间戳
function time_to_sec(time) {
    if (time !== null) {
        let s = '';
        let hour = time.split(':')[0];
        let min = time.split(':')[1];
        // let sec = time.split(":")[2];
        // s = Number(hour * 3600) + Number(min * 60) + Number(sec);
        s = Number(hour * 3600) + Number(min * 60);
        return s;
    }
}
/**
 * 解析时间戳
 * @param {number} timeStemp - 毫秒数
 * @returns {Array} - [天，时，分，秒]
 */
const resolveTimeStemp = (timeStemp) => {
    if (!timeStemp || timeStemp <= 0) return [];
    const AllSeconds = Math.round(timeStemp / 1000);
    const Seconds = AllSeconds % 60;
    const AllMinutes = (AllSeconds - Seconds) / 60;
    const Minutes = AllMinutes % 60;
    const AllHours = (AllMinutes - Minutes) / 60;
    const Hours = AllHours % 24;
    const Days = (AllHours - Hours) / 24;
    return [
        Days.toString().padStart(2, '0'),
        Hours.toString().padStart(2, '0'),
        Minutes.toString().padStart(2, '0'),
        Seconds.toString().padStart(2, '0'),
    ];
};

/**
 * 倒计时工具 - 可有效的控制执行误差在5毫秒浮动
 * @param {object} option -  配置项
 * @param {number} option.timeStemp - 时间戳，毫秒
 * @param {number} [option.interval=1000] - 间隔时间, 默认1000毫秒
 * @param {boolean} [option.immediate=false] - 是否立即执行回调
 * @param {Function} [option.callback] - 回调
 * @returns {() => void} cancel 停止计时器
 * 注（一定注意）：不管是使用此工具还是自己写，回调的整体执行时间都不应该超过interval
 * 由于js引擎对于加载损耗的优化策略，页面在显示和隐藏时会有更多的误差，需要在页面显示时重新执行
 */
const countdownTool = function ({
    timeStemp,
    interval: originalInterval = 1000,
    immediate = false,
    callback = (time) => undefined,
}) {
    if (!timeStemp || timeStemp <= 0 || timeStemp < originalInterval) return callback(0);

    let stop = false;
    const cancel = () => {
        stop = true;
    };

    let curIdx = 1;
    let interval = originalInterval;

    if (immediate) callback(timeStemp);

    let ct = Date.now();
    countdown(interval);
    function countdown(_interval) {
        if (stop) return;
        let timer = setTimeout(function () {
            clearTimeout(timer);

            let resetTime = timeStemp - originalInterval * curIdx;
            if (resetTime < 0) resetTime = 0;
            callback(resetTime);
            if (!resetTime) return;

            curIdx++;

            let ct2 = Date.now();
            let deviation = ct2 - _interval - ct;
            if (deviation >= originalInterval || deviation <= 0) deviation = 5;
            ct = Date.now();
            countdown(originalInterval - deviation - (ct - ct2));
        }, _interval);
    }

    return cancel;
};
// 数组删除一个或多个 index:从第几个开始 length:删除几个,默认为1,可不传
const arrDelete = (arr, index, length = 1) => {
    let tempArr = arr;
    arr?.splice(index, length);
    return tempArr;
};
//判断两个版本号的大小 7.1.1 8.1.1
const compareVersion = (v1, v2) => {
    if (v1 == v2) {
        return 0;
    }

    const vs1 = v1.split('.').map((a) => parseInt(a, 10));
    const vs2 = v2.split('.').map((a) => parseInt(a, 10));

    const length = Math.min(vs1.length, vs2.length);
    for (let i = 0; i < length; i++) {
        if (vs1[i] > vs2[i]) {
            return 1;
        } else if (vs1[i] < vs2[i]) {
            return -1;
        }
    }

    if (length == vs1.length) {
        return -1;
    } else {
        return 1;
    }
};
/** @name 格式化媒体时间 */
const formatMediaTime = (time) => {
    let minute = Math.floor(time / 60);
    let second = parseInt(time - minute * 60, 10);
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;
    return minute + ':' + second;
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
// 权限提示弹窗
const blockCal = (action) => {
    setTimeout(() => {
        Alert.alert(
            '权限申请',
            `${action === 'gallery' ? '相册' : '相机'}权限没打开,请前往手机的“设置”选项中,允许该权限`,
            [
                {style: 'cancel', text: '取消'},
                {
                    onPress: () => openSettings().catch(() => console.warn('无法打开设置')),
                    style: 'destructive',
                    text: '前往',
                },
            ]
        );
    }, 500);
};
const beforeGetPicture = (success = () => {}, type = 'gallery') => {
    try {
        if (Platform.OS == 'android') {
            requestAuth(
                type === 'gallery'
                    ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                    : PermissionsAndroid.PERMISSIONS.CAMERA,
                success,
                () => blockCal(type)
            );
        } else {
            requestAuth(type === 'gallery' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.IOS.CAMERA, success, () =>
                blockCal(type)
            );
        }
    } catch (err) {
        console.warn(err);
    }
};
export {
    isEmpty,
    compareDate,
    compareTime,
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
    resolveTimeStemp,
    countdownTool,
    arrDelete,
    compareVersion,
    formatMediaTime,
    beforeGetPicture,
};
