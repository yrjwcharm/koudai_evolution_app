/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-04-27 18:40:21
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
    Platform,
} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {deviceWidth, px as text, formaNum, px} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import Header from '../../components/NavBar';
import NumText from '../../components/NumText';
import BottomDesc from '../../components/BottomDesc';
import LoginMask from '../../components/LoginMask';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import storage from '../../utils/storage';
import http from '../../services/index.js';
import {useJump, useShowGesture} from '../../components/hooks';
import {useSelector} from 'react-redux';
import GesturePassword from '../Settings/GesturePassword';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import {Modal, PageModal} from '../../components/Modal';
import HTML from '../../components/RenderHtml';
import calm from '../../assets/personal/calm.gif';
import smile from '../../assets/personal/smile.gif';
import smile1 from '../../assets/personal/smile1.gif';
import sad from '../../assets/personal/sad.gif';
import warn from '../../assets/personal/warning.gif';
import Storage from '../../utils/storage';
import Notice from '../../components/Notice';
import FastImage from 'react-native-fast-image';
function HomeScreen({navigation}) {
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(true);
    const userInfo = useSelector((store) => store.userInfo)?.toJS?.() || {};
    const [scrollY, setScrollY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [newMes, setNewmessage] = useState(0);
    const [hideMsg, setHideMsg] = useState(false);
    const [showEye, setShowEye] = useState('true');
    const [holdingData, setHoldingData] = useState({});
    const [userBasicInfo, setUserBasicInfo] = useState({});
    const [notice, setNotice] = useState({});
    const [centerData, setCenterData] = useState([]);
    const [page, setPage] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const isFocused = useIsFocused();
    const scrollRef = useRef(null);
    const showGesture = useShowGesture();
    const [loading, setLoading] = useState(true);
    const [showCircle, setShowCircle] = useState(false);
    const [signData, setSignData] = useState(null);
    const bottomModal = useRef(null);
    const moodEnumRef = useRef({
        1: calm,
        2: smile,
        3: sad,
        4: warn,
    }); // 机器人表情枚举
    const carouselRef = useRef(null);
    // 滚动回调
    const onScroll = (event) => {
        let y = event.nativeEvent.contentOffset.y;
        setScrollY(y);
    };
    // 隐藏系统消息
    const hideSystemMsg = useCallback(() => {
        global.LogTool('click', 'hideSystemMsg');
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
    const toggleEye = () => {
        setShowEye((show) => {
            global.LogTool('click', show === 'true' ? 'eye_close' : 'eye_open');
            storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    };
    //获取签约数据
    const getSignData = () => {
        http.get('adviser/need_sign/pop/20220422').then((data) => {
            setSignData(data.result?.sign);
            if (data?.result?.auto_pop) {
                bottomModal?.current?.show();
            }
        });
    };
    const init = (refresh) => {
        refresh === 'refresh' && setRefreshing(true);
        refresh === 'refresh' && setHideMsg(false);

        http.get('/asset/holding/20210101').then((res) => {
            if (res.code === '000000') {
                setHoldingData(res.result);
            }
        });
        http.get('/asset/common/20210101').then((res) => {
            if (res.code === '000000') {
                setUserBasicInfo(res.result);
            }
            !userInfo.is_login && setLoading(false);
            getSignData();
            setRefreshing(false);
        });
        if (userInfo.is_login) {
            readInterface();
            http.get('/asset/notice/20210101')
                .then((res) => {
                    setLoading(false);
                    if (res.code === '000000') {
                        setNotice(res.result);
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
            http.get('/common/survey/20210521', {survey_id: 1}).then((res) => {
                if (res.code === '000000') {
                    if (res.result.options) {
                        isFocused && !global.rootSibling && showChannelModal(res.result);
                    }
                }
            });
            http.get('/asset/center_control/20210101').then((res) => {
                if (res.code === '000000') {
                    setCenterData((prev) => {
                        const next = res.result || [];
                        if (prev.length > 0) {
                            setPage((prevPage) => {
                                const nextPage = prevPage + 1 > next.length ? next.length - 1 : prevPage;
                                carouselRef.current?.snapToItem(nextPage);
                                return nextPage;
                            });
                        } else {
                            setPage(0);
                        }
                        return next;
                    });
                }
            });
        }
    };

    // 展示渠道弹窗
    const showChannelModal = (_modalData) => {
        Modal.show({
            backButtonClose: false,
            children: () => (
                <View style={[Style.flexRow, {flexWrap: 'wrap', paddingVertical: text(12), paddingLeft: text(34)}]}>
                    {_modalData.options?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={item.key}
                                onPress={() => {
                                    _modalData.choice = item.key;
                                    _modalData.notChoose = '';
                                    showChannelModal(_modalData);
                                }}
                                style={[
                                    Style.flexCenter,
                                    styles.option,
                                    _modalData.choice === item.key ? styles.acOption : {},
                                    {marginRight: index % 2 === 0 ? text(12) : 0},
                                ]}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.optionText, _modalData.choice === item.key ? {color: '#fff'} : {}]}>
                                    {item.val}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    {_modalData.notChoose ? (
                        <Text style={{color: Colors.red, paddingVertical: text(8)}}>{_modalData.notChoose}</Text>
                    ) : null}
                </View>
            ),
            clickClose: false,
            confirmCallBack: () => {
                if (_modalData.choice) {
                    Modal.close({});
                    reportSurvey(_modalData.choice);
                } else {
                    _modalData.notChoose = '*请选择一个答案，才能提交';
                    showChannelModal(_modalData);
                }
            },
            confirmText: '确认',
            isTouchMaskToClose: false,
            title: _modalData.title,
        });
    };

    //签约
    const handleCancleSign = () => {
        return new Promise((resolve) => {
            Modal.show({
                title: signData?.cancel?.title,
                content: signData?.cancel?.content,
                confirm: true,
                cancelText: '再想一想',
                confirmText: '确认',
                confirmCallBack: () => {
                    bottomModal.current.hide();
                    resolve(false);
                },
                cancelCallBack: () => {
                    resolve(false);
                },
            });
        });
    };
    const reportSurvey = (answer) => {
        http.post('/common/survey/report/20210521', {survey_id: 1, answer});
    };
    const readInterface = () => {
        http.get('/message/unread/20210101').then((res) => {
            setNewmessage(res.result.all);
        });
    };
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);

    const needAdjust = useCallback((item) => {
        return item.portfolios.every((po) => po.adjust_status > 0);
    }, []);

    useFocusEffect(
        useCallback(() => {
            Storage.get('version' + userInfo.latest_version + 'setting_icon').then((res) => {
                if (!res && global.ver < userInfo.latest_version) {
                    setShowCircle(true);
                } else {
                    setShowCircle(false);
                }
            });
            hasNet && !showGesture ? init() : setLoading(false);
            storage.get('myAssetsEye').then((res) => {
                setShowEye(res ? res : 'true');
            });

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [hasNet, showGesture, userInfo.is_login, userInfo.latest_version])
    );
    useFocusEffect(
        useCallback(() => {
            if (scrollY > 50) {
                StatusBar.setBarStyle('dark-content');
            } else {
                StatusBar.setBarStyle('light-content');
            }
        }, [scrollY])
    );
    useFocusEffect(
        useCallback(() => {
            !userInfo.is_login && scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [userInfo.is_login])
    );
    useFocusEffect(
        useCallback(() => {
            if (centerData.length > 0) {
                centerData[page] && global.LogTool('assetsConsole', centerData[page].type);
            }
        }, [centerData, page])
    );
    useEffect(() => {
        const listener = navigation.addListener('tabPress', () => {
            if (isFocused && userInfo.is_login) {
                scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                hasNet && !showGesture && init('refresh');
                global.LogTool('tabDoubleClick', 'Home');
            }
        });
        return () => listener();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNet, isFocused, navigation, userInfo.is_login, showGesture]);
    useEffect(() => {
        const listener = NetInfo.addEventListener((state) => {
            setHasNet(state.isConnected);
        });
        return () => {
            listener();
        };
    }, []);
    const renderLoading = () => {
        return (
            <View
                style={{
                    paddingTop: insets.top + text(8),
                    flex: 1,
                    backgroundColor: '#fff',
                }}>
                <Image
                    style={{
                        flex: 1,
                    }}
                    source={require('../../assets/personal/loading.png')}
                    resizeMode={Image.resizeMode.contain}
                />
            </View>
        );
    };
    /** @name 渲染中控滑块 */
    const renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (item.button) {
                        global.LogTool('assetsConsoleStart', item.type);
                        http.post('/asset/center_click/20210101', {id: item.id, type: item.type});
                        jump(item.button.url);
                    }
                }}
                style={{...styles.contentBox, height: text(164)}}
                key={item + index}>
                {item.tag ? (
                    <View style={[Style.flexBetween, {marginBottom: text(8)}]}>
                        <View style={[styles.contentTag, {backgroundColor: item.color}]}>
                            <Text style={styles.contentTagText}>{item.tag}</Text>
                        </View>
                        {item.pub_date ? (
                            <Text
                                style={{
                                    ...styles.contentTagText,
                                    color: Colors.lightGrayColor,
                                    fontWeight: '400',
                                }}>
                                {item.pub_date}
                            </Text>
                        ) : null}
                    </View>
                ) : null}
                {item.title ? (
                    <View style={{marginBottom: text(4)}}>
                        <HTML html={item.title} numberOfLines={1} style={styles.contentTitle} />
                    </View>
                ) : null}
                <HTML
                    html={item.content}
                    numberOfLines={3}
                    style={{
                        ...styles.contentText,
                        color: item.title ? Colors.descColor : Colors.defaultColor,
                    }}
                />
                {item.button ? (
                    <View
                        style={[
                            Style.flexRowCenter,
                            styles.checkBtn,
                            styles.bottomBtn,
                            {backgroundColor: item.color || Colors.red},
                        ]}>
                        <Text style={{...styles.noticeText, marginRight: text(4)}}>{item.button.text}</Text>
                        <FontAwesome name={'angle-right'} size={16} color={'#fff'} />
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    };
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
                {item.tag ? (
                    <Text style={{...styles.tag, backgroundColor: item.tag_color || Colors.red}}>{item.tag}</Text>
                ) : null}
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
                                    onPress={() => {
                                        global.LogTool('assetsProductStart', po.poid);
                                        jump(po.url);
                                    }}>
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
    return hasNet ? (
        loading ? (
            renderLoading()
        ) : !showGesture ? (
            <View style={styles.container}>
                <PageModal
                    style={{height: px(530)}}
                    ref={bottomModal}
                    title={signData?.title}
                    beforeClose={handleCancleSign}
                    onClose={() => {}}>
                    <View style={{flex: 1, paddingBottom: px(12)}}>
                        {signData?.title_tip && <Notice content={{content: signData?.title_tip}} />}
                        <ScrollView
                            bounces={false}
                            style={{
                                padding: px(16),
                            }}>
                            <HTML
                                html={signData?.content}
                                style={{fontSize: px(13), color: Colors.defaultColor, lineHeight: px(20)}}
                            />
                            {signData?.desc
                                ? signData.desc?.map((item, index) => (
                                      <View key={index}>
                                          <Text style={{fontSize: px(16), fontWeight: '700', marginVertical: px(12)}}>
                                              {item?.title}
                                          </Text>
                                          <View style={styles.sign_scrollview}>
                                              <HTML
                                                  html={item?.content}
                                                  style={{fontSize: px(13), lineHeight: px(20)}}
                                              />
                                          </View>
                                      </View>
                                  ))
                                : null}
                            <View style={{height: px(30)}} />
                        </ScrollView>
                        {signData?.cancel ? (
                            <View style={[Style.flexBetween, {marginHorizontal: px(16), paddingTop: px(8)}]}>
                                <Button
                                    type={'minor'}
                                    style={{
                                        flex: 1,
                                        marginRight: px(12),
                                    }}
                                    onPress={handleCancleSign}
                                    title={signData?.cancel?.cancel?.text}
                                />
                                <Button
                                    style={{
                                        flex: 1,
                                    }}
                                    onPress={() => {
                                        bottomModal.current.hide();
                                        jump(signData?.cancel?.confirm?.url);
                                    }}
                                    title={signData?.cancel?.confirm?.text}
                                />
                            </View>
                        ) : null}
                    </View>
                </PageModal>
                {/* 登录注册蒙层 */}
                {!userInfo.is_login && <LoginMask />}
                <Header
                    title={'我的资产'}
                    scrollY={scrollY}
                    style={{
                        opacity: 0,
                        position: 'absolute',
                        width: deviceWidth,
                        backgroundColor: '#fff',
                        zIndex: scrollY === 0 ? 0 : 10,
                        borderColor: Colors.bgColor,
                        borderBottomWidth: 0.5,
                    }}
                />
                <ScrollView
                    onScroll={onScroll}
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => userInfo.is_login && !showGesture && init('refresh')}
                        />
                    }>
                    <View style={[styles.assetsContainer]}>
                        {/* 用户头像 会员中心 */}
                        <View style={[styles.header, Style.flexRow, {paddingTop: insets.top + text(8)}]}>
                            <View style={[Style.flexRow, {flex: 1}]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={Style.flexRow}
                                    onPress={() => {
                                        global.LogTool('assetsAvatarStart');
                                        navigation.navigate('Profile');
                                    }}>
                                    <Image
                                        source={
                                            userInfo.avatar
                                                ? {uri: userInfo.avatar}
                                                : require('../../assets/personal/usercenter.png')
                                        }
                                        style={[styles.headImg, userBasicInfo?.user_info ? {} : {borderWidth: 0}]}
                                    />
                                    <Text style={styles.username}>
                                        {userInfo.nickname ? userInfo.nickname : '****'}
                                    </Text>
                                </TouchableOpacity>
                                {userBasicInfo?.member_info && Object.keys(userBasicInfo?.member_info).length > 0 && (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('MemberCenter', {level: 0})}>
                                        <LinearGradient
                                            colors={['#FFF6E8', '#FFE1B8']}
                                            start={{x: 0, y: 0}}
                                            end={{x: 1, y: 0}}
                                            style={[styles.memberCenter, Style.flexRow]}>
                                            <Text style={styles.memberText}>{userBasicInfo?.member_info?.title}</Text>
                                            <FontAwesome name={'angle-right'} size={16} color={Colors.descColor} />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    global.LogTool('assetsNotificationCenter');
                                    jump({path: 'RemindMessage'});
                                }}
                                style={{position: 'relative'}}>
                                {newMes ? (
                                    <View style={[styles.point_sty, Style.flexCenter]}>
                                        <Text style={styles.point_text}>{newMes > 99 ? '99+' : newMes}</Text>
                                    </View>
                                ) : null}
                                <Image
                                    style={{width: text(32), height: text(32)}}
                                    source={require('../../assets/personal/whiteMes.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <Image source={require('../../assets/personal/mofang.png')} style={styles.mofang} />
                        <Image source={require('../../assets/personal/mofang_bg.png')} style={styles.mofang_bg} />
                        {/* 系统通知 */}
                        {!hideMsg && notice?.system ? (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    notice?.system?.log_id && global.LogTool(notice?.system?.log_id);
                                    if (notice?.system?.action == 'Sign' && signData) {
                                        bottomModal.current.show();
                                    }
                                    jump(notice?.system?.url);
                                }}>
                                <Animated.View
                                    style={[
                                        styles.systemMsgContainer,
                                        Style.flexBetween,
                                        {
                                            opacity: fadeAnim,
                                            paddingRight: notice?.system?.button ? text(16) : text(38),
                                        },
                                    ]}>
                                    <Text style={styles.systemMsgText}>{notice?.system?.desc}</Text>

                                    {notice?.system?.button ? (
                                        <View style={styles.btn}>
                                            <Text style={styles.btn_text}>{notice?.system?.button?.text}</Text>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.closeSystemMsg}
                                            activeOpacity={0.8}
                                            onPress={hideSystemMsg}>
                                            <EvilIcons name={'close'} size={22} color={Colors.yellow} />
                                        </TouchableOpacity>
                                    )}
                                </Animated.View>
                            </TouchableOpacity>
                        ) : null}
                        {/* 资产信息 */}
                        <View style={[styles.summaryTitle, Style.flexCenter]}>
                            <Text style={styles.summaryKey}>总资产(元)</Text>
                            <Text style={styles.date}>{holdingData?.summary?.profit_date}</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={toggleEye}>
                                <Ionicons
                                    name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                    size={16}
                                    color={'rgba(255, 255, 255, 0.8)'}
                                />
                            </TouchableOpacity>
                            {/* 体验金 */}
                            {userBasicInfo?.free_fund && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.experienceGold, Style.flexRow]}
                                    onPress={() => {
                                        global.LogTool('click', 'free_fund');
                                        jump(userBasicInfo?.free_fund?.url);
                                    }}>
                                    <Image
                                        source={require('../../assets/personal/jinbi.png')}
                                        style={{width: text(15), height: text(15)}}
                                    />
                                    <Text style={styles.goldText}>{userBasicInfo?.free_fund?.title}</Text>
                                    <FontAwesome name={'angle-right'} size={20} color={'#fff'} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={{textAlign: 'center'}}>
                            {showEye === 'true' ? (
                                <>
                                    <Text style={styles.amount}>
                                        {(holdingData?.summary?.amount?.split('.')[0] || '0') + '.'}
                                    </Text>
                                    <Text style={{...styles.amount, fontSize: text(24)}}>
                                        {holdingData?.summary?.amount?.split('.')[1] || '00'}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.amount}>****</Text>
                            )}
                        </Text>
                        {/* 小黄条 */}
                        {notice?.trade && notice.trade.desc ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.tradeNotice, Style.flexCenter]}
                                onPress={() => {
                                    global.LogTool('click', 'tradeMsg');
                                    jump(notice?.trade?.url);
                                }}>
                                <Octicons name={'triangle-up'} size={16} color={'rgba(157, 187, 255, 0.68)'} />
                                <View style={[styles.noticeBox, Style.flexRow]}>
                                    <Text style={styles.noticeText}>{notice?.trade?.desc}</Text>
                                    <FontAwesome name={'angle-right'} size={16} color={'#fff'} />
                                </View>
                            </TouchableOpacity>
                        ) : null}
                        <View style={[styles.profitContainer, Style.flexRow]}>
                            <View style={[Style.flexCenter, {flex: 1}]}>
                                <Text style={styles.profitKey}>日收益</Text>
                                <Text style={styles.profitVal}>
                                    {showEye === 'true' ? holdingData?.summary?.profit || '0.00' : '****'}
                                </Text>
                            </View>
                            <View style={[Style.flexCenter, {flex: 1}]}>
                                <Text style={styles.profitKey}>累计收益</Text>
                                <Text style={styles.profitVal}>
                                    {showEye === 'true' ? holdingData?.summary?.profit_acc || '0.00' : '****'}
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
                                    onPress={() => {
                                        global.LogTool('assetsIconsStart', 'top_menus', item.id);
                                        if (item.pop) {
                                            Modal.show({
                                                children: () => (
                                                    <View style={styles.popContentBox}>
                                                        <Text style={styles.popContent}>{item.pop.content}</Text>
                                                    </View>
                                                ),
                                                confirmCallBack: () => jump(item.pop.confirm?.url),
                                                confirmText: item.pop.confirm?.text,
                                                title: item.pop.title,
                                            });
                                        } else {
                                            if (item.is_new) {
                                                http.post('/tool/menu/click/20211207', {id: item.id});
                                            }
                                            jump(item.url);
                                        }
                                    }}
                                    key={`topmenu${item.id}`}
                                    style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                    <View style={{position: 'relative'}}>
                                        <Image source={{uri: item?.icon}} style={styles.topMenuIcon} />
                                        {item.is_new ? (
                                            <View style={styles.newMenu}>
                                                <Text style={styles.contentTagText}>{'新'}</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                    <Text style={styles.topMenuTitle}>{item.title}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {/* 运营位 */}
                    {userBasicInfo?.ad_info ? (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                global.LogTool('capsuleStart', userBasicInfo?.ad_info?.id);
                                jump(userBasicInfo?.ad_info?.url);
                            }}>
                            <FastImage
                                source={{
                                    uri: userBasicInfo?.ad_info?.cover,
                                }}
                                style={styles.ad_info}
                            />
                        </TouchableOpacity>
                    ) : null}
                    {/* 中控 */}
                    {centerData.length > 0 &&
                        (centerData[0]?.style === 1 ? (
                            <View style={[Style.flexRow, styles.centerCtrl, {paddingLeft: text(7)}]}>
                                <Image source={smile1} style={styles.robotSty1} />
                                <View style={{flex: 1}}>
                                    {centerData[0]?.title ? (
                                        <View style={{marginBottom: text(2)}}>
                                            <HTML html={centerData[0]?.title} style={styles.contentTitle} />
                                        </View>
                                    ) : null}
                                    {centerData[0]?.content ? (
                                        <HTML html={centerData[0]?.content} style={styles.contentText} />
                                    ) : null}
                                </View>
                            </View>
                        ) : (
                            <LinearGradient
                                colors={['#DEECFF', '#E2EEFF']}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}
                                style={[styles.centerCtrl]}>
                                {/* mood 1代表平静 2代表微笑 3代表伤心 4代表警告 */}
                                <Image
                                    source={moodEnumRef.current[centerData[page]?.mood || 1]}
                                    style={styles.robotSty}
                                />
                                <Text
                                    style={{
                                        ...styles.noticeText,
                                        color: Colors.defaultColor,
                                        marginBottom: text(10),
                                        marginLeft: text(60),
                                    }}>
                                    {`Hi，${userInfo.hold_info || userInfo.nickname || userInfo.mobile}`}
                                </Text>
                                {centerData.length > 1 && (
                                    <Text style={styles.pageText}>
                                        <Text style={styles.currentPage}>{page + 1}</Text>
                                        <Text>/{centerData.length}</Text>
                                    </Text>
                                )}
                                {centerData.length <= 1 &&
                                    centerData.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    if (item.button) {
                                                        global.LogTool('assetsConsoleStart', item.type);
                                                        http.post('/asset/center_click/20210101', {
                                                            id: item.id,
                                                            type: item.type,
                                                        });
                                                        jump(item.button.url);
                                                    }
                                                }}
                                                style={styles.contentBox}
                                                key={item + index}>
                                                {item.tag ? (
                                                    <View style={[Style.flexBetween, {marginBottom: text(8)}]}>
                                                        <View
                                                            style={[styles.contentTag, {backgroundColor: item.color}]}>
                                                            <Text style={styles.contentTagText}>{item.tag}</Text>
                                                        </View>
                                                        {item.pub_date ? (
                                                            <Text
                                                                style={{
                                                                    ...styles.contentTagText,
                                                                    color: Colors.lightGrayColor,
                                                                    fontWeight: '400',
                                                                }}>
                                                                {item.pub_date}
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                ) : null}
                                                {item.title ? (
                                                    <View style={{marginBottom: text(4)}}>
                                                        <HTML
                                                            html={item.title}
                                                            numberOfLines={2}
                                                            style={styles.contentTitle}
                                                        />
                                                    </View>
                                                ) : null}
                                                <HTML
                                                    html={item.content}
                                                    numberOfLines={3}
                                                    style={styles.contentText}
                                                />
                                                {item.button ? (
                                                    <View
                                                        style={[
                                                            Style.flexRowCenter,
                                                            styles.checkBtn,
                                                            {backgroundColor: item.color || Colors.red},
                                                        ]}>
                                                        <Text style={{...styles.noticeText, marginRight: text(4)}}>
                                                            {item.button.text}
                                                        </Text>
                                                        <FontAwesome name={'angle-right'} size={16} color={'#fff'} />
                                                    </View>
                                                ) : null}
                                            </TouchableOpacity>
                                        );
                                    })}
                                {centerData.length > 1 && (
                                    <Carousel
                                        activeSlideAlignment={'start'}
                                        data={centerData}
                                        inactiveSlideOpacity={1}
                                        inactiveSlideScale={0.9}
                                        itemHeight={text(144)}
                                        itemWidth={deviceWidth - text(79)}
                                        loop={Platform.select({android: false, ios: true})}
                                        onSnapToItem={(index) => setPage(index)}
                                        ref={carouselRef}
                                        removeClippedSubviews
                                        renderItem={renderItem}
                                        sliderHeight={text(144)}
                                        sliderWidth={deviceWidth - text(44)}
                                    />
                                )}
                            </LinearGradient>
                        ))}
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
                                    onPress={() => {
                                        global.LogTool('assetsProductStart', item?.portfolios[0].poid || 'adviser');
                                        jump(item?.portfolios[0].url);
                                    }}>
                                    {renderTitle(item?.portfolios[0])}
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
                                            style={[{padding: Space.padding}, Style.flexRow]}
                                            onPress={() => {
                                                global.LogTool('click', 'vip');
                                                jump(item.url);
                                            }}>
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
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={[styles.account]}
                                            onPress={() => {
                                                global.LogTool('click', 'insurance');
                                                jump(item.url);
                                            }}>
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
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.iaInfo, Style.flexRow]}
                            onPress={() => {
                                global.LogTool('assetsCustomerServiceStart');
                                jump(userBasicInfo?.im_info.url);
                            }}>
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
                                onPress={() => {
                                    global.LogTool('click', 'article', item.title);
                                    jump(item.url);
                                }}
                                style={[styles.article, Style.flexRow, {marginBottom: text(12)}]}>
                                <View style={{flex: 1}}>
                                    <Text style={[styles.topMenuTitle, {marginBottom: text(6)}]}>{item.title}</Text>
                                    <Text style={styles.accountName}>{item?.desc}</Text>
                                </View>
                                <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                            </TouchableOpacity>
                        );
                    })}
                    {/* 底部菜单 */}
                    <View style={[styles.topMenu, Style.flexRow, {marginTop: 0}]}>
                        {userBasicInfo?.bottom_menus?.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={`bottommenu${item.id}`}
                                    style={[Style.flexCenter, {flex: 1, height: '100%'}]}
                                    onPress={() => {
                                        global.LogTool('assetsIconsStart', 'bottom_menus', item.id);
                                        if (index == 3 && showCircle) {
                                            Storage.save('version' + userInfo.latest_version + 'setting_icon', true);
                                        }
                                        jump(item.url);
                                    }}>
                                    <Image source={{uri: item.icon}} style={styles.topMenuIcon} />
                                    <Text style={styles.topMenuTitle}>{item.title}</Text>
                                    {(index == 3 && showCircle) || item.show_circle ? (
                                        <View style={styles.circle} />
                                    ) : null}
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
        )
    ) : (
        <>
            <Empty
                img={require('../../assets/img/emptyTip/noNetwork.png')}
                text={'哎呀！网络出问题了'}
                desc={'网络不给力，请检查您的网络设置'}
                style={{paddingTop: insets.top + text(100), paddingBottom: text(60)}}
            />
            <Button title={'刷新一下'} style={{marginHorizontal: text(20)}} onPress={refreshNetWork} />
        </>
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
        width: text(144),
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
    },
    experienceGold: {
        position: 'absolute',
        top: text(-5),
        right: 0,
        padding: text(8),
        backgroundColor: '#6C9AEF',
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
        marginTop: -5,
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
    newMenu: {
        paddingVertical: px(1),
        paddingHorizontal: px(5),
        borderRadius: px(9),
        borderBottomLeftRadius: px(1),
        backgroundColor: Colors.red,
        position: 'absolute',
        bottom: px(18),
        left: px(16),
    },
    popContentBox: {
        marginTop: px(12),
        marginHorizontal: px(20),
        marginBottom: px(27),
    },
    popContent: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
        textAlign: 'center',
    },
    topMenuTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
    centerCtrl: {
        marginBottom: text(12),
        marginHorizontal: Space.marginAlign,
        padding: text(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#DEECFF',
    },
    robotSty: {
        width: text(54),
        height: text(54),
        position: 'absolute',
        top: text(3),
        left: text(12),
    },
    robotSty1: {
        marginRight: text(3),
        width: text(54),
        height: text(54),
    },
    pageText: {
        fontSize: Font.textH3,
        lineHeight: text(21),
        color: Colors.descColor,
        fontFamily: Font.numRegular,
        position: 'absolute',
        top: text(10),
        right: text(16),
    },
    currentPage: {
        fontSize: text(17),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
    contentBox: {
        padding: text(12),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    contentTag: {
        paddingVertical: text(1),
        paddingHorizontal: text(6),
        borderRadius: text(2),
    },
    contentTagText: {
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: '#fff',
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    contentTitle: {
        fontSize: Font.textH2,
        lineHeight: text(18),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    contentText: {
        fontSize: Font.textH3,
        lineHeight: text(19),
        color: Colors.descColor,
        textAlign: 'justify',
    },
    checkBtn: {
        marginTop: text(8),
        borderRadius: text(22),
        width: text(80),
        height: text(26),
    },
    bottomBtn: {
        marginTop: 0,
        position: 'absolute',
        bottom: text(12),
        left: text(12),
    },
    centerCtrlTitle: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.green,
        fontWeight: Platform.select({android: '700', ios: '500'}),
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
        fontWeight: Platform.select({android: '700', ios: '500'}),
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
        fontWeight: Platform.select({android: '700', ios: '500'}),
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
        // fontWeight: 'bold',
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
    loading: {
        marginHorizontal: Space.marginAlign,
        width: text(343),
        height: text(727),
    },
    point_sty: {
        position: 'absolute',
        left: px(15),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(50),
        zIndex: 10,
        minWidth: px(20),
        height: px(20),
        borderWidth: 2,
        borderColor: '#fff',
    },
    option: {
        marginBottom: text(12),
        borderRadius: text(4),
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        width: text(100),
        height: text(32),
    },
    acOption: {
        borderColor: Colors.brandColor,
        backgroundColor: Colors.brandColor,
    },
    optionText: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
        maxWidth: text(84),
    },
    btn: {
        borderRadius: text(14),
        paddingVertical: text(5),
        paddingHorizontal: text(10),
        backgroundColor: '#FF7D41',
    },
    btn_text: {
        fontWeight: '600',
        color: '#fff',
        fontSize: text(12),
        lineHeight: text(17),
    },
    circle: {
        height: px(6),
        width: px(6),
        borderRadius: px(6),
        backgroundColor: Colors.red,
        position: 'absolute',
        right: text(26),
        top: px(14),
    },
    light_text: {fontSize: px(13), lineHeight: px(17), color: Colors.lightBlackColor},

    point_text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: Font.textSm,
        lineHeight: Platform.select({ios: px(12), android: Font.textSm}),
        fontFamily: Font.numFontFamily,
    },
    ad_info: {
        height: px(60),
        borderRadius: 8,
        marginBottom: px(12),
        marginHorizontal: px(16),
    },
    sign_scrollview: {
        backgroundColor: '#F5F6F8',
        borderRadius: px(6),
        padding: px(16),
    },
});
export default HomeScreen;
