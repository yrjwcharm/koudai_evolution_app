/*
 * @Date: 2022-07-16 11:43:48
 * @Description:计划设置买卖模式
 */
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {deviceWidth, px} from '~/utils/appUtil';
import RenderAutoTime from './AutoTime';
import Ruler from './Ruler';
import {getSetModel} from './service';
const ProjectSetTrade = ({route}) => {
    const poid = route?.params?.poid;
    const [data, setData] = useState({});
    const getData = async () => {
        let res = await getSetModel({poid: poid || 'X04F926077'});
        setData(res.result);
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
            <Text>index</Text>
            <ScrollView style={{flex: 1}}>
                <Text style={[styles.title, {paddingLeft: px(16), height: px(42)}]}>设置定投计划</Text>
                <View style={styles.trade_con}>
                    <View style={[Style.flexCenter, styles.trade_con_title]}>
                        <Text style={[styles.title]}>买入模式：智能定投</Text>
                    </View>
                    <View style={{...Style.flexBetween, ...styles.trade_con_title}}>
                        <View style={styles.label}>
                            <Text style={{fontSize: px(14)}}>低估信号</Text>
                        </View>
                        <Switch />
                    </View>
                    <RenderAutoTime />
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
                        <Text style={[styles.title]}>卖出模式：目标止盈</Text>
                    </View>
                    <View style={{...Style.flexBetween, ...styles.trade_con_title}}>
                        <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>卖出工具</Text>
                        <Text style={styles.title}>目标盈</Text>
                    </View>
                    <View style={{paddingVertical: px(16)}}>
                        <Text style={{fontSize: px(14), color: Colors.lightBlackColor}}>目标收益率</Text>
                    </View>
                    <Ruler width={deviceWidth - px(64)} height={px(80)} />
                </View>
            </ScrollView>
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
});
