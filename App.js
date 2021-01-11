/*
 * @Date: 2020-11-03 19:28:28
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-07 12:12:32
 * @Description: app全局入口文件
 */
import * as React from 'react';
import {Provider} from 'react-redux';
import {StatusBar, Platform, BackHandler} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import AppStack from './src/routes';
import configStore from './src/redux';
import CodePush from 'react-native-code-push';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import {requestExternalStoragePermission} from './src/utils/appUtil';
import './src/common/appConfig';
const MyTheme = {
    dark: true,
    colors: {
        primary: 'rgb(0, 0, 0)',
        background: 'rgb(0, 255, 255)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(255, 0, 255)',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};
const {store, persistor} = configStore();
let codePushOptions = {
    //设置检查更新的频率
    //ON_APP_RESUME APP恢复到前台的时候
    //ON_APP_START APP开启的时候
    //MANUAL 手动检查
    checkFrequency: CodePush.CheckFrequency.MANUAL,
};
function App() {
    const scheme = useColorScheme();

    //如果有更新的提示
    const syncImmediate = () => {
        CodePush.sync({
            //安装模式
            //ON_NEXT_RESUME 下次恢复到前台时
            //ON_NEXT_RESTART 下一次重启时
            //IMMEDIATE 马上更新
            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
            //对话框
            updateDialog: {
                //是否显示更新描述
                appendReleaseDescription: true,
                //更新描述的前缀。 默认为"Description"
                descriptionPrefix: '更新内容：',
                //强制更新按钮文字，默认为continue
                mandatoryContinueButtonLabel: '立即更新',
                //强制更新时的信息. 默认为"An update is available that must be installed."
                mandatoryUpdateMessage: '必须更新后才能使用',
                //非强制更新时，按钮文字,默认为"ignore"
                optionalIgnoreButtonLabel: '稍后',
                //非强制更新时，确认按钮文字. 默认为"Install"
                optionalInstallButtonLabel: '后台更新',
                //非强制更新时，检查到更新的消息文本
                optionalUpdateMessage: '有新版本了，是否更新？',
                //Alert窗口的标题
                title: '更新提示',
            },
        });
    };
    let lastBackPressed = '';
    const onBackAndroid = () => {
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            BackHandler.exitApp(); //退出整个应用
            return false;
        }
        lastBackPressed = Date.now(); //按第一次的时候，记录时间
        // Toast.showInfo('再按一次退出应用');
        return true;
    };
    React.useEffect(() => {
        syncImmediate();
        if (Platform.OS == 'android') {
            requestExternalStoragePermission(); //申请读写权限
        }
        console.log(__DEV__);
        BackHandler.addEventListener('hardwareBackPress', onBackAndroid);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackAndroid);
        };
    });
    return (
        <RootSiblingParent>
            <StatusBar
                animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                hidden={false} //是否隐藏状态栏。
                backgroundColor={'transparent'} //状态栏的背景色
                translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
            />
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <SafeAreaProvider>
                        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
                            <AppStack />
                        </NavigationContainer>
                    </SafeAreaProvider>
                </PersistGate>
            </Provider>
        </RootSiblingParent>
    );
}

export default CodePush(codePushOptions)(App);
