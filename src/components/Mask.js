/*
 * @Date: 2021-01-19 13:09:46
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-14 15:05:12
 * @Description:蒙层
 */

import React, {Component} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import {RootSiblingPortal} from 'react-native-root-siblings';

const width = Dimensions.get('window').width;
export default class Mask extends Component {
    render() {
        return (
            <RootSiblingPortal>
                <View
                    style={{
                        backgroundColor: this.props.bgColor || 'rgba(0,0,0,0.6)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: width,
                        zIndex: 80,
                    }}>
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                            this.props.onClick && this.props.onClick();
                        }}
                    />
                </View>
            </RootSiblingPortal>
        );
    }
}
