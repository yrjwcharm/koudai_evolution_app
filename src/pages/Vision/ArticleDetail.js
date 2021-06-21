/*
 * @Date: 2021-03-18 10:57:45
 * @Author: dx
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-21 11:47:14
 * @Description: 文章详情
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {WebView as RNWebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import {px as text, deviceHeight} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import {ShareModal} from '../../components/Modal';
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
const ArticleDetail = ({navigation, route}) => {
    const dispatch = useDispatch();
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const visionData = useSelector((store) => store.vision).toJS();
    const [recommendData, setRecommendData] = useState({});
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(true);
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
    const isArticle = useRef(route.params?.is_article !== undefined ? route.params?.is_article : true);

    // 滚动回调
    const onScroll = useCallback((event) => {
        const y = event.nativeEvent.contentOffset.y;
        setScrollY(y);
    }, []);
    const init = useCallback(() => {
        http.get('/community/article/status/20210101', {article_id: route.params?.article_id}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
                setFinishRead(!!res.result.read_info?.done_status);
            }
        });
        http.get('/community/article/recommend/20210524', {id: route.params?.article_id}).then((result) => {
            setRecommendData(result.result);
        });
    }, [route]);

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
                }
            }
            setHeight(eventData * 1 || deviceHeight);
        }
    };
    const onFavor = useCallback(
        (type) => {
            if (!btnClick.current) {
                return false;
            }
            btnClick.current = false;
            http.post('/community/favor/20210101', {
                resource_id: data?.id,
                resource_cate: 'article',
                action_type: data?.favor_status ? 0 : 1,
            }).then((res) => {
                if (type === 'normal') {
                    Toast.show(res.message);
                } else {
                    shareModal.current.toastShow(res.message);
                }
                setTimeout(() => {
                    btnClick.current = true;
                }, 2000);
                if (res.code === '000000') {
                    init();
                } else {
                    setTimeout(() => {
                        shareModal.current.hide();
                    }, 1000);
                }
            });
        },
        [data, init]
    );
    const onCollect = useCallback(
        (type) => {
            if (!btnClick.current) {
                return false;
            }
            btnClick.current = false;
            http.post('/community/collect/20210101', {
                resource_id: data?.id,
                resource_cate: 'article',
                action_type: data?.collect_status ? 0 : 1,
            }).then((res) => {
                if (type === 'normal') {
                    Toast.show(res.message);
                } else {
                    shareModal.current.toastShow(res.message);
                }
                setTimeout(() => {
                    btnClick.current = true;
                }, 2000);
                if (res.code === '000000') {
                    init();
                } else {
                    setTimeout(() => {
                        shareModal.current.hide();
                    }, 1000);
                }
            });
        },
        [data, init]
    );
    const postProgress = useCallback((params) => {
        http.post('/community/article/progress/20210101', params || {});
    }, []);
    const back = useCallback(() => {
        if (isArticle.current && route?.params?.type !== 2) {
            let progress = parseInt((scrollY / (webviewHeight - deviceHeight + headerHeight)) * 100, 10);
            progress = progress > 100 ? 100 : progress;
            postProgress({
                article_id: route.params?.article_id,
                latency: Date.now() - timeRef.current,
                done_status: data?.read_info?.done_status || +finishRead,
                article_progress: progress,
            });
        }
    }, [data, finishRead, headerHeight, postProgress, route, scrollY, webviewHeight]);
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
                            setMore(isArticle.current ? true : false);
                            shareModal.current.show();
                        }}
                        style={[Style.flexCenter, styles.topRightBtn]}>
                        <Image source={require('../../assets/img/article/more.png')} style={styles.moreImg} />
                    </TouchableOpacity>
                ) : null;
            },
        });
    }, [navigation, hasNet]);
    useEffect(() => {
        if (isArticle.current) {
            if (scrollY > 80) {
                navigation.setOptions({title: '文章内容'});
            } else {
                navigation.setOptions({title: ''});
            }
        }
    }, [navigation, scrollY]);
    useEffect(() => {
        if (scrollY > webviewHeight - deviceHeight + headerHeight && finishLoad && route?.params?.type !== 2) {
            setFinishRead((prev) => {
                if (!prev) {
                    if (route.params?.article_id) {
                        dispatch(
                            updateVision({readList: _.uniq(visionData.readList.concat([route.params?.article_id]))})
                        );
                    }
                    postProgress({
                        article_id: route.params?.article_id,
                        latency: Date.now() - timeRef.current,
                        done_status: 1,
                        article_progress: 100,
                    });
                }
                return true;
            });
        }
    }, [finishLoad, headerHeight, postProgress, route, scrollY, webviewHeight, dispatch, visionData]);
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

    return (
        <View style={[styles.container]}>
            {hasNet ? (
                <>
                    <ScrollView
                        style={{flex: 1}}
                        onScroll={onScroll}
                        scrollIndicatorInsets={{right: 1}}
                        scrollEventThrottle={16}>
                        <ShareModal
                            ctrl={isArticle.current ? `/article/${route.params?.article_id}` : route.params?.link}
                            likeCallback={onFavor}
                            collectCallback={onCollect}
                            ref={shareModal}
                            more={more}
                            shareContent={{
                                favor_status: data?.favor_status,
                                collect_status: data?.collect_status,
                                ...data?.share_info,
                            }}
                            title={data?.title}
                            needLogin={!userInfo.is_login}
                        />
                        <RNWebView
                            javaScriptEnabled
                            onMessage={onMessage}
                            // originWhitelist={['*']}
                            ref={webviewRef}
                            scalesPageToFit={Platform.select({ios: true, android: false})}
                            source={{
                                uri: isArticle.current
                                    ? `${SERVER_URL[global.env].H5}/article/${route.params?.article_id}`
                                    : `${SERVER_URL[global.env].H5}${route.params?.link}`,
                            }}
                            startInLoadingState
                            style={{height: webviewHeight}}
                        />
                        {finishLoad && isArticle.current && Object.keys(data).length > 0 && (
                            <>
                                <Text
                                    style={[
                                        styles.finishText,
                                        {color: Colors.lightGrayColor, padding: Space.padding},
                                    ]}>{`本文更新于${data?.edit_time} · 著作权 为©理财魔方 所有，未经许可禁止转载`}</Text>
                                {finishRead ? (
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
                                        <Image
                                            source={
                                                data?.favor_status
                                                    ? require('../../assets/img/article/bigZanActive.png')
                                                    : require('../../assets/img/article/bigZan.png')
                                            }
                                            style={styles.actionIcon}
                                        />
                                        <Text style={styles.finishText}>{`点赞${
                                            data?.favor_num >= 0 ? data?.favor_num : 0
                                        }`}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => onCollect('normal')}
                                        style={[Style.flexCenter, {flex: 1}]}>
                                        <Image
                                            source={
                                                data?.collect_status
                                                    ? require('../../assets/img/article/collectActive.png')
                                                    : require('../../assets/img/article/collect.png')
                                            }
                                            style={styles.actionIcon}
                                        />
                                        <Text style={styles.finishText}>{`收藏${
                                            data?.collect_num >= 0 ? data?.collect_num : 0
                                        }`}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setMore(false);
                                            shareModal.current.show();
                                        }}
                                        style={[Style.flexCenter, {flex: 1}]}>
                                        <Image
                                            source={require('../../assets/img/article/share.png')}
                                            style={styles.actionIcon}
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
                                                return <PortfolioCard data={item} style={{marginBottom: text(12)}} />;
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
        width: text(20),
        height: text(20),
        marginBottom: text(4),
    },
});

export default ArticleDetail;
