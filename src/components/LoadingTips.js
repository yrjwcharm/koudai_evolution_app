/*
 * @Date: 2022-03-15 11:40:09
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-15 12:01:44
 * @Description:加载提示
 */
import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Style, Colors} from '../common/commonStyle';

const LoadingTips = ({size = 24, type = 'Wave', color = Colors.btnColor, loadingStyle = {}}) => {
    return (
        <View style={[Style.flexCenter, {flex: 1}]}>
            <Spinner isVisible={true} size={size} type={type} color={color} style={loadingStyle} />
        </View>
    );
};

export default LoadingTips;
