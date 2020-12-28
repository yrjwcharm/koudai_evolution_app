/*
 * @Date: 2020-12-23 16:39:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-25 16:33:15
 * @Description:头部组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Animated, TouchableOpacity, TouchableNativeFeedback, Platform, StatusBar} from 'react-native';
import {px as px2dp, isIphoneX} from '../utils/appUtil';
import Icon from 'react-native-vector-icons/Feather';
import {commonStyle} from '../common/commonStyle';
import {useNavigation} from '@react-navigation/native';
const statusBar = Platform.select({
    ios: isIphoneX ? 46 : 20,
    android: StatusBar.currentHeight,
});
const topbarHeight = Platform.OS == 'ios' ? 44 : 50;

NavBar.propTypes = {
    title: PropTypes.string,
    leftIcon: PropTypes.string,
    rightIcon: PropTypes.string,
    leftPress: PropTypes.func,
    rightPress: PropTypes.func,
    style: PropTypes.object,
};

export default function NavBar(props) {
    const navigation = useNavigation();
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
                        <Icon name={name} size={px2dp(26)} color="#fff" />
                    </TouchableNativeFeedback>
                );
            } else {
                return (
                    <TouchableOpacity onPress={onPress} style={styles.btn}>
                        <Icon name={name} size={px2dp(26)} color="#fff" />
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

    return (
        <View style={[styles.topbar, props.style]}>
            {renderBtn('left')}
            <Animated.Text numberOfLines={1} style={[styles.title, props.titleStyle]}>
                {props.title}
            </Animated.Text>
            {renderBtn('right')}
        </View>
    );
}
const styles = StyleSheet.create({
    topbar: {
        height: topbarHeight + statusBar,
        backgroundColor: commonStyle.themeColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: statusBar,
    },
    btn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: px2dp(16),
    },
});
