/*
 * @Date: 2021-01-19 18:00:57
 * @Description:
 */
import React from 'react';
import {ActivityIndicator, View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import Video from 'react-native-video';
import Slider from 'react-native-slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import play from '~/assets/img/icon/videoPlay.png';
import {formatMediaTime, px} from '~/utils/appUtil';
import {Colors, Font, Style} from '~/common/commonStyle';

export default class App extends React.Component {
    static defaultProps = {
        url: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            isPaused: true, //是暂停
            duration: 0, //总时长
            currentTime: 0, //当前播放时间
            sliderValue: 0, //进度条的进度
            //用来控制进入全屏的属性
            videoWidth: '100%',
            videoHeight: '100%',
            isFullScreen: false,
            volume: 1,
            isVisiblePausedSliderFullScreen: false,
            loading: true,
        };
    }
    //加载视频调用，主要是拿到 “总时间”，并格式化
    customerOnload(e) {
        let time = e.duration;
        this.setState({
            duration: time,
        });
    }
    // 获得当前的，播放时间数，但这个数是0.104，需要处理
    customerOnprogress(e) {
        let time = e.currentTime; // 获取播放视频的秒数
        this.setState({
            currentTime: time,
            sliderValue: time,
        });
    }
    // 移动滑块，改变视频播放进度
    customerSliderValue = (value) => {
        this.player.seek(value);
    };
    enterFullScreen = () => {
        this.setState({
            isFullScreen: true,
        });
    };
    pauseVideo = () => {
        this.setState((prev) => ({isPaused: !prev.isPaused}));
    };
    render() {
        // 播放按钮组件：是否显示
        const playButtonComponent = (
            <TouchableWithoutFeedback onPress={this.pauseVideo}>
                {/* <View style={styles.playBtn}></View> */}
                <View style={styles.play_circle}>
                    <Image source={play} style={styles.play_btn} />
                </View>
            </TouchableWithoutFeedback>
        );
        const pausedBtn = this.state.isPaused ? playButtonComponent : null;
        // 暂停按钮、进度条、全屏按钮 是否显示
        const pausedSliderFullComponent = (
            <View style={styles.slider_wrap}>
                <TouchableOpacity onPress={this.pauseVideo}>
                    <AntDesign name={this.state.isPaused ? 'caretright' : 'pause'} color={'#fff'} size={px(20)} />
                </TouchableOpacity>
                {/* 进度条按钮     */}
                <View style={styles.slide_box}>
                    <Text style={{color: '#fff', fontFamily: Font.numMedium}}>
                        {formatMediaTime(this.state.currentTime)}
                    </Text>
                    <Slider
                        animateTransitions={true}
                        animationConfig={{useNativeDriver: false}}
                        style={{flex: 1, height: 2, marginHorizontal: px(4)}}
                        value={this.state.sliderValue}
                        maximumValue={this.state.duration}
                        thumbTintColor="#fff" //开关夹点
                        thumbStyle={{
                            width: px(8),
                            height: px(8),
                        }}
                        minimumTrackTintColor="#fff"
                        maximumTrackTintColor="#5b5b5b"
                        step={1}
                        onSlidingComplete={this.customerSliderValue}
                    />
                    <Text style={{color: '#fff', fontFamily: Font.numMedium}}>
                        {formatMediaTime(this.state.duration)}
                    </Text>
                </View>
                {/* 全屏按钮 */}
                {/* <TouchableOpacity onPress={this.enterFullScreen} style={{marginRight: px(4)}}>
                    <Octicons color="#fff" name="screen-full" size={px(16)} />
                </TouchableOpacity> */}
            </View>
        );
        return (
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: px(6),
                    overflow: 'hidden',
                }}>
                <TouchableWithoutFeedback onPress={this.pauseVideo}>
                    <Video
                        source={{uri: this.props.url}}
                        ref={(ref) => {
                            this.player = ref;
                        }}
                        style={{
                            width: this.state.videoWidth,
                            height: this.state.videoHeight,
                            backgroundColor: '#eee',
                        }}
                        volume={this.state.volume} //调节音量
                        allowsExternalPlayback={false} // 不允许导出 或 其他播放器播放
                        paused={this.state.isPaused} // 控制视频是否播放
                        resizeMode="cover"
                        onBuffer={(e) => this.setState({loading: e.isBuffering})}
                        onError={() => this.setState({loading: false})}
                        onLoad={(e) => this.customerOnload(e)}
                        // controls
                        onLoadStart={() => {
                            console.log('start');
                        }}
                        onProgress={(e) => this.customerOnprogress(e)}
                        onFullscreenPlayerWillDismiss={() => this.setState({isFullScreen: false})}
                        fullscreen={this.state.isFullScreen}
                    />
                </TouchableWithoutFeedback>
                {/* 播放的按钮：点击之后需要消失 */}
                {pausedBtn}
                {/* 暂停按钮，进度条，全屏按钮 */}
                {pausedSliderFullComponent}
                {this.state.loading && (
                    <View style={[Style.flexCenter, styles.loadingBox]}>
                        <ActivityIndicator color={Colors.lightGrayColor} />
                    </View>
                )}
            </View>
        );
    }
}
var styles = StyleSheet.create({
    play_circle: {
        width: px(48),
        height: px(48),
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 99,
        transform: [{translateX: -px(24)}, {translateY: -px(24)}],
    },
    play_btn: {
        width: '100%',
        height: '100%',
    },
    slide_box: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px(4),
    },
    slider_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#333',
        opacity: 0.6,
        paddingVertical: px(7),
        paddingHorizontal: px(2),
        marginHorizontal: px(10),
    },
    loadingBox: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#000',
        zIndex: 100,
    },
});
