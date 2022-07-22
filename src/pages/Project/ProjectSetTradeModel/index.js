/*
 * @Date: 2022-07-16 11:43:48
 * @Description:计划设置买卖模式
 */
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {Colors, Space, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import Ruler from './Ruler';
import {getPossible, getSetModel} from './service';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Icon from 'react-native-vector-icons/AntDesign';
import Tool from './Tool';
import {BottomModal} from '~/components/Modal';
const ProjectSetTrade = ({route, navigation}) => {
    const poid = route?.params?.poid || 'X04F026206';
    const [data, setData] = useState({});
    const [stopProfitIndex, setStopProfitIndex] = useState(0);
    const [needBuy, setNeedBuy] = useState(false);
    const [toolStatus, setToolStatus] = useState({});
    const autoTime = useRef({});
    const targetYeild = useRef('');
    // const jump = useJump();
    const bottomModal = useRef();
    const getData = async () => {
        let res = await getSetModel({poid});
        setNeedBuy(res.result?.need_buy?.open_status !== 0);

        setData(res.result);
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onChooseProfit = (id) => {
        setStopProfitIndex(id);
        bottomModal.current?.hide();
    };
    const onToolChange = (id, value) => {
        setToolStatus((prev) => {
            let tmp = {...prev};
            tmp[id] = value;
            return tmp;
        });
    };
    const onChangeAutoTime = (time) => {
        autoTime.current = time;
    };
    const onTargetChange = async (value) => {
        targetYeild.current = value;
        let params = {
            target: value / 100,
            // possible: data.target_info.possible,
            poid: poid,
        };
        let res = await getPossible(params);
    };
    const jumpNext = () => {
        let buy_tool_id = [];
        if (data?.buy_model?.list?.length > 0) {
            data?.buy_model?.list.forEach((item) => {
                if (toolStatus[item.id] == true || toolStatus[item.id] == undefined) {
                    buy_tool_id.push(item.id);
                }
            });
        }
        let params = {
            poid,
            reach_target: data?.sale_model?.stop_profit_tab?.list[stopProfitIndex].name,
            need_buy: needBuy,
            buy_tool_id: buy_tool_id.join(''),
            ...autoTime.current,
            target_yield: targetYeild.current / 100,
        };
        console.log(params);
        // navigation.navigate('ProjectSetTradeAmount', params);
    };
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <View style={{height: 0.5, backgroundColor: Colors.bgColor}} />
            <Image source={require('~/assets/img/trade/setMode1.png')} style={{width: deviceWidth, height: px(42)}} />
            <ScrollView style={{flex: 1}}>
                <Text style={[styles.title, {paddingLeft: px(16), paddingVertical: px(9)}]}>{data?.name}</Text>
                <View style={styles.trade_con}>
                    <View style={[Style.flexCenter, styles.trade_con_title]}>
                        <Text style={[styles.title]}>{data?.buy_model?.buy_model_title}</Text>
                    </View>
                    {/* 买入工具 */}
                    {data?.buy_model?.list?.map((tool, index) => (
                        <Tool tool={tool} key={tool.id} onChange={onToolChange} onChangeAutoTime={onChangeAutoTime} />
                    ))}
                </View>
                {/* 立即买一笔 */}
                {data?.now_buy ? (
                    <View
                        style={{
                            ...Style.flexBetween,
                            ...styles.trade_con_title,
                            ...styles.card,
                            marginBottom: px(16),
                        }}>
                        <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>{data?.now_buy?.text}</Text>
                        <Switch
                            ios_backgroundColor={'#CCD0DB'}
                            onValueChange={(value) => {
                                setNeedBuy(value);
                            }}
                            thumbColor={'#fff'}
                            trackColor={{false: '#CCD0DB', true: Colors.brandColor}}
                            value={needBuy}
                        />
                    </View>
                ) : null}
                <View style={styles.trade_con}>
                    <View style={[Style.flexCenter, styles.trade_con_title]}>
                        <Text style={[styles.title]}>{data?.sale_model?.sale_model_title}</Text>
                    </View>
                    {/* 卖出工具 */}
                    {data?.sale_model?.list?.map((tool) => (
                        <View style={{...Style.flexBetween, ...styles.trade_con_title}} key={tool.id}>
                            <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>{tool?.label}</Text>
                            <Text style={styles.title}>{tool?.name}</Text>
                        </View>
                    ))}
                    {/* 目标收益率 */}
                    <View style={{paddingVertical: px(16)}}>
                        <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>目标收益率</Text>
                    </View>
                    {data?.sale_model?.target_yeild ? (
                        <Ruler
                            width={deviceWidth - px(32)}
                            height={px(80)}
                            style={{marginBottom: px(12)}}
                            maxnum={data?.sale_model?.target_yeild?.max * 100}
                            minnum={data?.sale_model?.target_yeild?.min * 100}
                            defaultValue={data?.sale_model?.target_yeild?.default * 100}
                            onChangeValue={onTargetChange}
                        />
                    ) : null}
                    <Text style={{fontSize: px(12), textAlign: 'center', marginBottom: px(12)}}>
                        根据历史数据，投资18个月实现概率：xx%
                    </Text>
                    {/* 止盈方式 */}
                    <View style={{...Style.flexBetween, ...styles.trade_con_title, ...styles.borderTop}}>
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
                </View>
                <BottomDesc />
            </ScrollView>
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
            <FixedButton
                style={{position: 'relative'}}
                title={data?.btn?.text}
                disabled={data?.btn?.avail != 1}
                onPress={jumpNext}
            />
        </View>
    );
};

export default ProjectSetTrade;

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        fontSize: px(16),
        fontWeight: '700',
    },
    trade_con: {
        marginBottom: px(8),
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
    },
    trade_con_title: {
        height: px(52),
        borderBottomColor: '#E2E4EA',
        borderBottomWidth: 0.5,
    },
    card: {backgroundColor: '#fff', paddingHorizontal: px(16), height: px(58), borderBottomWidth: 0},
    label: {
        height: px(26),
        paddingRight: px(8),
        backgroundColor: Colors.bgColor,
        borderRadius: px(287),
        justifyContent: 'center',
    },
    borderTop: {
        borderBottomWidth: 0,
        borderTopColor: '#E2E4EA',
        borderTopWidth: 0.5,
    },
    optionBox: {
        marginTop: px(12),
        padding: px(12),
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
    },
});
