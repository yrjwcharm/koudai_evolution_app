/*
 * @Date: 2021-01-05 16:10:12
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-07 18:09:10
 * @Description: 底部弹窗式密码
 */
import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import InputView from './InputView';
import Keyboard from './Keyboard';
import {constants} from './util';
import {isIphoneX, px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../common/commonStyle';
const PasswordModal = React.forwardRef((props, ref) => {
    const {
        onDone, //输入完成回调
        clear = true,
        backdrop,
        header,
        title = '请输入交易密码',
        tip = '忘记交易密码',
        tipProps,
        inputViewProps = {},
        keyboardProps = {},
    } = props;

    const [password, setPassword] = React.useState('');

    const [visible, setVisible] = React.useState(false);

    const combineText = (text) => {
        const len = inputViewProps.length || 6;
        let nextPassword = password + text;
        if (nextPassword.length <= len) {
            setPassword(nextPassword);
            if (nextPassword.length === len) {
                onDone && onDone(nextPassword);
                hide();
            }
        }
    };

    const onDelete = () => {
        setPassword(password.substring(0, password.length - 1));
    };

    const show = () => {
        if (clear && password) {
            setPassword('');
        }
        setVisible(true);
    };

    const hide = () => {
        setVisible(!visible);
    };

    React.useImperativeHandle(ref, () => {
        return {
            show: show,
            hide: hide,
        };
    });

    return (
        <Modal animationType={'slide'} visible={visible} onRequestClose={hide} transparent={true}>
            <View style={[styles.container, {backgroundColor: backdrop ? 'rgba(0,0,0,0.5)' : 'transparent'}]}>
                <View style={styles.con}>
                    {header || (
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.close} onPress={hide}>
                                <Icon name={'close'} size={18} />
                            </TouchableOpacity>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                    )}
                    <View style={styles.inputContainer}>
                        <InputView {...inputViewProps} value={password} />
                        {tip ? (
                            <Text style={styles.tip} {...tipProps}>
                                {tip}
                            </Text>
                        ) : null}
                    </View>
                    <Keyboard {...keyboardProps} onPress={combineText} onDelete={onDelete} />
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    con: {
        paddingBottom: isIphoneX() ? 40 : 0,
        backgroundColor: Colors.bgColor,
    },
    header: {
        height: constants.titleHeight,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: constants.borderWidth,
        borderBottomColor: constants.borderColor,
        borderTopWidth: constants.borderWidth,
        borderTopColor: constants.borderColor,
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
    title: {
        fontSize: px(16),
        color: '#333333',
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: px(20),
        marginBottom: 15,
    },
    tip: {
        marginTop: 15,
        marginBottom: 40,
        textAlign: 'right',
        color: Colors.brandColor,
    },
});

export default PasswordModal;
