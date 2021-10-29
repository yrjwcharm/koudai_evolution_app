/*
 * @Date: 2021-09-27 10:09:50
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-09-27 10:21:21
 * @Description: 页面加载组件
 */
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Colors, Style} from '../../../common/commonStyle';
import {deviceHeight, deviceWidth} from '../../../utils/appUtil';
import PropTypes from 'prop-types';

const PageLoading = (props) => {
    const {color = Colors.lightGrayColor} = props;
    return (
        <View
            style={[
                Style.flexCenter,
                {width: deviceWidth, height: deviceHeight, position: 'absolute', top: 0, left: 0, zIndex: 99},
            ]}>
            <ActivityIndicator color={color} />
        </View>
    );
};

PageLoading.propTypes = {
    color: PropTypes.string,
};

export default PageLoading;
