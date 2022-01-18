//
//  JL_FaceSdkManager.h
//  FaceSdkManager
//
//  Created by zczx on 2019/10/21.
//  Copyright © 2019 zczx. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol JLFaceManagerDelegate<NSObject>
#pragma mark 实证业务
/**
 活体检测成功
 */
-(void) JLDetectionDidFinsh;
/**
 活体检测失败
 
 @param errCode 参考错误码
 @param errInfo 错误描述信息
 */
-(void) JLDetectionDidFinshWithError:(NSString*)errCode errInfo:(NSString*)errInfo;

#pragma mark 人像业务
/**
 活体检测成功时调用
 */
-(void) JLFaceManagerDidFinshWithToken:(NSString*)token sequenceId:(NSString*)sequenceId;
/**
 活体检测未成功
 
 @param errCode 参考错误码
 @param errInfo 错误描述信息
 @param sequenceId 流水号
 */
-(void) JLFaceManagerDidFinshWithError:(NSString*)errCode errInfo:(NSString*)errInfo sequenceId:(NSString*)sequenceId;
@end
@interface JLFaceSdkManager : NSObject

#pragma mark 公共参数

@property(weak, nonatomic) id<JLFaceManagerDelegate> faceManagerDelegate;
/**
    活体检测页面导航栏背景颜色 可选
 */
@property (nonatomic , strong) UIColor * _Nullable navbarColor;
/**
    活体检测页面按钮颜色 可选
 */
@property (nonatomic , strong) UIColor * _Nullable btnColor;
/**
 *  活体动作检测超时时间，默认8s。
 */
@property(nonatomic,assign)NSInteger livessTime;
/**
 *  活体检测动作个数 默认为3个动作  可在此直接设置1-4个动作
 */
@property(nonatomic,assign)NSInteger livessNumber;
/** 是否支持左摇头动作，默认为YES*/
@property (nonatomic , assign) BOOL livessLeft;
/** 是否支持右摇头动作，默认为YES*/
@property (nonatomic , assign) BOOL livessRight;
/** 是否支持张嘴动作，默认为YES*/
@property (nonatomic , assign) BOOL livessMouth;
/** 是否支持眨眼动作，默认为YES*/
@property (nonatomic , assign) BOOL livessBlink;

#pragma mark 实证业务
/**
    初始化
 
  @param VC 传入一个UIViewController，以便内部presentViewController
  @param appID 平台注册时，分配到的appID
  @param reqID 业务中的reqID
  @param strIP 活体检测过程中和我方服务器通信的IP或域名
  @param strPort 活体检测过程中和我方服务器通信的端口号
*/
-(instancetype)initJLDetectionWithVC:(id)VC appID:(NSString*)appID reqID:(NSString*)reqID IP:(NSString*)strIP port:(NSString*)strPort;
/**
 开始检测，通过代理JLFaceManagerDelegate返回结果
*/
-(void)detectionStart;

#pragma mark 人像业务
/**
    初始化
 
  @param VC 传入一个UIViewController，以便内部presentViewController
  @param appID 平台注册时，分配到的appID
  @param appKey 平台注册时，分配到的appKey
  @param strIP 活体检测过程中和我方服务器通信的IP或域名
  @param strPort 活体检测过程中和我方服务器通信的端口号
  @param bizType 业务类型编码
*/
-(instancetype)initFaceSDKWithVC:(id)VC appID:(NSString*)appID appKey:(NSString*)appKey IP:(NSString*)strIP port:(NSString*)strPort bizType:(NSString*)bizType;
/**
 开始检测，通过代理JLFaceManagerDelegate返回结果
 */
-(void)faceSdkStart;
@end

NS_ASSUME_NONNULL_END
