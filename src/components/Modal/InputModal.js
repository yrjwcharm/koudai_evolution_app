/*
 * @Date: 2021-03-09 17:09:23
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-13 11:04:36
 * @Description: 带输入框的弹窗
 */
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Animated, Keyboard, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Picker from 'react-native-picker';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';
import Mask from '../Mask';
import {px as text, deviceHeight, deviceWidth} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {constants} from './util';

const InputModal = forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    const {
        backdrop,
        /**
         * 点击确认按钮
         */
        children,
        confirmClick,
        confirmText = '确定',
        header,
        isTouchMaskToClose,
        title,
    } = props;
    const [visible, setVisible] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    const show = () => {
        setVisible(true);
    };
    const hide = () => {
        setVisible(false);
    };
    const toastShow = (t, duration = 2000) => {
        setToastText(t);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setToastText('');
        }, duration);
    };
    const onDone = useCallback(() => {
        // setVisible(false);
        confirmClick && confirmClick();
    }, [confirmClick]);
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
            toastShow: toastShow,
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
                        {children}
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
            <Modal animationType={'fade'} onRequestClose={() => setShowToast(false)} transparent visible={showToast}>
                <View style={[Style.flexCenter, styles.toastContainer]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>{toastText}</Text>
                    </View>
                </View>
            </Modal>
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
        width: text(60),
        height: constants.titleHeight,
    },
    confirm: {
        position: 'absolute',
        right: text(20),
        height: constants.titleHeight,
    },
    title: {
        fontSize: Font.textH1,
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    toastContainer: {
        flex: 1,
        height: deviceHeight,
        width: deviceWidth,
    },
    textContainer: {
        padding: 10,
        backgroundColor: '#1E1F20',
        opacity: 0.8,
        borderRadius: 5,
    },
    textStyle: {
        fontSize: Font.textH1,
        lineHeight: text(24),
        color: '#fff',
        textAlign: 'center',
    },
});

InputModal.propTypes = {
    backdrop: PropTypes.bool,
    confirmClick: PropTypes.func,
    confirmText: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    isTouchMaskToClose: PropTypes.bool,
    title: PropTypes.string,
};
InputModal.defaultProps = {
    backdrop: true,
    confirmClick: () => {},
    confirmText: '确定',
    isTouchMaskToClose: true,
    title: '请输入',
};

export default InputModal;
