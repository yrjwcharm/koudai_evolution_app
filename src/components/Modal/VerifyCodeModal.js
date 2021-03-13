/*
 * @Date: 2021-01-08 11:43:44
 * @Author: xjh
 * @LastEditors: dx
 * @LastEditTime: 2021-03-13 15:43:42
 * @Description: 底部弹窗
 */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {constants} from './util';
import {px as text} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../common/commonStyle';
import {Font, Style} from '../../common/commonStyle';
import RBSheet from 'react-native-raw-bottom-sheet';
const VerifyCodeModel = React.forwardRef((props, ref) => {
    const refRBSheet = useRef();
    const {
        title = '请输入手机验证码',
        desc = '验证码已发送至',
        isSign = false,
        isTouchMaskToClose = false,
        onChangeText = (value) => console.log(value),
        modalCancelCallBack = () => {},
        getCode = () => {},
        phone = '',
    } = props;
    const [defaultColor, setDefaultColor] = useState('#EF8743');
    const [num, setNum] = useState(0); // 倒计时
    const timerRef = useRef(null);
    const [code, setCode] = useState('');
    const btnClick = useRef(true);
    const inputRef = useRef(null);

    const sendCode = useCallback(() => {
        if (btnClick.current) {
            btnClick.current = false;
            getCode(phone);
        }
    }, [getCode, phone]);
    const startTimer = useCallback(() => {
        setNum(60);
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
    }, []);
    const hide = () => {
        refRBSheet.current.close();
    };
    const show = () => {
        refRBSheet.current.open();
    };
    const onClose = () => {
        timerRef.current !== null && clearInterval(timerRef.current);
        timerRef.current = null;
        setCode('');
        setNum(0);
        setDefaultColor('#EF8743');
        btnClick.current = true;
        setTimeout(() => {
            modalCancelCallBack();
        }, 500);
    };
    const onOpen = () => {
        if (timerRef.current === null) {
            startTimer();
            const isFocused = inputRef.current.isFocused();
            if (!isFocused) {
                inputRef.current.focus();
            }
        }
    };

    React.useImperativeHandle(ref, () => {
        return {
            hide: hide,
            show: show,
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
            onOpen={onOpen}>
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
                            autoFocus
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
                </View>
            </View>
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
});

export default VerifyCodeModel;
