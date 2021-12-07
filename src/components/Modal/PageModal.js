/*
 * @Date: 2021-12-01 14:57:22
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-12-07 17:27:18
 * @Description:页面级弹窗，弹窗弹出时，跳转页面不会覆盖该页面
 */
/**
 * Created by sybil052 on 2017/6/19.
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, Easing, Dimensions, TouchableOpacity, BackHandler} from 'react-native';
import {constants} from './util';
import Icon from 'react-native-vector-icons/AntDesign';
import {isIphoneX, px} from '../../utils/appUtil';
const {width, height} = Dimensions.get('window');
const [left, top] = [0, 0];
export default class PageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            aHeight: props.height || constants.bottomMinHeight,
            hide: true,
        };
    }
    static defaultProps = {
        backdrop: true, //是否展示蒙层
        header: '',
        title: '请选择',
        sub_title: '', //副标题
        confirmText: '',
        children: <Text />,
        isTouchMaskToClose: true, //点击蒙层是否能关闭
        onClose: () => {}, //关闭的回掉
        confirmClick: () => {}, //确认按钮的回掉
    };
    componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
    //安卓返回按钮关闭弹窗
    onBackAndroid = () => {
        if (!this.state.hide && this.props.focused) {
            this.cancel();
            return true;
        } else {
            return false;
        }
    };
    render() {
        const {header, title, sub_title, confirmText, children, style, isTouchMaskToClose, confirmClick} = this.props;
        if (this.state.hide) {
            return <View />;
        } else {
            return (
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.mask}
                        onPress={() => {
                            isTouchMaskToClose && this.cancel();
                        }}
                    />
                    <Animated.View
                        style={[
                            {
                                width: width,
                                height: this.state.aHeight,
                            },
                            {
                                transform: [
                                    {
                                        translateY: this.state.offset.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [height, height - this.state.aHeight - px(60)],
                                        }),
                                    },
                                ],
                            },
                            styles.content,
                            style,
                        ]}>
                        {header || (
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.close} onPress={this.cancel}>
                                    <Icon name={'close'} size={18} />
                                </TouchableOpacity>
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.title}>{title}</Text>
                                    {sub_title ? <Text style={styles.sub_title}>{sub_title}</Text> : null}
                                </View>
                                {confirmText ? (
                                    <TouchableOpacity style={[styles.confirm]} onPress={confirmClick}>
                                        <Text style={{fontSize: px(14), color: '#0051CC'}}>{confirmText}</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        )}
                        {children}
                    </Animated.View>
                </View>
            );
        }
    }

    componentWillUnmount() {
        // BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    //显示动画
    in = () => {
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                easing: Easing.linear, //一个用于定义曲线的渐变函数
                duration: 200, //动画持续的时间（单位是毫秒），默认为200。
                toValue: 0.8, //动画的最终值
                useNativeDriver: true,
            }),
            Animated.timing(this.state.offset, {
                easing: Easing.linear,
                duration: 200,
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start();
    };

    //隐藏动画
    out = () => {
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                easing: Easing.linear,
                duration: 200,
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.offset, {
                easing: Easing.linear,
                duration: 200,
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start((finished) => this.setState({hide: true}));
    };

    //取消
    cancel = () => {
        if (!this.state.hide) {
            this.out();
            this.props.onClose();
        }
    };

    show = () => {
        if (this.state.hide) {
            this.setState({hide: false}, this.in);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: width,
        height: height,
        left: left,
        top: top,
        zIndex: 10,
    },
    mask: {
        backgroundColor: '#000000',
        opacity: 0.3,
        position: 'absolute',
        width: width,
        height: height,
    },
    content: {
        paddingBottom: isIphoneX() ? 34 + px(20) : px(20),
        backgroundColor: '#fff',
        minHeight: constants.bottomMinHeight,
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
    },
    header: {
        paddingVertical: px(16),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
    },
    close: {
        position: 'absolute',
        right: 0,
        left: 0,
        width: 60,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirm: {
        position: 'absolute',
        right: 20,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: px(16),
        color: '#333333',
        fontWeight: '700',
    },
});
