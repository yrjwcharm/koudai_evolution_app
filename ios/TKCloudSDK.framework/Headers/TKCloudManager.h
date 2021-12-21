//
//  TKCloudManager.h
//  TKCloudSDK
//
//  Created by brucelin on 2021/9/7.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    /// NFC开启
    TKNFCStatusOpen,
    /// NFC不支持
    TKNFCStatusNotSupported,
    /// NFC不可用,版本过低
    TKNFCStatusVersionLow,
} TKNFCStatus;

/**
 合成身份证所需要的模型遵循的协议
 */
@protocol TKCloudIdCardModelProtocol <NSObject>

@required
/// 姓名
@property (nonatomic, copy) NSString *name;
/// 性别
@property (nonatomic, copy) NSString *sex;
/// 民族
@property (nonatomic, copy) NSString *nation;
/// 出生年月日: 19950204
@property (nonatomic, copy) NSString *birthDate;
/// 住址
@property (nonatomic, copy) NSString *address;
/// 公民身份证号码
@property (nonatomic, copy) NSString *idnum;
/// 头像，base64编码
@property (nonatomic, copy) NSString *picture;
/// 签发机关
@property (nonatomic, copy) NSString *signingOrganization;
/// 有效期开始时间
@property (nonatomic, copy) NSString *beginTime;
/// 有效期结束时间
@property (nonatomic, copy) NSString *endTime;

@end

@class TKCloudManager;
@protocol TKCloudManagerDelegate <NSObject>

/**
 读卡成功，获取到ReqID
 */
- (void)TKCloudManager:(TKCloudManager *)manager readCardSuccessWith:(NSString *)ReqID;

/**
 读卡失败
 @param manager 读卡管理器
 @param errCode 状态码
 @param errMsg 错误信息
 - 10001: 读卡超时
 - 10002: 读卡失败
 - 10003: 设备不支持NFC
 - 10004: 用户取消读卡操作，点击读卡页面左上角返回按钮
 - 10005: 用户取消读卡操作, 3次取消读卡后，点击选择其他方式
 */
- (void)TKCloudManager:(TKCloudManager *)manager readCardFailed:(NSInteger)errCode errMsg:(NSString *)errMsg;

/**
 用户在确认信息页面返回获取到身份证双面图片
 @param manager 读卡管理器
 @param type 点击类型，0: 点击左上角返回按钮 1: 点击确认信息按钮
 @param frontImage 身份证人像面
 @param backImage 身份证国徽面
 @param combinationImg 身份证双面
 */
- (void)TKCloudManager:(TKCloudManager *)manager tapType:(NSInteger)type userConfirmedCardInfoWithFrontImage:(UIImage *)frontImage backImage:(UIImage *)backImage CombinationImage:(UIImage *)combinationImg;

/**
 确信页面页面加载异常
 触发场景：传入数据 model/字典 内字段值在sdk内部解析失败，无法正确展示UI页面
 */
- (void)TKCloudManagerToConfirmInfoFailed:(TKCloudManager *)manager;

@end

@interface TKCloudManager : NSObject

+(instancetype)shareTKCloudManager;

@property (nonatomic, assign) id<TKCloudManagerDelegate> delegate;

/**
 超时时间，最大值为59秒, 最小值为5秒，默认为59秒
 */
@property (nonatomic, assign) CGFloat readTimeout;
/**
 超时时间NFC提示框描述信息
 */
@property (nonatomic, copy) NSString *readTimeoutDescString;
/**
 是否显示读卡按钮频繁点击的提示信息, 默认是开启状态
 */
@property (nonatomic, assign) BOOL isStartBtnFrequentTipShow;
/**
 读卡按钮频繁点击的提示信息, 默认是 操作频繁,请稍后
 */
@property (nonatomic, copy) NSString *startBtnFrequentTapString;

/**
 获取sdk版本号
 */
+ (NSString *_Nonnull)getVersion;

/**
 初始化SDK
 @param appid 我司分配的appid
 @param loglevel 日志级别，可设置0，1，2
 @param IP 我司分配的IP
 @param Port 我司分配的端口号
 @param envCode 环境识别码,具体配置详见官方文档
 */
- (void)initWithAppID:(NSString *)appid Loglevel:(int)loglevel IP:(NSString *)IP Port:(int)Port envCode:(NSUInteger)envCode;

/**
 检测当前NFC的状态
 */
- (TKNFCStatus)detectNFCStatus;

/**
 开启NFC读卡，进入引导用户贴卡的页面
 @param vc 当前页面控制器
 */
- (void)startReadIDCardWithController:(UIViewController *)vc;

/**
 进入用户确认信息页面
 @param vc 当前页面控制器
 @param model 遵循 协议TKCloudIdCardModelProtocol 的模型对象, 用于合成身份证双面
 */
- (void)toConfirmInfoPageWithController:(UIViewController *)vc idCardModel:(id <TKCloudIdCardModelProtocol>)model;

@end

NS_ASSUME_NONNULL_END
