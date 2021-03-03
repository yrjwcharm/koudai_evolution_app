/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-02 17:14:11
 * @Description:路由表
 */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import TabScreen from './Tabbar';
import DetailScreen from '../pages/Portfolio/index';
import IM from '../pages/IM/im';
import LineChart from '../pages/Chart/lineChart.js';
import StickyScreen from '../pages/sticky';
import {Colors} from '../common/commonStyle';
import AppGuide from '../pages/Auth/AppGuide'; //引导页
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
import TradeRules from '../pages/Trade/TradeRules'; // 交易须知
import CommonProblem from '../pages/Portfolio/CommonProblem'; // 常见问题
import RiskManagement from '../pages/Portfolio/RiskManagement'; // 风险控制
import TradeProcessing from '../pages/Trade/TradeProcessing'; // 交易确认页
import Evaluation from '../pages/Evaluation/Evaluation'; //问答投教
import LargeAmount from '../pages/Trade/LargeAmount'; //大额转账
import LargeAmountIntro from '../pages/Trade/LargeAmountIntro'; //大额转账说明
import MfbIndex from '../pages/Mfb/MfbIndex'; //魔方宝详情页
import MfbIntro from '../pages/Mfb/MfbIntro'; //魔方宝说明
import BankAssets from '../pages/BankPages/BankAssets'; //银行持仓页(除平安)
import BankAssetsPA from '../pages/BankPages/BankAssetsPA'; //银行持仓页(平安)
import ElectronicAccount from '../pages/BankPages/ElectronicAccount'; //电子账户
import DynamicAdjustment from '../pages/Portfolio/DynamicAdjustment'; // 动态调仓
import MfbIn from '../pages/Mfb/MfbIn'; //魔方宝充值
import MfbOut from '../pages/Mfb/MfbOut'; //魔方宝提现
import DetailAccount from '../pages/Portfolio/Detail/DetailAccount'; //短期账户详情页
import DetailFixed from '../pages/Portfolio/Detail/DetailFixed'; //低估值详情页
import DetailEducation from '../pages/Portfolio/Detail/DetailEducation'; //子女教育详情页
import DetailRetiredPlan from '../pages/Portfolio/Detail/DetailRetiredPlan'; //养老计划详情页
import AssetsEnhance from '../pages/Portfolio/AssetsEnhance'; // 资产增强
import HistoryAdjust from '../pages/Portfolio/HistoryAdjust'; // 历史调仓记录
import EvaluationHistory from '../pages/Evaluation/EvaluationHistory'; //规划历史
import EvaluationResult from '../pages/Evaluation/EvaluationResult'; //规划结果页
import TotalIncomeDetail from '../pages/Assets/TotalIncomeDetail'; // 总收益明细
import HoldingFund from '../pages/Assets/HoldingFund'; // 持有基金
import HistoryHoldFunds from '../pages/Assets/HistoryHoldFunds'; // 历史持有基金
import FundSearching from '../pages/Assets/FundSearching'; // 基金查询
import BankRedeem from '../pages/BankPages/BankRedeem'; //银行赎回
import BankBuy from '../pages/BankPages/BankBuy'; //银行购买
import SetTarget from '../pages/FixedPortfolio/SetTarget'; //低估值设置目标
import TradeRecord from '../pages/Trade/TradeRecord'; //交易记录
import FundDetail from '../pages/Portfolio/FundDetail'; // 基金详情
import HistoryNav from '../pages/Portfolio/HistoryNav'; // 历史净值
import FindDetail from '../pages/Find/findDetail'; //发现详情页
import TradeRecordDetail from '../pages/Trade/TradeRecordDetail'; //交易记录详情
import FundRanking from '../pages/Portfolio/FundRanking'; // 基金排名
import FundTradeTime from '../pages/Portfolio/FundTradeTime'; // 交易时间说明
import FundScale from '../pages/Portfolio/FundScale'; // 基金规模
import FundManager from '../pages/Portfolio/FundManager'; // 基金经理
import FundCompany from '../pages/Portfolio/FundCompany'; // 基金公司
import CompanyFunds from '../pages/Portfolio/CompanyFunds'; // 旗下基金
import FundAnnouncement from '../pages/Portfolio/FundAnnouncement'; // 基金公告
import PlanDetail from '../pages/FixedPortfolio/PlanDetail'; //计划详情
import FixedPlan from '../pages/FixedPortfolio/FixedPlan'; //定投计划
import PortfolioAssets from '../pages/Assets/PortfolioAssets'; //持仓页
import FixedUpdate from '../pages/FixedPortfolio/FixedUpdate'; //定投修改
import RemindMessage from '../pages/Message/RemindMessage'; //消息提醒
import TradeNotice from '../pages/Message/TradeNotice'; //交易通知
import ActivityNotice from '../pages/Message/ActivityNotice'; //活动通知
import AdjustInformation from '../pages/Assets/AdjustInformation'; // 调仓信息
import Settings from '../pages/Assets/Settings'; // 个人设置
import Profile from '../pages/Assets/Profile'; // 个人资料
import ComplaintsAdvices from '../pages/Assets/ComplaintsAdvices'; // 投诉建议
import MessageBoard from '../pages/MofangIndex/MessageBoard'; //用户留言详情
import PrivateRedeem from '../pages/PE/PrivateRedeem'; // 私募赎回
import PrivateApply from '../pages/PE/PrivateApply'; //私募申请
import DetailMaHongMan from '../pages/Portfolio/Detail/DetailMaHongMan'; //马红漫详情页
import StrategyMaHongMan from '../pages/Portfolio/StrategyMaHongMan'; //马红漫策略页
import PrivateAssets from '../pages/PE/PrivateAssets'; //私募持仓
import ContactUs from '../pages/Assets/ContactUs'; // 联系我们
import PasswordManagement from '../pages/Assets/PasswordManagement'; // 密码管理
import ResetLoginPwd from '../pages/Assets/ResetLoginPwd'; // 重设登录密码
import TradePwdManagement from '../pages/Assets/TradePwdManagement'; // 交易密码管理
import ModifyTradePwd from '../pages/Assets/ModifyTradePwd'; // 修改交易密码
import ForgotTradePwd from '../pages/Assets/ForgotTradePwd'; // 找回交易密码
import BankCardList from '../pages/Assets/BankCardList'; // 银行卡管理
import BankCard from '../pages/Assets/BankCard'; // 银行卡
import ModifyPhoneNum from '../pages/Assets/ModifyPhoneNum'; // 修改预留手机号
import ExperienceGoldDetail from '../pages/ExperienceGold/Detail'; // 体验金详情
import MemberCenter from '../pages/Assets/MemberCenter'; // 会员中心
import MemberSystem from '../pages/Assets/MemberSystem'; // 魔方会员体系
import MemberService from '../pages/Assets/MemberService'; // 会员专属服务
import GetRationalValue from '../pages/Assets/GetRationalValue'; // 信任值获取方法
import {px} from '../utils/appUtil';
import BankList from '../pages/BankPages/BankList'; //银行列表
import ExperienceGoldResult from '../pages/ExperienceGold/Result'; //体验金结果页
import ExperienceGoldTrade from '../pages/ExperienceGold/Trade'; //体验金购买
import AssetNav from '../pages/PE/AssetNav'; //私募净值
import ProductIntro from '../pages/Portfolio/Detail/ProductIntro'; //产品说明页
import BankWithdraw from '../pages/BankPages/BankWithdraw'; //银行提现
import TransferAccount from '../pages/Trade/TransferAccount'; //一键转投智能组合
const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator
            initialRouteName="Tab"
            screenOptions={{
                // headerShown: false,

                headerBackImage: () => {
                    return <Feather name="chevron-left" size={30} />;
                },
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: Colors.navTitleColor,
                    fontSize: px(18),
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
            <Stack.Screen name="IM" component={IM} options={{title: '在线客服'}} />
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
                    headerShown: false,
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
            <Stack.Screen name="Evaluation" component={Evaluation} options={{headerShown: false}} />
            <Stack.Screen name="LargeAmount" component={LargeAmount} options={{headerShown: false}} />
            <Stack.Screen name="LargeAmountIntro" component={LargeAmountIntro} options={{title: '大额转账说明'}} />
            <Stack.Screen name="MfbIndex" component={MfbIndex} options={{headerShown: false}} />
            <Stack.Screen name="MfbIntro" component={MfbIntro} options={{title: '魔方宝说明'}} />
            <Stack.Screen name="BankAssets" component={BankAssets} options={{headerShown: false}} />
            <Stack.Screen name="BankAssetsPA" component={BankAssetsPA} options={{headerShown: false}} />
            <Stack.Screen name="DynamicAdjustment" component={DynamicAdjustment} options={{title: '动态调仓'}} />
            <Stack.Screen name="ElectronicAccount" component={ElectronicAccount} options={{title: '电子账户'}} />
            <Stack.Screen name="MfbIn" component={MfbIn} options={{title: '充值魔方宝'}} />
            <Stack.Screen name="MfbOut" component={MfbOut} options={{title: '提现魔方宝'}} />
            <Stack.Screen name="DetailAccount" component={DetailAccount} options={{headerShown: false}} />
            <Stack.Screen name="DetailFixed" component={DetailFixed} options={{headerShown: false}} />
            <Stack.Screen name="DetailEducation" component={DetailEducation} options={{headerShown: false}} />
            <Stack.Screen name="DetailRetiredPlan" component={DetailRetiredPlan} options={{headerShown: false}} />
            <Stack.Screen name="AssetsEnhance" component={AssetsEnhance} options={{title: '资产增强'}} />
            <Stack.Screen name="HistoryAdjust" component={HistoryAdjust} options={{title: '历史调仓记录'}} />
            <Stack.Screen name="TotalIncomeDetail" component={TotalIncomeDetail} options={{title: '收益明细'}} />
            <Stack.Screen name="HoldingFund" component={HoldingFund} options={{title: '持有基金'}} />
            <Stack.Screen name="HistoryHoldFunds" component={HistoryHoldFunds} options={{title: '历史持有基金'}} />
            <Stack.Screen name="BankRedeem" component={BankRedeem} options={{title: '赎回银行产品'}} />
            <Stack.Screen name="BankBuy" component={BankBuy} options={{title: '购买银行产品'}} />
            <Stack.Screen name="SetTarget" component={SetTarget} options={{title: '开启我的计划'}} />
            <Stack.Screen
                name="EvaluationHistory"
                component={EvaluationHistory}
                options={{headerShown: false, ...TransitionPresets.ModalTransition}}
            />
            <Stack.Screen
                name="EvaluationResult"
                component={EvaluationResult}
                options={{headerShown: false, ...TransitionPresets.ModalTransition}}
            />
            <Stack.Screen name="FundSearching" component={FundSearching} options={{title: '基金查询方式'}} />
            <Stack.Screen name="TradeRecord" component={TradeRecord} options={{title: '交易记录'}} />
            <Stack.Screen name="FundDetail" component={FundDetail} options={{title: '基金详情'}} />
            <Stack.Screen name="HistoryNav" component={HistoryNav} options={{title: '历史净值'}} />
            <Stack.Screen
                name="FindDetail"
                component={FindDetail}
                options={{
                    headerShown: false,
                    cardStyle: {backgroundColor: 'transparent'},
                    ...TransitionPresets.ModalTransition,
                    // cardOverlayEnabled: true,
                    // cardStyleInterpolator: ({current: {progress}}) => ({
                    //     cardStyle: {
                    //         opacity: progress.interpolate({
                    //             inputRange: [0, 0.5, 0.9, 1],
                    //             outputRange: [0, 0.25, 0.7, 1],
                    //         }),
                    //     },
                    // }),
                }}
            />
            <Stack.Screen name="TradeRecordDetail" component={TradeRecordDetail} options={{title: '交易订单详情'}} />
            <Stack.Screen name="FundRanking" component={FundRanking} options={{title: '基金排名'}} />
            <Stack.Screen name="FundTradeTime" component={FundTradeTime} options={{title: '交易时间说明'}} />
            <Stack.Screen name="FundScale" component={FundScale} options={{title: '基金规模'}} />
            <Stack.Screen name="FundManager" component={FundManager} options={{title: '基金经理'}} />
            <Stack.Screen name="FundCompany" component={FundCompany} options={{title: '基金公司'}} />
            <Stack.Screen name="CompanyFunds" component={CompanyFunds} options={{title: '旗下基金'}} />
            <Stack.Screen name="FundAnnouncement" component={FundAnnouncement} options={{title: '基金公告'}} />
            <Stack.Screen name="PlanDetail" component={PlanDetail} options={{title: '计划详情'}} />
            <Stack.Screen name="FixedPlan" component={FixedPlan} options={{headerShown: false}} />
            <Stack.Screen name="PortfolioAssets" component={PortfolioAssets} options={{headerShown: false}} />
            <Stack.Screen name="FixedUpdate" component={FixedUpdate} options={{title: '修改计划'}} />
            <Stack.Screen name="RemindMessage" component={RemindMessage} options={{title: '消息提醒'}} />
            <Stack.Screen name="AdjustInformation" component={AdjustInformation} options={{title: '调仓信息'}} />
            <Stack.Screen name="Settings" component={Settings} options={{title: '个人设置'}} />
            <Stack.Screen name="Profile" component={Profile} options={{title: '个人资料'}} />
            <Stack.Screen name="ComplaintsAdvices" component={ComplaintsAdvices} options={{title: '投诉建议'}} />
            <Stack.Screen name="MessageBoard" component={MessageBoard} options={{title: '用户留言详情'}} />
            <Stack.Screen name="TradeNotice" component={TradeNotice} options={{headerShown: false}} />
            <Stack.Screen name="ActivityNotice" component={ActivityNotice} options={{headerShown: false}} />
            <Stack.Screen name="PrivateRedeem" component={PrivateRedeem} options={{title: '赎回流程'}} />
            <Stack.Screen name="PrivateApply" component={PrivateApply} options={{title: '赎回流程'}} />
            <Stack.Screen name="DetailMaHongMan" component={DetailMaHongMan} options={{headerShown: false}} />
            <Stack.Screen name="StrategyMaHongMan" component={StrategyMaHongMan} options={{title: '马红漫投资策略'}} />
            <Stack.Screen name="PrivateAssets" component={PrivateAssets} options={{headerShown: false}} />
            <Stack.Screen name="BankList" component={BankList} options={{title: '银行产品'}} />
            <Stack.Screen name="ContactUs" component={ContactUs} options={{title: '联系我们'}} />
            <Stack.Screen name="PasswordManagement" component={PasswordManagement} options={{title: '密码管理'}} />
            <Stack.Screen name="ResetLoginPwd" component={ResetLoginPwd} options={{title: '重设登录密码'}} />
            <Stack.Screen name="TradePwdManagement" component={TradePwdManagement} options={{title: '交易密码管理'}} />
            <Stack.Screen name="ModifyTradePwd" component={ModifyTradePwd} options={{title: '修改交易密码'}} />
            <Stack.Screen name="ForgotTradePwd" component={ForgotTradePwd} options={{title: '找回交易密码'}} />
            <Stack.Screen name="BankCardList" component={BankCardList} options={{title: '银行卡管理'}} />
            <Stack.Screen name="BankCard" component={BankCard} options={{title: '银行卡'}} />
            <Stack.Screen name="ModifyPhoneNum" component={ModifyPhoneNum} options={{title: '修改预留手机号'}} />
            <Stack.Screen
                name="ExperienceGoldDetail"
                component={ExperienceGoldDetail}
                options={{
                    headerBackImage: () => {
                        return <Feather name="chevron-left" size={30} color={'#fff'} />;
                    },
                    headerStyle: {
                        backgroundColor: '#D4AC6F',
                        shadowOffset: {
                            height: 0,
                        },
                        elevation: 0,
                    },
                    headerTitleStyle: {
                        fontSize: px(18),
                        lineHeight: px(25),
                        color: '#fff',
                    },
                    title: '理财魔方体验金',
                }}
            />
            <Stack.Screen
                name="ExperienceGoldResult"
                component={ExperienceGoldResult}
                options={{title: '体验金提现'}}
            />
            <Stack.Screen name="ExperienceGoldTrade" component={ExperienceGoldTrade} options={{headerShown: ''}} />
            <Stack.Screen name="AssetNav" component={AssetNav} options={{title: '净值'}} />
            <Stack.Screen name="ProductIntro" component={ProductIntro} options={{title: '产品说明书'}} />
            <Stack.Screen name="BankWithdraw" component={BankWithdraw} options={{title: '提现'}} />
            <Stack.Screen name="TransferAccount" component={TransferAccount} options={{title: '一键转投智能组合'}} />
            <Stack.Screen name="MemberCenter" component={MemberCenter} options={{title: '会员中心'}} />
            <Stack.Screen name="MemberSystem" component={MemberSystem} options={{title: '魔方会员体系'}} />
            <Stack.Screen name="MemberService" component={MemberService} options={{title: '会员专属服务'}} />
            <Stack.Screen name="GetRationalValue" component={GetRationalValue} options={{title: '信任值获取方法'}} />
        </Stack.Navigator>
    );
}
