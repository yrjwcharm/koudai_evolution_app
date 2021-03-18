/*
 * @Date: 2021-01-15 16:51:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-18 10:46:49
 * @Description:app引导页
 */

import React, {useEffect} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {deviceWidth, deviceHeight} from '../../../utils/appUtil';
import {Button} from '../../../components/Button';
import Storage from '../../../utils/storage';
const styles = StyleSheet.create({
    imgage: {
        width: deviceWidth,
        height: deviceHeight,
        // resizeMode: 'contain',
    },
});

export default function AppGuide({navigation}) {
    useEffect(() => {
        Storage.save('AppGuide', true);
    }, []);
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
                <Button
                    title={'进入魔方'}
                    style={{position: 'absolute', bottom: 100, right: 100}}
                    onPress={() => {
                        navigation.replace('Tab');
                    }}
                />
            </View>
        </Swiper>
    );
}
