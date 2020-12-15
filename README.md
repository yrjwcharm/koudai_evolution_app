
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




