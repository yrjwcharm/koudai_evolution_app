/*
 * @Date: 2020-11-03 19:28:28
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-24 17:15:46
 * @Description: 
 */
// .prettierrc.js
module.exports = {
  printWidth: 120, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 4, //一个tab代表几个空格数
  bracketSpacing: false,  //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  jsxBracketSameLine: true,   //JSX 中最后一行的 > 符号不单独换行
  singleQuote: true,    //字符串是否使用单引号，默认为false，使用双引号
  trailingComma: 'all',   //是否使用尾逗号，有三个可选值"<none|es5|all>"
  endOfLine: 'auto',
};
