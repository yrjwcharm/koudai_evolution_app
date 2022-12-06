/*
 * @Date: 2020-12-28 11:53:00
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-21 11:29:40
 * @Description:
 */

// .prettierrc.js
module.exports = {
  printWidth: 120, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 4, //一个tab代表几个空格数
  bracketSpacing: false,  //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  jsxBracketSameLine: true,   //JSX 中最后一行的 > 符号不单独换行
  singleQuote: true,    //字符串是否使用单引号，默认为false，使用双引号
  endOfLine: 'auto',
  semi: true,//在代码尾部添加分号
  trailingComma: "es5"//在代码尾部添加逗号
};
