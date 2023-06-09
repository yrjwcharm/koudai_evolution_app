/*
 * @Date: 2021-12-06 14:17:56
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2022-04-18 10:40:31
 * @Description: 财富工具
 */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Easing,
    TextInput,
    Animated,
    View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Font, Style, Space} from '../../common/commonStyle';
import {useJump} from '../../components/hooks';
import Header from '../../components/NavBar';
import * as Animatable from 'react-native-animatable';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {deviceWidth, px} from '../../utils/appUtil';
import TextSwiper from './components/TextSwiper';
import HotRuler from './components/HotRuler';
import dayjs from 'dayjs';
import {Modal} from '../../components/Modal';
import FixedBtn from '../Portfolio/components/FixedBtn';

const LoadingComponent = () => {
    return (
        <View
            style={{
                paddingTop: Space.padding,
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                position: 'absolute',
                zIndex: 99,
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

const defaultItemsFinish = [false, false, false, false];
const WealthTools = () => {
    const insets = useSafeAreaInsets();
    const jump = useJump();
    const [pageLoading, updatePageLoading] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [hasOpen, updateHasOpen] = useState(false); // 工具列表中是否有一个是开启状态
    const [data, setData] = useState({});
    const [loadingData, setLoadingData] = useState({});
    const [gifLoaded, updategifLoaded] = useState(false);
    const [headImgLoaded, updateHeadImgLoaded] = useState(false);
    const [loadItemsFinish, setLoadItemsFinish] = useState(defaultItemsFinish);
    const [linearColors, setLinearColors] = useState([]);
    const [loadingFinish, setLoadingFinish] = useState(false);
    const now = useRef(dayjs().format('YYYY/MM/DD HH:mm'));
    const rate = useRef(null);
    const topPartRateRef = useRef(null);
    const topPartHintRef = useRef(null);
    const bottomPartOfLoadingRef = useRef(null);
    const bottomPartOnOpenRef = useRef(null);
    const getReadyStart = useMemo(() => {
        return hasOpen ? !!(rate.current && gifLoaded) : headImgLoaded;
    }, [gifLoaded, rate, hasOpen, headImgLoaded]);

    const init = useCallback(() => {
        updatePageLoading(true);
        let rateListener = null;
        http.get('/tool/manage/detail/20211207').then(async (res) => {
            try {
                setData(res.result);
                if (rate.current) return updatePageLoading(false); // 防止跳回时依旧加载动画
                const hasOpenState = !!res.result.open_list;
                updateHasOpen(hasOpenState);

                // 如果有开启的工具
                if (hasOpenState) {
                    let loadingDataRes = await http.get('/tool/open/animation/detail/20220221');

                    setLinearColors(['#2557F5', '#F5F6F8']);
                    setLoadingData(loadingDataRes.result);

                    //  rate increase anmation
                    rate.current = new Animated.Value(0);
                    rateListener = rate.current.addListener(({value}) => {
                        value = Math.round(value);
                        // 依次选择
                        if (value % 25 === 0) {
                            let level = value / 25;
                            setLoadItemsFinish(defaultItemsFinish.map((_) => level-- > 0));
                        }
                        topPartRateRef.current?.setNativeProps({text: value + '%'});
                        if (value === 90) {
                            // loading动画完成
                            bottomPartOfLoadingRef?.current
                                ?.animate('fadeOutUp')
                                .then(() => {
                                    setLinearColors([['#2B7AF3', '#E74949'][res.result?.head_data?.status], '#F5F6F8']);
                                    setLoadingFinish(true);
                                })
                                .then(() => {
                                    bottomPartOnOpenRef?.current.animate('fadeInUp');
                                });
                        }
                        if (value === 100) {
                            rate.current.removeListener(rateListener);
                        }
                    });
                }

                updatePageLoading(false);
            } catch (error) {
                console.log(error);
            }
        });

        return () => rate.current?.removeListener?.(rateListener);
    }, []);
    useFocusEffect(init);

    const btns = useMemo(() => {
        let btnData = data.bottom_data;
        if (!btnData) return [];
        btnData.button.title = btnData.button.text;
        return [btnData.consult, btnData.button];
    }, [data.bottom_data]);

    useEffect(() => {
        // rate animate start
        getReadyStart &&
            rate.current &&
            Animated.timing(rate.current, {
                toValue: 100,
                duration: 2000,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease),
            }).start();
    }, [getReadyStart]);

    const jumpToolDetail = (url) => {
        jump(url);
    };

    const closeToolItem = (item, idx) => {
        const waitOpen = !!item.tip;
        return (
            <View
                key={idx}
                style={{backgroundColor: '#fff', width: px(343), borderRadius: px(8), marginTop: px(idx > 0 ? 12 : 0)}}>
                <TouchableOpacity
                    activeOpacity={waitOpen ? 0.3 : 0.8}
                    style={[styles.toolItemOnNotOpen, {opacity: waitOpen ? 0.3 : 1}]}
                    onPress={() => {
                        if (waitOpen) {
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
                            }
                        } else {
                            jump(item.button.url);
                        }
                    }}>
                    <View style={styles.tionoLeft}>
                        <Image source={{uri: item.icon}} style={{width: px(44), height: px(44)}} />
                        <View style={styles.tionoText}>
                            <Text style={styles.tionoTextTop}>{item.title}</Text>
                            <Text style={styles.tionoTextBottom}>{item?.state_info?.value}</Text>
                        </View>
                    </View>
                    {item.button && (
                        <View style={styles.tionoRight}>
                            <TouchableHighlight
                                onPress={() => {
                                    jump(item.button.url);
                                }}
                                activeOpacity={0.85}
                                underlayColor={waitOpen ? '' : '#D14040'}
                                style={[
                                    Style.flexCenter,
                                    {
                                        borderRadius: px(16),
                                        backgroundColor: Colors.red,
                                        paddingVertical: px(7),
                                        paddingHorizontal: px(12),
                                        height: px(32),
                                    },
                                    waitOpen && {
                                        backgroundColor: '#fff',
                                        borderColor: Colors.lightGrayColor,
                                        borderWidth: 0.5,
                                    },
                                ]}
                                disabled={waitOpen}>
                                <Text
                                    style={{
                                        fontSize: px(13),
                                        fontWeight: '600',
                                        lineHeight: px(18),
                                        color: waitOpen ? Colors.lightGrayColor : '#fff',
                                    }}>
                                    {item.button.text}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };
    const openToolItem = (item, idx) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={idx}
                onPress={() => {
                    global.LogTool('toolCard', item?.tool_id);
                    jumpToolDetail(item?.state_info?.button?.url || item?.url);
                }}
                style={[styles.toolItemOnOpen, {marginTop: px(idx > 0 ? 12 : 0)}]}>
                <View style={styles.toolItemHeaderOnOpen}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={{uri: item.icon}} style={styles.toolItemHeaderLeftIconOnOpen} />
                        <Text style={styles.toolItemHeaderLeftTextOnOpen}>{item.title}</Text>
                    </View>
                    <Text style={styles.toolItemHeaderRightOnOpen}>{now.current}更新</Text>
                </View>
                <View style={styles.toolItemContentOnOpen}>
                    <View>
                        <Text style={styles.toolItemContentLeftDescOnOpen}>{item?.state_info?.value_tip}</Text>
                        <Text
                            style={[
                                styles.toolItemContentLeftDegreeOnOpen,
                                data?.head_data?.status && {color: '#E74949'},
                                {textAlign: 'left'},
                            ]}>
                            {item?.state_info?.value}
                        </Text>
                    </View>
                    <View style={styles.toolItemContentRightOnOpen}>
                        {item.state_info?.chart && (
                            <HotRuler {...item.state_info?.chart} isLevel={item?.tool_id == 'risk_change'} />
                        )}
                    </View>
                </View>
                {item.state_info?.button && (
                    <View style={styles.btnWrapperOfToolItem}>
                        <TouchableOpacity
                            style={[
                                styles.btnOfToolItem,
                                {
                                    backgroundColor: item.state_info?.chart?.marks?.theme,
                                },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => jumpToolDetail(item?.state_info?.button?.url)}>
                            <Text style={styles.btnTextOfToolItem}>{item?.state_info?.button?.text}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const userData = () => {
        return (
            <View style={styles.userData}>
                <Text style={styles.userDataTitle}>{'用户数据'}</Text>
                <View style={styles.userDataContent}>
                    <Text style={styles.udContentTitle}>{data?.user_data?.total_amount?.desc}</Text>
                    <Text style={styles.udContentMoney}>{data?.user_data?.total_amount?.amount}</Text>
                    <Text style={styles.udContentDesc}>
                        {data?.user_data?.all_amount?.desc}
                        <Text style={styles.udContentDescMoney}> {data?.user_data?.all_amount?.amount}</Text>
                    </Text>
                    <View style={{marginTop: px(24), width: px(311), overflow: 'hidden'}}>
                        <TextSwiper
                            list={data?.user_data?.latest_records?.list?.filter((_, idx) => idx % 2 === 0)}
                            speed={1500}
                        />
                        <TextSwiper
                            style={{marginTop: px(12)}}
                            list={data?.user_data?.latest_records?.list?.filter((_, idx) => idx % 2 !== 0)}
                            speed={1000}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return pageLoading ? (
        <Loading />
    ) : (
        <>
            {!getReadyStart && <LoadingComponent />}
            <View
                style={[
                    styles.container,
                    {
                        opacity: getReadyStart ? 1 : 0,
                    },
                ]}>
                <Header
                    leftIcon="chevron-left"
                    title={hasOpen ? '财富工具' : ''}
                    fontStyle={{
                        color: hasOpen && scrollY > 0 ? Colors.defaultFontColor : '#fff',
                    }}
                    style={{
                        opacity: 1,
                        width: deviceWidth,
                        backgroundColor: hasOpen && scrollY > 0 ? '#fff' : 'transparent',
                        position: 'absolute',
                    }}
                />
                <ScrollView
                    bounces={false}
                    onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
                    scrollEventThrottle={16}
                    scrollIndicatorInsets={{right: 1}}
                    style={{flex: 1}}>
                    {!hasOpen ? (
                        <>
                            {/* 当hasOpen为false时的上半部分 */}
                            <View>
                                <Image
                                    style={{width: '100%', height: px(279)}}
                                    source={{uri: data?.img}}
                                    onLoadEnd={() => {
                                        updateHeadImgLoaded(true);
                                    }}
                                />
                            </View>
                            {/* 当hasOpen为false时的工具列表 */}
                            <View style={styles.toolListOnNotOpen}>
                                {data?.close_list?.map((item, idx) => closeToolItem(item, idx))}
                            </View>
                        </>
                    ) : (
                        <>
                            {/* 当hasOpen为true时的上部分 */}
                            <LinearGradient
                                style={[
                                    styles.topPartOnOpen,
                                    {
                                        height: px(loadingFinish ? 283 : 356),
                                    },
                                ]}
                                colors={linearColors}
                                start={{x: 0, y: 0.82}}
                                end={{x: 0, y: 1}}>
                                <View style={{paddingTop: insets.top + px(44)}}>
                                    {loadingFinish ? (
                                        <Animatable.View
                                            ref={(e) => (topPartHintRef.current = e)}
                                            duration={800}
                                            animation="fadeIn"
                                            style={{marginTop: px(18)}}>
                                            <Text
                                                style={{
                                                    fontSize: px(32),
                                                    fontWeight: '600',
                                                    lineHeight: px(34),
                                                    color: '#fff',
                                                    textAlign: 'center',
                                                }}>
                                                {data?.head_data?.title}
                                            </Text>
                                            {data?.head_data?.desc.map((item, idx) => (
                                                <Text
                                                    key={idx}
                                                    style={{
                                                        fontSize: px(12),
                                                        fontWeight: '300',
                                                        lineHeight: px(17),
                                                        color: 'rgba(245, 246, 248, 0.58);',
                                                        textAlign: 'center',
                                                        marginTop: px(idx === 0 ? 12 : 0),
                                                    }}>
                                                    {item}
                                                </Text>
                                            ))}
                                        </Animatable.View>
                                    ) : (
                                        <View style={[Style.flexRowCenter, {marginTop: px(18)}]}>
                                            <Image
                                                onLoadEnd={() => {
                                                    updategifLoaded(true);
                                                }}
                                                style={{width: px(176), height: px(178)}}
                                                source={{uri: loadingData?.settings_gif}}
                                            />
                                            <TextInput
                                                editable={false}
                                                ref={(e) => (topPartRateRef.current = e)}
                                                style={styles.topPartRate}
                                            />
                                        </View>
                                    )}
                                </View>
                            </LinearGradient>
                            {/* loading动画的选项列表 */}
                            {loadingFinish ? null : (
                                <Animatable.View
                                    ref={(e) => (bottomPartOfLoadingRef.current = e)}
                                    duration={800}
                                    style={styles.bottomPartOfLoading}>
                                    {loadingData?.checking_data?.map((item, idx) => {
                                        return (
                                            <View
                                                key={idx}
                                                style={[styles.bpolItem, {marginTop: px(idx > 0 ? 12 : 0)}]}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Image
                                                        style={{width: px(32), height: px(32)}}
                                                        source={{
                                                            uri: item.img,
                                                        }}
                                                    />
                                                    <Text style={styles.bpolItemText}>{item.desc}</Text>
                                                </View>
                                                <View>
                                                    {loadItemsFinish[idx] ? (
                                                        <Image
                                                            style={{width: px(20), height: px(20)}}
                                                            source={{uri: loadingData?.checked_img}}
                                                        />
                                                    ) : (
                                                        <Animatable.Image
                                                            animation={{
                                                                0: {
                                                                    transform: [{rotate: '0deg'}],
                                                                },
                                                                1: {
                                                                    transform: [{rotate: '360deg'}],
                                                                },
                                                            }}
                                                            easing="linear"
                                                            duration={800}
                                                            iterationCount="infinite"
                                                            style={{width: px(20), height: px(20)}}
                                                            source={{
                                                                uri: loadingData?.unchecked_img,
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </Animatable.View>
                            )}
                        </>
                    )}
                    <Animatable.View ref={(e) => (bottomPartOnOpenRef.current = e)} duration={1000}>
                        {/* hasOpen为true时的工具列表 */}
                        {hasOpen && loadingFinish && (
                            <View style={styles.toolListOnOpen}>
                                {data?.open_list?.map((item, idx) => {
                                    return openToolItem(item, idx);
                                })}
                                <View style={{marginTop: px(12)}}>
                                    {data?.close_list?.map((item, idx) => {
                                        return closeToolItem(item, idx);
                                    })}
                                </View>
                            </View>
                        )}
                        {/* 用户数据 */}
                        {data?.user_data && (hasOpen ? loadingFinish : !loadingFinish) && userData()}
                    </Animatable.View>
                </ScrollView>
                {data?.bottom_data && (loadingFinish || !hasOpen) && <FixedBtn btns={btns} />}
            </View>
        </>
    );
};
export default WealthTools;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    toolListOnNotOpen: {
        marginTop: px(-71),
        alignItems: 'center',
        backgroundColor: Colors.bgColor,
        width: px(343),
        alignSelf: 'center',
        borderRadius: px(8),
    },
    toolItemOnNotOpen: {
        paddingHorizontal: px(16),
        paddingVertical: px(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tionoLeft: {
        flexDirection: 'row',
    },
    topPartOnOpen: {},
    topPartRate: {
        fontSize: px(14),
        color: '#FFFFFF',
        lineHeight: px(21),
        textAlign: 'center',
        position: 'absolute',
        bottom: px(60),
    },
    bottomPartOfLoading: {
        marginTop: px(-58),
        width: '100%',
        alignItems: 'center',
    },
    bpolItem: {
        width: px(343),
        backgroundColor: '#fff',
        borderRadius: px(6),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: px(16),
        paddingVertical: px(18),
    },
    bpolItemText: {
        marginLeft: px(11),
        fontSize: px(16),
        fontWeight: '500',
        color: Colors.defaultFontColor,
    },
    tionoText: {
        marginLeft: px(12),
    },
    tionoTextTop: {
        fontSize: px(16),
        fontWeight: '500',
        color: Colors.defaultFontColor,
        lineHeight: px(22),
    },
    tionoTextBottom: {
        marginTop: px(2),
        fontSize: px(12),
        color: '#545968',
        lineHeight: px(17),
    },
    tionoRight: {},
    userData: {
        marginVertical: px(20),
        alignItems: 'center',
        width: '100%',
    },
    userDataTitle: {
        width: px(343),
        fontSize: px(16),
        fontWeight: '500',
        color: Colors.defaultFontColor,
        lineHeight: px(22),
    },
    userDataContent: {
        marginTop: px(12),
        width: px(343),
        backgroundColor: '#fff',
        borderRadius: px(6),
        alignItems: 'center',
        paddingTop: px(20),
        paddingBottom: px(24),
        paddingHorizontal: px(16),
        overflow: 'hidden',
    },
    udContentTitle: {
        fontSize: px(16),
        fontWeight: '500',
        color: Colors.defaultFontColor,
        lineHeight: px(22),
    },
    udContentMoney: {
        marginTop: px(8),
        fontFamily: Font.numFontFamily,
        // fontWeight: 'bold',
        color: Colors.red,
        // lineHeight: px(36),
        fontSize: px(36),
    },
    udContentDesc: {
        marginTop: px(12),
        fontSize: px(14),
        color: Colors.defaultFontColor,
        lineHeight: px(20),
    },
    udContentDescMoney: {
        color: Colors.red,
    },

    toolListOnOpen: {
        width: px(343),
        alignSelf: 'center',
        marginTop: px(-90),
        backgroundColor: Colors.bgColor,
        borderRadius: px(8),
    },
    toolItemOnOpen: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        borderRadius: px(8),
    },
    toolItemHeaderOnOpen: {
        paddingTop: px(17),
        paddingBottom: px(14),
        borderBottomWidth: px(1),
        borderColor: Colors.borderColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toolItemHeaderLeftIconOnOpen: {
        width: px(16),
        height: px(16),
    },
    toolItemHeaderLeftTextOnOpen: {
        fontSize: px(14),
        fontWeight: '500',
        color: Colors.defaultFontColor,
        lineHeight: px(20),
        marginLeft: px(6),
    },
    toolItemHeaderRightOnOpen: {
        fontWeight: '300',
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9AA1B2',
    },
    toolItemContentOnOpen: {
        paddingVertical: px(23),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toolItemContentLeftDescOnOpen: {
        fontWeight: '300',
        fontSize: px(12),
        textAlign: 'center',
        lineHeight: px(17),
        color: Colors.descColor,
    },

    toolItemContentLeftDegreeOnOpen: {
        marginTop: px(4),
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.defaultColor,
        lineHeight: px(30),
        fontSize: px(26),
        fontFamily: Font.numFontFamily,
    },
    toolItemContentRightOnOpen: {
        paddingHorizontal: px(15),
        width: px(185),
    },
    btnWrapperOfToolItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: px(20),
    },
    btnOfToolItem: {
        width: px(180),
        borderRadius: px(20),
        paddingVertical: px(10),
    },
    btnTextOfToolItem: {
        textAlign: 'center',
        fontSize: px(14),
        fontWeight: '600',
        color: '#fff',
        lineHeight: px(20),
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
});
