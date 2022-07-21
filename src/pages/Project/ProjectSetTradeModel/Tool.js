/*
 * @Date: 2022-07-20 16:41:11
 * @Description:
 */
import {StyleSheet, Switch, Text, View} from 'react-native';
import React from 'react';
import {Style} from '~/common/commonStyle';
import RenderAutoTime from './AutoTime';
import {px} from '~/utils/appUtil';

const Tool = ({tool}) => {
    return (
        <>
            <View style={{...Style.flexBetween, ...styles.trade_con_title}}>
                <View style={styles.label}>
                    <Text style={{fontSize: px(14)}}>{tool.name}</Text>
                </View>
                <Switch />
            </View>
            {tool?.period_info && <RenderAutoTime initalData={tool?.period_info} />}
        </>
    );
};

export default Tool;

const styles = StyleSheet.create({
    trade_con_title: {
        height: px(52),
        borderBottomColor: '#E2E4EA',
        borderBottomWidth: 0.5,
    },
});
