/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-19 18:00:57
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-20 11:35:07
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Dimensions} from 'react-native';
//导入Video组件
import Video from 'react-native-video';
// 导入 Silder组件
import Slider from '@react-native-community/slider';
// 屏幕方向锁定: 他需要改变 原来Android文件代码，当然适配两端的话，IOS也是需要更改的。
import Orientation from 'react-native-orientation-locker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {px as text} from '../utils/appUtil';
import PropTypes from 'prop-types';
let screenWidth = Dimensions.get('window').width - 32;
let screenHeight = Dimensions.get('window').height;
console.log(screenWidth + '   ' + screenHeight + '带有小数');

export default class App extends React.Component {
    static defaultProps = {
        url: '',
    };
    static propTypes = {
        checked: PropTypes.string.isRequired,
    };
    constructor(props) {
        super(props);
        this.changePausedState = this.changePausedState.bind(this);
        this.customerSliderValue = this.customerSliderValue.bind(this);
        this.enterFullScreen = this.enterFullScreen.bind(this);
        this._changePauseSliderFullState = this._changePauseSliderFullState.bind(this);
        this._onStartShouldSetResponder = this._onStartShouldSetResponder.bind(this);
        this.state = {
            isPaused: true, //是暂停
            duration: 0, //总时长
            currentTime: 0, //当前播放时间
            sliderValue: 0, //进度条的进度
            //用来控制进入全屏的属性
            videoWidth: screenWidth,
            videoHeight: 200,
            isFullScreen: false,
            volume: 1,
            isVisiblePausedSliderFullScreen: false,
        };
    }
    changePausedState() {
        //控制按钮显示播放，要显示进度条3秒钟，之后关闭显示
        this.setState({
            isPaused: !this.state.isPaused,
            isVisiblePausedSliderFullScreen: true,
        });
        //这个定时调用失去了this指向
        let that = this;
        setTimeout(function () {
            that.setState({
                isVisiblePausedSliderFullScreen: false,
            });
        }, 3000);
    }
    _changePauseSliderFullState() {
        // 单击事件，是否显示 “暂停、进度条、全屏按钮 盒子”
        let flag = this.state.isVisiblePausedSliderFullScreen ? false : true;
        this.setState({
            isVisiblePausedSliderFullScreen: flag,
            isPaused: !this.state.isPaused,
        });
        //这个定时调用失去了this指向
        let that = this;
        setTimeout(function () {
            that.setState({
                isVisiblePausedSliderFullScreen: false,
            });
        }, 3000);
    }
    //格式化音乐播放的时间为0：00。借助onProgress的定时器调用，更新当前时间
    formatMediaTime(time) {
        let minute = Math.floor(time / 60);
        let second = parseInt(time - minute * 60);
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;
        return minute + ':' + second;
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
    customerSliderValue(value) {
        this.player.seek(value);
    }
    enterFullScreen() {
        //1.改变宽高  2.允许进入全屏模式  3.如何配置屏幕旋转,不需要改变进度条盒子的显示和隐藏
        this.setState({
            videoWidth: screenWidth,
            videoHeight: this.state.videoHeight,
            isFullScreen: true,
        });
        // 直接设置方向
        Orientation.lockToLandscape();
    }
    _onStartShouldSetResponder(e) {
        console.log(e);
    }
    componentDidMount() {
        var initial = Orientation.getInitialOrientation();
        if (initial === 'PORTRAIT') {
            console.log('是竖屏');
        } else {
            console.log('如果是横屏，就将其旋转过来');
            Orientation.lockToPortrait();
        }
    }
    pauseVideo = () => {
        const isPaused = this.state.isPaused;
        this.setState({
            isPaused: !isPaused,
        });
    };
    render() {
        // 播放按钮组件：是否显示
        let playButtonComponent = (
            <TouchableWithoutFeedback onPress={this.changePausedState}>
                {/* <View style={styles.playBtn}></View> */}
                <View style={styles.play_circle}>
                    <AntDesign name={'caretright'} color={'#fff'} size={40} style={styles.play_btn} />
                </View>
            </TouchableWithoutFeedback>
        );
        let pausedBtn = this.state.isPaused ? playButtonComponent : null;
        // 暂停按钮、进度条、全屏按钮 是否显示
        let pausedSliderFullComponent = (
            <View style={styles.slider_wrap}>
                <TouchableOpacity onPress={this.pauseVideo} style={{marginRight: text(5)}}>
                    <AntDesign name={this.state.isPaused ? 'caretright' : 'pause'} color={'#fff'} size={25} />
                </TouchableOpacity>
                {/* 进度条按钮     */}
                <View style={styles.slide_box}>
                    <Text style={{color: '#fff'}}>{this.formatMediaTime(this.state.currentTime)}</Text>
                    <Slider
                        style={{width: screenWidth - text(150), height: 2}}
                        value={this.state.sliderValue}
                        maximumValue={this.state.duration}
                        thumbTintColor="#fff" //开关夹点
                        minimumTrackTintColor="#eee"
                        maximumTrackTintColor="#666"
                        step={1}
                        onValueChange={this.customerSliderValue}
                    />
                    <Text style={{color: '#fff'}}>{this.formatMediaTime(this.state.duration)}</Text>
                </View>
                {/* 全屏按钮 */}
                <TouchableOpacity onPress={this.enterFullScreen} style={{width: text(40), marginLeft: text(5)}}>
                    <Text style={{color: '#fff'}}>全屏</Text>
                </TouchableOpacity>
            </View>
        );
        let pausedSliderFull = pausedSliderFullComponent;
        return (
            <View style={{width: screenWidth - text(150), alignItems: 'center', justifyContent: 'center'}}>
                <TouchableWithoutFeedback
                    onPress={this._changePauseSliderFullState}
                    onResponderMove={this._onStartShouldSetResponder}>
                    <Video
                        source={{uri: this.props.url}}
                        ref={(ref) => {
                            this.player = ref;
                        }}
                        style={{
                            width: this.state.videoWidth,
                            height: this.state.videoHeight,
                            backgroundColor: '#FFC1C1',
                        }}
                        volume={this.state.volume} //调节音量
                        allowsExternalPlayback={false} // 不允许导出 或 其他播放器播放
                        paused={this.state.isPaused} // 控制视频是否播放
                        resizeMode="cover"
                        onLoad={(e) => this.customerOnload(e)}
                        onProgress={(e) => this.customerOnprogress(e)}
                        fullscreen={this.state.isFullScreen}
                    />
                </TouchableWithoutFeedback>
                {/* 播放的按钮：点击之后需要消失 */}
                {pausedBtn}
                {/* 暂停按钮，进度条，全屏按钮 */}
                {pausedSliderFull}
            </View>
        );
    }
}
var styles = StyleSheet.create({
    play_circle: {
        width: text(60),
        height: text(60),
        backgroundColor: '#333',
        borderRadius: text(50),
        position: 'absolute',
        top: '40%',
        left: '45%',
        marginLeft: text(-20),
        marginTop: text(-15),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        opacity: 0.3,
    },
    play_btn: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: text(-20),
        marginTop: text(-20),
        zIndex: 999,
    },
    slide_box: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        width: screenWidth,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#333',
        opacity: 0.6,
        paddingVertical: text(7),
        marginHorizontal: text(10),
    },
});
