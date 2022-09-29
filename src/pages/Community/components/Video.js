/* eslint-disable radix */
/*
 * @Date: 2022-09-28 14:44:03
 * @Description:
 */
import {StyleSheet, TouchableWithoutFeedback, View, Text, Image} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {Font, Style} from '~/common/commonStyle';
import {deviceHeight as HEIGHT, deviceWidth as WIDTH, isIphoneX, px} from '~/utils/appUtil';
import InViewport from './InViewPort';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';
const RenderVideo = ({data, index, pause, currentIndex}) => {
    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentItem] = useState(0); //当前播放时间
    const [duration, setDuration] = useState(0); //总时长
    const [sliderValue, setSlierValue] = useState(0); //进度条的进度
    const [showPause, setShowPause] = useState(false); //是否展示暂停按钮
    const video = useRef();
    useEffect(() => {
        setShowPause(false);
        setPaused(index != currentIndex);
        customerSliderValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, currentIndex]);

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
    const onCustomerEnd = () => {};
    //加载视频调用，主要是拿到 “总时间”，并格式化
    const customerOnload = (e) => {
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
    const customerSliderValue = useCallback(
        _.debounce((value) => {
            video.current.seek(value);
        }, 100),
        []
    );
    return (
        <>
            <TouchableWithoutFeedback onPress={onPlayPausePress}>
                <View style={[Style.flexCenter, {backgroundColor: '#000'}]}>
                    <Video
                        source={{uri: data.uri}}
                        ref={video}
                        rate={1.0}
                        paused={paused}
                        volume={7.0}
                        playInBackground={true}
                        repeat={true}
                        playWhenInactive={true}
                        isLooping
                        onEnd={onCustomerEnd}
                        isMuted={false}
                        onLoad={customerOnload}
                        onProgress={customerOnprogress}
                        // resizeMode="cover"
                        style={{width: WIDTH, height: HEIGHT}}
                    />
                </View>
            </TouchableWithoutFeedback>
            {/* 暂停 */}
            {paused && showPause && (
                <TouchableWithoutFeedback onPress={onPlayPausePress}>
                    <Image style={styles.play} source={require('~/assets/img/community/videoPlay.png')} />
                </TouchableWithoutFeedback>
            )}

            <View style={styles.bottomCon}>
                <Text style={styles.timeText}>123123</Text>
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
                        onValueChange={customerSliderValue}
                    />
                    <Text style={styles.timeText}>{formatMediaTime(duration)}</Text>
                </View>
                {/* 全屏按钮 */}
                {/* <View>
                        <TouchableWithoutFeedback onPress={this.enterFullScreen}>
                            <Text style={{backgroundColor: '#00ff00', padding: 5}}>全屏</Text>
                        </TouchableWithoutFeedback>
                    </View> */}
            </View>
        </>
    );
};

export default RenderVideo;

const styles = StyleSheet.create({
    timeText: {
        fontSize: px(12),
        fontFamily: Font.numMedium,
        color: '#fff',
    },
    sliderBox: {},
    bottomCon: {
        position: 'absolute',
        bottom: isIphoneX() ? 34 : 0,
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
});
