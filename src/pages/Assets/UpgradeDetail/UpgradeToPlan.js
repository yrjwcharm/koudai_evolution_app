import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {px} from '~/utils/appUtil';
import Header from './Header';
import FixBottom from './FixBottom';
import StickyHeaderPlan from './StickyHeaderPlan';
import SaleReminder from './SaleReminder';
import ToolSignalOfToPlan from './ToolSignalOfToPlan';
import {getUpgradeToPlanData} from './services';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '~/pages/Portfolio/components/PageLoading';

const UpgradeToPlan = ({route, navigation}) => {
    const [scrollY, setScrollY] = useState(0);
    const [curtainNum, setCurtainNum] = useState(0);
    const [cardsRate, setCardsRate] = useState({});
    const [data, setData] = useState({});
    const {base_list, button, button2, top_detail, sub_detail, target} = data;
    const [loading, setLoading] = useState(true);
    const cardsHeight = useRef([]);
    const cardsPosition = useRef([]);
    const curtainHeight = useRef(0);

    const handlerScroll = useCallback((e) => {
        let height = e.nativeEvent.contentOffset.y;
        let arr = cardsPosition.current;
        for (let i = arr.length - 2; i > -1; i--) {
            let titleY = arr[i] - curtainHeight.current;
            if (i === 0 && height < 20) {
                setCurtainNum(0);
                break;
            } else if (height > titleY) {
                setCurtainNum(i + 1);
                break;
            }
        }
    }, []);

    const handlerCurtainHeight = useCallback((val) => {
        curtainHeight.current = val;
    }, []);

    const onCardHeight = useCallback(
        (index, height) => {
            cardsHeight.current[index] = height;
            if (cardsHeight.current.length === sub_detail.length + 1) {
                const arr = [px(38)];
                cardsHeight.current.reduce((memo, cur, idx) => {
                    memo += cur;
                    arr[idx + 1] = memo;
                    return memo;
                }, px(38));
                cardsPosition.current = arr.filter((item) => item);
            }
        },
        [sub_detail]
    );

    const onCardRate = useCallback((index, obj) => {
        setCardsRate((val) => ({...val, [index]: obj}));
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
                        detail={[top_detail, ...sub_detail]}
                        cardsRate={cardsRate}
                    />
                    <ScrollView
                        style={{flex: 1}}
                        scrollEventThrottle={3}
                        onScroll={handlerScroll}
                        onLayout={(e) => {
                            setScrollY(e.nativeEvent.layout.y);
                        }}>
                        {top_detail && (
                            <SaleReminder
                                idx={0}
                                key={0}
                                onCardRate={onCardRate}
                                onCardHeight={onCardHeight}
                                data={top_detail}
                                upgrade_id={route.params.upgrade_id}
                            />
                        )}
                        {sub_detail &&
                            sub_detail.map((item, idx) => {
                                return (
                                    <ToolSignalOfToPlan
                                        idx={idx + 1}
                                        key={idx + 1}
                                        onCardRate={onCardRate}
                                        onCardHeight={onCardHeight}
                                        data={item}
                                        upgrade_id={route.params.upgrade_id}
                                    />
                                );
                            })}
                        <View style={{height: px(30)}} />
                    </ScrollView>
                    {button && button2 ? (
                        <FixBottom routeParams={route.params} button={button} button2={button2} />
                    ) : null}
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
