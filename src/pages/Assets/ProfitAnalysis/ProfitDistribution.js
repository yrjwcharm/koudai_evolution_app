import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {deviceWidth, px as text, px} from '../../../utils/appUtil';
import {Colors, Font, Space, Style} from '../../../common/commonStyle';
import {BoxShadow} from 'react-native-shadow';
import Tab from '../../../components/TabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DayProfit from './DayProfit';
import MonthProfit from './MonthProfit';
import YearProfit from './YearProfit';
import TotalProfit from './TotalProfit';
import PropTypes from 'prop-types';
import {delMille} from '../../../utils/common';
import {getChartData} from './service';
const shadow = {
    color: '#AAA',
    border: 4,
    radius: px(5),
    opacity: 0.102,
    x: 0,
    y: 2,
    width: deviceWidth - px(32),
    height: text(71),
    style: {
        position: 'relative',
        top: px(12),
        left: Space.padding,
        zIndex: 0,
    },
};
const ProfitDistribution = ({headData, type}) => {
    const {profit_info, profit_acc_info, profit_all} = headData;
    const [unitType, setUnitType] = useState('day');
    const [tabs, setTabs] = useState([]);
    const initData = async () => {
        const res = await getChartData({type, unit_type: unitType});
        if (res.code == '000000') {
            const {profit_unit_tab = []} = res.result ?? {};
            setTabs(profit_unit_tab);
        }
    };
    useEffect(() => {
        initData();
    }, [type, unitType]);
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <BoxShadow setting={{...shadow}}>
                <View style={styles.header}>
                    <View style={Style.flexEvenly}>
                        <View style={styles.headerItem}>
                            <Text
                                style={[
                                    styles.profitLabel,
                                    {
                                        color:
                                            delMille(profit_info?.value) > 0
                                                ? Colors.red
                                                : delMille(profit_info?.value) < 0
                                                ? Colors.green
                                                : Colors.lightBlackColor,
                                    },
                                ]}>
                                {profit_info?.value}
                            </Text>
                            <Text style={styles.profitValue}>{profit_info?.text}</Text>
                        </View>
                        <View style={styles.headerItem}>
                            <Text
                                style={[
                                    styles.profitLabel,
                                    {
                                        color:
                                            delMille(profit_acc_info?.value) > 0
                                                ? Colors.red
                                                : delMille(profit_acc_info?.value) < 0
                                                ? Colors.green
                                                : Colors.lightBlackColor,
                                    },
                                ]}>
                                {profit_acc_info?.value}
                            </Text>
                            <Text style={styles.profitValue}>{profit_acc_info?.text}</Text>
                        </View>
                        <View style={styles.headerItem}>
                            <Text
                                style={[
                                    styles.profitLabel,
                                    {
                                        color:
                                            delMille(profit_all?.value) > 0
                                                ? Colors.red
                                                : delMille(profit_all?.value) < 0
                                                ? Colors.green
                                                : Colors.lightBlackColor,
                                    },
                                ]}>
                                {profit_all?.value}
                            </Text>
                            <Text style={styles.profitValue}>{profit_all?.text}</Text>
                        </View>
                    </View>
                </View>
            </BoxShadow>
            <View style={{marginTop: px(26)}} />
            <View style={styles.section}>
                {tabs.length > 1 && (
                    <ScrollableTabView
                        renderTabBar={() => (
                            //解决key unique
                            <Tab
                                style={styles.borderStyle}
                                btnColor={Colors.defaultColor}
                                inActiveColor={Colors.lightBlackColor}
                            />
                        )}
                        initialPage={0}
                        onChangeTab={({i}) => {
                            setUnitType(tabs[i].type);
                        }}>
                        {tabs.map((tab, index) => {
                            if (index == 0)
                                return <DayProfit type={type} tabLabel={tab.text} key={`${tab + '' + index}`} />;
                            if (index == 1)
                                return <MonthProfit type={type} tabLabel={tab.text} key={`${tab + '' + index}`} />;
                            if (index == 2)
                                return <YearProfit type={type} tabLabel={tab.text} key={`${tab + '' + index}`} />;
                            if (index == 3)
                                return <TotalProfit type={type} tabLabel={tab.text} key={`${tab + '' + index}`} />;
                        })}
                    </ScrollableTabView>
                )}
            </View>
        </ScrollView>
    );
};

ProfitDistribution.propTypes = {
    setLoadingFn: PropTypes.func,
};

export default ProfitDistribution;
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: px(5),
        backgroundColor: Colors.white,
        height: px(71),
    },
    headerItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    profitLabel: {
        fontSize: px(15),
        fontFamily: Font.numMedium,
        fontWeight: '500',
    },
    profitValue: {
        marginTop: px(6),
        fontSize: px(11),
        fontFamily: Font.pingFangRegular,
        fontWeight: 'normal',
        color: Colors.lightBlackColor,
    },
    borderStyle: {
        borderTopLeftRadius: px(5),
        borderTopRightRadius: px(5),
    },
    section: {
        marginHorizontal: px(16),
    },
});
