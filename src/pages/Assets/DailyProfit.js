/*
 * @Date: 2021-01-27 16:25:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-27 17:14:37
 * @Description: 日收益
 */
import React, {useState, useEffect, useCallback} from 'react';
import {LayoutAnimation, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text, deviceWidth} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const DailyProfit = ({poid}) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isMoreloading, setIsMoreloading] = useState(true);
    const [list, setList] = useState([]);
    const [activeSections, setActiveSections] = useState([0]);
    const [maxData, setMaxData] = useState(0);
    const init = useCallback(
        (status, first) => {
            const url = poid ? '/profit/portfolio_daily/20210101' : '/profit/user_daily/20210101';
            http.get(`http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080${url}`, {
                uid: '1000000001',
                page,
            }).then((res) => {
                first && navigation.setOptions({title: res.result.title || '收益明细'});
                setIsMoreloading(res.result.has_more);
                setRefreshing(false);
                if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...(res.result.list || [])]);
                } else if (status === 'refresh') {
                    setList([...(res.result.list || [])]);
                }
            });
        },
        [navigation, page, poid]
    );
    // 下拉刷新回调
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        init('refresh');
    }, [init]);
    const onScroll = useCallback(
        (e) => {
            const offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            const contentSizeHeight = e.nativeEvent.contentSize.height; //ScrollView contentSize高度
            const oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //ScrollView高度
            if (offsetY + oriageScrollHeight >= contentSizeHeight - 200) {
                if (isMoreloading) {
                    setPage((p) => p + 1);
                    init('loadmore');
                }
            }
        },
        [init, isMoreloading]
    );
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
        init('refresh', true);
    }, [init]);
    useEffect(() => {
        if (list.length > 0) {
            setMaxData(
                Math.max.apply(
                    Math,
                    list.map((o) => Math.abs(parseFloat(o.profit.replaceAll(',', ''))))
                )
            );
            LayoutAnimation.configureNext({
                duration: 500, //持续时间
                create: {
                    type: 'linear',
                    property: 'opacity',
                },
                update: {
                    type: 'linear',
                },
            });
        }
    }, [list]);
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            scrollEventThrottle={1000}
            onScroll={onScroll}
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
            <View style={styles.incomeContainer}>
                {list.map((item, index) => {
                    return (
                        <View
                            key={`income${index}`}
                            style={[styles.incomeItem, index === list.length - 1 ? {marginBottom: 0} : {}]}>
                            <View
                                style={[
                                    styles.colorBar,
                                    Style.flexBetween,
                                    {
                                        width: Math.max(
                                            text(105),
                                            maxData === 0
                                                ? 0
                                                : (Math.abs(parseFloat(`${item.profit}`.replaceAll(',', ''))) /
                                                      maxData) *
                                                      (deviceWidth - 32)
                                        ),
                                        maxWidth: '100%',
                                        backgroundColor: getColor(`${item.profit}`),
                                    },
                                ]}>
                                <Text style={styles.incomeText}>{item.date}</Text>
                                <Text style={styles.incomeText}>
                                    {parseFloat(`${item.profit}`.replaceAll(',', '')) > 0
                                        ? `+${item.profit}`
                                        : item.profit}
                                </Text>
                            </View>
                            {item.fee ? <Text style={styles.feeText}>{item.fee}</Text> : null}
                        </View>
                    );
                })}
                <Text style={{textAlign: 'center', paddingTop: Space.padding}}>
                    {isMoreloading ? '上拉查看更多' : '暂无更多了'}
                </Text>
            </View>
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
    incomeContainer: {
        padding: Space.padding,
        backgroundColor: '#fff',
    },
    incomeItem: {
        marginBottom: text(12),
        backgroundColor: Colors.bgColor,
    },
    colorBar: {
        height: text(34),
        paddingHorizontal: text(12),
    },
    incomeText: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: '#fff',
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    feeText: {
        paddingVertical: text(4),
        paddingLeft: text(12),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
});

DailyProfit.propTypes = {
    poid: PropTypes.string,
};
DailyProfit.defaultProps = {
    poid: '',
};

export default DailyProfit;
