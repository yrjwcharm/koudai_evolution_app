/*
 * @Date: 2021-01-27 18:11:14
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-29 19:09:34
 * @Description: 持有基金
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Tab from '../../components/TabBar';
import {px as text} from '../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import http from '../../services/index.js';

const RatioColor = [
    '#E1645C',
    '#5687EB',
    '#ECB351',
    '#CC8FDD',
    '#E4C084',
    '#5DC162',
    '#DE79AE',
    '#967DF2',
    '#62B4C7',
    '#B8D27E',
    '#F18D60',
    '#5E71E8',
    '#EBDD69',
];

const HoldingFund = ({navigation}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [curTab, setCurTab] = useState(0);
    const [list, setList] = useState([]);

    const init = useCallback(
        (first) => {
            http.get('http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/doc/fund/user_holding/20210101').then(
                (res) => {
                    setRefreshing(false);
                    first && navigation.setOptions({title: res.result.title || '持有基金'});
                    first && setTabs(res.result.tabs);
                    setList(res.result.list);
                }
            );
        },
        [navigation]
    );
    const onChangeTab = useCallback((i) => {
        setCurTab(i);
    }, []);
    const getColor = useCallback((t) => {
        if (parseFloat(t.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replaceAll(',', '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, []);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        init();
    }, [init]);

    const renderContent = useCallback(() => {
        return (
            <>
                <View style={styles.subContainer}>
                    {list.map((item, index) => {
                        return (
                            <View key={`type${index}`} style={{marginBottom: text(8)}}>
                                <View style={[styles.titleContainer, Style.flexRow]}>
                                    <View style={[styles.circle, {backgroundColor: RatioColor[index]}]} />
                                    <Text style={[styles.name, {color: RatioColor[index], fontWeight: '500'}]}>
                                        {item.type.split(' ')[0]}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.numStyle,
                                            {color: RatioColor[index], fontFamily: Font.numMedium},
                                        ]}>
                                        {item.type.split(' ')[1]}
                                    </Text>
                                </View>
                                {item.funds &&
                                    item.funds.map((fund, i) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate({name: 'FundDetail', params: {code: fund.code}})
                                                }
                                                style={[
                                                    styles.fundContainer,
                                                    i === item.funds.length - 1 ? {marginBottom: 0} : {},
                                                ]}
                                                key={`${item.type}${fund.code}${i}`}>
                                                <View style={[styles.fundTitle, Style.flexBetween]}>
                                                    <View style={Style.flexRow}>
                                                        <Text style={[styles.name]}>{fund.name}</Text>
                                                        <Text
                                                            style={[
                                                                styles.numStyle,
                                                                {
                                                                    fontFamily: Font.numRegular,
                                                                    color: Colors.darkGrayColor,
                                                                },
                                                            ]}>
                                                            ({fund.code})
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.subTitle}>{fund.profit_date}</Text>
                                                </View>
                                                <View style={Style.flexRow}>
                                                    <View style={{flex: 1}}>
                                                        <View style={[Style.flexRow, {marginBottom: text(12)}]}>
                                                            <Text
                                                                style={[
                                                                    styles.subTitle,
                                                                    {color: Colors.darkGrayColor},
                                                                ]}>
                                                                {'占比'}
                                                            </Text>
                                                            <Text style={[styles.numStyle]}>{fund.ratio}%</Text>
                                                        </View>
                                                        <View style={Style.flexRow}>
                                                            <Text
                                                                style={[
                                                                    styles.subTitle,
                                                                    {color: Colors.darkGrayColor},
                                                                ]}>
                                                                {'份额(份)'}
                                                            </Text>
                                                            <Text style={[styles.numStyle]}>{fund.share}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flex: 1}}>
                                                        <View style={[Style.flexRow, {marginBottom: text(12)}]}>
                                                            <Text
                                                                style={[
                                                                    styles.subTitle,
                                                                    {color: Colors.darkGrayColor},
                                                                ]}>
                                                                {'累计收益(元)'}
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    styles.numStyle,
                                                                    {color: getColor(fund.profit_acc)},
                                                                ]}>
                                                                {fund.profit_acc}
                                                            </Text>
                                                        </View>
                                                        <View style={Style.flexRow}>
                                                            <Text
                                                                style={[
                                                                    styles.subTitle,
                                                                    {color: Colors.darkGrayColor},
                                                                ]}>
                                                                {'金额(元)'}
                                                            </Text>
                                                            <Text style={[styles.numStyle]}>{fund.amount}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                            </View>
                        );
                    })}
                    {list.length === 0 && (
                        <View style={[styles.noData, Style.flexCenter]}>
                            <Image source={require('../../assets/personal/noData.png')} style={styles.noDataImg} />
                            <Text style={styles.noDataText}>{curTab === 0 ? '暂无持有中基金' : '暂无确认中基金'}</Text>
                        </View>
                    )}
                    {curTab === 0 && (
                        <TouchableOpacity style={[styles.historyHolding, Style.flexBetween]}>
                            <Text style={[styles.name, {fontWeight: '500'}]}>{'历史持有基金'}</Text>
                            <FontAwesome name={'angle-right'} size={20} color={Colors.darkGrayColor} />
                        </TouchableOpacity>
                    )}
                </View>
            </>
        );
    }, [curTab, list, getColor, navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: (props) => (
                <>
                    <TouchableOpacity
                        style={[styles.topRightBtn, Style.flexCenter]}
                        onPress={() => navigation.navigate('FundSearching')}>
                        <Text>基金查询</Text>
                    </TouchableOpacity>
                </>
            ),
        });
        init(true);
    }, [init, navigation]);
    return (
        tabs.length > 0 && (
            <ScrollableTabView
                style={[styles.container]}
                renderTabBar={() => <Tab />}
                initialPage={0}
                onChangeTab={(cur) => onChangeTab(cur.i)}>
                {tabs.map((tab, index) => {
                    return (
                        <ScrollView
                            key={`tab${index}`}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            tabLabel={tab}
                            style={[{transform: [{translateY: text(-1.5)}]}]}>
                            {renderContent()}
                        </ScrollView>
                    );
                })}
            </ScrollableTabView>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topRightBtn: {
        flex: 1,
        width: text(72),
        marginRight: text(8),
    },
    subContainer: {
        paddingHorizontal: Space.padding,
    },
    titleContainer: {
        paddingVertical: text(14),
    },
    circle: {
        width: text(10),
        height: text(10),
        borderRadius: text(6),
        marginRight: text(8),
    },
    name: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
    },
    numStyle: {
        fontSize: text(13),
        lineHeight: text(16),
        color: Colors.defaultColor,
        fontFamily: Font.numFontFamily,
        marginLeft: text(4),
    },
    fundContainer: {
        marginBottom: text(12),
        paddingTop: text(14),
        paddingBottom: text(18),
        paddingHorizontal: text(14),
        borderRadius: text(4),
        backgroundColor: '#fff',
    },
    fundTitle: {
        marginBottom: text(14),
    },
    subTitle: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.brandColor,
    },
    historyHolding: {
        padding: Space.padding,
        marginVertical: text(28),
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    noData: {
        paddingVertical: text(110),
    },
    noDataImg: {
        width: text(172),
        height: text(96),
        marginBottom: text(36),
    },
    noDataText: {
        fontSize: Font.textH1,
        lineHeight: text(22),
        color: Colors.defaultColor,
        fontWeight: '500',
    },
});

export default HoldingFund;
