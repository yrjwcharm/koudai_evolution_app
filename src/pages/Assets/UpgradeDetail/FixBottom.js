/*
 * @Date: 2022-07-21 14:16:18
 * @Description:
 */
import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useJump} from '~/components/hooks';
import {Modal} from '~/components/Modal';
import {PasswordModal} from '~/components/Password';
import Toast from '~/components/Toast';
import {isIphoneX, px} from '~/utils/appUtil';
import {upgradeDo} from './services';

const FixBottom = ({button, button2, routeParams = {}}) => {
    const jump = useJump();
    const navigation = useNavigation();

    const passwordModal = useRef(null);

    const handlerClick = () => {
        if (button.popup) {
            const popup = button.popup;
            Modal.show({
                backButtonClose: popup.back_close,
                cancelText: popup.cancel?.text,
                confirm: popup.cancel ? true : false,
                confirmCallBack: () => {
                    passwordModal.current.show();
                },
                confirmText: popup.confirm?.text,
                content: popup.content,
                isTouchMaskToClose: popup.touch_close,
                title: popup.title,
            });
        } else {
            jump(button.url);
        }
    };

    const submit = (password) => {
        upgradeDo({password, upgrade_id: routeParams.upgrade_id}).then((res) => {
            Toast.show(res.result?.message || res.message);
            if (res.code === '000000') {
                jump(button.url);
            }
        });
    };
    return (
        <>
            <View
                style={{
                    backgroundColor: '#ddd',
                    opacity: 0.1,
                    height: 1,
                }}
            />
            <View style={[styles.fixBottom, {paddingBottom: isIphoneX() ? 34 : px(8)}]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.btnLeft}>
                    <Text style={styles.btnLeftText}>{button2?.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={handlerClick} style={styles.btnRight}>
                    <Text style={styles.btnRightText}>{button?.text}</Text>
                </TouchableOpacity>
            </View>
            <PasswordModal ref={passwordModal} onDone={submit} />
        </>
    );
};

export default FixBottom;

const styles = StyleSheet.create({
    fixBottom: {
        paddingVertical: px(10),
        paddingHorizontal: px(15),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnLeft: {
        width: px(124),
        height: px(44),
        borderRadius: px(6),
        borderWidth: 1,
        borderColor: '#545968',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLeftText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#545968',
    },
    btnRight: {
        width: px(208),
        height: px(44),
        borderRadius: px(6),
        backgroundColor: '#0051CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRightText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#fff',
    },
});
