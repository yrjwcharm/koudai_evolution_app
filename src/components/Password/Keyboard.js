/*
 * @Date: 2021-01-05 16:12:36
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-06 13:30:31
 * @Description:数字键盘
 */
import React from 'react';
import {View, Text, TouchableHighlight, Dimensions, StyleSheet, Vibration} from 'react-native';
import {constants} from './util';
import {px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/Feather';
const KeyboardItem = (props) => {
    const {type = 'num', value, style = [], numStyle, onPress = () => {}} = props;

    return (
        <TouchableHighlight style={[styles.keyboardItem, ...style]} underlayColor={'#f5f5f5'} onPress={onPress}>
            {type === 'num' ? <Text style={[styles.text, numStyle]}>{value}</Text> : <Icon name={'delete'} size={18} />}
        </TouchableHighlight>
    );
};

const DATA_SOURCES = [
    [
        {
            type: 'num',
            value: '1',
        },
        {
            type: 'num',
            value: '2',
        },
        {
            type: 'num',
            value: '3',
        },
    ],
    [
        {
            type: 'num',
            value: '4',
        },
        {
            type: 'num',
            value: '5',
        },
        {
            type: 'num',
            value: '6',
        },
    ],
    [
        {
            type: 'num',
            value: '7',
        },
        {
            type: 'num',
            value: '8',
        },
        {
            type: 'num',
            value: '9',
        },
    ],
    [
        {
            type: 'num',
            value: '',
        },
        {
            type: 'num',
            value: '0',
        },
        {
            type: 'image',
            value: 'https://static.licaimofang.com/wp-content/uploads/2020/12/risk_control_icon.png',
        },
    ],
];

const Keyboard = (props) => {
    const onPress = (item) => {
        Vibration.vibrate(10);
        if (item.onPress) {
            item.onPress(item.value);
            return;
        }
        if (item.type === 'num') {
            props.onPress && props.onPress(item.value);
        } else {
            props.onDelete && props.onDelete();
        }
    };

    return (
        <View style={[styles.keyboardView, props.style]}>
            {(props.dataSources || DATA_SOURCES).map((items, i) => {
                return (
                    <View style={[styles.itemView, props.rowStyle]} key={i}>
                        {items.map((item, j) => {
                            const withBorder = Math.round(items.length / 2) === j + 1;
                            return (
                                <KeyboardItem
                                    key={`${i}-${j}`}
                                    type={item.type}
                                    value={item.value}
                                    style={[withBorder ? styles.border : {}, item.numStyle || {}]}
                                    onPress={() => {
                                        onPress(item);
                                    }}
                                />
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        width: Dimensions.get('window').width,
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
    },
    itemView: {
        flexDirection: 'row',
        borderTopWidth: constants.borderWidth,
        borderTopColor: constants.borderColor,
    },
    keyboardItem: {
        flex: 1,
        height: px(48),
        backgroundColor: '#feffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    border: {
        borderLeftWidth: constants.borderWidth,
        borderLeftColor: constants.borderColor,
        borderRightWidth: constants.borderWidth,
        borderRightColor: constants.borderColor,
    },
    text: {
        fontSize: 22,
        color: '#333333',
    },
});

export default Keyboard;
