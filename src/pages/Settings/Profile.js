/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2021-02-04 11:39:29
 * @Author: dx
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-21 12:20:52
 * @Description: 个人资料
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    DeviceEventEmitter,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Picker from 'react-native-picker';
import * as WeChat from 'react-native-wechat-lib';
import {px as text, isIphoneX, formaNum, onlyNumber, px} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import HTML from '../../components/RenderHtml';
import Mask from '../../components/Mask';
import {InputModal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';
import {NativeSignManagerEmitter, MethodObj} from '../PE/PEBridge.js';

const Profile = ({navigation}) => {
    const dispatch = useDispatch();
    const jump = useJump();
    const [data, setData] = useState([]);
    const [tip, setTip] = useState('');
    const [showMask, setShowMask] = useState(false);
    const inputModal = useRef(null);
    const inputRef = useRef(null);
    const [modalProps, setModalProps] = useState({});
    const [iptVal, setIptVal] = useState('');
    const iptValRef = useRef('');

    const init = () => {
        http.get('/mapi/person/center/20210101', {}).then((res) => {
            if (res.code === '000000') {
                setData(res.result.menus || []);
                setTip(res.result.tip);
                navigation.setOptions({title: res.result.title || '个人资料'});
            }
        });
    };
    useFocusEffect(
        useCallback(() => {
            const listener = NativeSignManagerEmitter.addListener(MethodObj.signFileSuccess, (res) => {
                const toast = Toast.showLoading();
                http.post('/file_sign/sign_done/20220510', {file_id: res.fileId}).then((resp) => {
                    Toast.hide(toast);
                    if (resp.code === '000000') {
                        Toast.show(resp.message || '签署成功');
                        if (resp.result.type === 'back') {
                            navigation.goBack();
                        } else if (resp.result.type === 'refresh') {
                            init();
                        } else {
                            init();
                        }
                    } else {
                        Toast.show(resp.message || '签署失败');
                    }
                });
            });
            return () => {
                listener.remove();
            };
        }, [])
    );
    const onPress = useCallback(
        (item) => {
            const {id, key, val: {jump_url, options, text: txt, type} = {}} = item;
            global.LogTool('click', key);
            if (type === 'jump') {
                if (key === '绑定微信') {
                    WeChat.isWXAppInstalled().then((isInstalled) => {
                        if (isInstalled) {
                            const scope = 'snsapi_userinfo';
                            const state = '_' + +new Date();
                            try {
                                WeChat.sendAuthRequest(scope, state).then((response) => {
                                    // console.log(response.code);
                                    if (response.code) {
                                        http.post('/auth/bind_wx/20210101', {code: response.code}).then((res) => {
                                            Toast.show(res.message);
                                            if (res.code === '000000') {
                                                global.LogTool('bindWX', 'success');
                                                dispatch(getUserInfo());
                                                init();
                                            }
                                        });
                                    }
                                });
                            } catch (e) {
                                if (e instanceof WeChat.WechatError) {
                                    console.error(e.stack);
                                } else {
                                    throw e;
                                }
                            }
                        } else {
                            Toast.show('请安装微信');
                        }
                    });
                } else {
                    jump(jump_url);
                }
            } else if (type === 'select') {
                Keyboard.dismiss();
                setShowMask(true);
                Picker.init({
                    pickerTitleColor: [31, 36, 50, 1],
                    pickerTitleText: `请选择${key}`,
                    pickerCancelBtnText: '取消',
                    pickerConfirmBtnText: '确定',
                    pickerBg: [255, 255, 255, 1],
                    pickerToolBarBg: [249, 250, 252, 1],
                    pickerData: options?.map((option) => option.val),
                    pickerFontColor: [33, 33, 33, 1],
                    pickerRowHeight: 36,
                    pickerConfirmBtnColor: [0, 81, 204, 1],
                    pickerCancelBtnColor: [128, 137, 155, 1],
                    pickerTextEllipsisLen: 100,
                    selectedValue: [txt],
                    wheelFlex: [1, 1],
                    onPickerCancel: () => setShowMask(false),
                    onPickerConfirm: (pickedValue, pickedIndex) => {
                        setShowMask(false);
                        http.post('/mapi/update/user_info/20210101', {
                            id: id,
                            ...(options[pickedIndex] || {}),
                        }).then((res) => {
                            if (res.code === '000000') {
                                global.LogTool('select', key);
                                init();
                            }
                        });
                    },
                });
                Picker.show();
            } else if (['input', 'textarea'].includes(type)) {
                setIptVal(txt);
                setModalProps({
                    confirmClick: () => confirmClick(item),
                    inputProps: {
                        keyboardType: type === 'textarea' ? 'default' : 'decimal-pad',
                        maxLength: 30,
                        multiline: type === 'textarea' ? true : false,
                        placeholder: `请输入${key}`,
                    },
                    title: key,
                });
                setTimeout(() => {
                    inputRef?.current?.focus();
                }, 200);
            }
        },
        [init, confirmClick, jump, dispatch]
    );
    // 隐藏选择器
    const hidePicker = useCallback(() => {
        Picker.hide();
        setShowMask(false);
    }, []);

    const confirmClick = useCallback(
        (item) => {
            // console.log(iptValRef.current);
            if (!iptValRef.current) {
                inputRef?.current?.blur();
                inputModal.current.toastShow(`${item.key}不能为空`, 2000, {
                    onHidden: () => {
                        setTimeout(() => {
                            inputRef?.current?.focus();
                        }, 100);
                    },
                });
                return false;
            }
            inputModal.current.hide();
            http.post('/mapi/update/user_info/20210101', {
                id: item.id,
                val: iptValRef.current,
            }).then((res) => {
                Toast.show(res.message);
                if (res.code === '000000') {
                    global.LogTool('input', item.key);
                    init();
                }
            });
        },
        [init]
    );

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    useEffect(() => {
        if (Object.keys(modalProps).length > 0) {
            inputModal.current.show();
        }
    }, [modalProps]);

    useEffect(() => {
        iptValRef.current = iptVal;
    }, [iptVal]);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener('sign_password_refresh', init);
        return () => {
            listener?.remove?.();
        };
    }, []);

    return (
        <View style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <InputModal {...modalProps} ref={inputModal}>
                {modalProps?.inputProps?.multiline ? (
                    <View style={styles.textareaBox}>
                        <TextInput
                            maxLength={modalProps?.inputProps?.maxLength}
                            multiline={modalProps?.inputProps?.multiline}
                            onChangeText={(val) => setIptVal(val)}
                            placeholder={modalProps?.inputProps?.placeholder}
                            placeholderTextColor={Colors.placeholderColor}
                            ref={inputRef}
                            style={styles.textarea}
                            textAlignVertical="top"
                            value={iptVal}
                        />
                        <View style={[Style.flexRow, styles.bottomOps]}>
                            <Text style={[styles.count, {marginRight: px(12)}]}>
                                {iptVal?.length}/{modalProps?.inputProps?.maxLength}
                            </Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setIptVal('')}>
                                <Text style={[styles.count, {color: Colors.brandColor}]}>清除</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={[Style.flexRow, styles.inputContainer]}>
                        <Text style={styles.unit}>¥</Text>
                        <TextInput
                            ref={inputRef}
                            clearButtonMode={'never'}
                            keyboardType={modalProps?.inputProps?.keyboardType}
                            maxLength={modalProps?.inputProps?.maxLength}
                            onChangeText={(value) => setIptVal(onlyNumber(value))}
                            style={styles.inputStyle}
                            value={iptVal}
                        />
                        {`${iptVal}`.length === 0 && (
                            <Text style={styles.placeholder}>{modalProps?.inputProps?.placeholder}</Text>
                        )}
                        {`${iptVal}`.length > 0 && (
                            <TouchableOpacity activeOpacity={0.8} onPress={() => setIptVal('')}>
                                <AntDesign name={'closecircle'} color={'#CDCDCD'} size={px(16)} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </InputModal>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index, arr) => {
                    return (
                        <View key={`part${index}`} style={[styles.partBox]}>
                            {part.map((item, i) => {
                                const {key, val: {desc, jump_url, text: txt, type} = {}} = item;
                                return (
                                    <View key={key} style={[i === 0 ? {} : styles.borderTop]}>
                                        {['input', 'jump', 'select', 'textarea'].includes(type) ? (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={[Style.flexBetween, {height: px(56)}]}
                                                onPress={() => onPress(item)}>
                                                <Text style={styles.title}>{key}</Text>
                                                <View style={Style.flexRow}>
                                                    {desc ? (
                                                        <HTML html={desc} style={{...styles.val, ...styles.desc}} />
                                                    ) : null}
                                                    {txt ? (
                                                        <View style={{marginHorizontal: px(12), maxWidth: px(200)}}>
                                                            <HTML
                                                                html={
                                                                    type === 'input'
                                                                        ? formaNum(`${txt}`, 'nozero')
                                                                        : txt
                                                                }
                                                                numberOfLines={1}
                                                                style={styles.val}
                                                            />
                                                        </View>
                                                    ) : null}
                                                    <Icon
                                                        name={'angle-right'}
                                                        size={20}
                                                        color={Colors.lightGrayColor}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                disabled={!jump_url}
                                                onPress={() => jump(jump_url)}
                                                style={[Style.flexBetween, {height: px(56)}]}>
                                                <Text style={styles.title}>{key}</Text>
                                                <View style={Style.flexRow}>
                                                    {type === 'img' && txt ? (
                                                        <Image source={{uri: txt}} style={styles.avatar} />
                                                    ) : (
                                                        <HTML html={txt} style={styles.val} />
                                                    )}
                                                    {jump_url ? (
                                                        <Icon
                                                            name={'angle-right'}
                                                            size={20}
                                                            color={Colors.lightGrayColor}
                                                            style={{marginLeft: px(12)}}
                                                        />
                                                    ) : null}
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
                {tip ? (
                    <Text style={[styles.bottom_text, {marginBottom: isIphoneX() ? 44 : px(20)}]}>{tip}</Text>
                ) : null}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    partBox: {
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
        marginTop: Space.marginVertical,
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    val: {
        fontSize: Font.textH2,
        lineHeight: px(24),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
    desc: {
        fontSize: Font.textH3,
    },
    avatar: {
        width: px(32),
        height: px(32),
        borderRadius: px(16),
    },
    inputContainer: {
        marginVertical: px(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: px(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        position: 'relative',
    },
    unit: {
        fontSize: px(26),
        fontFamily: Font.numFontFamily,
    },
    inputStyle: {
        flex: 1,
        fontSize: px(35),
        lineHeight: px(42),
        height: px(42),
        marginLeft: px(14),
        padding: 0,
        fontFamily: Font.numMedium,
    },
    placeholder: {
        position: 'absolute',
        left: px(28),
        top: px(3.5),
        fontSize: px(26),
        lineHeight: px(37),
        color: Colors.placeholderColor,
    },
    bottom_text: {
        color: Colors.darkGrayColor,
        fontSize: px(11),
        lineHeight: px(18),
        marginTop: px(16),
        paddingHorizontal: px(20),
    },
    textareaBox: {
        paddingVertical: px(20),
        paddingHorizontal: Space.padding,
    },
    textarea: {
        paddingTop: 0,
        fontSize: Font.textH2,
        color: Colors.descColor,
        height: px(270),
    },
    bottomOps: {
        position: 'absolute',
        right: px(16),
        bottom: px(20),
    },
    count: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
});

export default Profile;
