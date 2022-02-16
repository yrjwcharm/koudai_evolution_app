/*
 * @Date: 2021-06-07 10:49:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-02-16 15:45:40
 * @Description:
 */
import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import {Style, Colors} from '../../../common/commonStyle';
import {px} from '../../../utils/appUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const RenderTitle = (props) => {
    return props.title ? (
        <TouchableOpacity
            key={props._key}
            onPress={props.onPress}
            activeOpacity={0.9}
            style={[
                Style.flexBetween,
                {
                    marginBottom: px(12),
                    marginTop: px(4),
                },
            ]}>
            <Text style={styles.large_title}>{props.title}</Text>
            {props.more_text ? (
                <View style={Style.flexRow}>
                    <Text style={[Style.more, {marginRight: px(4)}]}>{props.more_text}</Text>
                    <FontAwesome name={'angle-right'} color={Colors.btnColor} size={18} />
                </View>
            ) : null}
        </TouchableOpacity>
    ) : null;
};
export default RenderTitle;
const styles = StyleSheet.create({
    large_title: {
        fontWeight: '700',
        fontSize: px(17),
        lineHeight: px(24),
        color: Colors.defaultColor,
    },
});
