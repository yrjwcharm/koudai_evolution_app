/* eslint-disable radix */
/*
 * @Date: 2021-03-18 10:57:45
 * @Description: 文章详情
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import {WebView as RNWebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import {px as text, deviceHeight, px, isIphoneX, compareVersion} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import {Modal, PageModal, ShareModal} from '../../components/Modal';
import {SERVER_URL} from '../../services/config';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
import LoginMask from '../../components/LoginMask';
import {useSelector, useDispatch} from 'react-redux';
import {updateVision} from '../../redux/actions/visionData.js';
import _ from 'lodash';
import RenderCate from './components/RenderCate.js';
import Picker from 'react-native-picker';
import Mask from '../../components/Mask.js';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Loading from '../Portfolio/components/PageLoading';
import RenderInteract from './components/RenderInteract';
import CommentItem from './components/CommentItem.js';
import useJump from '../../components/hooks/useJump.js';
import TrackPlayer, {useProgress, Event} from 'react-native-track-player';
import {useOnTogglePlayback} from '../Community/components/audioService/useOnTogglePlayback.js';
import {startAudio} from '../Community/components/audioService/StartAudioService.js';
import {updateUserInfo} from '~/redux/actions/userInfo.js';
import ProductCards from '~/components/Portfolios/ProductCards.js';
import {AlbumCard} from '~/components/Product';
import {CommunityCard} from '../Community/components/CommunityCard';
import Storage from '~/utils/storage.js';
import {useIsFocused} from '@react-navigation/native';
import LogView from '~/components/LogView';
const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

const ArticleDetail = ({navigation, route}) => {
    const dispatch = useDispatch();
    const userInfo = useSelector((store) => store.userInfo)?.toJS();
    const visionData = useSelector((store) => store.vision).toJS();
    const [recommendData, setRecommendData] = useState({});
    const {articles, portfolios, series} = recommendData;
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
    const [commentData, setCommentData] = useState({});
    const inputModal = useRef();
    const inputRef = useRef();
    const [content, setContent] = useState('');
    const zanRef = useRef(null);
    const collectRef = useRef(null);
    const fr = route.params?.fr;
    const post_progress = useRef(false);
    const inputMaxLength = 500;
    const jump = useJump();
    const {position} = useProgress();
    const {isPlaying} = useOnTogglePlayback();
    const isCurrentArticleAudio = useRef(false);
    const audioMedia = useRef([]);
    const timeStamp = useRef(Date.now());
    const current_artic_url = useRef();
    const focus = useIsFocused();
    const [canUp, setCanUp] = useState(1);
    const setAudio = async (audioList) => {
        let current_track = await TrackPlayer.getTrack(0);
        let tmp = audioList.filter((audio) => audio.media_id == current_track.media_id);
        if (tmp.length > 0) {
            isCurrentArticleAudio.current = true;
            dispatch(updateUserInfo({showAudioModal: ''}));
        } else {
            isCurrentArticleAudio.current = false;
        }
    };
    useEffect(() => {
        TrackPlayer.addEventListener(Event.RemotePause, () => {
            webviewRef?.current?.injectJavaScript(`window.audioPause() `);
        });
        TrackPlayer.addEventListener(Event.RemotePlay, () => {
            webviewRef?.current?.injectJavaScript(`window.audioPlay()`);
        });
        TrackPlayer.addEventListener(Event.RemoteSeek, ({position: value}) => {
            webviewRef?.current?.injectJavaScript(`window.changeAudioTime(${value},'rn')`);
        });
    }, []);

    // 滚动回调
    const onScroll = useCallback((event) => {
        const y = event.nativeEvent.contentOffset.y;
        setScrollY(y);
    }, []);
    const init = useCallback((type) => {
        http.get('/community/article/status/20210101', {article_id: route.params?.article_id, fr}).then((res) => {
            if (res.code === '000000') {
                setCanUp(res.result?.keep_top_info?.can_up);
                setCollectNum(res.result.collect_num);
                setCollectStatus(res.result.collect_status);
                setFavorNum(res.result.favor_num);
                setFavorStatus(res.result.favor_status);
                setData(res.result);
                setFinishRead(!!res.result.read_info?.done_status);
            }
        });
        http.get('/community/article/20210101', {
            article_id: route.params?.article_id,
            fr,
        }).then((res) => {
            if (res.code === '000000') {
                const {media_list = [], current_article_url} = res?.result;
                current_artic_url.current = current_article_url;
                audioMedia.current = media_list.filter((audio) => audio.media_type == 'audio');
                setAudio(audioMedia.current);
            }
        });
        http.get('/community/article/recommend/20210524', {id: route.params?.article_id, fr}).then((result) => {
            setRecommendData(result.result);
        });
        userInfo.is_login &&
            http
                .get('/community/article/comment/list/20210101', {article_id: route.params?.article_id, page: 1})
                .then((res) => {
                    setCommentData(res.result);
                });
    }, []);
    const onMessage = (event) => {
        const eventData = event.nativeEvent.data;
        if (eventData.indexOf('audioPlay') > -1 && audioMedia.current.length > 0 && focus) {
            let media_id = eventData.split('+')[1];
            let currentAudioMedia =
                audioMedia.current.find((audio) => audio.media_id == media_id) || audioMedia.current[0];
            if (currentAudioMedia) {
                startAudio(currentAudioMedia);
                if (userInfo?.showAudioModal) {
                    dispatch(updateUserInfo({showAudioModal: ''}));
                }
            }
        } else if (eventData == 'audioPause') {
            TrackPlayer.pause();
        } else if (eventData.indexOf('changeAudioTime') > -1) {
            let _posi = eventData.split(':')[1];
            if (_posi) {
                TrackPlayer.seekTo(parseInt(_posi));
            }
        } else if (eventData?.indexOf?.('url=') > -1) {
            const url = JSON.parse(eventData.split('url=')[1] || '{}');
            url?.path && jump(url, ['CommunityHome', 'CommunityPersonalHome'].includes(url.path) ? 'push' : 'navigate');
        }

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
            global.LogTool({event: favor_status ? 'cancel_like' : 'content_thumbs', oid: data?.id});
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
                        shareModal.current?.hide();
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
            global.LogTool({event: collect_status ? 'cancel_collection' : 'content_collection', oid: data?.id});
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
                        shareModal.current?.hide();
                    }, 1000);
                }
            });
        },
        [data, collect_status]
    );
    //文章置顶
    const onArticeUp = () => {
        setCanUp((pre) => {
            return pre == 0 ? 1 : 0;
        });
        http.post('community/article/keep_top/20221215', {article_id: route.params?.article_id, can_up: canUp}).then(
            () => {
                shareModal.current.toastShow(canUp == 0 ? '取消置顶' : '置顶成功');
            }
        );
    };
    const postProgress = useCallback(async (params) => {
        http.post('/community/article/progress/20210101', params || {}).then((res) => {
            if (res.code == '000000' && res.result?.add_rational_num > 0) {
                Toast.show('理性值+' + res.result.add_rational_num);
            }
        });
    }, []);
    const back = useCallback(() => {
        if (audioMedia.current) {
            dispatch(updateUserInfo({showAudioModal: current_artic_url.current}));
        }

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
        if (route?.params?.comment_id) {
            setTimeout(() => {
                navigation.navigate('ArticleCommentList', {
                    comment_id: route?.params?.comment_id,
                    article_id: route?.params?.article_id,
                });
            }, 500);
        }
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
            setFinishRead(true);
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
    const handelComment = (show_modal) => {
        navigation.navigate('ArticleCommentList', {article_id: route.params?.article_id, show_modal});
    };
    //发布评论
    const publish = () => {
        http.post('/community/article/comment/add/20210101', {article_id: route.params?.article_id, content}).then(
            (res) => {
                if (res.code == '000000') {
                    global.LogTool({event: 'content_comment', oid: route.params?.article_id});
                    inputModal.current.cancel();
                    setContent('');
                    Modal.show({
                        title: '提示',
                        content: res.result.message,
                    });
                } else {
                    Toast.show(res.message);
                }
            }
        );
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
                    <ShareModal
                        ctrl={route?.params?.type !== 5 ? `/article/${route.params?.article_id}` : route.params?.link}
                        likeCallback={onFavor}
                        collectCallback={onCollect}
                        articelUpCallback={onArticeUp}
                        ref={shareModal}
                        more={more}
                        shareCallback={(share_to) =>
                            global.LogTool({ctrl: share_to, event: 'content_share', oid: data?.id})
                        }
                        shareContent={{
                            favor_status: favor_status,
                            collect_status: collect_status,
                            can_up: canUp,
                            ...data?.share_info,
                        }}
                        can_up={canUp}
                        title={data?.title}
                        needLogin={!userInfo.is_login}
                    />
                    <LogView.Wrapper
                        ref={scrollRef}
                        style={{flex: 1}}
                        onScroll={onScroll}
                        scrollIndicatorInsets={{right: 1}}
                        scrollEventThrottle={100}>
                        <View>
                            <RNWebView
                                javaScriptEnabled
                                onMessage={onMessage}
                                allowsFullscreenVideo={false}
                                allowsInlineMediaPlayback={true}
                                ref={webviewRef}
                                onLoadEnd={async () => {
                                    setTimeout(() => {
                                        if (isCurrentArticleAudio.current && position) {
                                            if (isPlaying) {
                                                webviewRef.current?.injectJavaScript(
                                                    `window.changeAudioTime(${position},'rn');window.audioPlay();true;`
                                                );
                                            } else {
                                                webviewRef.current?.injectJavaScript(
                                                    `window.changeAudioTime(${position},'rn');true;`
                                                );
                                            }
                                        }
                                    }, 500);
                                    const loginStatus = await Storage.get('loginStatus');
                                    webviewRef.current.postMessage(
                                        JSON.stringify({
                                            ...loginStatus,
                                            did: global.did,
                                            timeStamp: timeStamp.current + '',
                                            ver: global.ver,
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
                                    uri: `${SERVER_URL[global.env].H5}/article/${route.params?.article_id}?timeStamp=${
                                        timeStamp.current
                                    }`,
                                }}
                                onError={(err) => {
                                    console.log(err, 'object111');
                                }}
                                onHttpError={(err) => {
                                    console.log(err, 'object');
                                }}
                                renderLoading={Platform.OS === 'android' ? () => <Loading /> : undefined}
                                startInLoadingState
                                style={{
                                    height: webviewHeight,
                                    opacity: compareVersion(global.systemVersion, '12') >= 0 ? 0.99 : 0.9999,
                                }}
                                textZoom={100}
                            />
                        </View>

                        {finishLoad && Object.keys(data).length > 0 && (
                            <>
                                {route?.params?.type !== 5 ? (
                                    <>
                                        <Text style={[styles.footnote, {marginBottom: text(2)}]}>
                                            本文更新于{data?.edit_time}
                                        </Text>
                                        <Text style={styles.footnote}>{data?.copyright_str}</Text>
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
                                    ) : route.params.type == 2 ? (
                                        <View style={{height: text(120)}} />
                                    ) : (
                                        <View style={{height: text(161)}} />
                                    )
                                ) : (
                                    <View style={{height: text(20)}} />
                                )}

                                <View style={{backgroundColor: Colors.bgColor}}>
                                    {Object.keys(recommendData).length > 0 ? (
                                        <>
                                            {series?.list?.length > 0 && (
                                                <LogView.Item
                                                    logKey="series"
                                                    style={{paddingHorizontal: Space.padding}}>
                                                    <View style={styles.titleBox}>
                                                        <Text style={styles.title}>{series.title}</Text>
                                                        {series.button?.text ? (
                                                            <TouchableOpacity
                                                                activeOpacity={0.8}
                                                                onPress={() => jump(series.button?.url)}>
                                                                <Text style={styles.moreText}>
                                                                    {series.button?.text}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ) : null}
                                                    </View>
                                                    {series.list.map?.((item, index) => (
                                                        <CommunityCard data={item} key={index} scene="article" />
                                                    ))}
                                                </LogView.Item>
                                            )}
                                            {portfolios?.list?.length > 0 && (
                                                <LogView.Item
                                                    handler={() =>
                                                        global.LogTool({
                                                            event: 'suggested_products_show',
                                                            rec_json: portfolios.rec_json,
                                                        })
                                                    }
                                                    logKey="portfolios"
                                                    style={{paddingHorizontal: Space.padding}}>
                                                    <View style={styles.titleBox}>
                                                        <Text style={styles.title}>{portfolios.title}</Text>
                                                        {portfolios.button?.text ? (
                                                            <TouchableOpacity
                                                                activeOpacity={0.8}
                                                                onPress={() => jump(portfolios.button?.url)}>
                                                                <Text style={styles.moreText}>
                                                                    {portfolios.button?.text}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ) : null}
                                                    </View>
                                                    {portfolios.list.map?.((item, index) => {
                                                        return portfolios.product_type === '3' ? (
                                                            <View key={index} style={{marginTop: px(12)}}>
                                                                <AlbumCard {...item} rec_json={portfolios.rec_json} />
                                                            </View>
                                                        ) : (
                                                            <ProductCards
                                                                data={{
                                                                    ...item,
                                                                    LogTool: () =>
                                                                        global.LogTool({
                                                                            event: 'suggested_products',
                                                                            oid: item.code || item.plan_id,
                                                                        }),
                                                                }}
                                                                key={index}
                                                                style={{marginTop: px(12)}}
                                                            />
                                                        );
                                                    })}
                                                </LogView.Item>
                                            )}
                                            {articles?.list?.length > 0 && (
                                                <LogView.Item
                                                    handler={() =>
                                                        global.LogTool({
                                                            event: 'recommended_articles_show',
                                                            rec_json: articles.rec_json,
                                                        })
                                                    }
                                                    logKey="articles"
                                                    style={{paddingHorizontal: px(16)}}>
                                                    <View style={styles.titleBox}>
                                                        <Text style={styles.title}>{articles.title}</Text>
                                                        {articles.button?.text ? (
                                                            <TouchableOpacity
                                                                activeOpacity={0.8}
                                                                onPress={() => jump(articles.button?.url)}>
                                                                <Text style={styles.moreText}>
                                                                    {articles.button?.text}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ) : null}
                                                    </View>
                                                    <View
                                                        style={{
                                                            marginTop: px(12),
                                                            borderRadius: Space.borderRadius,
                                                            overflow: 'hidden',
                                                        }}>
                                                        {articles.list.map?.((item, index) => {
                                                            return (
                                                                <>
                                                                    {index === 0 ? null : (
                                                                        <View
                                                                            style={{
                                                                                borderTopWidth:
                                                                                    StyleSheet.hairlineWidth,
                                                                                borderColor: Colors.borderColor,
                                                                                marginHorizontal: Space.marginAlign,
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {RenderCate(item, styles.cardStye, 'article')}
                                                                </>
                                                            );
                                                        })}
                                                    </View>
                                                </LogView.Item>
                                            )}
                                        </>
                                    ) : null}
                                    {/* 问答 */}
                                    {userInfo.is_login && (
                                        <RenderInteract
                                            article_id={route.params.article_id}
                                            style={{marginVertical: px(24)}}
                                        />
                                    )}
                                    {/* 评论 */}
                                    <View style={[styles.titleBox, {paddingHorizontal: Space.padding}]}>
                                        <Text style={styles.title}>{'评论'}</Text>
                                    </View>
                                    <View style={{padding: px(16)}}>
                                        {commentData?.list?.length > 0 ? (
                                            <>
                                                {commentData?.list?.map((item, index) => (
                                                    <View key={item.id}>
                                                        <CommentItem data={item} style={{marginBottom: px(9)}} />
                                                    </View>
                                                ))}
                                                <View style={[{height: px(40)}, Style.flexCenter]}>
                                                    {commentData?.list?.length >= 10 && commentData.has_more ? (
                                                        <Text
                                                            style={[styles.footnote, {color: Colors.btnColor}]}
                                                            onPress={() => {
                                                                handelComment(false);
                                                            }}>
                                                            查看全部评论
                                                        </Text>
                                                    ) : (
                                                        <Text style={styles.footnote}>已显示全部评论</Text>
                                                    )}
                                                </View>
                                            </>
                                        ) : (
                                            <View style={[{height: px(40)}, Style.flexCenter]}>
                                                <Text style={styles.footnote}>
                                                    暂无评论&nbsp;
                                                    <Text
                                                        style={{color: Colors.btnColor}}
                                                        onPress={() => {
                                                            inputModal.current.show();
                                                            setTimeout(() => {
                                                                inputRef?.current?.focus();
                                                            }, 100);
                                                        }}>
                                                        我来写一条
                                                    </Text>
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </>
                        )}
                    </LogView.Wrapper>
                    <PageModal ref={inputModal} title="写评论" style={{height: px(360)}} backButtonClose={true}>
                        <TextInput
                            ref={inputRef}
                            value={content}
                            multiline={true}
                            style={styles.input}
                            onChangeText={(value) => {
                                setContent(value);
                            }}
                            maxLength={inputMaxLength}
                            textAlignVertical="top"
                            placeholder="我来聊两句..."
                        />
                        <View style={{alignItems: 'flex-end', marginRight: px(20)}}>
                            <View style={Style.flexRow}>
                                <Text style={{color: '#9AA1B2', fontSize: px(14)}}>
                                    {content.length}/{inputMaxLength}
                                </Text>
                                <Button
                                    title="发布"
                                    disabled={content.length <= 0}
                                    style={styles.button}
                                    onPress={publish}
                                />
                            </View>
                        </View>
                    </PageModal>
                    {/* footer */}
                    <View style={[styles.footer, Style.flexRow]}>
                        <TouchableOpacity
                            style={styles.footer_content}
                            activeOpacity={0.9}
                            onPress={() => {
                                inputModal.current.show();
                                setTimeout(() => {
                                    inputRef?.current?.focus();
                                }, 100);
                            }}>
                            <Text style={{fontSize: px(12), color: '#9AA1B2'}}>我来聊两句...</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                handelComment(false);
                            }}
                            style={[Style.flexCenter, {flex: 1, marginBottom: px(-7), left: px(4)}]}>
                            <FastImage
                                style={{height: px(22), width: px(22)}}
                                source={require('../../assets/img/vision/commentIcon.png')}
                            />
                            <Text style={styles.iconText}>{data.comment_num >= 0 ? data.comment_num : 0}</Text>
                        </TouchableOpacity>
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
                                style={{height: px(36), width: px(36), marginBottom: px(-4)}}
                            />

                            <Text style={styles.iconText}>{`${favor_num >= 0 ? favor_num : 0}`}</Text>
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
                                        ? require('../../assets/animation/collectActive.json')
                                        : require('../../assets/animation/collect.json')
                                }
                                style={{height: px(36), width: px(36), marginBottom: px(-4)}}
                            />

                            <Text style={styles.iconText}>{`${collect_num >= 0 ? collect_num : 0}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setMore(false);
                                shareModal.current.show();
                            }}
                            style={[Style.flexCenter, {flex: 1, marginBottom: px(-7)}]}>
                            <Image
                                source={require('~/assets/img/article/share.png')}
                                style={[styles.actionIcon, {width: px(22), height: px(22), marginBottom: px(2)}]}
                            />
                            <Text style={[styles.iconText, {marginTop: px(2)}]}>分享</Text>
                        </TouchableOpacity>
                    </View>
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
    iconText: {
        fontSize: Font.textSm,
        // lineHeight: text(17),
        color: Colors.lightBlackColor,
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
        bottom: isIphoneX() ? 34 + px(60) : px(60),
        zIndex: 10,
    },
    footer: {
        paddingHorizontal: px(16),
        borderColor: '#DDDDDD',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        paddingTop: px(8),
        paddingBottom: px(20),
    },
    footer_content: {
        height: px(36),
        backgroundColor: '#F3F5F8',
        borderRadius: px(16),
        width: px(151),
        justifyContent: 'center',
        paddingLeft: px(16),
    },
    cardStye: {
        borderRadius: 0,
        backgroundColor: '#fff',
    },
    button: {
        marginLeft: px(7),
        borderRadius: px(18),
        width: px(80),
        height: px(36),
    },
    input: {
        paddingHorizontal: px(20),
        marginVertical: Platform.OS == 'ios' ? px(10) : px(16),
        height: px(215),
        fontSize: px(14),
        lineHeight: px(20),
    },
    titleBox: {
        marginTop: px(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Font.weightMedium,
    },
    moreText: {
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.brandColor,
    },
});

export default ArticleDetail;
