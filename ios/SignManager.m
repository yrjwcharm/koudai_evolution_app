//
//  SignManager.m
//  EvolutionApp
//
//  Created by edz on 2022/5/13.
//


#import <TTDSignSDK/TTDSignSDK.h>
#import "SignManager.h"
#import <React/RCTLog.h>
#import "AppDelegate.h"
#import <React/RCTUtils.h>
//签署成功
#define method_signFileSuccess @"signFileSuccess"
#define method_signSuccess @"signSuccess"
@implementation SignManager;
RCT_EXPORT_MODULE();
#pragma mark JS 调用 OC

/**
 针对本SDK，此为回调事件
 */
- (NSArray<NSString *> *)supportedEvents
{
  return @[method_signFileSuccess,method_signSuccess];
}
/// 初始化方法
RCT_EXPORT_METHOD(init:(NSString *)appId isDebug:(int)isDebug) {
  // Override point for customization after application launch.
  // envCode 1 测试 0 生产
  [[TTDSignSDK shareSDK] setupEnv:isDebug appId:appId];
  NSLog(@"%@",[TTDSignSDK getSDKVersion]);
}

// 设置orderNo，进⼊订单签署⻚⾯
RCT_EXPORT_METHOD(signOrder:(NSString *)orderNo orderStatus:(NSInteger *)orderStatus) {
  dispatch_async(dispatch_get_main_queue(), ^{
  // present前需要设置 TTDSignVCShowTypePresent
  [TTDSignSDK shareSDK].signVCShowType = TTDSignVCShowTypePresent;
  UIViewController *vc = [[TTDSignSDK shareSDK] getSignedVcWithOrderNo:orderNo orderStatus:orderStatus delegate:self];
    [[self findVisibleViewController] presentViewController:vc animated:YES completion:nil];
  });
}
//进入文件签署页面
RCT_EXPORT_METHOD(signFile:(NSString *)fileId userNo:(NSString *)userNo) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSMutableDictionary *dic = [NSMutableDictionary new];

    if ([fileId isEqualToString:@""]) {
        return;
    }
    [dic setObject:fileId forKey:@"fileId"];
    [dic setObject:userNo forKey:@"userNo"];
    [dic setObject:@"1" forKey:@"signType"];
    [TTDSignSDK shareSDK].signVCShowType = TTDSignVCShowTypePresent;
//    [TTDSignSDK shareSDK].signVCShowType = TTDSignVCShowTypePush;
    UIViewController *vc = [[TTDSignSDK shareSDK]  getSignedVcWithFileInfo:dic delegate:self];
    [[self findVisibleViewController] presentViewController:vc animated:YES completion:nil];
  });
}

//文件预览页面
RCT_EXPORT_METHOD(previewFile:(NSString *)bucketName ObjectKey:(NSString *)ObjectKey title:(NSString *)title btnText:(NSString *)btnText) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [TTDSignSDK shareSDK].signVCShowType = TTDSignVCShowTypePresent;
        UIViewController *vc = [[TTDSignSDK shareSDK] getPreviewVcWithBucketName:bucketName objectKey:ObjectKey previewTitle:title previewButtonTitle:btnText delegate:self];
        
    [[self findVisibleViewController] presentViewController:vc animated:YES completion:nil];
  });
}
//MARK: 订单签署成功回调
-(void)signSuccess:(TTDSignSDK *)signSdk signStatus:(NSInteger)signStatus orderStatus:(NSInteger)orderStatus resultInfo:(NSArray *)files
{
    /// @param signStatus 订单签署前的订单状态
    /// @param orderStatus 订单签署后的订单状态
    /// @param files 字典的数组
    /// {
    ///   url  -> string   (签署后文件url)
    ///   bucketName  -> string   (文件bucket，一般与objectKey一起使用）
    ///   objectKey -> string  (文件key，一般与bucketName一起使用)
    ///   version -> string   (签署文件版本，用于标识补充协议)
    /// }
    NSLog(@"订单签署成功 %@",files);
  NSDictionary *dataDict = @{
    @"sign_status": @(signStatus),
    @"order_status": @(orderStatus),
  };
  [self sendEventWithName:method_signSuccess body:dataDict];
//  NSDictionary *dic = [NSDictionary new];
//  [dic setObject:signStatus forKey:@"signStatus"];
//  [dic setObject:orderStatus forKey:@"orderStatus"];
//  [self sendEventWithName:method_signSuccess body:dic];
//    [self performSelector:@selector(alertMessage:) withObject:[NSString stringWithFormat:@"%@",files] afterDelay:0.3];
}
//MARK: 自定义文件签署成功回调
-(void)signFileSuccess:(TTDSignSDK *)signSdk responseInfo:(NSDictionary *)dic
{
    /// @param dic 签署成功信息
    /// {
    ///     fileId;     //文件ID
    ///     backetName; //获取文件的name
    ///     objectKey;  //获取文件的key
    ///     url;        //文件URL
    ///     pdfPage;    //文件页码
    ///     investorState;  //投资者签署状态。1，已签署 0,待签署
    ///     manageState;    //管理人签署状态。1，已签署 0,待签署
    ///     plannerState;   //理财经理签署状态。1，已签署 0,待签署
    /// }
    NSLog(@"自定义文件签署成功 %@",dic);
  [self sendEventWithName:method_signFileSuccess body:dic];
//    [self performSelector:@selector(alertMessage:) withObject:[NSString stringWithFormat:@"%@",dic] afterDelay:0.3];
}
//MARK: SDK报错关闭回调
-(void)onError:(TTDSignSDK *)signSdk errorCode:(TTDErrorCode)errorCode errorMsg:(NSString *)errorMsg
{
    NSLog(@"onError %ld, %@",(long)errorCode,errorMsg);
//    [self performSelector:@selector(alertErrorMessage:) withObject:errorMsg afterDelay:1];
}

#pragma mark 私有方法

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
