/*
 * @Date: 2022-02-16 10:48:08
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-21 16:11:23
 * @Description:直播动态头像组建
 */
import {StyleSheet, View} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import {px} from '../utils/appUtil';

const AnimateAvatar = (data) => {
    const zoomImageOut = {
        0: {
            scale: 1,
        },
        0.5: {
            scale: 0.9,
        },
        1: {
            scale: 1,
        },
    };
    const zoomBorderOut = {
        0: {
            scale: 1,
            opacity: 1,
        },
        1: {
            scale: 1.1,
            opacity: 0,
        },
    };
    return (
        <View>
            <Animatable.View
                animation={zoomBorderOut}
                iterationCount={'infinite'}
                style={[styles.animate_border, data?.style]}
                duration={1500}
            />
            <Animatable.Image
                animation={zoomImageOut}
                iterationCount={'infinite'}
                duration={1500}
                source={{
                    uri: data.source,
                }}
                style={[styles.avatar, data?.style]}
            />
        </View>
    );
};

export default AnimateAvatar;

const styles = StyleSheet.create({
    animate_border: {
        borderColor: 'red',
        width: px(26),
        height: px(26),
        borderWidth: px(1),
        borderRadius: px(15),
        position: 'absolute',
    },

    avatar: {
        width: px(26),
        height: px(26),
        borderColor: 'red',
        borderWidth: px(1),
        borderRadius: px(20),
        position: 'relative',
        zIndex: 10,
    },
});
