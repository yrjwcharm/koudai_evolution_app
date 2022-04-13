/*
 * @Date: 2021-12-01 14:57:22
 * @Author: yhc
 * @LastEditors: yhc
<<<<<<< HEAD
 * @LastEditTime: 2022-04-13 10:23:57
=======
 * @LastEditTime: 2022-04-12 19:26:05
>>>>>>> master
 * @Description:页面级弹窗，弹窗弹出时，跳转页面不会覆盖该页面
 */
/**
 * Created by sybil052 on 2017/6/19.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Easing,
    Dimensions,
    TouchableOpacity,
    Keyboard,
    Platform,
    BackHandler,
    TouchableWithoutFeedback,
} from 'react-native';
import {constants} from './util';
import Icon from 'react-native-vector-icons/AntDesign';
import {px} from '../../utils/appUtil';
const {width, height} = Dimensions.get('window');
export default class PageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            keyboardHeight: 0,
            containerHeight: height, //容器
            containerWidth: width,
            height: height, //内容高度
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
        backButtonClose: false,
        animateDuration: 400,
    };
    componentDidMount() {
        Keyboard.addListener(Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', this.keyboardWillShow);
        Keyboard.addListener(Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', this.keyboardWillHide);
    }
    keyboardWillShow = (e) => {
        const {offset} = this.state;
        this.setState({keyboardHeight: e.endCoordinates.height});
        Animated.timing(offset, {
            toValue: 2,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    keyboardWillHide = (e) => {
        const {offset} = this.state;
        Animated.timing(offset, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };
    componentWillUnmount() {
        Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow);
        Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide);
        if (this.props.backButtonClose && Platform.OS === 'android')
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    //安卓返回按钮关闭弹窗

    onBackPress = () => {
        this.cancel();
        return true;
    };

    onContainerLayout = (evt) => {
        const _height = evt.nativeEvent.layout.height;
        const _width = evt.nativeEvent.layout.width;
        if (_height == this.state.containerHeight && _width == this.state.containerWidth) {
            return;
        }
        if (!this.state.hide) {
            this.in();
        }
        this.setState({
            containerHeight: _height,
            containerWidth: _width,
        });
    };
    onViewLayout = (evt) => {
        const _height = evt.nativeEvent.layout.height;
        const _width = evt.nativeEvent.layout.width;
        // If the dimensions are still the same we're done
        let newState = {};
        if (_height !== this.state.height) newState.height = _height;
        if (_width !== this.state.width) newState.width = _width;
        this.setState(newState);
        if (this.onViewLayoutCalculated) this.onViewLayoutCalculated();
    };
    renderBackDrop = () => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.props.isTouchMaskToClose && this.cancel();
                }}>
                <Animated.View importantForAccessibility="no" style={[styles.absolute, {opacity: this.state.opacity}]}>
                    <View style={[styles.absolute, styles.mask]} />
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    };
    renderHeader = () => {
        const {title, header, sub_title, confirmClick, confirmText} = this.props;
        return (
            header || (
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
            )
        );
    };
    renderContent = () => {
        const {children, style} = this.props;
        const size = {
            height: this.state.containerHeight,
            width: this.state.containerWidth,
        };
        return (
            <Animated.View
                importantForAccessibility="no"
                onLayout={this.onViewLayout}
                style={[
                    size,
                    {
                        transform: [
                            {
                                translateY: this.state.offset.interpolate({
                                    inputRange: [0, 1, 2],
                                    outputRange: [
                                        height,
                                        this.state.containerHeight - this.state.height,
                                        this.state.containerHeight - this.state.height - this.state.keyboardHeight,
                                    ],
                                }),
                            },
                        ],
                    },
                    styles.content,
                    style,
                ]}>
                {this.renderHeader()}
                {children}
            </Animated.View>
        );
    };
    render() {
        if (this.state.hide) {
            return <View />;
        } else {
            return (
                <View
                    importantForAccessibility="yes"
                    accessibilityViewIsModal={true}
                    style={[styles.transparent, styles.absolute]}
                    pointerEvents={'box-none'}>
                    <View style={{flex: 1}} pointerEvents={'box-none'} onLayout={this.onContainerLayout}>
                        {!this.state.hide && this.renderBackDrop()}
                        {!this.state.hide && this.renderContent()}
                    </View>
                </View>
            );
        }
    }

    //显示动画
    in = () => {
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                easing: Easing.elastic(0.8), //一个用于定义曲线的渐变函数
                duration: this.props.animateDuration,
                toValue: 1, //动画的最终值
                useNativeDriver: true,
            }),
            Animated.timing(this.state.offset, {
                easing: Easing.elastic(0.8),
                duration: this.props.animateDuration,
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (this.props.backButtonClose && Platform.OS === 'android')
                BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        });
    };

    //隐藏动画
    out = () => {
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                easing: Easing.elastic(0.8),
                duration: this.props.animateDuration,
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.offset, {
                easing: Easing.elastic(0.8),
                duration: this.props.animateDuration,
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start(() => {
            this.setState({hide: true});
            this.state.offset.setValue(0);
        });
    };

    //取消
    cancel = () => {
        if (!this.state.hide) {
            this.out();
            if (this.props.backButtonClose && Platform.OS === 'android')
                BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        }
    };

    show = () => {
        if (this.state.hide) {
            this.onViewLayoutCalculated = () => {
                this.in();
                // BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
                this.onViewLayoutCalculated = null;
            };
            this.setState({hide: false});
        }
    };

    hide = () => {
        if (!this.state.hide) {
            this.setState({hide: true}, this.out);
        }
    };
}

const styles = StyleSheet.create({
    transparent: {
        zIndex: 2,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },

    mask: {
        backgroundColor: '#000000',
        opacity: 0.5,
        zIndex: 10,
    },
    content: {
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
