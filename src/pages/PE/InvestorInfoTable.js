/*
 * @Date: 2022-05-11 15:34:32
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-12 14:40:39
 * @Description: 投资者信息表
 */
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Picker from 'react-native-picker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {times} from 'lodash';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Mask from '../../components/Mask';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [showMask, setShowMask] = useState(false);
    const {button = {}, list = []} = data;
    const {text, url} = button;
    const inputArr = useRef([]);

    const renderItem = (item, index) => {
        const {input_type, label, max_length, options, placeholder, tips, type, value} = item;
        return (
            <View key={item + index} style={[styles.itemBox, {borderTopWidth: index !== 0 ? Space.borderWidth : 0}]}>
                <TouchableOpacity
                    activeOpacity={type === 'radio' || type === 'text' ? 1 : 0.8}
                    onPress={() => onPress(item, index)}
                    style={[Style.flexBetween, {height: '100%'}]}>
                    <View style={Style.flexRow}>
                        <Text style={styles.itemLabel}>{label}</Text>
                        {tips ? (
                            <TouchableOpacity activeOpacity={0.8} style={{marginLeft: px(2)}}>
                                <EvilIcons color={'#999999'} name={'question'} size={22} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <View style={[Style.flexRow, {flexShrink: 1}]}>
                        {type === 'text' || type === 'datepicker' || type === 'picker' ? (
                            <Text
                                style={[
                                    styles.itemLabel,
                                    {color: type === 'text' ? Colors.lightGrayColor : Colors.defaultColor},
                                ]}>
                                {value}
                            </Text>
                        ) : null}
                        {type === 'radio'
                            ? options?.map?.((option, i) => {
                                  return (
                                      <TouchableOpacity
                                          activeOpacity={0.8}
                                          key={option + i}
                                          onPress={() => onChange(index, option.value)}
                                          style={[Style.flexRow, {marginLeft: i === 0 ? 0 : px(36)}]}>
                                          <MaterialCommunityIcons
                                              color={value === option.value ? '#D7AF74' : '#979797'}
                                              name={
                                                  value === option.value
                                                      ? 'checkbox-marked-circle'
                                                      : 'checkbox-blank-circle-outline'
                                              }
                                              size={px(15)}
                                          />
                                          <Text style={[styles.itemLabel, {marginLeft: px(6)}]}>{option.label}</Text>
                                      </TouchableOpacity>
                                  );
                              })
                            : null}
                        {type === 'input' ? (
                            <TextInput
                                keyboardType={input_type}
                                maxLength={max_length}
                                onChangeText={(_text) => onChange(index, _text)}
                                placeholder={placeholder}
                                placeholderTextColor={'#BDC2CC'}
                                ref={(ref) => {
                                    inputArr.current[index] = ref;
                                }}
                                style={styles.inputStyle}
                                value={value}
                            />
                        ) : null}
                        {type === 'datepicker' || type === 'picker' ? (
                            <EvilIcons color={Colors.lightGrayColor} name="chevron-right" size={24} />
                        ) : null}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const onChange = (index, value) => {
        const _data = {...data};
        const _list = [...list];
        _list[index].value = value;
        _data.list = _list;
        setData(_data);
    };

    const onPress = (item, index) => {
        const {label, options, type, value} = item;
        if (type === 'input') {
            const input = inputArr.current[index];
            !input?.isFocused?.() && input?.focus?.();
        } else if (type === 'picker') {
            Keyboard.dismiss();
            setShowMask(true);
            Picker.init({
                pickerTitleColor: [31, 36, 50, 1],
                pickerTitleText: `请选择${label}`,
                pickerCancelBtnText: '取消',
                pickerConfirmBtnText: '确定',
                pickerBg: [255, 255, 255, 1],
                pickerToolBarBg: [249, 250, 252, 1],
                pickerData: options.map((_item) => _item.label),
                pickerFontColor: [33, 33, 33, 1],
                pickerRowHeight: 36,
                pickerConfirmBtnColor: [0, 81, 204, 1],
                pickerCancelBtnColor: [128, 137, 155, 1],
                selectedValue: options.filter((_item) => _item.label === value).map((_item) => _item.label),
                pickerTextEllipsisLen: 100,
                wheelFlex: [1, 1],
                onPickerCancel: () => setShowMask(false),
                onPickerConfirm: (pickedValue, pickedIndex) => {
                    onChange(index, pickedValue[0]);
                    setShowMask(false);
                },
            });
            Picker.show();
        }
    };

    const hidePicker = () => {
        Picker.hide();
        setShowMask(false);
    };

    useEffect(() => {
        navigation.setOptions({title: '投资者信息表'});
        setData({
            button: {
                text: '下一步',
                url: '',
            },
            list: [
                {
                    label: '姓名',
                    type: 'text',
                    value: '王某某',
                },
                {
                    label: '证件类型',
                    type: 'text',
                    value: '身份证',
                },
                {
                    label: '证件号',
                    type: 'text',
                    value: '11034565456789',
                },
                {
                    label: '证件有效期是否为永久',
                    options: [
                        {label: '是', value: 1},
                        {label: '否', value: 0},
                    ],
                    type: 'radio',
                    value: 0,
                },
                {
                    label: '证件有效期',
                    type: 'datepicker',
                    value: '2022 / 04 / 27',
                },
                {
                    label: '性别',
                    options: [
                        {label: '男', value: 1},
                        {label: '女', value: 2},
                    ],
                    type: 'picker',
                    value: '请选择',
                },
                {
                    label: '年龄',
                    options: times(101)
                        .slice(1)
                        .map((n) => ({label: `${n}岁`, value: n})),
                    type: 'picker',
                    value: '请选择',
                },
                {
                    input_type: 'phone-pad',
                    label: '手机号',
                    max_length: 11,
                    placeholder: '请输入手机号',
                    type: 'input',
                    value: '',
                },
                {
                    input_type: 'number-pad',
                    label: '邮编',
                    max_length: 6,
                    placeholder: '请输入邮编',
                    type: 'input',
                    value: '',
                },
                {
                    input_type: 'email-address',
                    label: '电子邮箱',
                    max_length: 100,
                    placeholder: '请输入电子邮箱',
                    type: 'input',
                    value: '',
                },
                {
                    input_type: 'default',
                    label: '住址',
                    max_length: 100,
                    placeholder: '请输入住址',
                    type: 'input',
                    value: '',
                },
                {
                    label: '税收居民身份',
                    options: [],
                    tips: '税收居民身份',
                    type: 'picker',
                    value: '请选择',
                },
            ],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            {showMask && <Mask onClick={hidePicker} />}
            <KeyboardAwareScrollView
                bounces={false}
                extraScrollHeight={px(100)}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                <View style={styles.contentBox}>{list?.map?.((item, index) => renderItem(item, index))}</View>
            </KeyboardAwareScrollView>
            <FixedButton onPress={() => jump(url)} title={text} />
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
    contentBox: {
        margin: Space.marginAlign,
        marginBottom: (isIphoneX() ? px(8) + px(45) + 34 : px(8) * 2 + px(45)) + px(20),
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: px(56),
        borderColor: Colors.borderColor,
    },
    itemLabel: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    inputStyle: {
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
});
