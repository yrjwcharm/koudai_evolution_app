//
//  TTDQAModel.h
//  TTDQARecordKit
//
//  Created by 林英彬 on 2021/4/26.
//  Copyright © 2021 林英彬. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// 妥妥递问答双录SDK，问题Model
@interface TTDQAModel : NSObject

/// 自动播报问题String
@property (nonatomic, copy) NSString *question;

/// 听写回答正确答案String数组，回答页面 显示第一个答案
/// 默认 @[@"是",@"是的"]
@property (nonatomic, copy) NSArray<NSString *> *answersArr;

- (instancetype)initWithQuestion:(NSString *)question AnswersArr:(NSArray * __nullable)answersArr;

@end

NS_ASSUME_NONNULL_END
