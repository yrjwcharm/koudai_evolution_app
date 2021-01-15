/*
 * @Date: 2021-01-14 17:08:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 19:09:40
 * @Description:
 */
import React from 'react';
import {Colors, Style} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import {View, Text, TextInput, StyleSheet} from 'react-native';
export default function input(props) {
    return (
        <View style={[styles.login_input_tel, props.style]}>
            <View style={{width: text(80)}}>
                <Text style={styles.inputLeftText}>{props.title}</Text>
                <Text style={styles.line}>|</Text>
            </View>
            <TextInput {...props} style={styles.input} underlineColorAndroid="transparent" />
        </View>
    );
}
const styles = StyleSheet.create({
    inputLeftText: {
        fontSize: text(16),
        color: '#4E556C',
    },
    line: {
        position: 'absolute',
        color: Colors.lightGrayColor,
        right: 0,
    },
    login_input_tel: {
        height: text(50),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBg,
        borderRadius: 10,
        paddingHorizontal: text(20),
        marginBottom: text(12),
    },
    input: {
        letterSpacing: 1,
        color: '#000',
        fontSize: text(16),
        flex: 1,
        height: '100%',
        paddingLeft: text(6),
    },
    text: {
        color: '#666666',
        fontSize: 12,
    },
});
