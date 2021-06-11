/* eslint-disable no-undef */
/*
 * @Date: 2020-11-03 19:28:28
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-11 14:54:01
 * @Description: app全局入口文件
 */
import 'react-native-gesture-handler';
import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import {StatusBar, Platform, BackHandler, Linking, UIManager, AppState, Image} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './src/routes';
import configStore from './src/redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import * as WeChat from 'react-native-wechat-lib';
import './src/common/appConfig';
import './src/utils/LogTool';
import Toast from './src/components/Toast';
import http from './src/services';
import Storage from './src/utils/storage';
import {getAppMetaData} from 'react-native-get-channel';
import NetInfo from '@react-native-community/netinfo';
import JPush from 'jpush-react-native';
import {updateVerifyGesture, getUserInfo, updateUserInfo} from './src/redux/actions/userInfo';
import {Modal} from './src/components/Modal';
import {px as text, deviceWidth} from './src/utils/appUtil';
import BackgroundTimer from 'react-native-background-timer';
import CodePush from 'react-native-code-push';

const key = Platform.select({
    // ios: 'rRXSnpGD5tVHv9RDZ7fLsRcL5xEV4ksvOXqog',
    // android: 'umln5OVCBk6nTjd37apOaHJDa71g4ksvOXqog',
    ios: 'ESpSaqVW6vnMpDSxV0OjVfbSag164ksvOXqog',
    android: 'Zf0nwukX4eu3BF8c14lysOLgVC3O4ksvOXqog',
});
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest; //调试中可看到网络请求
if (Platform.OS === 'android') {
    //启用安卓动画
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const {store, persistor} = configStore();

function App(props) {
    const navigationRef = useRef();
    const routeNameRef = useRef();
    const [modalObj, setModalObj] = React.useState({});
    const [userInfo, setUserInfo] = React.useState({});
    const imageH = useRef(0);
    const homeShowModal = useRef(true);

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
    const postHeartData = (registerID, channel) => {
        http.post('/common/device/heart_beat/20210101', {
            channel: channel,
            jpush_rid: registerID,
            platform: Platform.OS,
        });
    };
    // heartbeat
    const heartBeat = React.useCallback(() => {
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
    }, []);
    global.ErrorUtils.setGlobalHandler((error) => {
        console.log('ErrorUtils发现了语法错误，避免了崩溃，具体报错信息：');
        console.log(error, error.name, error.message);
        http.post('/mapi/report/app_log/20210101', {
            error: JSON.stringify(error),
            error_type: error.name,
            error_msg: error.message,
        });
    }, true);
    React.useEffect(() => {
        heartBeat();
        setInterval(() => {
            heartBeat();
        }, 60000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useEffect(() => {
        NetInfo.addEventListener((state) => {
            if (!state.isConnected) {
                Toast.show('网络已断开,请检查您的网络');
            } else {
                store.dispatch(getUserInfo());
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
    React.useEffect(() => {
        CodePush.checkForUpdate(key)
            .then((update) => {
                if (!update) {
                    store.dispatch(updateUserInfo({hotRefreshData: ''}));
                } else {
                    store.dispatch(updateUserInfo({hotRefreshData: update}));
                }
            })
            .catch((res) => {
                console.log('store.dispatch(updateUserInfo({hotRefresh: true}));');
                store.dispatch(updateUserInfo({hotRefreshData: ''}));
                console.log(JSON.stringify(res));
            });
    }, []);
    React.useEffect(() => {
        const listener = store.subscribe(() => {
            console.log(' React.useEffect(() ');
            const next = store.getState().userInfo.toJS();
            setUserInfo((prev) => {
                if (!next.hotRefreshData) {
                    if (!prev.is_login && next.is_login) {
                        getModalData();
                    }
                }

                if (prev.is_login) {
                    showGesture(next).then((res) => {
                        if (!res) {
                            // console.log('-------------true');
                            homeShowModal.current = true;
                            onStateChange(navigationRef?.current?.getCurrentRoute()?.name, true);
                        } else {
                            // console.log('-------------false');
                            homeShowModal.current = false;
                        }
                    });
                }
                return next;
            });
        });
        return () => listener();
    }, [getModalData, modalObj, onStateChange, showGesture]);

    const showGesture = React.useCallback((userinfo) => {
        return (async function () {
            const res = await Storage.get('gesturePwd');
            if (res && res[`${userinfo.uid}`]) {
                const result = await Storage.get('openGesturePwd');
                if (result && result[`${userinfo.uid}`]) {
                    if (userinfo.is_login && !userinfo.verifyGesture) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        })();
    }, []);
    const onStateChange = React.useCallback(
        (currentRouteName, show) => {
            if (Object.keys(modalObj).length > 0) {
                if (modalObj.page) {
                    if (modalObj.page === currentRouteName) {
                        if (currentRouteName === 'Home') {
                            if (show) {
                                showModal(modalObj);
                            }
                        } else {
                            showModal(modalObj);
                        }
                    }
                } else {
                    if (currentRouteName === 'Index') {
                        showModal(modalObj);
                    }
                }
            }
        },
        [modalObj, showModal]
    );
    const getModalData = React.useCallback(() => {
        http.get('/common/layer/20210101').then((res) => {
            if (res.code === '000000') {
                if (res.result.image) {
                    Image.getSize(res.result.image, (w, h) => {
                        const height = Math.floor(h / (w / (res.result.device_width ? deviceWidth : text(280))));
                        imageH.current = height;
                        if (res.result.page) {
                            if (res.result.page === navigationRef?.current?.getCurrentRoute()?.name) {
                                showModal(res.result);
                            } else {
                                setModalObj(res.result);
                            }
                        } else {
                            if (navigationRef?.current?.getCurrentRoute()?.name === 'Index') {
                                showModal(res.result);
                            } else {
                                setModalObj(res.result);
                            }
                        }
                    });
                } else {
                    if (res.result.page) {
                        if (res.result.page === navigationRef?.current?.getCurrentRoute()?.name) {
                            showModal(res.result);
                        } else {
                            setModalObj(res.result);
                        }
                    } else {
                        if (navigationRef?.current?.getCurrentRoute()?.name === 'Index') {
                            showModal(res.result);
                        } else {
                            setModalObj(res.result);
                        }
                    }
                }
            }
        });
    }, [showModal]);
    const jump = (navigation, url, type = 'navigate') => {
        if (url) {
            if (url.type === 2) {
                Linking.canOpenURL(url.path)
                    .then((supported) => {
                        if (!supported) {
                            return Toast.show('您的设备不支持打开网址');
                        }
                        return Linking.openURL(url.path);
                    })
                    .catch((err) => Toast.show(err));
            } else if (url.type === 3) {
                navigation[type]('OpenPdf', {url: url.path});
            } else if (url.type == 5) {
                WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                        WeChat.launchMiniProgram({
                            userName: url?.params?.app_id,
                            miniProgramType: 0,
                            path: url.path,
                        });
                    } else {
                        Toast.show('请安装微信');
                    }
                });
            } else {
                navigation[type](url.path, url.params || {});
            }
        }
    };
    const showModal = React.useCallback((modal) => {
        if (modal.type === 'image') {
            Modal.show({
                type: 'image',
                imageUrl: modal.image,
                imgWidth: modal.device_width ? deviceWidth : 0,
                imgHeight: imageH.current,
                isTouchMaskToClose: modal.touch_close,
                confirmCallBack: () => {
                    modal.log_id && global.LogTool(modal.log_id);
                    jump(navigationRef.current, modal.url);
                },
            });
        } else if (modal.type === 'alert_image') {
            Modal.show({
                confirm: modal.cancel ? true : false,
                confirmCallBack: () => jump(navigationRef.current, modal.confirm.url || ''),
                clickClose: false,
                confirmText: modal.confirm.text || '',
                cancelCallBack: () => jump(navigationRef.current, modal.cancel?.url || ''),
                cancelText: modal.cancel?.text || '',
                content: modal.content || '',
                customTitleView: (
                    <Image
                        source={{uri: modal.image}}
                        style={{
                            width: text(280),
                            height: imageH.current,
                            borderTopRightRadius: 8,
                            borderTopLeftRadius: 8,
                        }}
                    />
                ),
                isTouchMaskToClose: modal.touch_close,
            });
        } else if (modal.type === 'confirm') {
            Modal.show({
                confirm: modal.cancel ? true : false,
                confirmCallBack: () => jump(navigationRef.current, modal.confirm.url || ''),
                confirmText: modal.confirm.text || '',
                cancelCallBack: () => jump(navigationRef.current, modal.cancel?.url || ''),
                cancelText: modal.cancel?.text || '',
                content: modal.content || '',
                isTouchMaskToClose: modal.touch_close,
                title: modal.title || '',
            });
        } else if (modal.type === 'diy_image') {
            Modal.show({
                type: 'image',
                imageUrl: modal.image,
                imgWidth: modal.device_width ? deviceWidth : 0,
                imgHeight: imageH.current,
                isTouchMaskToClose: modal.touch_close,
                confirmCallBack: () => {
                    // console.log(navigationRef.current);
                    jump(navigationRef.current, modal.url);
                },
                content: {
                    title: modal.title,
                    text: modal.content,
                    tip: modal.tip,
                },
            });
        }
        setTimeout(() => {
            setModalObj({});
        }, 500);
    }, []);
    const _handleAppStateChange = (nextAppState) => {
        const appState = AppState.currentState;
        if (appState.match(/inactive|background/) || nextAppState === 'active') {
            LogTool(appState);
        }
        if (appState.match(/background/)) {
            BackgroundTimer.runBackgroundTimer(() => {
                store.dispatch(updateVerifyGesture(false));
            }, 600000);
        } else if (appState.match(/active/)) {
            BackgroundTimer.stopBackgroundTimer();
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
                                onStateChange(currentRouteName, homeShowModal.current);
                                let article_id = getRouteNameId(currentRoute, 'ArticleDetail', 'article_id');
                                let cu_plan_id = getRouteNameId(currentRoute, 'DetailAccount', 'cu_plan_id');
                                let poid = getRouteNameId(currentRoute, 'DetailPolaris', 'poid');
                                let scene = getRouteNameId(currentRoute, 'LCMF', 'scene');
                                let type = getRouteNameId(currentRoute, 'MessageNotice', 'type');
                                let currentRoutePageId =
                                    currentRouteName + article_id + cu_plan_id + poid + scene + type;
                                global.previousRoutePageId = previousRoutePageId;
                                global.currentRoutePageId = currentRoutePageId;
                                if (previousRoutePageId !== currentRouteName) {
                                    LogTool('jump', null, null, currentRoutePageId, previousRoutePageId, null, null);
                                    LogTool('staytime', null, null, previousRoutePageId, null, staytime);
                                }
                                routeNameRef.current = currentRoutePageId;
                            }}
                            linking={linking}>
                            <AppStack />
                        </NavigationContainer>
                    </PersistGate>
                </Provider>
            </RootSiblingParent>
        </SafeAreaProvider>
    );
}

export default App;
