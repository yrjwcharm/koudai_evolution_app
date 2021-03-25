/*
 * @Date: 2021-02-04 11:39:29
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-25 14:20:30
 * @Description: 个人资料
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-picker';
import * as WeChat from 'react-native-wechat-lib';
import {px as text, isIphoneX, px} from '../../utils/appUtil.js';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import HTML from '../../components/RenderHtml';
import Mask from '../../components/Mask';
import {InputModal} from '../../components/Modal';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
import {useDispatch} from 'react-redux';
import {getUserInfo} from '../../redux/actions/userInfo';

const Profile = ({navigation}) => {
    const dispatch = useDispatch();
    const jump = useJump();
    const [data, setData] = useState([]);
    const [showMask, setShowMask] = useState(false);
    const inputModal = useRef(null);
    const [modalProps, setModalProps] = useState({});
    const [iptVal, setIptVal] = useState('');
    const iptValRef = useRef('');

    const init = useCallback(() => {
        http.get('/mapi/person/center/20210101', {}).then((res) => {
            if (res.code === '000000') {
                setData(res.result.menus || []);
                navigation.setOptions({title: res.result.title || '个人资料'});
            }
        });
    }, [navigation]);
    const onPress = useCallback(
        (item) => {
            global.LogTool('click', item.key);
            if (item.val?.type === 'jump') {
                if (item.key === '绑定微信') {
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
                    jump(item.val?.jump_url);
                }
            } else if (item.val?.type === 'select') {
                Keyboard.dismiss();
                setShowMask(true);
                Picker.init({
                    pickerTitleColor: [31, 36, 50, 1],
                    pickerTitleText: `请选择${item.key}`,
                    pickerCancelBtnText: '取消',
                    pickerConfirmBtnText: '确定',
                    pickerBg: [255, 255, 255, 1],
                    pickerToolBarBg: [249, 250, 252, 1],
                    pickerData: item.val?.options?.map((option) => option.val),
                    pickerFontColor: [33, 33, 33, 1],
                    pickerRowHeight: 36,
                    pickerConfirmBtnColor: [0, 81, 204, 1],
                    pickerCancelBtnColor: [128, 137, 155, 1],
                    selectedValue: [item.val?.text],
                    wheelFlex: [1, 1],
                    onPickerCancel: () => setShowMask(false),
                    onPickerConfirm: (pickedValue, pickedIndex) => {
                        setShowMask(false);
                        http.post('/mapi/update/user_info/20210101', {
                            id: item.id,
                            ...(item.val?.options[pickedIndex] || {}),
                        }).then((res) => {
                            if (res.code === '000000') {
                                global.LogTool('select', item.key);
                                init();
                            }
                        });
                    },
                });
                Picker.show();
            } else if (item.val?.type === 'input') {
                setIptVal(item.val?.text);
                setModalProps({
                    confirmClick: () => confirmClick(item),
                    placeholder: `请输入${item.key}金额`,
                    title: item.key,
                });
            }
        },
        [init, confirmClick, jump, dispatch]
    );
    // 隐藏选择器
    const hidePicker = useCallback(() => {
        Picker.hide();
        setShowMask(false);
    }, []);
    const onKeyPress = (e) => {
        const {key} = e.nativeEvent;
        // console.log(key);
        const pos = iptVal.indexOf(key);
        if (iptVal.split('.')[1] && iptVal.split('.')[1].length === 2 && key !== 'Backspace') {
            return false;
        }
        if (key === '.') {
            setIptVal((prev) => {
                if (prev === '') {
                    return prev;
                } else {
                    if (pos !== -1) {
                        return prev;
                    } else {
                        return prev + '.';
                    }
                }
            });
        } else if (key === '0') {
            setIptVal((prev) => {
                if (prev === '') {
                    return prev + '0';
                } else {
                    if (prev === '0') {
                        return prev;
                    } else {
                        return prev + '0';
                    }
                }
            });
        } else if (key === 'Backspace') {
            setIptVal((prev) => prev.slice(0, prev.length - 1));
        } else {
            setIptVal((prev) => prev + key);
        }
    };
    const confirmClick = useCallback(
        (item) => {
            // console.log(iptValRef.current);
            if (!iptValRef.current) {
                Toast.show(`${item.key}不能为空`, {position: text(180), showMask: false});
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
        }, [init])
    );
    useEffect(() => {
        if (Object.keys(modalProps).length > 0) {
            inputModal.current.show();
        }
    }, [modalProps]);
    useEffect(() => {
        iptValRef.current = iptVal;
    }, [iptVal]);
    return (
        <View style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <InputModal {...modalProps} ref={inputModal}>
                <View style={{backgroundColor: '#fff'}}>
                    <View style={[Style.flexRow, styles.inputContainer]}>
                        <Text style={[styles.unit, {marginRight: text(4)}]}>{'￥'}</Text>
                        <TextInput
                            autoFocus={true}
                            clearButtonMode={'never'}
                            keyboardType={'decimal-pad'}
                            onKeyPress={onKeyPress}
                            // onChangeText={(value) => setIptVal(value)}
                            placeholder={modalProps?.placeholder}
                            style={styles.input}
                            value={iptVal}
                        />
                    </View>
                </View>
            </InputModal>
            <ScrollView style={{paddingHorizontal: Space.padding}}>
                {data.map((part, index, arr) => {
                    return (
                        <View
                            key={`part${index}`}
                            style={[
                                styles.partBox,
                                index === arr.length - 1
                                    ? {marginBottom: isIphoneX() ? 34 + Space.marginVertical : Space.marginVertical}
                                    : {},
                            ]}>
                            {part.map((item, i) => {
                                return (
                                    <View key={item.key} style={[i === 0 ? {} : styles.borderTop]}>
                                        {item.val?.type === 'jump' ||
                                        item.val?.type === 'select' ||
                                        item.val?.type === 'input' ? (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={[Style.flexBetween, {height: text(56)}]}
                                                onPress={() => onPress(item)}>
                                                <Text style={styles.title}>{item.key}</Text>
                                                <View style={Style.flexRow}>
                                                    {item.val?.desc ? (
                                                        <HTML
                                                            html={item.val.desc}
                                                            style={{...styles.val, ...styles.desc}}
                                                        />
                                                    ) : null}
                                                    {item.val?.text ? (
                                                        <View style={{marginHorizontal: text(12)}}>
                                                            <HTML html={item.val.text} style={styles.val} />
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
                                            <View style={[Style.flexBetween, {height: text(56)}]}>
                                                <Text style={styles.title}>{item.key}</Text>
                                                {item.val?.type === 'img' && item.val?.text ? (
                                                    <Image source={{uri: item.val.text}} style={styles.avatar} />
                                                ) : (
                                                    <HTML html={item.val.text} style={styles.val} />
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
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
        marginTop: Space.marginVertical,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    borderTop: {
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
    },
    val: {
        fontSize: Font.textH2,
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    desc: {
        fontSize: Font.textH3,
    },
    avatar: {
        width: text(32),
        height: text(32),
        borderRadius: text(16),
    },
    inputContainer: {
        marginVertical: text(32),
        marginHorizontal: Space.marginAlign,
        paddingBottom: text(12),
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    unit: {
        fontSize: text(20),
        lineHeight: text(24),
        color: Colors.defaultColor,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        fontSize: text(26),
        lineHeight: text(37),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
});

export default Profile;
