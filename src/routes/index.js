/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @Description:路由表
 */
import React from 'react';
import {Keyboard, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import TabScreen from './Tabbar';
import LineChart from '../pages/Chart/lineChart.js';
import StickyScreen from '../pages/sticky';
import {Colors} from '~/common/commonStyle';
import GlobalShare, {currentNavigation} from '~/components/GlobalShare';
import Audio from '~/pages/Community/components/Audio';
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
import AssetsConfigDetail from '../pages/Portfolio/AssetsConfigDetail'; // 资产配置详情 持仓分布
import TradeFixedConfirm from '../pages/FixedPortfolio/TradeFixedConfirm'; //定投确认页面
import TradeBuy from '../pages/Trade/TradeBuy'; //购买定投  此名称在WalletAutoRechargeDetail有判断
import TradeRules from '../pages/Trade/TradeRules'; // 交易须知
import WalletAutoRechargeDetail from '../pages/Trade/WalletAutoRechargeDetail'; // 魔方宝自动充值详情
import CommonProblem from '../pages/Portfolio/CommonProblem'; // 常见问题
import RiskManagement from '../pages/Portfolio/RiskManagement'; // 风险控制
import PortfolioDetails from '../pages/Portfolio/PortfolioDetails/Index'; // 组合详情
import TradeProcessing from '../pages/Trade/TradeProcessing'; // 交易确认页
import LargeAmount from '../pages/Trade/LargeAmount'; //大额转账
import LargeAmountIntro from '../pages/Trade/LargeAmountIntro'; //大额转账说明
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
// import FundDetail from '../pages/Portfolio/FundDetail'; // 基金详情
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
import FixedPlanDetail from '../pages/FixedPortfolio/FixedPlanDetail'; //定投计划详情
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
import Sign from '../pages/Assets/Sign';
import RiskDisclosure from '../pages/Assets/RiskDisclosure'; // 风险揭示书
import ArticleCommentList from '../pages/Vision/ArticleCommentList'; //文章评论列表
import UserCommunication from '../pages/Assets/UserCommunication'; // 用户交流
import AdjustSetting from '../pages/Assets/AdjustSetting'; // 调仓方式
import AdvisorServiceSign from '../pages/Assets/AdvisorServiceSign'; // 投顾服务签约
// v7新页面 Start
import SearchHome from '../pages/PK/pages/SearchHome'; //搜索
import PKIntroduce from '../pages/PK/pages/Introduce'; // pk介绍
import PKSelectProduct from '../pages/PK/pages/SelectProduct'; // 产品选择
import FundIndex from '~/pages/FundIndex/pages/Index'; // 公募基金首页
import FundClassification from '~/pages/FundIndex/pages/FundClassification'; // 基金分类
import OCRHome from '~/pages/Attention/OCRHome'; //基金识别导入
import FundTradeBuy from '~/pages/Trade/FundTradeBuy'; // 基金购买
import ImportOwnerFund from '~/pages/Attention/ImportOwnerFund'; //导入持仓
import ImportOptionalFund from '~/pages/Attention/ImportOptionalFund'; //导入自选
import EditSortFund from '~/pages/Attention/EditSortFund'; //基金编辑
import EditOwnerFund from '~/pages/Attention/EditOwnerFund'; //编辑持仓基金
import PKCompare from '../pages/PK/pages/Compare'; // pk对比
import PrivatePlacement from '../pages/PE/PrivatePlacement'; // 私募
import FundDetail from '~/pages/FundIndex/pages/FundDetail'; // 基金详情
import FundRankList from '~/pages/FundIndex/pages/FundRankList'; // 基金榜单
import FundNoticeManage from '~/pages/Attention/FundNoticeManage'; //基金消息管理
import FundNoticeCenter from '~/pages/Attention/FundNoticeCenter'; //基金消息中心
import AppTag from '~/pages/Auth/AppTag'; //用户标签选择
import UpgradeToPortfolio from '~/pages/Assets/UpgradeDetail/UpgradeToPortfolio'; // 升级到组合详情
import UpgradeToPlan from '~/pages/Assets/UpgradeDetail/UpgradeToPlan'; // 升级到计划详情
import UpgradeConfirm from '~/pages/Assets/UpgradeDetail/UpgradeConfirm'; // 升级到计划详情
import ProjectHome from '~/pages/Project/ProjectHome'; // 计划首页
import ProjectSetTradeModel from '~/pages/Project/ProjectSetTradeModel'; //计划设置买卖模式
import HoldingDetail from '~/pages/Assets/HoldingDetail'; // 持仓详情页
import MfbHome from '~/pages/Mfb/MfbHome'; // 魔方宝首页
import ProjectSetTradeAmount from '~/pages/Project/ProjectSetTradeAmount'; //计划设置金额
import SubscribeManage from '~/pages/Settings/SubscribeManage'; //订阅管理
import MfbHoldingInfo from '~/pages/Mfb/MfbHoldingInfo'; // 魔方宝持有信息
import AutoCharge from '~/pages/Mfb/AutoCharge'; // 自动充值
import ToolWebView from '~/pages/Assets/ToolWebView'; // 工具webview
import ProjectTradeResult from '~/pages/Project/ProjectTradeResult'; //计划确认页
import SignalList from '~/pages/Project/SignalList'; //指数买卖信号列表
import ProjectDetail from '~/pages/Project/ProjectDetail'; // 计划详情页
import ProjectIntro from '~/pages/Project/ProjectIntro'; // 计划介绍页
import FundTradeRules from '~/pages/FundIndex/pages/FundTradeRules'; // 基金交易规则
import FundHolding from '~/pages/FundIndex/pages/FundHolding'; // 基金持仓
import Activity from '~/pages/Common/Activity'; // 通用全图活动页
import WhatIsPlan from '~/pages/Project/WhatIsPlan'; // 什么是计划
import TradeGuide from '~/pages/Trade/TradeGuide'; // 交易引导
import PortfolioIndex from '../pages/Portfolio/Index'; // 组合详情
import SpecialDetail from '~/pages/Special/Detail'; // 专题详情页
import CommonCommentList from '~/pages/Common/CommentList'; // 公共评论列表
import ToolListManage from '~/pages/Assets/ToolListManage/ToolList'; //全部工具列表
import PortfolioAssetList from '~/pages/Assets/PortfolioAssetList/PortfolioAssetList';
import ProductMoreMenu from '~/pages/FundIndex/pages/ProductMoreMenu'; // 更多分类
import CommunityHome from '~/pages/Community/CommunityHome/CommunityHome';
import CommunityPersonalHome from '~/pages/Community/CommunityHome/CommunityPersonalHome'; //社区个人主页
import CommunityVideo from '~/pages/Community/CommunityVideo/CommunityVideo'; //社区音频
import CommunityVodCreate from '~/pages/Community/CommunityVodCreate'; // 发布视频
// v7新页面 End
import InvestorInfoTable from '../pages/PE/InvestorInfoTable'; // 投资者信息表
import IdentityAssertion from '../pages/PE/IdentityAssertion'; // 个人税收居民身份声明
import ObjectChoose from '../pages/PE/ObjectChoose'; // 特定对象选择
import QuestionAnswer from '../pages/PE/QuestionAnswer'; // 私募问答
import UploadMaterial from '../pages/PE/UploadMaterial'; // 投资者证明材料上传
import PrivateReview from '../pages/PE/PrivateReview'; // 私募审核页面
import PEQuestionnaire from '../pages/PE/PEQuestionnaire'; // 私募风险测评
import PEQuestionnaireResult from '../pages/PE/PEQuestionnaireResult'; // 私募风险评测结果页
import InvestorCert from '../pages/PE/InvestorCert'; // 合格投资者认证
import ProductReserve from '../pages/PE/ProductReserve'; // 私募产品预约
import MatchNotification from '../pages/PE/MatchNotification'; // 匹配告知
import SignRiskDisclosure from '../pages/PE/SignRiskDisclosure'; // 逐项确认
import SignPassword from '../pages/PE/SignPassword'; // 设置签署密码
import PortfolioTransfer from '../pages/Assets/PortfolioTransfer'; // 组合转投页面
import BlancedPortfolio from '../pages/Portfolio/Detail/BlancedPortfolio'; // 股债平衡组合
import TradeAgreementList from '../pages/Common/TradeAgreementList'; //权益须知
import SingleFundRedeem from '../pages/Assets/SingleFundRedeem.js'; //单只基金赎回
import SingleFundRule from '../pages/Trade/SingleFundRule.js'; //单只基金规则
import Find from '~/pages/Find'; // 投顾组合
import PortfolioAssets from '~/pages/Assets/PortfolioAssets'; // 老版本持仓详情页
import TransferIntro from '../pages/Trade/QuickTransfer/TransferIntro'; // 一键转换介绍页
import ChooseTransferPortfolio from '../pages/Trade/QuickTransfer/ChooseTransferPortfolio'; // 选择转换组合
import TradeTransfer from '../pages/Trade/QuickTransfer/TradeTransfer'; // 一键转换
import TransferDetail from '../pages/Trade/QuickTransfer/TransferDetail'; // 转换详情
import SubjectCollection from '~/pages/CreatorCenter/SubjectCollection'; // 专题合集
import DataDetails from '~/pages/CreatorCenter/DataDetails'; // 数据明细
import CommunityCollection from '~/pages/CreatorCenter/CommunityCollection'; // 社区合集
import MenuList from '~/pages/Common/MenuList'; // 菜单列表
import AddProductStep1 from '~/pages/CreatorCenter/AddProductStep1'; // 添加产品步骤1
import AddProductStep2 from '~/pages/CreatorCenter/AddProductStep2'; // 添加产品步骤2
// 专题创建
import SpecialModifyBgImage from '~/pages/CreatorCenter/Special/Create/SpecialModifyBgImage.js'; // 专题创建-选择之前的图片
import SpecialCreateBaseInfo from '~/pages/CreatorCenter/Special/Create/SpecialCreateBaseInfo.js'; // 专题创建-基础信息
import SpecailSortContent from '~/pages/CreatorCenter/Special/Create/SpecailSortContent.js'; // 专题创建-内容排序
import SpecailModifyContent from '~/pages/CreatorCenter/Special/Create/SpecailModifyContent.js'; // 专题创建/修改-内容
import SpecialSubmitCheck from '~/pages/CreatorCenter/Special/Create/SpecialSubmitCheck.js'; // 专题创建-提交审核成功
// 专题修改
import SpecialModifyEntry from '~/pages/CreatorCenter/Special/Modify/SpecialModifyEntry.js'; // 专题修改入口
import SpecialModifyBaseInfo from '~/pages/CreatorCenter/Special/Modify/SpecialModifyBaseInfo.js'; // 专题修改-基础信息
import SpecialModifyActiveInfo from '~/pages/CreatorCenter/Special/Modify/SpecialModifyActiveInfo.js'; // 专题修改-活动信息
import SpecailModifyComment from '~/pages/CreatorCenter/Special/Modify/SpecailModifyComment.js'; // 专题修改-评论础信息
import SpecialModifyRecommend from '~/pages/CreatorCenter/Special/Modify/SpecialModifyRecommend.js'; // 专题修改-推广位样式
import SpecialPreviewRecommend from '~/pages/CreatorCenter/Special/Modify/SpecialPreviewRecommend.js'; // 专题修改-推广位样式
import SpecialModifyProductInfo from '~/pages/CreatorCenter/Special/Modify/SpecialModifyProductInfo.js'; // 专题修改-推广位-产品信息填写
import SpecialModifyProductItem from '~/pages/CreatorCenter/Special/Modify/SpecialModifyProductItem.js'; // 专题修改-推广位-产品信息填写-选择产品
import EditProduct from '~/pages/CreatorCenter/EditProduct'; // 修改产品
import SelectProduct from '~/pages/CreatorCenter/SelectProduct'; // 添加产品
import ProfitDetail from '~/pages/Assets/ProfitAnalysis/ProfitDetail'; //收益明细
import FixedInvestManage from '~/pages/Assets/FixedInvestment/FixedInvestManage'; //定投管理
import TerminatedFixedInvest from '~/pages/Assets/FixedInvestment/TerminatedFixedInvest'; //已终止定投
import FixedInvestDetail from '~/pages/Assets/FixedInvestment/FixedInvestDetail'; //定投详情
import ModifyFixedInvest from '~/pages/Assets/FixedInvestment/ModifyFixedInvest';

import SetSpecialCardStyle from '~/pages/CreatorCenter/SetSpecialCardStyle';
import EditSpecialCardInfo from '~/pages/CreatorCenter/EditSpecialCardInfo';
import SpecialCardStylePreview from '~/pages/CreatorCenter/SpecialCardStylePreview';
import SpecialExamine from '~/pages/CreatorCenter/SpecialExamine'; // 专题审核
import CommunityInfoCreate from '~/pages/Community/CommunityInfoCreate'; // 创建社区
import CommunityInfoEdit from '~/pages/Community/CommunityInfoEdit'; // 编辑社区资料
import CommunityArticleSubmitCheck from '~/pages/Community/CommunityArticleSubmitCheck'; // 社区审核页面
import SortProduct from '~/pages/CreatorCenter/AddProductStep2/SortProduct'; // 排序产品
import CommunityMyFollow from '~/pages/Community/CommunityMyFollow'; // 我的关注/我的粉丝
import CommunityArticleCreate from '~/pages/Community/CommunityArticleCreate'; // 写文章
import CommunityPersonalPrivacy from '~/pages/Community/CommunityPersonalPrivacy'; // 社区个人隐私管理
import PreviewArticle from '~/pages/Community/PreviewArticle'; // 预览文章
// 审核中心
import CreatorAuthHome from '~/pages/CreatorCenter/Auth/Home/CreatorAuthHome.js'; // 创作者-审核主页
import SpecialDetailDraft from '~/pages/CreatorCenter/SpecialDetailDraft'; // 专题草稿
import RichTextInputPage from '~/pages/CreatorCenter/Special/Modify/RichTextInputPage'; // 富文本编辑
import AdvisorTransfer from '~/pages/Assets/AdvisorTransfer'; // 转换投顾机构
import CommunityProSort from '../pages/Community/CommunityHome/CommunityProSort'; //社区作品内容管理
import Popularize from '~/pages/Popularize'; // 产品推广
import SignalManage from '~/pages/Assets/Signal/SignalManage'; //信号管理
import SignalStopList from '~/pages/Assets/Signal/SignalStopList'; //信号终止列表
import SignalTarget from '~/pages/Assets/Signal/SignalTarget'; //信号目标修改
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
        <>
            <Audio />
            <GlobalShare />
            <Stack.Navigator
                initialRouteName="Launch"
                headerMode="screen"
                screenOptions={({navigation}) => {
                    if (navigation.isFocused()) currentNavigation.current = navigation;
                    return {
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
                    };
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
                <Stack.Screen
                    name="PortfolioDetails"
                    component={PortfolioDetails}
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
                            backgroundColor: '#1E5AE7',
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
                    name="TradeProcessing"
                    component={TradeProcessing}
                    options={{gestureEnabled: false, headerShown: false}}
                />
                <Stack.Screen name="LargeAmount" component={LargeAmount} options={{headerShown: false}} />
                <Stack.Screen
                    name="LargeAmountIntro"
                    component={LargeAmountIntro}
                    options={{title: '大额极速购说明'}}
                />
                <Stack.Screen name="MfbIndex" component={MfbHome} options={{title: ''}} />
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
                <Stack.Screen
                    name="TotalIncomeDetail"
                    component={ProfitDetail}
                    options={{
                        gestureEnabled: false,
                        title: '',
                    }}
                />
                <Stack.Screen
                    name="IncomeDetail"
                    component={IncomeDetail}
                    options={{
                        title: '组合收益明细',
                    }}
                />
                <Stack.Screen
                    name="HistoryInvestPlan"
                    component={HistoryInvestPlan}
                    options={{title: '历史投资计划'}}
                />
                <Stack.Screen
                    name="AutomaticInvestManage"
                    component={FixedInvestManage}
                    options={{title: '定投管理'}}
                />
                <Stack.Screen name="ModifyFixedInvest" component={ModifyFixedInvest} options={{title: ''}} />

                <Stack.Screen name="FixedInvestDetail" component={FixedInvestDetail} options={{title: ''}} />
                <Stack.Screen name="TerminatedInvest" component={TerminatedFixedInvest} options={{title: ''}} />
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
                <Stack.Screen
                    name="FundDetail"
                    component={FundDetail}
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
                            backgroundColor: '#1E5AE7',
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
                <Stack.Screen name="HistoryNav" component={HistoryNav} options={{title: '历史净值'}} />
                <Stack.Screen
                    name="FindDetail"
                    component={FindDetail}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="TradeRecordDetail" component={TradeRecordDetail} options={{title: ''}} />
                <Stack.Screen name="FundRanking" component={FundRanking} options={{title: '基金排名'}} />
                <Stack.Screen name="FundTradeTime" component={FundTradeTime} options={{title: '交易时间说明'}} />
                <Stack.Screen name="FundScale" component={FundScale} options={{title: '基金规模'}} />
                <Stack.Screen name="FundManager" component={FundManager} options={{title: '基金经理'}} />
                <Stack.Screen name="FundCompany" component={FundCompany} options={{title: '基金公司'}} />
                <Stack.Screen name="CompanyFunds" component={CompanyFunds} options={{title: '旗下基金'}} />
                <Stack.Screen name="FundAnnouncement" component={FundAnnouncement} options={{title: '基金公告'}} />
                <Stack.Screen name="FixedPlanDetail" component={FixedPlanDetail} options={{title: ''}} />
                <Stack.Screen name="FixedPlanList" component={FixedInvestManage} options={{title: ''}} />
                <Stack.Screen name="FixedUpdate" component={FixedUpdate} options={{title: ''}} />
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
                <Stack.Screen name="Profile" component={Profile} options={{title: ''}} />
                <Stack.Screen name="ComplaintsAdvices" component={ComplaintsAdvices} options={{title: '投诉建议'}} />
                <Stack.Screen name="MessageBoard" component={MessageBoard} options={{title: '用户留言详情'}} />
                <Stack.Screen name="MessageNotice" component={MessageNotice} options={{title: ''}} />
                <Stack.Screen name="PrivateRedeem" component={PrivateRedeem} options={{title: ''}} />
                <Stack.Screen name="PrivateApply" component={PrivateApply} options={{title: ''}} />
                <Stack.Screen name="DetailPolaris" component={DetailPolaris} options={{title: ''}} />
                <Stack.Screen name="StrategyPolaris" component={StrategyPolaris} options={{title: ''}} />
                <Stack.Screen name="PrivateAssets" component={PrivateAssets} options={{headerShown: false}} />
                <Stack.Screen name="BankList" component={BankList} options={{title: '银行产品'}} />
                <Stack.Screen name="ContactUs" component={ContactUs} options={{title: '联系我们'}} />
                <Stack.Screen name="PasswordManagement" component={PasswordManagement} options={{title: '密码管理'}} />
                <Stack.Screen name="ResetLoginPwd" component={ResetLoginPwd} options={{title: '重设登录密码'}} />
                <Stack.Screen
                    name="TradePwdManagement"
                    component={TradePwdManagement}
                    options={{title: '交易密码管理'}}
                />
                <Stack.Screen name="ModifyTradePwd" component={ModifyTradePwd} options={{title: '修改交易密码'}} />
                <Stack.Screen name="ForgotTradePwd" component={ForgotTradePwd} options={{title: '找回交易密码'}} />
                <Stack.Screen
                    name="ForgotTradePwdNext"
                    component={ForgotTradePwdNext}
                    options={{title: '找回交易密码'}}
                />
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
                <Stack.Screen
                    name="TransferAccount"
                    component={TransferAccount}
                    options={{title: '一键转投全天候组合'}}
                />
                <Stack.Screen name="MemberCenter" component={MemberCenter} options={{title: '会员中心'}} />
                <Stack.Screen name="MemberSystem" component={MemberSystem} options={{title: '魔方会员体系'}} />
                <Stack.Screen name="MemberService" component={MemberService} options={{title: '会员专属服务'}} />
                <Stack.Screen
                    name="GetRationalValue"
                    component={GetRationalValue}
                    options={{title: '信任值获取方法'}}
                />
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
                <Stack.Screen
                    name="ArticleDetail"
                    component={ArticleDetail}
                    options={{title: '', headerShown: false}}
                />
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
                <Stack.Screen
                    name="PerformanceAnalysis"
                    component={PerformanceAnalysis}
                    options={{title: '业绩解析'}}
                />
                <Stack.Screen name="VisionCollect" component={VisionCollect} options={{headerShown: false}} />
                <Stack.Screen name="AlbumList" component={AlbumList} options={{title: ''}} />
                <Stack.Screen name="Launch" component={Launch} options={{headerShown: false}} />
                <Stack.Screen name="Questionnaire" component={Questionnaire} options={{title: '风险测评'}} />
                <Stack.Screen name="PortfolioMask" component={PortfolioMask} options={{title: ''}} />
                <Stack.Screen
                    name="QuestionnaireResult"
                    component={QuestionnaireResult}
                    options={{title: '评测结果'}}
                />
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
                <Stack.Screen
                    name="InsuranceList"
                    options={{
                        headerStyle: {
                            backgroundColor: '#F1BE66',
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
                        title: '',
                    }}
                    component={InsuranceList}
                />
                <Stack.Screen name="PrivacySetting" component={PrivacySetting} options={{title: '隐私设置'}} />
                <Stack.Screen
                    name="PersonalizedRecommend"
                    component={PersonalizedRecommend}
                    options={{title: '个性化推荐设置'}}
                />
                <Stack.Screen name="AuthorityManage" component={AuthorityManage} options={{title: '权限管理'}} />
                <Stack.Screen name="AboutApp" component={AboutApp} options={{title: '关于理财魔方'}} />
                <Stack.Screen name="WeChatNotice" component={WeChatNotice} options={{title: '开启微信通知'}} />
                <Stack.Screen name="IdAuth" component={IdAuth} options={{headerShown: false}} />
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
                <Stack.Screen
                    name="WalletAutoRechargeDetail"
                    component={WalletAutoRechargeDetail}
                    options={{title: ''}}
                />
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
                <Stack.Screen
                    name="SelectIdentity"
                    component={SelectIdentity}
                    options={{title: '请选择视野中的身份'}}
                />
                <Stack.Screen name="ProductCover" component={ProductCover} options={{title: ''}} />
                <Stack.Screen name="RiskAdjustTool" component={RiskAdjustTool} options={{title: ''}} />
                <Stack.Screen name="LiveLand" component={LiveLand} options={{headerShown: false}} />
                <Stack.Screen name="RationalLevel" component={RationalLevel} options={{title: '理性等级'}} />
                <Stack.Screen name="RationalRecord" component={RationalRecord} options={{title: '理性值记录'}} />
                <Stack.Screen name="RationalUpgrade" component={RationalUpgrade} options={{title: ''}} />
                <Stack.Screen name="CommentList" component={CommentList} options={{title: ''}} />
                <Stack.Screen name="PublishComment" component={PublishComment} options={{title: ''}} />
                <Stack.Screen name="Sign" component={Sign} options={{title: '投顾服务签约'}} />
                <Stack.Screen name="RiskDisclosure" component={RiskDisclosure} options={{title: ''}} />
                <Stack.Screen
                    name="ArticleCommentList"
                    component={ArticleCommentList}
                    options={{
                        headerShown: false,
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                        gestureDirection: 'horizontal',
                    }}
                />
                <Stack.Screen name="VerifyCodeQA" component={VerifyCodeQA} options={{title: ''}} />
                <Stack.Screen name="UserCommunication" component={UserCommunication} options={{title: ''}} />
                <Stack.Screen name="AdjustSetting" component={AdjustSetting} options={{title: ''}} />
                <Stack.Screen name="AdvisorServiceSign" component={AdvisorServiceSign} options={{title: ''}} />
                <Stack.Screen
                    name="OldPortfolioAssets"
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
                {/* v7新页面 Start */}
                <Stack.Screen
                    name="SearchHome"
                    component={SearchHome}
                    options={{
                        title: '',
                        headerShown: false,
                        cardStyleInterpolator: ({current: {progress}}) => ({
                            cardStyle: {
                                opacity: progress.interpolate({
                                    inputRange: [0, 0.5, 0.9, 1],
                                    outputRange: [0, 0.25, 0.7, 1],
                                }),
                            },
                        }),
                    }}
                />
                <Stack.Screen name="PKIntroduce" component={PKIntroduce} options={{headerShown: false}} />
                <Stack.Screen name="PKSelectProduct" component={PKSelectProduct} options={{title: '产品选择'}} />
                <Stack.Screen name="FundIndex" component={FundIndex} options={{title: ''}} />
                <Stack.Screen name="FundClassification" component={FundClassification} options={{title: ''}} />
                <Stack.Screen name="FundRankList" component={FundRankList} options={{headerShown: false}} />
                <Stack.Screen name="OCRHome" component={OCRHome} options={{title: ''}} />
                <Stack.Screen name="FundTradeBuy" component={FundTradeBuy} options={{title: ''}} />
                <Stack.Screen name="ImportOptionalFund" component={ImportOptionalFund} options={{title: '导入关注'}} />
                <Stack.Screen name="ImportOwnerFund" component={ImportOwnerFund} options={{title: '导入持仓基金'}} />
                <Stack.Screen name="EditSortFund" component={EditSortFund} options={{title: ''}} />
                <Stack.Screen name="EditOwnerFund" component={EditOwnerFund} options={{title: '修改持仓'}} />
                <Stack.Screen name="FundNoticeCenter" component={FundNoticeCenter} options={{title: '提醒中心'}} />
                <Stack.Screen name="FundNoticeManage" component={FundNoticeManage} options={{title: '管理提醒'}} />
                <Stack.Screen name="PKCompare" component={PKCompare} options={{title: 'PK对比'}} />
                <Stack.Screen name="PrivatePlacement" component={PrivatePlacement} options={{headerShown: false}} />
                <Stack.Screen name="AppTag" component={AppTag} options={{headerShown: false, gestureEnabled: false}} />
                <Stack.Screen name="UpgradeToPlan" component={UpgradeToPlan} options={{title: ''}} />
                <Stack.Screen name="UpgradeToPortfolio" component={UpgradeToPortfolio} options={{title: ''}} />
                <Stack.Screen name="UpgradeConfirm" component={UpgradeConfirm} options={{title: '资产升级'}} />
                <Stack.Screen name="ProjectHome" component={ProjectHome} options={{title: ''}} />
                <Stack.Screen
                    name="ProjectSetTradeModel"
                    component={ProjectSetTradeModel}
                    options={{title: '设置买卖模式'}}
                />
                <Stack.Screen name="PortfolioAssets" component={HoldingDetail} options={{title: ''}} />
                <Stack.Screen name="ProjectSetTradeAmount" component={ProjectSetTradeAmount} options={{title: ''}} />
                <Stack.Screen name="SubscribeManage" component={SubscribeManage} options={{title: '订阅管理'}} />
                <Stack.Screen name="MfbHoldingInfo" component={MfbHoldingInfo} options={{title: ''}} />
                <Stack.Screen name="AutoCharge" component={AutoCharge} options={{title: ''}} />
                <Stack.Screen name="ToolWebView" component={ToolWebView} options={{title: ''}} />
                <Stack.Screen name="ProjectTradeResult" component={ProjectTradeResult} options={{title: ''}} />
                <Stack.Screen name="SignalList" component={SignalList} options={{title: '', headerShown: false}} />
                <Stack.Screen
                    name="ProjectDetail"
                    component={ProjectDetail}
                    options={{
                        title: '',
                        headerStyle: {
                            backgroundColor: '#FF5151',
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
                <Stack.Screen
                    name="ProjectIntro"
                    component={ProjectIntro}
                    options={{
                        title: '',
                        headerStyle: {
                            backgroundColor: '#FA4F4F',
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
                <Stack.Screen name="FundTradeRules" component={FundTradeRules} options={{title: ''}} />
                <Stack.Screen name="FundHolding" component={FundHolding} options={{title: ''}} />
                <Stack.Screen name="Activity" component={Activity} options={{headerShown: false}} />
                <Stack.Screen name="WhatIsPlan" component={WhatIsPlan} options={{headerShown: false}} />
                <Stack.Screen name="TradeGuide" component={TradeGuide} options={{title: ''}} />
                <Stack.Screen name="PortfolioIndex" component={PortfolioIndex} options={{title: ''}} />
                <Stack.Screen
                    name="SpecialDetail"
                    component={SpecialDetail}
                    options={{
                        headerShown: false,
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                        gestureDirection: 'horizontal',
                    }}
                />
                <Stack.Screen
                    name="CommonCommentList"
                    component={CommonCommentList}
                    options={{
                        headerShown: false,
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                        gestureDirection: 'horizontal',
                    }}
                />
                <Stack.Screen name="ToolListManage" component={ToolListManage} options={{headerShown: false}} />
                <Stack.Screen name="PortfolioAssetList" component={PortfolioAssetList} options={{title: ''}} />
                <Stack.Screen name="ProductMoreMenu" component={ProductMoreMenu} options={{title: ''}} />
                <Stack.Screen name="CommunityHome" component={CommunityHome} options={{headerShown: false}} />
                <Stack.Screen
                    name="CommunityPersonalHome"
                    component={CommunityPersonalHome}
                    options={{headerShown: false}}
                />
                <Stack.Screen name="CommunityVideo" component={CommunityVideo} options={{headerShown: false}} />
                <Stack.Screen name="CommunityVodCreate" component={CommunityVodCreate} options={{headerShown: false}} />

                {/* v7新页面 End */}
                <Stack.Screen name="InvestorInfoTable" component={InvestorInfoTable} options={{title: ''}} />
                <Stack.Screen name="IdentityAssertion" component={IdentityAssertion} options={{title: ''}} />
                <Stack.Screen name="ObjectChoose" component={ObjectChoose} options={{title: ''}} />
                <Stack.Screen name="QuestionAnswer" component={QuestionAnswer} options={{title: ''}} />
                <Stack.Screen name="UploadMaterial" component={UploadMaterial} options={{title: ''}} />
                <Stack.Screen name="PrivateReview" component={PrivateReview} options={{title: ''}} />
                <Stack.Screen name="PEQuestionnaire" component={PEQuestionnaire} options={{title: ''}} />
                <Stack.Screen name="PEQuestionnaireResult" component={PEQuestionnaireResult} options={{title: ''}} />
                <Stack.Screen name="InvestorCert" component={InvestorCert} options={{title: ''}} />
                <Stack.Screen name="ProductReserve" component={ProductReserve} options={{title: ''}} />
                <Stack.Screen name="MatchNotification" component={MatchNotification} options={{title: ''}} />
                <Stack.Screen name="SignRiskDisclosure" component={SignRiskDisclosure} options={{title: ''}} />
                <Stack.Screen name="SignPassword" component={SignPassword} options={{title: ''}} />
                <Stack.Screen name="PortfolioTransfer" component={PortfolioTransfer} options={{title: ''}} />
                <Stack.Screen name="BlancedPortfolio" component={BlancedPortfolio} options={{title: ''}} />
                <Stack.Screen name="TradeAgreementList" component={TradeAgreementList} options={{title: ''}} />
                <Stack.Screen name="SingleFundRedeem" component={SingleFundRedeem} options={{title: ''}} />
                <Stack.Screen name="SingleFundRule" component={SingleFundRule} options={{title: '交易规则'}} />
                <Stack.Screen name="Find" component={Find} options={{title: ''}} />
                <Stack.Screen name="TransferIntro" component={TransferIntro} options={{title: ''}} />
                <Stack.Screen
                    name="ChooseTransferPortfolio"
                    component={ChooseTransferPortfolio}
                    options={{title: ''}}
                />
                <Stack.Screen name="TradeTransfer" component={TradeTransfer} options={{title: ''}} />
                <Stack.Screen name="TransferDetail" component={TransferDetail} options={{title: ''}} />
                <Stack.Screen name="SubjectCollection" component={SubjectCollection} options={{title: '专题合集'}} />
                <Stack.Screen name="DataDetails" component={DataDetails} options={{title: '数据明细'}} />
                <Stack.Screen
                    name="CommunityCollection"
                    component={CommunityCollection}
                    options={{title: '社区合集'}}
                />
                <Stack.Screen name="MenuList" component={MenuList} options={{title: ''}} />
                <Stack.Screen name="AddProductStep1" component={AddProductStep1} options={{title: ''}} />
                <Stack.Screen name="AddProductStep2" component={AddProductStep2} options={{title: ''}} />
                {/* 专题创建编辑相关页面 */}
                <Stack.Screen
                    name="SpecailModifyContent"
                    component={SpecailModifyContent}
                    options={{headerShown: false}}
                />
                <Stack.Screen name="SpecailSortContent" component={SpecailSortContent} options={{headerShown: false}} />
                <Stack.Screen
                    name="SpecialModifyBaseInfo"
                    component={SpecialModifyBaseInfo}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SpecialCreateBaseInfo"
                    component={SpecialCreateBaseInfo}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SpecialModifyBgImage"
                    component={SpecialModifyBgImage}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SpecialModifyActiveInfo"
                    component={SpecialModifyActiveInfo}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SpecailModifyComment"
                    component={SpecailModifyComment}
                    options={{headerShown: false}}
                />
                <Stack.Screen name="SpecialSubmitCheck" component={SpecialSubmitCheck} options={{headerShown: false}} />
                <Stack.Screen name="SpecialModifyEntry" component={SpecialModifyEntry} options={{headerShown: false}} />
                <Stack.Screen name="EditProduct" component={EditProduct} options={{title: ''}} />
                <Stack.Screen name="SelectProduct" component={SelectProduct} options={{title: '添加产品'}} />
                <Stack.Screen name="SetSpecialCardStyle" component={SetSpecialCardStyle} options={{title: ''}} />
                <Stack.Screen name="EditSpecialCardInfo" component={EditSpecialCardInfo} options={{title: ''}} />
                <Stack.Screen
                    name="SpecialCardStylePreview"
                    component={SpecialCardStylePreview}
                    options={{title: ''}}
                />
                <Stack.Screen name="SpecialExamine" component={SpecialExamine} options={{title: ''}} />
                <Stack.Screen
                    name="SpecialModifyRecommend"
                    component={SpecialModifyRecommend}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SpecialPreviewRecommend"
                    component={SpecialPreviewRecommend}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SpecialModifyProductInfo"
                    component={SpecialModifyProductInfo}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SpecialModifyProductItem"
                    component={SpecialModifyProductItem}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="CommunityInfoCreate"
                    component={CommunityInfoCreate}
                    options={{headerShown: false}}
                />
                <Stack.Screen name="CommunityInfoEdit" component={CommunityInfoEdit} options={{title: ''}} />
                <Stack.Screen
                    name="CommunityArticleSubmitCheck"
                    component={CommunityArticleSubmitCheck}
                    options={{title: ''}}
                />
                <Stack.Screen name="SortProduct" component={SortProduct} options={{title: '调整列表'}} />
                <Stack.Screen name="CommunityMyFollow" component={CommunityMyFollow} options={{title: ''}} />
                <Stack.Screen name="CreatorAuthHome" component={CreatorAuthHome} options={{headerShown: false}} />
                <Stack.Screen name="SpecialDetailDraft" component={SpecialDetailDraft} options={{headerShown: false}} />
                <Stack.Screen
                    name="CommunityArticleCreate"
                    component={CommunityArticleCreate}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="CommunityPersonalPrivacy"
                    component={CommunityPersonalPrivacy}
                    options={{title: ''}}
                />
                <Stack.Screen name="PreviewArticle" component={PreviewArticle} options={{title: ''}} />
                <Stack.Screen
                    name="RichTextInputPage"
                    component={RichTextInputPage}
                    options={{
                        headerShown: false,
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                        cardStyle: {backgroundColor: 'transparent', shadowColor: 'transparent'},
                    }}
                />
                <Stack.Screen name="AdvisorTransfer" component={AdvisorTransfer} options={{headerShown: false}} />
                <Stack.Screen name="CommunityProSort" component={CommunityProSort} options={{title: '编辑'}} />
                <Stack.Screen
                    name="Popularize"
                    component={Popularize}
                    options={{
                        title: '',
                        headerTransparent: true,
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
                <Stack.Screen name="SignalManage" component={SignalManage} options={{title: '信号管理'}} />
                <Stack.Screen name="SignalStopList" component={SignalStopList} options={{title: '已终止的信号'}} />
                <Stack.Screen name="SignalTarget" component={SignalTarget} options={{title: '我的目标'}} />
            </Stack.Navigator>
        </>
    );
}
