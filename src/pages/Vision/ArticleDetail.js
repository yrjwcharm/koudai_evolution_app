/*
 * @Date: 2021-03-18 10:57:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-13 15:54:59
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
import storage from '../../utils/storage';
import {ShareModal} from '../../components/Modal';
import BaseUrl from '../../services/config';
import {useNetInfo} from '@react-native-community/netinfo';
import Empty from '../../components/EmptyTip';
import {Button} from '../../components/Button';
const ArticleDetail = ({navigation, route}) => {
    const netInfo = useNetInfo();
    const [hasNet, setHasNet] = useState(netInfo.isConnected);
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
    }, [route]);
    const onLoadEnd = () => {
        storage.get('loginStatus').then((res) => {
            if (res) {
                webviewRef.current.postMessage(JSON.stringify(res));
            }
        });
    };
    const onMessage = (event) => {
        const eventData = event.nativeEvent.data;
        if (eventData) {
            setFinishLoad(true);
        }
        setHeight(eventData * 1 || deviceHeight);
    };
    const onFavor = useCallback(() => {
        if (!btnClick.current) {
            return false;
        }
        btnClick.current = false;
        http.post('/community/favor/20210101', {
            resource_id: data?.id,
            resource_cate: 'article',
            action_type: data?.favor_status ? 0 : 1,
        }).then((res) => {
            Toast.show(res.message, {
                onHidden: () => {
                    btnClick.current = true;
                },
            });
            if (res.code === '000000') {
                init();
            }
        });
    }, [data, init]);
    const onCollect = useCallback(() => {
        if (!btnClick.current) {
            return false;
        }
        btnClick.current = false;
        http.post('/community/collect/20210101', {
            resource_id: data?.id,
            resource_cate: 'article',
            action_type: data?.collect_status ? 0 : 1,
        }).then((res) => {
            Toast.show(res.message, {
                onHidden: () => {
                    btnClick.current = true;
                },
            });
            if (res.code === '000000') {
                init();
            }
        });
    }, [data, init]);
    const postProgress = useCallback((params) => {
        http.post('/community/article/progress/20210101', params || {});
    }, []);
    const back = useCallback(() => {
        let progress = parseInt((scrollY / (webviewHeight - deviceHeight + headerHeight)) * 100, 10);
        progress = progress > 100 ? 100 : progress;
        postProgress({
            article_id: route.params?.article_id,
            latency: Date.now() - timeRef.current,
            done_status: data?.read_info?.done_status || +finishRead,
            article_progress: progress,
        });
    }, [data, finishRead, headerHeight, postProgress, route, scrollY, webviewHeight]);
    // 刷新一下
    const refreshNetWork = useCallback(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);

    useEffect(() => {
        navigation.setOptions({
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
                            setMore(true);
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
        if (scrollY > 80) {
            navigation.setOptions({title: '文章内容'});
        } else {
            navigation.setOptions({title: ''});
        }
    }, [navigation, scrollY]);
    useEffect(() => {
        if (scrollY > webviewHeight - deviceHeight + headerHeight && finishLoad) {
            setFinishRead((prev) => {
                if (!prev) {
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
    }, [finishLoad, headerHeight, postProgress, route, scrollY, webviewHeight]);
    useEffect(() => {
        setHasNet(netInfo.isConnected);
    }, [netInfo]);
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
                <ScrollView style={{flex: 1}} onScroll={onScroll} scrollEventThrottle={16}>
                    <ShareModal
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
                    />
                    <RNWebView
                        javaScriptEnabled
                        onLoadEnd={onLoadEnd}
                        onMessage={onMessage}
                        // originWhitelist={['*']}
                        ref={webviewRef}
                        scalesPageToFit={Platform.select({ios: true, android: false})}
                        source={{
                            uri: `${BaseUrl.H5}/article/${route.params?.article_id || 1}`,
                        }}
                        startInLoadingState
                        style={{height: webviewHeight}}
                    />
                    {finishLoad && Object.keys(data).length > 0 && (
                        <>
                            <Text
                                style={[
                                    styles.finishText,
                                    {color: Colors.lightGrayColor, padding: Space.padding},
                                ]}>{`本文编辑于${data?.edit_time} · 著作权 为©理财魔方 所有，未经许可禁止转载`}</Text>
                            <View style={[Style.flexCenter, styles.finishBox, {opacity: finishRead ? 1 : 0}]}>
                                <Image
                                    source={require('../../assets/img/article/finish.gif')}
                                    style={styles.finishImg}
                                />
                                <Text style={styles.finishText}>{'您已阅读完本篇文章'}</Text>
                            </View>
                            <View style={[Style.flexRow, {paddingBottom: text(64)}]}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={onFavor}
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
                                    onPress={onCollect}
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
                        </>
                    )}
                </ScrollView>
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
