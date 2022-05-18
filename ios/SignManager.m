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

@implementation SignManager;
RCT_EXPORT_MODULE();

#pragma mark JS 调用 OC
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
