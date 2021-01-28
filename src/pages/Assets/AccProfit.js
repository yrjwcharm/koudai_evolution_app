/*
 * @Date: 2021-01-27 16:57:57
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-27 17:52:34
 * @Description: 累计收益
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
import {Modal} from '../../components/Modal';

const AccProfit = ({poid}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [list, setList] = useState([]);
    const [period, setPeriod] = useState('y1');
    const [chart, setChart] = useState({});
    const [activeSections, setActiveSections] = useState([0]);
    const init = useCallback(() => {
        getChart();
        if (!poid) {
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/profit/user_portfolios/20210101', {
                uid: '1000000001',
            }).then((res) => {
                setRefreshing(false);
                setList(res.result.list);
            });
        }
    }, [poid, getChart]);
    // 获取累计收益图数据
    const getChart = useCallback(() => {
        http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/profit/user_acc/20210101', {
            uid: '1000000001',
            period,
        }).then((res) => {
            setChart(res.result);
        });
    }, [period]);
    // 下拉刷新回调
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        init();
    }, [init]);
    // 渲染收益更新说明头部
    const renderHeader = useCallback((section, index, isActive) => {
        return (
            <View style={[Style.flexBetween, {padding: Space.padding}]}>
                <Text style={styles.title}>{'收益更新说明'}</Text>
                <FontAwesome color={Colors.descColor} size={20} name={isActive ? 'angle-up' : 'angle-down'} />
            </View>
        );
    }, []);
    // 渲染收益更新表格
    const renderTable = useCallback(() => {
        return (
            <View style={[styles.tableWrap, Style.flexRow]}>
                <View style={[{flex: 1}, styles.borderRight]}>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor, fontWeight: '500'}]}>
                        {'基金种类'}
                    </Text>
                    <Text style={[styles.tableCell]}>{'普通基金'}</Text>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor}]}>{'QDII基金'}</Text>
                </View>
                <View style={[{flex: 1.5}, styles.borderRight]}>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor, fontWeight: '500'}]}>
                        {'更新时间'}
                    </Text>
                    <Text style={[styles.tableCell]}>{'1个交易日（T+1）'}</Text>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor}]}>{'2个交易日（T+2）'}</Text>
                </View>
                <View style={{flex: 1.76}}>
                    <Text style={[styles.tableCell, {backgroundColor: Colors.bgColor, fontWeight: '500'}]}>
                        {'说明'}
                    </Text>
                    <Text
                        style={[
                            styles.tableCell,
                            {paddingVertical: text(6), paddingHorizontal: text(8), textAlign: 'justify'},
                        ]}>
                        {'因基金净值更新时间不同，收益更新时，日收益、累计收益会产生变动'}
                    </Text>
                </View>
            </View>
        );
    }, []);
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
            <View style={styles.updateDesc}>
                <Accordion
                    activeSections={activeSections}
                    expandMultiple
                    onChange={(indexes) => setActiveSections(indexes)}
                    renderContent={renderTable}
                    renderHeader={renderHeader}
                    sections={[1]}
                    touchableComponent={TouchableOpacity}
                    touchableProps={{activeOpacity: 1}}
                />
            </View>
            <View style={[styles.chartContainer, poid ? {minHeight: text(430)} : {}]}>
                <View style={[Style.flexRow, {justifyContent: 'center'}]}>
                    <Text style={styles.subTitle}>{'累计收益(元)'}</Text>
                    <TouchableOpacity
                        onPress={() => Modal.show({content: '是指您所有基金（含已赎回基金）的累计收益总和'})}>
                        <AntDesign
                            style={{marginLeft: text(4)}}
                            name={'questioncircleo'}
                            size={16}
                            color={Colors.darkGrayColor}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.profitAcc, {color: getColor('403,526.88')}]}>{'403,526.88'}</Text>
                <View style={[styles.chart]}>
                    <></>
                </View>
            </View>
            {list.length > 0 && (
                <View style={[styles.poHeader, Style.flexBetween]}>
                    <Text style={[styles.subTitle, {color: Colors.darkGrayColor}]}>{'组合名称'}</Text>
                    <Text style={[styles.subTitle, {color: Colors.darkGrayColor}]}>{'累计收益'}</Text>
                </View>
            )}
            {list.map((item, index) => {
                return (
                    <TouchableOpacity
                        style={[
                            styles.poItem,
                            Style.flexBetween,
                            {backgroundColor: index % 2 === 1 ? Colors.bgColor : '#fff'},
                        ]}
                        key={index}>
                        <View style={Style.flexRow}>
                            <Text style={[styles.title, {fontWeight: '400', marginRight: text(4)}]}>{item.name}</Text>
                            <FontAwesome color={Colors.darkGrayColor} size={20} name={'angle-right'} />
                            {item.tag ? <Text style={styles.tag}>{item.tag}</Text> : null}
                        </View>
                        <Text style={[styles.title, {fontWeight: '600', color: getColor(item.profit_acc)}]}>
                            {parseFloat(item.profit_acc.replaceAll(',', '')) > 0
                                ? `+${item.profit_acc}`
                                : item.profit_acc}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    updateDesc: {
        marginVertical: text(12),
        marginHorizontal: Space.marginAlign,
        borderRadius: Space.borderRadius,
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
    chartContainer: {
        paddingTop: text(14),
        backgroundColor: '#fff',
    },
    subTitle: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    profitAcc: {
        fontSize: text(26),
        lineHeight: text(30),
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: text(2),
    },
    chart: {
        height: text(282),
    },
    poHeader: {
        height: text(36),
        paddingLeft: text(12),
        paddingRight: Space.padding,
        backgroundColor: Colors.bgColor,
    },
    poItem: {
        height: text(45),
        paddingLeft: text(12),
        paddingRight: Space.padding,
    },
    tag: {
        paddingHorizontal: text(6),
        paddingVertical: text(2),
        marginLeft: text(8),
        borderRadius: text(2),
        backgroundColor: '#EFF5FF',
        fontSize: Font.textSm,
        lineHeight: text(16),
        color: Colors.brandColor,
    },
});

AccProfit.propTypes = {
    poid: PropTypes.string,
};
AccProfit.defaultProps = {
    poid: '',
};

export default AccProfit;
