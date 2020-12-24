
### 开发规范
  http://wiki.licaimofang.com:8090/pages/viewpage.action?pageId=7148092
### git提交规范
  推荐使用commitizen规范提交信息
### 1、安装app
 #### 安装Node, Watchman
    
```
brew install node
brew install watchman
```
如果你已经安装了 Node，请检查其版本是否在 v12 以上。
### 2、安装CocoaPods
CocoaPods是用 Ruby 编写的包管理器。从 0.60 版本开始 react native 的 iOS 版本需要使用 CocoaPods 来管理依赖。

```
sudo gem install cocoapods
或
brew install cocoapods
```
### 3、安装react-native-cli脚手架

```
npm install -g react-native-cli
```
npm慢得话，可以使用以下方式切换淘宝源

```
# 使用nrm工具切换淘宝源
npx nrm use taobao

# 如果之后需要切换回官方源可使用
npx nrm use npm
```
### 4、安装项目依赖包

```
npm install
#ios需要执行一下命令
cd ios&&pod installl
```
### 5、启动项目(模拟器)

```
react-native run-ios 启动IOS
react-native run-android 启动安卓
```

### 调试app
通过以下命令打开调试窗口

```
ios模拟器 commond+D   commond+R(刷新模拟器) 
安卓 commond+M
```



## 开发规范

### 一、关于命名
（1） 代码中命名均不能以下划线或美元符号开始，也不能以下划线或美元符号结束
    
```
 [反例]_name / $Object / name_ / name$ / Object$
```

（2）类名使用 UpperCamelCase 风格，必须遵从驼峰形式，第一个字母必须大写

```
export default class AnXinSharePage extends PureComponent {}
```
（3）方法名、参数名、成员变量、局部变量都统一使用 lowerCamelCase风格，必须遵从驼峰形式，第一个字母必须小写

```
constructor(props) {
    super(props);
    this.isFromNative = this.props.navigation.state.params ? false : true;
    this.params = this.props.navigation.state.params || this.props.screenProps;
  }
    state = {
      /**
       * 分数
       */
      score: 200,
      /**
       * 百分比
       */
      percent: "20%",
    };
```
（4）常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长,记得加注释便于后人理解 (如开户，定义时间常量便于统一修改)

```
export const FamilyMemberKey = {
  /**
   * 关系
   */
  RELATION: "relation",
  /**
   * 身份证号
   */
  IDCARD: "idCard",
  /**
   * 姓名
   */
  NAME: "name",
  /**
   * 性别
   */
  SEX: "gender",
  /**
   * 地址
   */
  ADDRESS: "address",
  /**
   * 生日
   */
  BIRTHDAY: "birthday",
  /**
   * 英文名
   */
  ENGNAME: "engName",
  /**
   * 手机号
   */
  MOBILE: "mobile",
  /**
   * 身高
   */
  HEIGHT: "height"
}
```
#### 二、关于代码格式化
（1）import 导入，一个import独占一行

```
import {Image, ImageBackground, NativeModules, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {PureComponent} from 'react';
import {StyleConfig} from "../../resources/style";
import {SafeAreaView} from "react-navigation";
import Button from 'react-native-button';
import {XAnimatedProgress} from '@xyz/react-native-xprogress';
```
（3）外部样式格式化，左括号必须强制换行，一个属性独占一行，以强制换行右括号结尾

```
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  messageStyle: {
    marginTop: 65,
    marginHorizontal: 43.5,
  },
  progressViewStyle: {
    marginTop: 39,
    alignItems: "center"
  },
  shareViewStyle: {
    width: StyleConfig.screen_width,
    marginTop: 67,
    marginBottom: 37,
    justifyContent: "center",
    alignItems: "center"
  },
});
```
（4）少用行内样式，如果是组件属性则应换行展示

```
  renderProgressView() {
    return (
      <View style={styles.progressViewStyle}>
        <XAnimatedProgress
          style={{}}
          fill={this.state.score}
          rate={1500}
          gradientStartColor="#ffffff"
          gradientEndColor="#ffffff"
          width={185}
          height={220}
          dashOffset={533}
          innerPath="M88,188 C88,188 13,163 13,75.5 C13,13 25.5,13 88,13 C150.5,13 163,13 163,75.5 C163,163 88,188 88,188 Z"
          progressWidth={15}
          shadowOffset={0}
          outerTransformOne="translate(-212.000000, -482.000000)"
          outerTransformTwo="translate(212.000000, 482.000000)"
          innerTransformOne="translate(-217.000000, -487.000000)"
          innerTransformTwo="translate(212.000000, 482.000000)"
          startTransparent={1}
          endTransparent={0.2}
          children={this.renderChildView}/>
      </View>
    );
  }
```
**（5）提交代码之前必须格式化代码和删除未使用的import**

#### 三、关于代码注释
（1）所有的类都必须添加创建者信息，以及类的说明

```
/**
 * 作者：郭翰林
 * 时间：2018/7/26 0026 8:48
 * 注释：更新家庭成员资料
 */
class UpdateFamilyMemberPage extends PureComponent {
``` 
（2） 类、类属性、类方法的注释必须使用 Javadoc 规范，使用/**内容*/格式，不得使用 //xxx 方式；
    vscode推荐插件 **Document This**
    
（3）方法内部单行注释，在被注释语句上方另起一行，使用//注释

```
async getUserInfo() {
    this.userInfo = await UserBridge.getUser();
    if (this.userInfo) {
        //获取性别
        if (Platform.OS === "ios") {
            const {gender} = this.userInfo;
            this.setState({gender: gender});
        } else {
            const {linkman: {gender}} = this.userInfo;
            this.setState({gender: gender});
        }
        //是否实名认证
        const {authStatus} = this.userInfo;
        this.setState({authStatus: authStatus});
    }
}
```
（4）JSX复杂页面绘制应该抽出单独组件，复杂逻辑应添加注释标记


```
<ScrollView style={{flex: 1, backgroundColor: StyleConfig.color_background}}
            contentContainerStyle={{paddingTop: 0, paddingBottom: 0}}
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
    <View>
        {/*个人资料*/}
        <PersonalDataView
                props={this.props} 
                isAdd={false}
                isShowRelationship={this.state.insurantId ? true : false}
                gender={this.state.gender}
                authStatus={this.state.authStatus ? this.state.authStatus : -1}
        />
        {/*生活习惯*/}
        <LifeHabitView props={this.props}/>
        {/*职业信息*/}
        <JobInfoView props={this.props}/>
        {/*财务信息*/}
        <FinanceInfoView props={this.props}/>
        <View style={{height: 44, alignItems: 'center', marginTop: 30}}>
            <XLargeButton onPress={() => this.filterUpdate()}>保存</XLargeButton>
        </View>
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 40}}>
            <Text style={styles.textStyle}>个人信息仅用于给你提供新一站服务时使用。</Text>
        </View>
    </View>
</ScrollView>
```
**（5）不允许残留注释代码，注释掉的确认不用的代码应当删除**

#### 四、关于代码编写规范
（1）Props属性一定要写方法检测及默认值初始化

```
  static propTypes = {
    props: PropTypes.any,
    isAdd: PropTypes.bool,
    isShowRelationship: PropTypes.bool,
    gender: PropTypes.number,
    authStatus: PropTypes.number
  }
  static defaultProps = {
      color: '#1e90ff',
      dotRadius: 10,
      size: 40
  };
```
（2）如果元素内没有子视图，则标签应该闭合

```
<LifeHabitView props={this.props}/>  //正确
<LifeHabitView props={this.props}></LifeHabitView>//错误
```

（3）内部变量使用let,常量不变值使用const,不要再使用var

（4）尽量采用解构赋值的写法获取参数，不要使用xxxx.xxx.xxx的方式获取参数

 (5)state变量应当事先在constructor()中声明,不涉及页面刷新的变量不应写入state中

```
  constructor (props) {
    super(props)
    this.insurantId = ''
    /**
     * 表单数据
     * @type {{}}
     */
    this.forms = {}
    this.joinEvalution = props.navigation.state.params.joinEvalution
  }
   state = {
      modalMeVisiable: false,
      modalCoverVisiable: false,
      modalErrorVisiable: false,
      isLoading: false,
      gender: 1,
      errorMsg: '',
    }

```
**(6)开发中应尽量使用公共样式及组件，多次出现的模块应抽离出组件,自定义组件命名中必须包含Component**

**(7) 当使用单一属性，或者全局样式属性时，推荐使用公共样式类**

######  关系到性能优化
**(8)代码中函数绑定this，强制使用箭头函数,尽量不用bind手动绑定**

**(9) 当组件使用样式属性达到三个或者三个以上时，必须使用StyleSheet来创建样式属性并进行引用（尽量不写行内样式）**


**(10)长列表开发时用Flatlist，不要直接循环**


#### 注释模版配置
vscode安装koroFileheader插件
```
  "fileheader.customMade": { //此为头部注释
    "Description": "",
    "Autor": "yhc",
    "Date": "Do not edit",
    "LastEditors": "yhc",
    "LastEditTime": "Do not edit"
  },
```











