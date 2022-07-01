import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import http from '~/services';
import {px} from '~/utils/appUtil';
import Header from './Header';
import PKParams from './PKParams';
import result from './a.js';
import PKAchivementChart from './PKAchivementChart';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import PKPriceRange from './PKPriceRange';
import PKPortfolio from './PKPortfolio';
import PKManagerInfo from './PKManagerInfo';
import PKFundInfo from './PKFundInfo';

const Compare = (props) => {
    const pkProducts = useSelector((state) => state.pkProducts);
    const [pageScroll, setPageScroll] = useState(false);
    const [data, setData] = useState(null);

    const headerRef = useRef(null);
    const pkParamsRef = useRef(null);
    const pkPriceRangeRef = useRef(null);
    const pkPortfolioRef = useRef(null);
    const pkManagerInfoRef = useRef(null);
    const pkFundInfoRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            // 更新data
            http.get('/pk/detail/20220608', {fund_code_list: [550011, 487021, 550010, 550009, 550008]}).then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            });
        }, [pkProducts])
    );

    const handlerScroll = (curRef) => {
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

    return (
        <View style={styles.container}>
            <Header
                pageScroll={pageScroll}
                ref={headerRef}
                data={data?.pk_list || []}
                onScroll={handlerScroll(headerRef)}
            />
            <ScrollView
                style={{flex: 1, marginTop: px(12)}}
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={6}
                onScroll={(e) => {
                    setPageScroll(e.nativeEvent.contentOffset.y > 0);
                }}>
                {data?.pk_list && (
                    <PKParams ref={pkParamsRef} data={data.pk_list} onScroll={handlerScroll(pkParamsRef)} />
                )}
                {/* 业绩表现 */}
                {data?.pk_list && (
                    <PKAchivementChart
                        fund_code_list={[550011, 487021, 550010, 550009, 550008].join()}
                        originPeriod={data?.default_period}
                    />
                )}
                {/* 涨跌幅 */}
                {data?.pk_list && (
                    <PKPriceRange data={data.pk_list} ref={pkPriceRangeRef} onScroll={handlerScroll(pkPriceRangeRef)} />
                )}
                {/* 投资组合 */}
                {data?.pk_list && (
                    <PKPortfolio data={data.pk_list} ref={pkPortfolioRef} onScroll={handlerScroll(pkPortfolioRef)} />
                )}
                {/* 基金经理信息 */}
                {data?.pk_list && (
                    <PKManagerInfo
                        data={data.pk_list}
                        ref={pkManagerInfoRef}
                        onScroll={handlerScroll(pkManagerInfoRef)}
                    />
                )}
                {/* 基金信息 */}
                {data?.pk_list && (
                    <PKFundInfo data={data.pk_list} ref={pkFundInfoRef} onScroll={handlerScroll(pkFundInfoRef)} />
                )}
                <View style={{height: 60}} />
            </ScrollView>
        </View>
    );
};
export default Compare;

const styles = StyleSheet.create({
    container: {flex: 1},
});
