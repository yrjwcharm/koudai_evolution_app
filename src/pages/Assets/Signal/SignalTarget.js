/*
 * @Date: 2023-01-10 14:04:25
 * @Description: 信号目标
 */
import {ScrollView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getSignalInfo, modifySignal} from './service';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {deviceWidth, px} from '~/utils/appUtil';
import {Colors, Style, Font, Space} from '~/common/commonStyle';

import Tab from '../components/Tab';
import SignalCard from '../components/SignalCard';
import Icon from 'react-native-vector-icons/AntDesign';
import {useJump} from '~/components/hooks';
import SortHeader from '../components/SortHeader';
import {getNextPath, getPossible} from '~/pages/Project/ProjectSetTradeModel/service';
import {BottomModal} from '~/components/Modal';
import BottomDesc from '~/components/BottomDesc';
import Ruler from '~/pages/Project/ProjectSetTradeModel/Ruler';
import {FixedButton} from '~/components/Button';
import Toast from '~/components/Toast';
import {PasswordModal} from '~/components/Password';
import RenderHtml from '~/components/RenderHtml';

const SignalTarget = ({route, navigation}) => {
    const [stopProfitIndex, setStopProfitIndex] = useState(0);
    const [possible, setPossible] = useState(0);
    const targetYeild = useRef('');
    const [data, setData] = useState({});
    const bottomModal = useRef();
    const passwordModal = useRef();
    const bottomModalTip = useRef();
    const routeParmas = route?.params;
    const getInfo = async () => {
        let res = await modifySignal(routeParmas);
        navigation.setOptions({title: res.result.title});
        setData(res.result);
    };
    useEffect(() => {
        getInfo();
    }, []);
    // 目标收益
    const onTargetChange = async (value) => {
        targetYeild.current = value;
        let params = {
            possible: possible,
            poid: routeParmas.poid,
            target: value / 100,
        };
        let res = await getPossible(params);
        setPossible(res?.result?.target_info?.possible);
    };
    const onChooseProfit = (id) => {
        setStopProfitIndex(id);
        bottomModal.current?.hide();
    };
    const jumpNext = async () => {
        passwordModal?.current?.show();
    };
    const onSubmit = (password) => {
        handlePost(password);
    };
    const handlePost = async (password) => {
        let toast = Toast.showLoading();
        let params = {
            ...routeParmas,
            reach_target: data?.sale_model?.stop_profit_tab?.list[stopProfitIndex].id,
            target_yield: targetYeild.current / 100,
            possible: possible || 0,
            password,
        };
        let res = await getNextPath(params);
        Toast.hide(toast);
        Toast.show(res.message);
        if (res.code === '000000') {
            navigation.goBack();
        }
    };

    return (
        <>
            <ScrollView style={styles.con}>
                <Text style={[styles.title, {paddingLeft: px(16), paddingVertical: px(9)}]}>{data?.name}</Text>
                {data?.sale_model?.target_yeild ? (
                    <View style={styles.card}>
                        {/* 目标收益率 */}
                        <View style={{...styles.nameCon}}>
                            <Image
                                source={{uri: data?.sale_model?.icon}}
                                style={{marginRight: px(3), width: px(17), height: px(17)}}
                            />
                            <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>
                                {data?.sale_model?.name}
                            </Text>
                        </View>
                        {/* 目标收益率 */}
                        <View style={{paddingTop: px(16), marginLeft: deviceWidth / 2 + px(40), top: px(10)}}>
                            <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>目标收益率</Text>
                        </View>
                        <Ruler
                            width={deviceWidth - px(32)}
                            height={px(80)}
                            style={{marginBottom: px(12)}}
                            maxnum={data?.sale_model?.target_yeild?.max * 100}
                            minnum={data?.sale_model?.target_yeild?.min * 100}
                            defaultValue={data?.sale_model?.target_yeild?.default * 100}
                            onChangeValue={onTargetChange}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Style.flexRowCenter, {marginBottom: px(12)}]}
                            onPress={() => {
                                bottomModalTip?.current?.show();
                            }}>
                            <Text style={{fontSize: px(12), textAlign: 'center', marginRight: px(6)}}>
                                根据历史数据，投资18个月参考实现概率：
                                <Text style={{color: Colors.red}}>{(possible * 100).toFixed(0) + '%'}</Text>
                            </Text>
                            <Icon name={'questioncircleo'} size={px(14)} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                        {data?.sale_model?.stop_profit_tab ? (
                            <View style={{...Style.flexBetween, ...styles.trade_con_title, ...Style.borderTop}}>
                                <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>
                                    {data?.sale_model?.stop_profit_tab?.label}
                                </Text>
                                <TouchableOpacity style={Style.flexRow} onPress={() => bottomModal?.current?.show()}>
                                    <Text style={[styles.title, {marginRight: px(4), fontSize: px(14)}]}>
                                        {data?.sale_model?.stop_profit_tab?.list[stopProfitIndex]?.name}
                                    </Text>
                                    <Icon name={'right'} size={px(8)} color={Colors.lightGrayColor} />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                ) : null}
                <Text style={styles.riskTip}>{data?.risk_tip}</Text>
                <BottomDesc />
            </ScrollView>
            <FixedButton
                containerStyle={{position: 'relative'}}
                title={data?.button?.text}
                // disabled={data?.btn?.avail != 1}
                onPress={jumpNext}
            />
            <PasswordModal onDone={onSubmit} ref={passwordModal} />
            <BottomModal ref={bottomModalTip} title={data?.sale_model?.tip?.title}>
                <View style={{padding: px(15)}}>
                    {data?.sale_model?.tip?.content?.map((_tip, index) => (
                        <View key={index}>
                            <Text style={{fontWeight: '700', marginBottom: px(6)}}>{_tip.key}:</Text>
                            <RenderHtml html={_tip.val} style={{fontSize: px(12)}} />
                        </View>
                    ))}
                </View>
            </BottomModal>
            {data?.sale_model?.stop_profit_tab?.list?.length > 0 ? (
                <BottomModal
                    ref={bottomModal}
                    title={'达标止盈方式'}
                    sub_title="止盈前可修改，修改后实时生效"
                    headerStyle={{paddingVertical: px(5)}}>
                    <View style={{paddingHorizontal: Space.padding}}>
                        {data?.sale_model?.stop_profit_tab?.list.map((option, i) => {
                            const {desc: reason, id, name} = option;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={id}
                                    onPress={() => onChooseProfit(i)}
                                    style={[
                                        styles.optionBox,
                                        {
                                            marginTop: i === 0 ? Space.marginVertical : px(12),
                                            borderColor:
                                                stopProfitIndex !== undefined && stopProfitIndex !== i
                                                    ? '#E2E4EA'
                                                    : Colors.brandColor,
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            {fontWeight: '700', marginBottom: px(2), fontSize: px(14)},
                                            stopProfitIndex === i ? {color: Colors.brandColor} : {},
                                        ]}>
                                        {name}
                                    </Text>
                                    <Text
                                        style={[
                                            {fontSize: px(12), color: Colors.lightGrayColor},
                                            stopProfitIndex === i ? {color: Colors.brandColor} : {},
                                        ]}>
                                        {reason}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </BottomModal>
            ) : null}
        </>
    );
};

export default SignalTarget;

const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    title: {
        alignItems: 'center',
        fontSize: px(16),
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        paddingTop: px(16),
    },
    nameCon: {
        backgroundColor: Colors.bgColor,
        ...Style.flexRow,
        borderRadius: px(287),
        padding: px(4),
        flexShrink: 1,
        marginVertical: px(8),
        width: px(80),
    },
    trade_con_title: {
        height: px(52),
    },
    riskTip: {
        fontSize: px(11),
        lineHeight: px(16),
        color: Colors.lightGrayColor,
        marginHorizontal: px(16),
        marginTop: px(12),
    },
});
