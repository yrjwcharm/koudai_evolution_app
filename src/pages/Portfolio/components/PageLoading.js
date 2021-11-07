/*
 * @Date: 2021-09-27 10:09:50
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-07 10:32:25
 * @Description: 页面加载组件
 */
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Colors, Style} from '../../../common/commonStyle';
import {deviceHeight, deviceWidth} from '../../../utils/appUtil';
import PropTypes from 'prop-types';
import {useHeaderHeight} from '@react-navigation/stack';

const PageLoading = (props) => {
    const headerHeight = useHeaderHeight();
    const {color = Colors.lightGrayColor} = props;
    return (
        <View
            style={[
                Style.flexCenter,
                {
                    width: deviceWidth,
                    height: deviceHeight - headerHeight,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 99,
                },
            ]}>
            <ActivityIndicator color={color} />
        </View>
    );
};

PageLoading.propTypes = {
    color: PropTypes.string,
};

export default PageLoading;
