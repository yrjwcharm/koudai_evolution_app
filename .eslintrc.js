/*
 * @Date: 2021-04-25 17:43:29
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-08-30 12:38:53
 * @Description:
 */

// .eslintrc.js
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  extends: ['@react-native-community',"prettier",],
  rules: {
    'react-hooks/exhaustive-deps': 0,
    'react-native/no-inline-styles': 0, //关闭内联样式警告
    'no-extend-native': [1, { 'exceptions': ['Date', 'String'] }],
    'no-control-regex': 0,  //允许正则表达式中的控制字符
    'eqeqeq': 'off',//允许使用双等号
    'semi': 0,
  }
};
