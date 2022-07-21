/*
 * @Date: 2022-07-16 11:43:48
 * @Description:计划设置买卖模式
 */
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import Ruler from './Ruler';
import {getSetModel} from './service';
import BottomDesc from '~/components/BottomDesc';
import {FixedButton} from '~/components/Button';
import {useJump} from '~/components/hooks';
import Icon from 'react-native-vector-icons/AntDesign';
import Tool from './Tool';
const ProjectSetTrade = ({route}) => {
    const poid = route?.params?.poid || 'X04F926077';
    const [data, setData] = useState({});
    const [stopProfitIndex, setStopProfitIndex] = useState(0);
    const jump = useJump();
    const getData = async () => {
        let res = await getSetModel({poid});
        setData(res.result);
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
                        <Tool tool={tool} key={tool.id} />
                    ))}
                </View>
                <View
                    style={{
                        ...Style.flexBetween,
                        ...styles.trade_con_title,
                        ...styles.card,
                        marginBottom: px(16),
                    }}>
                    <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>当日发起首次定投</Text>
                    <Switch />
                </View>
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
                    <Ruler
                        width={deviceWidth - px(32)}
                        height={px(80)}
                        style={{marginBottom: px(12)}}
                        defaultValue={data?.sale_model?.target_yeild?.default * 100}
                        maxnum={data?.sale_model?.target_yeild?.max * 100}
                        minnum={data?.sale_model?.target_yeild?.min * 100}
                    />
                    {/* 止盈方式 */}
                    <View style={{...Style.flexBetween, ...styles.trade_con_title, ...styles.borderTop}}>
                        <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>
                            {data?.sale_model?.stop_profit_tab?.label}
                        </Text>
                        <TouchableOpacity style={Style.flexRow}>
                            <Text style={[styles.title, {marginRight: px(4), fontSize: px(14)}]}>
                                {data?.sale_model?.stop_profit_tab?.list[stopProfitIndex]?.name}
                            </Text>
                            <Icon name={'right'} size={px(8)} color={Colors.lightGrayColor} />
                        </TouchableOpacity>
                    </View>
                </View>
                <BottomDesc />
            </ScrollView>
            <FixedButton
                style={{position: 'relative'}}
                title={data?.btn?.text}
                disabled={data?.btn?.avail != 1}
                onPress={() => jump(data?.btn?.url)}
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
});
