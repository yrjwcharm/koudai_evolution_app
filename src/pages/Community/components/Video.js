/* eslint-disable radix */
/*
 * @Date: 2022-09-28 14:44:03
 * @Description:
 */
import {StyleSheet, TouchableWithoutFeedback, View, Text, Image, Dimensions, Animated} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {Colors, Font, Style} from '~/common/commonStyle';
import {deviceWidth as WIDTH, isIphoneX, px} from '~/utils/appUtil';
import Slider from 'react-native-slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import _ from 'lodash';
import {Modalize} from 'react-native-modalize';
import {useNavigation} from '@react-navigation/native';
const HEIGHT = Dimensions.get('screen').height;
const RenderVideo = ({data, index, pause, currentIndex}) => {
    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentItem] = useState(0); //当前播放时间
    const [duration, setDuration] = useState(0); //总时长
    const [sliderValue, setSlierValue] = useState(0); //进度条的进度
    const [showPause, setShowPause] = useState(false); //是否展示暂停按钮
    const navigation = useNavigation();
    const video = useRef();
    const modalizeRef = useRef(null);
    const animated = useRef(new Animated.Value(0)).current;
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
    const onOpen = () => {
        modalizeRef.current?.open();
    };
    return (
        <>
            <TouchableWithoutFeedback onPress={onPlayPausePress}>
                <View style={[{backgroundColor: '#000'}]}>
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    scale: animated.interpolate({inputRange: [0, 1], outputRange: [1, 0.8]}),
                                },
                                {
                                    translateY: animated.interpolate({
                                        inputRange: [0, 0.25, 1],
                                        outputRange: [0, -100, -400],
                                    }),
                                },
                            ],
                        }}>
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
                            resizeMode="contain"
                            style={{
                                height: HEIGHT,
                                width: WIDTH,
                            }}
                        />
                        {/* 暂停 */}
                        {paused && showPause && (
                            <TouchableWithoutFeedback onPress={onPlayPausePress}>
                                <Image style={styles.play} source={require('~/assets/img/community/videoPlay.png')} />
                            </TouchableWithoutFeedback>
                        )}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.bottomCon}>
                <TouchableWithoutFeedback onPress={onOpen}>
                    <Text style={{color: '#fff'}}>Open the modal</Text>
                </TouchableWithoutFeedback>
                <View style={[Style.flexRow, {marginBottom: px(8)}]}>
                    <Image
                        source={{uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/09/manager_demo.png'}}
                        style={{width: px(36), height: px(36), marginRight: px(12), borderRadius: px(18)}}
                    />
                    <Text style={{fontSize: px(14), color: '#fff'}}>小马哥</Text>
                    <TouchableWithoutFeedback>
                        <View style={styles.button}>
                            <Text style={{fontSize: px(12), color: '#fff'}}>+关注</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Text style={{fontSize: px(13), color: '#fff', marginBottom: px(8), lineHeight: px(22)}}>
                    智能组合里有两支基金持仓很类似，请问是出于什么考量看很多描述然后会遇到多行情况会遇到多行情况。
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
                        onValueChange={customerSliderValue}
                    />
                    <Text style={styles.timeText}>{formatMediaTime(duration)}</Text>
                </View>
            </View>
            <Modalize
                ref={modalizeRef}
                modalHeight={px(600)}
                withHandle={false}
                overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                panGestureAnimatedValue={animated}
                HeaderComponent={() => {
                    return (
                        <View style={[{height: px(64), paddingHorizontal: px(16)}, Style.flexBetween]}>
                            <Text style={{fontSize: px(16), fontWeight: '700'}}>评论22</Text>
                            <TouchableWithoutFeedback activeOpacity={0.9} onPress={() => modalizeRef.current?.close()}>
                                <AntDesign name="close" size={px(20)} />
                            </TouchableWithoutFeedback>
                        </View>
                    );
                }}
                FooterComponent={() => {
                    return (
                        <TouchableWithoutFeedback style={styles.footer} activeOpacity={0.9}>
                            <View style={styles.footer_content}>
                                <Text style={{fontSize: px(12), color: '#9AA1B2'}}>我来聊两句...</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }}>
                <View style={{height: px(1000)}}>
                    <Animated.View
                        style={{
                            opacity: animated.interpolate({inputRange: [0, 1], outputRange: [1, 0.75]}),
                            transform: [
                                {
                                    scale: animated.interpolate({inputRange: [0, 1], outputRange: [1, 0]}),
                                },
                            ],
                        }}>
                        <Text>12312</Text>
                    </Animated.View>
                    <Text onPress={() => navigation.navigate('Login')}>...your content</Text>
                </View>
            </Modalize>
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
    button: {
        marginLeft: px(12),
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        backgroundColor: Colors.red,
        borderRadius: px(14),
    },
});
