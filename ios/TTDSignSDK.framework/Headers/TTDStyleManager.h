//
//  TTDStyleManager.h
//  TTDSignSDK
//
//  Created by 林英彬 on 2022/2/22.
//  Copyright © 2022 Shulaibao. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class TTDBatchSignStyle,TTDRiskViewStyle;
@interface TTDStyleManager : NSObject

@property (nonatomic, strong) TTDBatchSignStyle * _Nullable batchSignStyle;
@property (nonatomic, strong) TTDRiskViewStyle * _Nullable riskViewStyle;

/**
 确认按钮背景颜色, 默认为颜色 2e6be6
 */
@property (nonatomic, strong) UIColor * _Nullable confirmBtnBgColor;

/**
确认按钮不可点击状态背景颜色,
*/
@property (nonatomic, strong) UIColor * _Nullable confirmBtnDisabledBgColor;

/**
 确认按钮字体, 默认为系统字体16号
 */
@property (nonatomic, strong) UIFont * _Nullable confirmBtnFont;
/**
 确认按钮字体颜色, 默认白色
 */
@property (nonatomic, strong) UIColor * _Nullable confirmBtnTitleColor;

/**
 确认按钮圆角 默认22
 */
@property (nonatomic, assign) NSInteger confirmBtnCornerRadius;

/**
 确认按钮边距 默认16
 */
@property (nonatomic, assign) NSInteger confirmBtnMargin;

/**
 确认按钮背景颜色, 渐变起始颜色
 */
@property (nonatomic, strong, readonly) UIColor * _Nullable confirmBtnFromColor;
/**
 确认按钮背景颜色, 渐变结束颜色
 */
@property (nonatomic, strong, readonly) UIColor * _Nullable confirmBtnEndColor;
/**
 确认按钮不可用时背景颜色, 渐变起始颜色
 */
@property (nonatomic, strong, readonly) UIColor * _Nullable confirmBtnDisableFromColor;
/**
 确认按钮不可用时背景颜色, 渐变结束颜色
 */
@property (nonatomic, strong, readonly) UIColor * _Nullable confirmBtnDisableEndColor;


/**
 NavBar背景色 默认白色
 */
@property (nonatomic, strong) UIColor * _Nullable navBarBgColor;

- (void)setupDefaultStyles;

/// 确认按钮背景渐变色 从左至右
/// @param fromColor 左颜色
/// @param toColor 右颜色
-(void)setConfirmBtnGradientColorWithLeftColor:(UIColor *_Nullable)fromColor RightColor:(UIColor *_Nullable)toColor;

/// 确认按钮背景渐变色 从左至右
/// @param fromColor 左颜色
/// @param toColor 右颜色
-(void)setConfirmBtnDisableGradientColorWithLeftColor:(UIColor *_Nullable)fromColor RightColor:(UIColor *_Nullable)toColor;

@end


@interface TTDBatchSignStyle : NSObject

/**
 批量签署页 状态标签显示方式：默认0 文字+背景色 1 文字+边框
 */
@property (nonatomic, assign) NSInteger stateViewModel;

/**
 待确认标签文字颜色, 默认为颜色 0xff9900
 */
@property (nonatomic, strong) UIColor * stateLabelunConfirmedTextColor;

/**
 待确认标签背景色, 默认 0xff9900 0.1透明
*/
@property (nonatomic, strong) UIColor * _Nullable stateLabelunConfirmedBgColor;

/**
 已确认标签文字颜色, 默认为颜色 0x38c99c
 */
@property (nonatomic, strong) UIColor * stateLabelConfirmedTextColor;

/**
 已确认标签背景色, 默认 0x38c99c 0.1透明
*/
@property (nonatomic, strong) UIColor * _Nullable stateLabelConfirmedBgColor;

/**
 已签署标签文字颜色, 默认为颜色 0x38c99c
 */
@property (nonatomic, strong) UIColor * stateLabelSignedTextColor;

/**
 已签署标签背景色, 默认 0x38c99c 0.1透明
*/
@property (nonatomic, strong) UIColor * _Nullable stateLabelSignedBgColor;

@end

@interface TTDRiskViewStyle : NSObject

/**
 风险揭示页阅读方式：默认0 手指滑动 1 点击勾选
 */
@property (nonatomic, assign) NSInteger riskViewModel;
/**
 风险揭示勾选模式, 勾选框未选中颜色。默认为颜色 E0E0E0
 */
@property (nonatomic, strong) UIColor * checkboxNormalColor;

/**
 风险揭示勾选模式, 勾选框选中颜色。默认为颜色 D72B34
 */
@property (nonatomic, strong) UIColor * checkboxSelectedColor;

@end
NS_ASSUME_NONNULL_END
