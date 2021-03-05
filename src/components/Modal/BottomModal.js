/*
 * @Date: 2021-01-08 11:43:44
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-04 18:08:34
 * @Description: 底部弹窗
 */
import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {constants} from './util';
import {isIphoneX, px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../common/commonStyle';
import Mask from '../Mask';
const BottomModal = React.forwardRef((props, ref) => {
    const {
        backdrop = true,
        header,
        title = '请选择',
        confirmText = '',
        children = <Text />,
        /**
         * 点击确认按钮
         */
        onDone = () => {},
        isTouchMaskToClose = true,
    } = props;
    const [visible, setVisible] = React.useState(false);
    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(!visible);
    };

    const confirmClick = () => {
        setVisible(!visible);
        onDone && onDone();
    };
    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });

    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            {backdrop && <Mask />}
            <TouchableOpacity
                activeOpacity={1}
                onPress={isTouchMaskToClose ? hide : () => {}}
                style={[styles.container]}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={styles.con}>
                    {header || (
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.close} onPress={hide}>
                                <Icon name={'close'} size={18} />
                            </TouchableOpacity>
                            <Text style={styles.title}>{title}</Text>
                            {confirmText ? (
                                <TouchableOpacity style={[styles.confirm]} onPress={confirmClick}>
                                    <Text style={{fontSize: px(14), color: '#0051CC'}}>{confirmText}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    )}
                    {children}
                </TouchableOpacity>
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
        paddingBottom: isIphoneX() ? 34 : 0,
        backgroundColor: Colors.bgColor,
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
