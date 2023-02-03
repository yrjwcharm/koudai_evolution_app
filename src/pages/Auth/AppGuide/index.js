/*
 * @Date: 2021-01-15 16:51:48
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-03 12:11:06
 * @Description:app引导页
 */

import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {deviceWidth, deviceHeight, px} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import Storage from '../../../utils/storage';
import SplashScreen from 'react-native-splash-screen';
import _ from 'lodash';
const styles = StyleSheet.create({
    imgage: {
        width: deviceWidth,
        height: deviceHeight,
        // resizeMode: 'contain',
    },
});

const image1 = require('../../../assets/img/appGuide/fundSlider.png');
const image2 = require('../../../assets/img/appGuide/largeslider2.jpg');
const image4 = require('../../../assets/img/appGuide/largeslider4.jpg');
const image5 = require('../../../assets/img/appGuide/largeslider5.jpg');
const image1_1 = require('../../../assets/img/appGuide/largeslider1_1.jpg');
export default function AppGuide({navigation}) {
    useEffect(() => {
        SplashScreen.hide();
    }, []);
    return (
        <Swiper style={styles.wrapper} loop={false} activeDotStyle={{width: px(21), backgroundColor: '#0051CC'}}>
            <View style={{flex: 1, backgroundColor: '#C6322C'}}>
                <FastImage source={image1_1} style={styles.imgage} />
            </View>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={_.debounce(
                    () => {
                        Storage.save('AppGuide', true);
                        navigation.replace('Tab');
                    },
                    500,
                    {leading: true, trailing: false}
                )}
                style={{flex: 1, backgroundColor: '#C6322C'}}>
                <FastImage source={image1} style={styles.imgage} />
            </TouchableOpacity>
            {/* <View style={{flex: 1, backgroundColor: '#fff'}}>
                <FastImage source={image2} style={styles.imgage} resizeMode={FastImage.resizeMode.contain} />
            </View>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <FastImage source={image4} style={styles.imgage} resizeMode={FastImage.resizeMode.contain} />
            </View> */}
        </Swiper>
    );
}
