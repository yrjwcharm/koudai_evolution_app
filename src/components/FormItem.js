import React, {useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Image from 'react-native-fast-image';
import Picker from 'react-native-picker';
import Feather from 'react-native-vector-icons/Feather';
import {Colors, Font, Space, Style} from '~/common/commonStyle';
import {useJump} from '~/components/hooks';
import HTML from '~/components/RenderHtml';
import {BankCardModal, Modal} from '~/components/Modal';
import {px} from '~/utils/appUtil';

const FormItem = ({data, onChange, setShowMask}) => {
    const jump = useJump();
    const {
        input_type,
        label,
        max_length,
        options,
        pay_methods = [],
        placeholder,
        suffix,
        tip: tips,
        type,
        url = '',
        value,
    } = data;
    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const inputMask = useRef();
    const bankcardModal = useRef();

    const onPress = () => {
        if (type === 'bankcard') {
            bankcardModal.current?.show?.();
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
                pickerToolBarFontSize: Font.textH1,
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
                        <Image source={require('~/assets/img/tip.png')} style={styles.tipsIcon} />
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
                            if (type === 'bankcard') {
                                const i = pay_methods.findIndex((v) => v.pay_method === value);
                                _label = i !== -1 ? `${pay_methods[i].bank_name} (${pay_methods[i].bank_no})` : '';
                            }
                            if (type === 'select') {
                                const i = options.findIndex((v) => v.value === value);
                                _label = options[i]?.label || '';
                            }
                            return (
                                <>
                                    <HTML
                                        html={_label || value || (type === 'jump' ? ' ' : '请选择')}
                                        style={styles.itemLabel}
                                    />
                                    {type === 'text' ? null : (
                                        <Feather color={Colors.defaultColor} name="chevron-right" size={18} />
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
                                                    source={require('~/assets/img/fof/check.png')}
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
                            `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}-${
                                date.getDate() < 10 ? '0' : ''
                            }${date.getDate()}`
                        );
                        setOpen(false);
                    }}
                    open={open}
                    title={`请选择${label}`}
                />
            ) : null}
            {type === 'bankcard' ? (
                <BankCardModal
                    data={pay_methods}
                    onDone={(select) => {
                        onChange(select.pay_method);
                    }}
                    ref={bankcardModal}
                    select={pay_methods.findIndex((item) => item.pay_method === value)}
                />
            ) : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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

export default FormItem;
