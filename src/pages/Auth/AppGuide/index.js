/*
 * @Date: 2021-01-15 16:51:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-11 11:27:49
 * @Description:app引导页
 */

import React, {useEffect} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {deviceWidth, deviceHeight, px} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import Storage from '../../../utils/storage';
import _ from 'lodash';
const styles = StyleSheet.create({
    imgage: {
        width: deviceWidth,
        height: deviceHeight,
        // resizeMode: 'contain',
    },
});

export default function AppGuide({navigation}) {
    return (
        <Swiper style={styles.wrapper} loop={false} activeDotStyle={{width: px(21), backgroundColor: '#0051CC'}}>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <FastImage
                    source={require('../../../assets/img/appGuide/slider1.png')}
                    style={styles.imgage}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <FastImage
                    source={require('../../../assets/img/appGuide/slider2.png')}
                    style={styles.imgage}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <FastImage
                    source={require('../../../assets/img/appGuide/slider3.png')}
                    style={styles.imgage}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <FastImage
                    source={require('../../../assets/img/appGuide/slider4.png')}
                    style={styles.imgage}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <Button
                    title={'开启理财魔方'}
                    style={{
                        position: 'absolute',
                        bottom: px(100),
                        width: px(163),
                        borderRadius: px(30),
                        left: (deviceWidth - px(163)) / 2,
                    }}
                    onPress={_.debounce(() => {
                        Storage.save('AppGuide', true);
                        navigation.replace('Tab');
                    }, 500)}
                />
            </View>
        </Swiper>
    );
}
