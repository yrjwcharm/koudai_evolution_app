//
//  ReadCardManager.m
//  TokenCloud
//
//  Created by brucelin on 2021/11/19.
//

#import "ReadCardManager.h"
#import <React/RCTLog.h>
#import "AppDelegate.h"
#import <React/RCTUtils.h>
#import <TKCloudSDK/TKCloudManager.h>
#import <FaceSdk_NoSilent/JLFaceSdkManager.h>
#import "MJExtension.h"
#import "IDCardModel.h"

// 活体检测成功
#define method_faceDetectSuccess @"faceDetectSuccess"
// 活体检测失败
#define method_faceDetectFailed @"faceDetectFailed"
// 成功的回调,获取到reqid
#define method_readCardSuccess @"readCardSuccess"
// 读卡失败
#define method_readCardFailed @"readCardFailed"
// 确认信息的回调，获取到正反面图像
#define method_confirmCardInfo @"confirmConfirmInfo"
// 确信页面页面加载异常
#define method_confirmInfoFailed @"confirmInfoFailed"


@interface ReadCardManager()<TKCloudManagerDelegate, JLFaceManagerDelegate>

@end

@implementation ReadCardManager {
  bool hasListeners;
  NSString *_reqID;
  NSString *_appID;
  NSString *_faceAppID;
  NSString *_faceIP;
  NSString *_facePort;
}

RCT_EXPORT_MODULE();
/**
 * These methods will be called when the first observer is added and when the
 * last observer is removed (or when dealloc is called), respectively. These
 * should be overridden in your subclass in order to start/stop sending events.
 */
- (void)startObserving {
  [TKCloudManager shareTKCloudManager].delegate = self;
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

#pragma mark OC 调用 JS
/**
 针对本SDK，此为回调事件
 */
- (NSArray<NSString *> *)supportedEvents
{
  return @[method_faceDetectSuccess,
           method_faceDetectFailed,
           method_readCardSuccess,
           method_confirmCardInfo,
           method_readCardFailed,
           method_confirmInfoFailed];
}

#pragma mark JS 调用 OC
/// 初始化方法
RCT_EXPORT_METHOD(tokencloudIdentityInit:(NSString *)appId logLevel:(int)logLevel ip:(NSString *)ip port:(int)port envCode:(NSUInteger)envCode) {
  _appID = appId;
  [[TKCloudManager shareTKCloudManager]initWithAppID:appId Loglevel:logLevel IP:ip Port:port envCode:envCode];
}

/// 活体初始化
RCT_EXPORT_METHOD(faceSDKInit:(NSString *)appId ip:(NSString *)ip port:(NSString *)port) {
  _faceAppID = appId;
  _faceIP = ip;
  _facePort = port;
}

/// 判断是否支持NFC
RCT_EXPORT_METHOD(detectNFCStatus:(RCTResponseSenderBlock)callback) {
  TKNFCStatus status = [[TKCloudManager shareTKCloudManager] detectNFCStatus];
  /// 此举为了和安卓统一
  NSInteger s = 0;
  switch (status) {
    case TKNFCStatusOpen:
      s = 1;
      break;
    case TKNFCStatusNotSupported:
      s = 3;
      break;
    case TKNFCStatusVersionLow:
      s = 4;
      break;
  }
  NSArray *events = @[@(s)];
  callback(@[events]);
}

/// 进入读卡页面
RCT_EXPORT_METHOD(gotoReadCardController:(NSString *)uiConfigString) {
  dispatch_async(dispatch_get_main_queue(), ^{
    self->_reqID = @"";
    NSDictionary *cardDict = nil;
    NSError *error = nil;
    if (uiConfigString.length > 0) {
      cardDict = [NSJSONSerialization JSONObjectWithData:[uiConfigString dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableLeaves error:&error];
    }
    UIConfigModel *configM = [[TKCloudManager shareTKCloudManager]getUIConfigModel];
    if (error) {
      configM = nil;
    } else {
      configM.readTitle = [cardDict objectForKey:@"readTitle"];
      configM.readTitleColor = [cardDict objectForKey:@"readTitleColor"];
      configM.readBtnTextColor = [cardDict objectForKey:@"readBtnTextColor"];
      configM.readBtnBgColor = [cardDict objectForKey:@"readBtnBgColor"];
      configM.bottomTipText = [cardDict objectForKey:@"bottomTipText"];
      configM.bottomTipTextColor = [cardDict objectForKey:@"bottomTipTextColor"];
      configM.sureMessageTextColor = [cardDict objectForKey:@"sureMessageTextColor"];
      configM.sureMessageBgColor = [cardDict objectForKey:@"sureMessageBgColor"];
      NSString *base64 = [cardDict objectForKey:@"bottomTipImageDrawableBase64"];
      if (base64.length > 0) {
        NSData *tipData = [[NSData alloc]initWithBase64EncodedString:base64 options:NSDataBase64DecodingIgnoreUnknownCharacters];;
        UIImage *tipImage = [UIImage imageWithData:tipData];
        configM.bottomTipImage = tipImage;
      } else {
        configM.bottomTipImage = nil;
      }
    }
    [[TKCloudManager shareTKCloudManager] startReadIDCardWithController:[self findVisibleViewController] uiconfig:configM];
  });
}

/// 进入确认信息页面
/// cardInfoString: 9要素json字符串
RCT_EXPORT_METHOD(gotoConfirmInfoController:(NSString *)cardInfoString) {
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    NSError *error = nil;
    NSDictionary *cardDict = [NSJSONSerialization JSONObjectWithData:[cardInfoString dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableLeaves error:&error];
    
    IDCardModel *model = [IDCardModel mj_objectWithKeyValues:cardDict];
    [[TKCloudManager shareTKCloudManager] toConfirmInfoPageWithController:[self findVisibleViewController] idCardModel:model];
  });
}

/// 开启活体检测
RCT_EXPORT_METHOD(enterFaceDetectController:(NSString *)reqID) {
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    JLFaceSdkManager *faceManager = [[JLFaceSdkManager alloc]initJLDetectionWithVC:delegate.window.rootViewController appID:self->_faceAppID reqID:reqID IP:self->_faceIP port:self->_facePort];
    faceManager.faceManagerDelegate = self;
    faceManager.navbarColor = [UIColor redColor];
    faceManager.btnColor = [UIColor blueColor];
    /**
     *  活体动作检测超时时间，默认8s。
     */
    faceManager.livessTime = 8;
    /**
     *  活体检测动作个数 默认为3个动作  可在此直接设置1-4个动作
     */
    faceManager.livessNumber = 3;
    // 请求服务器数据
    [faceManager detectionStart];
  });
}



#pragma mark 发送通知,告知RN，调用JS

#pragma mark 活体检测结果
/**
 活体检测成功
 */
- (void)JLDetectionDidFinsh {
  NSDictionary *dataDict = @{@"reqId": _reqID};
  [self sendEventWithName:method_faceDetectSuccess body:dataDict];
}
/**
 活体检测失败,请重试
 */
- (void)JLDetectionDidFinshWithError:(NSString *)errCode errInfo:(NSString *)errInfo {
  NSLog(@"errCode: %@, errInfo: %@", errCode, errInfo);
  NSDictionary *dataDict = @{@"errorCode": errCode, @"errorMessage": errInfo};
  [self sendEventWithName:method_faceDetectFailed body:dataDict];
}

#pragma mark TKCloudManager代理
/**
 读卡成功，获取到ReqID
 */
- (void)TKCloudManager:(TKCloudManager *)manager readCardSuccessWith:(NSString *)ReqID {
  if (hasListeners) {
    // 存储 reqID 用于活体检测
    _reqID = ReqID;
    NSDictionary *dataDict = @{@"reqId": _reqID};
    [self sendEventWithName:method_readCardSuccess body:dataDict];
  }
}

/**
 读卡失败
 @param manager 读卡管理器
 @param errCode 错误码
 @param errMsg 错误信息
 - 10001: 读卡超时
 - 10002: 读卡失败
 - 10003: 设备不支持NFC
 - 10004: 用户取消读卡操作，点击读卡页面左上角返回按钮
 - 10005: 用户取消读卡操作, 3次取消读卡后，点击选择其他方式
 */
- (void)TKCloudManager:(TKCloudManager *)manager readCardFailed:(NSInteger)errCode errMsg:(NSString *)errMsg {
  if (hasListeners) {
    NSDictionary *dataDict = @{
      @"errorCode": @(errCode),
      @"errorMessage": errMsg
    };
    [self sendEventWithName:method_readCardFailed body:dataDict];
  }
}

/**
 用户在确认信息页面返回获取到正反面图片
 @param manager 读卡管理器
 @param type 点击类型，0: 点击左上角返回按钮 1: 点击确认信息按钮
 @param frontImage 正面身份证照(头像页)
 @param backImage 反面身份证照(国徽页)
 @param combinationImg 正反面合成照片
 */
- (void)TKCloudManager:(TKCloudManager *)manager tapType:(NSInteger)type userConfirmedCardInfoWithFrontImage:(UIImage *)frontImage backImage:(UIImage *)backImage CombinationImage:(UIImage *)combinationImg {
  if (hasListeners) {
    NSDictionary *dataDict = @{
      @"frontBitmapBase64Str": [self encodeToBase64String:frontImage],
      @"backBitmapBase64Str": [self encodeToBase64String:backImage],
      @"fullBitmapBase64Str": [self encodeToBase64String:combinationImg],
      @"code": @(type)
    };
    [self sendEventWithName:method_confirmCardInfo body:dataDict];
  }
}

/**
 确信页面页面加载异常
 触发场景：传入数据 model/字典 内字段值在sdk内部解析失败，无法正确展示UI页面
 */
- (void)TKCloudManagerToConfirmInfoFailed:(TKCloudManager *)manager {
  if (hasListeners) {
    NSDictionary *dataDict = @{};
    [self sendEventWithName:method_confirmInfoFailed body:dataDict];
  }
}

#pragma mark 私有方法
- (NSString *)encodeToBase64String:(UIImage *)image {
 return [UIImagePNGRepresentation(image) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

- (UIViewController *)findVisibleViewController {
    AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    NSAssert(delegate.window, @"The window is empty");
    UIViewController* currentViewController = delegate.window.rootViewController;
    BOOL runLoopFind = YES;
    while (runLoopFind) {
        if (currentViewController.presentedViewController) {
            currentViewController = currentViewController.presentedViewController;
        } else {
            if ([currentViewController isKindOfClass:[UINavigationController class]]) {
                currentViewController = ((UINavigationController *)currentViewController).visibleViewController;
            } else if ([currentViewController isKindOfClass:[UITabBarController class]]) {
                currentViewController = ((UITabBarController* )currentViewController).selectedViewController;
            } else {
                break;
            }
        }
    }
    return currentViewController;
}


@end
