/*
 * @Date: 2021-01-15 16:51:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-11 17:43:19
 * @Description:app引导页
 */

import React, {Component} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {deviceWidth, deviceHeight} from '../../../utils/appUtil';

const styles = StyleSheet.create({
    imgage: {
        width: deviceWidth,
        height: deviceHeight,
        // resizeMode: 'contain',
    },
});

export default class SwiperComponent extends Component {
    render() {
        return (
            <Swiper style={styles.wrapper} loop={false}>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <FastImage source={require('../../../assets/img/appGuide/slider1.jpg')} style={styles.imgage} />
                </View>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <FastImage source={require('../../../assets/img/appGuide/slider1.jpg')} style={styles.imgage} />
                </View>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <FastImage source={require('../../../assets/img/appGuide/slider3.png')} style={styles.imgage} />
                </View>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <FastImage source={require('../../../assets/img/appGuide/slider2.jpg')} style={styles.imgage} />
                </View>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <FastImage source={require('../../../assets/img/appGuide/slider1.jpg')} style={styles.imgage} />
                </View>
            </Swiper>
        );
    }
}
