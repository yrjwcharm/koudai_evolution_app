//
//  RecordManager.m
//  EvolutionApp
//
//  Created by edz on 2022/5/17.
//
#import <TTDQARecordKit/TTDQARecordKit.h>
#import "RecordManager.h"
#import <React/RCTLog.h>
#import "AppDelegate.h"
#import <React/RCTUtils.h>
#import "MJExtension.h"
//签署成功
#define method_recordSuccess @"recordSuccess"
@implementation RecordManager;
RCT_EXPORT_MODULE();

/**
 针对本SDK，此为回调事件
 */
- (NSArray<NSString *> *)supportedEvents
{
  return @[method_recordSuccess];
}
/// 初始化方法
RCT_EXPORT_METHOD(init:(NSString *)appId isDebug:(int)isDebug) {
  // 输⼊ App ID ，环境 并初始化TTDQARecordKit
  [[TTDQARecordKit sharedTTDQARecordKit] registerServiceWithAppId:appId isForProduction:isDebug];
}
//开始录制
RCT_EXPORT_METHOD(startRecord:(NSString *)serialNo ttdOrderNo:(NSString *__nullable)ttdOrderNo talking:(NSString *)talking) {

  dispatch_async(dispatch_get_main_queue(), ^{
      NSString *str = talking;
      NSArray *arr = [NSArray mj_objectArrayWithKeyValuesArray:str];
      NSLog(@"%@",arr.firstObject);
      NSMutableArray *talkingArr = [NSMutableArray new];
      for (NSDictionary *dic in arr) {
          TTDQAModel *q1 = [[TTDQAModel alloc] initWithQuestion:dic[@"talkingStr"] AnswersArr:dic[@"answers"]];
          [talkingArr addObject:q1];
      }
      // 设置提问问题
      [[TTDQARecordKit sharedTTDQARecordKit] setTalkingArray:talkingArr];
      
      // 设置回调代理
      [[TTDQARecordKit sharedTTDQARecordKit] setTTDQARecordDelegate:self];
         
  
      [[TTDQARecordKit sharedTTDQARecordKit] setFaceCheckEnabeld:YES];
      // 开始录制
      [[TTDQARecordKit sharedTTDQARecordKit] startVideoRecordWithSerialNo:serialNo ttdOrderNo:ttdOrderNo];
  });
  }
//MARK: - TTDQARecordDelegate
- (void)ttdQARecordSuccess:(NSString *)serialNo {
    NSLog(@"%@ 录制成功",serialNo);
  NSDictionary *dataDict = @{@"serialNo": serialNo};
  [self sendEventWithName:method_recordSuccess body:dataDict];
}

-(void)ttdQARecordEndWithType:(TTDRecordEndType)signEndType
{
    if (signEndType == TTDRecordEndTypeCancel) {
        NSLog(@"用户点击返回取消");
    }
}

  
@end
