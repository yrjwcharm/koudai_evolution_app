/*
 * @Date: 2021-11-05 12:19:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-05 18:34:02
 * @Description: 基金调整
 */
import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
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
    const [data, dispatch] = useReducer(reducer, {
        head: {
            ratio: 0.6018,
            ratio_desc: '大盘股票 总占比：60.18%',
            desc: '基金比例默认为平均分配，不构成投资建议',
        },
        items: [
            {
                name: '鹏华空天军工指数(LOF)A',
                percent: '30.09',
                ratio: 50,
                select: true,
            },
            {
                name: '华安易富黄金ETF联接C',
                percent: '30.09',
                ratio: 50,
                select: true,
            },
            {
                name: '长城久源灵活配置混合',
                percent: 0,
                ratio: 0,
                select: false,
            },
            {
                name: '前海开源中航军工',
                percent: 0,
                ratio: 0,
                select: false,
            },
        ],
    });
    const [changed, setChanged] = useState(false); // 是否已经调整过
    const selectedNum = useRef(0); // 选中基金的数量

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
            const items = cloneDeep(data.items);
            if (select) {
                items[index].percent = 0;
                items[index].ratio = 0;
                items[index].select = true;
                dispatch({type: 'select', payload: items});
            } else {
                items[index].select = false;
                const lastSelectedIndex = findLastIndex(items, ['select', true]);
                items[lastSelectedIndex].ratio = items[lastSelectedIndex].ratio * 1 + items[index].ratio * 1;
                items[lastSelectedIndex].percent = data?.head?.ratio * items[lastSelectedIndex].ratio;
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
                    item.percent = data?.head?.ratio * ratio;
                } else {
                    item.ratio = 0;
                    item.percent = 0;
                }
            });
            items[lastSelectedIndex].ratio = 100 - (selectedNum.current - 1) * ratio;
            items[lastSelectedIndex].percent = data?.head?.ratio * items[lastSelectedIndex].ratio;
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
        let max = 0;
        items.forEach((item, idx) => {
            max += idx !== index && idx !== lastSelectedIndex ? item.ratio * 1 : 0;
        });
        max = 100 - max;
        if (value > max) {
            items[index].error = true;
        } else {
            if (items[index].error) {
                delete items[index].error;
            }
            items[lastSelectedIndex].ratio = max - value;
            items[lastSelectedIndex].percent = data?.head?.ratio * items[lastSelectedIndex].ratio;
        }
        items[index].ratio = value;
        items[index].percent = data?.head?.ratio * value;
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
            items[index].percent = data?.head?.ratio * max;
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
            title: `${route.params?.name || ''}基金调整`,
        });
    }, [navigation, route]);

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}} scrollIndicatorInsets={{right: 1}}>
                <View style={{paddingHorizontal: Space.padding}}>
                    <View style={styles.assetPool}>
                        <View style={Style.flexRow}>
                            <View
                                style={[styles.circle, {backgroundColor: route.params?.color || Colors.defaultColor}]}
                            />
                            <Text style={styles.poolName}>{data?.head?.ratio_desc}</Text>
                        </View>
                        <View style={{paddingTop: px(4), paddingHorizontal: px(8)}}>
                            <Text style={styles.tips}>{data?.head?.desc}</Text>
                        </View>
                    </View>
                    {data?.items?.map?.((fund, index, arr) => {
                        const lastSelectedIndex = findLastIndex(arr, ['select', true]);
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
                                        <TouchableOpacity activeOpacity={0.8} style={{marginLeft: px(12)}}>
                                            <Text style={styles.fundName}>{fund.name}</Text>
                                            {fund.select ? (
                                                <Text style={styles.fundPercent}>
                                                    占总配置的{(fund.percent * 1).toFixed(2)}%
                                                </Text>
                                            ) : null}
                                        </TouchableOpacity>
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
            <FixedButton title={'确认调整'} />
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
