/* eslint-disable no-undef */
/*
 * @Date: 2020-11-03 19:28:28
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-08 17:38:49
 * @Description: app全局入口文件
 */
import 'react-native-gesture-handler';
import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import {
    StatusBar,
    Platform,
    BackHandler,
    Linking,
    UIManager,
    AppState,
    Image,
    View,
    ImageBackground,
    Text,
    TouchableOpacity,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import {deleteModal, updateModal} from './src/redux/actions/modalInfo';
import {Modal} from './src/components/Modal';
import {Button} from './src/components/Button';
import UnderlineText from './src/components/UnderlineText';
import {px, px as text, deviceWidth} from './src/utils/appUtil';
import {Colors, Font, Style} from './src/common/commonStyle';
import saveImg from './src/utils/saveImg';
import BackgroundTimer from 'react-native-background-timer';
import CodePush from 'react-native-code-push';
import {throttle, debounce, cloneDeep} from 'lodash';
import DeviceInfo from 'react-native-device-info';
import * as WeChat from 'react-native-wechat-lib';
import {setGlobalErrorHandler} from 'react-native-error-helper';

global.ver = DeviceInfo.getVersion();
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

export const generateOptions = (modal) => {
    return {
        children: (
            <>
                <View style={Style.flexCenter}>
                    <FastImage
                        source={{
                            uri: modal.qr_code,
                        }}
                        style={styles.qrcode}
                    />
                </View>
                <Text style={styles.codeTips}>{'打开微信扫一扫二维码直接添加'}</Text>
                <Button
                    onPress={() => saveImg(modal.business_card, () => Modal.close({}, 'slide'))}
                    style={styles.saveBtn}
                    title="保存投顾二维码"
                />
            </>
        ),
        header: (
            <ImageBackground
                source={{
                    uri: modal.bg_img,
                }}
                style={styles.modalBg}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => Modal.close({}, 'slide')}
                    style={[Style.flexCenter, styles.close]}>
                    <AntDesign color={'#fff'} name="close" size={24} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{modal.title}</Text>
                <View style={[Style.flexRowCenter, {marginTop: px(8), position: 'relative'}]}>
                    <Text style={styles.modalSubtitle}>您的</Text>
                    <UnderlineText
                        style={[
                            styles.modalSubtitle,
                            {
                                fontWeight: Platform.select({
                                    android: '700',
                                    ios: '500',
                                }),
                            },
                        ]}
                        text={`专属投顾${modal.nick_name}，`}
                        underlineWidthDelta={px(-5.5)}
                    />
                    <Text style={styles.modalSubtitle}>邀请您升级为</Text>
                    <UnderlineText
                        style={[
                            styles.modalSubtitle,
                            {
                                fontWeight: Platform.select({
                                    android: '700',
                                    ios: '500',
                                }),
                            },
                        ]}
                        text={'专属一对一投顾服务'}
                    />
                </View>
                <View style={{marginTop: px(34), paddingTop: px(24), paddingLeft: px(36)}}>
                    {modal?.content_list?.map?.((item, index) => {
                        return (
                            <View
                                key={item + index}
                                style={{flexDirection: 'row', marginTop: index !== 0 ? px(12) : 0}}>
                                <FastImage
                                    source={{
                                        uri: item.icon,
                                    }}
                                    style={styles.serviceIcon}
                                />
                                <View>
                                    <Text style={styles.serviceTitle}>{item.content}</Text>
                                    <Text style={styles.serviceDesc}>{item.content_desc}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ImageBackground>
        ),
        isTouchMaskToClose: modal.touch_close,
    };
};

function App(props) {
    const navigationRef = useRef();
    const routeNameRef = useRef();
    const userInfoRef = useRef({});
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

    React.useEffect(() => {
        setGlobalErrorHandler((error, isFatal) => {
            if (__DEV__) {
                console.log('global error：', JSON.stringify(error), isFatal);
            } else {
                http.post('/mapi/report/app_log/20210101', {
                    error: JSON.stringify(error),
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

    React.useEffect(() => {
        var listener = '';
        setTimeout(() => {
            listener = store.subscribe(() => {
                const next = store.getState().userInfo.toJS();
                const prev = userInfoRef.current;
                if (!next.hotRefreshData) {
                    if (
                        (!prev.is_login && next.is_login) ||
                        (!prev.has_account && next.has_account) ||
                        (!prev.buy_status && next.buy_status) ||
                        (!prev.buy_status_for_vision && next.buy_status_for_vision)
                    ) {
                        getModalData();
                    }
                }
                if (prev.is_login) {
                    showGesture(next).then((res) => {
                        if (!res) {
                            homeShowModal.current = true;
                            onStateChange(navigationRef?.current?.getCurrentRoute()?.name, true);
                        } else {
                            homeShowModal.current = false;
                        }
                    });
                }
                userInfoRef.current = cloneDeep(next);
            });
        }, 100);
        return () => listener && listener();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showGesture = async (userinfo) => {
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
    };
    const onStateChange = React.useCallback(
        (currentRouteName, show) => {
            const modalInfo = store.getState().modalInfo.toJS();
            if (Object.keys(modalInfo).length > 0) {
                if (modalInfo.page) {
                    if (modalInfo.page?.includes(currentRouteName)) {
                        if (currentRouteName === 'Home') {
                            if (show) {
                                showModal(modalInfo);
                            }
                        } else {
                            showModal(modalInfo);
                        }
                    }
                } else {
                    if (currentRouteName === 'Index') {
                        showModal(modalInfo);
                    }
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const getModalData = () => {
        http.get('/common/layer/20210101').then((res) => {
            if (res.code === '000000') {
                if (res.result.image) {
                    Image.getSize(res.result.image, (w, h) => {
                        const height = Math.floor(h / (w / (res.result.device_width ? deviceWidth : text(280))));
                        res.result.imgHeight = height || text(375);
                        if (res.result.page) {
                            if (res.result?.page?.includes(navigationRef?.current?.getCurrentRoute()?.name)) {
                                showModal(res.result);
                            } else {
                                store.dispatch(updateModal(res.result));
                            }
                        } else {
                            if (navigationRef?.current?.getCurrentRoute()?.name === 'Index') {
                                showModal(res.result);
                            } else {
                                store.dispatch(updateModal(res.result));
                            }
                        }
                    });
                } else {
                    if (res.result.page) {
                        if (res.result?.page?.includes(navigationRef?.current?.getCurrentRoute()?.name)) {
                            showModal(res.result);
                        } else {
                            store.dispatch(updateModal(res.result));
                        }
                    } else {
                        if (navigationRef?.current?.getCurrentRoute()?.name === 'Index') {
                            showModal(res.result);
                        } else {
                            store.dispatch(updateModal(res.result));
                        }
                    }
                }
            }
        });
    };
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
    const showModal = throttle((modal) => {
        if (modal.log_id) {
            http.post('/common/layer/click/20210801', {log_id: modal.log_id});
            global.LogTool('campaignPopup', navigationRef.current.getCurrentRoute().name, modal.log_id);
        }
        let options = {
            confirmCallBack: () => {
                if (modal.confirm?.act === 'back') {
                    navigationRef.current?.goBack?.();
                } else if (modal.confirm?.act === 'jump') {
                    jump(navigationRef.current, modal.confirm?.url || '');
                } else {
                    jump(navigationRef.current, modal.confirm?.url || modal.url || '');
                }
                modal.log_id &&
                    global.LogTool('campaignPopupStart', navigationRef.current.getCurrentRoute().name, modal.log_id);
            },
            id: modal.log_id,
            isTouchMaskToClose: modal.touch_close,
        };
        let type = 'fade';
        if (modal.type === 'image' || modal.type === 'diy_image') {
            options = {
                ...options,
                type: 'image',
                imageUrl: modal.image,
                imgWidth: modal.device_width ? deviceWidth : 0,
                imgHeight: modal.imgHeight,
            };
            if (modal.type === 'diy_image') {
                options.content = {
                    title: modal.title,
                    text: modal.content,
                    tip: modal.tip,
                };
            }
        } else if (modal.type === 'alert_image' || modal.type === 'confirm') {
            options = {
                ...options,
                confirm: modal.cancel ? true : false,
                confirmText: modal.confirm?.text || '',
                cancelCallBack: () => {
                    if (modal.cancel?.act === 'back') {
                        navigationRef.current?.goBack?.();
                    } else if (modal.cancel?.act === 'jump') {
                        jump(navigationRef.current, modal.cancel?.url || '');
                    } else {
                        jump(navigationRef.current, modal.cancel?.url || '');
                    }
                },
                cancelText: modal.cancel?.text || '',
                content: modal.content || '',
            };
            if (modal.type === 'alert_image') {
                options.customTitleView = (
                    <Image
                        source={{uri: modal.image}}
                        style={{
                            width: text(280),
                            height: modal.imgHeight,
                            borderTopRightRadius: 8,
                            borderTopLeftRadius: 8,
                        }}
                    />
                );
            }
            if (modal.type === 'confirm') {
                options.title = modal.title || '';
            }
        } else if (modal.type === 'user_guide') {
            options = {
                ...options,
                confirmCallBack: () => {
                    global.LogTool('copyBindAccountStart');
                    Linking.canOpenURL('weixin://').then((supported) => {
                        if (supported) {
                            Linking.openURL('weixin://');
                        } else {
                            Toast.show('请先安装微信');
                        }
                    });
                },
                data: modal,
                type: 'user_guide',
            };
        } else if (modal.type === 'add_wechat_guide') {
            options = generateOptions(modal);
            type = 'slide';
        }
        if (modal.type) {
            Modal.show(options, type);
        }
        store.dispatch(deleteModal());
    }, 10000);

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
                                onStateChange(currentRouteName, homeShowModal.current);
                                let article_id = getRouteNameId(currentRoute, 'ArticleDetail', 'article_id');
                                let cu_plan_id = getRouteNameId(currentRoute, 'DetailAccount', 'cu_plan_id');
                                let poid = getRouteNameId(currentRoute, 'DetailPolaris', 'poid');
                                let scene = getRouteNameId(currentRoute, 'LCMF', 'scene');
                                let type = getRouteNameId(currentRoute, 'MessageNotice', 'type');
                                let assetPoid = getRouteNameId(currentRoute, 'PortfolioAssets', 'poid');
                                let currentRoutePageId =
                                    currentRouteName + article_id + cu_plan_id + poid + scene + type + assetPoid;
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

const styles = StyleSheet.create({
    modalBg: {
        width: deviceWidth,
        height: px(388),
        position: 'relative',
    },
    close: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: px(60),
        height: px(60),
    },
    modalTitle: {
        marginTop: px(44),
        fontSize: px(22),
        lineHeight: px(30),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '500'}),
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#fff',
        fontWeight: Platform.select({android: '100', ios: '300'}),
        textAlign: 'center',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        height: px(9),
        backgroundColor: '#003FAC',
    },
    serviceIcon: {
        marginTop: px(2),
        marginRight: px(10),
        width: px(16),
        height: px(16),
    },
    serviceTitle: {
        fontSize: Font.textH1,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    serviceDesc: {
        marginTop: px(2),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    qrcode: {
        marginTop: px(14),
        width: px(94),
        height: px(94),
    },
    codeTips: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
        textAlign: 'center',
    },
    saveBtn: {
        marginTop: px(20),
        marginHorizontal: px(68),
        marginBottom: px(28),
        borderRadius: px(22.5),
    },
});

export default App;
