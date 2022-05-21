/*
 * @Date: 2022-05-12 16:15:49
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-05-21 12:27:44
 * @Description:签约桥接
 */
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

// iOS和iOS暴露出的类：读卡
const {SignManager, RecordManager} = NativeModules;
/**
 * 暴露给JS的原生类对象，通过该对象进行JS和原生模块的交互
 */
export const NativeSignManagerEmitter = new NativeEventEmitter(SignManager);
export const NativeRecordManagerEmitter = new NativeEventEmitter(RecordManager);
/**
 * 回掉事件名
 */
export const MethodObj = {
    signFileSuccess: 'signFileSuccess', //签署成功
    recordSuccess: 'recordSuccess', //双录成功
};

/**
 * 签署初始化
 * @param appid 申请的应用id
 * @param isDebug 是否开启调试
 * @param callback 回调
 */
export function signInit(appid, isDebug) {
    if (Platform.OS === 'ios') {
        // envCode 1 测试 0 生产
        SignManager.init(appid, isDebug ? 1 : 0);
    } else if (Platform.OS === 'android') {
        // 安卓
        SignManager.init(appid, isDebug);
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

//文件预览
export function signPreview(bucketName, ObjectKey, title, btnText) {
    SignManager.previewFile(bucketName, ObjectKey, title, btnText);
}
//双录初始化
export function recordInit(appid, isDebug, callback) {
    if (Platform.OS === 'ios') {
        RecordManager.init(appid, !isDebug);
    } else {
        RecordManager.init(appid, isDebug, callback, callback);
    }
}
//双录开始
export function startRecord(serialNo, ttdOrderNo, talking) {
    RecordManager.startRecord(serialNo, ttdOrderNo, JSON.stringify(talking));
}
