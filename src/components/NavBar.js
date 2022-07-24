/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-30 17:10:01
 * @Description:头部组件
 */

import React, {useRef} from 'react';
import {StyleSheet, View, Animated, TouchableOpacity, TouchableNativeFeedback, Platform, Text} from 'react-native';
import {deviceWidth, px, px as px2dp} from '../utils/appUtil';
import Icon from 'react-native-vector-icons/Feather';
import {Colors} from '../common/commonStyle';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
import FastImage from 'react-native-fast-image';
const topbarHeight = px2dp(44);

// NavBar.propTypes = {
//     title: PropTypes.string,
//     leftIcon: PropTypes.string,
//     rightIcon: PropTypes.string,
//     leftPress: PropTypes.func,
//     rightPress: PropTypes.func,
//     style: PropTypes.object,
//     titleStyle: PropTypes.object,
//     rightText: PropTypes.string,
//     rightTextStyle: PropTypes.object,
//     fontStyle: PropTypes.object,
// };
// NavBar.defaultProps = {
//     title: '123',
// };
const NavBar = React.forwardRef((props, ref) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const navRef = useRef(null);
    const navBarHeight = insets.top + topbarHeight;
    React.useImperativeHandle(ref, () => {
        return {
            navBarHeight,
        };
    });
    //返回
    const back = () => {
        navigation.goBack();
    };
    const renderBtn = (pos) => {
        let render = (obj) => {
            const {name, onPress} = obj;
            if (Platform.OS === 'android') {
                return (
                    <TouchableNativeFeedback activeOpacity={0.8} onPress={onPress} style={styles.btn}>
                        <Icon
                            name={name}
                            size={props?.fontStyle?.fontSize ? props.fontStyle.fontSize : px2dp(28)}
                            color={props.fontStyle ? props.fontStyle.color : Colors.navTitleColor}
                        />
                    </TouchableNativeFeedback>
                );
            } else {
                return (
                    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.btn}>
                        <Icon
                            name={name}
                            size={props?.fontStyle?.fontSize ? props.fontStyle.fontSize : px2dp(26)}
                            color={props.fontStyle ? props.fontStyle.color : Colors.navTitleColor}
                        />
                    </TouchableOpacity>
                );
            }
        };
        if (pos == 'left') {
            if (props.renderLeft) {
                return <>{props.renderLeft}</>;
            }
            if (props.leftIcon) {
                return render({
                    name: props.leftIcon,
                    onPress: props.leftPress || back,
                });
            } else {
                return <View style={styles.btn} />;
            }
        } else if (pos == 'right') {
            if (props.renderRight) {
                return <>{props.renderRight}</>;
            }
            if (props.rightIcon) {
                return render({
                    name: props.rightIcon,
                    onPress: props.rightPress,
                });
            } else if (props.rightText) {
                return (
                    <TouchableOpacity style={props.rightTextStyle} onPress={props.rightPress}>
                        <Text style={props.fontStyle ? props.fontStyle : styles.text_ty}>{props.rightText}</Text>
                    </TouchableOpacity>
                );
            } else {
                return <View style={styles.btn} />;
            }
        }
    };
    const {scrollY, style, titleStyle} = props;
    let opacityPercent = scrollY / 50;
    if (navRef && navRef.current && scrollY) {
        if (scrollY < 50) {
            // console.log(opacityPercent);
            navRef.current.setNativeProps({
                style: {opacity: opacityPercent},
            });
        } else {
            // console.log(opacityPercent);
            navRef.current.setNativeProps({
                style: {opacity: 1},
            });
        }
    }
    return (
        <View ref={navRef} style={[styles.topbar, style, {paddingTop: insets.top, height: navBarHeight}]}>
            {renderBtn('left')}
            {props.titleIcon ? (
                <View style={styles.titleWrap}>
                    {!!props.titleIcon && (
                        <FastImage
                            source={{uri: props.titleIcon}}
                            style={{width: px(22), height: px(22), marginRight: px(4)}}
                        />
                    )}
                    <Animated.Text numberOfLines={1} style={[styles.title, titleStyle, props.fontStyle]}>
                        {props.title}
                    </Animated.Text>
                </View>
            ) : (
                <Animated.Text numberOfLines={1} style={[styles.title, styles.titleWrap, titleStyle, props.fontStyle]}>
                    {props.title}
                </Animated.Text>
            )}
            {renderBtn('right')}
        </View>
    );
});
const styles = StyleSheet.create({
    topbar: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        width: deviceWidth,
        paddingHorizontal: px2dp(10),
    },
    btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    titleWrap: {
        width: px(200),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: px(12),
        position: 'absolute',
        left: (deviceWidth - px(200)) / 2,
    },
    title: {
        color: Colors.navTitleColor,
        fontWeight: 'bold',
        fontSize: px2dp(17),
        flex: 1,
        textAlign: 'center',
    },
    text_ty: {
        // marginRight: px2dp(16),
    },
});
export default NavBar;
