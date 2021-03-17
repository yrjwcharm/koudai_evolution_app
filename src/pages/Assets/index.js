/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-17 21:41:42
 * @Description: 我的资产页
 */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
    Animated,
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    LayoutAnimation,
    RefreshControl,
} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {deviceWidth, px as text, formaNum} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Header from '../../components/NavBar';
import NumText from '../../components/NumText';
import BottomDesc from '../../components/BottomDesc';
import LoginMask from '../../components/LoginMask';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import storage from '../../utils/storage';
import http from '../../services/index.js';
import {useJump} from '../../components/hooks';
import {useSelector} from 'react-redux';
import GesturePassword from './GesturePassword';
function HomeScreen({navigation, route}) {
    const userInfo = useSelector((store) => store.userInfo);
    const [scrollY, setScrollY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [hideMsg, setHideMsg] = useState(false);
    const [showEye, setShowEye] = useState('true');
    const [holdingData, setHoldingData] = useState({});
    const [userBasicInfo, setUserBasicInfo] = useState({});
    const [notice, setNotice] = useState({});
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const isFocused = useIsFocused();
    const scrollRef = useRef(null);
    const [showGesture, setShowGesture] = useState(false);
    // 滚动回调
    const onScroll = useCallback((event) => {
        let y = event.nativeEvent.contentOffset.y;
        if (y > 50) {
            StatusBar.setBarStyle('dark-content');
        } else {
            StatusBar.setBarStyle('light-content');
        }
        setScrollY(y);
    }, []);
    // 隐藏系统消息
    const hideSystemMsg = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start((a) => {
            if (a.finished) {
                setHideMsg(true);
                LayoutAnimation.linear();
            }
        });
    }, [fadeAnim]);
    // 显示|隐藏金额信息
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            setShowEye(show === 'true' ? 'false' : 'true');
            storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
        });
    }, []);
    // navigation.addListener('tabPress', e => {
    //   // Prevent default action
    //   e.preventDefault()
    // }
    const init = useCallback((refresh) => {
        refresh === 'refresh' && setRefreshing(true);
        refresh === 'refresh' && setHideMsg(false);
        http.get('/asset/holding/20210101', {
            // uid: '1000000001',
        }).then((res) => {
            if (res.code === '000000') {
                setHoldingData(res.result);
            }
        });
        http.get('/asset/common/20210101', {
            // uid: '1000000001',
        }).then((res) => {
            if (res.code === '000000') {
                StatusBar.setBarStyle('light-content');
                setUserBasicInfo(res.result);
            }
            setRefreshing(false);
        });
        http.get('/asset/notice/20210101', {
            // uid: '1000000001',
        }).then((res) => {
            if (res.code === '000000') {
                setNotice(res.result);
            }
        });
    }, []);
    // 渲染账户|组合标题
    const renderTitle = useCallback((item, portfolios) => {
        return item.has_bought !== undefined && !item.has_bought ? (
            <View style={Style.flexRow}>
                <View style={{flex: 1}}>
                    <Text style={[styles.accountName, {flex: 1}]}>{item.name}</Text>
                    <Text style={[styles.topMenuTitle, {flex: 1, color: Colors.darkGrayColor}]}>{item.desc}</Text>
                </View>
                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
            </View>
        ) : (
            <View style={[Style.flexRow, {marginBottom: text(10)}]}>
                <Text style={[styles.accountName, portfolios ? styles.portfoliosName : {}]}>{item.name}</Text>
                {item.tag ? <Text style={styles.tag}>{item.tag}</Text> : null}
            </View>
        );
    }, []);
    // 渲染组合金额和收益
    const renderProfit = useCallback(
        (item, id) => {
            const part1 = {
                key: id === 11 ? '我的保额' : '总金额',
                val: showEye === 'true' ? (id === 11 ? item.amount : item.amount) : '****',
            };
            const part2 = {
                key: id === 11 ? '我的保单' : '累计收益',
                val: showEye === 'true' ? (id === 11 ? item.count : item.profit_acc) : '****',
            };
            return (
                <View style={[styles.po_profit, Style.flexRow]}>
                    <View style={{flex: 1}}>
                        <Text style={styles.po_profit_key}>{part1.key}</Text>
                        <Text style={styles.po_profit_val}>{formaNum(part1.val)}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.po_profit_key}>{part2.key}</Text>
                        {id === 11 || showEye === 'false' ? (
                            <Text style={styles.po_profit_val}>{formaNum(part2.val)}</Text>
                        ) : (
                            <NumText style={styles.po_profit_val} text={`${formaNum(part2.val)}`} />
                        )}
                    </View>
                </View>
            );
        },
        [showEye]
    );
    // 渲染组合内容
    const renderPortfolios = useCallback(
        (item) => {
            return (
                <>
                    {(item.portfolios && item.portfolios.length === 1) || item.id === 11 ? (
                        <View style={[Style.flexRow, {alignItems: 'flex-start'}]}>
                            {renderProfit(item.id === 11 ? item : item.portfolios[0], item.id)}
                            <FontAwesome
                                name={'angle-right'}
                                size={20}
                                color={Colors.darkGrayColor}
                                style={{transform: [{translateY: text(-4)}]}}
                            />
                        </View>
                    ) : (
                        item.portfolios.map((po, i) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={`portfolio${po.poid}`}
                                    style={Style.flexRow}
                                    onPress={() => jump(po.url)}>
                                    <View
                                        style={[
                                            styles.portfolio,
                                            i === item.portfolios.length - 1 ? {paddingBottom: 0} : {},
                                        ]}>
                                        {renderTitle(po, true)}
                                        {renderProfit(po)}
                                    </View>
                                    <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                                </TouchableOpacity>
                            );
                        })
                    )}
                </>
            );
        },
        [renderTitle, renderProfit, jump]
    );
    const needAdjust = useCallback((item) => {
        return item.portfolios.every((po) => po.adjust_status > 0);
    }, []);

    useFocusEffect(
        useCallback(() => {
            init();
            // storage.delete('loginStatus');
            storage.get('myAssetsEye').then((res) => {
                setShowEye(res ? res : 'true');
            });
            StatusBar.setBarStyle('light-content');
            storage.get('gesturePwd').then((res) => {
                if (res) {
                    storage.get('openGesturePwd').then((result) => {
                        if (result) {
                            if (userInfo?.toJS()?.is_login && !userInfo?.toJS()?.verifyGesture) {
                                setShowGesture(true);
                            } else {
                                setShowGesture(false);
                            }
                        } else {
                            // 展示我的资产内容
                            setShowGesture(false);
                        }
                    });
                } else {
                    // 展示我的资产内容
                    setShowGesture(false);
                }
            });
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [init, userInfo])
    );
    useEffect(() => {
        const listener = navigation.addListener('tabPress', () => {
            if (isFocused && userInfo?.toJS()?.is_login) {
                scrollRef.current.scrollTo({x: 0, y: 0, animated: false});
                init('refresh');
            }
        });
        return listener;
    }, [isFocused, navigation, init, userInfo]);

    return !showGesture ? (
        <View style={styles.container}>
            {/* 登录注册蒙层 */}
            {!userInfo.toJS().is_login && isFocused && <LoginMask />}
            <Header
                title={'我的资产'}
                scrollY={scrollY}
                style={{
                    opacity: 0,
                    position: 'absolute',
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    zIndex: scrollY === 0 ? 0 : 10,
                }}
            />
            <ScrollView
                onScroll={onScroll}
                ref={scrollRef}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
                <View style={[styles.assetsContainer]}>
                    {/* 用户头像 会员中心 */}
                    <View style={[styles.header, Style.flexRow, {paddingTop: insets.top + text(8)}]}>
                        <Image
                            source={
                                userInfo?.toJS()?.avatar
                                    ? {uri: userInfo.toJS().avatar}
                                    : require('../../assets/personal/usercenter.png')
                            }
                            style={[styles.headImg, userBasicInfo?.user_info ? {} : {borderWidth: 0}]}
                        />
                        <Text style={styles.username}>
                            {userInfo?.toJS()?.nickname ? userInfo.toJS().nickname : '****'}
                        </Text>
                        {userBasicInfo?.member_info && Object.keys(userBasicInfo?.member_info).length > 0 && (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('MemberCenter', {level: 0})}>
                                <LinearGradient
                                    colors={['#FFF6E8', '#FFE1B8']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    style={[styles.memberCenter, Style.flexRow]}>
                                    <Text style={styles.memberText}>{userBasicInfo?.member_info.title}</Text>
                                    <FontAwesome name={'angle-right'} size={16} color={Colors.descColor} />
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Image source={require('../../assets/personal/mofang.png')} style={styles.mofang} />
                    <Image source={require('../../assets/personal/mofang_bg.png')} style={styles.mofang_bg} />
                    {/* 系统通知 */}
                    {!hideMsg && notice?.system ? (
                        <Animated.View style={[styles.systemMsgContainer, {opacity: fadeAnim}]}>
                            <Text style={styles.systemMsgText}>{notice.system}</Text>
                            <TouchableOpacity style={styles.closeSystemMsg} activeOpacity={0.8} onPress={hideSystemMsg}>
                                <EvilIcons name={'close'} size={22} color={Colors.yellow} />
                            </TouchableOpacity>
                        </Animated.View>
                    ) : null}
                    {/* 资产信息 */}
                    <View style={[styles.summaryTitle, Style.flexCenter]}>
                        <Text style={styles.summaryKey}>总资产(元)</Text>
                        <Text style={styles.date}>{holdingData?.summary?.profit_date || '0000-00-00'}</Text>
                        <TouchableOpacity onPress={toggleEye}>
                            <Ionicons
                                name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                size={16}
                                color={'rgba(255, 255, 255, 0.8)'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.experienceGold, Style.flexRow]}
                            onPress={() => navigation.navigate('ExperienceGoldDetail')}>
                            <Image
                                source={require('../../assets/personal/jinbi.png')}
                                style={{width: text(15), height: text(15)}}
                            />
                            <Text style={styles.goldText}>{'体验金'}</Text>
                            <FontAwesome name={'angle-right'} size={20} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={[styles.amount]}>
                            {showEye === 'true' ? holdingData?.summary?.amount : '****'}
                        </Text>
                    </View>
                    {/* 小黄条 */}
                    {notice?.trade && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.tradeNotice, Style.flexCenter]}
                            onPress={() => jump(userBasicInfo?.top_menus[3]?.url)}>
                            <Octicons name={'triangle-up'} size={16} color={'rgba(157, 187, 255, 0.68)'} />
                            <View style={[styles.noticeBox, Style.flexRow]}>
                                <Text style={styles.noticeText}>{notice.trade.desc}</Text>
                                <FontAwesome name={'angle-right'} size={16} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
                    )}
                    <View style={[styles.profitContainer, Style.flexRow]}>
                        <View style={[Style.flexCenter, {flex: 1}]}>
                            <Text style={styles.profitKey}>累计收益</Text>
                            <Text style={styles.profitVal}>
                                {holdingData?.summary && showEye === 'true' ? holdingData?.summary.profit_acc : '****'}
                            </Text>
                        </View>
                        <View style={[Style.flexCenter, {flex: 1}]}>
                            <Text style={styles.profitKey}>日收益</Text>
                            <Text style={styles.profitVal}>
                                {holdingData?.summary && showEye === 'true' ? holdingData?.summary.profit : '****'}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* 顶部菜单 */}
                <View style={[styles.topMenu, Style.flexRow]}>
                    {userBasicInfo?.top_menus?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => jump(item.url)}
                                key={`topmenu${item.id}`}
                                style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                <Image source={{uri: item.icon}} style={styles.topMenuIcon} />
                                <Text style={styles.topMenuTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {/* 中控 */}
                {/* <View style={[styles.centerCtrl, {marginBottom: text(12)}]}>
                    <Text style={styles.centerCtrlTitle}>{'中控内容'}</Text>
                    <Text style={styles.centerCtrlContent}>
                        {
                            '您当前的配置和主线有些偏离，建议您尽可跟随调仓可以让您的收益最大化。您也可以追加购买调整比例 '
                        }
                    </Text>
                </View> */}
                {/* 持仓组合 */}
                {holdingData?.accounts?.map((item, index, arr) => {
                    return item.portfolios ? (
                        item.portfolios.length > 1 ? (
                            <View
                                key={`account${item.id}`}
                                style={[styles.account, needAdjust(item) ? styles.needAdjust : {}]}>
                                {renderTitle(item)}
                                {renderPortfolios(item)}
                            </View>
                        ) : (
                            <TouchableOpacity
                                key={`account0${item.id}`}
                                activeOpacity={0.8}
                                style={[styles.account, needAdjust(item) ? styles.needAdjust : {}]}
                                onPress={() => jump(item.portfolios[0].url)}>
                                {renderTitle(item.portfolios[0])}
                                {renderPortfolios(item)}
                            </TouchableOpacity>
                        )
                    ) : (
                        <View key={`account1${item.id}`}>
                            {item.id === 12 ? (
                                <LinearGradient
                                    colors={['#33436D', '#121D3A']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    style={[styles.account, {padding: 0}]}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={[{padding: Space.padding}, Style.flexRow]}>
                                        <View style={[{flex: 1}, Style.flexRow]}>
                                            <Text style={[styles.accountName, {flex: 1, color: '#FFDAA8'}]}>
                                                {item.name}
                                            </Text>
                                            <Text style={[styles.topMenuTitle, {flex: 1, color: '#FFDAA8'}]}>
                                                {item.desc}
                                            </Text>
                                        </View>
                                        <FontAwesome name={'angle-right'} size={20} color={'#FFE8C3'} />
                                    </TouchableOpacity>
                                </LinearGradient>
                            ) : (
                                item.id === 11 && (
                                    <TouchableOpacity activeOpacity={0.8} style={[styles.account]}>
                                        {renderTitle(item)}
                                        {item.has_bought && renderPortfolios(item)}
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    );
                })}
                {/* 投顾 */}
                {userBasicInfo?.im_info && (
                    <TouchableOpacity activeOpacity={0.8} style={[styles.iaInfo, Style.flexRow]}>
                        <View style={[Style.flexRow, {flex: 1}]}>
                            <Image source={{uri: userBasicInfo.im_info.avatar}} style={styles.iaAvatar} />
                            <View>
                                <Text style={[styles.accountName, {marginBottom: text(4)}]}>
                                    {userBasicInfo.im_info.name}
                                </Text>
                                <Text style={styles.topMenuTitle}>{'您有任何投资相关问题都可以找我'}</Text>
                            </View>
                        </View>
                        <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                    </TouchableOpacity>
                )}
                {/* 早报 */}
                {userBasicInfo?.articles?.map((item, index) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={`article${index}`}
                            onPress={() => jump(item.url)}
                            style={[styles.article, Style.flexRow, {marginBottom: text(12)}]}>
                            <View style={{flex: 1}}>
                                <Text style={[styles.topMenuTitle, {marginBottom: text(6)}]}>{item.title}</Text>
                                <Text style={styles.accountName}>{item.desc}</Text>
                            </View>
                            <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                        </TouchableOpacity>
                    );
                })}
                {/* 底部菜单 */}
                <View style={[styles.topMenu, Style.flexRow, {marginTop: 0, marginBottom: text(24)}]}>
                    {userBasicInfo?.bottom_menus?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={`bottommenu${item.id}`}
                                style={[Style.flexCenter, {flex: 1, height: '100%'}]}
                                onPress={() => jump(item.url)}>
                                <Image source={{uri: item.icon}} style={styles.topMenuIcon} />
                                <Text style={styles.topMenuTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <BottomDesc />
            </ScrollView>
        </View>
    ) : (
        // 手势密码
        <GesturePassword option={'verify'} />
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    header: {
        paddingHorizontal: Space.marginAlign,
        paddingBottom: text(8),
        zIndex: 20,
        position: 'relative',
    },
    headImg: {
        width: text(32),
        height: text(32),
        borderWidth: text(1),
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: text(32),
    },
    username: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: '#fff',
        fontWeight: '600',
        marginHorizontal: text(8),
    },
    memberCenter: {
        width: text(76),
        height: text(20),
        justifyContent: 'center',
        backgroundColor: '#FFE1B8',
        borderRadius: text(10),
    },
    memberText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.descColor,
        marginRight: text(4),
    },
    assetsContainer: {
        position: 'relative',
        paddingBottom: text(44),
        backgroundColor: Colors.brandColor,
    },
    mofang: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: text(180),
        height: text(246),
    },
    mofang_bg: {
        position: 'absolute',
        top: text(6),
        left: 0,
        width: text(148),
        height: text(146),
    },
    systemMsgContainer: {
        backgroundColor: '#FFF5E5',
        paddingTop: text(8),
        paddingBottom: text(12),
        paddingRight: text(38),
        paddingLeft: Space.marginAlign,
    },
    systemMsgText: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.yellow,
        textAlign: 'justify',
    },
    closeSystemMsg: {
        position: 'absolute',
        right: text(12),
        top: text(10),
    },
    summaryTitle: {
        flexDirection: 'row',
        marginTop: text(16),
        marginBottom: text(8),
        position: 'relative',
    },
    summaryKey: {
        fontSize: text(13),
        lineHeight: text(18),
        color: 'rgba(255, 255, 255, 0.6)',
    },
    date: {
        fontSize: text(12),
        lineHeight: text(17),
        color: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: text(10),
    },
    amount: {
        fontSize: text(34),
        lineHeight: text(40),
        color: '#fff',
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    experienceGold: {
        position: 'absolute',
        top: text(-5),
        right: 0,
        padding: text(8),
        backgroundColor: '#9DBBFF',
        borderTopLeftRadius: text(100),
        borderBottomLeftRadius: text(100),
    },
    goldText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#fff',
        marginLeft: text(4),
        marginRight: text(12),
    },
    noticeBox: {
        marginTop: text(-4.5),
        paddingVertical: text(2),
        paddingHorizontal: Space.marginAlign,
        backgroundColor: 'rgba(157, 187, 255, 0.68)',
        borderRadius: text(12),
    },
    noticeText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#fff',
    },
    profitContainer: {
        marginTop: Space.marginVertical,
    },
    profitKey: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: '#fff',
        opacity: 0.6,
        marginBottom: text(4),
    },
    profitVal: {
        fontSize: text(17),
        lineHeight: text(20),
        color: '#fff',
        fontFamily: Font.numFontFamily,
    },
    topMenu: {
        marginTop: text(-28),
        marginBottom: text(12),
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: text(12),
        borderRadius: Space.borderRadius,
        height: text(80),
        backgroundColor: '#fff',
    },
    topMenuIcon: {
        width: text(24),
        height: text(24),
        marginBottom: text(4),
    },
    topMenuTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
    centerCtrl: {
        marginHorizontal: Space.marginAlign,
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    centerCtrlTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.green,
        fontWeight: '500',
        textAlign: 'center',
    },
    centerCtrlContent: {
        fontSize: Font.textH3,
        lineHeight: text(20),
        color: Colors.descColor,
        marginTop: text(12),
        textAlign: 'justify',
    },
    account: {
        padding: Space.padding,
        marginBottom: text(12),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    needAdjust: {
        borderWidth: Space.borderWidth,
        borderColor: Colors.red,
    },
    accountName: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    tag: {
        paddingHorizontal: text(6),
        paddingVertical: text(2),
        marginLeft: text(8),
        borderRadius: text(2),
        backgroundColor: Colors.red,
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#fff',
        fontWeight: '500',
    },
    po_profit: {
        flex: 1,
    },
    po_profit_key: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.darkGrayColor,
        marginBottom: text(4),
    },
    po_profit_val: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    portfoliosName: {
        fontSize: text(13),
        lineHeight: text(18),
    },
    portfolio: {
        flex: 1,
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        paddingVertical: text(12),
    },
    iaInfo: {
        marginHorizontal: Space.marginAlign,
        marginBottom: text(12),
        paddingVertical: text(14),
        paddingLeft: text(12),
        paddingRight: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    iaAvatar: {
        width: text(44),
        height: text(44),
        marginRight: text(12),
    },
    article: {
        marginHorizontal: Space.marginAlign,
        // marginTop: Space.marginVertical,
        paddingVertical: text(14),
        paddingHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
});
export default HomeScreen;
