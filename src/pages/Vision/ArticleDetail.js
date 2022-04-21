/*
 * @Date: 2021-03-18 10:57:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-04-19 11:12:44
 * @Description: 文章详情
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {WebView as RNWebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import {px as text, deviceHeight, px, isIphoneX} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import {ShareModal, Modal} from '../../components/Modal';
import {SERVER_URL} from '../../services/config';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import LoginMask from '../../components/LoginMask';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../redux/actions/visionData.js';
import _ from 'lodash';
import RenderCate from './components/RenderCate.js';
import LinearGradient from 'react-native-linear-gradient';
import RenderTitle from './components/RenderTitle';
import PortfolioCard from '../../components/Portfolios/PortfolioCard.js';
import Picker from 'react-native-picker';
import Mask from '../../components/Mask.js';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Loading from '../Portfolio/components/PageLoading';
import useJump from '../../components/hooks/useJump.js';

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

const ArticleDetail = ({navigation, route}) => {
    const dispatch = useDispatch();
    const jump = useJump();
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const visionData = useSelector((store) => store.vision).toJS();
    const [recommendData, setRecommendData] = useState({});
    const netInfo = useNetInfo();
    const scrollRef = useRef(null);
    const [hasNet, setHasNet] = useState(true);
    const [showMask, setShowMask] = useState(false);
    const [showGoTop, setShowGoTop] = useState(false);
    const headerHeight = useHeaderHeight();
    const webviewRef = useRef(null);
    const [webviewHeight, setHeight] = useState(deviceHeight - headerHeight);
    const [data, setData] = useState({});
    const shareModal = useRef(null);
    const [more, setMore] = useState(false);
    const btnClick = useRef(true);
    const [scrollY, setScrollY] = useState(0);
    const [finishRead, setFinishRead] = useState(false);
    const timeRef = useRef(Date.now());
    const [finishLoad, setFinishLoad] = useState(false);
    const [favor_num, setFavorNum] = useState(0);
    const [favor_status, setFavorStatus] = useState(false);
    const [collect_status, setCollectStatus] = useState(false);
    const [collect_num, setCollectNum] = useState(0);
    const zanRef = useRef(null);
    const collectRef = useRef(null);
    const fr = route.params?.fr;
    const post_progress = useRef(false);
    // 滚动回调
    const onScroll = useCallback((event) => {
        const y = event.nativeEvent.contentOffset.y;
        setScrollY(y);
    }, []);
    const init = useCallback(
        (type) => {
            http.get('/community/article/status/20210101', {article_id: route.params?.article_id, fr}).then((res) => {
                if (res.code === '000000') {
                    setCollectNum(res.result.collect_num);
                    setCollectStatus(res.result.collect_status);
                    setFavorNum(res.result.favor_num);
                    setFavorStatus(res.result.favor_status);
                    setData(res.result);

                    setFinishRead(!!res.result.read_info?.done_status);
                }
            });
            http.get('/community/article/recommend/20210524', {id: route.params?.article_id, fr}).then((result) => {
                setRecommendData(result.result);
            });
        },
        [route, fr]
    );

    const onMessage = (event) => {
        const eventData = event.nativeEvent.data;
        if (eventData.indexOf('article_id') !== -1) {
            navigation.push('ArticleDetail', {article_id: eventData.split('article_id=')[1]});
        } else {
            if (eventData) {
                setFinishLoad(true);
                if (eventData == 'VoiceHearOut' && !finishRead) {
                    setFinishRead(true);
                    //听完音频
                    postProgress({
                        article_id: route.params?.article_id,
                        latency: Date.now() - timeRef.current,
                        done_status: 1,
                        article_progress: 100,
                    });
                    dispatch(
                        updateVision({
                            albumListendList: _.uniq(visionData?.albumListendList?.concat([route.params?.article_id])),
                        })
                    );
                } else if (eventData == 'AudioError') {
                    setShowMask(true);
                    Picker.init({
                        pickerTitleColor: [31, 36, 50, 1],
                        pickerTitleText: '音质反馈',
                        pickerCancelBtnText: '取消',
                        pickerConfirmBtnText: '确定',
                        pickerBg: [255, 255, 255, 1],
                        pickerToolBarBg: [249, 250, 252, 1],
                        pickerData: ['不能正常播放', '音质太差', '声音太小'],
                        pickerFontColor: [33, 33, 33, 1],
                        pickerRowHeight: 36,
                        pickerConfirmBtnColor: [0, 81, 204, 1],
                        pickerCancelBtnColor: [128, 137, 155, 1],
                        pickerTextEllipsisLen: 100,
                        wheelFlex: [1, 1],
                        onPickerCancel: () => setShowMask(false),
                        onPickerConfirm: (pickedValue, pickedIndex) => {
                            http.post('/community/feedback/20210701', {
                                resource_id: route.params?.article_id,
                                resource_type: 1,
                                option: parseInt(pickedIndex, 10) + 1,
                            }).then((res) => {
                                Toast.show(res.message);
                                if (res.code == '000000') {
                                    webviewRef.current?.injectJavaScript('window.onVoiceData();true;');
                                }
                            });
                            setShowMask(false);
                        },
                    });
                    Picker.show();
                }
                if (eventData * 1) {
                    setHeight(eventData * 1 || deviceHeight);
                }
            }
        }
    };
    const onFavor = useCallback(
        (type) => {
            if (!btnClick.current) {
                return false;
            }
            !favor_status && ReactNativeHapticFeedback.trigger('impactLight', options);
            setFavorNum((preNum) => {
                return favor_status ? --preNum : ++preNum;
            });
            setFavorStatus((pre_status) => {
                zanRef.current.play();
                return !pre_status;
            });

            btnClick.current = false;
            http.post('/community/favor/20210101', {
                resource_id: data?.id,
                resource_cate: 'article',
                action_type: favor_status ? 0 : 1,
            }).then((res) => {
                if (type !== 'normal') {
                    shareModal.current.toastShow(res.message);
                }
                setTimeout(() => {
                    btnClick.current = true;
                }, 100);
                if (res.code !== '000000') {
                    setTimeout(() => {
                        shareModal.current.hide();
                    }, 1000);
                }
            });
        },
        [data, favor_status]
    );
    const onCollect = useCallback(
        (type) => {
            if (!btnClick.current) {
                return false;
            }
            !collect_status && ReactNativeHapticFeedback.trigger('impactLight', options);
            setCollectNum((preNum) => {
                return collect_status ? --preNum : ++preNum;
            });
            setCollectStatus((pre_status) => {
                return !pre_status;
            });
            btnClick.current = false;
            http.post('/community/collect/20210101', {
                resource_id: data?.id,
                resource_cate: 'article',
                action_type: collect_status ? 0 : 1,
            }).then((res) => {
                if (type !== 'normal') {
                    shareModal.current.toastShow(res.message);
                }
                setTimeout(() => {
                    btnClick.current = true;
                }, 100);
                if (res.code !== '000000') {
                    setTimeout(() => {
                        shareModal.current.hide();
                    }, 1000);
                }
            });
        },
        [data, collect_status]
    );
    const postProgress = useCallback((params) => {
        http.post('/community/article/progress/20210101', params || {});
    }, []);
    const back = useCallback(() => {
        Picker.isPickerShow((res) => {
            if (res) {
                Picker.hide();
            }
        });
        let progress = parseInt((scrollY / (webviewHeight - deviceHeight + headerHeight)) * 100, 10);
        progress = progress > 100 ? 100 : progress;
        if (route?.params?.type !== 5 && route?.params?.type !== 2) {
            postProgress({
                article_id: route.params?.article_id,
                latency: Date.now() - timeRef.current,
                done_status: data?.read_info?.done_status || +finishRead,
                article_progress: progress,
                fr,
            });
        }
        // 提示弹窗
        if (route?.params?.type !== 5) {
            http.get('/community/article/popup/20220406', {
                article_id: route.params?.article_id,
                done_status: data?.read_info?.done_status || +finishRead,
                article_progress: progress,
            }).then((res) => {
                if (res.code === '000000') {
                    const result = res.result;
                    result &&
                        Modal.show({
                            title: result.title,
                            content: result.content,
                            confirmText: result.confirm?.text,
                            confirmCallBack: () => {
                                jump(result.confirm?.url);
                            },
                        });
                }
            });
        }
    }, [data, finishRead, headerHeight, postProgress, route, scrollY, webviewHeight, fr, jump]);
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackImage: () => {
                return (
                    <Icon
                        name={'close'}
                        size={24}
                        style={{marginLeft: Platform.select({ios: Space.marginAlign, android: 0})}}
                    />
                );
            },
            headerRight: () => {
                return hasNet ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setMore(route?.params?.type !== 5 ? true : false);
                            shareModal.current.show();
                        }}
                        style={[Style.flexCenter, styles.topRightBtn]}>
                        <Image source={require('../../assets/img/article/more.png')} style={styles.moreImg} />
                    </TouchableOpacity>
                ) : null;
            },
        });
    }, [navigation, hasNet, route]);
    useEffect(() => {
        if (route?.params?.type !== 5) {
            if (scrollY > 80) {
                navigation.setOptions({title: '文章内容'});
            } else {
                navigation.setOptions({title: ''});
            }
        }
    }, [navigation, scrollY, route]);
    useEffect(() => {
        //回到顶部
        if (scrollY > deviceHeight * 0.4) {
            setShowGoTop(true);
        } else {
            setShowGoTop(false);
        }
        if (scrollY > webviewHeight - deviceHeight + headerHeight && finishLoad && route?.params?.type !== 2) {
            setFinishRead((prev) => {
                if (!prev) {
                    if (route.params?.article_id) {
                        dispatch(
                            updateVision({readList: _.uniq(visionData.readList.concat([route.params?.article_id]))})
                        );
                    }
                }
                return true;
            });
            if (route.params?.article_id && !post_progress.current) {
                postProgress({
                    article_id: route.params?.article_id,
                    latency: Date.now() - timeRef.current,
                    done_status: 1,
                    article_progress: 100,
                    fr,
                });
                post_progress.current = true;
            }
        }
    }, [finishLoad, headerHeight, postProgress, route, scrollY, webviewHeight, dispatch, visionData, fr]);
    useEffect(() => {
        const listener = NetInfo.addEventListener((state) => {
            setHasNet(state.isConnected);
        });
        return () => listener();
    }, []);
    useEffect(() => {
        if (hasNet) {
            init();
        }
    }, [init, hasNet]);
    useEffect(() => {
        const listener = navigation.addListener('beforeRemove', back);
        return () => listener();
    }, [back, navigation]);
    const goTop = () => {
        global.LogTool('articleBackToTop', route.params?.article_id);
        scrollRef?.current?.scrollTo({x: 0, y: 0, animated: true});
    };
    const hidePicker = () => {
        Picker.hide();
        setShowMask(false);
    };
    return (
        <View style={[styles.container]}>
            {hasNet ? (
                <>
                    {showMask && <Mask onClick={hidePicker} />}
                    {showGoTop ? (
                        <TouchableOpacity onPress={goTop} activeOpacity={1} style={styles.goTop}>
                            <FastImage
                                source={require('../../assets/img/article/goTop.png')}
                                style={{width: text(44), height: text(44)}}
                            />
                        </TouchableOpacity>
                    ) : null}
                    <ScrollView
                        ref={scrollRef}
                        style={{flex: 1}}
                        onScroll={onScroll}
                        scrollIndicatorInsets={{right: 1}}
                        scrollEventThrottle={16}>
                        <ShareModal
                            ctrl={
                                route?.params?.type !== 5 ? `/article/${route.params?.article_id}` : route.params?.link
                            }
                            likeCallback={onFavor}
                            collectCallback={onCollect}
                            ref={shareModal}
                            more={more}
                            shareContent={{
                                favor_status: favor_status,
                                collect_status: collect_status,
                                ...data?.share_info,
                            }}
                            title={data?.title}
                            needLogin={!userInfo.is_login}
                        />
                        <RNWebView
                            javaScriptEnabled
                            onMessage={onMessage}
                            allowsFullscreenVideo={false}
                            allowsInlineMediaPlayback={true}
                            ref={webviewRef}
                            onLoadEnd={async () => {
                                webviewRef.current.postMessage(
                                    JSON.stringify({
                                        did: global.did,
                                    })
                                );
                                if (data.feedback_status == 1) {
                                    setTimeout(() => {
                                        webviewRef.current?.injectJavaScript('window.onVoiceData();true;');
                                    }, 800);
                                }
                            }}
                            scalesPageToFit={Platform.select({ios: true, android: false})}
                            source={{
                                uri: `${SERVER_URL[global.env].H5}/article/${route.params?.article_id}`,
                            }}
                            onError={(err) => {
                                console.log(err, 'object111');
                            }}
                            onHttpError={(err) => {
                                console.log(err, 'object');
                            }}
                            renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                            startInLoadingState
                            style={{height: webviewHeight}}
                            textZoom={100}
                        />
                        {finishLoad && Object.keys(data).length > 0 && (
                            <>
                                {route?.params?.type !== 5 ? (
                                    <>
                                        <Text style={[styles.footnote, {marginBottom: text(2)}]}>
                                            本文更新于{data?.edit_time}
                                        </Text>
                                        <Text style={styles.footnote}>著作权 为©理财魔方 所有，未经许可禁止转载</Text>
                                    </>
                                ) : null}
                                {route?.params?.type !== 5 ? (
                                    finishRead ? (
                                        <View style={[Style.flexCenter, styles.finishBox]}>
                                            <Image
                                                source={require('../../assets/img/article/finish.gif')}
                                                style={styles.finishImg}
                                            />
                                            <Text style={styles.finishText}>
                                                {route.params.type == 2 ? '您已听完' : '您已阅读完本篇文章'}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{height: text(161)}} />
                                    )
                                ) : (
                                    <View style={{height: text(20)}} />
                                )}
                                <View
                                    style={[
                                        Style.flexRow,
                                        {paddingBottom: Object.keys(recommendData).length > 0 ? 0 : text(64)},
                                    ]}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => onFavor('normal')}
                                        style={[Style.flexCenter, {flex: 1}]}>
                                        <LottieView
                                            ref={zanRef}
                                            loop={false}
                                            autoPlay
                                            source={
                                                favor_status
                                                    ? require('../../assets/animation/zanActive.json')
                                                    : require('../../assets/animation/zan.json')
                                            }
                                            style={{height: px(40), width: px(40), marginBottom: px(-4)}}
                                        />

                                        <Text style={styles.finishText}>{`点赞${favor_num >= 0 ? favor_num : 0}`}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => onCollect('normal')}
                                        style={[Style.flexCenter, {flex: 1}]}>
                                        <LottieView
                                            ref={collectRef}
                                            loop={false}
                                            autoPlay
                                            source={
                                                collect_status
                                                    ? require('../../assets/animation/collect.json')
                                                    : require('../../assets/animation/collectActive.json')
                                            }
                                            style={{height: px(40), width: px(40), marginBottom: px(-4)}}
                                        />

                                        <Text style={styles.finishText}>{`收藏${
                                            collect_num >= 0 ? collect_num : 0
                                        }`}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setMore(false);
                                            shareModal.current.show();
                                        }}
                                        style={[Style.flexCenter, {flex: 1, marginBottom: px(-10)}]}>
                                        <Image
                                            source={require('../../assets/img/article/share.png')}
                                            style={[
                                                styles.actionIcon,
                                                {width: px(20), height: px(20), marginBottom: px(4)},
                                            ]}
                                        />
                                        <Text style={styles.finishText}>{'分享'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {Object.keys(recommendData).length > 0 ? (
                                    <LinearGradient
                                        start={{x: 0, y: 0}}
                                        end={{x: 0, y: 0.2}}
                                        colors={['#fff', '#F5F6F8']}>
                                        <View style={{paddingHorizontal: text(16), paddingVertical: text(40)}}>
                                            <RenderTitle title={recommendData?.portfolios?.title} />
                                            {recommendData?.portfolios?.list?.map((item, index) => {
                                                return (
                                                    <PortfolioCard
                                                        data={item}
                                                        key={index}
                                                        style={{marginBottom: text(12)}}
                                                    />
                                                );
                                            })}
                                            <RenderTitle title={recommendData?.articles?.title} />
                                            {recommendData?.articles?.list?.map((item, index) => {
                                                return RenderCate(item, {marginBottom: text(12)}, 'article');
                                            })}
                                        </View>
                                    </LinearGradient>
                                ) : null}
                            </>
                        )}
                    </ScrollView>
                    {!userInfo.is_login && <LoginMask />}
                </>
            ) : (
                <>
                    <Empty
                        img={require('../../assets/img/emptyTip/noNetwork.png')}
                        text={'哎呀！网络出问题了'}
                        desc={'网络不给力，请检查您的网络设置'}
                        style={{paddingVertical: text(60)}}
                    />
                    <Button title={'刷新一下'} style={{marginHorizontal: text(20)}} onPress={refreshNetWork} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topRightBtn: {
        flex: 1,
        width: text(36),
        marginRight: Platform.select({ios: text(10), android: text(6)}),
    },
    moreImg: {
        width: text(30),
        height: text(30),
    },
    finishBox: {
        paddingTop: text(24),
        paddingBottom: text(40),
    },
    finishImg: {
        width: text(80),
        height: text(80),
        marginBottom: text(4),
    },
    finishText: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.lightBlackColor,
    },
    actionIcon: {
        width: text(40),
        height: text(40),
        marginBottom: text(-4),
    },
    footnote: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        paddingHorizontal: text(16),
        color: Colors.lightGrayColor,
    },
    goTop: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX ? 34 + px(40) : px(40),
        zIndex: 10,
    },
});

export default ArticleDetail;
