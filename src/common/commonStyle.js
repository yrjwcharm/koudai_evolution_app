/*
 * @Date: 2020-12-28 11:53:01
 * @LastEditors: dx
 * @LastEditTime: 2021-04-26 15:50:48
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
    //浅黑色
    lightBlackColor: '#545968',
    // 默认深灰色字体颜色
    darkGrayColor: '#9aA1B2',
    // 默认浅灰色字体颜色
    lightGrayColor: '#9aA1B2',
    // 默认分割线颜色
    lineColor: '#E2E4EA',
    // 默认placeholder颜色
    placeholderColor: '#BDC2CC',
    // borderColor
    borderColor: '#E9EAEF',
    // 链接颜色
    linkColor: '#0051CC',
    // 输入框背景色
    inputBg: '#F5F6F8',
    // 红色 涨、报错
    red: '#E74949',
    // 绿色 跌
    green: '#4BA471',
    //橘色 确认中
    orange: '#EB7121',
    btnColor: '#0051CC',
    //黄色
    yellow: '#EB7121',
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
    defaultFontColor: '#121D3A',
    // 描述文字颜色
    descColor: '#545968',
};
export const Space = {
    /** space **/

    // 上下边距
    marginVertical: text(16),
    // 左右边距
    marginAlign: text(16),
    // 内边距
    padding: text(16),
    cardPadding: text(16),
    /** width **/
    //圆角
    borderRadius: text(6),
    // 边框线宽度
    borderWidth: 0.5,
    // 分割线高度
    lineWidth: 0.5,
    modelPadding: text(20),
    // 外阴影
    boxShadow: (color = '#E0E2E7', x = 0, y = text(2), opacity = 1, radius = text(8)) => ({
        shadowColor: color,
        shadowOffset: {width: x, height: y},
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: 20,
    }),
};

export const Font = {
    /** font **/

    // 默认文字字体
    numFontFamily: 'DINAlternate-Bold',
    numRegular: 'DIN-Regular',
    numMedium: 'DIN-Medium',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexAround: {
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    flexEvenly: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    modelPadding: {
        marginHorizontal: text(20),
        marginVertical: text(20),
    },
    containerPadding: {
        padding: text(16),
        backgroundColor: '#F5F6F8',
        flex: 1,
    },
    baselineAlign: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    columnAlign: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    descSty: {
        color: '#9095A5',
        fontSize: text(13),
    },
    tag: {
        paddingHorizontal: text(7),
        justifyContent: 'center',
        borderRadius: 2,
        height: 20,
    },
    more: {
        fontSize: text(12),
        color: Colors.btnColor,
    },
});
