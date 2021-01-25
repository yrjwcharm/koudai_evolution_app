/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-23 18:21:07
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
import CreateAccount from '../pages/CreateAccount/Account'; //基金开户
import UploadID from '../pages/CreateAccount/Account/uploadID'; //上传身份证
import BankInfo from '../pages/CreateAccount/Account/bankInfo'; //开户银行卡信息
import TradeRedeem from '../pages/Trade/TradeRedeem'; //赎回
import Camera from '../pages/CreateAccount/Account/camera'; //身份证拍照
import TradeAdjust from '../pages/Trade/TradeAdjust'; //调仓
import PrivateProduct from '../pages/PE/PrivateProduct'; //私募公告页面
import PrivateCert from '../pages/PE/PrivateCert'; //私募合格投资认证页面
import PrivateOrder from '../pages/PE/PrivateOrder'; //私募预约页面
import Agreement from '../pages/Common/Agreement'; // 用户协议
import OpenPdf from '../pages/Common/OpenPdf'; // 阅读PDF
import AssetsConfigDetail from '../pages/Detail/AssetsConfigDetail'; // 资产配置详情
import TradeFixedConfirm from '../pages/Trade/TradeFixedConfirm'; //定投确认页面
import TradeBuy from '../pages/Trade/TradeBuy'; //购买定投
import FundSafe from '../pages/Common/FundSafe'; // 资金安全
import TradeRules from '../pages/Detail/TradeRules'; // 交易须知
import CommonProblem from '../pages/Detail/CommonProblem'; // 常见问题
import RiskManagement from '../pages/Detail/RiskManagement'; // 风险控制
import TradeProcessing from '../pages/Trade/TradeProcessing'; // 交易确认页
import LargeAmount from '../pages/Trade/LargeAmount'; //大额转账
import LargeAmountIntro from '../pages/Trade/LargeAmountIntro'; //大额转账说明
import MfbIndex from '../pages/Mfb/MfbIndex'; //魔方宝详情页
import MfbIntro from '../pages/Mfb/MfbIntro'; //魔方宝说明

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator
            initialRouteName="MfbIntro"
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
                headerStyle: {
                    backgroundColor: Colors.navBgColor,
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    elevation: 0,
                },
            }}>
            <Stack.Screen name="Tab" component={TabScreen} />
            <Stack.Screen
                name="TradeBuy"
                component={TradeBuy}
                options={{
                    title: '买入',
                }}
            />
            <Stack.Screen
                name="CreateAccount"
                component={CreateAccount}
                options={{
                    title: '基金交易安全开户',
                }}
            />
            <Stack.Screen
                name="UploadID"
                component={UploadID}
                options={{
                    title: '基金交易安全开户',
                }}
            />
            <Stack.Screen
                name="BankInfo"
                component={BankInfo}
                options={{
                    title: '基金交易安全开户',
                }}
            />
            <Stack.Screen
                name="SetTradePassword"
                component={SetTradePassword}
                options={{
                    title: '基金交易安全开户',
                }}
            />
            <Stack.Screen
                name="Camera"
                component={Camera}
                options={{
                    title: '',
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
            <Stack.Screen
                name="TradeRedeem"
                component={TradeRedeem}
                options={{
                    title: '赎回',
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
            <Stack.Screen
                name="TradeFixedConfirm"
                component={TradeFixedConfirm}
                options={{
                    title: '定投计划确认',
                }}
            />
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
            <Stack.Screen name="AssetsConfigDetail" component={AssetsConfigDetail} options={{title: '资产配置详情'}} />
            <Stack.Screen name="Agreement" component={Agreement} options={{title: '用户协议'}} />
            <Stack.Screen name="OpenPdf" component={OpenPdf} options={{title: ''}} />
            <Stack.Screen name="FundSafe" component={FundSafe} options={{title: '资金安全'}} />
            <Stack.Screen name="TradeRules" component={TradeRules} options={{title: '交易须知'}} />
            <Stack.Screen name="CommonProblem" component={CommonProblem} options={{title: '常见问题'}} />
            <Stack.Screen name="RiskManagement" component={RiskManagement} options={{title: '风险控制'}} />
            <Stack.Screen name="TradeProcessing" component={TradeProcessing} options={{title: '交易确认页'}} />
            <Stack.Screen name="LargeAmount" component={LargeAmount} options={{headerShown: false}} />
            <Stack.Screen name="LargeAmountIntro" component={LargeAmountIntro} options={{title: '大额转账说明'}} />
            <Stack.Screen name="MfbIndex" component={MfbIndex} options={{headerShown: false}} />
            <Stack.Screen name="MfbIntro" component={MfbIntro} options={{title: '魔方宝说明'}} />
        </Stack.Navigator>
    );
}
