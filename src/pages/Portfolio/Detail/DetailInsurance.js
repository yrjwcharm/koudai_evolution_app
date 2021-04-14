/*
 * @Date: 2021-04-14 17:43:17
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-14 17:53:45
 * @Description:保险
 */
import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {deviceWidth} from '../../../utils/appUtil';
const DetailInsurance = () => {
    useEffect(() => {}, []);
    return (
        <ScrollView>
            <FastImage
                style={{width: deviceWidth, height: 1600}}
                source={require('../../../assets/img/detail/insurance.png')}
            />
        </ScrollView>
    );
};

export default DetailInsurance;

const styles = StyleSheet.create({});
