import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {px} from '~/utils/appUtil';
import Header from './Header';
import FixBottom from './FixBottom';
import StickyHeaderPlan from './StickyHeaderPlan';
import SaleReminder from './SaleReminder';
import TaurenSignal from './TaurenSignal';
import FallBuy from './FallBuy';
import ProbabilitySignal from './ProbabilitySignal';

const ToPlan = () => {
    const [scrollY, setScrollY] = useState(0);
    const [curtainNum, setCurtainNum] = useState(0);
    const cardsHeight = useRef([]);
    const cardsPosition = useRef([]);
    const curtainHeight = useRef(0);

    const handlerScroll = useCallback((e) => {
        let height = e.nativeEvent.contentOffset.y;
        let arr = cardsPosition.current;
        for (let i = arr.length - 1; i >= -1; i--) {
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
        if (cardsHeight.current.length === 4) {
            const arr = [];
            cardsHeight.current.reduce((memo, cur, idx) => {
                memo += cur;
                arr[idx] = memo;
                return memo;
            }, 0);
            cardsPosition.current = arr.filter((item) => item);
        }
    }, []);
    return (
        <View style={styles.container}>
            <Header />
            <StickyHeaderPlan scrollY={scrollY} curtainNum={curtainNum} handlerCurtainHeight={handlerCurtainHeight} />
            <ScrollView
                style={{flex: 1}}
                scrollEventThrottle={3}
                onScroll={handlerScroll}
                onLayout={(e) => {
                    setScrollY(e.nativeEvent.layout.y);
                }}>
                <SaleReminder onCardHeight={onCardHeight} />
                <TaurenSignal onCardHeight={onCardHeight} />
                <FallBuy onCardHeight={onCardHeight} />
                <ProbabilitySignal onCardHeight={onCardHeight} />
                <View style={{height: px(30)}} />
            </ScrollView>
            <FixBottom />
        </View>
    );
};

export default ToPlan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
