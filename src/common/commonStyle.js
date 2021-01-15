/*
 * @Date: 2020-12-28 11:53:01
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-15 10:59:07
 * @Description:主题及公共样式表
 */

import {StyleSheet} from 'react-native';
import {px as text} from '../utils/appUtil';
export const Colors = {
    /** color **/

    // 默认背景颜色
    bgColor: '#F5F6F8',
    /** 品牌色 **/
    brandColor: '#0051CC',
    // 默认黑色字体颜色
    defaultColor: '#121D3A',
    // 默认深灰色字体颜色
    darkGrayColor: '#80899B',
    // 默认浅灰色字体颜色
    lightGrayColor: '#9095A5',
    // 默认分割线颜色
    lineColor: '#E2D4EA',
    // 默认placeholder颜色
    placeholderColor: '#CCCCCC',
    // borderColor
    borderColor: '#E2D4EA',
    // 链接颜色
    linkColor: '#0051CC',
    // 输入框背景色
    inputBg: '#F4F4F4',
    // 红色 涨、报错
    red: '#E74949',
    // 绿色 跌
    green: '#4BA471',
    btnColor: '#0051CC',
    //导航背景色
    navBgColor: '#FFF',
    // 导航title 颜色
    navTitleColor: '#121D3A',
    // 导航左item title color
    navLeftTitleColor: '#121D3A',
    // 导航右item title color
    navRightTitleColor: '#121D3A',
    iconGray: '#989898',
    iconBlack: '#262626',
};
export const Space = {
    /** space **/

    // 上下边距
    marginVertical: text(16),
    // 左右边距
    marginAlign: text(16),
    // 内边距
    padding: text(16),
    /** width **/
    //圆角
    borderRadius: text(8),
    // 边框线宽度
    borderWidth: text(0.5),
    // 分割线高度
    lineWidth: text(0.5),
};

export const Font = {
    /** font **/

    // 默认文字字体
    numFontFamily: 'DINAlternate-Bold',
    //特大字体
    largeFont: text(26),
    //金额输入框字体大小
    inputFont: text(34),
    textH1: text(16),
    textH2: text(14),
    textH3: text(12),
    //极小字体
    textSm: text(11),
    // 导航title字体
    navTitleFont: text(20),
    // 导航右按钮的字体
    navRightTitleFont: text(14),
    // 占位符的默认字体大小
    placeholderFont: 13,
};
export const Style = StyleSheet.create({
    flexRowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flexCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexBetween: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexAround: {
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
