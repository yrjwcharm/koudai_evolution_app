/* eslint-disable no-undef */
/*
 * @Date: 2020-11-03 19:28:28
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-26 13:54:33
 * @Description: app全局入口文件
 */
import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import {StatusBar, Platform, BackHandler, Linking, UIManager, AppState} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
// import {useColorScheme} from 'react-native-appearance';
import AppStack from './src/routes';
import configStore from './src/redux';
import CodePush from 'react-native-code-push';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import * as MagicMove from 'react-native-magic-move';
import * as WeChat from 'react-native-wechat-lib';
import './src/common/appConfig';
import './src/utils/LogTool';
import Toast from './src/components/Toast';
import http from './src/services';
import Storage from './src/utils/storage';
import {getAppMetaData} from 'react-native-get-channel';
import NetInfo from '@react-native-community/netinfo';
import JPush from 'jpush-react-native';
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest; //调试中可看到网络请求
if (Platform.OS === 'android') {
    //启用安卓动画
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
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
function App(props) {
    // const scheme = useColorScheme();
    const navigationRef = useRef();
    const routeNameRef = useRef();
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
        Toast.show('再按一次退出应用');
        return true;
    };
    const postHeartData = (registerID, channel) => {
        http.post('/common/device/heart_beat/20210101', {
            channel: channel,
            jpush_rid: registerID,
            platform: Platform.OS,
        });
    };
    // heartbeat
    const heartBeat = () => {
        JPush.getRegistrationID((result) => {
            if (Platform.OS == 'android') {
                getAppMetaData('UMENG_CHANNEL')
                    .then((data) => {
                        postHeartData(result.registerID, data);
                        global.channel = data;
                    })
                    .catch(() => {
                        global.channel = '';
                        postHeartData(result.registerID, 'android');
                        console.log('获取渠道失败');
                    });
            } else {
                global.channel = 'ios';
                postHeartData(result.registerID, 'ios');
            }
        });
    };
    global.ErrorUtils.setGlobalHandler((error) => {
        console.log('ErrorUtils发现了语法错误，避免了崩溃，具体报错信息：');
        console.log(error.name, error.message, [{text: 'OK'}]);
    }, true);
    React.useEffect(() => {
        heartBeat();
        setInterval(() => {
            heartBeat();
        }, 60 * 5 * 1000);
    }, []);
    React.useEffect(() => {
        NetInfo.addEventListener((state) => {
            if (!state.isConnected) {
                Toast.show('网络已断开,请检查您的网络');
            }
        });
    }, []);
    React.useEffect(() => {
        WeChat.registerApp('wx38a79825fa0884f4', 'https://msite.licaimofang.com/lcmf/');

        //热更新
        // syncImmediate();

        //刷新token
        Storage.get('loginStatus').then((res) => {
            if (res && res.refresh_token) {
                var ts = new Date().getTime();
                if (ts > res.expires_at * 1000) {
                    http.get('/auth/user/token_refresh/20210101', {refresh_token: res.refresh_token}).then((data) => {
                        Storage.save('loginStatus', data.result);
                    });
                }
            }
        });

        // 监控设备激活/后台状态
        AppState.addEventListener('change', _handleAppStateChange);

        // console.log(__DEV__);
        BackHandler.addEventListener('hardwareBackPress', onBackAndroid);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackAndroid);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        const appState = AppState.currentState;
        if (appState.match(/inactive|background/) || nextAppState === 'active') {
            LogTool(appState);
        }
    };
    // const prefix = Linking.makeUrl('/');
    const linking = {
        // prefixes: [prefix],
        config: {
            screens: {
                Login: {
                    path: 'login',
                },
                HomeStack: {
                    path: 'stack',
                    initialRouteName: 'Home',
                    screens: {
                        Home: 'home',
                        Profile: {
                            path: 'user/:id/:age',
                            parse: {
                                id: (id) => `there, ${id}`,
                                age: Number,
                            },
                            stringify: {
                                id: (id) => id.replace('there, ', ''),
                            },
                        },
                    },
                },
                Settings: 'settings',
            },
        },
    };
    let ts = new Date().getTime();
    return (
        <SafeAreaProvider>
            <RootSiblingParent>
                <Provider store={store}>
                    <StatusBar
                        animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                        hidden={false} //是否隐藏状态栏。
                        backgroundColor={'transparent'} //状态栏的背景色
                        translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                        barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
                    />
                    <MagicMove.Provider>
                        <PersistGate loading={null} persistor={persistor}>
                            <NavigationContainer
                                // theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
                                ref={navigationRef}
                                onReady={() => {
                                    // console.log(object)
                                    global.refName = navigationRef.current.getCurrentRoute().name;
                                    return (routeNameRef.current = navigationRef.current.getCurrentRoute().name);
                                }}
                                onStateChange={() => {
                                    var staytime = new Date().getTime() - ts;
                                    ts = new Date().getTime();
                                    const previousRouteName = routeNameRef.current;
                                    const currentRouteName = navigationRef.current.getCurrentRoute().name;
                                    // console.log(navigationRef.current.getCurrentRoute());
                                    global.previousRouteName = previousRouteName;
                                    global.currentRouteName = currentRouteName;
                                    if (previousRouteName !== currentRouteName) {
                                        LogTool('jump', null, null, currentRouteName, previousRouteName, null, null);
                                        LogTool('staytime', null, null, previousRouteName, null, staytime);
                                    }
                                    // Save the current route name for later comparison
                                    routeNameRef.current = currentRouteName;
                                }}
                                linking={linking}>
                                <AppStack />
                            </NavigationContainer>
                        </PersistGate>
                    </MagicMove.Provider>
                </Provider>
            </RootSiblingParent>
        </SafeAreaProvider>
    );
}

export default CodePush(codePushOptions)(App);
