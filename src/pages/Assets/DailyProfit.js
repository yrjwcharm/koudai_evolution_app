/*
 * @Date: 2021-01-27 16:25:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-04-07 17:47:56
 * @Description: 日收益
 */
import React, {useState, useEffect, useCallback} from 'react';
import {LayoutAnimation, SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {px as text, deviceWidth} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';
import Empty from '../../components/EmptyTip';

const DailyProfit = ({poid}) => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [list, setList] = useState([]);
    const [activeSections, setActiveSections] = useState([0]);
    const [maxData, setMaxData] = useState(0);
    const init = useCallback(
        (status, first) => {
            // status === 'refresh' && setRefreshing(true);
            const url = poid ? '/portfolio/profit/daily/20210101' : '/profit/user_daily/20210101';
            http.get(url, {
                uid: '1000000001',
                page,
                poid,
            }).then((res) => {
                setHasMore(res.result.has_more);
                setRefreshing(false);
                if (status === 'loadmore') {
                    setList((prevList) => [...prevList, ...(res.result.list || [])]);
                } else if (status === 'refresh') {
                    setList(res.result.list || []);
                }
            });
        },
        [page, poid]
    );
    // 下拉刷新
    const onRefresh = useCallback(() => {
        setPage(1);
    }, []);
    // 上拉加载
    const onEndReached = useCallback(
        ({distanceFromEnd}) => {
            if (distanceFromEnd < 0) {
                return false;
            }
            if (hasMore) {
                setPage((p) => p + 1);
            }
        },
        [hasMore]
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
            <View style={[styles.tableWrap]}>
                <View style={[Style.flexRow, {backgroundColor: Colors.bgColor}]}>
                    <View style={[styles.borderRight, {flex: 1}]}>
                        <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'基金种类'}</Text>
                    </View>
                    <View style={[styles.borderRight, {flex: 1.5}]}>
                        <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'更新时间'}</Text>
                    </View>
                    <View style={[styles.borderRight, {flex: 1.76}]}>
                        <Text style={[styles.tableCell, {fontWeight: '500'}]}>{'说明'}</Text>
                    </View>
                </View>
                <View style={Style.flexRow}>
                    <View style={{flex: 2.5}}>
                        <View style={Style.flexRow}>
                            <View style={[styles.borderRight, {flex: 1}]}>
                                <Text style={styles.tableCell}>{'普通基金'}</Text>
                            </View>
                            <View style={[styles.borderRight, {flex: 1.5}]}>
                                <Text style={styles.tableCell}>{'1个交易日（T+1）'}</Text>
                            </View>
                        </View>
                        <View style={[Style.flexRow, {backgroundColor: Colors.bgColor, height: text(41)}]}>
                            <View style={[styles.borderRight, {flex: 1}]}>
                                <Text style={styles.tableCell}>{'QDII基金'}</Text>
                            </View>
                            <View style={[styles.borderRight, {flex: 1.5}]}>
                                <Text style={styles.tableCell}>{'2个交易日（T+2）'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1.76}}>
                        <Text style={[styles.tableCell, styles.bigCell]}>
                            {'因基金净值更新时间不同，收益更新时，日收益、累计收益会产生变动'}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }, []);
    // 获取日收益背景颜色
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.darkGrayColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) === 0) {
            return Colors.darkGrayColor;
        } else {
            return Colors.red;
        }
    }, []);
    // 渲染头部
    const renderSectionHeader = useCallback(() => {
        return (
            <View style={{backgroundColor: Colors.bgColor}}>
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
            </View>
        );
    }, [activeSections, renderHeader, renderTable]);
    // 渲染底部
    const renderFooter = useCallback(() => {
        return (
            <>
                {list.length > 0 ? (
                    <Text style={[styles.headerText, {paddingVertical: Space.padding}]}>
                        {hasMore ? '正在加载...' : '暂无更多了'}
                    </Text>
                ) : (
                    <Empty text={'暂无日收益数据'} />
                )}
            </>
        );
    }, [hasMore, list]);
    // 渲染空数据状态
    const renderEmpty = useCallback(() => {
        return <Empty text={'暂无日收益数据'} />;
    }, []);
    // 渲染列表项
    const renderItem = useCallback(
        ({item, index}) => {
            return (
                <View
                    style={[
                        styles.incomeItem,
                        {
                            marginTop: index === 0 ? Space.marginVertical : 0,
                            marginBottom: index === list.length - 1 ? 0 : text(12),
                        },
                    ]}>
                    <View
                        style={[
                            styles.colorBar,
                            Style.flexBetween,
                            {
                                width: `${(
                                    (Math.abs(parseFloat(`${item.profit}`?.replace(/,/g, ''))) / maxData) *
                                        (100 - 30.61) +
                                    30.61
                                ).toFixed(2)}%`,
                                minWidth: '30.61%',
                                maxWidth: '100%',
                                backgroundColor: getColor(`${item.profit}`),
                            },
                        ]}>
                        <Text style={styles.incomeText}>{item.date}</Text>
                        <Text style={styles.incomeText}>
                            {parseFloat(`${item.profit}`?.replace(/,/g, '')) > 0 ? `+${item.profit}` : item.profit}
                        </Text>
                    </View>
                    {item.fee ? <Text style={styles.feeText}>{item.fee}</Text> : null}
                </View>
            );
        },
        [list.length, maxData, getColor]
    );

    useEffect(() => {
        if (page === 1) {
            init('refresh', true);
        } else {
            init('loadmore');
        }
    }, [page, init]);
    useEffect(() => {
        if (list.length > 0) {
            setMaxData(
                Math.max.apply(
                    Math,
                    list.map((o) => Math.abs(parseFloat(o.profit?.replace(/,/g, ''))))
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
        <View style={[styles.container, {transform: [{translateY: text(-1.5)}]}]}>
            <SectionList
                sections={[{title: 'list', data: list}]}
                initialNumToRender={20}
                keyExtractor={(item, index) => item + index}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
                style={[styles.sectionList, {paddingBottom: insets.bottom}]}
                stickySectionHeadersEnabled={false}
            />
        </View>
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
        marginHorizontal: Space.marginAlign,
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
        // fontWeight: 'bold',
    },
    feeText: {
        paddingVertical: text(4),
        paddingLeft: text(12),
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.descColor,
    },
    headerText: {
        flex: 1,
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.darkGrayColor,
        textAlign: 'center',
    },
    sectionList: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bigCell: {
        paddingVertical: text(6),
        paddingHorizontal: text(8),
        textAlign: 'justify',
        flex: 1,
    },
});

DailyProfit.propTypes = {
    poid: PropTypes.string,
};
DailyProfit.defaultProps = {
    poid: '',
};

export default DailyProfit;
