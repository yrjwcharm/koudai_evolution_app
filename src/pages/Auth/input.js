/*
 * @Date: 2021-01-14 17:08:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-14 18:12:44
 * @Description:
 */
import React from 'react';
import {Colors} from '../../common/commonStyle';
import {px as text} from '../../utils/appUtil';
import {View, Text, TextInput, StyleSheet} from 'react-native';
export default function input(props) {
    return (
        <View style={styles.login_input_tel}>
            <Text style={styles.inputLeftText}>
                {props.title} <Text style={{color: Colors.lightGrayColor}}>&nbsp;&nbsp;&nbsp;|</Text>
            </Text>
            <TextInput {...props} style={styles.input} />
        </View>
    );
}
const styles = StyleSheet.create({
    inputLeftText: {
        fontSize: text(16),
        color: '#4E556C',
    },
    login_input_tel: {
        height: text(50),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: text(14),
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
