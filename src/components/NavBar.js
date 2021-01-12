/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-12 10:44:48
 * @Description:头部组件
 */

import React,{useRef} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Animated, TouchableOpacity, TouchableNativeFeedback, Platform} from 'react-native';
import {px as px2dp} from '../utils/appUtil';
import Icon from 'react-native-vector-icons/Feather';
import {Colors} from '../common/commonStyle';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; //获取安全区域高度
const topbarHeight = Platform.OS == 'ios' ? 44 : 50;

NavBar.propTypes = {
    title: PropTypes.string,
    leftIcon: PropTypes.string,
    rightIcon: PropTypes.string,
    leftPress: PropTypes.func,
    rightPress: PropTypes.func,
    style: PropTypes.object,
    titleStyle:PropTypes.object,
};
 function NavBar(props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const navRef = useRef(null)
    //返回
    const back = () => {
        navigation.goBack();
    };
    const renderBtn = (pos) => {
        let render = (obj) => {
            const {name, onPress} = obj;
            if (Platform.OS === 'android') {
                return (
                    <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
                        <Icon name={name} size={px2dp(26)} color={Colors.navTitleColor} />
                    </TouchableNativeFeedback>
                );
            } else {
                return (
                    <TouchableOpacity onPress={onPress} style={styles.btn}>
                        <Icon name={name} size={px2dp(26)} color={Colors.navTitleColor} />
                    </TouchableOpacity>
                );
            }
        };
        if (pos == 'left') {
            if (props.leftIcon) {
                return render({
                    name: props.leftIcon,
                    onPress: props.leftPress || back,
                });
            } else {
                return <View style={styles.btn} />;
            }
        } else if (pos == 'right') {
            if (props.rightIcon) {
                return render({
                    name: props.rightIcon,
                    onPress: props.rightPress,
                });
            } else {
                return <View style={styles.btn} />;
            }
        }
    };
    const {scrollY,style,titleStyle} = props;
    let opacityPercent = scrollY / 50
    if(navRef&&navRef.current){
        if (scrollY < 50) {
            navRef.current.setNativeProps({
                style: {opacity: opacityPercent}
            })
        } else {
           navRef.current.setNativeProps({
                style: {opacity: 1}
            })
        }
    }
    return (
        <View ref={navRef} style={[styles.topbar,style, {paddingTop: insets.top, height: insets.top + topbarHeight}]}>
            {renderBtn('left')}
            <Animated.Text numberOfLines={1} style={[styles.title,titleStyle]}>
                {props.title}
            </Animated.Text>
            {renderBtn('right')}
        </View>
    );
}
const styles = StyleSheet.create({
    topbar: {
        backgroundColor: Colors.navBgColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex:10
        // paddingTop: statusBar,
    },
    btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: Colors.navTitleColor,
        fontWeight: 'bold',
        fontSize: px2dp(16),
    },
});
export default NavBar
