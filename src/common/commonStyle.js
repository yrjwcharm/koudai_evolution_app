/** 公共样式表 **/

import { Platform } from 'react-native'
import { px as text } from '../utils/screenUtils'
export const commonStyle = {

  /** color **/
  // 常用颜色
  red: '#FF0000',
  orange: '#FFA500',
  yellow: '#FFFF00',
  green: '#00FF00',
  cyan: '#00FFFF',
  blue: '#0000FF',
  purple: '#800080',
  black: '#000',
  white: '#FFF',
  gray: '#808080',
  drakGray: '#A9A9A9',
  lightGray: '#D3D3D3',
  tomato: '#FF6347',
  PeachPuff: '#FFDAB9',
  clear: 'transparent',
  background: '#F7F8FA',
  // 默认背景颜色
  bgColor: '#F1F3F6',

  /** 主题色 **/
  themeColor: '#0398ff',
  // 默认灰色字体颜色
  textGrayColor: '#80899B',
  // 默认黑色字体颜色
  textBlockColor: '#101A30',

  // 默认分割线颜色
  lineColor: '#DDDDDD',
  // 默认placeholder颜色
  placeholderColor: '#CCCCCC',
  // borderColor
  borderColor: '#DDDDDD',
  // 导航title 颜色
  navTitleColor: '#0052CD',
  // 导航左item title color
  navLeftTitleColor: '#333',
  // 导航右item title color
  navRightTitleColor: '#333',
  navThemeColor: '#0052CD',
  iconGray: '#989898',
  iconBlack: '#262626',
  /** space **/
  // 上边距
  marginTop: text(14),
  // 左边距
  marginLeft: text(14),
  // 下边距
  marginBottom: text(14),
  // 右边距
  marginRight: text(14),
  // 内边距
  padding: text(14),
  // 导航的leftItem的左间距
  navMarginLeft: 15,
  // 导航的rightItem的右间距
  navMarginRight: 15,

  /** width **/
  // 边框线宽度
  borderWidth: text(0.5),
  // 分割线高度
  lineWidth: text(0.5),

  /** height **/
  // 导航栏的高度
  navHeight: Platform.OS === 'ios' ? 64 : 56,
  // 导航栏顶部的状态栏高度
  navStatusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  // 导航栏除掉状态栏的高度
  navContentHeight: Platform.OS === 'ios' ? 44 : 56,
  // tabBar的高度
  tabBar: 49,
  // 底部按钮高度
  bottonBtnHeight: 44,
  // 通用列表cell高度
  cellHeight: 44,
  // 导航栏左右按钮image高度
  navImageHeight: 25,

  /** font **/
  // 默认文字字体
  numFontFamily: 'DINAlternate-Bold',
  textFont: text(14),
  // 默认按钮文字字体
  btnFont: text(14),
  // 导航title字体
  navTitleFont: text(20),
  // tabBar文字字体
  barBarTitleFont: 12,
  // 占位符的默认字体大小
  placeholderFont: 13,
  // 导航左按钮的字体
  navRightTitleFont: text(14),
  // 导航右按钮字体
  navLeftTitleFont: 15,

  /** opacity **/
  // mask
  modalOpacity: 0.3,
  // touchableOpacity
  taOpacity: 0.1,

  /** 定位 **/
  absolute: 'absolute',

  /** flex **/
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  row: 'row'
}