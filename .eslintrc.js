
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
  extends: '@react-native-community',
  rules: {
    'react-native/no-inline-styles': 0, //关闭内联样式警告
    'no-extend-native': [1, { 'exceptions': ['Date', 'String'] }],
    'no-control-regex': 0,  //允许正则表达式中的控制字符
    'eqeqeq': 'off',//允许使用双等号
    'semi': 0,
  }
};
