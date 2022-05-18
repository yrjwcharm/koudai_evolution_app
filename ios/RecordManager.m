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
@implementation RecordManager;
RCT_EXPORT_MODULE();

/// 初始化方法
RCT_EXPORT_METHOD(init:(NSString *)appId isDebug:(int)isDebug) {
  // 输⼊ App ID ，环境 并初始化TTDQARecordKit
  [[TTDQARecordKit sharedTTDQARecordKit] registerServiceWithAppId:appId isForProduction:isDebug];
}
//开始录制
RCT_EXPORT_METHOD(startRecord:(NSString *)serialNo ttdOrderNo:(NSString *)ttdOrderNo) {
  // 设置回调代理
  [[TTDQARecordKit sharedTTDQARecordKit] setTTDQARecordDelegate:self];
     
  
  TTDQAModel *q1 = [[TTDQAModel alloc] initWithQuestion:@"您是否确认购买某某产品并已确认风险？" AnswersArr:@[@"确认",@"是的"]];
  // 默认答案 是 是的
  TTDQAModel *q2 = [[TTDQAModel alloc] initWithQuestion:@"您是否确认第二题？" AnswersArr:nil];
  TTDQAModel *q3 = [[TTDQAModel alloc] initWithQuestion:@"您是否清楚第三题的风险？" AnswersArr:@[@"清楚",@"明白"]];
  TTDQAModel *q4 = [[TTDQAModel alloc] initWithQuestion:@"您是否愿意承担已知的风险？" AnswersArr:@[@"愿意承担"]];
  // 设置提问问题
  [[TTDQARecordKit sharedTTDQARecordKit] setTalkingArray:@[
      q1,q2,q3,q4
  ]];
  
  [[TTDQARecordKit sharedTTDQARecordKit] setFaceCheckEnabeld:YES];
  // 开始录制
  [[TTDQARecordKit sharedTTDQARecordKit] startVideoRecordWithSerialNo:serialNo ttdOrderNo:ttdOrderNo];
}
//MARK: - TTDQARecordDelegate
- (void)ttdQARecordSuccess:(NSString *)serialNo {
    NSLog(@"%@ 录制成功",serialNo);
}

-(void)ttdQARecordEndWithType:(TTDRecordEndType)signEndType
{
    if (signEndType == TTDRecordEndTypeCancel) {
        NSLog(@"用户点击返回取消");
    }
}

  
@end
