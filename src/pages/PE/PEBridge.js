/*
 * @Date: 2022-05-12 16:15:49
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-05-18 11:44:41
 * @Description:签约桥接
 */
import {func} from 'prop-types';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

// iOS和iOS暴露出的类：读卡
const {SignManager, RecordManager} = NativeModules;
/**
 * 暴露给JS的原生类对象，通过该对象进行JS和原生模块的交互
 */
// export const NativeReadCardEmitter = new NativeEventEmitter(ReadCardManager);

/**
 * 签署初始化
 * @param appid 申请的应用id
 * @param isDebug 是否开启调试
 * @param callback 回调
 */
export function signInit(appid, isDebug, callback) {
    if (Platform.OS === 'ios') {
        // envCode 1 测试 0 生产
        SignManager.init(appid, isDebug ? 1 : 0);
    } else if (Platform.OS === 'android') {
        // 安卓
        SignManager.init(
            appid,
            isDebug,
            () => {
                callback(0, 0);
            },
            (errorCode) => {
                callback(1, errorCode);
            }
        );
    }
}
//  订单签署
export function signOrder(orderNo, orderStatus) {
    SignManager.signOrder(orderNo, orderStatus);
}

//文件签署
export function signFile(filedId, userNo) {
    SignManager.signFile(filedId, userNo);
}

//双录初始化
export function recordInit(appid, isDebug, callback) {
    if (Platform.OS === 'ios') {
        RecordManager.init(appid, isDebug);
    } else {
        RecordManager.init(appid, isDebug, callback);
    }
}
//双录开始
export function startRecord(serialNo, ttdOrderNo, successCallback, errorCallback) {
    if (Platform.OS == 'android') {
        RecordManager.startRecord(serialNo, ttdOrderNo, successCallback, errorCallback);
    } else {
        RecordManager.startRecord(serialNo, ttdOrderNo);
    }
}
