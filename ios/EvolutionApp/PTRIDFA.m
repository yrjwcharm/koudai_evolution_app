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
#import <AdServices/AdServices.h>
#import <iAd/iAd.h>
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
//获取归因token data
RCT_EXPORT_METHOD(getAdData:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 14.3, *)) {
           NSError *error;
           NSString *token = [AAAttribution attributionTokenWithError:&error];
           NSLog(@"token: %@", token);
           if (token != nil) {
             [self sendToken:[self getANullableString:@"token" content:token]
               completeBlock:^(NSDictionary *attrData) {
               resolve(attrData);}];
           }
       } else {
         // 老版本请求
            if ([[ADClient sharedClient] respondsToSelector:@selector(requestAttributionDetailsWithBlock:)]) {
                NSLog(@"LogAds：iAd called");
                [[ADClient sharedClient] requestAttributionDetailsWithBlock:^(NSDictionary *attrData, NSError *error) {
                  resolve(attrData);
                }];
           }  
       }
  
    
}
/** 读取可能为空的字符串*/
-(nullable NSString *)getANullableString:(NSString *)desc content:(NSString *)content{
    if(content == nil){
        return @"";
    }
    return [NSString stringWithFormat:@"%@", content];
}
 
/** 发送归因token得到数据 */
-(void)sendToken:(NSString *)token completeBlock:(void(^)(NSDictionary* data))completeBlock{
    NSString *url = [NSString stringWithFormat:@"https://api-adservices.apple.com/api/v1/"];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:url]];
    request.HTTPMethod = @"POST";
    [request addValue:@"text/plain" forHTTPHeaderField:@"Content-Type"];
    NSData* postData = [token dataUsingEncoding:NSUTF8StringEncoding];
    [request setHTTPBody:postData];
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSDictionary * result = NULL;
        if (error) {
             //请求失败
            NSLog(@"请求失败LogAds：sendToken ERR");
            if (completeBlock) {
                NSMutableDictionary *nulldict = [NSMutableDictionary dictionary];
                completeBlock(nulldict);
            }
        }else{
            // 请求成功
            NSLog(@"请求成功");
            NSError *resError;
            NSMutableDictionary *resDic = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&resError];
            result = [[NSDictionary alloc] initWithDictionary:resDic];
            if (completeBlock) {
                completeBlock(result);
            }
        }
    }];
    [dataTask resume];
}
@end
