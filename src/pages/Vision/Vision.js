/*
 * @Date: 2021-05-18 11:10:23
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-23 14:30:50
 * @Description:视野
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, RefreshControl, ScrollView, Text, Platform} from 'react-native';

import http from '../../services/index.js';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import {Colors, Font, Style} from '../../common/commonStyle';
import {px, deviceWidth} from '../../utils/appUtil';
import RenderTitle from './components/RenderTitle.js';
import RecommendCard from '../../components/Article/RecommendCard';
import RenderCate from './components/RenderCate';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import LoginMask from '../../components/LoginMask';
import {updateVision} from '../../redux/actions/visionData';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useJump} from '../../components/hooks';
import BottomDesc from '../../components/BottomDesc';

const Vision = ({navigation, route}) => {
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(true);
    const inset = useSafeAreaInsets();
    const scrollRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const userInfo = useSelector((store) => store.userInfo).toJS();
    const [data, setData] = useState();
    const [allMsg, setAll] = useState(0);
    const jump = useJump();
    const init = useCallback((type) => {
        type == 'refresh' && setRefreshing(true);
        http.get('/vision/index/20220215').then((res) => {
            setData(res.result);
            setRefreshing(false);
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
                            jump({path: 'SelectIdentity'});
                        }}>
                        <Image source={{uri: data?.part1?.user?.avatar}} style={styles.avatar} />
                        <Text style={styles.name}>{data?.part1?.user?.nickname || '昵称'}</Text>
                        <FontAwesome name={'angle-right'} color={Colors.defaultColor} size={18} />
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
                            {/* 推荐位 */}
                            <RecommendCard
                                style={{marginBottom: px(16)}}
                                data={data?.part2}
                                onPress={() => {
                                    global.LogTool('visionRecArticle', data?.part2);
                                }}
                            />
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
                                                    {item?.items?.map((_article, index) => {
                                                        return RenderCate(_article, {
                                                            marginBottom: px(12),
                                                            marginRight: px(12),
                                                        });
                                                    })}
                                                </View>
                                            </ScrollView>
                                        ) : (
                                            item?.items?.map((_article, index) => {
                                                return RenderCate(_article, {marginBottom: px(12)});
                                            })
                                        )}
                                    </View>
                                );
                            })}
                            <BottomDesc />
                        </LinearGradient>
                    ) : null}
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
        padding: px(16),
        paddingTop: px(4),
    },
});
