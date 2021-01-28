/*
 * @Date: 2021-01-27 17:19:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-27 18:01:11
 * @Description: 净值走势
 */
import React, {useState, useEffect, useCallback} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const NetValueTrend = ({poid}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [list, setList] = useState([]);
    const [period, setPeriod] = useState('y1');
    const [chart, setChart] = useState({});
    const [activeSections, setActiveSections] = useState([0]);
    const init = useCallback(() => {}, []);
    // 下拉刷新回调
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        init();
    }, [init]);
    // 获取日收益背景颜色
    const getColor = useCallback((t) => {
        if (parseFloat(t.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replaceAll(',', '')) === 0) {
            return Colors.darkGrayColor;
        } else {
            return Colors.red;
        }
    }, []);
    useEffect(() => {
        init();
    }, [init]);
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            scrollEventThrottle={1000}
            style={[styles.container, {transform: [{translateY: text(-1.5)}]}]}>
            <View style={styles.netValueChart}>
                <></>
            </View>
            <View style={[styles.tableWrap, Style.flexRow, {marginTop: text(12), marginHorizontal: text(14)}]}>
                <View style={[{flex: 2.2}, styles.borderRight]}>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor, fontWeight: '500'}]}>
                        {'名称'}
                    </Text>
                    <Text style={[styles.tableCell]}>{'我的组合'}</Text>
                    <View
                        style={[
                            styles.tableCell,
                            Style.flexCenter,
                            {backgroundColor: Colors.bgColor, height: text(56), paddingVertical: 0},
                        ]}>
                        <Text style={[styles.tableCell, {paddingVertical: 0}]}>{'比较基准'}</Text>
                        <Text style={[styles.tableCell, {color: Colors.darkGrayColor, paddingVertical: 0}]}>
                            {'中证全债34%+上证指数66%'}
                        </Text>
                    </View>
                </View>
                <View style={[{flex: 1}, styles.borderRight]}>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor, fontWeight: '500'}]}>
                        {'涨跌幅'}
                    </Text>
                    <Text style={[styles.tableCell, {color: getColor('0.1536')}]}>{'15.36%'}</Text>
                    <Text
                        style={[
                            styles.tableCell,
                            Style.flexCenter,
                            {
                                backgroundColor: Colors.bgColor,
                                paddingVertical: 0,
                                color: getColor('0.0125'),
                                height: text(56),
                                lineHeight: text(56),
                            },
                        ]}>
                        {'1.25%'}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor, fontWeight: '500'}]}>
                        {'最大回撤'}
                    </Text>
                    <Text style={[styles.tableCell, {color: getColor('-0.0526')}]}>{'-5.26%'}</Text>
                    <Text
                        style={[
                            styles.tableCell,
                            {
                                backgroundColor: Colors.bgColor,
                                paddingVertical: 0,
                                height: text(56),
                                lineHeight: text(56),
                                color: getColor('-0.0688'),
                            },
                        ]}>
                        {'-6.88%'}
                    </Text>
                </View>
            </View>
            <View style={{padding: Space.padding}}>
                <Text style={[styles.bigTitle, {marginBottom: text(4)}]}>{'什么是净值'}</Text>
                <Text style={[styles.descContent, {marginBottom: text(14)}]}>
                    {'每份基金单位的净资产价值，等于基金的总资产减去总负债后的余额再除以基金全部发行的单位份额总数。'}
                </Text>
                <Text style={[styles.bigTitle, {marginBottom: text(4)}]}>{'什么我的净值走势和我的累计收益不一致'}</Text>
                <Text style={[styles.descContent, {marginBottom: text(14)}]}>
                    {
                        '每份基金单位的净资产价值，等于基金的总资产减去总负债后的余额再除以基金全部发行的单位份额总数每份基金单位的净资产价值，等于基金的总资产减去总负债后的余额再除以基金全部发行的单位份额总数。'
                    }
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    tableWrap: {
        marginBottom: text(20),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
        borderWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
        overflow: 'hidden',
    },
    borderRight: {
        borderRightWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    tableCell: {
        paddingVertical: text(12),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.defaultColor,
        textAlign: 'center',
    },
    chart: {
        height: text(282),
    },
    netValueChart: {
        backgroundColor: '#fff',
        height: text(320),
    },
    bigTitle: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
    descContent: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.darkGrayColor,
        textAlign: 'justify',
    },
});

NetValueTrend.propTypes = {
    poid: PropTypes.string.isRequired,
};

export default NetValueTrend;
