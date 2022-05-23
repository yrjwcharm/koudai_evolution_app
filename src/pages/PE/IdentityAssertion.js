/*
 * @Date: 2022-05-13 13:01:44
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-21 15:39:27
 * @Description: 个人税收居民身份声明
 */
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Image from 'react-native-fast-image';
import Picker from 'react-native-picker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import qs from 'qs';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {FixedButton} from '../../components/Button';
import {useJump} from '../../components/hooks';
import HTML from '../../components/RenderHtml';
import Mask from '../../components/Mask';
import {Modal} from '../../components/Modal';
import Loading from '../Portfolio/components/PageLoading';
// import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';

export const FormItem = ({data, onChange, setShowMask, showBankCardModal}) => {
    const jump = useJump();
    const {input_type, label, max_length, options, placeholder, suffix, tip: tips, type, url = '', value} = data;
    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const inputMask = useRef();

    const onPress = () => {
        if (type === 'bankcard') {
            showBankCardModal && showBankCardModal();
        } else if (type === 'date') {
            setOpen(true);
        } else if (type === 'input') {
            const input = inputRef.current;
            !input?.isFocused?.() && input?.focus?.();
        } else if (type === 'jump') {
            jump(url);
        } else if (type === 'select') {
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
                selectedValue: options.filter((_item) => _item.value === value).map((_item) => _item.label),
                pickerTextEllipsisLen: 100,
                wheelFlex: [1, 1],
                onPickerCancel: () => setShowMask(false),
                onPickerConfirm: (pickedValue, pickedIndex) => {
                    onChange(options[pickedIndex].value);
                    setShowMask(false);
                },
            });
            Picker.show();
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={type === 'radio' || type === 'text' ? 1 : 0.8}
            onPress={onPress}
            style={[Style.flexBetween, {height: '100%'}]}>
            <View style={Style.flexRow}>
                <Text style={styles.itemLabel}>{label}</Text>
                {tips ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => Modal.show({content: tips, title: '提示'})}
                        style={{marginLeft: px(2)}}>
                        <Image source={require('../../assets/img/tip.png')} style={styles.tipsIcon} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={[Style.flexRow, {flexShrink: 1}]}>
                {(() => {
                    switch (type) {
                        case 'bankcard':
                        case 'date':
                        case 'jump':
                        case 'select':
                        case 'text':
                            let _label = '';
                            if (type === 'select') {
                                const i = options.findIndex((v) => v.value === value);
                                _label = options[i]?.label || '';
                            }
                            return (
                                <>
                                    <HTML html={_label || value} style={styles.itemLabel} />
                                    {type === 'text' ? null : (
                                        <EvilIcons color={Colors.lightGrayColor} name="chevron-right" size={24} />
                                    )}
                                </>
                            );
                        case 'input':
                            return (
                                <>
                                    <TextInput
                                        keyboardType={input_type}
                                        maxLength={max_length}
                                        onBlur={() => {
                                            inputMask.current?.setNativeProps({style: {display: 'flex'}});
                                        }}
                                        onChangeText={(_text) => onChange(_text)}
                                        onFocus={() => {
                                            inputMask.current?.setNativeProps({style: {display: 'none'}});
                                        }}
                                        placeholder={placeholder}
                                        placeholderTextColor={'#BDC2CC'}
                                        ref={inputRef}
                                        style={styles.inputStyle}
                                        value={`${value}`}
                                    />
                                    {suffix ? (
                                        <Text
                                            style={[styles.itemLabel, {marginLeft: px(8), color: Colors.defaultColor}]}>
                                            {suffix}
                                        </Text>
                                    ) : null}
                                </>
                            );
                        case 'radio':
                            return options?.map?.((option, i) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        key={option + i}
                                        onPress={() => onChange(option.value)}
                                        style={[Style.flexRow, {marginLeft: i === 0 ? 0 : px(36)}]}>
                                        <View
                                            style={[
                                                styles.radioIconBox,
                                                {borderWidth: value !== option.value ? Space.borderWidth : 0},
                                            ]}>
                                            {value === option.value ? (
                                                <Image
                                                    source={require('../../assets/img/fof/check.png')}
                                                    style={styles.checked}
                                                />
                                            ) : null}
                                        </View>
                                        <Text style={styles.itemLabel}>{option.label}</Text>
                                    </TouchableOpacity>
                                );
                            });
                        default:
                            return null;
                    }
                })()}
            </View>
            {type === 'input' ? (
                <TouchableOpacity activeOpacity={0.8} onPress={onPress} ref={inputMask} style={styles.inputMask} />
            ) : null}
            {type === 'date' ? (
                <DatePicker
                    androidVariant="iosClone"
                    cancelText="取消"
                    confirmText="确定"
                    date={new Date(value)}
                    modal
                    mode="date"
                    onCancel={() => setOpen(false)}
                    onConfirm={(date) => {
                        onChange(
                            `${date.getFullYear()} / ${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1} / ${
                                date.getDate() < 10 ? '0' : ''
                            }${date.getDate()}`
                        );
                        setOpen(false);
                    }}
                    open={open}
                    title={`请选择${label}`}
                />
            ) : null}
        </TouchableOpacity>
    );
};

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const [showMask, setShowMask] = useState(false);
    const [deltaHeight, setDeltaHeight] = useState(0);
    const {button = {}, parts = []} = data;
    const {text, url} = button;

    const onChange = (value, index, partIndex) => {
        const _data = {...data};
        const _list = _data.parts[partIndex].list;
        _list[index].value = value;
        setData(_data);
    };

    const hidePicker = () => {
        Picker.hide();
        setShowMask(false);
    };

    useEffect(() => {
        navigation.setOptions({title: '投资者信息表'});
        setData({
            button: {
                text: '提交信息',
                url: '',
            },
            parts: [
                {
                    list: [
                        {
                            input_type: 'default',
                            label: '姓（英文/拼音）',
                            max_length: 100,
                            placeholder: '请填写英文姓',
                            type: 'input',
                            value: '',
                        },
                        {
                            input_type: 'default',
                            label: '名（英文/拼音）',
                            max_length: 100,
                            placeholder: '请填写英文名',
                            type: 'input',
                            value: '',
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
                            label: '出生日期',
                            type: 'datepicker',
                            value: '2022 / 04 / 27',
                        },
                    ],
                },
                {
                    list: [
                        {
                            label: '国家/地区',
                            options: [],
                            type: 'picker',
                            value: '请选择',
                        },
                        {
                            input_type: 'default',
                            label: '省/城市',
                            max_length: 100,
                            placeholder: '请填写省/城市',
                            type: 'input',
                            value: '',
                        },
                    ],
                    title: '居住地',
                },
                {
                    list: [
                        {
                            label: '国家/地区',
                            options: [],
                            type: 'picker',
                            value: '请选择',
                        },
                        {
                            input_type: 'default',
                            label: '省/城市',
                            max_length: 100,
                            placeholder: '请填写省/城市',
                            type: 'input',
                            value: '',
                        },
                    ],
                    title: '出生地',
                },
                {
                    list: [
                        {
                            label: '税收国/地区',
                            options: [],
                            type: 'picker',
                            value: '请选择',
                        },
                        {
                            label: '是否有纳税人识别号',
                            options: [
                                {label: '是', value: 1},
                                {label: '否', value: 0},
                            ],
                            type: 'picker',
                            value: '请选择',
                        },
                        {
                            dependency: 'index=1&val=1',
                            input_type: 'default',
                            label: '纳税人识别号1',
                            max_length: 100,
                            placeholder: '请填写（必填）',
                            type: 'input',
                            value: '',
                        },
                        {
                            dependency: 'index=1&val=1',
                            input_type: 'default',
                            label: '纳税人识别号2',
                            max_length: 100,
                            placeholder: '如有（选填）',
                            type: 'input',
                            value: '',
                        },
                        {
                            dependency: 'index=1&val=1',
                            input_type: 'default',
                            label: '纳税人识别号3',
                            max_length: 100,
                            placeholder: '如有（选填）',
                            type: 'input',
                            value: '',
                        },
                        {
                            dependency: 'index=1&val=0',
                            input_type: 'default',
                            label: '请选择原因',
                            max_length: 300,
                            options: [
                                {label: '居民国（地区）不发放纳税人识别号', value: 1},
                                {label: '账户持有人未能取得纳税人识别号', value: 2},
                            ],
                            placeholder: '请解释具体原因',
                            textarea_value: '',
                            type: 'vertical_radio',
                            value: 0,
                        },
                    ],
                    title: '税收居民国/地区和纳税人识别号',
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
                extraScrollHeight={px(100) + deltaHeight}
                scrollIndicatorInsets={{right: 1}}
                style={{flex: 1}}>
                {parts.map((part, i, _parts) => {
                    const {list = [], title} = part;
                    return (
                        <View
                            key={part + i}
                            style={[
                                {marginTop: Space.marginVertical},
                                i === _parts.length - 1
                                    ? {
                                          marginBottom:
                                              (isIphoneX() ? px(8) + px(45) + 34 : px(8) * 2 + px(45)) +
                                              px(20) +
                                              deltaHeight,
                                      }
                                    : {},
                            ]}>
                            {title ? <Text style={styles.partTitle}>{title}</Text> : null}
                            <View style={[styles.contentBox, {marginTop: title ? px(12) : 0}]}>
                                {list?.map?.((item, j, _list) => {
                                    const {
                                        input_type,
                                        label,
                                        max_length,
                                        options,
                                        placeholder,
                                        textarea_value,
                                        tips,
                                        value,
                                    } = item;
                                    if (item.dependency) {
                                        const {index, val} = qs.parse(item.dependency);
                                        if (_list[index].value != val) {
                                            return null;
                                        }
                                    }
                                    return item.type === 'vertical_radio' ? (
                                        <View
                                            key={item + j}
                                            style={[
                                                styles.verticalRadioBox,
                                                {borderTopWidth: j !== 0 ? Space.borderWidth : 0},
                                            ]}>
                                            <View style={Style.flexRow}>
                                                <Text style={styles.itemLabel}>{label}</Text>
                                                {tips ? (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={() => Modal.show({content: tips, title: '提示'})}
                                                        style={{marginLeft: px(2)}}>
                                                        <EvilIcons color={'#999999'} name={'question'} size={22} />
                                                    </TouchableOpacity>
                                                ) : null}
                                            </View>
                                            {options?.map?.((option, l) => {
                                                return (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        key={option + l}
                                                        onPress={() => onChange(option.value, j, i)}
                                                        style={[
                                                            Style.flexRow,
                                                            {marginTop: l === 0 ? px(12) : Space.marginVertical},
                                                        ]}>
                                                        <View
                                                            style={[
                                                                styles.radioIconBox,
                                                                {
                                                                    borderWidth:
                                                                        value !== option.value ? Space.borderWidth : 0,
                                                                },
                                                            ]}>
                                                            {value === option.value ? (
                                                                <Image
                                                                    source={require('../../assets/img/fof/check.png')}
                                                                    style={styles.checked}
                                                                />
                                                            ) : null}
                                                        </View>
                                                        <Text style={[styles.itemLabel, {marginLeft: px(6)}]}>
                                                            {option.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                            <View style={styles.inputBox}>
                                                <TextInput
                                                    keyboardType={input_type}
                                                    maxLength={max_length}
                                                    multiline
                                                    onChangeText={(_text) => {
                                                        const _data = {...data};
                                                        const tempList = _data.parts[i].list;
                                                        tempList[j].textarea_value = _text;
                                                        setData(_data);
                                                    }}
                                                    placeholder={placeholder}
                                                    placeholderTextColor={'#BDC2CC'}
                                                    style={styles.textarea}
                                                    textAlignVertical="top"
                                                    value={textarea_value}
                                                />
                                                <Text style={[styles.itemLabel, styles.countText]}>
                                                    {textarea_value.length}/{max_length}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View
                                            key={item + j}
                                            style={[styles.itemBox, {borderTopWidth: j !== 0 ? Space.borderWidth : 0}]}>
                                            <FormItem
                                                data={item}
                                                onChange={(val) => onChange(val, j, i)}
                                                setShowMask={setShowMask}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    );
                })}
            </KeyboardAwareScrollView>
            <FixedButton
                agreement={{
                    default_agree: false,
                    list: [],
                }}
                checkIcon={require('../../assets/img/fof/check.png')}
                color="#EDDBC5"
                disabledColor="#EDDBC5"
                heightChange={(height) => setDeltaHeight(height)}
                onPress={() => jump(url)}
                style={{backgroundColor: '#D7AF74'}}
                suffix={'本人确认上述信息真实、准确完整，且当这些信息发生变更时，将在30日内通知贵机构。'}
                title={text}
            />
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
    partTitle: {
        marginLeft: Space.marginAlign,
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    contentBox: {
        marginHorizontal: Space.marginAlign,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    itemBox: {
        height: px(56),
        borderColor: Colors.borderColor,
    },
    verticalRadioBox: {
        paddingVertical: Space.padding,
        borderColor: Colors.borderColor,
    },
    itemLabel: {
        fontSize: Font.textH2,
        lineHeight: px(20),
        color: Colors.descColor,
    },
    tipsIcon: {
        marginLeft: px(8),
        width: px(14),
        height: px(14),
    },
    inputStyle: {
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
        minWidth: px(100),
        textAlign: 'right',
    },
    inputMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    inputBox: {
        marginTop: Space.marginVertical,
        borderRadius: px(4),
        backgroundColor: Colors.bgColor,
        position: 'relative',
    },
    textarea: {
        padding: px(12),
        paddingTop: px(12),
        height: px(116),
        fontSize: Font.textH2,
        lineHeight: px(16),
        color: Colors.defaultColor,
    },
    countText: {
        color: '#BDC2CC',
        position: 'absolute',
        right: px(12),
        bottom: px(12),
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
});
