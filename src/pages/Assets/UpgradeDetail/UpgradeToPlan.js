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
import {getUpgradeToPlanData} from './services';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '~/pages/Portfolio/components/PageLoading';

const UpgradeToPlan = ({route, navigation}) => {
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
        if (cardsHeight.current.length === 4) {
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
        getUpgradeToPlanData(route.params || {})
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    navigation.setOptions({title: res.result.title});
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
                    <StickyHeaderPlan
                        scrollY={scrollY}
                        curtainNum={curtainNum}
                        handlerCurtainHeight={handlerCurtainHeight}
                        detail={detail || []}
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
                                {detail[0] && (
                                    <SaleReminder
                                        onCardHeight={onCardHeight}
                                        data={detail[0]}
                                        upgrade_id={route.params.upgrade_id}
                                    />
                                )}
                                {detail[1] && (
                                    <TaurenSignal
                                        onCardHeight={onCardHeight}
                                        data={detail[1]}
                                        upgrade_id={route.params.upgrade_id}
                                    />
                                )}
                                {detail[2] && (
                                    <FallBuy
                                        onCardHeight={onCardHeight}
                                        data={detail[2]}
                                        upgrade_id={route.params.upgrade_id}
                                    />
                                )}
                                {detail[3] && (
                                    <ProbabilitySignal
                                        onCardHeight={onCardHeight}
                                        data={detail[3]}
                                        upgrade_id={route.params.upgrade_id}
                                    />
                                )}
                            </>
                        )}
                        <View style={{height: px(30)}} />
                    </ScrollView>
                    {button && button2 ? <FixBottom button={button} button2={button2} /> : null}
                </>
            )}
        </View>
    );
};

export default UpgradeToPlan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
