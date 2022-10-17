/*
 * @Date: 2022/10/11 13:52
 * @Author: yanruifeng
 * @Description: 已终止定投页面
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {deviceWidth, isEmpty, px} from '../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import InvestHeader from './components/InvestHeader';
import Loading from '../../Portfolio/components/PageLoading';
import Empty from '../../../components/EmptyTip';
import {callTerminatedFixedApi} from './services';
import {useDispatch, useSelector} from 'react-redux';
import RenderItem from './components/RenderItem';
const TerminatedFixedInvest = ({navigation}) => {
    const dispatch = useDispatch();
    const res = useSelector((state) => state.fixedInvest.fixedInvestDetail);
    const [state, setState] = useState({
        headList: [],
        dataList: [],
        loading: true,
    });
    const [times, setTimes] = useState('');
    const [sum, setSum] = useState('');
    const [showEmpty, setShowEmpty] = useState(false);
    const [emptyMsg, setEmptyMsg] = useState('');
    useEffect(() => {
        (async () => {
            dispatch(callTerminatedFixedApi({times, sum}));
            const {title = '', head_list = [], data_list = []} = res.result || {};
            setState({
                headList: head_list,
                dataList: data_list,
                loading: false,
            });
            navigation.setOptions({title});
        })();
    }, [times, sum]);
    const renderEmpty = useCallback(() => {
        return showEmpty ? <Empty text={emptyMsg || '暂无数据'} /> : null;
    }, [emptyMsg, showEmpty]);
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
                    <FlatList
                        windowSize={300}
                        data={state.dataList}
                        initialNumToRender={20}
                        keyExtractor={(item, index) => item + index}
                        ListEmptyComponent={renderEmpty}
                        onEndReachedThreshold={0.5}
                        refreshing={false}
                        renderItem={RenderItem}
                    />
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
