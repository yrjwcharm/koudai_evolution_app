/*
 * @Date: 2021-01-08 11:43:44
 * @Author: xjh
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-15 10:59:12
 * @Description: 底部弹窗
 */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {constants} from './util';
import {isIphoneX, px as text} from '../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../common/commonStyle';
import {Space, Font, Style} from '../../common/commonStyle';
import RBSheet from 'react-native-raw-bottom-sheet';
const VerifyCodeModel = React.forwardRef((props, ref) => {
    const refRBSheet = useRef();
    const [verifyText, setVerifyText] = useState('重新发送验证码');
    const {mobile = '', backdrop = true, title = '请输入手机验证码'} = props;
    let time = 60;
    useEffect(() => {
        return () => {
            clearInterval();
        };
    }, []);

    const sendCode = () => {
        setVerifyText(time);
        setInterval(() => {
            if (time <= 1) return;
            setVerifyText(time--);
        }, 1000);
    };
    const hide = () => {
        refRBSheet.current.close();
    };
    const show = () => {
        refRBSheet.current.open();
    };
    React.useImperativeHandle(ref, () => {
        return {
            hide: hide,
            show: show,
        };
    });
    return (
        <RBSheet
            ref={refRBSheet}
            closeOnDragDown={false}
            closeOnPressMask={false}
            customStyles={{
                wrapper: {
                    backgroundColor: 'transparent',
                },
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                },
                draggableIcon: {
                    backgroundColor: '#000',
                },
            }}>
            <View style={[styles.container]}>
                <View style={styles.con}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.close} onPress={hide}>
                            <Icon name={'close'} size={18} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={Style.modelPadding}>
                        <Text style={({fontSize: Font.textH2}, styles.desc_text)}>验证码已发送至{mobile}</Text>
                        <View style={[Style.flexRowCenter, styles.wrap_input]}>
                            <TextInput style={styles.verify_input} placeholder="请输入验证码" />
                            <TouchableOpacity style={[styles.verify_button, Style.flexCenter]} onPress={sendCode}>
                                <Text style={{color: '#fff', fontSize: text(12)}}>{verifyText}</Text>
                            </TouchableOpacity>
                        </View>
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
    },
    verify_input: {
        backgroundColor: '#F4F4F4',
        flex: 1,
        height: text(50),
        borderTopLeftRadius: text(5),
        borderBottomLeftRadius: text(5),
        paddingLeft: text(20),
    },
    verify_button: {
        backgroundColor: '#EF8743',
        fontSize: Font.textH3,
        height: text(50),
        borderTopRightRadius: text(5),
        borderBottomRightRadius: text(5),
        paddingHorizontal: text(10),
        minWidth: text(60),
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
