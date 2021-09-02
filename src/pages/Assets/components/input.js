/*
 * @Date: 2021-01-14 17:08:04
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-31 16:13:23
 * @Description: 密码管理输入框
 */
import React from 'react';
import {Colors, Style, Font, Space} from '../../../common/commonStyle';
import {px as text} from '../../../utils/appUtil';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
export default function input(props) {
    const {children} = props;
    const leftProps = {...props};
    delete leftProps.children;
    delete leftProps.onPress;
    const onPress = () => {
        props.onPress && props.onPress();
    };
    return (
        <View activeOpacity={1} onPress={onPress} style={[Style.flexRow, styles.login_input_tel, props.style]}>
            <View style={[Style.flexBetween, styles.textContainer]}>
                <Text style={styles.inputLeftText}>{props.title}</Text>
                <Text style={{color: Colors.lightGrayColor}}>|</Text>
            </View>
            {props.editable === false ? (
                <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[Style.flexRow, styles.selectBox]}>
                    <Text style={[styles.inputText, {color: props.value ? Colors.defaultColor : '#bbb'}]}>
                        {props.value || props.placeholder}
                    </Text>
                </TouchableOpacity>
            ) : (
                <TextInput
                    {...leftProps}
                    placeholderTextColor={'#bdc2cc'}
                    style={styles.input}
                    underlineColorAndroid="transparent"
                />
            )}
            {children}
        </View>
    );
}
const styles = StyleSheet.create({
    textContainer: {
        width: text(80),
        height: '100%',
    },
    inputLeftText: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: '#545968',
    },
    login_input_tel: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        height: text(56),
        backgroundColor: '#fff',
    },
    input: {
        // letterSpacing: 1,
        color: Colors.defaultColor,
        fontSize: Font.textH3,
        flex: 1,
        height: '100%',
        paddingLeft: text(10),
    },
    selectBox: {
        flex: 1,
        height: '100%',
        paddingLeft: text(10),
    },
    inputText: {
        // letterSpacing: 1,
        color: Colors.defaultColor,
        fontSize: Font.textH2,
    },
});
