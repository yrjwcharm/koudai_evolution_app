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

const ToPortfolio = () => {
    const [scrollY, setScrollY] = useState(0);
    const [curtainNum, setCurtainNum] = useState(0);

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

    return (
        <View style={styles.container}>
            <Header />
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
                <IncreaseRevenue onCardHeight={onCardHeight} />
                <ReduceRisk onCardHeight={onCardHeight} />
                <Profitability onCardHeight={onCardHeight} />
                <ExclusiveAdvisor onCardHeight={onCardHeight} />
                <AssetAllocation onCardHeight={onCardHeight} />
                <ToBeUpgradedList />
                <View style={{height: px(30)}} />
            </ScrollView>
            <FixBottom />
        </View>
    );
};

export default ToPortfolio;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
