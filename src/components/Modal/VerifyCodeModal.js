/*
 * @Date: 2021-01-08 11:43:44
 * @Author: xjh
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-01 15:39:11
 * @Description: 底部弹窗
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, Modal} from 'react-native';
import {constants} from './util';
import {px as text, deviceHeight, deviceWidth, px} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../common/commonStyle';
import {Font, Style} from '../../common/commonStyle';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button} from '../Button';
const VerifyCodeModal = React.forwardRef((props, ref) => {
    const refRBSheet = useRef();
    const {
        title = '请输入手机验证码',
        desc = '验证码已发送至',
        isSign = true,
        isTouchMaskToClose = false,
        onChangeText = () => {},
        modalCancelCallBack = null,
        getCode = () => {},
        phone = '',
        buttonCallBack = null, //
        validateLength = 6, //校验输入规则
        scene = '', //使用场景 sign->银行签约
    } = props;
    const [defaultColor, setDefaultColor] = useState('#EF8743');
    const [num, setNum] = useState(1); // 倒计时
    const timerRef = useRef(null);
    const [code, setCode] = useState('');
    const btnClick = useRef(true);
    const inputRef = useRef(null);
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('');

    const sendCode = useCallback(() => {
        if (btnClick.current) {
            btnClick.current = false;
            getCode(phone);
        }
    }, [getCode, phone]);
    const startTimer = useCallback(
        (reclock, success = true) => {
            //此处是针对签约做的补丁
            if (scene == 'sign' && ((num == '重新发送验证码' && reclock == 0) || !success)) return;
            scene == 'sign' ? (num == 1 || num == '重新发送验证码' ? setNum(60) : '') : setNum(60);

            setDefaultColor('#999');
            btnClick.current = false;
            timerRef.current = setInterval(() => {
                setNum((n) => {
                    if (n === 1) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                        setDefaultColor('#EF8743');
                        setNum('重新发送验证码');
                        btnClick.current = true;
                        return n;
                    }
                    return n - 1;
                });
            }, 1000);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [num, scene]
    );
    const hide = () => {
        refRBSheet.current.close();
    };
    // success代表验证码是否发送成功
    const show = (success = true, reclock = 1) => {
        refRBSheet.current.open();
        if (!success) {
            btnClick.current = true;
        }
        if (timerRef.current === null) {
            startTimer(reclock, success);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    };
    const toastShow = (t, duration = 2000) => {
        setToastText(t);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setToastText('');
        }, duration);
    };
    const onClose = () => {
        if (!isSign) {
            modalCancelCallBack && modalCancelCallBack();
        }
        timerRef.current !== null && clearInterval(timerRef.current);
        timerRef.current = null;
        setCode('');
        scene == 'sign' ? '' : setNum(1);
        setDefaultColor('#EF8743');
        btnClick.current = true;
    };

    React.useImperativeHandle(ref, () => {
        return {
            hide: hide,
            show: show,
            toastShow: toastShow,
        };
    });

    useEffect(() => {
        return () => {
            timerRef.current !== null && clearInterval(timerRef.current);
        };
    }, []);
    return (
        <RBSheet
            ref={refRBSheet}
            closeOnDragDown={false}
            closeOnPressMask={isTouchMaskToClose}
            height={buttonCallBack ? px(280) : px(240)}
            customStyles={{
                wrapper: {
                    backgroundColor: 'rgba(30, 31, 32, 0.8)',
                },
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                },
                draggableIcon: {
                    backgroundColor: '#000',
                },
            }}
            onClose={onClose}
            // onOpen={onOpen}
        >
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.close} onPress={hide}>
                        <Icon name={'close'} size={18} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={Style.modelPadding}>
                    <Text style={({fontSize: Font.textH2}, styles.desc_text)}>{desc}</Text>
                    <View style={[Style.flexRowCenter, styles.wrap_input]}>
                        <TextInput
                            ref={inputRef}
                            style={styles.verify_input}
                            maxLength={6}
                            keyboardType={'number-pad'}
                            placeholder="请输入验证码"
                            onChangeText={(value) => {
                                setCode(value.replace(/\D/g, ''));
                                onChangeText(value.replace(/\D/g, ''));
                            }}
                            value={code}
                        />
                        <TouchableOpacity
                            activeOpacity={defaultColor === '#EF8743' ? 0.8 : 1}
                            style={[styles.verify_button, Style.flexCenter, {backgroundColor: defaultColor}]}
                            onPress={sendCode}>
                            <Text style={{color: '#fff', fontSize: text(12)}}>{num ? num : '重新发送验证码'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                        title={props.buttonText}
                        style={{marginTop: text(24)}}
                        disabled={code.length !== validateLength}
                        onPress={() => {
                            buttonCallBack && buttonCallBack(code);
                        }}
                    />
                </View>
            </View>
            <Modal animationType={'fade'} onRequestClose={() => setShowToast(false)} transparent visible={showToast}>
                <View style={[Style.flexCenter, styles.toastContainer]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>{toastText}</Text>
                    </View>
                </View>
            </Modal>
        </RBSheet>
    );
});

const styles = StyleSheet.create({
    desc_text: {
        color: '#555B6C',
        paddingBottom: text(12),
        lineHeight: text(20),
    },
    verify_input: {
        backgroundColor: Colors.inputBg,
        flex: 1,
        height: text(50),
        borderTopLeftRadius: text(5),
        borderBottomLeftRadius: text(5),
        paddingLeft: text(20),
        fontSize: text(16),
    },
    verify_button: {
        fontSize: Font.textH3,
        height: text(50),
        borderTopRightRadius: text(5),
        borderBottomRightRadius: text(5),
        width: text(100),
    },
    wrap_input: {
        width: '100%',
        height: text(50),
    },
    container: {
        justifyContent: 'flex-end',
    },
    header: {
        paddingVertical: text(16),
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
    title: {
        fontSize: text(16),
        color: '#333333',
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

export default VerifyCodeModal;
