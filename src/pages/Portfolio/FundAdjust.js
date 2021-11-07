/*
 * @Date: 2021-11-05 12:19:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-07 11:16:47
 * @Description: 基金调整
 */
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {FixedButton} from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {px} from '../../utils/appUtil';
import http from '../../services';
import {cloneDeep, findLastIndex} from 'lodash';

function reducer(state, action) {
    switch (action.type) {
        case 'select':
            return {
                ...state,
                items: action.payload,
            };
        default:
            throw new Error('未定义的action');
    }
}

export default ({navigation, route}) => {
    const [data, dispatch] = useReducer(reducer, route.params?.asset || {});
    const [changed, setChanged] = useState(false); // 是否已经调整过
    const selectedNum = useRef(0); // 选中基金的数量

    /**
     * 选中/取消选中基金
     * @param {number} index 最后一只有比例的基金下标
     * @param {any[]} items 基金数组
     */
    const calcLastHasRatioPercent = (index, items) => {
        let percent = 0;
        items.forEach((item, idx) => {
            if (item.select && idx !== index) {
                percent += (item.percent * 1).toFixed(2) * 1;
            }
        });
        return ((data?.ratio * 100).toFixed(2) - percent).toFixed(2);
    };
    /**
     * 选中/取消选中基金
     * @param {number} index 基金在数组中的下标
     * @param {boolean} select 选中状态
     */
    const toggleSelect = (index, select) => {
        selectedNum.current += select ? 1 : -1;
        if (selectedNum.current === 0) {
            selectedNum.current += 1;
            return false;
        }
        if (changed) {
            const items = cloneDeep(data?.items);
            if (select) {
                items[index].percent = 0;
                items[index].ratio = 0;
                items[index].select = true;
                dispatch({type: 'select', payload: items});
            } else {
                items[index].select = false;
                const lastSelectedIndex = findLastIndex(items, ['select', true]);
                items[lastSelectedIndex].ratio = items[lastSelectedIndex].ratio * 1 + items[index].ratio * 1;
                items[lastSelectedIndex].percent = data?.ratio * items[lastSelectedIndex].ratio;
                items[index].percent = 0;
                items[index].ratio = 0;
                dispatch({type: 'select', payload: items});
            }
        } else {
            const items = cloneDeep(data.items);
            items[index].select = select;
            const ratio = Math.round(100 / selectedNum.current);
            const lastSelectedIndex = findLastIndex(items, ['select', true]);
            items.forEach((item) => {
                if (item.select) {
                    item.ratio = ratio;
                    item.percent = data?.ratio * ratio;
                } else {
                    item.ratio = 0;
                    item.percent = 0;
                }
            });
            items[lastSelectedIndex].ratio = 100 - (selectedNum.current - 1) * ratio;
            items[lastSelectedIndex].percent = data?.ratio * items[lastSelectedIndex].ratio;
            dispatch({type: 'select', payload: items});
        }
    };

    /**
     * 改变基金比例
     * @param {number} index 基金在数组中的下标
     * @param {string} value 基金比例(100以内的整数)
     */
    const changeRatio = (index, value) => {
        setChanged(true);
        const items = cloneDeep(data.items);
        const lastSelectedIndex = findLastIndex(items, ['select', true]);
        let maxRatio = 0;
        items.forEach((item, idx) => {
            maxRatio += idx !== index && idx !== lastSelectedIndex ? item.ratio * 1 : 0;
        });
        maxRatio = 100 - maxRatio;
        if (value > maxRatio) {
            items[index].error = true;
        } else {
            if (items[index].error) {
                delete items[index].error;
            }
            items[lastSelectedIndex].ratio = maxRatio - value;
            items[lastSelectedIndex].percent = data?.ratio * items[lastSelectedIndex].ratio;
        }
        items[index].ratio = value !== '' ? value * 1 : value;
        items[index].percent = data?.ratio * value;
        dispatch({type: 'select', payload: items});
    };

    /**
     * 失焦时重置超过剩余比例的基金的比例
     * @param {number} index 基金在数组中的下标
     */
    const onBlur = (index) => {
        const items = cloneDeep(data.items);
        if (items[index].error) {
            let max = 0;
            items.forEach((item, idx) => {
                max += idx !== index ? item.ratio * 1 : 0;
            });
            max = 100 - max;
            items[index].ratio = max;
            items[index].percent = data?.ratio * max;
            delete items[index].error;
            dispatch({type: 'select', payload: items});
        }
    };

    useEffect(() => {
        selectedNum.current = data?.items?.filter((item) => item.select).length;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: `${data.name || ''}基金调整`,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(data.items);
    }, [data.items]);

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <View style={{paddingHorizontal: Space.padding}}>
                    <View style={styles.assetPool}>
                        <View style={Style.flexRow}>
                            <View style={[styles.circle, {backgroundColor: data?.color || Colors.defaultColor}]} />
                            <Text style={styles.poolName}>
                                {data?.name} 总占比：{(data?.ratio * 100).toFixed(2)}%
                            </Text>
                        </View>
                        <View style={{paddingTop: px(4), paddingHorizontal: px(8)}}>
                            <Text style={styles.tips}>{data?.desc}</Text>
                        </View>
                    </View>
                    {data?.items?.map?.((fund, index, arr) => {
                        // 最后一只选中的基金下标
                        const lastSelectedIndex = findLastIndex(arr, ['select', true]);
                        // 最后一只有比例的基金下标
                        const lastHasRatioIndex = findLastIndex(arr, (item) => item.ratio != 0);
                        return (
                            <View
                                key={fund + index}
                                style={[styles.fundItem, fund.select ? {} : {paddingTop: 0, justifyContent: 'center'}]}>
                                <View style={Style.flexBetween}>
                                    <View style={Style.flexRow}>
                                        <CheckBox
                                            control
                                            checked={fund.select}
                                            onChange={(checked) => toggleSelect(index, checked)}
                                        />
                                        <View style={{marginLeft: px(12)}}>
                                            <Text style={styles.fundName}>{fund.name}</Text>
                                            {fund.select ? (
                                                <Text style={styles.fundPercent}>
                                                    {lastHasRatioIndex === index && lastHasRatioIndex !== 0 ? '约' : ''}
                                                    占总配置的
                                                    {lastHasRatioIndex === index && lastHasRatioIndex !== 0
                                                        ? calcLastHasRatioPercent(lastHasRatioIndex, arr)
                                                        : (fund.percent * 1).toFixed(2)}
                                                    %
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    {fund.select ? (
                                        <View style={Style.flexRow}>
                                            <View
                                                style={[
                                                    Style.flexCenter,
                                                    styles.inputBox,
                                                    fund.error ? {borderColor: Colors.red} : {},
                                                ]}>
                                                <TextInput
                                                    editable={lastSelectedIndex !== index || lastSelectedIndex === 0}
                                                    keyboardType="numeric"
                                                    value={`${fund.ratio}`}
                                                    onBlur={() => onBlur(index)}
                                                    onChangeText={(value) =>
                                                        changeRatio(index, value.replace(/\D/g, ''))
                                                    }
                                                    style={{
                                                        color:
                                                            lastSelectedIndex !== index || lastSelectedIndex === 0
                                                                ? Colors.defaultColor
                                                                : '#BDC2CC',
                                                    }}
                                                />
                                            </View>
                                            <Text style={styles.unit}>%</Text>
                                        </View>
                                    ) : null}
                                </View>
                                {fund.select && fund.tips ? (
                                    <View style={styles.tipsBox}>
                                        <Text style={styles.tips}>{fund.tips}</Text>
                                    </View>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <FixedButton title={'确认调整'} onPress={() => navigation.navigate(route.params.ref, {asset: data})} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    assetPool: {
        paddingVertical: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    circle: {
        width: px(10),
        height: px(10),
        borderRadius: px(5),
        marginRight: px(8),
    },
    poolName: {
        fontSize: px(15),
        lineHeight: px(21),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    tips: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#EB7121',
    },
    fundItem: {
        paddingTop: Space.padding,
        borderBottomWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        minHeight: px(70),
    },
    fundName: {
        fontSize: px(13),
        lineHeight: px(18),
        color: Colors.defaultColor,
    },
    fundPercent: {
        marginTop: px(4),
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.lightGrayColor,
    },
    inputBox: {
        marginHorizontal: px(6),
        borderWidth: Space.borderWidth,
        borderRadius: Space.borderRadius,
        borderColor: Colors.bgColor,
        width: px(60),
        height: px(32),
        backgroundColor: Colors.bgColor,
    },
    unit: {
        fontSize: Font.textH3,
        lineHeight: px(15),
        color: Colors.defaultColor,
    },
    tipsBox: {
        marginTop: px(8),
        padding: px(8),
        backgroundColor: '#FFF5E5',
    },
});
