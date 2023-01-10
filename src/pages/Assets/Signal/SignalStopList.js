/*
 * @Date: 2023-01-10 14:03:06
 * @Description:信号终止列表
 */
import {ScrollView, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {px} from '~/utils/appUtil';
import {Colors} from '~/common/commonStyle';
import SignalCard from '../components/SignalCard';
import {getStopSignal} from './service';
import SortHeader from '../components/SortHeader';

const SignalStopList = (props) => {
    const [data, setData] = useState({});
    const routeParams = props.route?.params;
    const {product_headers, product_list = []} = data;
    const getData = async (params) => {
        let res = await getStopSignal({...routeParams, ...params});
        setData(res.result);
    };
    const handleSort = (_data) => {
        global.LogTool('order', _data.sort_key);
        if (_data.sort_key) {
            getData({
                sort_key: _data?.sort_key,
                sort_type: _data?.sort_type == 'asc' ? '' : _data?.sort_type == 'desc' ? 'asc' : 'desc',
            });
        }
    };
    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );
    return (
        <ScrollView style={styles.con}>
            <SortHeader onSort={(head) => handleSort(head)} data={product_headers} style={{marginBottom: px(16)}} />
            {product_list?.map((_data, index) => (
                <SignalCard data={_data} key={index} />
            ))}
        </ScrollView>
    );
};

export default SignalStopList;

const styles = StyleSheet.create({
    con: {
        padding: px(16),
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});
