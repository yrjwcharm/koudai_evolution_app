/*
 * @Date: 2023-01-09 18:25:18
 * @Description:
 */
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';

import {px} from '~/utils/appUtil';

const SignalCard = ({data}) => {
    const {name, signals} = data;
    return (
        <View tabLabel={name}>
            <Text style={{fontSize: px(14), fontWeight: '700', marginBottom: px(8)}}>{name}</Text>
            {signals?.map((signal) => (
                <View key={signal.tool_id}>
                    <Text>{signal?.name}</Text>
                </View>
            ))}
        </View>
    );
};

export default SignalCard;

const styles = StyleSheet.create({});
