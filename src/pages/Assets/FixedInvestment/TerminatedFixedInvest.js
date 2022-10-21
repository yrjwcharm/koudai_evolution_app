/*
 * @Date: 2022/10/11 13:52
 * @Author: yanruifeng
 * @Description: 已终止定投页面
 */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {px} from '../../../utils/appUtil';
import {Colors} from '../../../common/commonStyle';
import InvestHeader from './components/InvestHeader';
import Loading from '../../Portfolio/components/PageLoading';
import Empty from '../../../components/EmptyTip';
import {callTerminatedFixedApi} from './services';
import RenderItem from './components/RenderItem';
const TerminatedFixedInvest = ({navigation, route}) => {
    const {type, poid = '', fund_code = ''} = route?.params;
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showEmpty, setShowEmpty] = useState(false);
    const [emptyMsg, setEmptyMsg] = useState('');
    useEffect(() => {
        (async () => {
            const res = await callTerminatedFixedApi({type, poid, fund_code});
            if (res.code === '000000') {
                const {title = ''} = res.result || {};
                navigation.setOptions({title});
                setLoading(false);
                setData(res.result);
            }
        })();
    }, []);
    const renderEmpty = useCallback(() => {
        return showEmpty ? <Empty text={emptyMsg || '暂无数据'} /> : null;
    }, [emptyMsg, showEmpty]);
    const executeSort = useCallback((data) => {
        if (data.sort_key) {
            callTerminatedFixedApi({
                sort_key: data?.sort_key,
                sort: data?.sort_type == 'asc' ? '' : data?.sort_type == 'desc' ? 'asc' : 'desc',
            }).then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            });
        }
    }, []);
    return (
        <>
            {loading ? (
                <Loading color={Colors.btnColor} />
            ) : (
                <View style={styles.container}>
                    <View style={{marginTop: px(12)}} />
                    <InvestHeader headList={data?.head_list ?? []} handleSort={executeSort} />
                    <FlatList
                        windowSize={300}
                        data={data?.data_list ?? []}
                        initialNumToRender={20}
                        keyExtractor={(item, index) => item + index}
                        ListEmptyComponent={renderEmpty}
                        onEndReachedThreshold={0.5}
                        refreshing={false}
                        renderItem={({item, index}) => <RenderItem item={item} index={index} />}
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
