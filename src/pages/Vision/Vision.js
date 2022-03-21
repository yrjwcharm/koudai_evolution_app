/*
 * @Date: 2021-05-18 11:10:23
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-03-22 14:12:43
 * @Description:视野
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, RefreshControl, ScrollView, Text, Platform} from 'react-native';
import {WebView} from 'react-native-webview';

import http from '../../services/index.js';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import HTML from '../../components/RenderHtml';
import RenderTitle from './components/RenderTitle.js';
import RecommendCard from '../../components/Article/RecommendCard';
import RenderCate from './components/RenderCate';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import LoginMask from '../../components/LoginMask';
import {updateVision} from '../../redux/actions/visionData';
import {useFocusEffect} from '@react-navigation/native';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '../../components/hooks';
import BottomDesc from '../../components/BottomDesc';
import LoadingTips from '../../components/LoadingTips.js';
import {baseURL} from '../../services/config';
import Loading from '../Portfolio/components/PageLoading';

const Vision = () => {
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(true);
    const inset = useSafeAreaInsets();
    const scrollRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const userInfo = useSelector((store) => store.userInfo).toJS();
    const [data, setData] = useState();
    const [gradeData, setGradeData] = useState({});
    const [allMsg, setAll] = useState(0);
    const jump = useJump();
    const init = useCallback((type) => {
        type == 'refresh' && setRefreshing(true);
        http.get('/vision/index/20220215').then((res) => {
            setData(res.result);
            setRefreshing(false);
        });
        http.get('/rational/grade/entrance/20220315').then((res) => {
            if (res.code === '000000') {
                setGradeData(res.result);
            }
        });
    }, []);
    const readInterface = useCallback(() => {
        http.get('/message/unread/20210101').then((res) => {
            setAll(res.result.all);
        });
    }, []);
    useFocusEffect(
        useCallback(() => {
            init();
            userInfo?.is_login && readInterface();
            dispatch(updateVision({visionUpdate: ''}));
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [init, dispatch, readInterface])
    );
    useEffect(() => {
        const listener = NetInfo.addEventListener((state) => {
            setHasNet(state.isConnected);
        });
        return () => listener();
    }, []);
    //上传滚动百分比
    const onScroll = (evt) => {
        const event = evt.nativeEvent;
        global.LogTool(
            'pageScroll',
            Math.round((event.contentOffset.y / (event.contentSize.height - event.layoutMeasurement.height)) * 100)
        );
    };
    const NetError = () => {
        return (
            <>
                <Empty
                    img={require('../../assets/img/emptyTip/noNetwork.png')}
                    text={'哎呀！网络出问题了'}
                    desc={'网络不给力，请检查您的网络设置'}
                    style={{paddingTop: inset.top + px(100), paddingBottom: px(60)}}
                />
                <Button title={'刷新一下'} style={{marginHorizontal: px(20)}} onPress={refreshNetWork} />
            </>
        );
    };
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        init();
        setHasNet(netInfo.isConnected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [netInfo]);
    const header = () => {
        return (
            <>
                <View style={{height: inset.top, backgroundColor: '#fff'}} />
                <View style={[styles.header, Style.flexBetween]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={Style.flexRow}
                        onPress={() => {
                            jump(data?.part1?.url);
                        }}>
                        <Image source={{uri: data?.part1?.user?.avatar}} style={styles.avatar} />
                        <Text style={styles.name}>{data?.part1?.user?.nickname || '昵称'}</Text>
                        {data?.part1?.url ? (
                            <FontAwesome name={'angle-right'} color={Colors.defaultColor} size={18} />
                        ) : null}
                    </TouchableOpacity>
                    <View style={Style.flexRow}>
                        {/* 收藏 */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                global.LogTool('visionMisc');
                                jump({path: 'VisionCollect'});
                            }}>
                            <Image
                                source={require('../../assets/img/vision/collect_icon.png')}
                                style={styles.header_icon}
                            />
                        </TouchableOpacity>
                        {/* 消息 */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{position: 'relative'}}
                            onPress={() => {
                                global.LogTool('indexNotificationCenter');
                                jump({path: 'RemindMessage'});
                            }}>
                            {allMsg ? (
                                <View style={[styles.point_sty, Style.flexCenter]}>
                                    <Text style={styles.point_text}>{allMsg > 99 ? '99+' : allMsg}</Text>
                                </View>
                            ) : null}
                            <Image
                                style={{width: px(32), height: px(32)}}
                                source={require('../../assets/img/index/message.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    };
    const renderContent = () => {
        return (
            <>
                {header()}
                <ScrollView
                    ref={scrollRef}
                    key={1}
                    scrollEventThrottle={200}
                    onMomentumScrollEnd={onScroll}
                    style={{backgroundColor: Colors.bgColor}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => init('refresh')} />}>
                    {data ? (
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 0.05}}
                            colors={['#fff', '#F5F6F8']}
                            style={styles.con_bg}>
                            <View style={{paddingHorizontal: px(16)}}>
                                {/* 推荐位 */}
                                <RecommendCard
                                    style={{marginBottom: px(16)}}
                                    data={data?.part2}
                                    onPress={() => {
                                        global.LogTool('visionRecArticle', data?.part2);
                                    }}
                                />
                                {Object.keys(gradeData || {}).length > 0 && (
                                    <View style={styles.rationalBox}>
                                        {gradeData.style_type === 1 ? (
                                            <Image
                                                source={require('../../assets/img/vision/beginRationalBg.png')}
                                                style={styles.beginRationalBg}
                                            />
                                        ) : (
                                            <Image
                                                source={require('../../assets/img/vision/rationalBg.png')}
                                                style={styles.rationalBg}
                                            />
                                        )}
                                        {gradeData.style_type === 1 && (
                                            <View>
                                                <View style={[Style.flexBetween, {marginTop: Space.marginVertical}]}>
                                                    <View style={Style.flexRow}>
                                                        <Image
                                                            source={require('../../assets/img/vision/level_black.png')}
                                                            style={styles.levelIcon}
                                                        />
                                                        <Text style={styles.levelText}>{'理性等级'}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => jump(gradeData.url)}>
                                                        <Image
                                                            source={require('../../assets/img/vision/levelTips.png')}
                                                            style={styles.levelTipsIcon}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={{...styles.levelTips, marginTop: px(10)}}>
                                                    {gradeData.desc}
                                                </Text>
                                                <View style={{height: px(144)}}>
                                                    <WebView
                                                        renderLoading={
                                                            Platform.OS === 'android' ? () => <Loading /> : undefined
                                                        }
                                                        startInLoadingState={true}
                                                        scalesPageToFit={false}
                                                        source={{
                                                            uri: `${baseURL.H5}/rationalChart`,
                                                        }}
                                                        textZoom={100}
                                                    />
                                                </View>
                                                {gradeData.button ? (
                                                    <Button
                                                        color="#E9CE99"
                                                        onPress={() => jump(gradeData.button.url)}
                                                        style={styles.upgradeBtn}
                                                        textStyle={styles.upgradeBtnText}
                                                        title={gradeData.button.text}
                                                    />
                                                ) : null}
                                            </View>
                                        )}
                                        {gradeData.style_type === 2 && (
                                            <View style={Style.flexBetween}>
                                                <View>
                                                    <View style={[Style.flexRow, {marginTop: px(12)}]}>
                                                        <Image
                                                            source={require('../../assets/img/vision/level_black.png')}
                                                            style={styles.levelIcon}
                                                        />
                                                        <Text style={styles.levelText}>{'理性等级 '}</Text>
                                                        <Text style={styles.levelNum}>{gradeData.current_grade}</Text>
                                                    </View>
                                                    <View style={[Style.flexRow, {marginTop: px(6)}]}>
                                                        <HTML html={gradeData.desc} style={styles.nextNum} />
                                                    </View>
                                                    <View style={styles.taskBar}>
                                                        <View
                                                            style={[
                                                                styles.taskActiveBar,
                                                                {width: `${gradeData.percent}%`},
                                                            ]}
                                                        />
                                                    </View>
                                                </View>
                                                {gradeData.button ? (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => jump(gradeData.button.url)}
                                                        style={styles.getRational}>
                                                        <Text style={styles.getRationalText}>
                                                            {gradeData.button.text}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : null}
                                            </View>
                                        )}
                                        {gradeData.style_type === 3 && (
                                            <View>
                                                <View style={styles.upgradeBox}>
                                                    <Image
                                                        source={require('../../assets/img/vision/upgrade.png')}
                                                        style={styles.upgradeImg}
                                                    />
                                                    <Text style={styles.currentLevel}>{gradeData.current_grade}级</Text>
                                                    <Text style={styles.nextLevel}>{gradeData.next_grade}级</Text>
                                                </View>
                                                <View style={[Style.flexRow, {marginTop: Space.marginVertical}]}>
                                                    <Text
                                                        style={{
                                                            ...styles.levelText,
                                                            fontSize: px(18),
                                                            lineHeight: px(20),
                                                        }}>
                                                        {gradeData.name}
                                                    </Text>
                                                    <Text style={styles.levelNum}>{gradeData.next_grade}</Text>
                                                    <Text
                                                        style={{
                                                            ...styles.levelText,
                                                            fontSize: px(18),
                                                            lineHeight: px(20),
                                                        }}>
                                                        {' 级'}
                                                    </Text>
                                                </View>
                                                <View style={{marginTop: px(4)}}>
                                                    <HTML html={gradeData.desc} style={styles.levelTips} />
                                                </View>
                                                {gradeData.button ? (
                                                    <Button
                                                        color="#E9CE99"
                                                        onPress={() => jump(gradeData.button.url)}
                                                        style={styles.upgradeBtn}
                                                        textStyle={styles.upgradeBtnText}
                                                        title={gradeData.button.text}
                                                    />
                                                ) : null}
                                            </View>
                                        )}
                                    </View>
                                )}
                                {/* 其他模块 */}
                                {data?.part3?.map((item, index) => {
                                    return (
                                        <View key={index + 'i'}>
                                            {item?.items?.length > 0 ? (
                                                <RenderTitle
                                                    _key={index}
                                                    title={item.title}
                                                    sub_title={item?.sub_title}
                                                    more_text={item?.more ? item?.more?.text : ''}
                                                    onPress={() => {
                                                        jump(item?.more?.url);
                                                    }}
                                                />
                                            ) : null}
                                            {item?.direction == 'horizontal' ? (
                                                <ScrollView
                                                    horizontal
                                                    style={styles.horiView}
                                                    showsHorizontalScrollIndicator={false}>
                                                    <View style={[{marginLeft: px(16)}, Style.flexRow]}>
                                                        {item?.items?.map((_article) => {
                                                            return RenderCate(_article, {
                                                                marginBottom: px(12),
                                                                marginRight: px(12),
                                                            });
                                                        })}
                                                    </View>
                                                </ScrollView>
                                            ) : (
                                                item?.items?.map((_article) => {
                                                    return RenderCate(_article, {marginBottom: px(12)});
                                                })
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                            <BottomDesc />
                        </LinearGradient>
                    ) : (
                        <LoadingTips loadingStyle={{marginTop: px(100)}} />
                    )}
                </ScrollView>

                {!userInfo.is_login && <LoginMask scene="vision" />}
            </>
        );
    };

    return hasNet ? renderContent() : NetError();
};

export default Vision;

const styles = StyleSheet.create({
    header: {
        height: px(42),
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
    },
    avatar: {width: px(32), height: px(32), borderRadius: px(16), marginRight: px(10)},
    name: {color: Colors.defaultColor, fontSize: px(14), fontWeight: '700', marginRight: px(4)},
    header_icon: {
        width: px(32),
        height: px(32),
    },

    point_sty: {
        position: 'absolute',
        left: px(15),
        top: px(-5),
        backgroundColor: Colors.red,
        borderRadius: px(50),
        paddingHorizontal: px(4),
        zIndex: 10,
        minWidth: px(20),
        height: px(20),
        borderWidth: 2,
        borderColor: '#fff',
    },
    point_text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: Font.textSm,
        lineHeight: Platform.select({ios: px(12), android: Font.textSm}),
        fontFamily: Font.numFontFamily,
    },
    horiView: {
        width: deviceWidth,
        position: 'relative',
        left: -px(16),
    },
    con_bg: {
        flex: 1,
        borderColor: '#fff',
        borderWidth: 0.5,
        paddingBottom: px(16),
        paddingTop: px(4),
    },
    rationalBox: {
        marginTop: px(4),
        marginBottom: px(16),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    beginRationalBg: {
        width: px(343),
        height: px(92),
        position: 'absolute',
        top: 0,
        right: 0,
    },
    rationalBg: {
        width: px(343),
        height: px(57),
        position: 'absolute',
        top: 0,
        right: 0,
    },
    levelIcon: {
        marginRight: px(5),
        width: px(16),
        height: px(16),
    },
    levelText: {
        fontSize: Font.textH1,
        lineHeight: px(16),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '600'}),
    },
    levelNum: {
        fontSize: px(24),
        lineHeight: px(24),
        color: '#EB7121',
        fontFamily: Font.numFontFamily,
    },
    levelTipsIcon: {
        width: px(17),
        height: px(16),
    },
    nowNum: {
        fontSize: Font.textH3,
        lineHeight: px(14),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
    },
    nextNum: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    taskBar: {
        marginTop: px(2),
        marginBottom: Space.marginVertical,
        borderRadius: px(3),
        width: px(190),
        height: px(3),
        backgroundColor: '#FBF3E4',
    },
    taskActiveBar: {
        borderRadius: px(3),
        height: px(3),
        backgroundColor: '#E8CF9D',
    },
    getRational: {
        marginRight: px(4),
        paddingVertical: px(5),
        paddingHorizontal: px(12),
        borderRadius: px(16),
        backgroundColor: '#E8CF9D',
    },
    getRationalText: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    levelTips: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    upgradeBtn: {
        marginVertical: px(20),
        marginHorizontal: px(46),
        borderRadius: px(20),
        backgroundColor: '#E9CE99',
        height: px(40),
    },
    upgradeBtnText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    upgradeBox: {
        position: 'absolute',
        top: px(18),
        right: px(2),
    },
    upgradeImg: {
        width: px(100),
        height: px(57),
    },
    currentLevel: {
        fontSize: px(11.66),
        lineHeight: px(16),
        color: '#C5A25F',
        fontWeight: Platform.select({android: '700', ios: '500'}),
        position: 'absolute',
        bottom: px(15),
        left: px(12),
    },
    nextLevel: {
        fontSize: Font.textSm,
        lineHeight: px(16),
        color: '#C5A25F',
        fontWeight: Platform.select({android: '700', ios: '500'}),
        position: 'absolute',
        top: px(13),
        right: px(8),
    },
});
