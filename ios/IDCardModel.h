//
//  IDCardModel.h
//  TKDemo
//
//  Created by brucelin on 2021/9/13.
//

#import <Foundation/Foundation.h>
#import <TKCloudSDK/TKCloudManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface IDCardModel : NSObject<TKCloudIdCardModelProtocol>
/// 姓名
@property (nonatomic, copy) NSString *name;
/// 性别
@property (nonatomic, copy) NSString *sex;
/// 民族
@property (nonatomic, copy) NSString *nation;
/// 出生年月日: 19950204
@property (nonatomic, copy) NSString *birthDate;
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
/// 地址
@property (nonatomic, copy) NSString *address;
@end

NS_ASSUME_NONNULL_END
