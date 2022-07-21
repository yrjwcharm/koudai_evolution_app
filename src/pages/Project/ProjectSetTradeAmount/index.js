/*
 * @Date: 2022-07-20 17:00:22
 * @Description:
 */
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import {getInfo} from './service';
import {useFocusEffect} from '@react-navigation/native';

const Index = ({route}) => {
    const poid = route?.params?.poid || 1;
    const project_id = route?.params?.project_id || 'X04F926077';
    const [data, setData] = useState({});
    const jump = useJump();
    const getData = async () => {
        let res = getInfo({poid, project_id});
        setData(res.result);
    };
    useFocusEffect(
        useCallback(() => {
            getData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <View style={{height: 0.5, backgroundColor: Colors.bgColor}} />
            <Image source={require('~/assets/img/trade/setModel2.png')} style={{width: deviceWidth, height: px(42)}} />
            <ScrollView style={{flex: 1}}>
                <Text>index</Text>
                <BottomDesc />
            </ScrollView>
            <FixedButton
                style={{position: 'relative'}}
                // title={data?.btn?.text}
                // disabled={data?.btn?.avail != 1}
                // onPress={() => jump(data?.btn?.url)}
            />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({});
