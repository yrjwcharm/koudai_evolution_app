/* eslint-disable radix */
/*
 * @Date: 2022-09-28 14:44:03
 * @Description:
 */
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    Image,
    Dimensions,
    Animated,
    ActivityIndicator,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {Colors, Font, Style} from '~/common/commonStyle';
import {deviceWidth as WIDTH, isIphoneX, px} from '~/utils/appUtil';
import Slider from 'react-native-slider';
import _ from 'lodash';
import VideoFooter from './VideoFooter';
import {useJump} from '~/components/hooks';
import {followAdd, followCancel} from '~/pages/Attention/Index/service';
import {postProgress} from '../CommunityVideo/service';
const HEIGHT = Dimensions.get('window').height;
const RenderVideo = ({data, index, pause, currentIndex, animated, handleComment, community_id, muid, height}, ref) => {
    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentItem] = useState(0); //当前播放时间
    const [duration, setDuration] = useState(0); //总时长
    const [sliderValue, setSlierValue] = useState(0); //进度条的进度
    const video = useRef();
    const [followStatus, setFollowStatus] = useState();
    const [showPause, setShowPause] = useState(false); //是否展示暂停按钮
    const [loading, setLoading] = useState(false);
    const finished = useRef(false);
    const jump = useJump();
    useEffect(() => {
        setPaused(index != currentIndex);
        customerSliderValue(0);
        setFollowStatus(data?.follow_status);
        index == currentIndex &&
            data.product_type !== 'article_history' &&
            postProgress({article_id: data.id, done_status: data.view_status});
    }, [data, index, currentIndex]);
    useImperativeHandle(ref, () => ({
        currentTime,
        id: data?.id,
    }));
    //using async is more reliable than setting shouldPlay with state variable
    const onPlayPausePress = () => {
        if (!paused) setShowPause(true);
        setPaused((pre) => !pre);
    };
    const formatMediaTime = (time) => {
        let minute = Math.floor(time / 60);
        let second = parseInt(time - minute * 60);
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;
        return minute + ':' + second;
    };
    const onCustomerEnd = () => {
        if (finished.current) return false;
        data.product_type !== 'article_history' &&
            postProgress({article_id: data.id, article_progress: 100, done_status: 1, latency: duration * 1000});
        finished.current = true;
    };
    //加载视频调用，主要是拿到 “总时间”，并格式化
    const customerOnload = (e) => {
        setLoading(false);
        let time = e.duration;
        setDuration(time);
    };
    // 获得当前的，播放时间数，但这个数是0.104，需要处理
    const customerOnprogress = (e) => {
        let time = e.currentTime; // 获取播放视频的秒数
        setCurrentItem(time);
        setSlierValue(time);
    };
    //移动滑块
    const customerSliderValue = (value) => {
        video.current?.seek(value);
    };
    //关注
    const handleFollow = async () => {
        let res =
            followStatus == 1
                ? await followCancel({item_id: data?.author?.author_id, item_type: 10})
                : await followAdd({item_id: data?.author?.author_id, item_type: 10});
        if (res.code == '000000') {
            setFollowStatus(followStatus == 1 ? 2 : 1);
        }
    };
    return (
        <View
            style={{
                height: height,
                width: WIDTH,
            }}>
            <TouchableWithoutFeedback onPress={onPlayPausePress}>
                <View style={{flex: 1}}>
                    <Animated.View
                        style={{
                            height: '100%',
                            transform: [
                                {
                                    scale: animated.interpolate({inputRange: [0, 1], outputRange: [1, 0.8]}),
                                },
                                {
                                    translateY: animated.interpolate({
                                        inputRange: [0, 0.25, 1],
                                        outputRange: [0, -100, -400],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        }}>
                        {index == currentIndex ? (
                            <>
                                <Video
                                    source={{uri: data.media_url}}
                                    ref={video}
                                    rate={1.0}
                                    paused={paused}
                                    volume={7.0}
                                    onLoadStart={(e) => {
                                        // console.log('onLoadStart', e);
                                        setLoading(true);
                                    }}
                                    onBuffer={(isBuffering) => {
                                        setLoading(isBuffering.isBuffering);
                                        // console.log('isBuffering', isBuffering);
                                    }}
                                    playInBackground={true}
                                    repeat={true}
                                    playWhenInactive={true}
                                    isLooping
                                    onEnd={onCustomerEnd}
                                    isMuted={false}
                                    onLoad={customerOnload}
                                    onProgress={customerOnprogress}
                                    resizeMode="contain"
                                    ignoreSilentSwitch={'ignore'}
                                    style={{
                                        height: height,
                                        width: WIDTH,
                                    }}
                                />
                                {/* 暂停 */}
                                {paused && showPause && (
                                    <TouchableWithoutFeedback onPress={onPlayPausePress}>
                                        <Image
                                            style={styles.play}
                                            source={require('~/assets/img/community/videoPlay.png')}
                                        />
                                    </TouchableWithoutFeedback>
                                )}
                                {loading && <ActivityIndicator style={styles.play} color="#eee" />}
                            </>
                        ) : (
                            <ActivityIndicator style={styles.play} color="#eee" />
                        )}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.bottomCon}>
                <View style={[Style.flexRow, {marginBottom: px(8)}]}>
                    {!!data?.author?.avatar && (
                        <TouchableWithoutFeedback onPress={() => jump(data?.author?.url, 'push')}>
                            <Image
                                source={{uri: data?.author?.avatar}}
                                style={{width: px(36), height: px(36), marginRight: px(12), borderRadius: px(18)}}
                            />
                        </TouchableWithoutFeedback>
                    )}
                    <Text style={{fontSize: px(14), color: '#fff'}}>{data?.author?.nickname}</Text>
                    {!!data?.follow_btn && (
                        <TouchableWithoutFeedback onPress={handleFollow}>
                            <View style={[styles.button, followStatus === 1 ? {backgroundColor: '#E9EAEF'} : {}]}>
                                <Text
                                    style={{
                                        fontSize: px(12),
                                        color: followStatus === 1 ? Colors.lightGrayColor : '#fff',
                                    }}>
                                    {followStatus == 1 ? '已关注' : '+关注'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
                <Text style={{fontSize: px(13), color: '#fff', marginBottom: px(8), lineHeight: px(22)}}>
                    {data?.title}
                </Text>
                {/* 进度条按钮     */}
                <View style={[styles.sliderBox, Style.flexRow]}>
                    <Text style={styles.timeText}>{formatMediaTime(currentTime)}</Text>
                    <Slider
                        style={{flex: 1, marginLeft: px(11), marginRight: px(6)}}
                        value={sliderValue}
                        maximumValue={duration}
                        thumbTintColor="#fff" //开关夹点的yanse
                        thumbStyle={{
                            width: px(8),
                            height: px(8),
                        }}
                        minimumTrackTintColor="#fff"
                        maximumTrackTintColor="#5b5b5b"
                        step={1}
                        animateTransitions={true}
                        animationConfig={{useNativeDriver: false}}
                        onSlidingComplete={customerSliderValue}
                    />
                    <Text style={styles.timeText}>{formatMediaTime(duration)}</Text>
                </View>
                <VideoFooter
                    data={{
                        id: data?.id,
                        favor_num: data?.favor_num,
                        favor_status: data?.favor_status,
                        collect_num: data?.collect_num,
                        collect_status: data?.collect_status,
                        comment_num: data?.comment_num,
                        product_type: data?.product_type,
                    }}
                    handleComment={handleComment}
                />
            </View>
        </View>
    );
};

export default forwardRef(RenderVideo);

const styles = StyleSheet.create({
    timeText: {
        fontSize: px(12),
        fontFamily: Font.numMedium,
        color: '#fff',
    },
    sliderBox: {},
    bottomCon: {
        position: 'absolute',
        bottom: isIphoneX() ? 34 : px(14),
        marginHorizontal: px(16),
        width: WIDTH - px(32),
    },
    play: {
        width: px(80),
        height: px(80),
        position: 'absolute',
        left: WIDTH / 2 - px(40),
        top: HEIGHT / 2 - px(40),
        // zIndex: 10,
    },
    button: {
        marginLeft: px(12),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        backgroundColor: Colors.red,
        borderRadius: px(14),
    },
});
