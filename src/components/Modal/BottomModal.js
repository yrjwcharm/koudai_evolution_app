/*
 * @Date: 2021-01-08 11:43:44
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-11 15:44:16
 * @Description: 底部弹窗
 */
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Keyboard, View, Text, Modal, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Picker from 'react-native-picker';
import PropTypes from 'prop-types';
import {constants} from './util';
import {deviceHeight, deviceWidth, isIphoneX, px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors, Font, Style} from '../../common/commonStyle';
import Mask from '../Mask';
const BottomModal = React.forwardRef((props, ref) => {
    const {
        backdrop = true,
        header,
        headerStyle,
        title = '请选择',
        sub_title = '',
        confirmText = '',
        children = <Text />,
        style = {},
        /**
         * 点击确认按钮
         */
        onDone = () => {},
        isTouchMaskToClose = true,
        backButtonClose = true,
        onClose = () => {},
        destroy = () => {},
        showClose = true,
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
        destroy && destroy();
        onClose && onClose();
    };

    const confirmClick = () => {
        setVisible(false);
        destroy && destroy();
        onDone && onDone();
    };
    const toastShow = (t, duration = 2000, {onHidden} = {}) => {
        setToastText(t);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setToastText('');
            onHidden && onHidden();
        }, duration);
    };
    // 键盘调起
    const keyboardWillShow = (e) => {
        Animated.timing(keyboardHeight, {
            toValue: e.endCoordinates.height,
            duration: e.duration,
            useNativeDriver: false,
        }).start();
    };
    // 键盘隐藏
    const keyboardWillHide = (e) => {
        Animated.timing(keyboardHeight, {
            toValue: 0,
            duration: e.duration,
            useNativeDriver: false,
        }).start();
    };
    useEffect(() => {
        Picker.hide();
        Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        Keyboard.addListener('keyboardWillHide', keyboardWillHide);
        return () => {
            Picker.hide();
            Keyboard.removeListener('keyboardWillShow', keyboardWillShow);
            Keyboard.removeListener('keyboardWillHide', keyboardWillHide);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
            toastShow: toastShow,
        };
    });
    return (
        <Modal
            animationType={'slide'}
            visible={visible}
            onRequestClose={backButtonClose ? hide : () => {}}
            transparent={true}>
            {backdrop && !global.rootSibling && <Mask />}
            <TouchableOpacity
                activeOpacity={1}
                onPress={isTouchMaskToClose ? hide : () => {}}
                style={[styles.container]}>
                <Animated.View style={{position: 'relative', bottom: keyboardHeight}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.con, style]}>
                        {header || (
                            <View style={[styles.header, headerStyle]}>
                                {showClose && (
                                    <TouchableOpacity style={styles.close} onPress={hide}>
                                        <Icon color={Colors.descColor} name={'close'} size={18} />
                                    </TouchableOpacity>
                                )}
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.title}>{title}</Text>
                                    {sub_title ? <Text style={styles.sub_title}>{sub_title}</Text> : null}
                                </View>
                                {confirmText ? (
                                    <TouchableOpacity style={[styles.confirm]} onPress={confirmClick}>
                                        <Text style={{fontSize: px(14), color: '#0051CC'}}>{confirmText}</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        )}
                        {children}
                    </TouchableOpacity>
                </Animated.View>
                <Modal
                    animationType={'fade'}
                    onRequestClose={() => setShowToast(false)}
                    transparent
                    visible={showToast}>
                    <View style={[Style.flexCenter, styles.toastContainer]}>
                        <View style={styles.textContainer}>
                            <Text style={styles.textStyle}>{toastText}</Text>
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'relative',
        zIndex: 100,
    },
    con: {
        paddingBottom: isIphoneX() ? 34 : 20,
        backgroundColor: '#fff',
        minHeight: constants.bottomMinHeight,
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
        overflow: 'hidden',
    },
    header: {
        paddingVertical: px(16),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
    },
    close: {
        position: 'absolute',
        right: 0,
        left: 0,
        width: 60,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirm: {
        position: 'absolute',
        right: 20,
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: Font.textH1,
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    sub_title: {
        fontSize: px(13),
        color: '#EB7121',
        marginTop: px(6),
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
        lineHeight: px(24),
        color: '#fff',
        textAlign: 'center',
    },
});

BottomModal.propTypes = {
    backdrop: PropTypes.bool,
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    title: PropTypes.string,
    confirmText: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    onDone: PropTypes.func,
    isTouchMaskToClose: PropTypes.bool,
};

export default BottomModal;
