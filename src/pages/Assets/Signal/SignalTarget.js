/*
 * @Date: 2023-01-10 14:04:25
 * @Description: 信号目标
 */
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getSignalInfo} from './service';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {deviceWidth, px} from '~/utils/appUtil';
import {Colors, Style, Font} from '~/common/commonStyle';

import Tab from '../components/Tab';
import SignalCard from '../components/SignalCard';
import Icon from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
import SortHeader from '../components/SortHeader';
import {getPossible} from '~/pages/Project/ProjectSetTradeModel/service';
import Ruler from '~/components/AnimateRuler';

const SignalTarget = ({route}) => {
    const [possible, setPossible] = useState(0);
    const targetYeild = useRef('');
    const {poid} = route?.params;
    // 目标收益
    const onTargetChange = async (value) => {
        targetYeild.current = value;
        let params = {
            possible: possible,
            poid: poid,
            target: value / 100,
        };
        let res = await getPossible(params);
        setPossible(res?.result?.target_info?.possible);
    };
    return (
        <ScrollView style={styles.con}>
            {/* {data?.sale_model?.target_yeild ? ( */}
            <>
                {/* 目标收益率 */}
                <View style={{paddingVertical: px(16)}}>
                    <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>目标收益率</Text>
                </View>
                <Ruler
                    width={deviceWidth - px(32)}
                    height={px(80)}
                    // style={{marginBottom: px(12)}}
                    // maxnum={data?.sale_model?.target_yeild?.max * 100}
                    // minnum={data?.sale_model?.target_yeild?.min * 100}
                    // defaultValue={data?.sale_model?.target_yeild?.default * 100}
                    onChangeValue={onTargetChange}
                />
                <Text style={{fontSize: px(12), textAlign: 'center', marginBottom: px(12)}}>
                    根据历史数据，投资18个月参考实现概率：
                    <Text style={{color: Colors.red}}>{(possible * 100).toFixed(0) + '%'}</Text>
                </Text>
            </>
            {/* ) : null} */}
        </ScrollView>
    );
};

export default SignalTarget;

const styles = StyleSheet.create({});
