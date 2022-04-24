/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-24 18:09:06
 * @Description:路由表
 */
import React from 'react';
import {Platform, Keyboard} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import TabScreen from './Tabbar';
import LineChart from '../pages/Chart/lineChart.js';
import StickyScreen from '../pages/sticky';
import {Colors} from '../common/commonStyle';
import IM from '../pages/IM/im'; //IM
import AppGuide from '../pages/Auth/AppGuide'; //引导页
import Register from '../pages/Auth/Register'; //注册
import Login from '../pages/Auth/Login'; //登录
import WechatLogin from '../pages/Auth/Login/wechatLogin'; //微信登录
import SetLoginPassword from '../pages/Auth/Register/setLoginPassword'; //设置登录密码
import VerifyCodeQA from '../pages/Auth/VerifyCodeQA'; // 收不到短信验证码
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
import TradeAgreements from '../pages/Common/TradeAgreements'; // 基金组合协议
import OpenPdf from '../pages/Common/OpenPdf'; // 阅读PDF
import AssetsConfigDetail from '../pages/Portfolio/AssetsConfigDetail'; // 资产配置详情
import TradeFixedConfirm from '../pages/FixedPortfolio/TradeFixedConfirm'; //定投确认页面
import TradeBuy from '../pages/Trade/TradeBuy'; //购买定投  此名称在WalletAutoRechargeDetail有判断
import TradeRules from '../pages/Trade/TradeRules'; // 交易须知
import WalletAutoRechargeDetail from '../pages/Trade/WalletAutoRechargeDetail'; // 魔方宝自动充值详情
import CommonProblem from '../pages/Portfolio/CommonProblem'; // 常见问题
import RiskManagement from '../pages/Portfolio/RiskManagement'; // 风险控制
import TradeProcessing from '../pages/Trade/TradeProcessing'; // 交易确认页
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
import Evaluation from '../pages/Evaluation/Evaluation'; //定制
import EvaluationHistory from '../pages/Evaluation/EvaluationHistory'; //定制历史
import EvaluationResult from '../pages/Evaluation/EvaluationResult'; //定制结果页
import TotalIncomeDetail from '../pages/Assets/TotalIncomeDetail'; // 总收益明细
import IncomeDetail from '../pages/Assets/IncomeDetail'; // 组合收益明细
import HistoryInvestPlan from '../pages/Assets/HistoryInvestPlan'; // 历史投资计划
import InvestAnalysis from '../pages/Assets/InvestAnalysis'; // 投资分析
import HoldingFund from '../pages/Assets/HoldingFund'; // 持有基金
import HistoryHoldFunds from '../pages/Assets/HistoryHoldFunds'; // 历史持有基金
import FundSearching from '../pages/Assets/FundSearching'; // 基金查询
import AssetHealthScore from '../pages/Assets/AssetHealthScore'; // 资产健康分
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
import FixedPlanList from '../pages/FixedPortfolio/FixedPlanList'; //定投计划列表
import FixedPlanDetail from '../pages/FixedPortfolio/FixedPlanDetail'; //定投计划详情
import PortfolioAssets from '../pages/Assets/PortfolioAssets'; //持仓页 此名称在WalletAutoRechargeDetail有判断
import LowBuySignal from '../pages/Assets/LowBuySignal'; //低位买入信号
import FixedUpdate from '../pages/FixedPortfolio/FixedUpdate'; //定投修改
import AddedBuy from '../pages/Portfolio/AddedBuy'; // 追加购买
import RemindMessage from '../pages/Message/RemindMessage'; //消息提醒
import MessageNotice from '../pages/Message/MessageNotice'; //消息列表
import AdjustInformation from '../pages/Assets/AdjustInformation'; // 调仓信息
import Settings from '../pages/Settings/Settings'; // 个人设置
import Profile from '../pages/Settings/Profile'; // 个人资料
import ComplaintsAdvices from '../pages/Assets/ComplaintsAdvices'; // 投诉建议
import MessageBoard from '../pages/MofangIndex/MessageBoard'; //用户留言详情
import PrivateRedeem from '../pages/PE/PrivateRedeem'; // 私募赎回
import PrivateApply from '../pages/PE/PrivateApply'; //私募申请
import DetailPolaris from '../pages/Portfolio/Detail/DetailPolaris'; //马红漫详情页
import StrategyPolaris from '../pages/Portfolio/StrategyPolaris'; //马红漫策略页
import PrivateAssets from '../pages/PE/PrivateAssets'; //私募持仓
import ContactUs from '../pages/Settings/ContactUs'; // 联系我们
import PasswordManagement from '../pages/Settings/PasswordManagement'; // 密码管理
import ResetLoginPwd from '../pages/Settings/ResetLoginPwd'; // 重设登录密码
import TradePwdManagement from '../pages/Settings/TradePwdManagement'; // 交易密码管理
import ModifyTradePwd from '../pages/Assets/ModifyTradePwd'; // 修改交易密码
import ForgotTradePwd from '../pages/Settings/ForgotTradePwd'; // 找回交易密码
import ForgotTradePwdNext from '../pages/Settings/ForgotTradePwdNext'; // 找回交易密码下一步
import AccountRemove from '../pages/Settings/AccountRemove'; // 账号注销
import BankCardList from '../pages/Settings/BankCardList'; // 银行卡管理
import BankCard from '../pages/Assets/BankCard'; // 银行卡
import AddBankCard from '../pages/Assets/AddBankCard'; // 添加新银行卡/更换绑定银行卡
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
import ExperienceGoldRule from '../pages/ExperienceGold/Rule'; //体验金规则
import InviteFriends from '../pages/Assets/InviteFriends'; // 邀请好友注册
import InviteRecord from '../pages/Assets/InviteRecord'; // 邀请好友记录
import GesturePassword from '../pages/Settings/GesturePassword'; //手势密码
import InviteExperienceGold from '../pages/ExperienceGold/InviteExperienceGold'; // 邀请好友得体验金
import ForgetLoginPwd from '../pages/Auth/Login/forgetLoginPwd'; //找回登录密码
import MemberRule from '../pages/Assets/MemberRule'; //会员中心生日劵规则
import QuestionWithdraw from '../pages/ExperienceGold/QuestionWithdraw'; //体验金答题页
import ArticleDetail from '../pages/Vision/ArticleDetail'; // 文章详情
import AdjustRecord from '../pages/Portfolio/AdjustRecord'; // 调仓记录
import MyScore from '../pages/Assets/MyScore'; // 我的魔分
import ScoreDetail from '../pages/Assets/ScoreDetail'; // 魔分明细
import LCMF from '../pages/Common/LCMF'; // 关于理财魔方
import WebView from '../pages/Common/WebView'; //webview
import DetailInsurance from '../pages/Portfolio/Detail/DetailInsurance'; //保险落地页
import PerformanceAnalysis from '../pages/Portfolio/PerformanceAnalysis'; //业绩基准
import VisionCollect from '../pages/Vision/VisionCollect'; //文章收藏
import AlbumList from '../pages/Vision/AlbumList'; //音频专辑列表
import Launch from '../pages/Auth/Launch'; //广告
import Questionnaire from '../pages/Evaluation/Questionnaire'; // 传统风险测评
import PortfolioMask from '../pages/Portfolio/PortfolioMask'; //详情页蒙层
import QuestionnaireResult from '../pages/Evaluation/QuestionnaireResult'; // 传统风险评测结果页
import TopInvestors from '../pages/Assets/TopInvestors'; //牛人信号
import IntelligentIncomeDetail from '../pages/Assets/IntelligentIncomeDetail'; // 收益明细
import IntelligentInvestAnalysis from '../pages/Assets/IntelligentInvestAnalysis'; // 智能组合投资分析
import InsuranceList from '../pages/Find/InsuranceList'; //保险产品列表
import PrivacySetting from '../pages/Settings/PrivacySetting'; //隐私设置
import AuthorityManage from '../pages/Settings/AuthorityManage'; //权限管理
import PersonalizedRecommend from '../pages/Settings/PersonalizedRecommend'; //个性化推荐
import AboutApp from '../pages/Settings/AboutApp'; //关于APP
import WeChatNotice from '../pages/Assets/WeChatNotice'; // 开启微信通知
import IdAuth from '../pages/CreateAccount/Account/idAuth'; //开户身份证认证
import VerifyLogin from '../pages/Auth/Login/verifyLogin'; //验证码登陆
import AdvisorPortfolio from '../pages/Portfolio/AdvisorPortfolio'; // 投顾组合超市
import InvestStrategy from '../pages/Portfolio/InvestStrategy'; // 投资策略
import FundAlternative from '../pages/Portfolio/FundAlternative'; // 基金备选库
import AdvisorAssets from '../pages/Assets/AdvisorAssets'; // 投顾组合总资产页
import PortfolioPlan from '../pages/Evaluation/PortfolioPlan'; // 定制理财计划
import GlobalConfig from '../pages/Portfolio/GlobalConfig'; // 全球配置
import FundAdjust from '../pages/Portfolio/FundAdjust'; // 基金调整
import OptimizePlan from '../pages/Assets/OptimizePlan'; // 优化计划
import FollowInvestSetting from '../pages/Assets/FollowInvestSetting'; // 跟投设置
import AdviserFee from '../pages/Trade/AdviserFee'; // 投顾服务费
import WealthTools from '../pages/Assets/WealthTools'; // 财富工具
import ReportWebView from '../pages/Activity/ReportWebView'; //年报webview
import LiveList from '../pages/Vision/LiveList'; //直播列表
import Live from '../pages/Vision/Live'; //直播详情页
import ArticleList from '../pages/Vision/ArticleList'; //更多文章列表
import SelectIdentity from '../pages/Vision/SelectIdentity'; // 选择视野中的身份
import ProductCover from '../pages/Portfolio/ProductCover'; //组合宣传封面
import RiskAdjustTool from '../pages/Assets/RiskAdjustTool'; //风险等级调整工具
import LiveLand from '../pages/Vision/LiveLand'; // 直播落地页
import RationalLevel from '../pages/Vision/RationalLevel'; // 理性等级
import RationalRecord from '../pages/Vision/RationalRecord'; // 理性值记录
import RationalUpgrade from '../pages/Vision/RationalUpgrade'; // 理性等级升级
import CommentList from '../pages/Portfolio/CommentList'; // 产品评论列表
import PublishComment from '../pages/Portfolio/PublishComment'; // 发布评论
import ArticleCommentList from '../pages/Vision/ArticleCommentList'; //文章评论列表
const Stack = createStackNavigator();

export default function AppStack() {
    const [gestureEnabled, setGestureEnabled] = React.useState(true);

    const keyboardDidShow = React.useCallback(() => {
        setGestureEnabled(false);
    }, []);
    const keyboardDidHide = React.useCallback(() => {
        setGestureEnabled(true);
    }, []);

    React.useEffect(() => {
        if (Platform.OS === 'android') {
            Keyboard.addListener('keyboardDidShow', keyboardDidShow);
            Keyboard.addListener('keyboardDidHide', keyboardDidHide);
        }
        return () => {
            if (Platform.OS === 'android') {
                Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
                Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
            }
        };
    }, [keyboardDidShow, keyboardDidHide]);
    return (
        <Stack.Navigator
            initialRouteName="Launch"
            headerMode="screen"
            screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
                headerBackImage: () => {
                    return (
                        <Feather
                            name="chevron-left"
                            size={px(26)}
                            style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                        />
                    );
                },

                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: Colors.navTitleColor,
                    fontSize: px(18),
                    maxWidth: px(280),
                },
                headerTitleAllowFontScaling: false,
                gestureEnabled: gestureEnabled,
                // cardOverlayEnabled: true,
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
            <Stack.Screen
                name="Tab"
                component={TabScreen}
                options={{
                    cardStyleInterpolator: ({current: {progress}}) => ({
                        cardStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 0.5, 0.9, 1],
                                outputRange: [0, 0.25, 0.7, 1],
                            }),
                        },
                    }),
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="TradeBuy"
                component={TradeBuy}
                options={{
                    title: '',
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
                    title: '证件照片',
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
                    gestureEnabled: false,
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
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
            <Stack.Screen
                name="TradeFixedConfirm"
                component={TradeFixedConfirm}
                options={{
                    title: '',
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
            <Stack.Screen name="AssetsConfigDetail" component={AssetsConfigDetail} options={{title: ''}} />
            <Stack.Screen name="Agreement" component={Agreement} options={{title: ''}} />
            <Stack.Screen name="TradeAgreements" component={TradeAgreements} options={{title: ''}} />
            <Stack.Screen name="OpenPdf" component={OpenPdf} options={{title: ''}} />
            <Stack.Screen name="TradeRules" component={TradeRules} options={{title: '交易须知'}} />
            <Stack.Screen name="CommonProblem" component={CommonProblem} options={{title: '常见问题'}} />
            <Stack.Screen name="RiskManagement" component={RiskManagement} options={{title: '风险控制'}} />
            <Stack.Screen name="TradeProcessing" component={TradeProcessing} options={{headerShown: false}} />
            <Stack.Screen name="LargeAmount" component={LargeAmount} options={{title: '大额极速购'}} />
            <Stack.Screen name="LargeAmountIntro" component={LargeAmountIntro} options={{title: '大额极速购说明'}} />
            <Stack.Screen name="MfbIndex" component={MfbIndex} options={{headerShown: false}} />
            <Stack.Screen name="MfbIntro" component={MfbIntro} options={{title: '魔方宝说明'}} />
            <Stack.Screen name="BankAssets" component={BankAssets} options={{headerShown: false}} />
            <Stack.Screen name="BankAssetsPA" component={BankAssetsPA} options={{headerShown: false}} />
            <Stack.Screen name="DynamicAdjustment" component={DynamicAdjustment} options={{title: '动态调仓'}} />
            <Stack.Screen name="ElectronicAccount" component={ElectronicAccount} options={{title: '电子账户'}} />
            <Stack.Screen name="MfbIn" component={MfbIn} options={{title: '充值魔方宝', gestureEnabled: false}} />
            <Stack.Screen name="MfbOut" component={MfbOut} options={{title: '提现魔方宝'}} />
            <Stack.Screen name="DetailAccount" component={DetailAccount} options={{title: ''}} />
            <Stack.Screen name="DetailFixed" component={DetailFixed} options={{title: ''}} />
            <Stack.Screen name="DetailEducation" component={DetailEducation} options={{title: ''}} />
            <Stack.Screen name="DetailRetiredPlan" component={DetailRetiredPlan} options={{title: ''}} />
            <Stack.Screen name="AssetsEnhance" component={AssetsEnhance} options={{title: '资产增强'}} />
            <Stack.Screen name="HistoryAdjust" component={HistoryAdjust} options={{title: '历史调仓记录'}} />
            <Stack.Screen name="TotalIncomeDetail" component={TotalIncomeDetail} options={{title: '收益明细'}} />
            <Stack.Screen name="IncomeDetail" component={IncomeDetail} options={{title: '组合收益明细'}} />
            <Stack.Screen name="HistoryInvestPlan" component={HistoryInvestPlan} options={{title: '历史投资计划'}} />
            <Stack.Screen name="InvestAnalysis" component={InvestAnalysis} options={{title: '投资分析'}} />
            <Stack.Screen name="HoldingFund" component={HoldingFund} options={{title: '持有基金'}} />
            <Stack.Screen name="HistoryHoldFunds" component={HistoryHoldFunds} options={{title: '历史持有基金'}} />
            <Stack.Screen name="BankRedeem" component={BankRedeem} options={{title: ''}} />
            <Stack.Screen name="BankBuy" component={BankBuy} options={{title: '购买银行产品'}} />
            <Stack.Screen name="SetTarget" component={SetTarget} options={{title: '开启我的计划'}} />
            <Stack.Screen
                name="Evaluation"
                component={Evaluation}
                options={{
                    headerShown: false,
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
            <Stack.Screen
                name="EvaluationHistory"
                component={EvaluationHistory}
                options={{
                    headerShown: false,
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                }}
            />
            <Stack.Screen
                name="EvaluationResult"
                component={EvaluationResult}
                options={{...TransitionPresets.ModalSlideFromBottomIOS, headerShown: false}}
            />
            <Stack.Screen name="FundSearching" component={FundSearching} options={{title: '基金查询方式'}} />
            <Stack.Screen
                name="AssetHealthScore"
                component={AssetHealthScore}
                options={{
                    title: '',
                    headerTransparent: true,
                    headerTitleStyle: {color: '#fff'},
                    headerBackImage: () => {
                        return (
                            <Feather
                                name="chevron-left"
                                color="#fff"
                                size={px(26)}
                                style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                            />
                        );
                    },
                }}
            />
            <Stack.Screen name="TradeRecord" component={TradeRecord} options={{title: '交易记录'}} />
            <Stack.Screen name="FundDetail" component={FundDetail} options={{title: '基金详情'}} />
            <Stack.Screen name="HistoryNav" component={HistoryNav} options={{title: '历史净值'}} />
            <Stack.Screen
                name="FindDetail"
                component={FindDetail}
                options={{
                    headerShown: false,
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
            <Stack.Screen name="FixedPlanDetail" component={FixedPlanDetail} options={{title: ''}} />
            <Stack.Screen name="FixedPlanList" component={FixedPlanList} options={{title: '计划详情'}} />
            <Stack.Screen
                name="PortfolioAssets"
                component={PortfolioAssets}
                options={{
                    title: '',
                    headerStyle: {
                        backgroundColor: '#0052CD',
                        shadowOpacity: 0,
                        shadowOffset: {
                            height: 0,
                        },
                        elevation: 0,
                    },
                    headerTitleStyle: {
                        color: '#fff',
                        fontSize: px(18),
                    },
                    headerBackImage: () => {
                        return (
                            <Feather
                                name="chevron-left"
                                color="#fff"
                                size={px(26)}
                                style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                            />
                        );
                    },
                }}
            />
            <Stack.Screen name="FixedUpdate" component={FixedUpdate} options={{title: '修改计划'}} />
            <Stack.Screen name="AddedBuy" component={AddedBuy} options={{title: ''}} />
            <Stack.Screen
                name="RemindMessage"
                component={RemindMessage}
                options={{
                    title: '消息提醒',
                }}
            />
            <Stack.Screen name="AdjustInformation" component={AdjustInformation} options={{title: ''}} />
            <Stack.Screen name="Settings" component={Settings} options={{title: '个人设置'}} />
            <Stack.Screen name="Profile" component={Profile} options={{title: '个人资料'}} />
            <Stack.Screen name="ComplaintsAdvices" component={ComplaintsAdvices} options={{title: '投诉建议'}} />
            <Stack.Screen name="MessageBoard" component={MessageBoard} options={{title: '用户留言详情'}} />
            <Stack.Screen name="MessageNotice" component={MessageNotice} options={{title: ''}} />
            <Stack.Screen name="PrivateRedeem" component={PrivateRedeem} options={{title: '赎回流程'}} />
            <Stack.Screen name="PrivateApply" component={PrivateApply} options={{title: '赎回流程'}} />
            <Stack.Screen name="DetailPolaris" component={DetailPolaris} options={{title: ''}} />
            <Stack.Screen name="StrategyPolaris" component={StrategyPolaris} options={{title: ''}} />
            <Stack.Screen name="PrivateAssets" component={PrivateAssets} options={{headerShown: false}} />
            <Stack.Screen name="BankList" component={BankList} options={{title: '银行产品'}} />
            <Stack.Screen name="ContactUs" component={ContactUs} options={{title: '联系我们'}} />
            <Stack.Screen name="PasswordManagement" component={PasswordManagement} options={{title: '密码管理'}} />
            <Stack.Screen name="ResetLoginPwd" component={ResetLoginPwd} options={{title: '重设登录密码'}} />
            <Stack.Screen name="TradePwdManagement" component={TradePwdManagement} options={{title: '交易密码管理'}} />
            <Stack.Screen name="ModifyTradePwd" component={ModifyTradePwd} options={{title: '修改交易密码'}} />
            <Stack.Screen name="ForgotTradePwd" component={ForgotTradePwd} options={{title: '找回交易密码'}} />
            <Stack.Screen name="ForgotTradePwdNext" component={ForgotTradePwdNext} options={{title: '找回交易密码'}} />
            <Stack.Screen name="AccountRemove" component={AccountRemove} options={{title: '账号注销'}} />
            <Stack.Screen name="BankCardList" component={BankCardList} options={{title: '银行卡管理'}} />
            <Stack.Screen name="BankCard" component={BankCard} options={{title: '银行卡'}} />
            <Stack.Screen name="AddBankCard" component={AddBankCard} options={{title: '添加新银行卡'}} />
            <Stack.Screen name="ModifyPhoneNum" component={ModifyPhoneNum} options={{title: '修改预留手机号'}} />
            <Stack.Screen
                name="ExperienceGoldDetail"
                component={ExperienceGoldDetail}
                options={{
                    headerBackImage: () => {
                        return (
                            <Feather
                                name="chevron-left"
                                size={px(26)}
                                color="#fff"
                                style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                            />
                        );
                    },
                    headerStyle: {
                        backgroundColor: '#D4AC6F',
                        shadowOpacity: 0,
                        shadowOffset: {
                            height: 0,
                        },
                        elevation: 0,
                    },
                    headerTitleStyle: {
                        color: '#fff',
                        fontSize: px(18),
                    },
                    title: '',
                }}
            />
            <Stack.Screen
                name="ExperienceGoldResult"
                component={ExperienceGoldResult}
                options={{title: '体验金提现'}}
            />
            <Stack.Screen name="LowBuySignal" component={LowBuySignal} options={{headerShown: false}} />
            <Stack.Screen name="ExperienceGoldTrade" component={ExperienceGoldTrade} options={{title: ''}} />
            <Stack.Screen name="AssetNav" component={AssetNav} options={{title: '净值'}} />
            <Stack.Screen name="ProductIntro" component={ProductIntro} options={{title: '产品说明书'}} />
            <Stack.Screen name="BankWithdraw" component={BankWithdraw} options={{title: '提现'}} />
            <Stack.Screen name="TransferAccount" component={TransferAccount} options={{title: '一键转投全天候组合'}} />
            <Stack.Screen name="MemberCenter" component={MemberCenter} options={{title: '会员中心'}} />
            <Stack.Screen name="MemberSystem" component={MemberSystem} options={{title: '魔方会员体系'}} />
            <Stack.Screen name="MemberService" component={MemberService} options={{title: '会员专属服务'}} />
            <Stack.Screen name="GetRationalValue" component={GetRationalValue} options={{title: '信任值获取方法'}} />
            <Stack.Screen name="ExperienceGoldRule" component={ExperienceGoldRule} options={{headerShown: false}} />
            <Stack.Screen name="GesturePassword" component={GesturePassword} options={{title: '手势密码'}} />
            <Stack.Screen name="InviteFriends" component={InviteFriends} options={{title: ''}} />
            <Stack.Screen name="InviteRecord" component={InviteRecord} options={{title: ''}} />
            <Stack.Screen name="ForgetLoginPwd" component={ForgetLoginPwd} options={{title: ''}} />
            <Stack.Screen
                name="InviteExperienceGold"
                component={InviteExperienceGold}
                options={{title: '理财魔方体验金'}}
            />
            <Stack.Screen name="MemberRule" component={MemberRule} options={{title: '理财魔方生日增幅券规则'}} />
            <Stack.Screen name="QuestionWithdraw" component={QuestionWithdraw} options={{title: '答题提现'}} />
            {/* <Stack.Screen name="Index" component={Index} options={{title: 'Index'}} /> */}
            <Stack.Screen name="ArticleDetail" component={ArticleDetail} options={{title: '', headerShown: false}} />
            <Stack.Screen name="AdjustRecord" component={AdjustRecord} options={{title: ''}} />
            <Stack.Screen
                name="MyScore"
                component={MyScore}
                options={{
                    title: '我的魔分',
                    headerStyle: {
                        backgroundColor: Colors.brandColor,
                        shadowOffset: {
                            height: 0,
                        },
                        elevation: 0,
                    },
                    headerTitleStyle: {
                        color: '#fff',
                        fontSize: px(18),
                    },
                }}
            />
            <Stack.Screen name="ScoreDetail" component={ScoreDetail} options={{title: '魔分明细'}} />
            <Stack.Screen name="LCMF" component={LCMF} options={{title: ''}} />
            <Stack.Screen name="WebView" component={WebView} options={{headerShown: false}} />
            <Stack.Screen name="DetailInsurance" component={DetailInsurance} options={{title: '魔方保障计划'}} />
            <Stack.Screen name="PerformanceAnalysis" component={PerformanceAnalysis} options={{title: '业绩解析'}} />
            <Stack.Screen name="VisionCollect" component={VisionCollect} options={{headerShown: false}} />
            <Stack.Screen name="AlbumList" component={AlbumList} options={{title: ''}} />
            <Stack.Screen name="Launch" component={Launch} options={{headerShown: false}} />
            <Stack.Screen name="Questionnaire" component={Questionnaire} options={{title: '风险测评'}} />
            <Stack.Screen name="PortfolioMask" component={PortfolioMask} options={{title: ''}} />
            <Stack.Screen name="QuestionnaireResult" component={QuestionnaireResult} options={{title: '评测结果'}} />
            <Stack.Screen name="TopInvestors" component={TopInvestors} options={{title: '牛人信号'}} />
            <Stack.Screen
                name="IntelligentIncomeDetail"
                component={IntelligentIncomeDetail}
                options={{title: '组合收益明细'}}
            />
            <Stack.Screen
                name="IntelligentInvestAnalysis"
                component={IntelligentInvestAnalysis}
                options={{title: '投资分析'}}
            />
            <Stack.Screen name="InsuranceList" options={{headerShown: false}} component={InsuranceList} />
            <Stack.Screen name="PrivacySetting" component={PrivacySetting} options={{title: '隐私设置'}} />
            <Stack.Screen
                name="PersonalizedRecommend"
                component={PersonalizedRecommend}
                options={{title: '个性化推荐设置'}}
            />
            <Stack.Screen name="AuthorityManage" component={AuthorityManage} options={{title: '权限管理'}} />
            <Stack.Screen name="AboutApp" component={AboutApp} options={{title: '关于理财魔方'}} />
            <Stack.Screen name="WeChatNotice" component={WeChatNotice} options={{title: '开启微信通知'}} />
            <Stack.Screen name="IdAuth" component={IdAuth} options={{title: '基金交易安全开户'}} />
            <Stack.Screen name="VerifyLogin" component={VerifyLogin} options={{title: ''}} />
            <Stack.Screen
                name="AdvisorPortfolio"
                component={AdvisorPortfolio}
                options={{
                    title: '投顾组合超市',
                    headerStyle: {
                        backgroundColor: '#FFF5E5',
                        shadowOffset: {
                            height: 0,
                        },
                        elevation: 0,
                    },
                }}
            />
            <Stack.Screen name="InvestStrategy" component={InvestStrategy} options={{title: '投资策略'}} />
            <Stack.Screen name="FundAlternative" component={FundAlternative} options={{title: '基金备选库'}} />
            <Stack.Screen
                name="AdvisorAssets"
                component={AdvisorAssets}
                options={{
                    title: '投顾组合',
                    headerStyle: {
                        backgroundColor: Colors.brandColor,
                        shadowOpacity: 0,
                        shadowOffset: {
                            height: 0,
                        },
                        elevation: 0,
                    },
                    headerTitleStyle: {
                        color: '#fff',
                        fontSize: px(18),
                    },
                    headerBackImage: () => {
                        return (
                            <Feather
                                name="chevron-left"
                                color="#fff"
                                size={px(26)}
                                style={{marginLeft: Platform.select({ios: 10, android: 0})}}
                            />
                        );
                    },
                }}
            />
            <Stack.Screen name="PortfolioPlan" component={PortfolioPlan} options={{title: ''}} />
            <Stack.Screen name="WalletAutoRechargeDetail" component={WalletAutoRechargeDetail} options={{title: ''}} />
            <Stack.Screen name="GlobalConfig" component={GlobalConfig} options={{title: ''}} />
            <Stack.Screen name="FundAdjust" component={FundAdjust} options={{title: ''}} />
            <Stack.Screen name="OptimizePlan" component={OptimizePlan} options={{title: '优化计划'}} />
            <Stack.Screen name="FollowInvestSetting" component={FollowInvestSetting} options={{title: ''}} />
            <Stack.Screen name="AdviserFee" component={AdviserFee} options={{title: ''}} />
            <Stack.Screen name="WealthTools" component={WealthTools} options={{headerShown: false}} />
            <Stack.Screen name="ReportWebView" component={ReportWebView} options={{headerShown: false}} />
            <Stack.Screen name="Live" component={Live} options={{headerShown: false}} />
            <Stack.Screen name="LiveList" component={LiveList} options={{title: '直播'}} />
            <Stack.Screen name="ArticleList" component={ArticleList} options={{title: ''}} />
            <Stack.Screen name="SelectIdentity" component={SelectIdentity} options={{title: '请选择视野中的身份'}} />
            <Stack.Screen name="ProductCover" component={ProductCover} options={{title: ''}} />
            <Stack.Screen name="RiskAdjustTool" component={RiskAdjustTool} options={{title: ''}} />
            <Stack.Screen name="LiveLand" component={LiveLand} options={{headerShown: false}} />
            <Stack.Screen name="RationalLevel" component={RationalLevel} options={{title: '理性等级'}} />
            <Stack.Screen name="RationalRecord" component={RationalRecord} options={{title: '理性值记录'}} />
            <Stack.Screen name="RationalUpgrade" component={RationalUpgrade} options={{title: ''}} />
            <Stack.Screen name="CommentList" component={CommentList} options={{title: ''}} />
            <Stack.Screen name="PublishComment" component={PublishComment} options={{title: ''}} />
            <Stack.Screen
                name="ArticleCommentList"
                component={ArticleCommentList}
                options={{headerShown: false, ...TransitionPresets.ModalSlideFromBottomIOS}}
            />
            <Stack.Screen name="VerifyCodeQA" component={VerifyCodeQA} options={{title: ''}} />
        </Stack.Navigator>
    );
}
