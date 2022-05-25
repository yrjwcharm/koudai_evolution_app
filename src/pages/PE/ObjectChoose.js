/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Date: 2022-05-16 13:55:10
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-25 19:34:42
 * @Description: 特定对象选择
 */
import React, {useCallback, useEffect, useState} from 'react';
import {
    DeviceEventEmitter,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Image from 'react-native-fast-image';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import {debounce} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';
import {FormItem} from './IdentityAssertion';
import Toast from '../../components/Toast';
import {Modal} from '../../components/Modal';
import {NativeSignManagerEmitter, MethodObj} from './PEBridge';

export const PopupContent = ({data, refresh = () => {}}) => {
    const {button: popupButton = {}, default_select, tip: popupTips = '', type} = data;
    const {text} = popupButton;
    const [selected, setSelected] = useState();
    const [oldPwd, setOldPwd] = useState('');
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    const onSubmit = useCallback(
        debounce(
            () => {
                const urlObj = {
                    choose_object: '/private_fund/submit_qualified_target/20220510',
                    sign_password: '/private_fund/set_sign_password/20220510',
                };
                const paramsObj = {
                    choose_object: {investor_type: selected},
                    sign_password: {old_password: oldPwd, password: pwd, re_password: confirmPwd},
                };
                http.post(urlObj[type], paramsObj[type]).then((res) => {
                    if (res.code === '000000') {
                        refresh();
                        res.result.message && Toast.show(res.result.message);
                    } else {
                        Modal.bottomModal && Modal.bottomModal.toastShow(res.message);
                    }
                });
            },
            1000,
            {leading: true, trailing: false}
        ),
        [confirmPwd, oldPwd, pwd, selected]
    );

    useEffect(() => {
        if (type === 'choose_object') {
            setSelected(default_select);
        }
    }, [default_select, type]);

    switch (type) {
        case 'choose_object':
            const {options = []} = data;
            return (
                <View style={styles.popContainer}>
                    {options.map((option, index) => {
                        const {content, name, value} = option;
                        return (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                key={option + index}
                                onPress={() => setSelected(value)}
                                style={[styles.optionBox, {marginTop: index === 0 ? 0 : px(12)}]}>
                                <View style={Style.flexRow}>
                                    <View
                                        style={[
                                            styles.radioIconBox,
                                            {borderWidth: selected !== value ? Space.borderWidth : 0},
                                        ]}>
                                        {selected === value ? (
                                            <Image
                                                source={require('../../assets/img/fof/check.png')}
                                                style={styles.checked}
                                            />
                                        ) : null}
                                    </View>
                                    <Text style={styles.optionTitle}>{name}</Text>
                                </View>
                                <Text style={styles.optionContent}>{content}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    <Text style={styles.popupTips}>{popupTips}</Text>
                    <Button
                        color="#EDDBC5"
                        disabled={!options.some((item) => item.value === selected)}
                        disabledColor="#EDDBC5"
                        onPress={onSubmit}
                        style={styles.popupButton}
                        title={text}
                    />
                </View>
            );
        case 'sign_password':
            const {old_password, password, re_password} = data;
            return (
                <View style={styles.popContainer}>
                    <Text style={[styles.popupTips, {marginTop: px(4)}]}>{popupTips}</Text>
                    {old_password ? (
                        <View style={[Style.flexRow, styles.inputBox, {marginTop: Space.marginVertical}]}>
                            <View style={styles.divider} />
                            <Text style={styles.inputLabel}>{old_password.name}</Text>
                            <TextInput
                                autoFocus
                                keyboardType="number-pad"
                                maxLength={6}
                                onChangeText={(val) => setOldPwd(val.replace(/\D/g, ''))}
                                placeholder={old_password.placeholder}
                                placeholderTextColor={'#BDC2CC'}
                                secureTextEntry={true}
                                style={styles.inputStyle}
                                textContentType={'password'}
                                value={oldPwd}
                            />
                        </View>
                    ) : null}
                    {password ? (
                        <View style={[Style.flexRow, styles.inputBox, {marginTop: Space.marginVertical}]}>
                            <View style={styles.divider} />
                            <Text style={styles.inputLabel}>{password.name}</Text>
                            <TextInput
                                autoFocus={!old_password}
                                keyboardType="number-pad"
                                maxLength={6}
                                onChangeText={(val) => setPwd(val).replace(/\D/g, '')}
                                placeholder={password.placeholder}
                                placeholderTextColor={'#BDC2CC'}
                                secureTextEntry={true}
                                style={styles.inputStyle}
                                textContentType={'password'}
                                value={pwd}
                            />
                        </View>
                    ) : null}
                    {re_password ? (
                        <View style={[Style.flexRow, styles.inputBox]}>
                            <View style={styles.divider} />
                            <Text style={styles.inputLabel}>{re_password.name}</Text>
                            <TextInput
                                keyboardType="number-pad"
                                maxLength={6}
                                onChangeText={(val) => setConfirmPwd(val).replace(/\D/g, '')}
                                placeholder={re_password.placeholder}
                                placeholderTextColor={'#BDC2CC'}
                                secureTextEntry={true}
                                style={styles.inputStyle}
                                textContentType={'password'}
                                value={confirmPwd}
                            />
                        </View>
                    ) : null}
                    {text ? (
                        <Button
                            color="#EDDBC5"
                            disabled={
                                !(
                                    password &&
                                    pwd.length === 6 &&
                                    ((re_password && confirmPwd.length === 6) || !re_password)
                                )
                            }
                            disabledColor="#EDDBC5"
                            onPress={onSubmit}
                            style={styles.popupButton}
                            title={text}
                        />
                    ) : null}
                </View>
            );
        default:
            return null;
    }
};

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, list = [], desc: tips} = data;

    const init = () => {
        http.get('/private_fund/qualified_target/20220510').then((res) => {
            if (res.code === '000000') {
                navigation.setOptions({title: res.result.title || '特定对象选择'});
                setData(res.result);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    useEffect(() => {
        const listener = NativeSignManagerEmitter.addListener(MethodObj.signFileSuccess, (res) => {
            http.post('/file_sign/sign_done/20220510', {file_id: res.fileId}).then((resp) => {
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
    }, []);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener('refresh', init);
        return () => {
            listener?.remove?.();
        };
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            <ScrollView bounces={false} scrollIndicatorInsets={{right: 1}} style={styles.scrollView}>
                {tips ? <Text style={styles.tips}>{tips}</Text> : null}
                <View style={styles.partBox}>
                    {list.map((item, index) => {
                        return (
                            <View
                                key={item + index}
                                style={[styles.itemBox, {borderTopWidth: index !== 0 ? Space.borderWidth : 0}]}>
                                <FormItem data={item} />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            {button.text ? (
                <Button
                    color="#EDDBC5"
                    disabled={button.avail === 0}
                    disabledColor="#EDDBC5"
                    onPress={() => {
                        jump(button.url);
                        Toast.show('恭喜您完成特定对象确认，可点击私募产品进行查看');
                    }}
                    style={styles.button}
                    title={button.text}
                />
            ) : null}
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    tips: {
        marginTop: Space.marginVertical,
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    partBox: {
        marginTop: px(12),
        marginBottom: isIphoneX() ? 34 + px(45) + px(16) : px(45) + px(16) * 2,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: px(56),
        borderColor: Colors.borderColor,
    },
    itemText: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    button: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(16),
        left: px(16),
        backgroundColor: '#D7AF74',
    },
    popContainer: {
        paddingTop: Space.padding,
        paddingHorizontal: Space.padding,
    },
    optionBox: {
        padding: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
    },
    radioIconBox: {
        marginRight: px(8),
        borderRadius: px(15),
        borderColor: '#979797',
        width: px(15),
        height: px(15),
    },
    checked: {
        width: '100%',
        height: '100%',
    },
    optionTitle: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    optionContent: {
        marginTop: px(8),
        fontSize: px(13),
        lineHeight: px(20),
        color: Colors.defaultColor,
    },
    popupTips: {
        marginTop: px(12),
        fontSize: Font.textH3,
        lineHeight: px(20),
        color: Colors.lightGrayColor,
    },
    popupButton: {
        marginTop: px(20),
        backgroundColor: '#D7AF74',
    },
    inputBox: {
        marginTop: px(12),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: Colors.bgColor,
        height: px(50),
    },
    inputLabel: {
        fontSize: Font.textH1,
        lineHeight: px(22),
        color: Colors.descColor,
        minWidth: px(64),
    },
    inputStyle: {
        marginLeft: Space.marginAlign,
        paddingTop: px(4),
        paddingLeft: px(12),
        height: '100%',
        flex: 1,
        flexShrink: 1,
        fontSize: Font.textH1,
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    divider: {
        width: px(1),
        height: px(12),
        backgroundColor: Colors.descColor,
        position: 'absolute',
        top: px(19),
        left: px(95),
    },
});
