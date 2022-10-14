/*
 * @Date: 2022/10/11 13:52
 * @Author: yanruifeng
 * @Description: 已终止定投页面
 */
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {px} from '../../../utils/appUtil';
import {Colors} from '../../../common/commonStyle';
import InvestHeader from './components/InvestHeader';
import RenderItem from './components/RenderItem';
import {callTerminatedFixedApi} from './services';
import Loading from '../../Portfolio/components/PageLoading';
const TerminatedFixedInvest = ({navigation, route}) => {
    const [times, setTimes] = useState('');
    const [sum, setSum] = useState('');
    const [state, setState] = useState({
        headList: [],
        dataList: [],
        loading: true,
    });
    const initData = async () => {
        const res = await callTerminatedFixedApi({times, sum});
        const {title = '', head_list = [], data_list = []} = res.result || {};
        setState({
            headList: head_list,
            dataList: data_list,
            loading: false,
        });
        navigation.setOptions({title});
    };
    useEffect(() => {
        initData();
    }, [times, sum]);
    const sumSort = useCallback(() => {
        setTimes('');
        sum == 'desc' ? setSum('asc') : setSum('desc');
    }, [sum]);
    const issueSort = useCallback(() => {
        setSum('');
        times == 'asc' ? setTimes('desc') : setTimes('asc');
    }, [times]);
    return (
        <>
            {state.loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={styles.container}>
                    <View style={{marginTop: px(12)}} />
                    <InvestHeader
                        headList={state.headList}
                        times={times}
                        sum={sum}
                        sortByIssue={issueSort}
                        sortBySum={sumSort}
                    />
                    <RenderItem dataList={state.dataList} />
                </View>
            )}
        </>
    );
};

TerminatedFixedInvest.propTypes = {};

export default TerminatedFixedInvest;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
});
