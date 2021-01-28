/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-28 14:10:01
 * @Description:路由表
 */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import TabScreen from './Tabbar';
import DetailScreen from '../pages/Portfolio/index';
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
import AssetsConfigDetail from '../pages/Portfolio/AssetsConfigDetail'; // 资产配置详情
import TradeFixedConfirm from '../pages/Trade/TradeFixedConfirm'; //定投确认页面
import TradeBuy from '../pages/Trade/TradeBuy'; //购买定投
import FundSafe from '../pages/Common/FundSafe'; // 资金安全
import TradeRules from '../pages/Portfolio/TradeRules'; // 交易须知
import CommonProblem from '../pages/Portfolio/CommonProblem'; // 常见问题
import RiskManagement from '../pages/Portfolio/RiskManagement'; // 风险控制
import TradeProcessing from '../pages/Trade/TradeProcessing'; // 交易确认页
import Question from '../pages/CustomPortfolio/question'; //问答投教
import LargeAmount from '../pages/Trade/LargeAmount'; //大额转账
import LargeAmountIntro from '../pages/Trade/LargeAmountIntro'; //大额转账说明
import MfbIndex from '../pages/Mfb/MfbIndex'; //魔方宝详情页
import MfbIntro from '../pages/Mfb/MfbIntro'; //魔方宝说明
import BankAssets from '../pages/BankPages/bankAssets'; //银行持仓页(除平安)
import BankAssetsPA from '../pages/BankPages/BankAssetsPA'; //银行持仓页(平安)

import DynamicAdjustment from '../pages/Portfolio/DynamicAdjustment'; // 动态调仓
import AssetsEnhance from '../pages/Portfolio/AssetsEnhance'; // 资产增强
import HistoryAdjust from '../pages/Portfolio/HistoryAdjust'; // 历史调仓记录
import PlanHistory from '../pages/CustomPortfolio/plannHistory'; //规划历史
import PlanResult from '../pages/CustomPortfolio/planResult'; //规划结果页
const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator
            initialRouteName="PlanResult"
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
            <Stack.Screen name="Tab" component={TabScreen} options={{headerShown: false}} />
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
            <Stack.Screen name="Question" component={Question} options={{headerShown: false}} />
            <Stack.Screen name="LargeAmount" component={LargeAmount} options={{headerShown: false}} />
            <Stack.Screen name="LargeAmountIntro" component={LargeAmountIntro} options={{title: '大额转账说明'}} />
            <Stack.Screen name="MfbIndex" component={MfbIndex} options={{headerShown: false}} />
            <Stack.Screen name="MfbIntro" component={MfbIntro} options={{title: '魔方宝说明'}} />
            <Stack.Screen name="BankAssets" component={BankAssets} options={{headerShown: false}} />
            <Stack.Screen name="BankAssetsPA" component={BankAssetsPA} options={{title: '会存A'}} />
            <Stack.Screen name="DynamicAdjustment" component={DynamicAdjustment} options={{title: '动态调仓'}} />
            <Stack.Screen name="AssetsEnhance" component={AssetsEnhance} options={{title: '资产增强'}} />
            <Stack.Screen name="HistoryAdjust" component={HistoryAdjust} options={{title: '历史调仓记录'}} />
            <Stack.Screen
                name="PlanHistory"
                component={PlanHistory}
                options={{headerShown: false, ...TransitionPresets.ModalTransition}}
            />
            <Stack.Screen
                name="PlanResult"
                component={PlanResult}
                options={{headerShown: false, ...TransitionPresets.ModalTransition}}
            />
        </Stack.Navigator>
    );
}
