import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {px} from '../../../utils/appUtil';
/**
 * @callback onChange
 * @param {any} item
 * @param {number} index
 * @param {any} [value]  如果设置了valueKey 则有值
 */
/**
 *
 * @param {object} option
 * @param {array} option.data
 * @param {string} [option.labelKey] 用来显示文字的字段key, 如果是fasy值则直接显示item
 * @param {number} [option.active] 选中的btn
 * @param {string} [option.valueKey] value key
 * @param {onChange} [option.onChange] change 事件
 * @param {object} [option.btnDefaultStyle] 按钮默认样式
 * @returns
 */
const PKBtnTab = ({
    data = [],
    labelKey = '',
    valueKey = '',
    active = 0,
    onChange,
    btnDefaultStyle = {backgroundColor: '#fff'},
}) => {
    const handlerPress = (item, idx) => {
        if (idx === active) return;
        onChange?.(item, idx, item[valueKey]);
    };
    return (
        <View style={styles.container}>
            {data.map((item, idx) => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={idx}
                    style={[
                        styles.btn,
                        {
                            marginLeft: idx > 0 ? px(12) : 0,
                            backgroundColor: idx === active ? '#DEE8FF' : btnDefaultStyle.backgroundColor,
                        },
                    ]}
                    onPress={() => handlerPress(item, idx)}>
                    <Text
                        style={[
                            styles.btnText,
                            {
                                color: idx === active ? '#0051CC' : '#121D3A',
                            },
                        ]}>
                        {labelKey ? item[labelKey] : item}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: px(8),
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn: {
        paddingHorizontal: px(12),
        paddingVertical: px(6),
        borderRadius: px(20),
    },
    btnText: {
        fontSize: px(12),
        lineHeight: px(17),
    },
});
export default PKBtnTab;
