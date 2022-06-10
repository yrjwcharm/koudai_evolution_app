/* eslint-disable no-undef */
/*
 * @Date: 2020-11-03 19:28:28
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-10 13:25:02
 * @Description: app全局入口文件
 */
import 'react-native-gesture-handler';
import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import {StatusBar, Platform, BackHandler, UIManager, AppState, DeviceEventEmitter} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './src/routes';
import configStore from './src/redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import './src/common/appConfig';
import './src/utils/LogTool';
import Toast from './src/components/Toast';
import http from './src/services';
import Storage from './src/utils/storage';
import NetInfo from '@react-native-community/netinfo';
import {updateVerifyGesture, getUserInfo, updateUserInfo, getAppConfig} from './src/redux/actions/userInfo';
import BackgroundTimer from 'react-native-background-timer';
import CodePush from 'react-native-code-push';
import {debounce} from 'lodash';
import DeviceInfo from 'react-native-device-info';
import {setGlobalErrorHandler} from 'react-native-error-helper';
import {useStateChange} from './src/components/hooks';
import {navigationRef} from './src/components/hooks/RootNavigation';
global.ver = DeviceInfo.getVersion();
const key = Platform.select({
    // ios: 'rRXSnpGD5tVHv9RDZ7fLsRcL5xEV4ksvOXqog',
    // android: 'umln5OVCBk6nTjd37apOaHJDa71g4ksvOXqog',
    ios: 'ESpSaqVW6vnMpDSxV0OjVfbSag164ksvOXqog',
    android: 'Zf0nwukX4eu3BF8c14lysOLgVC3O4ksvOXqog',
});

if (process.env.NODE_ENV === 'development') {
    //调试中可看到网络请求
    global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
    global.WebSocket = global.originalWebSocket || global.WebSocket;
}

if (Platform.OS === 'android') {
    //启用安卓动画
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const {store, persistor} = configStore();

function App(props) {
    const routeNameRef = useRef();
    const homeShowModal = useRef(true);
    const onStateChange = useStateChange({homeShowModal, store});
    let lastBackPressed = '';
    const onBackAndroid = () => {
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            store.dispatch(updateVerifyGesture(false));
            BackHandler.exitApp(); //退出整个应用
            return false;
        }
        lastBackPressed = Date.now(); //按第一次的时候，记录时间
        Toast.show('再按一次退出应用');
        return true;
    };

    React.useEffect(() => {
        setGlobalErrorHandler((error, isFatal) => {
            if (__DEV__) {
                console.log('global error：', error, isFatal);
            } else {
                http.post('/mapi/report/app_log/20210101', {
                    error: error,
                });
            }
        }, true);

        //厂商通道收到 push
        DeviceEventEmitter.addListener('jdeeplink', (e) => {
            store.dispatch(updateUserInfo({pushRoute: JSON.parse(e.extras)?.route}));
        });
        CodePush.checkForUpdate(key)
            .then((update) => {
                if (!update) {
                    store.dispatch(updateUserInfo({hotRefreshData: ''}));
                } else {
                    store.dispatch(updateUserInfo({hotRefreshData: update}));
                }
            })
            .catch((res) => {
                store.dispatch(updateUserInfo({hotRefreshData: ''}));
            });
    }, []);

    React.useEffect(() => {
        NetInfo.addEventListener(
            debounce((state) => {
                if (!state.isConnected) {
                    Toast.show('网络已断开,请检查您的网络');
                } else {
                    store.dispatch(getUserInfo());
                    store.dispatch(getAppConfig());
                }
            }, 500)
        );
    }, []);
    React.useEffect(() => {
        //刷新token
        Storage.get('loginStatus').then((res) => {
            if (res && res.refresh_token) {
                var ts = new Date().getTime();
                if (ts > res.expires_at * 1000) {
                    http.post('/auth/user/refresh_token/20210101', {refresh_token: res.refresh_token}).then((data) => {
                        Storage.save('loginStatus', data.result);
                    });
                }
            }
        });

        // 监控设备激活/后台状态
        AppState.addEventListener('change', _handleAppStateChange);
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
        if (appState.match(/background/)) {
            BackgroundTimer.runBackgroundTimer(() => {
                store.dispatch(updateVerifyGesture(false));
            }, 10 * 60 * 1000);
        } else if (appState === 'active') {
            BackgroundTimer.stopBackgroundTimer();
        }
    };
    const getRouteNameId = (route, routeName, id) => {
        if (route.name == routeName && route.params?.[id]) {
            return route.params?.[id];
        } else {
            return '';
        }
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
                    <PersistGate loading={null} persistor={persistor}>
                        <NavigationContainer
                            // theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
                            ref={navigationRef}
                            onReady={() => {
                                global.refName = navigationRef.current.getCurrentRoute().name;
                                return (routeNameRef.current = navigationRef.current.getCurrentRoute().name);
                            }}
                            onStateChange={() => {
                                var staytime = new Date().getTime() - ts;
                                ts = new Date().getTime();
                                const previousRoutePageId = routeNameRef.current;
                                const currentRouteName = navigationRef.current.getCurrentRoute().name;
                                let currentRoute = navigationRef.current.getCurrentRoute();
                                onStateChange(currentRouteName, homeShowModal.current, navigationRef);
                                let article_id = getRouteNameId(currentRoute, 'ArticleDetail', 'article_id');
                                let cu_plan_id = getRouteNameId(currentRoute, 'DetailAccount', 'cu_plan_id');
                                let poid = getRouteNameId(currentRoute, 'DetailPolaris', 'poid');
                                let scene = getRouteNameId(currentRoute, 'LCMF', 'scene');
                                let type = getRouteNameId(currentRoute, 'MessageNotice', 'type');
                                let assetPoid = getRouteNameId(currentRoute, 'PortfolioAssets', 'poid');
                                let cate_id = getRouteNameId(currentRoute, 'ArticleList', 'id');
                                let currentRoutePageId =
                                    currentRouteName +
                                    article_id +
                                    cu_plan_id +
                                    poid +
                                    scene +
                                    type +
                                    assetPoid +
                                    cate_id;
                                global.previousRoutePageId = previousRoutePageId;
                                global.currentRoutePageId = currentRoutePageId;
                                if (previousRoutePageId !== currentRouteName) {
                                    LogTool('jump', null, null, currentRoutePageId, previousRoutePageId, null, null);
                                    LogTool('staytime', null, null, previousRoutePageId, null, staytime);
                                }
                                routeNameRef.current = currentRoutePageId;
                            }}>
                            <AppStack />
                        </NavigationContainer>
                    </PersistGate>
                </Provider>
            </RootSiblingParent>
        </SafeAreaProvider>
    );
}

export default App;
