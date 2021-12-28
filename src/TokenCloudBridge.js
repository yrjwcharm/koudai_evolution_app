import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

// iOS和iOS暴露出的类：读卡
const {ReadCardManager} = NativeModules;
// 安卓暴露出的类：活体检测
const {FaceLivingManager} = NativeModules;
/**
 * 暴露给JS的原生类对象，通过该对象进行JS和原生模块的交互
 */
export const NativeReadCardEmitter = new NativeEventEmitter(ReadCardManager);

/**
 * 回调方法名
 */
export const MethodObj = {
    // 活体检测成功
    faceDetectSuccess: 'faceDetectSuccess',
    // 活体检测失败
    faceDetectFailed: 'faceDetectFailed',
    // 读卡成功，获取到读卡信息
    readCardSuccess: 'readCardSuccess',
    // 读卡失败
    readCardFailed: 'readCardFailed',
    // 点击确认信息页面返回按钮或确认按钮的回调
    confirmCardInfo: 'confirmConfirmInfo',
    // 确认信息页面加载失败
    confirmCardFailed: 'confirmInfoFailed',
};

/**
 * 令牌云读卡SDK初始化接口
 * @param appid 申请的应用id
 * @param loglevel 日志级别
 * @param ip ip地址(测试环境: testeidcloudread.eidlink.com, 正式环境: eidcloudread.eidlink.com)
 * @param port 端口号(9989)
 * @param envCode 环境码(测试环境: 26814，正式环境: 52302)
 * @param callback 回调(status: 0:初始化成功，1:初始化失败, errorCode: 错误码)
 */
export function tokenCloudIdentityInit(appid, loglevel, ip, port, envCode, callback) {
    if (Platform.OS === 'ios') {
        // ios
        ReadCardManager.tokencloudIdentityInit(appid, loglevel, ip, port, envCode);
        callback(0, 0);
    } else if (Platform.OS === 'android') {
        // 安卓
        ReadCardManager.init(
            appid,
            ip,
            port,
            envCode,
            1,
            () => {
                callback(0, 0);
            },
            (errorCode) => {
                callback(1, errorCode);
            }
        );
    }
}

/**
 * 令牌云活体检测SDK初始化
 * @param appid 申请的应用id
 * @param ip ip地址(测试环境: http://testnidocr.eidlink.com, 正式环境: http://idocrap.eidlink.com)
 * @param port 端口号(测试环境：9909, 正式环境：8080)
 */
export function faceLivingSDKInit(appid, ip, port) {
    if (Platform.OS === 'ios') {
        // iOS
        ReadCardManager.faceSDKInit(appid, ip, port);
    } else {
        // 安卓
        FaceLivingManager.init(appid, ip, port);
    }
}

/**
 * 检测NFC状态
 * - status
 * - 1 :NFC开启；
 * - 2 (仅限安卓):未开启
 * - 3 :不支持NFC;
 * - 4 (仅限iOS):NFC不可用,版本过低，iOS14.5以上才可使用
 * @param callback error 错误对象,没有错误时为null; status: 当前状态值
 * 由于系统限制，iOS无法判断当前NFC未开启的状态
 */
export function detectNFCStatus(callback) {
    if (Platform.OS === 'ios') {
        // iOS
        ReadCardManager.detectNFCStatus((events) => {
            let status = events[0];
            if (callback) {
                callback(status);
            }
        });
    } else {
        // 安卓
        /**
         * nfcState: 1:开启 2:未开启 3:不支持
         */
        ReadCardManager.getNfcState((state) => {
            callback(state);
        });
    }
}

/**
 * 进入令牌云读卡页面
 * @param uiConfig 主题配置json字符串
 * ----
 * readTitle: 读卡标题，默认为：身份认证，仅需一贴
 * readTitleColor: 读卡标题颜色，默认为：#333333
 * readBtnTextColor: 读卡按钮文字颜色，默认为：#FFFFFF
 * readBtnBgColor: 读卡按钮背景颜色，默认为：#333333
 * bottomTipText: 读卡底部提示文本，默认为：个人信息已加密保护
 * bottomTipTextColor: 读卡底部提示文本颜色，默认为：#CDCDCD
 * sureMessageTextColor: 确认信息按钮文字颜色，默认为：#FFFFFF
 * sureMessageBgColor: 确认信息按钮背景颜色，默认为：#333333
 * bottomTipImageDrawableBase64:盾牌icon base64,不传或置空为默认
 * openNfcBtnBgColor: 打开nfc按钮的背景颜色，默认为：#333333
 * openNfcBtnTextColor: 打开nfc按钮文字颜色，默认为：#FFFFFF
 */
export function enterToReadCardPage(uiConfig) {
    if (Platform.OS === 'ios') {
        // iOS
        ReadCardManager.gotoReadCardController(uiConfig);
    } else {
        // 安卓
        ReadCardManager.showReadCardActivity(uiConfig);
    }
}

/**
 * 进入令牌云确认信息页面
 * @param cardInfoString 身份证9要素json字符串
 */
export function enterToConfirmInfoPage(cardInfoString) {
    if (Platform.OS === 'ios') {
        // iOS
        ReadCardManager.gotoConfirmInfoController(cardInfoString);
    } else {
        // 安卓
        ReadCardManager.showResultActivity(cardInfoString);
    }
}

/**
 * 进入活体检测页面；注意: 读卡配置的如果是测试环境，活体检测配置的必须也为测试环境
 * @param reqID 读卡页面获取到的请求ID
 */
export function enterFaceDetectPage(reqID) {
    if (Platform.OS === 'ios') {
        ReadCardManager.enterFaceDetectController(reqID);
    } else {
        FaceLivingManager.showFaceLivingActivity(reqID);
    }
}

// 以下方式仅限安卓使用，可替换为自定义加载提示
/**
 * 申请相机权限-仅安卓使用
 * @param callback 返回申请的状态
 */
export function androidApplyCameraPermission(callback) {
    FaceLivingManager.applyCameraPermission(
        () => {
            callback(true);
        },
        () => {
            callback(false);
        }
    );
}

/**
 * 显示加载提示框-仅安卓使用
 */
export function androidShowLoading() {
    ReadCardManager.showLoadingView();
}

/**
 * 隐藏加载提示框-仅安卓使用
 */
export function androidHideLoading() {
    ReadCardManager.hideLoadingView();
}
