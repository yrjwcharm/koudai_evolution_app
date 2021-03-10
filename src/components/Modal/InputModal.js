/*
 * @Date: 2021-03-09 17:09:23
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-09 19:02:47
 * @Description: 带输入框的弹窗
 */
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Animated, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Picker from 'react-native-picker';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';
import Mask from '../Mask';
import Toast from '../Toast';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {constants} from './util';

const InputModal = forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    const {
        backdrop,
        /**
         * 点击确认按钮
         */
        confirmClick,
        confirmText,
        defaultValue,
        header,
        isTouchMaskToClose,
        keyboardType,
        placeholder,
        title,
        unit,
    } = props;
    const [value, setValue] = useState(defaultValue || '');
    const [visible, setVisible] = useState(false);
    const valRef = useRef(defaultValue || '');
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    const show = useCallback(() => {
        setVisible(true);
        setValue(defaultValue);
    }, [defaultValue]);
    const hide = () => {
        setVisible(false);
    };
    const onDone = useCallback(() => {
        if (valRef.current.length === 0) {
            setVisible(false);
            Toast.show(placeholder);
            return false;
        }
        setVisible(false);
        confirmClick && confirmClick(valRef.current);
    }, [confirmClick, placeholder]);
    const onChange = (val) => {
        // console.log(val);
        valRef.current = val;
        setValue(val);
    };
    // 键盘调起
    const keyboardWillShow = useCallback(
        (e) => {
            Animated.timing(keyboardHeight, {
                toValue: e.endCoordinates.height,
                duration: e.duration,
                useNativeDriver: false,
            }).start();
        },
        [keyboardHeight]
    );
    // 键盘隐藏
    const keyboardWillHide = useCallback(
        (e) => {
            Animated.timing(keyboardHeight, {
                toValue: 0,
                duration: e.duration,
                useNativeDriver: false,
            }).start();
        },
        [keyboardHeight]
    );
    useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });

    useEffect(() => {
        Picker.hide();
        Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        Keyboard.addListener('keyboardWillHide', keyboardWillHide);
        return () => {
            Picker.hide();
            Keyboard.removeListener('keyboardWillShow', keyboardWillShow);
            Keyboard.removeListener('keyboardWillHide', keyboardWillHide);
        };
    }, [keyboardWillShow, keyboardWillHide]);

    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            {backdrop && <Mask />}
            <TouchableOpacity activeOpacity={1} onPress={isTouchMaskToClose ? hide : () => {}} style={styles.container}>
                <Animated.View style={{position: 'relative', bottom: keyboardHeight}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.con, {paddingBottom: keyboardHeight === 0 ? insets.bottom : 0}]}>
                        {header || (
                            <View style={[Style.flexCenter, styles.header]}>
                                <TouchableOpacity style={[Style.flexCenter, styles.close]} onPress={hide}>
                                    <Icon name={'close'} size={18} />
                                </TouchableOpacity>
                                <Text style={styles.title}>{title}</Text>
                                {confirmText ? (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={[Style.flexCenter, styles.confirm]}
                                        onPress={onDone}>
                                        <Text style={{fontSize: Font.textH2, color: Colors.brandColor}}>
                                            {confirmText}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        )}
                        <View style={{backgroundColor: '#fff'}}>
                            <View style={[Style.flexRow, styles.inputContainer]}>
                                {unit && <Text style={[styles.unit, {marginRight: text(4)}]}>{unit}</Text>}
                                <TextInput
                                    autoFocus={true}
                                    clearButtonMode={'while-editing'}
                                    keyboardType={keyboardType}
                                    onChangeText={onChange}
                                    placeholder={placeholder}
                                    style={[styles.input]}
                                    value={value}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    con: {
        backgroundColor: '#fff',
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
    },
    header: {
        paddingVertical: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderBottomColor: Colors.borderColor,
    },
    close: {
        position: 'absolute',
        right: 0,
        left: 0,
        width: 60,
        height: constants.titleHeight,
    },
    confirm: {
        position: 'absolute',
        right: 20,
        height: constants.titleHeight,
    },
    title: {
        fontSize: Font.textH1,
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    inputContainer: {
        marginVertical: text(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    unit: {
        fontSize: text(20),
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
});

InputModal.propTypes = {
    backdrop: PropTypes.bool,
    confirmClick: PropTypes.func,
    confirmText: PropTypes.string,
    defaultValue: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    isTouchMaskToClose: PropTypes.bool,
    keyboardType: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    unit: PropTypes.string,
};
InputModal.defaultProps = {
    backdrop: true,
    confirmClick: () => {},
    confirmText: '确定',
    defaultValue: '',
    isTouchMaskToClose: true,
    keyboardType: 'decimal-pad',
    placeholder: '请输入',
    title: '请输入',
    unit: '￥',
};

export default InputModal;
