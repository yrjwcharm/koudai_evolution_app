/**
 * 蒙层
 */
import React, {Component} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export default class Mask extends Component {
    render() {
        return (
            <View
                style={{
                    height: height,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
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
