/*
 * @Date: 2021-01-19 13:09:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-22 16:14:09
 * @Description:蒙层
 */

import React, {Component} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
const width = Dimensions.get('window').width;
export default class Mask extends Component {
    render() {
        return (
            <View
                style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: width,
                    zIndex: 100,
                }}>
                <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                        this.props.onClick && this.props.onClick();
                    }}
                />
            </View>
        );
    }
}
