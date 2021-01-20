/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-20 11:44:58
 * @Description:路由表
 */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import TabScreen from './Tabbar';
import DetailScreen from '../pages/Detail/index';
import GesturePassword from '../pages/Personal/GesturePassword';
import LineChart from '../pages/Chart/lineChart.js';
import Feather from 'react-native-vector-icons/Feather';
import StickyScreen from '../pages/sticky';
import {Colors} from '../common/commonStyle';
import AppGuide from '../pages/Auth/AppGuide';
import Register from '../pages/Auth/Register'; //注册
import Login from '../pages/Auth/Login'; //登录
import WechatLogin from '../pages/Auth/Login/wechatLogin'; //微信登录
import SetLoginPassword from '../pages/Auth/Register/setLoginPassword'; //设置登录密码
import SetTradePassword from '../pages/CreateAccount/SetTradePassword'; //设置交易密码
import TradeRedeem from '../pages/TradeState/TradeRedeem'; //赎回
import TradeAdjust from '../pages/TradeState/TradeAdjust'; //调仓
import PrivateProduct from '../pages/Vip/PrivateProduct'; //私募公告页面
import PrivateCert from '../pages/Vip/PrivateCert'; //私募合格投资认证页面
import PrivateOrder from '../pages/Vip/PrivateOrder'; //私募预约页面
import Agreement from '../pages/Common/Agreement'; // 用户协议
import OpenPdf from '../pages/Common/OpenPdf'; // 阅读PDF
import AssetsConfigDetail from '../pages/Detail/AssetsConfigDetail'; // 资产配置详情

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                // headerShown: false,
                headerBackImage: () => {
                    return <Feather name="chevron-left" size={30} />;
                },
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: Colors.navTitleColor,
                    fontSize: 16,
                },
                headerTitleAllowFontScaling: false,
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
                // headerTransparent: true, //实现模糊玻璃效果
                // headerBackground: () => {
                //     return (
                //         <BlurView
                //             style={{
                //                 position: 'absolute',
                //                 bottom: 0,
                //                 top: 0,
                //                 width: deviceWidth,
                //                 backgroundColor: 'rgba(255,255,255,0.8)',
                //             }}
                //             blurType="light"
                //         />
                //     );
                // },
                headerStyle: {
                    backgroundColor: Colors.navBgColor,
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    elevation: 0,
                },
            }}>
            <Stack.Screen
                name="PrivateOrder"
                component={PrivateOrder}
                options={{
                    title: '预约',
                }}
            />
            <Stack.Screen
                name="PrivateProduct"
                component={PrivateProduct}
                options={{
                    title: '私募产品',
                }}
            />
            <Stack.Screen
                name="PrivateCert"
                component={PrivateCert}
                options={{
                    title: '私募合格投资者认证',
                }}
            />

            <Stack.Screen
                name="TradeAdjust"
                component={TradeAdjust}
                options={{
                    title: '调仓',
                }}
            />
            <Stack.Screen
                name="TradeRedeem"
                component={TradeRedeem}
                options={{
                    title: '赎回',
                }}
            />
            <Stack.Screen
                name="SetTradePassword"
                component={SetTradePassword}
                options={{
                    title: '基金开户',
                }}
            />

            <Stack.Screen
                name="AppGuide"
                component={AppGuide}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    title: '',
                }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: '',
                }}
            />
            <Stack.Screen
                name="WechatLogin"
                component={WechatLogin}
                options={{
                    title: '',
                }}
            />
            <Stack.Screen
                name="SetLoginPassword"
                component={SetLoginPassword}
                options={{
                    title: '',
                }}
            />
            <Stack.Screen
                name="DetailScreen"
                component={DetailScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="StickyScreen" component={StickyScreen} />
            <Stack.Screen
                name="GesturePassword"
                component={GesturePassword}
                options={({route}) => ({title: route.params?.title ? route.params?.title : route.name})}
            />
            <Stack.Screen
                name="LineChart"
                component={LineChart}
                options={{
                    ...TransitionPresets.ModalTransition,
                }}
            />
            <Stack.Screen name="Tab" component={TabScreen} />
            <Stack.Screen name="Agreement" component={Agreement} options={{title: '用户协议'}} />
            <Stack.Screen name="OpenPdf" component={OpenPdf} options={{title: ''}} />
            <Stack.Screen name="AssetsConfigDetail" component={AssetsConfigDetail} options={{title: '资产配置详情'}} />
        </Stack.Navigator>
    );
}
