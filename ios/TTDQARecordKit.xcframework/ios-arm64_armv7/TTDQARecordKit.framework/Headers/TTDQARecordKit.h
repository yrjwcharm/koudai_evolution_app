//
//  TTDQARecordKit.h
//  TTDQARecordKit
//
//  Created by 林英彬 on 2021/3/16.
//  Copyright © 2021 林英彬. All rights reserved.
//

#import <Foundation/Foundation.h>

// In this header, you should import all the public headers of your framework using statements like #import <TTDQARecordKit/PublicHeader.h>
#import "TTDQAModel.h"

// SDK 结束类型
typedef NS_ENUM(NSInteger, TTDRecordEndType) {
    /*未知原因*/
    TTDRecordEndTypeUnknown,
    /*点击返回按钮*/
    TTDRecordEndTypeCancel,
    /*签署成功*/
    TTDRecordEndTypeSuccess,
    /*报错返回*/
    TTDRecordEndTypeError,
};

@protocol TTDQARecordDelegate <NSObject>


/// 双录SDK录制成功回调
/// 双录成功后可以通过serialNo到开放平台接口查询视频，若绑定ttdOrderNo，会绑定到开放平台对应订单
/// @param serialNo 成功返回业务流水号
- (void)ttdQARecordSuccess:(NSString *)serialNo;

@optional


/// 双录SDK 退出时回调。
/// @param recordEndType 退出类型
- (void)ttdQARecordEndWithType:(TTDRecordEndType)recordEndType;

@end

@interface TTDQARecordKit : NSObject


/// 设置语音播报问题
/// @param talkingArray 语音播报问题TTDQAModel数组
-(void)setTalkingArray:(NSArray<TTDQAModel *>*)talkingArray;


/// 设置回调代理
/// @param delegate 实现TTDQARecordDelegate方法的实例
-(void)setTTDQARecordDelegate:(id<TTDQARecordDelegate>)delegate;


/// 回答时 是否隐藏标准答案。 默认NO
/// @param hideAnswer 是否隐藏答案
-(void)setHideAnswer:(BOOL)hideAnswer;

// 当设置为1时，回答不符合预设答案，播报：请重新回答。
-(void)setRepeatQuestionType:(NSUInteger)repeatType;


/// 录制过程中是否启用人脸离框检测。 默认NO
/// @param faceEnabled 开启人脸离框检测
-(void)setFaceCheckEnabeld:(BOOL)faceEnabled;


/// 设置用户回答后提示字符串。默认 @"回答通过" @"回答不通过，请重新回答"
/// @param passString 回答通过提示文案
/// @param invalidString 回答不通过提示文案
-(void)setAnswerWarningStrings:(NSString *)passString invalidString:(NSString *)invalidString;

/**
 初始化 TTDQARecordKit
 
 @return TTDQARecordKit 的单例
 */
+ (instancetype)sharedTTDQARecordKit;

/**
 注册远程双录服务;该方法会进行网络请求。建议放在appdelegate中，只需调用一次，若注册失败，SDK内部会自动注册
 
 @param appId appId
 @param isProduction 是否生产环境，测试传NO
 */
- (void)registerServiceWithAppId:(NSString*)appId isForProduction:(BOOL)isProduction;

/// 开始问答式自助双录
/// @param serialNo 业务流水号，唯一
/// @param ttdOrderNo 妥妥递订单号，开放平台妥妥递订单号，用于绑定至订单
/// @return 0成功，<0失败
- (int)startVideoRecordWithSerialNo:(NSString*)serialNo ttdOrderNo:(NSString *)ttdOrderNo;

/**
 查询SDK版本号
 
 @return SDK版本号字符串
 */
+ (NSString *)getSdkVersion;

@end
