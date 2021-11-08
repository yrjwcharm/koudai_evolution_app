/*
 * @Date: 2021-01-08 11:43:44
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-11-08 10:41:42
 * @Description: 底部弹窗
 */
import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
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
    } = props;
    const [visible, setVisible] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');
    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    const confirmClick = () => {
        setVisible(false);
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
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
            toastShow: toastShow,
        };
    });
    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            {backdrop && !global.rootSibling && <Mask />}
            <TouchableOpacity
                activeOpacity={1}
                onPress={isTouchMaskToClose ? hide : () => {}}
                style={[styles.container]}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={[styles.con, style]}>
                    {header || (
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.close} onPress={hide}>
                                <Icon name={'close'} size={18} />
                            </TouchableOpacity>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.title}>{title}</Text>
                                <Text style={styles.sub_title}>{sub_title}</Text>
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
        paddingBottom: isIphoneX() ? 34 : 0,
        backgroundColor: '#fff',
        minHeight: constants.bottomMinHeight,
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
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
        fontSize: px(16),
        color: '#333333',
        fontWeight: '500',
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
