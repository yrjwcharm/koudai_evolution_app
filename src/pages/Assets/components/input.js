/*
 * @Date: 2021-01-14 17:08:04
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-02-18 17:44:32
 * @Description: 密码管理输入框
 */
import React from 'react';
import {Colors, Style, Font, Space} from '../../../common/commonStyle';
import {px as text} from '../../../utils/appUtil';
import {View, Text, TextInput, StyleSheet} from 'react-native';
export default function input(props) {
    const {children} = props;
    const leftProps = {...props};
    delete leftProps.children;
    return (
        <View style={[Style.flexRow, styles.login_input_tel, props.style]}>
            <View style={[Style.flexBetween, styles.textContainer]}>
                <Text style={styles.inputLeftText}>{props.title}</Text>
                <Text style={{color: Colors.lightGrayColor}}>|</Text>
            </View>
            <TextInput
                {...leftProps}
                placeholderTextColor={'#bbb'}
                style={styles.input}
                underlineColorAndroid="transparent"
            />
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
        color: Colors.descColor,
    },
    login_input_tel: {
        marginTop: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: text(20),
        borderRadius: Space.borderRadius,
        height: text(56),
        backgroundColor: '#fff',
    },
    input: {
        letterSpacing: 1,
        color: Colors.defaultColor,
        fontSize: Font.textH2,
        flex: 1,
        height: '100%',
        paddingLeft: text(10),
    },
});
