import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {px} from '~/utils/appUtil';
import AssetAllocation from './AssetAllocation';
import ExclusiveAdvisor from './ExclusiveAdvisor';
import FixBottom from './FixBottom';
import Header from './Header';
import IncreaseRevenue from './IncreaseRevenue';
import Profitability from './Profitability';
import ReduceRisk from './ReduceRisk';
import StickyHeaderPortFolio from './StickyHeaderPortFolio';
import ToBeUpgradedList from './ToBeUpgradedList';
import {getUpgradeToPortfolioData} from './services';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '~/pages/Portfolio/components/PageLoading';

const ToPortfolio = ({navigation, route}) => {
    const [scrollY, setScrollY] = useState(0);
    const [curtainNum, setCurtainNum] = useState(0);
    const [data, setData] = useState({});
    const {base_list, button, button2, detail, fund_list, fund_list_header, target} = data;
    const [loading, setLoading] = useState(true);

    const cardsHeight = useRef([]);
    const cardsPosition = useRef([]);
    const curtainHeight = useRef(0);

    const handlerScroll = useCallback((e) => {
        let height = e.nativeEvent.contentOffset.y;
        let arr = cardsPosition.current;
        for (let i = arr.length - 2; i >= -1; i--) {
            if (height + curtainHeight.current > (arr[i] || 0)) {
                setCurtainNum(i + 1);
                break;
            }
        }
    }, []);

    const handlerCurtainHeight = useCallback((val) => {
        curtainHeight.current = val;
    }, []);

    const onCardHeight = useCallback((index, height) => {
        cardsHeight.current[index] = height;
        if (cardsHeight.current.length === 5) {
            const arr = [px(40)];
            cardsHeight.current.reduce((memo, cur, idx) => {
                memo += cur;
                arr[idx + 1] = memo;
                return memo;
            }, px(40));
            cardsPosition.current = arr.filter((item) => item);
        }
    }, []);

    const init = () => {
        getUpgradeToPortfolioData(route.params || {})
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            init();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Header data={{base_list, target}} />
                    <StickyHeaderPortFolio
                        handlerCurtainHeight={handlerCurtainHeight}
                        scrollY={scrollY}
                        curtainNum={curtainNum}
                    />
                    <ScrollView
                        style={{flex: 1}}
                        scrollEventThrottle={3}
                        onScroll={handlerScroll}
                        onLayout={(e) => {
                            setScrollY(e.nativeEvent.layout.y);
                        }}>
                        {detail && (
                            <>
                                {detail[0] && <IncreaseRevenue data={detail[0]} onCardHeight={onCardHeight} />}
                                {detail[1] && <ReduceRisk data={detail[1]} onCardHeight={onCardHeight} />}
                                {detail[2] && <Profitability data={detail[2]} onCardHeight={onCardHeight} />}
                                {detail[3] && <ExclusiveAdvisor data={detail[3]} onCardHeight={onCardHeight} />}
                                {detail[4] && <AssetAllocation data={detail[4]} onCardHeight={onCardHeight} />}
                            </>
                        )}
                        {fund_list?.length > 0 && (
                            <ToBeUpgradedList data={{header: fund_list_header, list: fund_list}} />
                        )}
                        <View style={{height: px(30)}} />
                    </ScrollView>
                    {button && button2 ? <FixBottom button={button} button2={button2} /> : null}
                </>
            )}
        </View>
    );
};

export default ToPortfolio;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
