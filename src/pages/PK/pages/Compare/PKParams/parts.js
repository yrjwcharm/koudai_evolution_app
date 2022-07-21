import React from 'react';
import PKParamRate from '../../../components/PKParamRate';
import {View, Text, StyleSheet, Switch, Platform} from 'react-native';
import {px} from '~/utils/appUtil';
import {Font} from '~/common/commonStyle';

export const LabelPart = ({item, idx, expand, weightsState, onChange}) => {
    const onValueChange = (val) => {
        onChange(val, item);
    };
    return (
        <View style={[styles.labelPart, {backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'}]}>
            <View style={styles.labelWrap}>
                <Text style={[styles.labelText, {color: weightsState[item.type] > 0 ? '#545968' : '#9AA0B1'}]}>
                    {item.name}
                </Text>
                <Switch
                    ios_backgroundColor={'#CCD0DB'}
                    thumbColor={'#fff'}
                    trackColor={{false: '#CCD0DB', true: '#0051CC'}}
                    value={weightsState[item.type] > 0}
                    style={[
                        {
                            width: px(28),
                            height: px(18),
                        },
                        Platform.OS === 'ios'
                            ? {transform: [{scale: 0.7}], left: px(-9.8), top: px(-1.3)}
                            : {marginTop: 2},
                    ]}
                    onValueChange={onValueChange}
                />
            </View>
            {weightsState[item.type] > 0 &&
                expand &&
                item.sub_items?.map?.((itm, index) => (
                    <View style={styles.labelWrap} key={index}>
                        <Text style={styles.labelText}>{itm.key} </Text>
                    </View>
                ))}
        </View>
    );
};

export const ValuePart = ({item, idx, best, expand, weightsState}) => {
    const handlerValue = (val) => {
        let state = !!(val || val === 0);
        return state ? val : '--';
    };

    return (
        <View style={[styles.valuePart, {backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'}]}>
            <View style={styles.valueWrap}>
                <PKParamRate
                    color={best ? '#E74949' : '#545968'}
                    total={item.total_score}
                    value={weightsState[item.type] > 0 ? item.score : null}
                    justifyContent="flex-end"
                />
            </View>
            {weightsState[item.type] > 0 &&
                expand &&
                item.sub_items?.map?.((itm, index) => (
                    <View style={styles.valueWrap} key={index}>
                        <Text style={[styles.valueText, {color: best ? '#E74949' : '#545968'}]}>
                            {handlerValue(itm.value)}
                        </Text>
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    labelPart: {},
    labelWrap: {
        height: px(55),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        paddingLeft: px(5),
        paddingRight: px(5),
    },
    labelText: {
        fontSize: px(12),
        lineHeight: px(17),
        textAlign: 'center',
    },
    valuePart: {},
    valueWrap: {
        height: px(55),
        borderBottomColor: '#E9EAEF',
        borderBottomWidth: 0.5,
        paddingHorizontal: px(8),
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: px(10),
    },
    valueText: {
        fontSize: px(14),
        lineHeight: px(22),
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
        flex: 1,
    },
});
