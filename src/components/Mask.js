/*
 * @Date: 2021-01-19 13:09:46
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-05 18:37:02
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
            </RootSiblingPortal>
        );
    }
}
