/*
 * @Date: 2021-05-13 10:40:07
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-18 10:30:15
 * @Description:
 */
/**
 * Created by guangqiang on 2018/3/29.
 */
import React, {Component} from 'react';
import {View, Animated, Easing, Text} from 'react-native';

import PropTypes from 'prop-types';
import {Colors, Style, Font} from '../../common/commonStyle';

export default class CusProgressBar extends Component {
    static propTypes = {
        ...View.propTypes,
        // 当前进度
        progress: PropTypes.number,
        // second progress进度
        buffer: PropTypes.number,

        // 进度动画时长
        progressAniDuration: PropTypes.number,
        // buffer动画时长
        bufferAniDuration: PropTypes.number,
    };

    static defaultProps = {
        buffer: 1,

        // 进度条动画时长
        progressAniDuration: 100,
        // buffer进度条动画时长
        bufferAniDuration: 100,
    };
    state = {
        progress: this.props.progress,
    };
    constructor(props) {
        super(props);
        this._progressAni = new Animated.Value(0);
    }

    componentWillReceiveProps(nextProps) {
        this._progress = nextProps.progress;
    }

    componentDidMount() {
        this._progress = this.props.progress;
    }

    render() {
        return (
            <View style={[Style.flexBetween, {paddingLeft: 16}]}>
                <View style={this.props.style} onLayout={this._onLayout.bind(this)}>
                    <Animated.View
                        ref="progress"
                        style={{
                            position: 'absolute',
                            width: this._progressAni,
                            height: 8,
                            zIndex: 10,
                            backgroundColor: Colors.btnColor,
                            borderRadius: 10,
                        }}
                    />
                    <Animated.View
                        ref="buffer"
                        style={{
                            position: 'absolute',
                            height: 8,
                            backgroundColor: Colors.bgColor,
                            borderRadius: 10,
                        }}
                    />
                </View>
                <View style={{width: 60, marginBottom: -18}}>
                    <Text
                        style={{
                            color: Colors.btnColor,
                            fontFamily: Font.numMedium,
                            textAlign: 'center',
                        }}>
                        {this.state.progress}%
                    </Text>
                </View>
            </View>
        );
    }

    _onLayout({
        nativeEvent: {
            layout: {width, height},
        },
    }) {
        // 防止多次调用,当第一次获取后,后面就不再去获取了
        if (width > 0 && this.totalWidth !== width) {
            // 获取父布局宽度
            this.totalWidth = width;

            // 开始执行进度条动画
            this._startAniProgress(this.progress);
        }
    }

    _startAniProgress(progress) {
        if (this._progress >= 0 && this.totalWidth !== 0) {
            Animated.timing(this._progressAni, {
                toValue: progress * this.totalWidth || 0,
                duration: this.props.progressAniDuration,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
            this.setState({
                progress: progress * 100,
            });
        }
    }
}

Object.defineProperty(CusProgressBar.prototype, 'progress', {
    set(value) {
        if (value >= 0 && this._progress !== value) {
            this._progress = value;
            this._startAniProgress(value);
        }
    },
    get() {
        return this._progress;
    },
    enumerable: true,
});
