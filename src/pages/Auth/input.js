/*
 * @Date: 2021-01-14 17:08:04
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-16 11:34:41
 * @Description:
 */
import React, {forwardRef, useImperativeHandle} from 'react';
import {Colors, Style} from '../../common/commonStyle';
import {px as text, px} from '../../utils/appUtil';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
const Input = (props, ref) => {
    const inputRef = React.useRef(null);
    useImperativeHandle(ref, () => ({origin: inputRef.current}));
    useFocusEffect(
        React.useCallback(() => {
            if (props.autoFocus) {
                const isFocused = inputRef.current?.isFocused();
                if (!isFocused) {
                    inputRef.current?.focus();
                }
            }
        }, [props.autoFocus])
    );
    return (
        <View style={[styles.login_input_tel, props.style]}>
            <View style={styles.lable}>
                <Text style={styles.inputLeftText}>{props.title}</Text>
                <View style={styles.line} />
            </View>
            <TextInput
                ref={inputRef}
                {...props}
                style={[styles.input, {fontSize: px(16)}]}
                placeholderTextColor={Colors.placeholderColor}
                underlineColorAndroid="transparent"
            />
        </View>
    );
};

export default forwardRef(Input);
const styles = StyleSheet.create({
    inputLeftText: {
        fontSize: text(16),
        color: Colors.lightBlackColor,
    },
    lable: {width: text(80), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'},
    line: {
        backgroundColor: Colors.lightBlackColor,
        width: px(1),
        height: px(12),
    },
    login_input_tel: {
        height: text(50),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBg,
        borderRadius: text(6),
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
