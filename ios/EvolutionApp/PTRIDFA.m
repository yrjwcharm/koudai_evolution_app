//
//  PTRIDFA.m
//  IDFA
//
//  Created by Tomas Roos on 22/07/16.
//  Copyright © 2016 Tomas Roos. All rights reserved.
//

#import "PTRIDFA.h"
#import <React/RCTUtils.h>
#import <UIKit/UIKit.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <AdSupport/ASIdentifierManager.h>

@implementation PTRIDFA

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(getIDFA:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (@available(iOS 14, *)) {
            // iOS14及以上版本需要先请求权限
            [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                // 获取到权限后，依然使用老方法获取idfa
                if (status == ATTrackingManagerAuthorizationStatusAuthorized) {
                    NSUUID *IDFA = [[ASIdentifierManager sharedManager] advertisingIdentifier];
                    NSLog(@"%@",IDFA);
                    resolve([IDFA UUIDString]);
                } else {
                         resolve(@"");
                         NSLog(@"请在设置-隐私-跟踪中允许App请求跟踪");
                }
            }];
    } else {
        // iOS14以下版本依然使用老方法
        // 判断在设置-隐私里用户是否打开了广告跟踪
        if([[ASIdentifierManager sharedManager] isAdvertisingTrackingEnabled]) {
            NSUUID *IDFA = [[ASIdentifierManager sharedManager] advertisingIdentifier];
            resolve([IDFA UUIDString]);
        } else {
            resolve(@"");
            NSLog(@"请在设置-隐私-跟踪中允许App请求跟踪");
        }
    }
    
}

@end
