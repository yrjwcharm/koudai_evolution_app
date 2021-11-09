/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-09 11:38:57
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
import Modal from '../../components/Modal/ModalContainer';
import {BottomModal, Modal as _Modal} from '../../components/Modal';
import Mask from '../../components/Mask';
import HTML from '../../components/RenderHtml';
import calm from '../../assets/personal/calm.gif';
import smile from '../../assets/personal/smile.gif';
import sad from '../../assets/personal/sad.gif';
import warn from '../../assets/personal/warning.gif';
import Storage from '../../utils/storage';
import CheckBox from '../../components/CheckBox';
import _ from 'lodash';
function HomeScreen({navigation, route}) {
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(true);
    const userInfo = useSelector((store) => store.userInfo);
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
    const [choice, setChoice] = useState('');
    const [notChoose, setNotChoose] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    const [showCircle, setShowCircle] = useState(false);
    const [signData, setSignData] = useState(null);
    const bottomModal = useRef(null);
    const [signSelectData, setSignSelectData] = useState([]);
    const [signOpen, setSignOpen] = useState([]);
    const moodEnumRef = useRef({
        1: calm,
        2: smile,
        3: sad,
        4: warn,
    }); // 机器人表情枚举
    // 滚动回调
    const onScroll = useCallback((event) => {
        let y = event.nativeEvent.contentOffset.y;

        setScrollY(y);
    }, []);
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
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            global.LogTool('click', show === 'true' ? 'eye_close' : 'eye_open');
            storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
            return show === 'true' ? 'false' : 'true';
        });
    }, []);
    const getSignData = () => {
        http.get('adviser/get_need_sign_list/20210923').then((data) => {
            setSignData(data.result);
            let sign_open = data?.result?.plan_list?.map((item) => {
                if (item?.is_open == 1) {
                    return item?.poid;
                }
            });
            setSignOpen(sign_open);
            isFocused && bottomModal.current.show();
        });
    };
    const init = useCallback(
        (refresh) => {
            refresh === 'refresh' && setRefreshing(true);
            refresh === 'refresh' && setHideMsg(false);
            http.get('/asset/holding/20210101', {
                // uid: '1000000001',
            }).then((res) => {
                if (res.code === '000000') {
                    setHoldingData(res.result);
                    if (res.result?.is_need_sign == 1) {
                        getSignData();
                    }
                }
            });
            readInterface();
            http.get('/asset/common/20210101').then((res) => {
                if (res.code === '000000') {
                    setUserBasicInfo(res.result);
                }
                !userInfo.toJS()?.is_login && setLoading(false);
                setRefreshing(false);
            });
            if (userInfo.toJS()?.is_login) {
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
                            setChoice('');
                            setModalData(res.result);
                            isFocused && setIsVisible(true);
                        }
                    }
                });
                http.get('/asset/center_control/20210101').then((res) => {
                    if (res.code === '000000') {
                        setCenterData(res.result || []);
                    }
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isFocused]
    );
    //checkBox 选中
    const checkBoxClick = (check, poid) => {
        //选中
        if (check) {
            if (poid) {
                setSignSelectData((prev) => {
                    return [...prev, poid];
                });
            } else {
                setSignSelectData((prev) => {
                    let poids = signData?.plan_list?.map((item) => {
                        return item.poid;
                    });
                    return [...new Set([...prev, ...poids])];
                });
            }
        } else {
            //非选中
            if (poid) {
                setSignSelectData((prev) => {
                    let data = [...prev];
                    _.remove(data, function (_poid) {
                        return _poid === poid;
                    });
                    return data;
                });
            } else {
                setSignSelectData([]);
            }
        }
    };
    //点击签约协议展开
    const handleSignOpen = (poid) => {
        setSignOpen((prev) => {
            return [...prev, poid];
        });
    };
    //签约
    const handleSign = () => {
        http.post('adviser/sign/20210923', {poids: signSelectData}).then((res) => {
            bottomModal.current.toastShow(res.message);
            if (res.code === '000000') {
                if (signSelectData?.length == signData?.plan_list?.length) {
                    setTimeout(() => {
                        bottomModal.current.hide();
                    }, 1000);
                } else {
                    getSignData();
                }
            }
        });
    };
    const reportSurvey = (answer) => {
        http.post('/common/survey/report/20210521', {survey_id: 1, answer});
    };
    const readInterface = useCallback(() => {
        if (userInfo.toJS()?.is_login) {
            http.get('/message/unread/20210101').then((res) => {
                setNewmessage(res.result.all);
            });
        }
    }, [userInfo]);
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);
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
    const needAdjust = useCallback((item) => {
        return item.portfolios.every((po) => po.adjust_status > 0);
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
                        <HTML html={item.title} style={styles.contentTitle} />
                    </View>
                ) : null}
                <View style={{height: text(60)}}>
                    <HTML
                        html={item.content}
                        style={{
                            ...styles.contentText,
                            color: item.title ? Colors.descColor : Colors.defaultColor,
                        }}
                    />
                </View>
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

    useFocusEffect(
        useCallback(() => {
            Storage.get('version' + userInfo.toJS().latest_version + 'setting_icon').then((res) => {
                if (!res && global.ver < userInfo.toJS().latest_version) {
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
        }, [hasNet, showGesture])
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
            !userInfo.toJS().is_login && scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
            return () => {
                StatusBar.setBarStyle('dark-content');
            };
        }, [userInfo])
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
            if (isFocused && userInfo?.toJS()?.is_login) {
                scrollRef?.current?.scrollTo({x: 0, y: 0, animated: false});
                hasNet && !showGesture && init('refresh');
                global.LogTool('tabDoubleClick', 'Home');
            }
        });
        return () => listener();
    }, [hasNet, isFocused, navigation, init, userInfo, showGesture]);
    useEffect(() => {
        const listener = NetInfo.addEventListener((state) => {
            setHasNet(state.isConnected);
        });
        return () => listener();
    }, []);

    return hasNet ? (
        loading ? (
            renderLoading()
        ) : !showGesture ? (
            isFocused && (
                <View style={styles.container}>
                    <BottomModal
                        style={{height: px(600), backgroundColor: '#fff'}}
                        ref={bottomModal}
                        title={signData?.title}
                        sub_title={signData?.title_tip}>
                        <View style={{flex: 1}}>
                            <ScrollView
                                style={{
                                    paddingHorizontal: px(16),
                                    paddingTop: px(22),
                                    paddingBottom: px(20),
                                }}>
                                <TouchableOpacity activeOpacity={1}>
                                    {signData?.desc ? (
                                        <>
                                            <HTML html={signData?.desc} style={styles.light_text} />
                                            <Text>
                                                {signData?.desc_link_list?.map((item, index) => (
                                                    <Text
                                                        style={[styles.light_text, {color: Colors.btnColor}]}
                                                        key={index}
                                                        onPress={() => {
                                                            if (item?.url) {
                                                                jump(item?.url);
                                                                bottomModal.current.hide();
                                                            }
                                                        }}>
                                                        {item.text}
                                                    </Text>
                                                ))}
                                            </Text>
                                        </>
                                    ) : null}
                                    <View style={[Style.flexRow, {marginTop: px(12)}, styles.border_bottom]}>
                                        <CheckBox
                                            checked={signSelectData?.length == signData?.plan_list?.length}
                                            style={{marginRight: px(6)}}
                                            onChange={(value) => {
                                                checkBoxClick(value);
                                            }}
                                        />
                                        <Text style={{fontSize: px(14), fontWeight: '700'}}>
                                            全选({signSelectData?.length}/{signData?.plan_list?.length})
                                        </Text>
                                    </View>
                                    {signData?.plan_list?.map((item, index) => {
                                        return (
                                            <View key={index} style={styles.border_bottom}>
                                                <View style={[Style.flexRow, {marginBottom: px(6)}]}>
                                                    <CheckBox
                                                        checked={signSelectData?.includes(item?.poid)}
                                                        style={{marginRight: px(6)}}
                                                        onChange={(value) => {
                                                            checkBoxClick(value, item.poid);
                                                        }}
                                                    />
                                                    <Text style={styles.light_text}>{item?.name}</Text>
                                                </View>
                                                <Text style={styles.light_text}>
                                                    {item?.desc}
                                                    <Text
                                                        style={{
                                                            color: signOpen?.includes(item?.poid)
                                                                ? Colors.defaultColor
                                                                : Colors.btnColor,
                                                        }}
                                                        onPress={() => {
                                                            handleSignOpen(item?.poid);
                                                        }}>
                                                        {item?.link_name}
                                                    </Text>
                                                    {signOpen?.includes(item?.poid) &&
                                                        item?.link_list?.map((link, _index) => (
                                                            <Text
                                                                style={{color: Colors.btnColor}}
                                                                key={_index}
                                                                onPress={() => {
                                                                    if (link?.url) {
                                                                        jump(link?.url);
                                                                        bottomModal.current.hide();
                                                                    }
                                                                }}>
                                                                {link?.text}
                                                            </Text>
                                                        ))}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                    {signData?.button ? (
                                        <Button
                                            disabled={!signSelectData?.length > 0}
                                            style={{marginTop: px(20)}}
                                            onPress={_.debounce(handleSign, 500)}
                                            title={signData?.button?.text}
                                        />
                                    ) : null}
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </BottomModal>
                    {/* 登录注册蒙层 */}
                    {!userInfo.toJS().is_login && <LoginMask />}
                    {isVisible && (
                        <>
                            {!global.rootSibling && <Mask />}
                            <Modal
                                children={() => (
                                    <View
                                        style={[
                                            Style.flexRow,
                                            {flexWrap: 'wrap', paddingVertical: text(12), paddingLeft: text(34)},
                                        ]}>
                                        {modalData.options?.map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    key={item.key}
                                                    onPress={() => {
                                                        setChoice(item.key);
                                                        setNotChoose('');
                                                    }}
                                                    style={[
                                                        Style.flexCenter,
                                                        styles.option,
                                                        choice === item.key ? styles.acOption : {},
                                                        {marginRight: index % 2 === 0 ? text(12) : 0},
                                                    ]}>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            styles.optionText,
                                                            choice === item.key ? {color: '#fff'} : {},
                                                        ]}>
                                                        {item.val}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                        {notChoose ? (
                                            <Text style={{color: Colors.red, paddingVertical: text(8)}}>
                                                {notChoose}
                                            </Text>
                                        ) : null}
                                    </View>
                                )}
                                clickClose={false}
                                confirmCallBack={() => {
                                    if (choice) {
                                        setIsVisible(false);
                                        reportSurvey(choice);
                                    } else {
                                        setNotChoose('*请选择一个答案，才能提交');
                                    }
                                }}
                                confirmText={'确认'}
                                destroy={() => {
                                    if (choice) {
                                        setIsVisible(false);
                                        reportSurvey(choice);
                                    } else {
                                        setNotChoose('*请选择一个答案，才能提交');
                                    }
                                }}
                                isTouchMaskToClose={false}
                                isVisible={isVisible}
                                title={modalData.title}
                            />
                        </>
                    )}
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
                                onRefresh={() => userInfo?.toJS()?.is_login && !showGesture && init('refresh')}
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
                                                userInfo?.toJS()?.avatar
                                                    ? {uri: userInfo.toJS().avatar}
                                                    : require('../../assets/personal/usercenter.png')
                                            }
                                            style={[styles.headImg, userBasicInfo?.user_info ? {} : {borderWidth: 0}]}
                                        />
                                        <Text style={styles.username}>
                                            {userInfo?.toJS()?.nickname ? userInfo.toJS().nickname : '****'}
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
                                                <Text style={styles.memberText}>
                                                    {userBasicInfo?.member_info?.title}
                                                </Text>
                                                <FontAwesome name={'angle-right'} size={16} color={Colors.descColor} />
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        global.LogTool('assetsNotificationCenter');
                                        jump({path: 'RemindMessage'});
                                    }}>
                                    {newMes ? <View style={styles.new_message} /> : null}
                                    <Image
                                        style={{width: text(32), height: text(32)}}
                                        source={require('../../assets/img/index/whiteMes.png')}
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
                                            jump(item.url);
                                        }}
                                        key={`topmenu${item.id}`}
                                        style={[Style.flexCenter, {flex: 1, height: '100%'}]}>
                                        <Image source={{uri: item.icon}} style={styles.topMenuIcon} />
                                        <Text style={styles.topMenuTitle}>{item.title}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {/* 中控 */}
                        {centerData.length > 0 && (
                            <LinearGradient
                                colors={['#DEECFF', '#E2EEFF']}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 1}}
                                style={[styles.centerCtrl]}>
                                {/* mood 1代表平静 2代表微笑 3代表伤心 4代表警告 */}
                                <Image
                                    source={moodEnumRef.current[centerData[page].mood || 1]}
                                    style={styles.robotSty}
                                />
                                <Text
                                    style={{
                                        ...styles.noticeText,
                                        color: Colors.defaultColor,
                                        marginBottom: text(10),
                                        marginLeft: text(60),
                                    }}>
                                    {`Hi，${userInfo?.toJS()?.nickname || userInfo?.toJS()?.mobile}`}
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
                                                        <HTML html={item.title} style={styles.contentTitle} />
                                                    </View>
                                                ) : null}
                                                <HTML html={item.content} style={styles.contentText} />
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
                                        removeClippedSubviews
                                        renderItem={renderItem}
                                        sliderHeight={text(144)}
                                        sliderWidth={deviceWidth - text(44)}
                                    />
                                )}
                            </LinearGradient>
                        )}
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
                                                Storage.save(
                                                    'version' + userInfo.toJS().latest_version + 'setting_icon',
                                                    true
                                                );
                                            }
                                            jump(item.url);
                                        }}>
                                        <Image source={{uri: item.icon}} style={styles.topMenuIcon} />
                                        <Text style={styles.topMenuTitle}>{item.title}</Text>
                                        {index == 3 && showCircle ? <View style={styles.circle} /> : null}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <BottomDesc />
                    </ScrollView>
                </View>
            )
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
        backgroundColor: '#fff',
    },
    robotSty: {
        width: text(54),
        height: text(54),
        position: 'absolute',
        top: text(3),
        left: text(12),
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
        fontWeight: '500',
    },
    contentTitle: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
        fontWeight: '500',
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
    new_message: {
        width: text(6),
        height: text(6),
        borderRadius: text(4),
        backgroundColor: Colors.red,
        position: 'absolute',
        right: text(3),
        top: text(5),
        zIndex: 10,
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
    light_text: {fontSize: px(13), lineHeight: px(17)},
    border_bottom: {
        borderColor: Colors.lineColor,
        borderBottomWidth: 0.5,
        paddingVertical: px(12),
    },
});
export default HomeScreen;
