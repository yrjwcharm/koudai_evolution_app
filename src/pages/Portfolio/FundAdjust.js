/*
 * @Date: 2021-11-05 12:19:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-08 12:40:15
 * @Description: 基金调整
 */
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {FixedButton} from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {px, onlyNumber} from '../../utils/appUtil';
import http from '../../services';
import {cloneDeep, findLastIndex} from 'lodash';
import Toast from '../../components/Toast';

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
    const [maxInitAmountIndex, setMaxInitAmountIndex] = useState(-1); // 导致最大起购金额基金下标 -1表示没有超过初始起购金额的

    /**
     * 计算最后一只有比例的基金占总配置的百分比
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
                items[index].amount = 0;
                items[index].percent = 0;
                items[index].ratio = 0;
                items[index].select = true;
                dispatch({type: 'select', payload: items});
            } else {
                items[index].select = false;
                const lastSelectedIndex = findLastIndex(items, ['select', true]);
                if (route.params.ref === 'ChooseFund') {
                    items[lastSelectedIndex].ratio = items[lastSelectedIndex].ratio * 1 + items[index].ratio * 1;
                    items[lastSelectedIndex].percent = data?.ratio * items[lastSelectedIndex].ratio;
                } else {
                    items[lastSelectedIndex].amount =
                        ((items[lastSelectedIndex].amount + items[index].amount) * 1).toFixed(12) * 1;
                }
                items[index].amount = 0;
                items[index].percent = 0;
                items[index].ratio = 0;
                dispatch({type: 'select', payload: items});
            }
        } else {
            const items = cloneDeep(data.items);
            items[index].select = select;
            const ratio = Math.round(100 / selectedNum.current);
            const amount = (data?.amount / selectedNum.current).toFixed(2) * 1;
            const lastSelectedIndex = findLastIndex(items, ['select', true]);
            items.forEach((item) => {
                if (item.select) {
                    if (route.params.ref === 'ChooseFund') {
                        item.ratio = ratio;
                        item.percent = data?.ratio * ratio;
                    } else {
                        item.amount = amount;
                    }
                } else {
                    item.amount = 0;
                    item.ratio = 0;
                    item.percent = 0;
                }
            });
            if (route.params.ref === 'ChooseFund') {
                items[lastSelectedIndex].ratio = 100 - (selectedNum.current - 1) * ratio;
                items[lastSelectedIndex].percent = data?.ratio * items[lastSelectedIndex].ratio;
            } else {
                items[lastSelectedIndex].amount = (data?.amount - (selectedNum.current - 1) * amount).toFixed(12) * 1;
            }
            dispatch({type: 'select', payload: items});
        }
    };

    /**
     * 改变基金比例
     * @param {number} index 基金在数组中的下标
     * @param {string} value 基金比例(100以内的整数)/基金金额
     */
    const changeRatio = (index, value) => {
        setChanged(true);
        const items = cloneDeep(data.items);
        const lastSelectedIndex = findLastIndex(items, ['select', true]);
        let maxRatio = 0;
        let maxAmount = 0;
        items.forEach((item, idx) => {
            maxRatio += idx !== index && idx !== lastSelectedIndex ? item.ratio * 1 : 0;
            maxAmount =
                idx !== index && idx !== lastSelectedIndex
                    ? ((maxAmount + item.amount) * 1).toFixed(12) * 1
                    : maxAmount;
        });
        maxRatio = 100 - maxRatio;
        maxAmount = (data?.amount - maxAmount).toFixed(12) * 1;
        console.log(maxAmount);
        if (value > (route.params.ref === 'ChooseFund' ? maxRatio : maxAmount)) {
            items[index].error = true;
        } else if (route.params.ref === 'AddedBuy' && value != 0 && value < parseFloat(items[index].min_limit)) {
            items[index].error = true;
        } else {
            if (items[index].error) {
                delete items[index].error;
            }
            if (route.params.ref === 'ChooseFund') {
                items[lastSelectedIndex].ratio = maxRatio - value;
                items[lastSelectedIndex].percent = data?.ratio * items[lastSelectedIndex].ratio;
            } else {
                items[lastSelectedIndex].amount = (maxAmount - value).toFixed(12) * 1;
                if (
                    items[lastSelectedIndex].amount != 0 &&
                    items[lastSelectedIndex].amount < parseFloat(items[lastSelectedIndex].min_limit)
                ) {
                    items[lastSelectedIndex].error = true;
                }
            }
        }
        if (route.params.ref === 'ChooseFund') {
            items[index].ratio = value !== '' ? value * 1 : value;
            items[index].percent = data?.ratio * value;
        } else {
            items[index].amount = value;
        }
        dispatch({type: 'select', payload: items});
    };

    /**
     * 失焦时重置超过剩余比例的基金的比例
     * @param {number} index 基金在数组中的下标
     */
    const onBlur = (index) => {
        const items = cloneDeep(data.items);
        const lastSelectedIndex = findLastIndex(items, ['select', true]);
        let maxRatio = 0;
        let maxAmount = 0;
        if (items[index].error) {
            items.forEach((item, idx) => {
                maxRatio += idx !== index ? item.ratio * 1 : 0;
                maxAmount = idx !== index ? ((maxAmount + item.amount) * 1).toFixed(12) * 1 : maxAmount;
            });
            maxRatio = 100 - maxRatio;
            maxAmount = (data?.amount - maxAmount).toFixed(12) * 1;
            if (route.params.ref === 'ChooseFund') {
                items[index].ratio = maxRatio;
                items[index].percent = data?.ratio * maxRatio;
            } else {
                if (items[index].amount > maxAmount) {
                    items[index].amount = maxAmount;
                }
                if (items[index].amount < parseFloat(items[index].min_limit)) {
                    items[index].amount = parseFloat(items[index].min_limit);
                    items[lastSelectedIndex].amount = (maxAmount - items[index].amount).toFixed(12) * 1;
                }
            }
            delete items[index].error;
        } else if (items[lastSelectedIndex].error) {
            items.forEach((item, idx) => {
                maxAmount =
                    idx !== index && idx !== lastSelectedIndex
                        ? ((maxAmount + item.amount) * 1).toFixed(12) * 1
                        : maxAmount;
            });
            maxAmount = (data?.amount - maxAmount).toFixed(12) * 1;
            items[lastSelectedIndex].amount = parseFloat(items[lastSelectedIndex].min_limit);
            items[index].amount = (maxAmount - items[lastSelectedIndex].amount).toFixed(12) * 1;
            delete items[lastSelectedIndex].error;
        }
        dispatch({type: 'select', payload: items});
    };

    /** @name 确认调整 */
    const onSubmit = () => {
        // const init_amount =
        //     maxInitAmountIndex > -1
        //         ? data.items[maxInitAmountIndex].min_limit / (data.items[maxInitAmountIndex].percent / 100)
        //         : data.init_amount;
        // const items = data.items.sort((a, b) => b.percent - a.percent);
        if (route.params.ref === 'ChooseFund') {
            navigation.navigate(route.params.ref, {asset: data});
        } else {
            http.post('/trade/batch/buy/modify/20211101', {
                poid: data.poid,
                plan_id: data.plan_id,
                list: JSON.stringify(data),
            }).then((res) => {
                if (res.code === '000000') {
                    Toast.show('保存成功');
                    navigation.goBack();
                }
            });
        }
    };

    useEffect(() => {
        selectedNum.current = data?.items?.filter((item) => item.select).length;
        const {items} = data;
        if (selectedNum.current > 1) {
            // 除了最后一个其他基金比例都相等表示没改过
            const isChanged = items
                ?.filter((item) => item.select)
                ?.slice?.(0, -1)
                ?.every?.((item) => item.ratio === items[0].ratio);
            setChanged(!isChanged);
        } else {
            setChanged(false);
        }
        if (route.params.ref === 'AddedBuy') {
            setChanged(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: `${data.name || ''}基金调整`,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // console.log(data.items);
        if (route.params.ref === 'ChooseFund') {
            let maxInitAmount = 0;
            let maxIndex = -1;
            data?.items?.forEach?.((item, index) => {
                if (item.ratio) {
                    // 计划起购金额
                    const initAmount = item.min_limit / (item.percent / 100);
                    if (initAmount > data.init_amount && initAmount > maxInitAmount) {
                        maxIndex = index;
                        maxInitAmount = initAmount;
                    }
                }
            });
            setMaxInitAmountIndex(maxIndex);
        } else {
            let maxIndex = -1;
            data?.items?.forEach?.((item, index) => {
                if (item.amount != 0) {
                    if (item.amount < parseFloat(item.min_limit)) {
                        maxIndex = index;
                    }
                }
            });
            setMaxInitAmountIndex(maxIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.init_amount, data.items]);

    return (
        <View style={styles.container}>
            <ScrollView bounces={false} style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <View style={{paddingHorizontal: Space.padding}}>
                    <View style={styles.assetPool}>
                        <View style={Style.flexRow}>
                            <View style={[styles.circle, {backgroundColor: data?.color || Colors.defaultColor}]} />
                            <Text style={styles.poolName}>
                                {route.params.ref === 'ChooseFund'
                                    ? `${data?.name} 总占比：${(data?.ratio * 100).toFixed(2)}%`
                                    : `追加购买${data?.name} 总金额：￥${data?.amount}`}
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
                        // 计划起购金额
                        const initAmount =
                            route.params.ref === 'ChooseFund' && fund.ratio ? fund.min_limit / (fund.percent / 100) : 0;
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
                                            {fund.select && route.params.ref === 'ChooseFund' ? (
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
                                            {route.params.ref === 'AddedBuy' ? (
                                                <Text style={styles.unit}>￥</Text>
                                            ) : null}
                                            <View
                                                style={[
                                                    Style.flexCenter,
                                                    styles.inputBox,
                                                    fund.error ? {borderColor: Colors.red} : {},
                                                ]}>
                                                <TextInput
                                                    editable={lastSelectedIndex !== index || lastSelectedIndex === 0}
                                                    keyboardType={
                                                        route.params.ref === 'ChooseFund' ? 'number-pad' : 'numeric'
                                                    }
                                                    value={
                                                        route.params.ref === 'ChooseFund'
                                                            ? `${fund.ratio}`
                                                            : `${fund.amount}`
                                                    }
                                                    onBlur={() => onBlur(index)}
                                                    onChangeText={(value) => {
                                                        if (route.params.ref === 'ChooseFund') {
                                                            changeRatio(index, value.replace(/\D/g, ''));
                                                        } else {
                                                            changeRatio(index, value);
                                                        }
                                                    }}
                                                    style={{
                                                        color:
                                                            lastSelectedIndex !== index || lastSelectedIndex === 0
                                                                ? Colors.defaultColor
                                                                : '#BDC2CC',
                                                    }}
                                                />
                                            </View>
                                            {route.params.ref === 'ChooseFund' ? (
                                                <Text style={styles.unit}>%</Text>
                                            ) : null}
                                        </View>
                                    ) : null}
                                </View>
                                {fund.select && index === maxInitAmountIndex ? (
                                    <View style={styles.tipsBox}>
                                        <Text style={styles.tips}>
                                            {route.params.ref === 'ChooseFund'
                                                ? `由于该基金配置比例过低，因此您的起投金额需要达到
                                            ${(initAmount * 1).toFixed(2)}元。`
                                                : `该基金最低起购金额${parseFloat(fund.min_limit)}`}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <FixedButton title={'确认调整'} onPress={onSubmit} />
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