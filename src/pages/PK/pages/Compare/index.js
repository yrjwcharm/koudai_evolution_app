import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {px} from '~/utils/appUtil';
import Header from './Header';
import PKParams from './PKParams';
import PKAchivementChart from './PKAchivementChart';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import PKPriceRange from './PKPriceRange';
import PKPortfolio from './PKPortfolio';
import PKManagerInfo from './PKManagerInfo';
import PKFundInfo from './PKFundInfo';
import {getPKDetailData} from '../../services';
import BlackHint from './BlackHint';
import {addProduct, delProduct} from '~/redux/actions/pk/pkProducts';
import {pinningProduct} from '~/redux/actions/pk/pkPinning';

const Compare = () => {
    const pkProducts = useSelector((state) => state.pkProducts);
    const pkPinning = useSelector((state) => state.pkPinning);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [pageScroll, setPageScroll] = useState(false);
    const [data, setData] = useState(null);
    const [list, setList] = useState(null);

    const headerRef = useRef(null);
    const pkParamsRef = useRef(null);
    const pkPriceRangeRef = useRef(null);
    const pkPortfolioRef = useRef(null);
    const pkManagerInfoRef = useRef(null);
    const pkFundInfoRef = useRef(null);

    const _pkProducts = useRef([]);

    useEffect(() => {
        _pkProducts.current = pkProducts;
    }, [pkProducts]);

    const getData = useCallback(() => {
        // 更新data
        setLoading(true);
        getPKDetailData({fund_code_list: _pkProducts.current})
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    setList(res.result.pk_list);
                }
            })
            .finally((_) => {
                setLoading(false);
            });
    }, []);

    useFocusEffect(getData);

    const handlerPageScroll = useCallback((e) => {
        setPageScroll(e.nativeEvent.contentOffset.y > 0);
    }, []);

    const addHigh = useCallback(
        (code) => {
            let item = list.find((itm) => itm.tip);
            if (item) {
                dispatch(delProduct(item.code));
                if (item.code === pkPinning) dispatch(pinningProduct(null));
            }
            dispatch(addProduct({code, isHigh: true}));
            setTimeout(() => {
                getData();
            }, 0);
        },
        [dispatch, getData, list, pkPinning]
    );

    const handlerHorizontalScroll = (curRef) => {
        const refArr = [
            headerRef,
            pkParamsRef,
            pkPriceRangeRef,
            pkPortfolioRef,
            pkManagerInfoRef,
            pkFundInfoRef,
        ].filter((ref) => ref !== curRef);
        return (x) => {
            refArr[0].current.scrollTo(x);
            refArr[1].current.scrollTo(x);
            refArr[2].current.scrollTo(x);
            refArr[3].current.scrollTo(x);
            refArr[4].current.scrollTo(x);
        };
    };

    const handlerSyncParentDel = useCallback((code) => {
        setList((val) => {
            return val.filter((itm) => code !== itm.code);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Header
                pageScroll={pageScroll}
                ref={headerRef}
                data={list || []}
                addFundButton={data?.add_fund_button}
                onScroll={handlerHorizontalScroll(headerRef)}
                syncParentDel={handlerSyncParentDel}
            />
            <ScrollView
                style={{flex: 1}}
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={6}
                onScroll={handlerPageScroll}>
                <View style={{height: px(12)}} />
                {list && (
                    <PKParams
                        ref={pkParamsRef}
                        data={list}
                        weightButton={data.weight_button}
                        refresh={getData}
                        onScroll={handlerHorizontalScroll(pkParamsRef)}
                    />
                )}
                {/* 业绩表现 */}
                {list && <PKAchivementChart fund_code_list={pkProducts} originPeriod={data?.default_period} />}
                {/* 涨跌幅 */}
                {list && (
                    <PKPriceRange
                        data={list}
                        ref={pkPriceRangeRef}
                        onScroll={handlerHorizontalScroll(pkPriceRangeRef)}
                    />
                )}
                {/* 投资组合 */}
                {list && (
                    <PKPortfolio data={list} ref={pkPortfolioRef} onScroll={handlerHorizontalScroll(pkPortfolioRef)} />
                )}
                {/* 基金经理信息 */}
                {list && (
                    <PKManagerInfo
                        data={list}
                        ref={pkManagerInfoRef}
                        onScroll={handlerHorizontalScroll(pkManagerInfoRef)}
                    />
                )}
                {/* 基金信息 */}
                {list && (
                    <PKFundInfo data={list} ref={pkFundInfoRef} onScroll={handlerHorizontalScroll(pkFundInfoRef)} />
                )}
                <View style={{marginTop: px(12), height: 100, backgroundColor: '#fff'}} />
            </ScrollView>
            {loading ? (
                <View style={styles.loadingMask}>
                    <ActivityIndicator size={'large'} />
                </View>
            ) : null}
            {/* 小黑条 */}
            <BlackHint addHigh={addHigh} />
        </View>
    );
};
export default Compare;

const styles = StyleSheet.create({
    container: {flex: 1},
    loadingMask: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        zIndex: 1,
    },
});
