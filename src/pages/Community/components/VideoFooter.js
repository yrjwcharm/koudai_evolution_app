/*
 * @Date: 2022-10-18 10:44:03
 * @Description:
 */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useRef, useCallback, useState} from 'react';
import {Colors, Font, Style} from '~/common/commonStyle';
import {px} from '~/utils/appUtil';
import FastImage from 'react-native-fast-image';
import AnimatedLottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import http from '~/services';
import {ShareModal} from '~/components/Modal';
const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};
const VideoFooter = ({data, handleComment}) => {
    const [favor_num, setFavorNum] = useState(data.favor_num);
    const [favor_status, setFavorStatus] = useState(data.favor_status);
    const [collect_status, setCollectStatus] = useState(data.collect_status);
    const [collect_num, setCollectNum] = useState(data.collect_num);
    const zanRef = useRef(null);
    const collectRef = useRef(null);
    const btnClick = useRef(true);
    const shareModal = useRef();
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
                setTimeout(() => {
                    btnClick.current = true;
                }, 100);
            });
        },
        [data, favor_status]
    );
    const onCollect = useCallback(
        (type) => {
            if (!btnClick.current) {
                return false;
            }
            global.LogTool({event: collect_status ? 'cancel_like' : 'content_thumbs', oid: data?.id});
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
                setTimeout(() => {
                    btnClick.current = true;
                }, 100);
            });
        },
        [data, collect_status]
    );
    return (
        <>
            <View style={[styles.footer, Style.flexRow]}>
                <TouchableOpacity
                    style={styles.footer_content}
                    activeOpacity={0.9}
                    onPress={() => {
                        handleComment(true);
                    }}>
                    <Text style={{fontSize: px(12), color: '#fff'}}>我来聊两句...</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onFavor('normal')}
                    style={[Style.flexCenter, {flex: 1, marginLeft: px(40)}]}>
                    <AnimatedLottieView
                        ref={zanRef}
                        loop={false}
                        autoPlay
                        source={
                            favor_status
                                ? require('~/assets/animation/videoFavorActive.json')
                                : require('~/assets/animation/videoFavor.json')
                        }
                        style={{height: px(36), width: px(36), marginBottom: px(-6)}}
                    />

                    <Text style={styles.iconText}>{`${favor_num >= 0 ? favor_num : 0}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        handleComment();
                    }}
                    style={[Style.flexCenter, {flex: 1, marginBottom: px(-7)}]}>
                    <FastImage
                        style={{height: px(24), width: px(24)}}
                        source={require('~/assets/img/community/comment.png')}
                    />
                    <Text style={styles.iconText}>{data.comment_num}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onCollect('normal')}
                    style={[Style.flexCenter, {flex: 1}]}>
                    <AnimatedLottieView
                        ref={collectRef}
                        loop={false}
                        autoPlay
                        source={
                            collect_status
                                ? require('~/assets/animation/videoCollectActive.json')
                                : require('~/assets/animation/videoCollect.json')
                        }
                        style={{height: px(36), width: px(36), marginBottom: px(-6)}}
                    />

                    <Text style={styles.iconText}>{`${collect_num >= 0 ? collect_num : 0}`}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        shareModal.current.show();
                    }}
                    style={[Style.flexCenter, {flex: 1, marginBottom: px(-10)}]}>
                    <FastImage
                        source={require('~/assets/img/community/share.png')}
                        style={[styles.actionIcon, {width: px(20), height: px(20), marginBottom: px(4)}]}
                    />
                    <Text style={{fontSize: px(11), color: '#fff'}}>分享</Text>
                </TouchableOpacity> */}
            </View>
            <ShareModal
                likeCallback={onFavor}
                collectCallback={onCollect}
                ref={shareModal}
                shareContent={{
                    favor_status: favor_status,
                    collect_status: collect_status,
                    ...data?.share_info,
                }}
                title={data?.title}
            />
        </>
    );
};

export default VideoFooter;

const styles = StyleSheet.create({
    footer: {
        borderColor: '#DDDDDD',
        paddingTop: px(8),
    },
    footer_content: {
        height: px(36),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: px(16),
        width: px(151),
        justifyContent: 'center',
        paddingLeft: px(16),
    },
    iconText: {
        fontSize: Font.textSm,
        lineHeight: px(15),
        color: '#fff',
        fontFamily: Font.numMedium,
    },

    actionIcon: {
        width: px(40),
        height: px(40),
        marginBottom: px(-4),
    },
});
