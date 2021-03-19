/*
 * @Date: 2021-03-18 10:57:45
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-19 10:47:35
 * @Description: 文章详情
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WebView as RNWebView} from 'react-native-webview';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import {px as text, deviceHeight} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Toast from '../../components/Toast';
import storage from '../../utils/storage';
import {ShareModal} from '../../components/Modal';

const ArticleDetail = ({navigation, route}) => {
    const webviewRef = useRef(null);
    const [webviewHeight, setHeight] = useState(deviceHeight);
    const [injectedJS, setJSCode] = useState('');
    const [data, setData] = useState({});
    const shareModal = useRef(null);
    const [more, setMore] = useState(false);

    const init = useCallback(() => {
        http.get('/community/article/20210101', {article_id: route.params?.article_id}).then((res) => {
            if (res.code === '000000') {
                setData(res.result);
            }
        });
    }, [route]);
    const onLoadEnd = () => {
        storage.get('loginStatus').then((res) => {
            if (res) {
                // setJSCode(`window.localStorage.setItem('loginStatus', '${JSON.stringify(res)}')`);
                webviewRef.current.postMessage(JSON.stringify(res));
            }
        });
    };
    const onMessage = (event) => {
        const eventData = event.nativeEvent.data;
        setHeight(eventData * 1 || deviceHeight);
    };
    const onFavor = useCallback(() => {
        http.post('/community/favor/20210101', {
            resource_id: data?.id,
            resource_cate: 'article',
            action_type: data?.favor_status ? 0 : 1,
        }).then((res) => {
            Toast.show(res.message);
            if (res.code === '000000') {
                init();
            }
        });
    }, [data, init]);
    const onCollect = useCallback(() => {
        http.post('/community/collect/20210101', {
            resource_id: data?.id,
            resource_cate: 'article',
            action_type: data?.collect_status ? 0 : 1,
        }).then((res) => {
            Toast.show(res.message);
            if (res.code === '000000') {
                init();
            }
        });
    }, [data, init]);

    useEffect(() => {
        navigation.setOptions({
            headerBackImage: () => {
                return <Icon name="close" size={24} style={{marginLeft: Space.marginAlign}} />;
            },
            headerRight: () => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setMore(true);
                            shareModal.current.show();
                        }}
                        style={[styles.topRightBtn]}>
                        <Text style={{fontSize: text(30), lineHeight: text(30)}}>{'...'}</Text>
                    </TouchableOpacity>
                );
            },
        });
    }, [navigation]);
    useEffect(() => {
        init();
    }, [init]);

    return (
        <ScrollView style={styles.container}>
            <ShareModal
                likeCallback={onFavor}
                collectCallback={onCollect}
                ref={shareModal}
                more={more}
                shareContent={{favor_status: !!data?.favor_status, collect_status: !!data?.collect_status}}
                title={data?.title}
            />
            <RNWebView
                injectedJavaScript={injectedJS}
                javaScriptEnabled
                onLoadEnd={onLoadEnd}
                onMessage={onMessage}
                originWhitelist={['*']}
                renderLoading={() => <ActivityIndicator color={Colors.brandColor} />}
                ref={webviewRef}
                source={{
                    uri: `http://koudai-evolution-h5.bae.mofanglicai.com.cn/article/${route.params?.article_id || 1}`,
                }}
                startInLoadingState
                style={{height: webviewHeight}}
            />
            <Text
                style={[
                    styles.finishText,
                    {color: Colors.lightGrayColor, paddingHorizontal: Space.padding},
                ]}>{`本文编辑于${data?.edit_time} · 著作权 为©理财魔方 所有，未经许可禁止转载`}</Text>
            <View style={[Style.flexCenter, styles.finishBox]}>
                <Image source={require('../../assets/img/article/finish.png')} style={styles.finishImg} />
                <Text style={styles.finishText}>{'您已阅读完本篇文章'}</Text>
            </View>
            <View style={[Style.flexRow, {paddingBottom: text(64)}]}>
                <TouchableOpacity activeOpacity={0.8} onPress={onFavor} style={[Style.flexCenter, {flex: 1}]}>
                    <Image
                        source={
                            data?.favor_status
                                ? require('../../assets/img/article/bigZanActive.png')
                                : require('../../assets/img/article/bigZan.png')
                        }
                        style={styles.actionIcon}
                    />
                    <Text style={styles.finishText}>{`点赞${data?.favor_num}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={onCollect} style={[Style.flexCenter, {flex: 1}]}>
                    <Image
                        source={
                            data?.collect_status
                                ? require('../../assets/img/article/collectActive.png')
                                : require('../../assets/img/article/collect.png')
                        }
                        style={styles.actionIcon}
                    />
                    <Text style={styles.finishText}>{`收藏${data?.collect_num}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setMore(false);
                        shareModal.current.show();
                    }}
                    style={[Style.flexCenter, {flex: 1}]}>
                    <Image source={require('../../assets/img/article/share.png')} style={styles.actionIcon} />
                    <Text style={styles.finishText}>{'分享'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        marginRight: text(8),
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
