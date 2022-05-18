//
//  TTDSignSDK.h
//  TTDSignSDK
//
//  Created by rain on 22/8/19.
//  Copyright © 2019 Shulaibao. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TTDStyleManager.h"
/**
  签署文件类型
 */
typedef NS_ENUM(NSInteger, TTDFileSignStatus) {
    /** 订单处理中 */
    TTDFileSignStatusWating=10001,
    /** 投资者待风险揭示书 */
    TTDFileSignStatusRisk=10022,
    /** 投资者待签署合同 */
    TTDFileSignStatusContract=10003,
    /** 投资者待签署补充协议 */
    TTDFileSignStatusSupplement = 11001,
    /** 理财师待签署风险揭示书 */
    TTDFileSignStatusRiskOfManager=10024,
    /** 订单完成 */
    TTDFileSignStatusSuccess=10007,
    /** 投资者待回访确认 */
    TTDFileSignStatusVisit=10027,
};

/**
 *TTDFailRequestOfNetwork 网络错误
 *TTDFailRequestOfBody 请求数据错误
 *TTDFailRequestOfOrder 后端数据错误
 *TTDFailRequestOfState 订单状态非签署类型
   
 */
typedef NS_ENUM(NSInteger, TTDErrorCode) {
    TTDErrorOfNetwork = 0,
    TTDErrorOfBody,
    TTDErrorOfOrder,
    TTDErrorOfOrderStatus,
    TTDErrorOfOthers,
    TTDErrorOfBatchSign
};

/**
*TTDSignVCShowTypePush 默认，push方式进入
*TTDSignVCShowTypePresent presentViewController方式打开页面
*/
typedef NS_ENUM(NSInteger, TTDSignVCShowType) {
    TTDSignVCShowTypePush = 0,
    TTDSignVCShowTypePresent = 1
};

// SDK 结束类型
typedef NS_ENUM(NSInteger, TTDSignEndType) {
    /*未知原因*/
    TTDSignEndTypeUnknown,
    /*点击返回按钮*/
    TTDSignEndTypeCancel,
    /*签署成功*/
    TTDSignEndTypeSuccess,
    /*报错返回*/
    TTDSignEndTypeError,
};

// 进入手写签名版时屏幕方向， 是否默认横屏
typedef NS_ENUM(NSInteger, TTDSignPanelDefaultOrientation) {
    /* 横屏 */
    TTDSignPanelDefaultOrientationLandscapeLeft = 0,
    /* 竖屏 */
    TTDSignPanelDefaultOrientationPortrait = 1,
};

// 投资者签署时 进入签名版时类型，默认手写签名版
typedef NS_ENUM(NSInteger, TTDSignPanelDefaultModel) {
    /* 手写签名版 */
    TTDSignPanelDefaultModelHand = 0,
    /* 自动生成楷体签名版 */
    TTDSignPanelDefaultModelAuto = 1,
};


@class TTDSignSDK;

@protocol TTDFileSignDelegate <NSObject>

/// 签署错误的回调
/// @param signSdk TTDSignSDK
/// @param errorCode 错误码
/// @param errorMsg 错误信息
- (void)onError:(TTDSignSDK *)signSdk errorCode:(TTDErrorCode)errorCode errorMsg:(NSString *)errorMsg;

@optional

/// 订单状态不匹配的回调
/// @param signSdk TTDSignSDK
/// @param orderStatus 订单状态
/// @param files 已签署文件的字典的数组（无已签署文件返回nil）
/// {
///   url  -> string   (签署后文件url)
///   bucketName  -> string   (文件bucket，一般与objectKey一起使用）
///   objectKey -> string  (文件key，一般与bucketName一起使用)
///   version -> string   (签署文件版本，用于标识补充协议)
/// }
- (void)signFailure:(TTDSignSDK *)signSdk orderStatusNoMatch:(NSInteger)orderStatus resultInfo:(NSArray *)files;

/// 订单签署成功时回调的方法
/// @param signSdk TTDSignSDK
/// @param signStatus 订单签署前的订单状态
/// @param orderStatus 订单签署后的订单状态
/// @param files 字典的数组
/// {
///   url  -> string   (签署后文件url)
///   bucketName  -> string   (文件bucket，一般与objectKey一起使用）
///   objectKey -> string  (文件key，一般与bucketName一起使用)
///   version -> string   (签署文件版本，用于标识补充协议)
/// }
- (void)signSuccess:(TTDSignSDK *)signSdk signStatus:(NSInteger)signStatus orderStatus:(NSInteger)orderStatus resultInfo:(NSArray *)files;

/// 批量签署成功时回调的方法
/// @param signSdk TTDSignSDK
/// @param orderNo 妥妥递订单号
/// @param fileIds 妥妥递自定义签约文件id 数组
/// @param userNo 妥妥递用户编号
-(void)signBatchSuccess:(TTDSignSDK *)signSdk orderNo:(NSString *)orderNo fileIds:(NSArray *)fileIds ttdUserNo:(NSString *)userNo;

/// 签署自定义文件成功时回调
/// @param signSdk TTDSignSDK
/// @param dic 签署成功信息
/// {
///     fileId;     //文件ID
///     bucketName; //获取文件的name
///     objectKey;  //获取文件的key
///     url;        //文件URL
///     pdfPage;    //文件页码
///     investorState;  //投资者签署状态。1，已签署 0,待签署
///     manageState;    //管理人签署状态。1，已签署 0,待签署
///     plannerState;   //理财经理签署状态。1，已签署 0,待签署
/// }
- (void)signFileSuccess:(TTDSignSDK *)signSdk responseInfo:(NSDictionary *)dic;

/// 签署回访成功回调
/// @param signSdk TTDSignSDK
/// @param dic 签署成功信息
/// {
///     bucketName; //获取文件的name
///     objectKey;  //获取文件的key
///     url;        //文件URL
/// }
- (void)signVisitSuccess:(TTDSignSDK *)signSdk responseInfo:(NSDictionary *)dic;

/// 签署SDK 退出时回调，回调时机在signSuccess，signFailure，onError之后。
/// present方式在dismiss的completion中
/// @param signEndType 签署结束类型
- (void)signEndWithType:(TTDSignEndType)signEndType;


/// 签署SDK 预览结束回调。进入预览控制器并点击对应按钮退出时触发。 返回按钮不触发
- (void)previewEnd;
@end

@interface TTDSignSDK : NSObject

/**
 配置颜色字体
 */
@property (nonatomic, strong) TTDStyleManager *styleManager;

/**
配置进入vc类型 默认push ，可以改为 present
*/
@property (nonatomic, assign) TTDSignVCShowType signVCShowType;


@property (nonatomic, copy, readonly) NSString *kBaseUrl;
@property (nonatomic, copy, readonly) NSString *kBaseImgUrl;
@property (nonatomic, copy, readonly) NSString *kBasePdfUrl;
@property (nonatomic, copy, readonly) NSString *kAppId;
@property (nonatomic, readonly) NSInteger browsingMintimeInterval;
@property (nonatomic, readonly) BOOL previewOnly;
@property (nonatomic, readonly) TTDSignPanelDefaultOrientation signPanelOrientation;
@property (nonatomic, readonly) TTDSignPanelDefaultModel signPanelModel;
@property (nonatomic, copy, readonly) NSString *signPanelWarningText;
@property (nonatomic, readonly) BOOL needReadAll;
@property (nonatomic, readonly) BOOL needReadToEnd;

+ (instancetype)shareSDK;

/**
 sdk版本号
 
 @return sdk版本号
 */
+ (NSString*)getSDKVersion;

/**
 配置环境

 @param envCode 测试: 1 or 999, 正式: 0 or 997, 默认为测试环境
 @param appId 妥妥递分配的appId
 */
- (void)setupEnv:(NSInteger)envCode appId:(NSString *)appId;


/**
 返回签署控制器，按照订单状态签署
 （orderStatus == 10024为待理财师签署风险揭示书）

 @param orderNo 妥妥递订单号
 @param orderStatus 妥妥递订单状态
 @param delegate 代理
 */
- (UIViewController *)getSignedVcWithOrderNo:(NSString *)orderNo orderStatus:(NSInteger)orderStatus delegate:(id<TTDFileSignDelegate>)delegate;


/**
 返回批量签署文件控制器（投资者）
 2.0版本新增
 @param orderNo 妥妥递订单号
 @param fileIds 妥妥递自定义签约文件id 数组
 @param userNo 妥妥递用户编号（必传）
 @param delegate 代理
 */
- (UIViewController *)getSignBatchForInvestorVcWithOrderNo:(NSString *)orderNo fileIds:(NSArray *)fileIds ttdUserNo:(NSString *)userNo delegate:(id<TTDFileSignDelegate>)delegate;

/// 批量签署如果有订单前fileId排序需求使用
- (UIViewController *)getSignBatchForInvestorVcWithOrderNo:(NSString *)orderNo topFileds:(NSArray *)topFileIds fileIds:(NSArray *)otherFileIds ttdUserNo:(NSString *)userNo delegate:(id<TTDFileSignDelegate>)delegate;

/**
 返回订单签署文件控制器（理财师）
 2.0版本新增，只有10024状态下可以签署
 @param orderNo 妥妥递订单号
 @param name 理财师姓名
 @param idcode 理财师身份证号
 @param delegate 代理
 */
- (UIViewController *)getSignVcForManagerWithOrderNo:(NSString *)orderNo Name:(NSString *)name idcode:(NSString *)idcode delegate:(id<TTDFileSignDelegate>)delegate;


/// 返回控制器，签署自定义文件
/// @param fileInfo 用户信息
/// 字典
/// {
///   fileId  -> string   (文件id)
///   signType  -> string   (签约类型：     1为自然人签署，2为理财师签署，3为募集机构用印）
///   userNo -> string  (如果是投资者，需传该值)
///   mobile -> string   (理财经理需传该值)
///   name -> string    (理财经理需传该值)
///   idCard -> string  (理财经理需传该值)
/// }
///
/// @param delegate 代理
- (UIViewController *)getSignedVcWithFileInfo:(NSDictionary *)fileInfo delegate:(id<TTDFileSignDelegate>)delegate;

/// 设置文件是否需要滑动到底阅读完毕
/// @param readToEnd 是否滑动到底
-(void)setSignWithReadToEnd:(BOOL)readToEnd;

/// 设置合同浏览最少时间。 默认0，单位秒
/// @param browsingMintimeInterval 最少浏览时间
-(void)setContractBrowsingMinTime:(NSInteger)browsingMintimeInterval;

/// 进入手写签名版时屏幕方向。 （0横屏，默认1竖屏） 当用户需要签署密码时，默认横屏无效
-(void)setPanelOnfiguration:(TTDSignPanelDefaultOrientation)signPanelOrientation;

///  投资者签署时 进入签名版时签名版类型。 （默认0 手写签名版，1 自动楷体签名版）
-(void)setPanelModel:(TTDSignPanelDefaultModel)signPanelModel;

/// 自定义签署弹出框提示文案（全局设置，取消请设置nil或@""）
-(void)setSignWarningText:(NSString *)signWarningText;


/// 设置 预览订单文件时只读，隐藏去签约按钮。（getPreviewVcWithOrderNo方法）
/// @param previewOnly 预览订单文件时只读（隐藏去签约按钮）
-(void)setPreviewOnly:(BOOL)previewOnly;


/// 设置 批量签署时是否必须阅读完毕全部文件才可签署
/// @param needReadAll 必须阅读
-(void)setSignBatchWithNeedReadAllFiles:(BOOL)needReadAll;

/**
 返回预览单一文件控制器

 @param bucketName (妥妥递文件bucket，一般与objectKey一起使用）
 @param objectKey (妥妥递文件key，一般与bucketName一起使用）
 @param previewTitle 预览页title
 @param buttonTitle 预览页按钮title 不传或@"" 隐藏按钮
 @param delegate 代理
 */
- (UIViewController *)getPreviewVcWithBucketName:(nonnull NSString *)bucketName objectKey:(nonnull NSString *)objectKey previewTitle:(NSString * _Nullable)previewTitle previewButtonTitle:(NSString * _Nullable)buttonTitle delegate:(id<TTDFileSignDelegate>_Nullable)delegate;

/**
返回预览订单多个文件控制器（风险揭示书，合同）

@param orderNo 妥妥递订单号
@param orderStatus 妥妥递订单状态
@param delegate 代理
*/
-(UIViewController *_Nullable)getPreviewVcWithOrderNo:(nonnull NSString *)orderNo orderStatus:(NSInteger)orderStatus delegate:(id<TTDFileSignDelegate> _Nullable)delegate;

/// 返回签署回访控制器
/// @param userNo 妥妥递投资者编号
/// @param visitCode 回访编号
/// @param delegate 代理
-(UIViewController *_Nullable)getVisitVCWithUserNo:(NSString *_Nullable)userNo VisitCode:(NSString *_Nullable)visitCode delegate:(id<TTDFileSignDelegate> _Nullable)delegate;
@end
