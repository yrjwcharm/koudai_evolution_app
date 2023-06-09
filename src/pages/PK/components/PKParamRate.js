import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {px} from '../../../utils/appUtil';

/**
 *
 * @param {object} options
 * @param {number} [options.total] 总数
 * @param {number} options.value 当前数
 * @param {string} options.color 颜色
 * @param {number} [options.barsNum] 进度条块数
 * @param {"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | undefined} [options.justifyContent] 进度条数据描述对齐方式
 * @returns
 */
const PKParamRate = ({total = 100, value, color = '#9AA0B1', barsNum = 5, justifyContent = 'flex-start'}) => {
    const highLightNum = useMemo(() => {
        let barValue = Math.round(total / barsNum);
        return Math.ceil((value || 0) / barValue);
    }, [total, value, barsNum]);

    const handlerValue = (val) => {
        let state = !!val;
        return state ? Math.round(val) : '--';
    };

    return (
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent}}>
                <Text style={[styles.text, {color}]}>{handlerValue(value)}</Text>
                <Text style={[styles.text, {color: '#9AA0B1'}]}>/{total}</Text>
            </View>
            <View style={styles.barWrap}>
                {new Array(barsNum).fill('').map((item, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.bar,
                            {
                                flex: 1,
                                marginLeft: idx > 0 ? 2 : 0,
                                backgroundColor: idx < highLightNum ? color : '#E9EAEF',
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    text: {
        fontSize: px(11),
        fontWeight: '500',
        lineHeight: px(15),
    },
    barWrap: {
        marginTop: px(2),
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        height: px(4),
    },
});

export default React.memo(PKParamRate);
